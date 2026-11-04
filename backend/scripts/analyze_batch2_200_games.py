"""Batch 2: Comprehensive Game-by-Game Review Analysis for 200 New Games (100 Hikaru + 100 NickOrlando24)

Evaluates:
- Move classifications per game (brilliant, great, best, excellent, good, book, forced, inaccuracy, mistake, miss, blunder)
- Accuracy vs Chess.com (ours vs CC, diff W/B, MAE)
- Performance Rating estimation (ours W/B vs player real ratings)
- Arrow counts (threat orange, best green, refutation red, alt blue)
- Square highlights (attacked red, target orange/green)
- Coach commentary and tactical explain audit
- Key moves highlight (sacrifices, forks, pins, skewers, mate threats)
"""

import json
import multiprocessing as mp
import os
import sqlite3
import sys
import time
from collections import Counter
from typing import Any, Dict, List, Tuple

import chess
import chess.engine

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(HERE)
sys.path.insert(0, BACKEND_DIR)
os.environ.setdefault("APP_PASSCODE", "dev-local-test-pass")
os.environ.setdefault("SESSION_SECRET", "dev-local-test-secret-0123456789abcdef")
os.environ.setdefault("TESTING", "1")

from app.services.accuracy import calculate_game_accuracy, estimate_performance_ratings
from app.services.engine_service import _run_single_pass_review_sync

CACHE_DIR = os.path.join(BACKEND_DIR, ".cache")
FILTERED_DATA_FILE = os.path.join(CACHE_DIR, "chesscom_filtered_games.json")
DB_CACHE_FILE = os.path.join(CACHE_DIR, "fen_evals.sqlite")
BATCH1_FILE = os.path.join(CACHE_DIR, "game_by_game_149_analysis.json")
BATCH2_OUT_FILE = os.path.join(CACHE_DIR, "game_by_game_200_batch2.json")

CLASS_ORDER = [
    "brilliant",
    "great",
    "best",
    "excellent",
    "good",
    "book",
    "forced",
    "inaccuracy",
    "mistake",
    "miss",
    "blunder",
]


def init_db(db_path: str = DB_CACHE_FILE) -> sqlite3.Connection:
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA synchronous=NORMAL;")
    conn.execute(
        "CREATE TABLE IF NOT EXISTS fen_evals (fen TEXT PRIMARY KEY, lines_json TEXT NOT NULL)"
    )
    conn.commit()
    return conn


def get_cached_fens(fens: List[str], db_path: str = DB_CACHE_FILE) -> Dict[str, List[Dict[str, Any]]]:
    if not os.path.exists(db_path):
        return {}
    conn = init_db(db_path)
    cached = {}
    chunk_size = 900
    for i in range(0, len(fens), chunk_size):
        chunk = fens[i : i + chunk_size]
        q = f"SELECT fen, lines_json FROM fen_evals WHERE fen IN ({','.join(['?']*len(chunk))})"
        for fen, lines_json in conn.execute(q, chunk).fetchall():
            cached[fen] = json.loads(lines_json)
    conn.close()
    return cached


def insert_cached_fens(results: List[Tuple[str, List[Dict[str, Any]]]], db_path: str = DB_CACHE_FILE) -> None:
    if not results:
        return
    conn = init_db(db_path)
    rows = [(fen, json.dumps(lines)) for fen, lines in results]
    conn.executemany("INSERT OR REPLACE INTO fen_evals (fen, lines_json) VALUES (?, ?)", rows)
    conn.commit()
    conn.close()


def get_stockfish_executable_path() -> str:
    path = os.path.join(BACKEND_DIR, "bin", "stockfish.exe")
    if os.path.exists(path):
        return path
    raise FileNotFoundError("Stockfish binary not found in backend/bin/")


def worker_eval_fens(args: Tuple[List[str], str]) -> List[Tuple[str, List[Dict[str, Any]]]]:
    fens, stockfish_path = args
    engine = chess.engine.SimpleEngine.popen_uci(stockfish_path)
    engine.configure({"Threads": 1, "Hash": 16})
    results = []
    try:
        for fen in fens:
            board = chess.Board(fen)
            if board.is_checkmate() or board.is_stalemate() or board.is_insufficient_material():
                results.append((fen, []))
                continue
            infos = engine.analyse(board, limit=chess.engine.Limit(depth=18), multipv=3)
            lines = []
            for info in infos:
                sc = info.get("score")
                pv = [mv.uci() for mv in info.get("pv", [])]
                if not sc or not pv:
                    continue
                rel = sc.relative
                lines.append({
                    "pv": pv,
                    "cp": rel.score() if not rel.is_mate() else None,
                    "mate": rel.mate() if rel.is_mate() else None,
                    "depth": info.get("depth", 18),
                })
            results.append((fen, lines))
    finally:
        engine.quit()
    return results


def evaluate_positions_parallel(games: List[Dict[str, Any]], num_workers: int = 12) -> None:
    all_fens = set()
    for g in games:
        board = chess.Board()
        all_fens.add(board.fen())
        for m in g["moves"]:
            try:
                cm = board.parse_san(m["san"])
            except Exception:
                cm = chess.Move.from_uci(f"{m['from']}{m['to']}{m.get('promotion') or ''}")
            board.push(cm)
            all_fens.add(board.fen())

    print(f"Total positions in batch 2: {len(all_fens)} unique FENs across {len(games)} games.")
    cached = get_cached_fens(list(all_fens))
    missing = [f for f in all_fens if f not in cached]
    print(f"Already cached in DB: {len(cached)} FENs. Need to evaluate: {len(missing)} FENs.")

    if not missing:
        return

    stockfish_path = get_stockfish_executable_path()
    t0 = time.time()
    # Batch in small chunks of 35 positions per job for frequent flushing
    chunk_size = 35
    batches = [missing[i : i + chunk_size] for i in range(0, len(missing), chunk_size)]
    worker_args = [(batch, stockfish_path) for batch in batches]

    print(f"Evaluating {len(missing)} positions with {num_workers} parallel workers in {len(batches)} batches...")
    completed = 0
    with mp.Pool(processes=num_workers) as pool:
        for res_batch in pool.imap_unordered(worker_eval_fens, worker_args):
            insert_cached_fens(res_batch)
            completed += len(res_batch)
            elapsed = time.time() - t0
            rate = completed / max(0.1, elapsed)
            remaining_fens = len(missing) - completed
            eta = remaining_fens / max(0.1, rate)
            pct = (completed / len(missing)) * 100.0
            print(f"Progress: {completed}/{len(missing)} FENs ({pct:.1f}%) | {rate:.1f} FEN/s | ETA: {eta/60:.1f}m", flush=True)

    print(f"Completed engine evaluation in {time.time() - t0:.1f}s.")


def main():
    print("=" * 80)
    print("BATCH 2: Analyzing 200 New Games (100 Hikaru + 100 NickOrlando24)")
    print("=" * 80)

    with open(FILTERED_DATA_FILE, "r", encoding="utf-8") as f:
        filtered = json.load(f)
    with open(BATCH1_FILE, "r", encoding="utf-8") as f:
        batch1 = json.load(f)

    batch1_ids = set(str(g["id"]) for g in batch1)

    new_hikaru = [g for g in filtered["hikaru"] if str(g["id"]) not in batch1_ids][:100]
    new_nick = [g for g in filtered["nickorlando24"] if str(g["id"]) not in batch1_ids][:100]

    print(f"Loaded {len(new_hikaru)} new games from Hikaru (Grandmaster)")
    print(f"Loaded {len(new_nick)} new games from NickOrlando24 (Club)")
    batch2_games = new_hikaru + new_nick
    assert len(batch2_games) == 200, f"Expected 200 games, got {len(batch2_games)}"

    # Step 1: Parallel Stockfish evaluation
    evaluate_positions_parallel(batch2_games, num_workers=12)

    # Step 2: Load all cached FENs for the 200 games
    all_fens = set()
    for g in batch2_games:
        b = chess.Board()
        all_fens.add(b.fen())
        for m in g["moves"]:
            try:
                cm = b.parse_san(m["san"])
            except Exception:
                cm = chess.Move.from_uci(f"{m['from']}{m['to']}{m.get('promotion') or ''}")
            b.push(cm)
            all_fens.add(b.fen())

    fen_dict = get_cached_fens(list(all_fens))
    print(f"Loaded {len(fen_dict)} FEN evaluations from SQLite DB.")

    # Step 3: Run comprehensive review on each game
    print("Running single-pass reviews, accuracy, ratings, and commentary...")
    game_reports = []

    for idx, g in enumerate(batch2_games):
        user = g["user"]
        gid = g["id"]
        board = chess.Board()
        n_evals = [{"lines": fen_dict.get(board.fen(), [])}]
        for m in g["moves"]:
            try:
                cm = board.parse_san(m["san"])
            except Exception:
                cm = chess.Move.from_uci(f"{m['from']}{m['to']}{m.get('promotion') or ''}")
            board.push(cm)
            n_evals.append({"lines": fen_dict.get(board.fen(), [])})

        rev = _run_single_pass_review_sync(
            None,
            [dict(m) for m in g["moves"]],
            white_rating=g.get("white_rating"),
            black_rating=g.get("black_rating"),
            external_evals=n_evals,
        )

        acc = calculate_game_accuracy(rev["moves"], level="standard")
        our_w, our_b = acc["white"], acc["black"]
        cc_w, cc_b = g["cc"]["white"], g["cc"]["black"]
        diff_w = round(our_w - cc_w, 2)
        diff_b = round(our_b - cc_b, 2)
        mean_abs_err = round(0.5 * (abs(diff_w) + abs(diff_b)), 2)

        # Performance Ratings
        perf_ratings = estimate_performance_ratings(
            acc,
            white_base_rating=g.get("white_rating"),
            black_base_rating=g.get("black_rating"),
            level="standard",
        )

        # Counts
        counts_w = Counter()
        counts_b = Counter()
        arrows_w = Counter()
        arrows_b = Counter()
        squares_w = Counter()
        squares_b = Counter()
        key_moves = []

        for m_idx, m in enumerate(rev["moves"]):
            color = m.get("color", "w")
            cls = m.get("classification") or "good"
            if color == "w":
                counts_w[cls] += 1
            else:
                counts_b[cls] += 1

            ann = m.get("annotations") or {}
            for a in ann.get("arrows", []):
                if color == "w":
                    arrows_w[a.get("kind")] += 1
                else:
                    arrows_b[a.get("kind")] += 1

            for sq in ann.get("squares", []):
                if color == "w":
                    squares_w[sq.get("kind")] += 1
                else:
                    squares_b[sq.get("kind")] += 1

            if cls in ("brilliant", "great", "blunder"):
                key_moves.append({
                    "ply": m_idx + 1,
                    "color": color,
                    "san": m.get("san"),
                    "cls": cls,
                    "coach": m.get("coachComment"),
                    "explain": (ann.get("explain") or [None])[0],
                    "arrows": [f"{a['kind']}:{a['from']}->{a['to']}" for a in ann.get("arrows", [])],
                })

        game_reports.append({
            "id": gid,
            "user": user,
            "time_class": g.get("time_class"),
            "white_user": g.get("white_user"),
            "white_rating": g.get("white_rating"),
            "black_user": g.get("black_user"),
            "black_rating": g.get("black_rating"),
            "plies": len(g["moves"]),
            "cc": {"white": cc_w, "black": cc_b},
            "ours": {"white": our_w, "black": our_b},
            "diff": {"white": diff_w, "black": diff_b},
            "mae": mean_abs_err,
            "estimated_ratings": perf_ratings,
            "counts": {
                "white": {c: counts_w[c] for c in CLASS_ORDER},
                "black": {c: counts_b[c] for c in CLASS_ORDER},
            },
            "arrows": {
                "white": dict(arrows_w),
                "black": dict(arrows_b),
            },
            "squares": {
                "white": dict(squares_w),
                "black": dict(squares_b),
            },
            "key_moves": key_moves,
        })

        if (idx + 1) % 25 == 0 or idx == len(batch2_games) - 1:
            print(f"Reviewed {idx + 1}/{len(batch2_games)} games...")

    # Step 4: Save results
    with open(BATCH2_OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(game_reports, f, indent=2)
    print(f"\nSaved batch 2 analysis for all {len(game_reports)} games to {BATCH2_OUT_FILE}.")

    # Summary
    all_brilliant = sum(km["cls"] == "brilliant" for g in game_reports for km in g["key_moves"])
    all_great = sum(km["cls"] == "great" for g in game_reports for km in g["key_moves"])
    all_blunder = sum(km["cls"] == "blunder" for g in game_reports for km in g["key_moves"])
    avg_mae = sum(g["mae"] for g in game_reports) / len(game_reports)

    print("=" * 80)
    print(f"BATCH 2 COMPLETE:")
    print(f"Total Games Analyzed: {len(game_reports)}")
    print(f"Average Accuracy Error vs Chess.com (MAE): {avg_mae:.2f}")
    print(f"Total Brilliant Moves: {all_brilliant}")
    print(f"Total Great Moves: {all_great}")
    print(f"Total Blunders: {all_blunder}")
    print("=" * 80)


if __name__ == "__main__":
    main()
