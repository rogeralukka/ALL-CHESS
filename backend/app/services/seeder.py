import json
import logging
from pathlib import Path
from sqlalchemy.orm import Session

from app.models.puzzle import Puzzle

logger = logging.getLogger(__name__)

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def seed_puzzles(db: Session) -> int:
    """Seed puzzles table if empty or count mismatch from app/data/puzzles.json."""
    puzzles_file = DATA_DIR / "puzzles.json"
    if not puzzles_file.exists():
        logger.warning(f"puzzles.json not found at {puzzles_file}")
        return 0

    try:
        with open(puzzles_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        count = db.query(Puzzle).count()
        if count >= len(data) and count > 0:
            return count

        # If data has been updated with more/new puzzles, reload
        if count > 0 and count < len(data):
            db.query(Puzzle).delete()
            db.commit()

        batch_size = 500
        for i in range(0, len(data), batch_size):
            batch = data[i : i + batch_size]
            db_puzzles = [
                Puzzle(
                    id=p["id"],
                    fen=p["fen"],
                    solution=p["solution"],
                    rating=p.get("rating", 1000),
                    theme=p.get("theme", []),
                    goal=p.get("goal", ""),
                )
                for p in batch
            ]
            db.bulk_save_objects(db_puzzles)
            db.commit()

        logger.info(f"Seeded {len(data)} puzzles from puzzles.json")
        return len(data)
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to seed puzzles: {e}")
        return 0
