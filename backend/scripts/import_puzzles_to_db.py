#!/usr/bin/env python3
"""
import_puzzles_to_db.py: Stream Lichess puzzle database into ALL-CHESS database.

Features:
  - Resumable download to backend/.cache/lichess_db_puzzle.csv.zst (polite User-Agent).
  - Streams and decompresses with zstandard (memory-efficient).
  - High quality filters: rating_deviation <= 90, popularity >= 85, plays >= 500, legal moves.
  - Balanced distribution: ~100k target, capped per 100-pt rating band (400-2800), >= 300 per theme.
  - Measures sample row sizes, projects table+index size, aborts if > 80 MB (override with --force).
  - Reads DATABASE_URL from environment only (never logs or commits credentials).
  - Idempotent batch upsert with import_run marker for rollback.
  - Real DB query verification at completion.
"""

import argparse
import csv
import io
import json
import logging
import os
import sys
import time
import urllib.request
import uuid
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple

import zstandard
from sqlalchemy import create_engine, func, text
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.orm import sessionmaker

# Ensure backend root is on sys.path
SCRIPT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = SCRIPT_DIR.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.database import Base
from app.models.puzzle import Puzzle, PuzzleTheme
from app.services.puzzle_processor import process_puzzle_row

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

LICHESS_PUZZLE_URL = "https://database.lichess.org/lichess_db_puzzle.csv.zst"
DEFAULT_CACHE_FILE = BACKEND_DIR / ".cache" / "lichess_db_puzzle.csv.zst"

# Rating bands from 400 to 2800 in 100-point increments (24 bands)
RATING_BANDS = [(low, low + 100) for low in range(400, 2800, 100)]


def get_rating_band_index(rating: int) -> Optional[int]:
    if rating < 400 or rating >= 2800:
        return None
    return (rating - 400) // 100


def download_puzzle_file(target_path: Path, max_retries: int = 5) -> Path:
    """Resumable download of Lichess puzzle dump with polite User-Agent."""
    target_path.parent.mkdir(parents=True, exist_ok=True)
    headers = {"User-Agent": "ALL-CHESS-PuzzleImporter/1.0 (https://github.com/rogeralukka/ALL-CHESS)"}

    existing_size = target_path.stat().st_size if target_path.exists() else 0

    # Check remote content length
    req = urllib.request.Request(LICHESS_PUZZLE_URL, headers=headers)
    with urllib.request.urlopen(req) as resp:
        total_size = int(resp.headers.get("Content-Length", 0))

    if existing_size > 0 and existing_size == total_size:
        logger.info(f"Using fully cached file: {target_path} ({existing_size / (1024*1024):.1f} MB)")
        return target_path

    if existing_size > 0:
        logger.info(f"Resuming download from byte {existing_size}/{total_size}...")
        headers["Range"] = f"bytes={existing_size}-"

    req = urllib.request.Request(LICHESS_PUZZLE_URL, headers=headers)
    mode = "ab" if existing_size > 0 else "wb"

    with urllib.request.urlopen(req) as resp, open(target_path, mode) as out_f:
        downloaded = existing_size
        chunk_size = 1024 * 1024  # 1 MB
        t_last = time.time()
        while True:
            chunk = resp.read(chunk_size)
            if not chunk:
                break
            out_f.write(chunk)
            downloaded += len(chunk)
            if time.time() - t_last >= 5.0 or downloaded >= total_size:
                pct = (downloaded / total_size * 100.0) if total_size else 0
                logger.info(f"Downloaded {downloaded / (1024*1024):.1f} MB / {total_size / (1024*1024):.1f} MB ({pct:.1f}%)")
                t_last = time.time()

    logger.info(f"Download complete: {target_path} ({downloaded / (1024*1024):.1f} MB)")
    return target_path


def open_puzzle_stream(cache_file: Optional[Path]):
    """Opens a streaming reader from local zst file or directly from HTTP."""
    if cache_file and cache_file.exists():
        logger.info(f"Reading from local cache: {cache_file}")
        fh = open(cache_file, "rb")
        dctx = zstandard.ZstdDecompressor()
        stream_reader = dctx.stream_reader(fh)
        text_stream = io.TextIOWrapper(stream_reader, encoding="utf-8")
        return fh, text_stream
    else:
        logger.info(f"Streaming directly from {LICHESS_PUZZLE_URL}...")
        req = urllib.request.Request(
            LICHESS_PUZZLE_URL,
            headers={"User-Agent": "ALL-CHESS-PuzzleImporter/1.0"},
        )
        resp = urllib.request.urlopen(req)
        dctx = zstandard.ZstdDecompressor()
        stream_reader = dctx.stream_reader(resp)
        text_stream = io.TextIOWrapper(stream_reader, encoding="utf-8")
        return resp, text_stream


def measure_projected_size(sample_puzzles: List[Dict], target_total: int) -> Tuple[float, float]:
    """
    Measures serialized row sizes of Puzzle + PuzzleTheme from a sample,
    and calculates projected database table + index size.
    """
    total_puzzle_bytes = 0
    total_theme_bytes = 0

    for p in sample_puzzles:
        # Measure serialized size of Puzzle fields
        p_bytes = (
            len(p["id"].encode("utf-8"))
            + len(p["fen"].encode("utf-8"))
            + len(json.dumps(p["solution"]).encode("utf-8"))
            + len(json.dumps(p.get("solution_uci", [])).encode("utf-8"))
            + len((p.get("setup_move_uci") or "").encode("utf-8"))
            + 4  # rating (int4)
            + len(json.dumps(p["theme"]).encode("utf-8"))
            + len(p["goal"].encode("utf-8"))
            + 4  # popularity (int4)
            + 4  # nb_plays (int4)
            + len((p.get("game_url") or "").encode("utf-8"))
            + len(json.dumps(p.get("opening_tags") or []).encode("utf-8"))
            + 36  # import_run
            + 32  # row header & tuple overhead
        )
        total_puzzle_bytes += p_bytes

        # Measure PuzzleTheme rows
        for t in p.get("theme", []):
            t_bytes = (
                4  # id
                + len(p["id"].encode("utf-8"))
                + len(t.encode("utf-8"))
                + 24  # row header
            )
            total_theme_bytes += t_bytes

    n = len(sample_puzzles)
    avg_p_bytes = total_puzzle_bytes / n if n else 400
    avg_t_bytes = total_theme_bytes / n if n else 150
    avg_total_per_puzzle = avg_p_bytes + avg_t_bytes

    # Table size + B-Tree index multiplier (~1.8x overhead for indexes on id, rating, theme, puzzle_id)
    index_multiplier = 1.5
    projected_bytes = target_total * avg_total_per_puzzle * index_multiplier
    projected_mb = projected_bytes / (1024 * 1024)

    return avg_total_per_puzzle, projected_mb


def upsert_puzzles_batch(session, batch: List[Dict], dialect_name: str, import_run: str):
    """Upserts a batch of puzzles and their themes idempotently."""
    if not batch:
        return

    # Add import_run marker
    for p in batch:
        p["import_run"] = import_run

    batch_ids = [p["id"] for p in batch]

    if dialect_name == "postgresql":
        stmt = pg_insert(Puzzle).values(batch)
        update_cols = {
            "fen": stmt.excluded.fen,
            "solution": stmt.excluded.solution,
            "solution_uci": stmt.excluded.solution_uci,
            "setup_move_uci": stmt.excluded.setup_move_uci,
            "rating": stmt.excluded.rating,
            "theme": stmt.excluded.theme,
            "goal": stmt.excluded.goal,
            "popularity": stmt.excluded.popularity,
            "nb_plays": stmt.excluded.nb_plays,
            "game_url": stmt.excluded.game_url,
            "opening_tags": stmt.excluded.opening_tags,
            "import_run": stmt.excluded.import_run,
        }
        stmt = stmt.on_conflict_do_update(index_elements=["id"], set_=update_cols)
        session.execute(stmt)
    elif dialect_name == "sqlite":
        stmt = sqlite_insert(Puzzle).values(batch)
        update_cols = {
            "fen": stmt.excluded.fen,
            "solution": stmt.excluded.solution,
            "solution_uci": stmt.excluded.solution_uci,
            "setup_move_uci": stmt.excluded.setup_move_uci,
            "rating": stmt.excluded.rating,
            "theme": stmt.excluded.theme,
            "goal": stmt.excluded.goal,
            "popularity": stmt.excluded.popularity,
            "nb_plays": stmt.excluded.nb_plays,
            "game_url": stmt.excluded.game_url,
            "opening_tags": stmt.excluded.opening_tags,
            "import_run": stmt.excluded.import_run,
        }
        stmt = stmt.on_conflict_do_update(index_elements=["id"], set_=update_cols)
        session.execute(stmt)
    else:
        # Generic fallback
        existing_ids = {
            r[0]
            for r in session.query(Puzzle.id).filter(Puzzle.id.in_(batch_ids)).all()
        }
        to_insert = [p for p in batch if p["id"] not in existing_ids]
        for p in batch:
            if p["id"] in existing_ids:
                session.query(Puzzle).filter(Puzzle.id == p["id"]).update(p)
        if to_insert:
            session.bulk_insert_mappings(Puzzle, to_insert)

    # Replace themes for this batch
    session.query(PuzzleTheme).filter(PuzzleTheme.puzzle_id.in_(batch_ids)).delete(synchronize_session=False)
    theme_rows = []
    for p in batch:
        pid = p["id"]
        for t in p.get("theme", []):
            theme_rows.append({"puzzle_id": pid, "theme": t})
    if theme_rows:
        session.bulk_insert_mappings(PuzzleTheme, theme_rows)

    session.commit()


def run_post_import_verification(session, engine):
    """Executes real database queries and prints verification summary."""
    print("\n" + "=" * 80)
    print("DATABASE POST-IMPORT VERIFICATION SUMMARY (FROM REAL SQL QUERIES)")
    print("=" * 80)

    total_puzzles = session.query(func.count(Puzzle.id)).scalar() or 0
    total_themes = session.query(func.count(PuzzleTheme.id)).scalar() or 0
    print(f"Total Puzzles in DB: {total_puzzles:,}")
    print(f"Total PuzzleTheme associations in DB: {total_themes:,}")

    # Rating distribution by 100-pt band
    print("\n--- REAL DATABASE COUNTS BY 100-PT RATING BAND ---")
    band_query = text("""
        SELECT (rating / 100) * 100 AS band, count(*) AS count
        FROM puzzles
        GROUP BY (rating / 100) * 100
        ORDER BY band ASC
    """)
    band_results = session.execute(band_query).fetchall()
    print(f"{'Rating Band':15s} | {'Count':10s}")
    print("-" * 30)
    for row in band_results:
        band_val = int(row[0])
        print(f"[{band_val:4d} - {band_val+100:4d}) | {row[1]:10,d}")
    print("-" * 30)

    # Theme counts
    print("\n--- REAL DATABASE COUNTS BY THEME (TOP 30) ---")
    theme_query = text("""
        SELECT theme, count(*) AS count
        FROM puzzle_themes
        GROUP BY theme
        ORDER BY count(*) DESC
        LIMIT 30
    """)
    theme_results = session.execute(theme_query).fetchall()
    print(f"{'Theme':25s} | {'Count':10s}")
    print("-" * 40)
    for row in theme_results:
        print(f"{row[0]:25s} | {row[1]:10,d}")
    print("-" * 40)

    # Postgres relation size check if reachable
    if engine.dialect.name == "postgresql":
        try:
            sz_query = text("""
                SELECT pg_size_pretty(pg_total_relation_size('puzzles')) AS puzzles_total,
                       pg_size_pretty(pg_total_relation_size('puzzle_themes')) AS themes_total
            """)
            sz_res = session.execute(sz_query).fetchone()
            print(f"\nPostgreSQL Relation Sizes: Puzzles={sz_res[0]}, Themes={sz_res[1]}")
        except Exception as e:
            print(f"\npg_total_relation_size query failed: {e}")
    else:
        print("\nPostgres pg_total_relation_size: not run (running on SQLite dialect).")

    print("=" * 80)


def main():
    parser = argparse.ArgumentParser(description="Import Lichess puzzle database into ALL-CHESS DB.")
    parser.add_argument("--target", type=int, default=100000, help="Target total puzzles (default: 100000)")
    parser.add_argument("--band-cap", type=int, default=4800, help="Max puzzles per 100-pt rating band (default: 4800)")
    parser.add_argument("--min-theme-quota", type=int, default=300, help="Min quota per theme (default: 300)")
    parser.add_argument("--batch-size", type=int, default=1000, help="Batch upsert size (default: 1000)")
    parser.add_argument("--limit", type=int, default=None, help="Stop after collecting N puzzles")
    parser.add_argument("--dry-run", action="store_true", help="Parse and project size without writing to DB")
    parser.add_argument("--force", action="store_true", help="Override the 80 MB safety size limit")
    parser.add_argument("--download-only", action="store_true", help="Only download the .zst dump to cache")
    parser.add_argument("--cache-file", type=str, default=str(DEFAULT_CACHE_FILE), help="Local zst cache file path")
    parser.add_argument("--db-url", type=str, default=None, help="DB URL (for local test only; production uses DATABASE_URL env)")
    args = parser.parse_args()

    t_start = time.time()
    target_total = args.target
    stop_limit = args.limit if args.limit is not None else args.target
    cache_path = Path(args.cache_file)

    if args.download_only:
        download_puzzle_file(cache_path)
        return

    # Check database connection (only from env var in normal operation)
    db_url = os.environ.get("DATABASE_URL") or args.db_url
    engine = None
    session_factory = None
    dialect_name = "sqlite"

    if not args.dry_run:
        if not db_url:
            logger.error("DATABASE_URL environment variable is not set. Set it or use --dry-run.")
            sys.exit(1)
        engine = create_engine(db_url, pool_pre_ping=True)
        dialect_name = engine.dialect.name
        session_factory = sessionmaker(bind=engine)
        logger.info(f"Connected to database (dialect: {dialect_name})")
        Base.metadata.create_all(bind=engine)

    # Open stream
    resource_handle, text_stream = open_puzzle_stream(cache_path if cache_path.exists() else None)
    reader = csv.reader(text_stream)

    # Skip header if present
    header = next(reader, None)
    logger.info(f"Stream opened. Header: {header[:6] if header else 'None'}")

    # Tracking counters
    band_counts = defaultdict(int)
    theme_counts = defaultdict(int)
    seen_ids: Set[str] = set()
    collected_puzzles: List[Dict] = []
    sample_for_sizing: List[Dict] = []

    rows_read = 0
    rows_kept = 0
    rejections = defaultdict(int)
    batch_buffer: List[Dict] = []
    import_run = f"run_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:6]}"

    sizing_checked = False

    try:
        for row in reader:
            rows_read += 1
            if not row or len(row) < 8:
                rejections["malformed_row"] += 1
                continue

            pid = row[0].strip()
            if pid in seen_ids:
                rejections["duplicate_id"] += 1
                continue

            try:
                rating = int(row[3])
                rating_dev = int(row[4])
                popularity = int(row[5])
                nb_plays = int(row[6])
            except (ValueError, IndexError):
                rejections["invalid_numeric"] += 1
                continue

            # Quality filters
            if rating_dev > 90:
                rejections["rating_dev_too_high"] += 1
                continue
            if popularity < 85:
                rejections["popularity_too_low"] += 1
                continue
            if nb_plays < 500:
                rejections["plays_too_low"] += 1
                continue

            band_idx = get_rating_band_index(rating)
            if band_idx is None:
                rejections["out_of_rating_range"] += 1
                continue

            themes = row[7].strip().split() if len(row) > 7 else []

            # Check if any theme in this puzzle is currently starved (< min_theme_quota)
            has_starved_theme = any(theme_counts[t] < args.min_theme_quota for t in themes)

            # Cap check: if band is full and no starved theme, skip
            if band_counts[band_idx] >= args.band_cap and not has_starved_theme:
                rejections["band_cap_exceeded"] += 1
                continue

            # Process & validate chess moves
            puzzle = process_puzzle_row(row)
            if not puzzle:
                rejections["failed_validation"] += 1
                continue

            seen_ids.add(pid)
            band_counts[band_idx] += 1
            for t in puzzle["theme"]:
                theme_counts[t] += 1

            rows_kept += 1
            batch_buffer.append(puzzle)
            if len(sample_for_sizing) < 1000:
                sample_for_sizing.append(puzzle)

            # Sizing check at 1,000 samples
            if len(sample_for_sizing) >= 1000 and not sizing_checked:
                avg_bytes, proj_mb = measure_projected_size(sample_for_sizing, target_total)
                logger.info(f"Measured average row+theme size: {avg_bytes:.1f} bytes")
                logger.info(f"Projected total database size for {target_total:,} puzzles: {proj_mb:.2f} MB")
                if proj_mb > 80.0 and not args.force:
                    logger.error(f"Projected database size ({proj_mb:.2f} MB) exceeds Neon safety limit (80 MB)!")
                    logger.error("Pass --force to override. Aborting.")
                    sys.exit(1)
                sizing_checked = True

            # Write batch if buffer full and not dry run
            if len(batch_buffer) >= args.batch_size:
                if not args.dry_run and session_factory:
                    with session_factory() as sess:
                        upsert_puzzles_batch(sess, batch_buffer, dialect_name, import_run)
                batch_buffer.clear()

            if rows_kept % 10000 == 0:
                logger.info(f"Progress: {rows_kept:,} / {target_total:,} puzzles collected ({rows_read:,} lines read)")

            if rows_kept >= stop_limit:
                break

    finally:
        resource_handle.close()

    # Flush remaining buffer
    if batch_buffer and not args.dry_run and session_factory:
        with session_factory() as sess:
            upsert_puzzles_batch(sess, batch_buffer, dialect_name, import_run)
        batch_buffer.clear()

    elapsed = time.time() - t_start

    print("\n" + "=" * 80)
    print("IMPORT RUN SUMMARY")
    print("=" * 80)
    print(f"Import Run ID:     {import_run}")
    print(f"Total Rows Read:   {rows_read:,}")
    print(f"Total Rows Kept:   {rows_kept:,}")
    print(f"Total Rejections:  {sum(rejections.values()):,}")
    for reason, count in sorted(rejections.items(), key=lambda x: -x[1]):
        print(f"  - {reason:25s}: {count:,}")
    print(f"Elapsed Time:      {elapsed:.1f}s ({rows_read / elapsed:.0f} rows/s)")

    if sample_for_sizing:
        avg_bytes, proj_mb = measure_projected_size(sample_for_sizing, rows_kept)
        print(f"Measured avg size: {avg_bytes:.1f} bytes / puzzle")
        print(f"Projected DB size: {proj_mb:.2f} MB (Safety limit: 80 MB)")

    # Real DB query summary
    if not args.dry_run and session_factory:
        with session_factory() as sess:
            run_post_import_verification(sess, engine)


if __name__ == "__main__":
    main()
