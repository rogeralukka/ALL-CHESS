"""Batch 6: 400 Games Multi-Tier Evaluation
Accounts (100 games each):
- hikaru (~3300+ Elo Super GM)
- jynxzii (~464 Elo Casual Streamer)
- samayraina (~1608 Elo Strong Club)
- garythursday (~2307 Elo Candidate Master)

Total: 400 games (800 player-game evaluations) evaluated with Stockfish 19 Depth 18 MultiPV 3.
Side-by-side comparison:
  Chess.com numbers -> Our Current Formula -> Upgraded Formula
  Both Accuracy (%) and Game Review Performance Rating (Elo)
"""

import json
import math
import multiprocessing as mp
import os
import sqlite3
import sys
import time
from collections import Counter, defaultdict
from typing import Any, Dict, List, Optional, Tuple

import chess
import chess.engine

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(HERE)
sys.path.insert(0, BACKEND_DIR)
os.environ.setdefault("APP_PASSCODE", "dev-local-test-pass")
os.environ.setdefault("SESSION_SECRET", "dev-local-test-secret-0123456789abcdef")
os.environ.setdefault("TESTING", "1")

from app.services.accuracy import (
    calculate_game_accuracy,
    estimate_game_rating,
)
from app.services.engine_service import _run_single_pass_review_sync
from app.services.win_pct import eval_to_win_pct
from scripts.accuracy_v2_candidate import (
    calculate_player_accuracy_v2,
    estimate_game_rating_v2,
    move_accuracy_v2,
)

CACHE_DIR = os.path.join(BACKEND_DIR, ".cache")
RAW_DATA_FILE = os.path.join(CACHE_DIR, "batch6_raw_400_games.json")
DB_CACHE_FILE = os.path.join(CACHE_DIR, "fen_evals.sqlite")
BATCH6_OUT_FILE = os.path.join(CACHE_DIR, "game_by_game_batch6.json")
BATCH6_DROPS_FILE = os.path.join(CACHE_DIR, "drops_batch6_400.json")
ALL_1226_FILE = os.path.join(CACHE_DIR, "drops_all_1226_games.json")
ALL_1626_FILE = os.path.join(CACHE_DIR, "drops_all_1626_games.json")


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
    raise FileNotFoundError(f"Stockfish executable not found at: {path}")


def worker_eval_fens(args: Tuple[List[str], str]) -> List[Tuple[str, List[Dict[str, Any]]]]:
    fen_chunk, sf_path = args
    results = []
    engine = None
    try:
        engine = chess.engine.SimpleEngine.popen_uci(sf_path)
        engine.configure({"Threads": 1, "Hash": 16})
        for fen in fen_chunk:
            b = chess.Board(fen)
            if b.is_game_over():
                results.append((fen, []))
                continue
            infos = engine.analyse(b, chess.engine.Limit(depth=18), multipv=3)
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
    except Exception as e:
        print(f"[Worker Error] {e}", flush=True)
    finally:
        if engine:
            try:
                engine.quit()
            except Exception:
                pass
    return results


def evaluate_positions_parallel(games: List[Dict[str, Any]], num_workers: int = 14) -> None:
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

    print(f"Total positions in Batch 6: {len(all_fens)} unique FENs across {len(games)} games.", flush=True)
    cached = get_cached_fens(list(all_fens))
    missing = [f for f in all_fens if f not in cached]
    print(f"Already cached in DB: {len(cached)} FENs ({len(cached)/len(all_fens)*100:.1f}%). Need to evaluate: {len(missing)} FENs.", flush=True)

    if not missing:
        return

    stockfish_path = get_stockfish_executable_path()
    t0 = time.time()
    chunk_size = 35
    batches = [missing[i : i + chunk_size] for i in range(0, len(missing), chunk_size)]
    worker_args = [(batch, stockfish_path) for batch in batches]

    print(f"Evaluating {len(missing)} positions with {num_workers} parallel workers in {len(batches)} batches...", flush=True)
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
            if completed % 350 < 35 or completed >= len(missing):
                print(f"Progress: {completed}/{len(missing)} FENs ({pct:.1f}%) | {rate:.1f} FEN/s | ETA: {eta/60:.1f}m", flush=True)

    print(f"Completed engine evaluation in {time.time() - t0:.1f}s.\n", flush=True)


def compute_drops_and_upgraded(moves: List[Dict[str, Any]]) -> Tuple[List[float], List[str], List[float], List[str], float, float]:
    white_drops, black_drops = [], []
    white_classes, black_classes = [], []
    last_eval, last_mate = 0.2, None

    for m in moves:
        color = m.get("color", "w")
        ev = m.get("eval") or {}
        curr_b_val = ev.get("evalBefore", last_eval)
        mate_b_val = ev.get("mateBefore", last_mate)
        curr_a_val = ev.get("evalAfter", curr_b_val)
        mate_a_val = ev.get("mateAfter", mate_b_val)

        w_b = eval_to_win_pct(curr_b_val, mate_b_val)
        w_a = eval_to_win_pct(curr_a_val, mate_a_val)

        missed_mate = False
        if color == "w":
            if mate_b_val is not None and mate_b_val > 0 and mate_a_val is None and w_a < 85.0:
                missed_mate = True
        else:
            if mate_b_val is not None and mate_b_val < 0 and mate_a_val is None and w_a > 15.0:
                missed_mate = True

        if missed_mate:
            drop = 25.0
            cls_ = "miss"
        else:
            raw = max(0.0, w_b - w_a if color == "w" else (100.0 - w_b) - (100.0 - w_a))
            cls_ = m.get("classification") or "good"
            if cls_ in ("book", "forced", "best", "great"):
                drop = min(raw, 0.5)
            elif cls_ in ("brilliant", "excellent"):
                drop = min(raw, 2.0)
            elif cls_ == "good":
                drop = min(max(raw, 0.5), 5.0)
            elif cls_ == "inaccuracy":
                drop = min(max(raw, 4.5), 14.0)
            elif cls_ in ("mistake", "miss"):
                drop = min(max(raw, 7.0), 25.0)
            elif cls_ == "blunder":
                drop = max(raw, 18.0)
            else:
                drop = raw

        if color == "w":
            white_drops.append(round(drop, 3))
            white_classes.append(cls_)
        else:
            black_drops.append(round(drop, 3))
            black_classes.append(cls_)

        last_eval, last_mate = curr_a_val, mate_a_val

    w_m_accs = [move_accuracy_v2(d) for d in white_drops]
    b_m_accs = [move_accuracy_v2(d) for d in black_drops]

    impr_w = calculate_player_accuracy_v2(w_m_accs, white_drops, white_classes) or 100.0
    impr_b = calculate_player_accuracy_v2(b_m_accs, black_drops, black_classes) or 100.0

    return white_drops, white_classes, black_drops, black_classes, impr_w, impr_b


def main():
    t_start = time.time()
    print("=" * 100)
    print("BATCH 6: 400 GAMES EVALUATION (Hikaru, Jynxzii, SamayRaina, GaryThursday)")
    print("=" * 100, flush=True)

    with open(RAW_DATA_FILE, "r", encoding="utf-8") as f:
        batch6_games = json.load(f)

    print(f"Loaded {len(batch6_games)} games from {RAW_DATA_FILE}.")
    by_user = Counter(g["user"] for g in batch6_games)
    for u, count in by_user.items():
        print(f"  {u:<15}: {count} games")

    # 1. Parallel Stockfish Engine Evaluation
    print("\n--- Phase 1: Stockfish Evaluation ---", flush=True)
    evaluate_positions_parallel(batch6_games, num_workers=14)

    # 2. Load all positions from SQLite DB
    print("--- Phase 2: Loading FEN Evaluations ---", flush=True)
    all_fens = set()
    for g in batch6_games:
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
    print(f"Loaded {len(fen_dict)} FEN evaluations from SQLite DB.\n", flush=True)

    # 3. Game-by-Game Review & Comparisons
    print("--- Phase 3: Single-Pass Reviews & Formula Comparisons ---", flush=True)
    game_reports = []
    drops_dataset = []

    account_stats = defaultdict(lambda: {
        "cc_acc": [], "curr_acc": [], "impr_acc": [],
        "cc_rat": [], "curr_rat": [], "impr_rat": [],
        "c_acc_err": [], "i_acc_err": [],
        "c_rat_err": [], "i_rat_err": [],
    })

    sample_games_to_print = []

    for idx, g in enumerate(batch6_games):
        user = g["user"]
        gid = str(g["id"])
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

        # Current formula
        curr_acc_dict = calculate_game_accuracy(rev["moves"], level="standard")
        curr_w = curr_acc_dict.get("white") or 100.0
        curr_b = curr_acc_dict.get("black") or 100.0

        # Upgraded formula
        w_drops, w_classes, b_drops, b_classes, impr_w, impr_b = compute_drops_and_upgraded(rev["moves"])

        cc_w, cc_b = g["cc"]["white"], g["cc"]["black"]

        # Performance Ratings
        cc_r_w = estimate_game_rating(cc_w) or 1500
        cc_r_b = estimate_game_rating(cc_b) or 1500
        curr_r_w = estimate_game_rating(curr_w) or 1500
        curr_r_b = estimate_game_rating(curr_b) or 1500
        impr_r_w = estimate_game_rating_v2(impr_w) or 1500
        impr_r_b = estimate_game_rating_v2(impr_b) or 1500

        # Save drops
        drops_dataset.append({
            "id": gid,
            "user": user,
            "time_class": g.get("time_class"),
            "white_user": g.get("white_user"),
            "white_rating": g.get("white_rating"),
            "black_user": g.get("black_user"),
            "black_rating": g.get("black_rating"),
            "cc": {"white": cc_w, "black": cc_b},
            "white_drops": w_drops,
            "black_drops": b_drops,
            "white_classes": w_classes,
            "black_classes": b_classes,
        })

        # Save detailed report
        game_reports.append({
            "id": gid,
            "user": user,
            "cc": {"white": cc_w, "black": cc_b, "ratings": {"white": cc_r_w, "black": cc_r_b}},
            "current": {"white": curr_w, "black": curr_b, "ratings": {"white": curr_r_w, "black": curr_r_b}},
            "improved": {"white": impr_w, "black": impr_b, "ratings": {"white": impr_r_w, "black": impr_r_b}},
            "white_user": g.get("white_user"),
            "white_rating": g.get("white_rating"),
            "black_user": g.get("black_user"),
            "black_rating": g.get("black_rating"),
        })

        # Track stats
        for color, cc_a, cu_a, im_a, cc_r, cu_r, im_r in [
            ("white", cc_w, curr_w, impr_w, cc_r_w, curr_r_w, impr_r_w),
            ("black", cc_b, curr_b, impr_b, cc_r_b, curr_r_b, impr_r_b),
        ]:
            st = account_stats[user]
            st["cc_acc"].append(cc_a)
            st["curr_acc"].append(cu_a)
            st["impr_acc"].append(im_a)
            st["cc_rat"].append(cc_r)
            st["curr_rat"].append(cu_r)
            st["impr_rat"].append(im_r)
            st["c_acc_err"].append(abs(cu_a - cc_a))
            st["i_acc_err"].append(abs(im_a - cc_a))
            st["c_rat_err"].append(abs(cu_r - cc_r))
            st["i_rat_err"].append(abs(im_r - cc_r))

        # Collect sample rows for display (2 games per user)
        if len([s for s in sample_games_to_print if s["user"] == user]) < 2:
            sample_games_to_print.append({
                "id": gid,
                "user": user,
                "w_user": g.get("white_user"),
                "w_rating": g.get("white_rating"),
                "b_user": g.get("black_user"),
                "b_rating": g.get("black_rating"),
                "cc_w": cc_w, "cc_b": cc_b,
                "curr_w": curr_w, "curr_b": curr_b,
                "impr_w": impr_w, "impr_b": impr_b,
                "cc_r_w": cc_r_w, "cc_r_b": cc_r_b,
                "curr_r_w": curr_r_w, "curr_r_b": curr_r_b,
                "impr_r_w": impr_r_w, "impr_r_b": impr_r_b,
            })

        if (idx + 1) % 50 == 0 or idx + 1 == len(batch6_games):
            print(f"Processed {idx + 1} / {len(batch6_games)} games...", flush=True)

    # 4. Save Batch 6 JSON caches
    with open(BATCH6_DROPS_FILE, "w", encoding="utf-8") as f:
        json.dump(drops_dataset, f)
    with open(BATCH6_OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(game_reports, f, indent=2)

    # 5. Merge with existing 1,226 games -> 1,626 total games!
    if os.path.exists(ALL_1226_FILE):
        with open(ALL_1226_FILE, "r", encoding="utf-8") as f:
            prev_1226 = json.load(f)
        all_1626 = prev_1226 + drops_dataset
        with open(ALL_1626_FILE, "w", encoding="utf-8") as f:
            json.dump(all_1626, f)
        print(f"\nSuccessfully combined 1,226 + 400 = {len(all_1626)} games in {ALL_1626_FILE}!")

    # 6. Print Comparison Tables
    print("\n" + "=" * 115)
    print("BATCH 6 SUMMARY (400 NEW GAMES / 800 EVALUATIONS)")
    print("=" * 115)
    print(f"{'Account / Tier':<22} | {'Evals':<5} | {'Chess.com Acc':<13} | {'Current Acc':<13} | {'Upgraded Acc':<13} | {'Chess.com Rating':<16} | {'Current Rating':<16} | {'Upgraded Rating':<16}")
    print("-" * 115)

    tot_c_acc_err, tot_i_acc_err = [], []
    tot_c_rat_err, tot_i_rat_err = [], []

    for user in ["jynxzii", "samayraina", "garythursday", "hikaru"]:
        st = account_stats[user]
        n = len(st["cc_acc"])
        avg_cc_a = sum(st["cc_acc"]) / n
        avg_cu_a = sum(st["curr_acc"]) / n
        avg_im_a = sum(st["impr_acc"]) / n
        avg_cc_r = sum(st["cc_rat"]) / n
        avg_cu_r = sum(st["curr_rat"]) / n
        avg_im_r = sum(st["impr_rat"]) / n

        mae_c_a = sum(st["c_acc_err"]) / n
        mae_i_a = sum(st["i_acc_err"]) / n
        mae_c_r = sum(st["c_rat_err"]) / n
        mae_i_r = sum(st["i_rat_err"]) / n

        tot_c_acc_err.extend(st["c_acc_err"])
        tot_i_acc_err.extend(st["i_acc_err"])
        tot_c_rat_err.extend(st["c_rat_err"])
        tot_i_rat_err.extend(st["i_rat_err"])

        print(f"{user:<22} | {n:<5} | {avg_cc_a:5.1f}%        | {avg_cu_a:5.1f}% ({mae_c_a:.1f}) | {avg_im_a:5.1f}% ({mae_i_a:.1f}) | {int(round(avg_cc_r)):<4}             | {int(round(avg_cu_r)):<4} (err {mae_c_r:.0f}) | {int(round(avg_im_r)):<4} (err {mae_i_r:.0f})")

    n_tot = len(tot_c_acc_err)
    print("-" * 115)
    print(f"{'BATCH 6 OVERALL':<22} | {n_tot:<5} | {'':<13} | MAE: {sum(tot_c_acc_err)/n_tot:.2f}%     | MAE: {sum(tot_i_acc_err)/n_tot:.2f}%     | {'':<16} | MAE: {sum(tot_c_rat_err)/n_tot:.1f} pts     | MAE: {sum(tot_i_rat_err)/n_tot:.1f} pts")
    print("=" * 115)

    print("\n" + "=" * 140)
    print("SAMPLE GAME-BY-GAME SIDE-BY-SIDE COMPARISON TABLE")
    print("=" * 140)
    print(f"{'Game ID':<13} {'Color (Elo)':<18} {'Chess.com Acc':<14} {'Current Acc':<13} {'Improved Acc':<13} {'Chess.com Rat':<14} {'Current Rat':<13} {'Improved Rat':<13} {'Acc Error':<16} {'Rating Error':<16}")
    print("-" * 140)

    for s in sample_games_to_print:
        # White row
        w_acc_err_c = abs(s["curr_w"] - s["cc_w"])
        w_acc_err_i = abs(s["impr_w"] - s["cc_w"])
        w_rat_err_c = abs(s["curr_r_w"] - s["cc_r_w"])
        w_rat_err_i = abs(s["impr_r_w"] - s["cc_r_w"])
        w_col = f"White ({s['w_rating'] or '?'})"
        print(f"{s['id']:<13} {w_col:<18} {s['cc_w']:5.1f}%         {s['curr_w']:5.1f}%        {s['impr_w']:5.1f}%        {s['cc_r_w']:<14} {s['curr_r_w']:<13} {s['impr_r_w']:<13} {w_acc_err_c:4.1f} -> {w_acc_err_i:4.1f}     {w_rat_err_c:3.0f} -> {w_rat_err_i:3.0f}")

        # Black row
        b_acc_err_c = abs(s["curr_b"] - s["cc_b"])
        b_acc_err_i = abs(s["impr_b"] - s["cc_b"])
        b_rat_err_c = abs(s["curr_r_b"] - s["cc_r_b"])
        b_rat_err_i = abs(s["impr_r_b"] - s["cc_r_b"])
        b_col = f"Black ({s['b_rating'] or '?'})"
        print(f"{s['id']:<13} {b_col:<18} {s['cc_b']:5.1f}%         {s['curr_b']:5.1f}%        {s['impr_b']:5.1f}%        {s['cc_r_b']:<14} {s['curr_r_b']:<13} {s['impr_r_b']:<13} {b_acc_err_c:4.1f} -> {b_acc_err_i:4.1f}     {b_rat_err_c:3.0f} -> {b_rat_err_i:3.0f}")

    print("=" * 140)
    print(f"\nBatch 6 pipeline finished in {time.time() - t_start:.1f}s.")


if __name__ == "__main__":
    main()
