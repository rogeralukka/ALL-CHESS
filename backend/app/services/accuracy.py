import math
from typing import List, Dict, Any, Tuple
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
    return min(100.0, max(0.0, round(acc, 2)))

def calculate_game_accuracy(moves: List[Dict[str, Any]]) -> Dict[str, float]:
    """
    Calculates overall accuracy for White and Black moves.
    """
    white_accuracies = []
    black_accuracies = []

    last_eval = 0.0 # start at 0.0 pawns
    last_mate = None

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
    white_base_rating: int = 1200,
    black_base_rating: int = 1200
) -> Dict[str, int]:
    """
    Estimates performance rating based on accuracy and base rating.
    """
    w_acc = accuracy.get("white", 80.0)
    b_acc = accuracy.get("black", 80.0)

    w_est = int(round(white_base_rating + (w_acc - 80.0) * 25.0))
    b_est = int(round(black_base_rating + (b_acc - 80.0) * 25.0))

    return {
        "white": max(400, min(3000, w_est)),
        "black": max(400, min(3000, b_est))
    }

def calculate_phase_grades(moves: List[Dict[str, Any]]) -> Dict[str, str]:
    """
    Grades opening (moves 1-10), middlegame (11-30), endgame (31+), and tactics.
    """
    total_moves = len(moves)
    if total_moves == 0:
        return {"opening": "N/A", "middlegame": "N/A", "tactics": "N/A", "endgame": "N/A"}

    def grade_acc(acc: float) -> str:
        if acc >= 85: return "A"
        if acc >= 75: return "B"
        if acc >= 65: return "C"
        return "D"

    opening_moves = moves[:20]
    middle_moves = moves[20:60]
    end_moves = moves[60:]

    op_acc = calculate_game_accuracy(opening_moves)
    mid_acc = calculate_game_accuracy(middle_moves) if middle_moves else None
    end_acc = calculate_game_accuracy(end_moves) if end_moves else None

    op_grade = grade_acc(op_acc["white"])
    mid_grade = grade_acc(mid_acc["white"]) if mid_acc else "A"
    end_grade = grade_acc(end_acc["white"]) if end_acc else ("B" if total_moves > 40 else "N/A")
    tactics_grade = "A" if op_grade in ["A", "B"] and mid_grade in ["A", "B"] else "B"

    return {
        "opening": op_grade,
        "middlegame": mid_grade,
        "tactics": tactics_grade,
        "endgame": end_grade
    }
