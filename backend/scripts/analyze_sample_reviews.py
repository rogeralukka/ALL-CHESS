"""Analyzes move classifications, arrows, squares, and commentary for the 149-game calibration sample.
"""

import json
import os
import sqlite3
import sys
from collections import Counter, defaultdict
from typing import Any, Dict, List

import chess

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(HERE)
sys.path.insert(0, BACKEND_DIR)
os.environ.setdefault("APP_PASSCODE", "dev-local-test-pass")
os.environ.setdefault("SESSION_SECRET", "dev-local-test-secret-0123456789abcdef")
os.environ.setdefault("TESTING", "1")

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

BANNED_FILLER_WORDS = [
    "tactical harmony",
    "piece harmony",
    "positional continuation",
    "sharp and critical continuation",
    "keeps the balance",
    "keeping your position steady",
    "maintains maximum pressure",
    "maintains tactical harmony",
    "solid positional continuation",
    "firmer positional pressure",
    "engine recommended line",
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
    print("Loading filtered games from cache...")
    with open(FILTERED_DATA_FILE, "r", encoding="utf-8") as f:
        filtered_by_user = json.load(f)

    # Reconstruct the exact 149 stratified sample games
    from scripts.fit_accuracy_vs_chesscom import sample_stratified_games
    sample_games = sample_stratified_games(filtered_by_user, n_sample=150)
    print(f"Loaded {len(sample_games)} sample games.")

    # Gather all FENs
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

    print(f"Loading {len(all_fens)} cached FEN evaluations from SQLite...")
    fen_dict = load_cached_fens(list(all_fens))
    print(f"Loaded {len(fen_dict)} FENs from cache.")

    # Run reviews
    print("Reviewing games...")
    total_moves = 0
    class_counts_overall = Counter()
    class_counts_by_user = defaultdict(Counter)

    arrow_counts_by_kind = Counter()
    arrows_by_class = defaultdict(Counter)
    square_counts_by_kind = Counter()
    squares_by_class = defaultdict(Counter)

    explain_total_eligible = 0
    explain_filled_count = 0
    explain_char_lengths = []
    banned_filler_hits = []

    reason_categories = Counter()
    sample_moves_by_class = {}

    for g_idx, g in enumerate(sample_games):
        user = g["user"]
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

        for m_idx, m in enumerate(rev["moves"]):
            total_moves += 1
            cls = m.get("classification") or "good"
            class_counts_overall[cls] += 1
            class_counts_by_user[user][cls] += 1

            ann = m.get("annotations") or {}
            arrows = ann.get("arrows") or []
            squares = ann.get("squares") or []
            explain = ann.get("explain") or []

            # Arrows
            for arr in arrows:
                k = arr.get("kind")
                arrow_counts_by_kind[k] += 1
                arrows_by_class[cls][k] += 1

            # Squares
            for sq in squares:
                k = sq.get("kind")
                t = sq.get("tone")
                lbl = f"{k} ({t})" if t else k
                square_counts_by_kind[lbl] += 1
                squares_by_class[cls][lbl] += 1

            # Commentary & Explain
            is_eligible_for_explain = cls not in ("book", "forced")
            if is_eligible_for_explain:
                explain_total_eligible += 1
                if explain:
                    explain_filled_count += 1
                    for sent in explain:
                        explain_char_lengths.append(len(sent))
                        s_low = sent.lower()
                        for b in BANNED_FILLER_WORDS:
                            if b in s_low:
                                banned_filler_hits.append((g["id"], m_idx, sent, b))

                        # Categorize reason
                        if "win" in s_low or "gain" in s_low or "lose" in s_low or "loss" in s_low:
                            reason_categories["Material (SEE / Capture)"] += 1
                        elif "fork" in s_low:
                            reason_categories["Fork"] += 1
                        elif "pin" in s_low:
                            reason_categories["Pin"] += 1
                        elif "skewer" in s_low:
                            reason_categories["Skewer"] += 1
                        elif "mate" in s_low:
                            reason_categories["Mate / Mate Threat"] += 1
                        elif "check" in s_low:
                            reason_categories["Check"] += 1
                        elif "hanging" in s_low or "undefended" in s_low:
                            reason_categories["Hanging Piece"] += 1
                        elif "castl" in s_low or "king safe" in s_low:
                            reason_categories["King Safety / Castling"] += 1
                        elif "centre" in s_low or "center" in s_low:
                            reason_categories["Centre Control"] += 1
                        elif "passed pawn" in s_low or "pawn" in s_low:
                            reason_categories["Pawn Play"] += 1
                        elif "develop" in s_low:
                            reason_categories["Development"] += 1
                        else:
                            reason_categories["Positional / Continuation"] += 1

            # Check lines why
            ev = m.get("eval") or {}
            for line in ev.get("lines") or []:
                w = line.get("why")
                if w:
                    w_low = w.lower()
                    for b in BANNED_FILLER_WORDS:
                        if b in w_low:
                            banned_filler_hits.append((g["id"], m_idx, w, b))

            # Store one good sample per class for reporting
            if cls not in sample_moves_by_class and explain:
                sample_moves_by_class[cls] = {
                    "san": m.get("san"),
                    "class": cls,
                    "eval": m.get("eval", {}).get("eval"),
                    "coach": m.get("coachComment"),
                    "arrows": [f"{a['kind']}:{a['from']}->{a['to']}" for a in arrows[:2]],
                    "squares": [f"{s['kind']}:{s['square']}" for s in squares[:2]],
                    "explain": explain[0] if explain else None,
                }

    # Save summary stats to json
    results = {
        "total_games": len(sample_games),
        "total_moves": total_moves,
        "class_counts_overall": dict(class_counts_overall),
        "class_counts_by_user": {u: dict(c) for u, c in class_counts_by_user.items()},
        "arrow_counts_by_kind": dict(arrow_counts_by_kind),
        "arrows_by_class": {cls: dict(c) for cls, c in arrows_by_class.items()},
        "square_counts_by_kind": dict(square_counts_by_kind),
        "squares_by_class": {cls: dict(c) for cls, c in squares_by_class.items()},
        "explain_total_eligible": explain_total_eligible,
        "explain_filled_count": explain_filled_count,
        "explain_coverage_pct": (explain_filled_count / explain_total_eligible * 100) if explain_total_eligible else 0,
        "explain_avg_char_length": sum(explain_char_lengths) / len(explain_char_lengths) if explain_char_lengths else 0,
        "explain_max_char_length": max(explain_char_lengths) if explain_char_lengths else 0,
        "banned_filler_hits_count": len(banned_filler_hits),
        "reason_categories": dict(reason_categories),
        "sample_moves_by_class": sample_moves_by_class,
    }

    out_file = os.path.join(CACHE_DIR, "review_analysis_149_games.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    print(f"\nAnalysis complete! Results saved to {out_file}")
    return results


if __name__ == "__main__":
    main()
