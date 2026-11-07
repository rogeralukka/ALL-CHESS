"""
Import ~5,000 starter puzzles from Lichess open puzzle database (CC0).
Used to generate/maintain backend/app/data/puzzles.json.
"""
import csv
import io
import json
import logging
import urllib.request
from pathlib import Path
from typing import Dict, List, Optional
import zstandard

# Ensure backend root is on sys.path
import sys
SCRIPT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = SCRIPT_DIR.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.services.puzzle_processor import process_puzzle_row

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

DATA_DIR = BACKEND_DIR / "app" / "data"
OUTPUT_FILE = DATA_DIR / "puzzles.json"
LICHESS_PUZZLE_URL = "https://database.lichess.org/lichess_db_puzzle.csv.zst"

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

        header = next(reader, None)
        logger.info(f"Connected. Stream header: {header[:6] if header else 'None'}")

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

            if len(collected_by_bucket[bucket]) >= BUCKET_TARGETS[bucket]:
                if all(len(collected_by_bucket[b]) >= BUCKET_TARGETS[b] for b in BUCKET_TARGETS):
                    break
                continue

            puzzle = process_puzzle_row(row, min_plays=500, min_popularity=80, max_rating_dev=100)
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

    all_puzzles.sort(key=lambda x: x["rating"])

    logger.info(f"Import complete: {len(all_puzzles)} valid puzzles collected.")
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(all_puzzles, f, indent=2)

    logger.info(f"Saved {len(all_puzzles)} puzzles to {OUTPUT_FILE}")
    return all_puzzles


if __name__ == "__main__":
    import_puzzles()
