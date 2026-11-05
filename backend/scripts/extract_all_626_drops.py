"""Extracts move-level win% drops and classifications for all 626 games
evaluated across Batches 1, 2, 3, and 4, using precomputed FEN evaluations
from backend/.cache/fen_evals.sqlite.

Saves full calibration dataset to backend/.cache/drops_626_games.json.
"""

import json
import os
import sqlite3
import sys
import time
from typing import Any, Dict, List

import chess

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(HERE)
sys.path.insert(0, BACKEND_DIR)
os.environ.setdefault("APP_PASSCODE", "dev-local-test-pass")
os.environ.setdefault("SESSION_SECRET", "dev-local-test-secret-0123456789abcdef")
os.environ.setdefault("TESTING", "1")

from app.services.accuracy import calculate_game_accuracy, eval_to_win_pct
from app.services.engine_service import _run_single_pass_review_sync

CACHE_DIR = os.path.join(BACKEND_DIR, ".cache")
DB_CACHE_FILE = os.path.join(CACHE_DIR, "fen_evals.sqlite")
FILTERED_DATA_FILE = os.path.join(CACHE_DIR, "chesscom_filtered_games.json")
TIER_CACHE_FILE = os.path.join(CACHE_DIR, "tier_games_cache.json")
OUTPUT_DROPS_FILE = os.path.join(CACHE_DIR, "drops_626_games.json")

BATCH_FILES = [
    os.path.join(CACHE_DIR, "game_by_game_149_analysis.json"),
    os.path.join(CACHE_DIR, "game_by_game_200_batch2.json"),
    os.path.join(CACHE_DIR, "game_by_game_100_batch3.json"),
    os.path.join(CACHE_DIR, "game_by_game_batch4.json"),
]


def load_target_games() -> List[Dict[str, Any]]:
    seen_ids = set()
    targets = []
    for bf in BATCH_FILES:
        if not os.path.exists(bf):
            continue
        with open(bf, "r", encoding="utf-8") as f:
            for g in json.load(f):
                gid = str(g["id"])
                if gid not in seen_ids:
                    seen_ids.add(gid)
                    targets.append(g)
    print(f"Loaded {len(targets)} unique target games across batches.")
    return targets


def load_game_moves_dict() -> Dict[str, Dict[str, Any]]:
    moves_by_id = {}
    if os.path.exists(FILTERED_DATA_FILE):
        with open(FILTERED_DATA_FILE, "r", encoding="utf-8") as f:
            filtered = json.load(f)
            for user, games in filtered.items():
                for g in games:
                    moves_by_id[str(g["id"])] = g

    if os.path.exists(TIER_CACHE_FILE):
        with open(TIER_CACHE_FILE, "r", encoding="utf-8") as f:
            tier_data = json.load(f)
            for user, games in tier_data.items():
                for g in games:
                    moves_by_id[str(g["id"])] = g

    print(f"Indexed raw moves for {len(moves_by_id)} total games in source files.")
    return moves_by_id


def init_db(db_path: str = DB_CACHE_FILE) -> sqlite3.Connection:
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA synchronous=NORMAL;")
    return conn


def get_all_needed_fens(fens: List[str], db_path: str = DB_CACHE_FILE) -> Dict[str, List[Dict[str, Any]]]:
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


def main():
    t0 = time.time()
    targets = load_target_games()
    moves_dict = load_game_moves_dict()

    # Verify coverage
    missing_moves = [g for g in targets if str(g["id"]) not in moves_dict]
    if missing_moves:
        print(f"Warning: {len(missing_moves)} games have no moves in moves_dict!")
    else:
        print("All 626 games matched with raw move lists!")

    # Collect all positions
    all_fens = set()
    for g in targets:
        m_game = moves_dict[str(g["id"])]
        board = chess.Board()
        all_fens.add(board.fen())
        for m in m_game.get("moves", []):
            try:
                cm = board.parse_san(m["san"])
            except Exception:
                cm = chess.Move.from_uci(f"{m['from']}{m['to']}{m.get('promotion') or ''}")
            board.push(cm)
            all_fens.add(board.fen())

    print(f"Collected {len(all_fens)} unique FEN positions across all 626 games.")
    print("Loading precomputed engine evaluations from SQLite cache...")
    fen_evals = get_all_needed_fens(list(all_fens))
    print(f"Loaded {len(fen_evals)} / {len(all_fens)} evaluations ({len(fen_evals)/len(all_fens)*100:.1f}% coverage).")

    processed_games = []
    for idx, tg in enumerate(targets):
        gid = str(tg["id"])
        m_game = moves_dict[gid]
        moves = m_game.get("moves", [])

        board = chess.Board()
        n_evals = [{"lines": fen_evals.get(board.fen(), [])}]
        for m in moves:
            try:
                cm = board.parse_san(m["san"])
            except Exception:
                cm = chess.Move.from_uci(f"{m['from']}{m['to']}{m.get('promotion') or ''}")
            board.push(cm)
            n_evals.append({"lines": fen_evals.get(board.fen(), [])})

        rev = _run_single_pass_review_sync(
            None,
            [dict(m) for m in moves],
            white_rating=tg.get("white_rating"),
            black_rating=tg.get("black_rating"),
            external_evals=n_evals,
        )

        # Extract drops and classifications
        white_drops, black_drops = [], []
        white_classes, black_classes = [], []
        last_eval, last_mate = 0.2, None

        for m in rev["moves"]:
            color = m.get("color", "w")
            eval_obj = m.get("eval") or {}
            curr_before = eval_obj.get("evalBefore", last_eval)
            mate_before = eval_obj.get("mateBefore", last_mate)
            curr_after = eval_obj.get("evalAfter", curr_before)
            mate_after = eval_obj.get("mateAfter", mate_before)

            w_before = eval_to_win_pct(curr_before, mate_before)
            w_after = eval_to_win_pct(curr_after, mate_after)
            raw_drop = max(0.0, w_before - w_after if color == "w" else (100.0 - w_before) - (100.0 - w_after))

            cls_ = m.get("classification") or "good"
            if cls_ in ("book", "forced", "best", "great"):
                drop = min(raw_drop, 0.5)
            elif cls_ in ("brilliant", "excellent"):
                drop = min(raw_drop, 2.0)
            elif cls_ == "good":
                drop = min(max(raw_drop, 0.5), 5.0)
            elif cls_ == "inaccuracy":
                drop = min(max(raw_drop, 4.5), 14.0)
            elif cls_ in ("mistake", "miss"):
                drop = min(max(raw_drop, 7.0), 25.0)
            elif cls_ == "blunder":
                drop = max(raw_drop, 18.0)
            else:
                drop = raw_drop

            if color == "w":
                white_drops.append(round(drop, 3))
                white_classes.append(cls_)
            else:
                black_drops.append(round(drop, 3))
                black_classes.append(cls_)

            last_eval, last_mate = curr_after, mate_after

        # Current formula accuracy
        curr_acc = calculate_game_accuracy(rev["moves"], level="standard")

        processed_games.append({
            "id": gid,
            "user": tg["user"],
            "time_class": tg.get("time_class"),
            "white_user": tg.get("white_user"),
            "white_rating": tg.get("white_rating"),
            "black_user": tg.get("black_user"),
            "black_rating": tg.get("black_rating"),
            "cc": tg["cc"],
            "current": curr_acc,
            "white_drops": white_drops,
            "black_drops": black_drops,
            "white_classes": white_classes,
            "black_classes": black_classes,
        })

        if (idx + 1) % 50 == 0 or (idx + 1) == len(targets):
            print(f"Processed {idx + 1}/{len(targets)} games ({((idx + 1)/len(targets))*100:.1f}%)...")

    with open(OUTPUT_DROPS_FILE, "w", encoding="utf-8") as f:
        json.dump(processed_games, f)

    print(f"\nSuccessfully extracted drops for {len(processed_games)} games in {time.time() - t0:.1f}s.")
    print(f"Saved dataset to {OUTPUT_DROPS_FILE}.")


if __name__ == "__main__":
    main()
