import json
import logging
from pathlib import Path
from sqlalchemy.orm import Session

from app.models.puzzle import Puzzle, UserPuzzleRating
from app.models.friend import Friend
from app.models.user import User

logger = logging.getLogger(__name__)

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def seed_puzzles(db: Session) -> int:
    """Seed puzzles table if empty from app/data/puzzles.json."""
    count = db.query(Puzzle).count()
    if count > 0:
        return count

    puzzles_file = DATA_DIR / "puzzles.json"
    if not puzzles_file.exists():
        logger.warning(f"puzzles.json not found at {puzzles_file}")
        return 0

    try:
        with open(puzzles_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        for p in data:
            db_puzzle = Puzzle(
                id=p["id"],
                fen=p["fen"],
                solution=p["solution"],
                rating=p.get("rating", 1000),
                theme=p.get("theme", []),
                goal=p.get("goal", ""),
            )
            db.add(db_puzzle)

        db.commit()
        logger.info(f"Seeded {len(data)} puzzles from puzzles.json")
        return len(data)
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to seed puzzles: {e}")
        return 0


def seed_initial_friends_for_user(db: Session, user_id: str) -> None:
    """Seeds default friends for a user if they have none."""
    existing = db.query(Friend).filter(Friend.user_id == user_id).count()
    if existing > 0:
        return

    defaults = [
        {
            "username": "friend_01",
            "rating": 930,
            "ratings": {"rapid": 930, "blitz": 905, "bullet": 880},
            "online": True,
            "last_active": "Now",
        },
        {
            "username": "PawnStorm22",
            "rating": 920,
            "ratings": {"rapid": 920, "blitz": 890, "bullet": 865},
            "online": False,
            "last_active": "2h ago",
        },
        {
            "username": "TacticsKnight",
            "rating": 915,
            "ratings": {"rapid": 915, "blitz": 925, "bullet": 895},
            "online": True,
            "last_active": "5m ago",
        },
    ]

    for d in defaults:
        f = Friend(
            user_id=user_id,
            username=d["username"],
            platform="chesscom",
            rating=d["rating"],
            ratings=d["ratings"],
            online=d["online"],
            last_active=d["last_active"],
        )
        db.add(f)

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to seed initial friends: {e}")
