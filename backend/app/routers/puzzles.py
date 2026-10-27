from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import ConfigDict
from typing import List, Optional
from datetime import datetime, timezone
import hashlib

from app.database import get_db
from app.routers.auth import get_current_user
from app.models.user import User
from app.models.puzzle import Puzzle, PuzzleAttempt, UserPuzzleRating
from app.services.seeder import seed_puzzles
from app.schemas.common import CamelModel

router = APIRouter(prefix="/puzzles", tags=["puzzles"])


class PuzzleOut(CamelModel):
    id: str
    fen: str
    solution: List[str]
    rating: int
    theme: List[str]
    goal: str

    model_config = ConfigDict(from_attributes=True)


class PuzzleAttemptIn(CamelModel):
    solved: bool
    time_seconds: int = 0


class PuzzleAttemptOut(CamelModel):
    solved: bool
    rating: int
    rating_delta: int
    streak: int
    best_streak: int


class UserPuzzleRatingOut(CamelModel):
    rating: int
    streak: int
    best_streak: int
    last_attempt_date: Optional[str] = None


@router.get("", response_model=List[PuzzleOut])
def get_puzzles(
    min_rating: Optional[int] = Query(None),
    max_rating: Optional[int] = Query(None),
    theme: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    seed_puzzles(db)

    # Get already solved puzzle IDs to avoid repeating solved puzzles
    solved_attempts = (
        db.query(PuzzleAttempt.puzzle_id)
        .filter(PuzzleAttempt.user_id == user.id, PuzzleAttempt.solved == True)
        .all()
    )
    solved_ids = {a[0] for a in solved_attempts}

    # If rating range not specified, select near user's puzzle rating (±150)
    user_rating_record = db.query(UserPuzzleRating).filter(UserPuzzleRating.user_id == user.id).first()
    curr_rating = user_rating_record.rating if user_rating_record else 650

    if min_rating is None and max_rating is None:
        target_min = max(400, curr_rating - 150)
        target_max = curr_rating + 150
        query = db.query(Puzzle).filter(Puzzle.rating >= target_min, Puzzle.rating <= target_max)
        if solved_ids:
            query = query.filter(~Puzzle.id.in_(solved_ids))
        puzzles = query.order_by(Puzzle.rating.asc()).all()
        # If not enough unsolved puzzles in ±150, fallback to broader range
        if len(puzzles) < limit:
            fallback_query = db.query(Puzzle)
            if solved_ids:
                fallback_query = fallback_query.filter(~Puzzle.id.in_(solved_ids))
            puzzles = fallback_query.order_by(Puzzle.rating.asc()).all()
    else:
        query = db.query(Puzzle)
        if min_rating is not None:
            query = query.filter(Puzzle.rating >= min_rating)
        if max_rating is not None:
            query = query.filter(Puzzle.rating <= max_rating)
        if solved_ids:
            query = query.filter(~Puzzle.id.in_(solved_ids))
        puzzles = query.order_by(Puzzle.rating.asc()).all()

    if theme:
        puzzles = [p for p in puzzles if theme in (p.theme or [])]

    return puzzles[:limit]


@router.get("/daily", response_model=PuzzleOut)
def get_daily_puzzle(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    seed_puzzles(db)
    puzzles = db.query(Puzzle).order_by(Puzzle.id.asc()).all()
    if not puzzles:
        raise HTTPException(status_code=404, detail="No puzzles available")

    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    idx = int(hashlib.md5(today_str.encode()).hexdigest(), 16) % len(puzzles)
    return puzzles[idx]


@router.get("/rating", response_model=UserPuzzleRatingOut)
def get_user_puzzle_rating(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    user_rating = db.query(UserPuzzleRating).filter(UserPuzzleRating.user_id == user.id).first()
    if not user_rating:
        user_rating = UserPuzzleRating(
            user_id=user.id,
            rating=650,
            streak=0,
            best_streak=0,
            last_attempt_date=None,
        )
        db.add(user_rating)
        db.commit()
        db.refresh(user_rating)

    return UserPuzzleRatingOut(
        rating=user_rating.rating,
        streak=user_rating.streak,
        best_streak=user_rating.best_streak,
        last_attempt_date=user_rating.last_attempt_date,
    )


@router.get("/{puzzle_id}", response_model=PuzzleOut)
def get_puzzle_by_id(
    puzzle_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    seed_puzzles(db)
    puzzle = db.query(Puzzle).filter(Puzzle.id == puzzle_id).first()
    if not puzzle:
        raise HTTPException(status_code=404, detail="Puzzle not found")
    return puzzle


@router.post("/{puzzle_id}/attempt", response_model=PuzzleAttemptOut)
def submit_puzzle_attempt(
    puzzle_id: str,
    body: PuzzleAttemptIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    seed_puzzles(db)
    puzzle = db.query(Puzzle).filter(Puzzle.id == puzzle_id).first()
    if not puzzle:
        raise HTTPException(status_code=404, detail="Puzzle not found")

    user_rating_record = db.query(UserPuzzleRating).filter(UserPuzzleRating.user_id == user.id).first()
    if not user_rating_record:
        user_rating_record = UserPuzzleRating(
            user_id=user.id,
            rating=650,
            streak=0,
            best_streak=0,
        )
        db.add(user_rating_record)
        db.flush()

    current_rating = user_rating_record.rating
    puzzle_rating = puzzle.rating

    # Standard Elo formula
    expected_score = 1.0 / (1.0 + 10.0 ** ((puzzle_rating - current_rating) / 400.0))
    actual_score = 1.0 if body.solved else 0.0
    k_factor = 32

    raw_delta = round(k_factor * (actual_score - expected_score))

    if body.solved:
        delta = max(5, raw_delta)
        new_streak = user_rating_record.streak + 1
        best_streak = max(new_streak, user_rating_record.best_streak)
    else:
        delta = min(-5, raw_delta)
        new_streak = 0
        best_streak = user_rating_record.best_streak

    new_rating = max(400, current_rating + delta)
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    user_rating_record.rating = new_rating
    user_rating_record.streak = new_streak
    user_rating_record.best_streak = best_streak
    user_rating_record.last_attempt_date = today_str

    attempt = PuzzleAttempt(
        user_id=user.id,
        puzzle_id=puzzle.id,
        solved=body.solved,
        time_seconds=body.time_seconds,
        rating_delta=delta,
    )
    db.add(attempt)
    db.commit()

    return PuzzleAttemptOut(
        solved=body.solved,
        rating=new_rating,
        rating_delta=delta,
        streak=new_streak,
        best_streak=best_streak,
    )
