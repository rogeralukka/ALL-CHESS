"""
puzzle_processor.py: Lichess puzzle row parsing, conversion and validation.
Used by import scripts, seeders, and unit tests.
"""
import logging
import re
from typing import Dict, List, Optional
import chess

logger = logging.getLogger(__name__)


def generate_goal(side: str, themes: List[str]) -> str:
    """Generate dynamic goal from side to move and tactical themes."""
    theme_desc = "find the best move"
    if "mateIn1" in themes:
        theme_desc = "mate in 1"
    elif "mateIn2" in themes:
        theme_desc = "mate in 2"
    elif "mateIn3" in themes:
        theme_desc = "mate in 3"
    elif "mateIn4" in themes:
        theme_desc = "mate in 4"
    elif "mateIn5" in themes:
        theme_desc = "mate in 5"
    elif "mate" in themes:
        theme_desc = "deliver checkmate"
    elif "fork" in themes:
        theme_desc = "find the fork"
    elif "pin" in themes:
        theme_desc = "exploit the pin"
    elif "skewer" in themes:
        theme_desc = "find the skewer"
    elif "discoveredAttack" in themes:
        theme_desc = "find the discovered attack"
    elif "doubleCheck" in themes:
        theme_desc = "unleash a double check"
    elif "hangingPiece" in themes:
        theme_desc = "win the hanging piece"
    elif "trappedPiece" in themes:
        theme_desc = "trap the piece"
    elif "deflection" in themes:
        theme_desc = "deflect the defender"
    elif "attraction" in themes:
        theme_desc = "draw the enemy piece into danger"
    elif "clearance" in themes:
        theme_desc = "clear the line"
    elif "interference" in themes:
        theme_desc = "interfere with the defense"
    elif "sacrifice" in themes:
        theme_desc = "find the winning sacrifice"
    elif "endgame" in themes:
        theme_desc = "find the best endgame continuation"
    elif "advantage" in themes:
        theme_desc = "gain a decisive advantage"
    elif "crushing" in themes:
        theme_desc = "find the crushing blow"
    else:
        for t in themes:
            if t not in (
                "short",
                "long",
                "veryLong",
                "master",
                "masterVsMaster",
                "opening",
                "middlegame",
            ):
                clean = re.sub(r"([a-z])([A-Z])", r"\1 \2", t).lower()
                theme_desc = f"find the {clean}"
                break

    return f"{side} to move \N{EM DASH} {theme_desc}"


def process_puzzle_row(
    row: List[str],
    min_plays: int = 500,
    min_popularity: int = 85,
    max_rating_dev: int = 90,
) -> Optional[Dict]:
    """
    Parses and converts a Lichess puzzle row:
    row: [PuzzleId, FEN, Moves, Rating, RatingDeviation, Popularity, NbPlays, Themes, GameUrl, OpeningTags, ...]

    Returns a clean dict ready for DB upsert, or None if validation fails.
    """
    if not row or len(row) < 8:
        return None

    puzzle_id = row[0].strip()
    initial_fen = row[1].strip()
    uci_moves = row[2].strip().split()

    try:
        rating = int(row[3])
        rating_dev = int(row[4])
        popularity = int(row[5])
        nb_plays = int(row[6])
    except (ValueError, IndexError):
        return None

    themes = row[7].strip().split() if len(row) > 7 and row[7].strip() else []
    game_url = row[8].strip() if len(row) > 8 and row[8].strip() else None
    opening_tags = row[9].strip().split() if len(row) > 9 and row[9].strip() else None

    # Quality filters
    if rating_dev > max_rating_dev or popularity < min_popularity or nb_plays < min_plays:
        return None

    if len(uci_moves) < 2:
        return None

    try:
        board = chess.Board(initial_fen)
    except Exception:
        return None

    # Play opponent's setup move (moves[0])
    setup_move_uci = uci_moves[0]
    try:
        m0 = chess.Move.from_uci(setup_move_uci)
        if m0 not in board.legal_moves:
            return None
        board.push(m0)
    except Exception:
        return None

    starting_fen = board.fen()
    side = "White" if board.turn == chess.WHITE else "Black"

    # Play and convert solution moves (moves[1:])
    solution_san = []
    solution_uci = []
    try:
        for m_str in uci_moves[1:]:
            m = chess.Move.from_uci(m_str)
            if m not in board.legal_moves:
                return None
            san = board.san(m)
            solution_san.append(san)
            solution_uci.append(m_str)
            board.push(m)
    except Exception:
        return None

    if not solution_san:
        return None

    # Validate that mate themes strictly end in checkmate
    has_mate_theme = any(t == "mate" or t.startswith("mateIn") for t in themes)
    if has_mate_theme and not board.is_checkmate():
        return None

    goal = generate_goal(side, themes)

    return {
        "id": puzzle_id,
        "fen": starting_fen,
        "solution": solution_san,
        "solution_uci": solution_uci,
        "setup_move_uci": setup_move_uci,
        "rating": rating,
        "theme": themes,
        "goal": goal,
        "popularity": popularity,
        "nb_plays": nb_plays,
        "game_url": game_url,
        "opening_tags": opening_tags,
    }
