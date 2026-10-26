"""
Developer utility to inspect accuracy and move classification counts for a game.
Usage:
    python scripts/compare_accuracy.py [game_id]
"""
import sys
import os
from collections import Counter

# Ensure backend root is on sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.database import SessionLocal
from app.models.game import Game

CLASSIFICATION_ORDER = [
    "brilliant",
    "great",
    "best",
    "excellent",
    "good",
    "book",
    "inaccuracy",
    "mistake",
    "miss",
    "blunder",
]


def print_game_stats(game_id: str | None = None):
    db = SessionLocal()
    try:
        if game_id:
            game = db.query(Game).filter(Game.id == game_id).first()
            if not game:
                # Also check external_id or partial match
                game = db.query(Game).filter(
                    (Game.id.contains(game_id)) | (Game.external_id == game_id)
                ).first()
        else:
            game = db.query(Game).order_by(Game.created_at.desc()).first()

        if not game:
            print(f"No game found matching '{game_id or ''}'.")
            return

        white_info = game.white or {}
        black_info = game.black or {}
        white_name = white_info.get("username", "White")
        white_rating = white_info.get("rating", "?")
        black_name = black_info.get("username", "Black")
        black_rating = black_info.get("rating", "?")

        acc = game.accuracy or {}
        white_acc = acc.get("white")
        black_acc = acc.get("black")

        est = game.estimated_rating or {}
        white_est = est.get("white")
        black_est = est.get("black")

        white_counts = Counter()
        black_counts = Counter()

        moves = game.moves or []
        for m in moves:
            color = m.get("color")
            cls = m.get("classification")
            if not cls:
                continue
            if color == "w":
                white_counts[cls] += 1
            elif color == "b":
                black_counts[cls] += 1

        print("=" * 60)
        print(f"GAME: {game.id} (External: {game.external_id or 'N/A'})")
        print(f"Result: {game.result} | Speed: {game.speed} | TC: {game.time_control}")
        opening_name = (game.opening or {}).get("name", "Unknown Opening")
        print(f"Opening: {opening_name}")
        print("=" * 60)

        print(f"\nWHITE: {white_name} (Rating: {white_rating})")
        print(f"  Accuracy:         {white_acc if white_acc is not None else 'N/A'}")
        print(f"  Estimated Rating: {white_est if white_est is not None else 'N/A'}")
        print("  Classifications:")
        for cls_name in CLASSIFICATION_ORDER:
            cnt = white_counts[cls_name]
            print(f"    {cls_name.capitalize():<12}: {cnt}")

        print(f"\nBLACK: {black_name} (Rating: {black_rating})")
        print(f"  Accuracy:         {black_acc if black_acc is not None else 'N/A'}")
        print(f"  Estimated Rating: {black_est if black_est is not None else 'N/A'}")
        print("  Classifications:")
        for cls_name in CLASSIFICATION_ORDER:
            cnt = black_counts[cls_name]
            print(f"    {cls_name.capitalize():<12}: {cnt}")

        print("=" * 60)

    finally:
        db.close()


if __name__ == "__main__":
    target_id = sys.argv[1] if len(sys.argv) > 1 else None
    print_game_stats(target_id)
