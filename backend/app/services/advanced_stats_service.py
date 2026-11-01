"""
Advanced Stats Service.

Implements calculation algorithms for:
  - Advanced Overview: rating, delta, daily history, game outcomes, and 4 area scores.
  - Advanced Openings: opening accuracy, mistakes, book moves, opening breakdown.
  - Advanced Tactics: 9 tactical motifs (found vs allowed) using python-chess.
  - Advanced Endgames: conversion win% (better/equal/worse) & accuracy by material type.
  - Advanced Strategy: middlegame accuracies under documented heuristics.
  - Brilliant Moves: search and extract brilliant moves played by the user.

Does not modify classifier thresholds or win_pct.py.
"""

from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime, timezone, timedelta
import chess
from app.models.game import Game as GameModel
from app.services.accuracy import compute_phase_boundaries
from app.services.classifier import is_material_sacrifice
from app.services.win_pct import eval_to_win_pct


# -----------------------------------------------------------------------------
# Grade Scale & Peer Benchmarks
# -----------------------------------------------------------------------------

# Grade thresholds: returns 'A' | 'B' | 'C' | 'D' | 'E'
# Aligned with calculate_phase_grades (85, 72, 60) extended with E (<48).
GRADE_THRESHOLDS = {
    "accuracy": [(85.0, "A"), (72.0, "B"), (60.0, "C"), (48.0, "D"), (0.0, "E")],
    # For mistakes: lower is better!
    "mistakes": [(0.6, "A"), (1.0, "B"), (1.5, "C"), (2.2, "D"), (999.0, "E")],
    "book_moves": [(4.0, "A"), (3.0, "B"), (2.0, "C"), (1.0, "D"), (0.0, "E")],
    "tactics": [(85.0, "A"), (70.0, "B"), (55.0, "C"), (40.0, "D"), (0.0, "E")],
    "win_pct": [(75.0, "A"), (60.0, "B"), (45.0, "C"), (30.0, "D"), (0.0, "E")],
}


def grade_for(metric_type: str, value: Optional[float]) -> Optional[str]:
    """
    Returns A | B | C | D | E for a metric value based on predefined thresholds.
    Returns None if value is None.
    """
    if value is None:
        return None
    thresholds = GRADE_THRESHOLDS.get(metric_type, GRADE_THRESHOLDS["accuracy"])
    if metric_type == "mistakes":
        # Lower is better
        for cutoff, grade in thresholds:
            if value <= cutoff:
                return grade
        return "E"
    else:
        # Higher is better
        for cutoff, grade in thresholds:
            if value >= cutoff:
                return grade
        return "E"


# Estimated peer benchmarks by rating band.
# Band keys: "<1000", "1000-1399", "1400-1799", "1800-2199", "2200+".
ESTIMATED_PEER_BENCHMARKS = {
    "<1000": {
        "opening_accuracy": 76.0,
        "avg_opening_mistakes": 2.2,
        "avg_book_moves": 1.5,
        "tactics": {
            "checkmates": 65.0,
            "freePieces": 60.0,
            "forks": 50.0,
            "pins": 45.0,
            "discoveries": 40.0,
            "removesDefender": 35.0,
            "brilliantSacrifices": 20.0,
            "trappedPieces": 35.0,
            "otherTactics": 45.0,
        },
        "endgames": {
            "win_pct_better": 72.0,
            "win_pct_equal": 46.0,
            "win_pct_worse": 12.0,
            "accuracy_overall": 68.0,
            "accuracy_rook_and_pawn": 65.0,
            "accuracy_king_and_pawn": 70.0,
            "accuracy_queen": 62.0,
            "accuracy_other": 64.0,
        },
        "strategy": {
            "overall": 70.0,
            "pawn_structure": 67.0,
            "attacking": 70.0,
            "defending": 64.0,
            "active_piece": 68.0,
            "space_advantage": 67.0,
        },
    },
    "1000-1399": {
        "opening_accuracy": 82.5,
        "avg_opening_mistakes": 1.5,
        "avg_book_moves": 2.5,
        "tactics": {
            "checkmates": 75.0,
            "freePieces": 72.0,
            "forks": 62.0,
            "pins": 56.0,
            "discoveries": 52.0,
            "removesDefender": 46.0,
            "brilliantSacrifices": 32.0,
            "trappedPieces": 48.0,
            "otherTactics": 58.0,
        },
        "endgames": {
            "win_pct_better": 80.0,
            "win_pct_equal": 49.0,
            "win_pct_worse": 15.0,
            "accuracy_overall": 75.0,
            "accuracy_rook_and_pawn": 72.0,
            "accuracy_king_and_pawn": 78.0,
            "accuracy_queen": 70.0,
            "accuracy_other": 72.0,
        },
        "strategy": {
            "overall": 76.0,
            "pawn_structure": 74.0,
            "attacking": 78.0,
            "defending": 71.0,
            "active_piece": 75.0,
            "space_advantage": 74.0,
        },
    },
    "1400-1799": {
        "opening_accuracy": 89.0,
        "avg_opening_mistakes": 0.9,
        "avg_book_moves": 3.8,
        "tactics": {
            "checkmates": 85.0,
            "freePieces": 82.0,
            "forks": 74.0,
            "pins": 68.0,
            "discoveries": 66.0,
            "removesDefender": 58.0,
            "brilliantSacrifices": 48.0,
            "trappedPieces": 62.0,
            "otherTactics": 70.0,
        },
        "endgames": {
            "win_pct_better": 88.0,
            "win_pct_equal": 51.0,
            "win_pct_worse": 17.0,
            "accuracy_overall": 82.0,
            "accuracy_rook_and_pawn": 80.0,
            "accuracy_king_and_pawn": 85.0,
            "accuracy_queen": 78.0,
            "accuracy_other": 79.0,
        },
        "strategy": {
            "overall": 82.0,
            "pawn_structure": 80.0,
            "attacking": 85.0,
            "defending": 78.0,
            "active_piece": 81.0,
            "space_advantage": 81.0,
        },
    },
    "1800-2199": {
        "opening_accuracy": 93.0,
        "avg_opening_mistakes": 0.5,
        "avg_book_moves": 5.2,
        "tactics": {
            "checkmates": 92.0,
            "freePieces": 90.0,
            "forks": 84.0,
            "pins": 80.0,
            "discoveries": 78.0,
            "removesDefender": 72.0,
            "brilliantSacrifices": 65.0,
            "trappedPieces": 75.0,
            "otherTactics": 80.0,
        },
        "endgames": {
            "win_pct_better": 93.0,
            "win_pct_equal": 53.0,
            "win_pct_worse": 20.0,
            "accuracy_overall": 88.0,
            "accuracy_rook_and_pawn": 86.0,
            "accuracy_king_and_pawn": 90.0,
            "accuracy_queen": 84.0,
            "accuracy_other": 85.0,
        },
        "strategy": {
            "overall": 87.0,
            "pawn_structure": 86.0,
            "attacking": 90.0,
            "defending": 84.0,
            "active_piece": 87.0,
            "space_advantage": 86.0,
        },
    },
    "2200+": {
        "opening_accuracy": 96.0,
        "avg_opening_mistakes": 0.3,
        "avg_book_moves": 7.0,
        "tactics": {
            "checkmates": 97.0,
            "freePieces": 96.0,
            "forks": 92.0,
            "pins": 88.0,
            "discoveries": 86.0,
            "removesDefender": 82.0,
            "brilliantSacrifices": 78.0,
            "trappedPieces": 85.0,
            "otherTactics": 88.0,
        },
        "endgames": {
            "win_pct_better": 97.0,
            "win_pct_equal": 55.0,
            "win_pct_worse": 24.0,
            "accuracy_overall": 92.0,
            "accuracy_rook_and_pawn": 91.0,
            "accuracy_king_and_pawn": 94.0,
            "accuracy_queen": 89.0,
            "accuracy_other": 90.0,
        },
        "strategy": {
            "overall": 92.0,
            "pawn_structure": 91.0,
            "attacking": 94.0,
            "defending": 89.0,
            "active_piece": 91.0,
            "space_advantage": 91.0,
        },
    },
}


def get_peer_benchmarks(rating: Optional[int]) -> Dict[str, Any]:
    """Retrieves peer benchmark dictionary for the specified user rating."""
    r = rating if rating and rating > 0 else 1400
    if r < 1000:
        return ESTIMATED_PEER_BENCHMARKS["<1000"]
    elif r < 1400:
        return ESTIMATED_PEER_BENCHMARKS["1000-1399"]
    elif r < 1800:
        return ESTIMATED_PEER_BENCHMARKS["1400-1799"]
    elif r < 2200:
        return ESTIMATED_PEER_BENCHMARKS["1800-2199"]
    return ESTIMATED_PEER_BENCHMARKS["2200+"]


def accuracy_to_score(avg_acc: Optional[float], games_count: int, min_games: int = 5) -> Optional[int]:
    """
    Linear formula mapping accuracy (0-100) to rating-like score:
      score = round(400 + (avg_acc * 15))
    Clamped to [100, 3000].
    Returns None if fewer than min_games analysed games are available.
    """
    if avg_acc is None or games_count < min_games:
        return None
    score = round(400.0 + (avg_acc * 15.0))
    return max(100, min(3000, score))


# -----------------------------------------------------------------------------
# Date & Game Filtering Helpers
# -----------------------------------------------------------------------------

def parse_iso_datetime(date_str: Optional[str]) -> Optional[datetime]:
    if not date_str:
        return None
    try:
        dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt
    except Exception:
        return None


def filter_games(
    games: List[GameModel],
    mode: str = "all",
    date_range: str = "90d",
    color: str = "all"
) -> List[GameModel]:
    """Filters games by mode (speed), date range, and player color."""
    now = datetime.now(timezone.utc)
    cutoff: Optional[datetime] = None
    if date_range == "7d":
        cutoff = now - timedelta(days=7)
    elif date_range == "30d":
        cutoff = now - timedelta(days=30)
    elif date_range == "90d":
        cutoff = now - timedelta(days=90)
    elif date_range == "1y":
        cutoff = now - timedelta(days=365)

    filtered: List[GameModel] = []
    for g in games:
        # 1. Mode filter
        if mode != "all":
            g_speed = (g.speed or "").lower()
            if g_speed != mode.lower():
                continue

        # 2. Color filter
        if color == "white" and not g.is_user_white:
            continue
        if color == "black" and g.is_user_white:
            continue

        # 3. Date range filter
        if cutoff:
            g_dt = parse_iso_datetime(g.date)
            if g_dt and g_dt < cutoff:
                continue

        filtered.append(g)

    return filtered


def is_game_analysed(game: GameModel) -> bool:
    """Checks whether the game has move evaluations / accuracy."""
    if game.accuracy and isinstance(game.accuracy, dict):
        if game.accuracy.get("white") is not None or game.accuracy.get("black") is not None:
            return True
    moves = game.moves or []
    return any(isinstance(m.get("eval"), dict) for m in moves)


def get_user_rating(game: GameModel) -> Optional[int]:
    """Gets the user rating from a game object."""
    r = game.white.get("rating") if game.is_user_white else game.black.get("rating")
    return int(r) if r and isinstance(r, (int, float)) and r > 0 else None


def get_opponent_info(game: GameModel) -> Tuple[str, int]:
    """Returns (opponent_username, opponent_rating)."""
    opp = game.black if game.is_user_white else game.white
    name = opp.get("username", "Opponent") if isinstance(opp, dict) else "Opponent"
    rating = opp.get("rating", 1200) if isinstance(opp, dict) else 1200
    return name, int(rating) if isinstance(rating, (int, float)) else 1200


def get_game_user_moves(game: GameModel) -> List[Tuple[int, Dict[str, Any]]]:
    """Returns list of (half_move_index, move_dict) made by the current user."""
    user_col = "w" if game.is_user_white else "b"
    return [(i, m) for i, m in enumerate(game.moves or []) if m.get("color") == user_col]


def get_move_accuracy(m: Dict[str, Any]) -> Optional[float]:
    """Extracts move accuracy value if present."""
    acc = m.get("accuracy")
    if isinstance(acc, (int, float)):
        return float(acc)
    return None


# -----------------------------------------------------------------------------
# 1. Overview
# -----------------------------------------------------------------------------

def compute_advanced_overview(
    games: List[GameModel],
    user_rating: Optional[int]
) -> Dict[str, Any]:
    """Computes Advanced Overview payload."""
    # Sort games by date ascending
    sorted_games = sorted(games, key=lambda g: g.date or "")

    total_games = len(sorted_games)
    wins = 0
    draws = 0
    losses = 0

    # Build daily history: last known user rating for each day with games
    history_by_date: Dict[str, int] = {}
    current_r = user_rating or 1200

    for g in sorted_games:
        r = get_user_rating(g)
        if r:
            current_r = r
        d_str = g.date[:10] if g.date else ""
        if d_str and current_r:
            history_by_date[d_str] = current_r

        res = g.result
        is_w = g.is_user_white
        if (is_w and res == "1-0") or (not is_w and res == "0-1"):
            wins += 1
        elif res in ("1/2-1/2", "0.5-0.5", "draw"):
            draws += 1
        elif (is_w and res == "0-1") or (not is_w and res == "1-0"):
            losses += 1

    win_pct = round((wins / total_games) * 100.0, 1) if total_games else 0.0
    draw_pct = round((draws / total_games) * 100.0, 1) if total_games else 0.0
    loss_pct = round((losses / total_games) * 100.0, 1) if total_games else 0.0

    history_points = [
        {"date": d, "rating": r}
        for d, r in sorted(history_by_date.items())
    ]

    latest_rating = history_points[-1]["rating"] if history_points else (user_rating or 1200)
    if len(history_points) >= 2:
        rating_delta = history_points[-1]["rating"] - history_points[0]["rating"]
    else:
        rating_delta = 0

    # Scores: openings, tactics, strategy, endgames
    analysed_games = [g for g in sorted_games if is_game_analysed(g)]

    op_accs: List[float] = []
    tac_accs: List[float] = []
    strat_accs: List[float] = []
    end_accs: List[float] = []

    op_game_count = 0
    tac_game_count = 0
    strat_game_count = 0
    end_game_count = 0

    for g in analysed_games:
        moves = g.moves or []
        op_end, end_from = compute_phase_boundaries(moves)
        user_col = "w" if g.is_user_white else "b"

        has_op = False
        has_tac = False
        has_strat = False
        has_end = False

        for i, m in enumerate(moves):
            if m.get("color") != user_col:
                continue
            acc = get_move_accuracy(m)
            if acc is None:
                continue

            san = m.get("san", "")
            cls_name = m.get("classification", "")

            if i < op_end:
                op_accs.append(acc)
                has_op = True
            elif i < end_from:
                strat_accs.append(acc)
                has_strat = True
            else:
                end_accs.append(acc)
                has_end = True

            is_tactical = (
                "x" in san or "+" in san or "#" in san or
                cls_name in ("brilliant", "great", "miss", "blunder")
            )
            if is_tactical:
                tac_accs.append(acc)
                has_tac = True

        if has_op: op_game_count += 1
        if has_tac: tac_game_count += 1
        if has_strat: strat_game_count += 1
        if has_end: end_game_count += 1

    avg_op = (sum(op_accs) / len(op_accs)) if op_accs else None
    avg_tac = (sum(tac_accs) / len(tac_accs)) if tac_accs else None
    avg_strat = (sum(strat_accs) / len(strat_accs)) if strat_accs else None
    avg_end = (sum(end_accs) / len(end_accs)) if end_accs else None

    return {
        "rating": latest_rating,
        "ratingDelta": rating_delta,
        "history": history_points,
        "games": total_games,
        "wins": wins,
        "draws": draws,
        "losses": losses,
        "winPct": win_pct,
        "drawPct": draw_pct,
        "lossPct": loss_pct,
        "scores": {
            "openings": accuracy_to_score(avg_op, op_game_count, min_games=5),
            "tactics": accuracy_to_score(avg_tac, tac_game_count, min_games=5),
            "strategy": accuracy_to_score(avg_strat, strat_game_count, min_games=5),
            "endgames": accuracy_to_score(avg_end, end_game_count, min_games=5),
        }
    }


# -----------------------------------------------------------------------------
# 2. Openings
# -----------------------------------------------------------------------------

def compute_advanced_openings(
    games: List[GameModel],
    user_rating: Optional[int],
    color_filter: str = "all"
) -> Dict[str, Any]:
    """Computes Advanced Openings statistics."""
    peers = get_peer_benchmarks(user_rating)

    # Filter games for opening metrics: user opening moves
    analysed_games = [g for g in games if is_game_analysed(g)]

    total_op_accs: List[float] = []
    total_mistakes = 0
    total_book_moves = 0
    games_with_opening = 0

    daily_accs: Dict[str, List[float]] = {}
    daily_mistakes: Dict[str, List[int]] = {}
    daily_books: Dict[str, List[int]] = {}

    for g in analysed_games:
        moves = g.moves or []
        op_end, _ = compute_phase_boundaries(moves)
        user_col = "w" if g.is_user_white else "b"

        g_accs = []
        g_mistakes = 0
        g_books = 0

        for i, m in enumerate(moves):
            if m.get("color") != user_col or i >= op_end:
                continue

            acc = get_move_accuracy(m)
            if acc is not None:
                g_accs.append(acc)

            cls_name = m.get("classification")
            if cls_name in ("inaccuracy", "mistake", "miss", "blunder"):
                g_mistakes += 1
            elif cls_name == "book":
                g_books += 1

        if g_accs:
            games_with_opening += 1
            total_op_accs.extend(g_accs)
            total_mistakes += g_mistakes
            total_book_moves += g_books

            d_str = g.date[:10] if g.date else ""
            if d_str:
                daily_accs.setdefault(d_str, []).append(sum(g_accs) / len(g_accs))
                daily_mistakes.setdefault(d_str, []).append(g_mistakes)
                daily_books.setdefault(d_str, []).append(g_books)

    val_acc = round(sum(total_op_accs) / len(total_op_accs), 1) if total_op_accs else None
    val_mistakes = round(total_mistakes / games_with_opening, 1) if games_with_opening else None
    val_books = round(total_book_moves / games_with_opening, 1) if games_with_opening else None

    # Time series
    series_acc = [
        {"date": d, "value": round(sum(vals) / len(vals), 1)}
        for d, vals in sorted(daily_accs.items())
    ]
    series_mistakes = [
        {"date": d, "value": round(sum(vals) / len(vals), 1)}
        for d, vals in sorted(daily_mistakes.items())
    ]
    series_books = [
        {"date": d, "value": round(sum(vals) / len(vals), 1)}
        for d, vals in sorted(daily_books.items())
    ]

    # byOpening breakdown: group by opening name (and eco)
    openings_map: Dict[str, Dict[str, Any]] = {}
    for g in games:
        op = g.opening or {}
        name = op.get("name", "Unknown Opening")
        eco = op.get("eco", "A00")

        if name not in openings_map:
            openings_map[name] = {
                "name": name,
                "eco": eco,
                "games": 0,
                "wins": 0,
                "accuracies": []
            }

        openings_map[name]["games"] += 1
        is_w = g.is_user_white
        res = g.result
        if (is_w and res == "1-0") or (not is_w and res == "0-1"):
            openings_map[name]["wins"] += 1

        if is_game_analysed(g):
            moves = g.moves or []
            op_end, _ = compute_phase_boundaries(moves)
            user_col = "w" if is_w else "b"
            g_accs = [
                get_move_accuracy(m) for i, m in enumerate(moves)
                if m.get("color") == user_col and i < op_end and get_move_accuracy(m) is not None
            ]
            if g_accs:
                openings_map[name]["accuracies"].append(sum(g_accs) / len(g_accs))

    by_opening_list = []
    peer_op_acc = peers["opening_accuracy"]
    for name, data in sorted(openings_map.items(), key=lambda x: x[1]["games"], reverse=True):
        cnt = data["games"]
        win_p = round((data["wins"] / cnt) * 100.0, 1) if cnt else 0.0
        accs = data["accuracies"]
        avg_a = round(sum(accs) / len(accs), 1) if accs else None
        by_opening_list.append({
            "name": name,
            "eco": data["eco"],
            "games": cnt,
            "winPct": win_p,
            "accuracy": avg_a,
            "peers": peer_op_acc,
            "grade": grade_for("accuracy", avg_a) if avg_a is not None else None
        })

    return {
        "openingAccuracy": {
            "value": val_acc,
            "peers": peers["opening_accuracy"],
            "grade": grade_for("accuracy", val_acc),
            "series": series_acc
        },
        "avgOpeningMistakes": {
            "value": val_mistakes,
            "peers": peers["avg_opening_mistakes"],
            "grade": grade_for("mistakes", val_mistakes),
            "series": series_mistakes
        },
        "avgBookMoves": {
            "value": val_books,
            "peers": peers["avg_book_moves"],
            "grade": grade_for("book_moves", val_books),
            "series": series_books
        },
        "byOpening": by_opening_list,
        "peersEstimated": True
    }


# -----------------------------------------------------------------------------
# 3. Tactics
# -----------------------------------------------------------------------------

TACTIC_KEYS = [
    ("checkmates", "Checkmates"),
    ("freePieces", "Free Pieces"),
    ("forks", "Forks"),
    ("pins", "Pins"),
    ("discoveries", "Discoveries"),
    ("removesDefender", "Removes Defender"),
    ("brilliantSacrifices", "Brilliant Sacrifices"),
    ("trappedPieces", "Trapped Pieces"),
    ("otherTactics", "Other Tactics"),
]

PIECE_VALUES = {
    chess.PAWN: 1,
    chess.KNIGHT: 3,
    chess.BISHOP: 3,
    chess.ROOK: 5,
    chess.QUEEN: 9,
    chess.KING: 100,
}


def is_fork(board_after: chess.Board, moved_piece_sq: chess.Square) -> bool:
    """
    Checks if the piece on moved_piece_sq attacks two or more higher/equal-value
    pieces or a king plus at least one piece.
    """
    piece = board_after.piece_at(moved_piece_sq)
    if not piece:
        return False
    opp_color = not piece.color
    moved_val = PIECE_VALUES.get(piece.piece_type, 1)

    attacks = board_after.attacks(moved_piece_sq)
    targets = []
    has_king = False
    for sq in attacks:
        p = board_after.piece_at(sq)
        if p and p.color == opp_color:
            if p.piece_type == chess.KING:
                has_king = True
            elif PIECE_VALUES.get(p.piece_type, 0) >= moved_val:
                targets.append(p)

    if has_king and len(targets) >= 1:
        return True
    return len(targets) >= 2


def is_pin(board_before: chess.Board, board_after: chess.Board, move: chess.Move) -> bool:
    """Checks if the move created a new pin on an enemy piece to King or Queen."""
    piece = board_before.piece_at(move.from_square)
    if not piece or piece.piece_type not in (chess.BISHOP, chess.ROOK, chess.QUEEN):
        return False
    opp_color = not board_before.turn

    # Absolute pin to King:
    for sq in chess.SQUARES:
        p = board_after.piece_at(sq)
        if p and p.color == opp_color and p.piece_type != chess.KING:
            if board_after.is_pinned(opp_color, sq) and not board_before.is_pinned(opp_color, sq):
                return True

    # Relative pin to Queen along ray from moved piece:
    to_sq = move.to_square
    queen_sqs = board_after.pieces(chess.QUEEN, opp_color)
    if queen_sqs:
        for q_sq in queen_sqs:
            # Check ray alignment
            between = chess.between(to_sq, q_sq)
            pinned_pieces = [board_after.piece_at(s) for s in between if board_after.piece_at(s)]
            if len(pinned_pieces) == 1 and pinned_pieces[0].color == opp_color:
                return True

    return False


def is_discovered_attack(board_before: chess.Board, move: chess.Move) -> bool:
    """Checks if moving a piece unmasks a friendly slider's attack on an enemy piece/king."""
    friendly_color = board_before.turn
    opp_color = not friendly_color
    from_sq = move.from_square

    board_copy = board_before.copy()
    moving_p = board_copy.remove_piece_at(from_sq)
    if not moving_p:
        return False

    sliders = (
        board_copy.pieces(chess.BISHOP, friendly_color) |
        board_copy.pieces(chess.ROOK, friendly_color) |
        board_copy.pieces(chess.QUEEN, friendly_color)
    )

    for slider_sq in sliders:
        if from_sq in board_copy.attacks(slider_sq):
            new_attacks = board_copy.attacks(slider_sq) - board_before.attacks(slider_sq)
            for target_sq in new_attacks:
                tgt = board_copy.piece_at(target_sq)
                if tgt and tgt.color == opp_color:
                    return True
    return False


def is_removes_defender(board_before: chess.Board, move: chess.Move) -> bool:
    """Checks if move captures a defender of another attacked enemy piece."""
    if not board_before.is_capture(move):
        return False
    captured_piece = board_before.piece_at(move.to_square)
    if not captured_piece:
        return False

    enemy_color = captured_piece.color
    friendly_color = not enemy_color

    defended_squares = board_before.attacks(move.to_square)
    for sq in defended_squares:
        p = board_before.piece_at(sq)
        if p and p.color == enemy_color and p.piece_type != chess.KING:
            if board_before.is_attacked_by(friendly_color, sq):
                return True
    return False


def is_free_piece(board_before: chess.Board, move: chess.Move) -> bool:
    """Checks if move captures an undefended enemy piece."""
    if not board_before.is_capture(move):
        return False
    captured_piece = board_before.piece_at(move.to_square)
    if not captured_piece:
        return False
    # If opponent does not defend the square:
    if not board_before.is_attacked_by(captured_piece.color, move.to_square):
        return True
    return False


def is_trapped_piece(board_after: chess.Board, moved_piece_sq: chess.Square) -> bool:
    """Checks if an enemy major or minor piece is attacked and has 0 safe escape squares."""
    friendly_color = not board_after.turn
    enemy_color = board_after.turn

    for sq in chess.SQUARES:
        piece = board_after.piece_at(sq)
        if piece and piece.color == enemy_color and piece.piece_type in (chess.KNIGHT, chess.BISHOP, chess.ROOK, chess.QUEEN):
            if board_after.is_attacked_by(friendly_color, sq):
                safe_moves = 0
                for m in board_after.legal_moves:
                    if m.from_square == sq:
                        if not board_after.is_attacked_by(friendly_color, m.to_square):
                            safe_moves += 1
                if safe_moves == 0:
                    return True
    return False


def classify_tactical_opportunity(
    board: chess.Board,
    best_move: chess.Move,
    eval_val: float,
    mate_val: Optional[int]
) -> Optional[str]:
    """
    Conservative detector for tactical opportunities using python-chess.

    Limits / assumptions:
      - Conservative heuristic: classifies the top engine line when eval indicates
        advantage (eval >= +1.5 for side to move or winning mate in N) or when
        delivering checkmate / winning captures / forks / pins / sacrifices.
      - Piece sacrifice uses is_material_sacrifice from the classifier.
      - Trapped piece detection checks attacked minor/major pieces with 0 safe moves.
    """
    # Side to move perspective:
    turn_eval = eval_val if board.turn == chess.WHITE else -eval_val
    turn_mate = mate_val if board.turn == chess.WHITE else (-mate_val if mate_val is not None else None)

    is_winning_eval = (turn_mate is not None and turn_mate > 0) or turn_eval >= 1.5

    # 1. Checkmates
    board_after = board.copy()
    try:
        board_after.push(best_move)
    except Exception:
        return None

    if board_after.is_checkmate():
        return "checkmates"

    # 2. Brilliant sacrifices
    try:
        if is_material_sacrifice(board, best_move) and (turn_eval >= 0.5 or (turn_mate and turn_mate > 0)):
            return "brilliantSacrifices"
    except Exception:
        pass

    # 3. Forks
    if is_fork(board_after, best_move.to_square):
        return "forks"

    # 4. Pins
    if is_pin(board, board_after, best_move):
        return "pins"

    # 5. Discoveries
    if is_discovered_attack(board, best_move):
        return "discoveries"

    # 6. Removes defender
    if is_removes_defender(board, best_move):
        return "removesDefender"

    # 7. Free pieces (undefended piece capture)
    if is_free_piece(board, best_move):
        return "freePieces"

    # 8. Trapped pieces
    if is_trapped_piece(board_after, best_move.to_square):
        return "trappedPieces"

    # 9. Other tactics (clear winning eval advantage)
    if is_winning_eval:
        return "otherTactics"

    return None


def compute_advanced_tactics(
    games: List[GameModel],
    user_rating: Optional[int],
    side: str = "found"
) -> Dict[str, Any]:
    """
    Computes Advanced Tactics conversion rates for the 9 tactical categories.
    side: 'found' (user's turn) | 'allowed' (opponent's turn).
    """
    peers = get_peer_benchmarks(user_rating)["tactics"]

    # Counters per category: (opportunities, samples)
    stats: Dict[str, Dict[str, int]] = {
        k: {"opportunities": 0, "samples": 0} for k, _ in TACTIC_KEYS
    }

    analysed_games = [g for g in games if is_game_analysed(g)]

    for g in analysed_games:
        moves = g.moves or []
        user_col = "w" if g.is_user_white else "b"
        target_turn = (user_col == "w") if side == "found" else (user_col == "b")

        # Reconstruct board position before each move
        board = chess.Board()

        for i, m in enumerate(moves):
            is_turn = (board.turn == chess.WHITE) if target_turn else (board.turn == chess.BLACK)

            eval_dict = m.get("eval") or {}
            eval_val = eval_dict.get("eval", 0.0)
            mate_val = eval_dict.get("mate")
            best_san = eval_dict.get("best_move") or eval_dict.get("bestMove")
            played_san = m.get("san", "")

            if is_turn and best_san:
                try:
                    best_move = board.parse_san(best_san)
                    tactic_cat = classify_tactical_opportunity(board, best_move, eval_val, mate_val)
                    if tactic_cat and tactic_cat in stats:
                        stats[tactic_cat]["opportunities"] += 1
                        # Did the player play the tactic?
                        cls_name = m.get("classification")
                        if played_san == best_san or cls_name in ("best", "great", "brilliant"):
                            stats[tactic_cat]["samples"] += 1
                except Exception:
                    pass

            # Push played move on board
            try:
                board.push_san(played_san)
            except Exception:
                fen_after = m.get("fen")
                if fen_after:
                    board = chess.Board(fen_after)

    categories_list = []
    for key, label in TACTIC_KEYS:
        opps = stats[key]["opportunities"]
        samples = stats[key]["samples"]
        val = round((samples / opps) * 100.0, 1) if opps >= 3 else None
        categories_list.append({
            "key": key,
            "label": label,
            "value": val,
            "peers": peers.get(key, 70.0),
            "grade": grade_for("tactics", val) if val is not None else None,
            "opportunities": opps,
            "samples": samples
        })

    return {
        "categories": categories_list,
        "peersEstimated": True
    }


# -----------------------------------------------------------------------------
# 4. Endgames
# -----------------------------------------------------------------------------

def classify_endgame_material(board: chess.Board) -> str:
    """Classifies remaining material at endgame start into queen / rookAndPawn / kingAndPawn / other."""
    # Queen endgame: at least one Queen remains
    if board.pieces(chess.QUEEN, chess.WHITE) or board.pieces(chess.QUEEN, chess.BLACK):
        return "queen"

    rooks_w = len(board.pieces(chess.ROOK, chess.WHITE))
    rooks_b = len(board.pieces(chess.ROOK, chess.BLACK))
    minors = (
        len(board.pieces(chess.BISHOP, chess.WHITE)) + len(board.pieces(chess.BISHOP, chess.BLACK)) +
        len(board.pieces(chess.KNIGHT, chess.WHITE)) + len(board.pieces(chess.KNIGHT, chess.BLACK))
    )

    if minors == 0:
        if rooks_w == 0 and rooks_b == 0:
            return "kingAndPawn"
        return "rookAndPawn"

    return "other"


def compute_advanced_endgames(
    games: List[GameModel],
    user_rating: Optional[int]
) -> Dict[str, Any]:
    """Computes Advanced Endgames statistics."""
    peers = get_peer_benchmarks(user_rating)["endgames"]

    analysed_games = [g for g in games if is_game_analysed(g)]

    # 1. Win% buckets fromBetter (>=60), fromEqual (40-60), fromWorse (<=40)
    win_groups = {
        "fromBetter": {"games": 0, "wins": 0},
        "fromEqual": {"games": 0, "wins": 0},
        "fromWorse": {"games": 0, "wins": 0},
    }

    # 2. Accuracy buckets
    acc_groups = {
        "overall": [],
        "rookAndPawn": [],
        "kingAndPawn": [],
        "queen": [],
        "other": [],
    }

    for g in analysed_games:
        moves = g.moves or []
        _, end_from = compute_phase_boundaries(moves)
        if end_from >= len(moves):
            continue  # Did not reach endgame

        # Eval at endgame start
        end_move = moves[end_from]
        eval_dict = end_move.get("eval") or {}
        eval_score = eval_dict.get("eval", 0.0)
        mate_score = eval_dict.get("mate")

        white_win_pct = eval_to_win_pct(eval_score, mate_score, user_rating)
        user_win_pct = white_win_pct if g.is_user_white else (100.0 - white_win_pct)

        group_key = "fromEqual"
        if user_win_pct >= 60.0:
            group_key = "fromBetter"
        elif user_win_pct <= 40.0:
            group_key = "fromWorse"

        win_groups[group_key]["games"] += 1

        is_w = g.is_user_white
        res = g.result
        if (is_w and res == "1-0") or (not is_w and res == "0-1"):
            win_groups[group_key]["wins"] += 1

        # Accuracy in endgame
        user_col = "w" if is_w else "b"
        end_accs = [
            get_move_accuracy(m) for i, m in enumerate(moves)
            if i >= end_from and m.get("color") == user_col and get_move_accuracy(m) is not None
        ]
        if end_accs:
            game_avg_acc = sum(end_accs) / len(end_accs)
            acc_groups["overall"].append(game_avg_acc)

            # Classify material at endgame start
            fen_at_endgame = moves[max(0, end_from - 1)].get("fen") or chess.STARTING_FEN
            try:
                board = chess.Board(fen_at_endgame)
                mat_cat = classify_endgame_material(board)
            except Exception:
                mat_cat = "other"

            if mat_cat in acc_groups:
                acc_groups[mat_cat].append(game_avg_acc)

    def calc_win_metric(g_data: Dict[str, int], peer_val: float) -> Dict[str, Any]:
        cnt = g_data["games"]
        if cnt < 3:
            return {"value": None, "peers": peer_val, "grade": None}
        v = round((g_data["wins"] / cnt) * 100.0, 1)
        return {"value": v, "peers": peer_val, "grade": grade_for("win_pct", v)}

    def calc_acc_metric(accs: List[float], peer_val: float) -> Dict[str, Any]:
        if len(accs) < 3:
            return {"value": None, "peers": peer_val, "grade": None}
        v = round(sum(accs) / len(accs), 1)
        return {"value": v, "peers": peer_val, "grade": grade_for("accuracy", v)}

    return {
        "winPct": {
            "fromBetter": calc_win_metric(win_groups["fromBetter"], peers["win_pct_better"]),
            "fromEqual": calc_win_metric(win_groups["fromEqual"], peers["win_pct_equal"]),
            "fromWorse": calc_win_metric(win_groups["fromWorse"], peers["win_pct_worse"]),
        },
        "accuracy": {
            "overall": calc_acc_metric(acc_groups["overall"], peers["accuracy_overall"]),
            "rookAndPawn": calc_acc_metric(acc_groups["rookAndPawn"], peers["accuracy_rook_and_pawn"]),
            "kingAndPawn": calc_acc_metric(acc_groups["kingAndPawn"], peers["accuracy_king_and_pawn"]),
            "queen": calc_acc_metric(acc_groups["queen"], peers["accuracy_queen"]),
            "other": calc_acc_metric(acc_groups["other"], peers["accuracy_other"]),
        },
        "peersEstimated": True
    }


# -----------------------------------------------------------------------------
# 5. Strategy
# -----------------------------------------------------------------------------

def compute_advanced_strategy(
    games: List[GameModel],
    user_rating: Optional[int]
) -> Dict[str, Any]:
    """
    Computes Advanced Strategy metrics (coarse v1 heuristics).
    All evaluated on user's middlegame moves (openingEnd <= move_idx < endgameFrom):
      - overall: all user middlegame moves
      - attacking: user eval before move >= +1.0
      - defending: user eval before move <= -1.0
      - pawnStructure: pawn moves during middlegame
      - activePiece: piece moves into opponent half (rank >= 5 for White, rank <= 4 for Black)
      - spaceAdvantage: moves where user controls more central/advanced space (pawns on 4th/5th rank)
    """
    peers = get_peer_benchmarks(user_rating)["strategy"]

    analysed_games = [g for g in games if is_game_analysed(g)]

    buckets: Dict[str, List[float]] = {
        "overall": [],
        "pawnStructure": [],
        "attacking": [],
        "defending": [],
        "activePiece": [],
        "spaceAdvantage": [],
    }

    for g in analysed_games:
        moves = g.moves or []
        op_end, end_from = compute_phase_boundaries(moves)
        user_col = "w" if g.is_user_white else "b"

        board = chess.Board()

        for i, m in enumerate(moves):
            acc = get_move_accuracy(m)
            eval_dict = m.get("eval") or {}
            eval_val = eval_dict.get("eval", 0.0)

            # Check if this move is in middlegame
            if op_end <= i < end_from and m.get("color") == user_col and acc is not None:
                # 1. Overall
                buckets["overall"].append(acc)

                # Eval from user POV
                user_eval = eval_val if user_col == "w" else -eval_val

                # 2. Attacking
                if user_eval >= 1.0:
                    buckets["attacking"].append(acc)

                # 3. Defending
                if user_eval <= -1.0:
                    buckets["defending"].append(acc)

                # 4. Pawn structure (pawn moves)
                san = m.get("san", "")
                if san and san[0].islower():
                    buckets["pawnStructure"].append(acc)

                # 5. Active piece
                dest = m.get("to", "")
                if len(dest) == 2 and dest[1].isdigit():
                    rank = int(dest[1])
                    if san and not san[0].islower():
                        if (user_col == "w" and rank >= 5) or (user_col == "b" and rank <= 4):
                            buckets["activePiece"].append(acc)

                # 6. Space advantage (user has advanced central pawns)
                pawn_sqs = board.pieces(chess.PAWN, chess.WHITE if user_col == "w" else chess.BLACK)
                advanced_pawns = sum(
                    1 for s in pawn_sqs
                    if (user_col == "w" and chess.square_rank(s) >= 3) or (user_col == "b" and chess.square_rank(s) <= 4)
                )
                if advanced_pawns >= 3:
                    buckets["spaceAdvantage"].append(acc)

            # Advance board
            try:
                board.push_san(m.get("san", ""))
            except Exception:
                fen_after = m.get("fen")
                if fen_after:
                    board = chess.Board(fen_after)

    def calc_strategy_metric(key: str, min_samples: int = 5) -> Dict[str, Any]:
        accs = buckets[key]
        peer_val = peers.get(key, 80.0)
        if len(accs) < min_samples:
            return {"value": None, "peers": peer_val, "grade": None}
        v = round(sum(accs) / len(accs), 1)
        return {"value": v, "peers": peer_val, "grade": grade_for("accuracy", v)}

    return {
        "overall": calc_strategy_metric("overall"),
        "pawnStructure": calc_strategy_metric("pawnStructure"),
        "attacking": calc_strategy_metric("attacking"),
        "defending": calc_strategy_metric("defending"),
        "activePiece": calc_strategy_metric("activePiece"),
        "spaceAdvantage": calc_strategy_metric("spaceAdvantage"),
        "peersEstimated": True
    }


# -----------------------------------------------------------------------------
# 6. Brilliant Moves
# -----------------------------------------------------------------------------

def extract_brilliant_moves(
    games: List[GameModel],
    limit: int = 40
) -> List[Dict[str, Any]]:
    """Extracts all brilliant moves played by the user, newest first."""
    sorted_games = sorted(games, key=lambda g: g.date or "", reverse=True)

    brilliant_list: List[Dict[str, Any]] = []

    for g in sorted_games:
        moves = g.moves or []
        user_col = "w" if g.is_user_white else "b"
        opp_name, opp_rating = get_opponent_info(g)

        for i, m in enumerate(moves):
            if m.get("color") == user_col and m.get("classification") == "brilliant":
                brilliant_list.append({
                    "gameId": g.id,
                    "moveIndex": i,
                    "fen": m.get("fen", ""),
                    "san": m.get("san", ""),
                    "opponent": opp_name,
                    "opponentRating": opp_rating,
                    "date": g.date or ""
                })
                if len(brilliant_list) >= limit:
                    return brilliant_list

    return brilliant_list
