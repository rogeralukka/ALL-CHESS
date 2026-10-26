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


def calculate_player_accuracy(
    move_accuracies: List[float],
    win_pct_drops: List[float]
) -> Optional[float]:
    """
    Lichess accuracy method:
    Combines a volatility-weighted arithmetic mean and a weighted harmonic mean.
    - Volatility weight w_i = max(0.5, min(10.0, win_pct_drop + 1.0))
    - Harmonic mean heavily penalizes major blunders, preventing a 99-move solid game
      with 1 catastrophic blunder from showing 98% accuracy.
    - Combined accuracy = 0.5 * weighted_arithmetic + 0.5 * weighted_harmonic
    Returns None if there are no moves (no default 80.0).
    """
    if not move_accuracies:
        return None

    weights = [max(0.5, min(10.0, drop + 1.0)) for drop in win_pct_drops]
    total_weight = sum(weights)
    if total_weight <= 0:
        return 100.0

    # 1. Weighted arithmetic mean
    weighted_arith = sum(w * a for w, a in zip(weights, move_accuracies)) / total_weight

    # 2. Weighted harmonic mean (floor accuracy at 1.0 to prevent division by zero)
    weighted_harm = total_weight / sum(w / max(1.0, a) for w, a in zip(weights, move_accuracies))

    # 3. Combined Lichess accuracy
    combined = 0.5 * weighted_arith + 0.5 * weighted_harm
    return round(min(100.0, max(0.0, combined)), 1)


def calculate_game_accuracy(moves: List[Dict[str, Any]]) -> Dict[str, Optional[float]]:
    """
    Calculates overall game accuracy for White and Black using the Lichess method.
    Returns None for a side if no moves exist.
    """
    white_accuracies: List[float] = []
    white_drops: List[float] = []
    black_accuracies: List[float] = []
    black_drops: List[float] = []

    last_eval = 0.2
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
            acc = move_accuracy(drop)
            white_accuracies.append(acc)
            white_drops.append(drop)
            # Store computed accuracy on the move dict
            m["accuracy"] = acc
        else:
            mover_before = 100.0 - white_before
            mover_after = 100.0 - white_after
            drop = max(0.0, mover_before - mover_after)
            acc = move_accuracy(drop)
            black_accuracies.append(acc)
            black_drops.append(drop)
            m["accuracy"] = acc

        last_eval = curr_eval
        last_mate = curr_mate

    return {
        "white": calculate_player_accuracy(white_accuracies, white_drops),
        "black": calculate_player_accuracy(black_accuracies, black_drops)
    }


def estimate_performance_ratings(
    accuracy: Dict[str, Optional[float]],
    white_base_rating: Optional[int] = None,
    black_base_rating: Optional[int] = None
) -> Dict[str, Optional[int]]:
    """
    Calibrated performance rating lookup table matching requirement:
      - 50% accuracy -> ~500
      - 75% accuracy -> ~1200
      - 90% accuracy -> ~2000
      - 98% accuracy -> ~2700
      - 100% accuracy -> ~2850
    Uses monotonic piecewise linear interpolation between calibrated anchors.
    """
    def acc_to_rating(acc: Optional[float], base: Optional[int]) -> Optional[int]:
        if acc is None:
            return None
        acc = max(0.0, min(100.0, acc))
        if acc <= 50.0:
            rating = 100.0 + (acc / 50.0) * 400.0
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
            return max(100, min(2900, int(round(0.7 * int_rating + 0.3 * base))))
        return max(100, min(2900, int_rating))

    return {
        "white": acc_to_rating(accuracy.get("white"), white_base_rating),
        "black": acc_to_rating(accuracy.get("black"), black_base_rating)
    }


def calculate_phase_grades_for_player(player_moves: List[Dict[str, Any]]) -> Dict[str, str]:
    """
    Calculates phase grades (opening, middlegame, tactics, endgame) by directly averaging
    pre-computed per-move accuracies over the player's moves:
      - Opening: moves with move_number <= 10
      - Middlegame: moves with 11 <= move_number <= 30
      - Endgame: moves with move_number > 30
      - Tactics: moves involving captures ('x'), checks ('+'), sacrifices, or eval swings
    """
    def grade_for_accs(accs: List[float]) -> str:
        if not accs:
            return "N/A"
        avg = sum(accs) / len(accs)
        if avg >= 85.0: return "A"
        if avg >= 72.0: return "B"
        if avg >= 60.0: return "C"
        return "D"

    opening_accs: List[float] = []
    middle_accs: List[float] = []
    endgame_accs: List[float] = []
    tactical_accs: List[float] = []

    for m in player_moves:
        acc = m.get("accuracy")
        if acc is None:
            continue

        move_num = m.get("move_number") or m.get("moveNumber") or 1
        san = m.get("san", "")
        cls_name = m.get("classification", "")

        # Phase assignment
        if move_num <= 10:
            opening_accs.append(acc)
        elif move_num <= 30:
            middle_accs.append(acc)
        else:
            endgame_accs.append(acc)

        # Tactical detection
        is_tactical = (
            "x" in san
            or "+" in san
            or "#" in san
            or cls_name in ("brilliant", "great", "miss", "blunder")
        )
        if is_tactical:
            tactical_accs.append(acc)

    return {
        "opening": grade_for_accs(opening_accs),
        "middlegame": grade_for_accs(middle_accs),
        "tactics": grade_for_accs(tactical_accs) if tactical_accs else grade_for_accs(middle_accs or opening_accs),
        "endgame": grade_for_accs(endgame_accs)
    }


def calculate_phase_grades(moves: List[Dict[str, Any]], is_user_white: bool = True) -> Dict[str, Any]:
    """
    Calculates phase grades for White and Black, and returns the user's side grades as the primary phaseGrades.
    """
    white_moves = [m for m in moves if m.get("color") == "w"]
    black_moves = [m for m in moves if m.get("color") == "b"]

    white_grades = calculate_phase_grades_for_player(white_moves)
    black_grades = calculate_phase_grades_for_player(black_moves)

    user_grades = white_grades if is_user_white else black_grades

    return {
        "user": user_grades,
        "white": white_grades,
        "black": black_grades
    }
