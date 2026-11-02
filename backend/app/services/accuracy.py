import math
from typing import List, Dict, Any, Optional, Tuple
from app.services.win_pct import eval_to_win_pct
from app.config import settings

def move_accuracy(win_pct_drop: float, method: str = "chesscom") -> float:
    """
    Computes per-move accuracy from win% drop.
    Supports:
      - 'chesscom': Softer power-exponential curve (default)
        acc = 100 * exp(- (win_pct_drop / scale) ** power)
      - 'lichess': Classical Lichess exponential formula
        acc = 103.1668 * exp(-0.04354 * win_pct_drop) - 3.1669
    Clamped to [0.0, 100.0].
    """
    if win_pct_drop <= 0.0:
        return 100.0

    if method == "lichess":
        acc = 103.1668 * math.exp(-0.04354 * win_pct_drop) - 3.1669
        return min(100.0, max(0.0, round(acc, 1)))

    # Chess.com CAPS-style soft curve
    scale = getattr(settings, "accuracy_chesscom_scale", 8.0)
    power = getattr(settings, "accuracy_chesscom_power", 1.1)
    
    acc = 100.0 * math.exp(-((win_pct_drop / scale) ** power))
    return min(100.0, max(0.0, round(acc, 1)))


def calculate_player_accuracy(
    move_accuracies: List[float],
    win_pct_drops: List[float],
    method: str = "chesscom"
) -> Optional[float]:
    """
    Calculates overall player accuracy for a game.
    - 'chesscom': Softly weighted arithmetic mean that does NOT let 2-3 blunders sink the whole game.
    - 'lichess': Combines volatility-weighted arithmetic and harmonic mean.
    Returns None if there are no moves.
    """
    if not move_accuracies:
        return None

    if method == "chesscom":
        w_power = getattr(settings, "accuracy_chesscom_weight_power", 0.4)
        weights = [(1.0 + drop / 5.0) ** w_power for drop in win_pct_drops]
        total_weight = sum(weights)
        if total_weight <= 0:
            return 100.0
        weighted_avg = sum(w * a for w, a in zip(weights, move_accuracies)) / total_weight
        return round(min(100.0, max(0.0, weighted_avg)), 1)

    # Lichess harmonic + arithmetic mean
    weights = [max(0.5, min(10.0, drop + 1.0)) for drop in win_pct_drops]
    total_weight = sum(weights)
    if total_weight <= 0:
        return 100.0

    weighted_arith = sum(w * a for w, a in zip(weights, move_accuracies)) / total_weight
    weighted_harm = total_weight / sum(w / max(1.0, a) for w, a in zip(weights, move_accuracies))
    combined = 0.5 * weighted_arith + 0.5 * weighted_harm
    return round(min(100.0, max(0.0, combined)), 1)


def calculate_game_accuracy(
    moves: List[Dict[str, Any]],
    method: str = "chesscom"
) -> Dict[str, Optional[float]]:
    """
    Calculates overall game accuracy for White and Black.
    Defaults to 'chesscom' method.
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
            drop = 0.0 if m.get("classification") == "book" else max(0.0, mover_before - mover_after)
            acc = move_accuracy(drop, method=method)
            white_accuracies.append(acc)
            white_drops.append(drop)
            m["accuracy"] = acc
        else:
            mover_before = 100.0 - white_before
            mover_after = 100.0 - white_after
            drop = 0.0 if m.get("classification") == "book" else max(0.0, mover_before - mover_after)
            acc = move_accuracy(drop, method=method)
            black_accuracies.append(acc)
            black_drops.append(drop)
            m["accuracy"] = acc

        last_eval = curr_eval
        last_mate = curr_mate

    return {
        "white": calculate_player_accuracy(white_accuracies, white_drops, method=method),
        "black": calculate_player_accuracy(black_accuracies, black_drops, method=method)
    }


# Chess.com calibrated accuracy-to-rating monotone anchors:
# Data points: 53.0 -> 150, 63.9 -> 650, 68.0 -> 900, 72.1 -> 1200, 75.3 -> 1300, 81.3 -> 1500
RATING_ACCURACY_ANCHORS: list[tuple[float, int]] = [
    (0.0, 100),
    (52.0, 100),
    (53.0, 150),
    (63.9, 650),
    (68.0, 900),
    (72.1, 1200),
    (75.3, 1300),
    (81.3, 1500),
    (88.0, 2000),
    (94.0, 2500),
    (98.0, 2800),
    (100.0, 3000),
]


def estimate_game_rating(accuracy: Optional[float]) -> Optional[int]:
    """
    Monotone interpolation of game accuracy to estimated performance rating,
    matching Chess.com calibration data points:
      53.0 -> 150
      63.9 -> 650
      68.0 -> 900
      72.1 -> 1200
      75.3 -> 1300
      81.3 -> 1500
    Clamped to [100, 3000]. Extrapolates gently above 81.3.
    """
    if accuracy is None:
        return None
    acc = max(0.0, min(100.0, float(accuracy)))

    if acc <= RATING_ACCURACY_ANCHORS[0][0]:
        return RATING_ACCURACY_ANCHORS[0][1]
    if acc >= RATING_ACCURACY_ANCHORS[-1][0]:
        return RATING_ACCURACY_ANCHORS[-1][1]

    for i in range(len(RATING_ACCURACY_ANCHORS) - 1):
        a0, r0 = RATING_ACCURACY_ANCHORS[i]
        a1, r1 = RATING_ACCURACY_ANCHORS[i + 1]
        if a0 <= acc <= a1:
            t = (acc - a0) / (a1 - a0)
            rating = r0 + t * (r1 - r0)
            return max(100, min(3000, int(round(rating))))

    return 1500


def estimate_performance_ratings(
    accuracy: Dict[str, Optional[float]],
    white_base_rating: Optional[int] = None,
    black_base_rating: Optional[int] = None
) -> Dict[str, Optional[int]]:
    """
    Maps game accuracy to Chess.com monotone estimated rating.
    """
    return {
        "white": estimate_game_rating(accuracy.get("white")),
        "black": estimate_game_rating(accuracy.get("black")),
    }


PIECE_POINTS = {"q": 9, "r": 5, "b": 3, "n": 3}


def non_pawn_material(fen: str) -> Dict[str, int]:
    """Non-pawn material points for each side in a FEN position."""
    board_part = fen.split(" ")[0] if fen else ""
    w = 0
    b = 0
    queens = 0
    for ch in board_part:
        pts = PIECE_POINTS.get(ch.lower(), 0)
        if pts:
            if ch.isupper():
                w += pts
            else:
                b += pts
            if ch.lower() == "q":
                queens += 1
    return {"w": w, "b": b, "queens": queens}


def last_book_index(moves: List[Dict[str, Any]]) -> int:
    """Half-move index of the last book move, or -1."""
    last = -1
    for i, m in enumerate(moves):
        if m.get("classification") == "book":
            last = i
    return last


def endgame_start_index(moves: List[Dict[str, Any]]) -> int:
    """Half-move index where the endgame begins (both sides <= 13 non-pawn material points)."""
    for i, m in enumerate(moves):
        fen = m.get("fen")
        if fen:
            mat = non_pawn_material(fen)
            if mat["w"] <= 13 and mat["b"] <= 13:
                return i + 1
    return len(moves)


def compute_phase_boundaries(moves: List[Dict[str, Any]]) -> Tuple[int, int]:
    """
    Computes openingEnd and endgameFrom half-move indices aligned with frontend phases.ts:
      - Opening: start to 6 half-moves after last book move, clamped to [12, 24] and <= endgameFrom.
      - Endgame: first position where both sides have <= 13 non-pawn material points (Q=9, R=5, B=3, N=3).
      - Middlegame: everything in between.
    """
    endgame_from = endgame_start_index(moves)
    last_book = last_book_index(moves)
    opening_end = min(max(last_book + 1 + 6, 12), 24, endgame_from)
    return opening_end, endgame_from


def calculate_phase_grades_for_player(
    player_moves: List[Tuple[int, Dict[str, Any]]],
    opening_end: int,
    endgame_from: int
) -> Dict[str, str]:
    """
    Calculates phase grades for a player based on half-move index boundaries:
      - Opening: ply_idx < opening_end
      - Middlegame: opening_end <= ply_idx < endgame_from
      - Endgame: ply_idx >= endgame_from
      - Tactics: moves involving captures ('x'), checks ('+'), mates ('#'), or tactical swings
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

    for ply_idx, m in player_moves:
        acc = m.get("accuracy")
        if acc is None:
            continue

        san = m.get("san", "")
        cls_name = m.get("classification", "")

        if ply_idx < opening_end:
            opening_accs.append(acc)
        elif ply_idx < endgame_from:
            middle_accs.append(acc)
        else:
            endgame_accs.append(acc)

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
    Calculates phase grades for White and Black using material & book-based phase boundaries.
    Returns:
      {
        "white": {opening, middlegame, tactics, endgame},
        "black": {opening, middlegame, tactics, endgame},
        "user":  {...}
      }
    """
    opening_end, endgame_from = compute_phase_boundaries(moves)

    white_moves = [(i, m) for i, m in enumerate(moves) if m.get("color") == "w"]
    black_moves = [(i, m) for i, m in enumerate(moves) if m.get("color") == "b"]

    white_grades = calculate_phase_grades_for_player(white_moves, opening_end, endgame_from)
    black_grades = calculate_phase_grades_for_player(black_moves, opening_end, endgame_from)

    user_grades = white_grades if is_user_white else black_grades

    return {
        "white": white_grades,
        "black": black_grades,
        "user": user_grades
    }
