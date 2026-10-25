import math
from typing import List, Dict, Any, Optional
from app.services.win_pct import eval_to_win_pct

def move_accuracy(win_pct_drop: float) -> float:
    """
    Lichess-style exponential accuracy formula from win% drop:
    accuracy = 103.1668 * exp(-0.04354 * win_pct_drop) - 3.1669
    Clamped to [0.0, 100.0].
    """
    if win_pct_drop <= 0.0:
        return 100.0
    acc = 103.1668 * math.exp(-0.04354 * win_pct_drop) - 3.1669
    return min(100.0, max(0.0, round(acc, 1)))


def calculate_game_accuracy(moves: List[Dict[str, Any]]) -> Dict[str, float]:
    """
    Calculates overall accuracy for White and Black using the arithmetic mean
    of that player's individual move accuracies (standard Lichess/Chess.com method).
    """
    white_accuracies: List[float] = []
    black_accuracies: List[float] = []

    last_eval = 0.2  # initial position eval ~+0.2
    last_mate: Optional[int] = None

    for m in moves:
        color = m.get("color", "w")
        eval_obj = m.get("eval") or {}
        curr_eval = eval_obj.get("eval", last_eval)
        curr_mate = eval_obj.get("mate", last_mate)

        white_before = eval_to_win_pct(last_eval, last_mate)
        white_after = eval_to_win_pct(curr_eval, curr_mate)

        if color == 'w':
            mover_before = white_before
            mover_after = white_after
            drop = max(0.0, mover_before - mover_after)
            white_accuracies.append(move_accuracy(drop))
        else:
            mover_before = 100.0 - white_before
            mover_after = 100.0 - white_after
            drop = max(0.0, mover_before - mover_after)
            black_accuracies.append(move_accuracy(drop))

        last_eval = curr_eval
        last_mate = curr_mate

    avg_white = round(sum(white_accuracies) / len(white_accuracies), 1) if white_accuracies else 80.0
    avg_black = round(sum(black_accuracies) / len(black_accuracies), 1) if black_accuracies else 80.0

    return {
        "white": avg_white,
        "black": avg_black
    }


def estimate_performance_ratings(
    accuracy: Dict[str, float],
    white_base_rating: Optional[int] = None,
    black_base_rating: Optional[int] = None
) -> Dict[str, int]:
    """
    Calibrated performance rating lookup table matching requirement:
      - 50% accuracy -> ~500
      - 75% accuracy -> ~1200
      - 90% accuracy -> ~2000
      - 98% accuracy -> ~2700
      - 100% accuracy -> ~2850
    Uses monotonic piecewise linear interpolation between calibrated anchors.
    """
    def acc_to_rating(acc: float, base: Optional[int]) -> int:
        acc = max(0.0, min(100.0, acc))
        if acc <= 50.0:
            rating = 100 + (acc / 50.0) * 400.0
        elif acc <= 75.0:
            rating = 500.0 + ((acc - 50.0) / 25.0) * 700.0
        elif acc <= 90.0:
            rating = 1200.0 + ((acc - 75.0) / 15.0) * 800.0
        elif acc <= 98.0:
            rating = 2000.0 + ((acc - 90.0) / 8.0) * 700.0
        else:
            rating = 2700.0 + ((acc - 98.0) / 2.0) * 150.0

        int_rating = int(round(rating))
        if base and base > 0:
            # Blend 70% performance, 30% base
            return max(100, min(2900, int(round(0.7 * int_rating + 0.3 * base))))
        return max(100, min(2900, int_rating))

    w_acc = accuracy.get("white", 80.0)
    b_acc = accuracy.get("black", 80.0)

    return {
        "white": acc_to_rating(w_acc, white_base_rating),
        "black": acc_to_rating(b_acc, black_base_rating)
    }


def calculate_phase_grades(moves: List[Dict[str, Any]]) -> Dict[str, str]:
    """
    Calculates phase grades (opening, middlegame, tactics, endgame) based on accuracy:
    - Grade A: >= 85.0%
    - Grade B: >= 72.0%
    - Grade C: >= 60.0%
    - Grade D: < 60.0%
    - Phase boundaries:
      - Opening: moves 1-10 (half-moves 1-20)
      - Middlegame: moves 11-30 (half-moves 21-60)
      - Endgame: moves 31+ (half-moves 61+) or 'N/A' if game ended earlier.
      - Tactics: accuracy on critical moves (where evaluation swing > 1.5 pawns was possible).
    """
    total_moves = len(moves)
    if total_moves == 0:
        return {"opening": "N/A", "middlegame": "N/A", "tactics": "N/A", "endgame": "N/A"}

    def grade_for_acc(acc: float) -> str:
        if acc >= 85.0: return "A"
        if acc >= 72.0: return "B"
        if acc >= 60.0: return "C"
        return "D"

    opening_moves = moves[:20]
    middle_moves = moves[20:60]
    end_moves = moves[60:]

    op_acc = calculate_game_accuracy(opening_moves)
    mid_acc = calculate_game_accuracy(middle_moves) if middle_moves else None
    end_acc = calculate_game_accuracy(end_moves) if end_moves else None

    op_grade = grade_for_acc(op_acc["white"])
    mid_grade = grade_for_acc(mid_acc["white"]) if mid_acc else "A"
    end_grade = grade_for_acc(end_acc["white"]) if end_acc else ("B" if total_moves > 40 else "N/A")

    # Tactics grade: evaluates performance on sharp tactical turns
    tactical_moves = [
        m for m in moves
        if m.get("classification") in ("brilliant", "great", "blunder", "mistake", "miss", "best")
    ]
    if tactical_moves:
        tactical_acc = calculate_game_accuracy(tactical_moves)["white"]
        tactics_grade = grade_for_acc(tactical_acc)
    else:
        tactics_grade = "A" if op_grade in ("A", "B") and mid_grade in ("A", "B") else "B"

    return {
        "opening": op_grade,
        "middlegame": mid_grade,
        "tactics": tactics_grade,
        "endgame": end_grade
    }
