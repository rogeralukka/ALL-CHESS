"""Generates an exhaustive game-by-game breakdown across the 149 evaluated games:
- Move classifications per game (brilliant, great, best, excellent, good, book, forced, inaccuracy, mistake, miss, blunder)
- Accuracy comparisons vs Chess.com (ours vs CC, diff W/B)
- Arrow and square counts per game
- Deep dive on Roger's 37 games
- Outlier analysis: worst errors and why they happen
"""

import json
import os
import sqlite3
import sys
from collections import Counter
from typing import Any, Dict, List

import chess

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(HERE)
sys.path.insert(0, BACKEND_DIR)
os.environ.setdefault("APP_PASSCODE", "dev-local-test-pass")
os.environ.setdefault("SESSION_SECRET", "dev-local-test-secret-0123456789abcdef")
os.environ.setdefault("TESTING", "1")

from app.services.accuracy import calculate_game_accuracy
from app.services.engine_service import _run_single_pass_review_sync

CACHE_DIR = os.path.join(BACKEND_DIR, ".cache")
FILTERED_DATA_FILE = os.path.join(CACHE_DIR, "chesscom_filtered_games.json")
DB_CACHE_FILE = os.path.join(CACHE_DIR, "fen_evals.sqlite")

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


def load_cached_fens(fens: List[str]) -> Dict[str, List[Dict[str, Any]]]:
    conn = sqlite3.connect(DB_CACHE_FILE)
    cached = {}
    chunk_size = 900
    for i in range(0, len(fens), chunk_size):
        chunk = fens[i : i + chunk_size]
        q = f"SELECT fen, lines_json FROM fen_evals WHERE fen IN ({','.join(['?']*len(chunk))})"
        cursor = conn.execute(q, chunk)
        for fen, lines_json in cursor.fetchall():
            cached[fen] = json.loads(lines_json)
    conn.close()
    return cached


def main():
    with open(FILTERED_DATA_FILE, "r", encoding="utf-8") as f:
        filtered_by_user = json.load(f)

    from scripts.fit_accuracy_vs_chesscom import sample_stratified_games
    sample_games = sample_stratified_games(filtered_by_user, n_sample=150)

    # Collect all FENs
    all_fens = set()
    for g in sample_games:
        b = chess.Board()
        all_fens.add(b.fen())
        for m in g["moves"]:
            try:
                cm = b.parse_san(m["san"])
            except Exception:
                cm = chess.Move.from_uci(f"{m['from']}{m['to']}{m.get('promotion') or ''}")
            b.push(cm)
            all_fens.add(b.fen())

    fen_dict = load_cached_fens(list(all_fens))
    game_reports = []

    for g in sample_games:
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

        # Classification counts by color
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

            # Save brilliant, great, or major blunder moves
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

    out_file = os.path.join(CACHE_DIR, "game_by_game_149_analysis.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(game_reports, f, indent=2)
    print(f"Game by game analysis saved to {out_file} (total {len(game_reports)} games).")


if __name__ == "__main__":
    main()
