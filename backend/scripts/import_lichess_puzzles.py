"""
Import ~5,000 puzzles from Lichess open puzzle database (CC0).
Filters:
  - ratings 400-2200
  - rating deviation < 100
  - popularity > 80
  - balanced spread of themes and rating tiers

Conversion to ALL-CHESS {fen, solution} format:
  - Lichess FEN is before the opponent's blunder move (moves[0]).
  - The script plays moves[0] on the board, making the player's turn the starting FEN.
  - Converts solution moves[1:] to SAN notation.
  - Generates goal dynamically from side to move + themes (e.g. "White to move — mate in 2").
  - Strictly asserts that all mate puzzles end in checkmate.
"""
import csv
import io
import json
import logging
import re
import urllib.request
from pathlib import Path
from typing import Dict, List, Optional
import chess
import zstandard

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

DATA_DIR = Path(__file__).resolve().parent.parent / "app" / "data"
OUTPUT_FILE = DATA_DIR / "puzzles.json"
LICHESS_PUZZLE_URL = "https://database.lichess.org/lichess_db_puzzle.csv.zst"

# Target counts per rating bucket to ensure even spread
BUCKET_TARGETS = {
    "400-800": 600,
    "800-1100": 1100,
    "1100-1400": 1200,
    "1400-1700": 1100,
    "1700-2200": 1000,
}
TOTAL_TARGET = sum(BUCKET_TARGETS.values())  # 5,000


def get_bucket(rating: int) -> Optional[str]:
    if 400 <= rating < 800:
        return "400-800"
    elif 800 <= rating < 1100:
        return "800-1100"
    elif 1100 <= rating < 1400:
        return "1100-1400"
    elif 1400 <= rating < 1700:
        return "1400-1700"
    elif 1700 <= rating <= 2200:
        return "1700-2200"
    return None


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
            if t not in ("short", "long", "veryLong", "master", "masterVsMaster", "opening", "middlegame"):
                clean = re.sub(r"([a-z])([A-Z])", r"\1 \2", t).lower()
                theme_desc = f"find the {clean}"
                break

    return f"{side} to move \N{EM DASH} {theme_desc}"


def process_puzzle_row(row: List[str]) -> Optional[Dict]:
    """
    Parses and converts a Lichess puzzle row:
    row: [PuzzleId, FEN, Moves, Rating, RatingDeviation, Popularity, NbPlays, Themes, GameUrl, OpeningTags, ...]
    """
    puzzle_id = row[0]
    initial_fen = row[1]
    uci_moves = row[2].strip().split()
    rating = int(row[3])
    rating_dev = int(row[4])
    popularity = int(row[5])
    themes = row[7].strip().split()

    if rating_dev >= 100 or popularity <= 80:
        return None

    if len(uci_moves) < 2:
        return None

    try:
        board = chess.Board(initial_fen)
    except Exception:
        return None

    # Play opponent's first move
    try:
        m0 = chess.Move.from_uci(uci_moves[0])
        if m0 not in board.legal_moves:
            return None
        board.push(m0)
    except Exception:
        return None

    starting_fen = board.fen()
    side = "White" if board.turn == chess.WHITE else "Black"

    # Play and convert solution moves to SAN
    solution_san = []
    try:
        for m_str in uci_moves[1:]:
            m = chess.Move.from_uci(m_str)
            if m not in board.legal_moves:
                return None
            san = board.san(m)
            solution_san.append(san)
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
        "rating": rating,
        "theme": themes,
        "goal": goal,
    }


def import_puzzles():
    logger.info(f"Connecting to {LICHESS_PUZZLE_URL}...")
    req = urllib.request.Request(
        LICHESS_PUZZLE_URL,
        headers={"User-Agent": "ALL-CHESS-PuzzleImporter/1.0"},
    )

    collected_by_bucket: Dict[str, List[Dict]] = {k: [] for k in BUCKET_TARGETS}
    total_collected = 0

    with urllib.request.urlopen(req) as resp:
        dctx = zstandard.ZstdDecompressor()
        stream_reader = dctx.stream_reader(resp)
        text_stream = io.TextIOWrapper(stream_reader, encoding="utf-8")
        reader = csv.reader(text_stream)

        header = next(reader)
        logger.info(f"Connected. Stream header: {header[:6]}")

        lines_read = 0
        for row in reader:
            lines_read += 1
            if not row or len(row) < 8:
                continue

            try:
                rating = int(row[3])
            except ValueError:
                continue

            bucket = get_bucket(rating)
            if not bucket:
                continue

            # If bucket is full, skip
            if len(collected_by_bucket[bucket]) >= BUCKET_TARGETS[bucket]:
                # Check if all buckets are full
                if all(len(collected_by_bucket[b]) >= BUCKET_TARGETS[b] for b in BUCKET_TARGETS):
                    break
                continue

            puzzle = process_puzzle_row(row)
            if not puzzle:
                continue

            collected_by_bucket[bucket].append(puzzle)
            total_collected += 1

            if total_collected % 500 == 0:
                counts = {b: len(collected_by_bucket[b]) for b in BUCKET_TARGETS}
                logger.info(f"Progress: {total_collected}/{TOTAL_TARGET} puzzles ({lines_read} lines read) - {counts}")

    all_puzzles = []
    for b in BUCKET_TARGETS:
        all_puzzles.extend(collected_by_bucket[b])

    # Sort puzzles by rating
    all_puzzles.sort(key=lambda x: x["rating"])

    logger.info(f"Import complete: {len(all_puzzles)} valid puzzles collected.")
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(all_puzzles, f, indent=2)

    logger.info(f"Saved {len(all_puzzles)} puzzles to {OUTPUT_FILE}")
    return all_puzzles


if __name__ == "__main__":
    import_puzzles()
