import json
import logging
from pathlib import Path
from sqlalchemy.orm import Session

from app.models.puzzle import Puzzle, PuzzleTheme

logger = logging.getLogger(__name__)

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

_CACHED_PUZZLES_DATA = None


def seed_puzzles(db: Session, force: bool = False) -> int:
    """
    Seed puzzles table if empty from app/data/puzzles.json.
    Startup seeding only fills an EMPTY table from it, and NEVER deletes.
    """
    global _CACHED_PUZZLES_DATA

    try:
        # If table is not empty, never delete or overwrite
        has_puzzle = db.query(Puzzle.id).first()
        if has_puzzle is not None and not force:
            return db.query(Puzzle).count()

        if _CACHED_PUZZLES_DATA is None:
            puzzles_file = DATA_DIR / "puzzles.json"
            if not puzzles_file.exists():
                logger.warning(f"puzzles.json not found at {puzzles_file}")
                return 0
            with open(puzzles_file, "r", encoding="utf-8") as f:
                _CACHED_PUZZLES_DATA = json.load(f)

        data = _CACHED_PUZZLES_DATA
        batch_size = 500

        for i in range(0, len(data), batch_size):
            batch = data[i : i + batch_size]
            db_puzzles = []
            db_themes = []
            for p in batch:
                pid = p["id"]
                themes = p.get("theme", [])
                db_puzzles.append(
                    Puzzle(
                        id=pid,
                        fen=p["fen"],
                        solution=p["solution"],
                        rating=p.get("rating", 1000),
                        theme=themes,
                        goal=p.get("goal", ""),
                        solution_uci=p.get("solution_uci"),
                        setup_move_uci=p.get("setup_move_uci"),
                        popularity=p.get("popularity", 100),
                        nb_plays=p.get("nb_plays", 0),
                        game_url=p.get("game_url"),
                        opening_tags=p.get("opening_tags"),
                    )
                )
                for t in themes:
                    db_themes.append(PuzzleTheme(puzzle_id=pid, theme=t))

            db.bulk_save_objects(db_puzzles)
            if db_themes:
                db.bulk_save_objects(db_themes)
            db.commit()

        logger.info(f"Seeded {len(data)} starter puzzles from puzzles.json")
        return len(data)
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to seed puzzles: {e}")
        return 0
