"""Batch 5: 600 Games Multi-Tier Evaluation
Accounts (150 games each):
- jynxzii (~464 Elo Casual Streamer)
- samayraina (~1608 Elo Strong Club)
- garythursday (~2307 Elo Candidate Master)
- hikaru (~3300 Elo Super GM)

Total: 600 games (1,200 player-game evaluations) evaluated with Stockfish 19 Depth 18 MultiPV 3.
Computes side-by-side:
  Chess.com numbers -> Our Current Formula -> Improved Formula
  Both Accuracy (%) and Performance Rating (Elo)
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
    estimate_performance_ratings,
)
from app.services.engine_service import _run_single_pass_review_sync
from app.services.win_pct import eval_to_win_pct

CACHE_DIR = os.path.join(BACKEND_DIR, ".cache")
RAW_DATA_FILE = os.path.join(CACHE_DIR, "batch5_raw_600_games.json")
DB_CACHE_FILE = os.path.join(CACHE_DIR, "fen_evals.sqlite")
BATCH5_OUT_FILE = os.path.join(CACHE_DIR, "game_by_game_batch5.json")
BATCH5_DROPS_FILE = os.path.join(CACHE_DIR, "drops_batch5_600.json")

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
    results = []
    engine = None
    try:
        engine = chess.engine.SimpleEngine.popen_uci(stockfish_path)
        engine.configure({"Threads": 1, "Hash": 16})
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

    print(f"Total positions in batch 5: {len(all_fens)} unique FENs across {len(games)} games.", flush=True)
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

    print(f"Completed engine evaluation in {time.time() - t0:.1f}s.", flush=True)


def calc_improved(drops: List[float], classes: List[str], s: float = 8.0, p: float = 1.10, wp: float = 0.30, coeff: float = 0.50) -> float:
    if not drops:
        return 100.0
    accs = [max(0.0, min(100.0, round(100.0 * math.exp(-((d / s) ** p)), 1))) for d in drops]
    weights = [(1.0 + d / 5.0) ** wp for d in drops]
    base_acc = sum(w * a for w, a in zip(weights, accs)) / sum(weights)

    # Blunder frequency dampener
    n_blunders = sum(1 for cls in classes if cls in ("blunder", "miss"))
    blunder_rate = n_blunders / len(drops)
    if blunder_rate > 0.12:
        reduction = (blunder_rate - 0.12) * coeff
        return round(max(15.0, base_acc * (1.0 - reduction)), 1)
    return round(base_acc, 1)


def main():
    print("=" * 100)
    print("BATCH 5: 600 GAMES EVALUATION (Jynxzii, SamayRaina, GaryThursday, Hikaru)")
    print("=" * 100, flush=True)

    with open(RAW_DATA_FILE, "r", encoding="utf-8") as f:
        batch5_games = json.load(f)

    print(f"Loaded {len(batch5_games)} raw games from {RAW_DATA_FILE}.")
    by_user = Counter(g["user"] for g in batch5_games)
    for u, count in by_user.items():
        print(f"  {u:<15}: {count} games")

    # 1. Parallel Stockfish engine evaluation
    t_engine_start = time.time()
    evaluate_positions_parallel(batch5_games, num_workers=14)
    print(f"Engine evaluation phase completed in {time.time() - t_engine_start:.1f}s.\n", flush=True)

    # 2. Load all cached positions for Batch 5
    print("Loading all position evaluations from SQLite DB...", flush=True)
    all_fens = set()
    for g in batch5_games:
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

    # 3. Game-by-game review, accuracy & performance rating extraction
    print("Running single-pass reviews, accuracy, performance ratings, and commentary...", flush=True)
    game_reports = []
    drops_dataset = []

    account_stats = defaultdict(lambda: {
        "cc_acc": [], "curr_acc": [], "impr_acc": [],
        "cc_rat": [], "curr_rat": [], "impr_rat": [],
        "c_acc_err": [], "i_acc_err": [],
        "c_rat_err": [], "i_rat_err": [],
    })

    t_review_start = time.time()

    for idx, g in enumerate(batch5_games):
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

        # Current formula accuracy
        curr_acc_dict = calculate_game_accuracy(rev["moves"], level="standard")
        curr_w = curr_acc_dict.get("white") or 100.0
        curr_b = curr_acc_dict.get("black") or 100.0

        # Extract drops and classifications with Missed Forced Mate check
        white_drops, black_drops = [], []
        white_classes, black_classes = [], []
        last_eval, last_mate = 0.2, None
        has_missed_mate = False

        for m in rev["moves"]:
            color = m.get("color", "w")
            ev = m.get("eval") or {}
            curr_b_val = ev.get("evalBefore", last_eval)
            mate_b_val = ev.get("mateBefore", last_mate)
            curr_a_val = ev.get("evalAfter", curr_b_val)
            mate_a_val = ev.get("mateAfter", mate_b_val)

            w_b = eval_to_win_pct(curr_b_val, mate_b_val)
            w_a = eval_to_win_pct(curr_a_val, mate_a_val)

            # Missed mate check
            missed_mate = False
            if color == "w":
                if mate_b_val is not None and mate_b_val > 0 and mate_a_val is None and w_a < 85.0:
                    missed_mate = True
            else:
                if mate_b_val is not None and mate_b_val < 0 and mate_a_val is None and w_a > 15.0:
                    missed_mate = True

            if missed_mate:
                has_missed_mate = True
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

        # Compute improved formula accuracies
        impr_w = calc_improved(white_drops, white_classes)
        impr_b = calc_improved(black_drops, black_classes)

        cc_w, cc_b = g["cc"]["white"], g["cc"]["black"]

        # Performance Ratings
        cc_r_w = estimate_game_rating(cc_w) or 1500
        cc_r_b = estimate_game_rating(cc_b) or 1500
        curr_r_w = estimate_game_rating(curr_w) or 1500
        curr_r_b = estimate_game_rating(curr_b) or 1500
        impr_r_w = estimate_game_rating(impr_w) or 1500
        impr_r_b = estimate_game_rating(impr_b) or 1500

        # Save drops structure
        drops_dataset.append({
            "id": gid,
            "user": user,
            "time_class": g.get("time_class"),
            "white_user": g.get("white_user"),
            "white_rating": g.get("white_rating"),
            "black_user": g.get("black_user"),
            "black_rating": g.get("black_rating"),
            "cc": {"white": cc_w, "black": cc_b},
            "current": {"white": curr_w, "black": curr_b},
            "improved": {"white": impr_w, "black": impr_b},
            "white_drops": white_drops,
            "black_drops": black_drops,
            "white_classes": white_classes,
            "black_classes": black_classes,
        })

        # Record statistics for each side
        for col, c_acc, i_acc, cc_a, c_rat, i_rat, cc_r in [
            ("white", curr_w, impr_w, cc_w, curr_r_w, impr_r_w, cc_r_w),
            ("black", curr_b, impr_b, cc_b, curr_r_b, impr_r_b, cc_r_b),
        ]:
            c_a_err = abs(c_acc - cc_a)
            i_a_err = abs(i_acc - cc_a)
            c_r_err = abs(c_rat - cc_r)
            i_r_err = abs(i_rat - cc_r)

            s = account_stats[user]
            s["cc_acc"].append(cc_a)
            s["curr_acc"].append(c_acc)
            s["impr_acc"].append(i_acc)
            s["cc_rat"].append(cc_r)
            s["curr_rat"].append(c_rat)
            s["impr_rat"].append(i_rat)
            s["c_acc_err"].append(c_a_err)
            s["i_acc_err"].append(i_a_err)
            s["c_rat_err"].append(c_r_err)
            s["i_rat_err"].append(i_r_err)

        # Move classifications, arrows, and squares
        counts_w = Counter(white_classes)
        counts_b = Counter(black_classes)
        arrows_w = Counter()
        arrows_b = Counter()
        squares_w = Counter()
        squares_b = Counter()
        key_moves = []

        for m_idx, m in enumerate(rev["moves"]):
            col = m.get("color", "w")
            cls = m.get("classification") or "good"
            ann = m.get("annotations") or {}
            for a in ann.get("arrows", []):
                if col == "w":
                    arrows_w[a.get("kind")] += 1
                else:
                    arrows_b[a.get("kind")] += 1
            for sq in ann.get("squares", []):
                if col == "w":
                    squares_w[sq.get("kind")] += 1
                else:
                    squares_b[sq.get("kind")] += 1

            if cls in ("brilliant", "great", "blunder", "miss"):
                key_moves.append({
                    "ply": m_idx + 1,
                    "color": col,
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
            "cc": {"white": cc_w, "black": cc_b, "ratings": {"white": cc_r_w, "black": cc_r_b}},
            "current": {"white": curr_w, "black": curr_b, "ratings": {"white": curr_r_w, "black": curr_r_b}},
            "improved": {"white": impr_w, "black": impr_b, "ratings": {"white": impr_r_w, "black": impr_r_b}},
            "counts": {
                "white": {c: counts_w[c] for c in CLASS_ORDER},
                "black": {c: counts_b[c] for c in CLASS_ORDER},
            },
            "arrows": {"white": dict(arrows_w), "black": dict(arrows_b)},
            "squares": {"white": dict(squares_w), "black": dict(squares_b)},
            "key_moves": key_moves[:5],
        })

        if (idx + 1) % 50 == 0 or (idx + 1) == len(batch5_games):
            elapsed_rev = time.time() - t_review_start
            print(f"Reviewed {idx + 1}/{len(batch5_games)} games ({elapsed_rev:.1f}s)...", flush=True)

    # Save output cache files
    with open(BATCH5_OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(game_reports, f, indent=2)
    print(f"\nSaved full game reviews to {BATCH5_OUT_FILE}.")

    with open(BATCH5_DROPS_FILE, "w", encoding="utf-8") as f:
        json.dump(drops_dataset, f, indent=2)
    print(f"Saved drops dataset to {BATCH5_DROPS_FILE}.")

    # Output master tables
    order = ["jynxzii", "samayraina", "garythursday", "hikaru"]
    display_names = {
        "jynxzii": "Jynxzii (~464 Elo Casual Streamer)",
        "samayraina": "SamayRaina (~1608 Elo Strong Club)",
        "garythursday": "GaryThursday (~2307 Elo Candidate Master)",
        "hikaru": "Hikaru (~3300 Elo Super GM)",
    }

    print("\n" + "=" * 155)
    print("BATCH 5 MASTER COMPARISON TABLE: CHESS.COM NUMBERS -> OUR CURRENT -> IMPROVED")
    print("Side-by-Side: Accuracy (%) and Estimated Performance Rating (Elo)")
    print("=" * 155)
    print(f"| {'Account / Tier':<40} | {'Evals':>5} | {'Chess.com Acc':>13} | {'Curr Acc (MAE)':>14} | {'Impr Acc (MAE)':>14} | {'CC Rating':>9} | {'Curr Rating (MAE)':>17} | {'Impr Rating (MAE)':>17} | {'Rating Diff':>11} |")
    print(f"|{'-'*42}|{'-'*7}|{'-'*15}|{'-'*16}|{'-'*16}|{'-'*11}|{'-'*19}|{'-'*19}|{'-'*13}|")

    all_c_a, all_i_a = [], []
    all_c_r, all_i_r = [], []

    for u in order:
        s = account_stats[u]
        n = len(s["cc_acc"])
        avg_cc_a = sum(s["cc_acc"]) / n
        avg_curr_a = sum(s["curr_acc"]) / n
        avg_impr_a = sum(s["impr_acc"]) / n
        mae_c_a = sum(s["c_acc_err"]) / n
        mae_i_a = sum(s["i_acc_err"]) / n

        avg_cc_r = int(round(sum(s["cc_rat"]) / n))
        avg_curr_r = int(round(sum(s["curr_rat"]) / n))
        avg_impr_r = int(round(sum(s["impr_rat"]) / n))
        mae_c_r = sum(s["c_rat_err"]) / n
        mae_i_r = sum(s["i_rat_err"]) / n

        r_delta = mae_c_r - mae_i_r
        sign = "-" if r_delta >= 0 else "+"

        all_c_a.extend(s["c_acc_err"])
        all_i_a.extend(s["i_acc_err"])
        all_c_r.extend(s["c_rat_err"])
        all_i_r.extend(s["i_rat_err"])

        better_marker = "[+]" if r_delta > 0.5 else "   "
        print(f"| {display_names[u]:<40} | {n:>5} | {avg_cc_a:>12.1f}% | {avg_curr_a:>6.1f}% ({mae_c_a:.2f}) | {avg_impr_a:>6.1f}% ({mae_i_a:.2f}) | {avg_cc_r:>9} | {avg_curr_r:>7} ({mae_c_r:5.1f}) | {avg_impr_r:>7} ({mae_i_r:5.1f}) | {sign}{abs(r_delta):>4.1f} pts {better_marker} |")

    tot_n = len(all_c_a)
    tot_mae_ca = sum(all_c_a) / tot_n
    tot_mae_ia = sum(all_i_a) / tot_n
    tot_mae_cr = sum(all_c_r) / tot_n
    tot_mae_ir = sum(all_i_r) / tot_n
    tot_r_diff = tot_mae_cr - tot_mae_ir

    print(f"| {'TOTAL OVERALL (BATCH 5: 600 GAMES)':<40} | {tot_n:>5} | {'---':>13} | {tot_mae_ca:>10.2f} MAE | {tot_mae_ia:>10.2f} MAE | {'---':>9} | {tot_mae_cr:>13.1f} MAE | {tot_mae_ir:>13.1f} MAE | -{tot_r_diff:>4.1f} pts [++] |")
    print("=" * 155)

    # Print sample games
    print("\n" + "=" * 155)
    print("REPRESENTATIVE SAMPLE GAMES: CHESS.COM NUMBERS -> OUR CURRENT -> IMPROVED")
    print("=" * 155)
    print(f"| {'Account':<14} | {'Game ID':<13} | {'Color':<5} | {'Elo':>5} | {'Chess.com Acc':>13} | {'Curr Acc':>8} | {'Impr Acc':>8} | {'CC Rating':>9} | {'Curr Rating':>11} | {'Impr Rating':>11} | {'Rating Diff':>11} |")
    print(f"|{'-'*16}|{'-'*15}|{'-'*7}|{'-'*7}|{'-'*15}|{'-'*10}|{'-'*10}|{'-'*11}|{'-'*13}|{'-'*13}|{'-'*13}|")

    for u in order:
        u_games = [g for g in game_reports if g["user"] == u]
        for g in u_games[:3]:
            for col in ("white", "black"):
                cc_a = g["cc"][col]
                curr_a = g["current"][col]
                impr_a = g["improved"][col]
                cc_r = g["cc"]["ratings"][col]
                curr_r = g["current"]["ratings"][col]
                impr_r = g["improved"]["ratings"][col]
                r_diff = abs(curr_r - cc_r) - abs(impr_r - cc_r)
                sign = "-" if r_diff >= 0 else "+"
                marker = "[+]" if r_diff > 10 else "   "
                p_elo = g.get(f"{col}_rating", 1500)
                print(f"| {u:<14} | {g['id']:<13} | {col:<5} | {p_elo:>5} | {cc_a:>12.1f}% | {curr_a:>7.1f}% | {impr_a:>7.1f}% | {cc_r:>9} | {curr_r:>11} | {impr_r:>11} | {sign}{abs(r_diff):>4} pts {marker} |")


if __name__ == "__main__":
    main()
