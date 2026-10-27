"""
Utility to compare our review classifications against Chess.com's review classifications move-by-move.
Usage:
    python scripts/compare_review.py [game_id]
"""
import sys
import os
import json
from collections import Counter
from typing import List, Dict, Any, Optional

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Ensure TESTING environment so external LLM calls are skipped
os.environ["TESTING"] = "1"

import chess.engine
from app.database import SessionLocal
from app.models.game import Game
from app.services.engine_service import _run_single_pass_review_sync, get_stockfish_executable_path
from app.services.accuracy import calculate_game_accuracy, estimate_performance_ratings


def load_ground_truth(json_path: Optional[str] = None) -> Optional[Dict[str, Any]]:
    if not json_path:
        candidates = [
            os.path.join(backend_dir, "scripts", "aahanafrr-chesscom-review.json"),
            os.path.join(backend_dir, "tests", "fixtures", "aahanafrr-chesscom-review.json"),
            os.path.join("C:\\Users\\Roger\\Downloads", "aahanafrr-chesscom-review.json"),
        ]
        for c in candidates:
            if os.path.exists(c):
                json_path = c
                break
    if json_path and os.path.exists(json_path):
        with open(json_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return None


def coarse_category(label: str) -> str:
    """Group labels into coarse buckets: good-or-better, inaccuracy, mistake-or-worse."""
    if label in ("brilliant", "great", "best", "excellent", "good", "book"):
        return "good-or-better"
    if label == "inaccuracy":
        return "inaccuracy"
    return "mistake-or-worse"  # mistake, miss, blunder


def compare_game_review(game_id: str = "game-25d06100a058", depth: int = 18):
    gt = load_ground_truth()
    db = SessionLocal()
    try:
        game = db.query(Game).filter(Game.id == game_id).first()
        if not game:
            game = db.query(Game).filter((Game.id.contains(game_id)) | (Game.external_id == game_id)).first()
        if not game:
            print(f"Game '{game_id}' not found in database.")
            return

        raw_moves = [dict(m) for m in game.moves]
        for m in raw_moves:
            for k in ['classification', 'coachComment', 'eval', 'accuracy']:
                m.pop(k, None)

        path = get_stockfish_executable_path()
        engine = chess.engine.SimpleEngine.popen_uci(path)
        engine.configure({"Threads": 2, "Hash": 128})

        white_rating = game.white.get("rating") if isinstance(game.white, dict) else 270
        black_rating = game.black.get("rating") if isinstance(game.black, dict) else 885

        res = _run_single_pass_review_sync(
            engine,
            raw_moves,
            depth=depth,
            time_per_move=0.35,
            is_user_white=game.is_user_white,
            white_rating=white_rating,
            black_rating=black_rating
        )
        engine.quit()

        moves = res["moves"]
        acc_dict = calculate_game_accuracy(moves)
        perf_ratings = estimate_performance_ratings(acc_dict, white_rating, black_rating)

        gt_plies = gt.get("plies", []) if gt else []
        gt_labels = [p.get("label", "") for p in gt_plies]

        print(f"\n============================================================")
        print(f"GAME REVIEW COMPARISON: {game.id}")
        print(f"Total Moves: {len(moves)} | Depth: {depth}")
        print(f"============================================================")
        print(f"{'#':<6} {'Color':<6} {'Move':<7} {'Ours':<13} {'Chess.com':<13} {'Exact':<6} {'Coarse':<8} {'Eval':<7}")
        print(f"------------------------------------------------------------")

        exact_matches = 0
        coarse_matches = 0
        total = 0

        for i, m in enumerate(moves):
            our_cls = m.get("classification", "")
            cc_cls = gt_labels[i] if i < len(gt_labels) else "N/A"
            color = m.get("color", "")
            san = m.get("san", "")
            ev = m.get("eval", {})
            eval_num = ev.get("eval", 0.0)

            is_exact = (our_cls == cc_cls)
            is_coarse = (coarse_category(our_cls) == coarse_category(cc_cls))

            if cc_cls != "N/A":
                total += 1
                if is_exact:
                    exact_matches += 1
                if is_coarse:
                    coarse_matches += 1

            exact_str = "MATCH" if is_exact else (" " if cc_cls == "N/A" else "DIFF")
            coarse_str = "MATCH" if is_coarse else (" " if cc_cls == "N/A" else "DIFF")
            move_num = (i // 2) + 1
            prefix = f"{move_num}." if color == 'w' else f"{move_num}..."

            print(f"{prefix:<6} {color:<6} {san:<7} {our_cls:<13} {cc_cls:<13} {exact_str:<6} {coarse_str:<8} {eval_num:<7}")

        print(f"------------------------------------------------------------")
        if total > 0:
            exact_rate = round((exact_matches / total) * 100, 1)
            coarse_rate = round((coarse_matches / total) * 100, 1)
            print(f"Exact Agreement:  {exact_matches}/{total} ({exact_rate}%)  [Target: >= 80%]")
            print(f"Coarse Agreement: {coarse_matches}/{total} ({coarse_rate}%) [Target: >= 95%]")
        print(f"------------------------------------------------------------")

        # Accuracies & Performance ratings
        print("ACCURACY & ESTIMATED RATINGS:")
        print(f"  Ours:      White: {acc_dict.get('white')}% (Rating: {perf_ratings.get('white')}) | Black: {acc_dict.get('black')}% (Rating: {perf_ratings.get('black')})")
        if gt and "summary" in gt:
            gt_acc = gt["summary"].get("acc", {})
            gt_rat = gt["summary"].get("rating", {})
            print(f"  Chess.com: White: {gt_acc.get('white')}% (Rating: {gt_rat.get('white')}) | Black: {gt_acc.get('black')}% (Rating: {gt_rat.get('black')})")

        # Counts
        w_moves = [m for m in moves if m.get("color") == "w"]
        b_moves = [m for m in moves if m.get("color") == "b"]
        print("\nWHITE MOVE COUNTS:")
        print("  Ours:     ", dict(Counter(m.get("classification") for m in w_moves)))
        if gt and "summary" in gt:
            gt_s = gt["summary"]
            w_cc = {k: gt_s[k]["white"] for k in ["brilliant", "great", "book", "best", "excellent", "good", "inaccuracy", "mistake", "miss", "blunder"] if k in gt_s}
            print("  Chess.com:", w_cc)

        print("\nBLACK MOVE COUNTS:")
        print("  Ours:     ", dict(Counter(m.get("classification") for m in b_moves)))
        if gt and "summary" in gt:
            gt_s = gt["summary"]
            b_cc = {k: gt_s[k]["black"] for k in ["brilliant", "great", "book", "best", "excellent", "good", "inaccuracy", "mistake", "miss", "blunder"] if k in gt_s}
            print("  Chess.com:", b_cc)

        print(f"============================================================\n")

    finally:
        db.close()


if __name__ == "__main__":
    target_id = sys.argv[1] if len(sys.argv) > 1 else "game-25d06100a058"
    compare_game_review(target_id)
