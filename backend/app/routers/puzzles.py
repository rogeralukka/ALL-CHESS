from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import ConfigDict
from typing import List, Optional
from datetime import datetime, timezone
import hashlib

from app.database import get_db
from app.routers.auth import get_current_user
from app.models.user import User
from app.models.puzzle import Puzzle, PuzzleTheme, PuzzleAttempt, UserPuzzleRating
from app.schemas.common import CamelModel

router = APIRouter(prefix="/puzzles", tags=["puzzles"])


class PuzzleOut(CamelModel):
    id: str
    fen: str
    solution: List[str]
    rating: int
    theme: List[str]
    goal: str

    # Extended Lichess fields (optional, backward compatible)
    solution_uci: Optional[List[str]] = None
    setup_move_uci: Optional[str] = None
    popularity: Optional[int] = None
    nb_plays: Optional[int] = None
    game_url: Optional[str] = None
    opening_tags: Optional[List[str]] = None

    model_config = ConfigDict(from_attributes=True)


class PuzzleThemeOut(CamelModel):
    theme: str
    count: int


class PuzzleAttemptIn(CamelModel):
    solved: bool
    time_seconds: int = 0
    used_hint: bool = False


class PuzzleAttemptOut(CamelModel):
    solved: bool
    rating: int
    rating_delta: int
    streak: int
    best_streak: int
    is_repeat: bool = False
    message: Optional[str] = None


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
    """
    Returns puzzles matching filters, excluding puzzles already solved by user.
    If rating range not given, uses a window around user's puzzle rating (±150),
    widening if too few, with randomised selection in SQL.
    """
    # Solved puzzle exclusion subquery using NOT EXISTS
    solved_subquery = (
        db.query(PuzzleAttempt.id)
        .filter(
            PuzzleAttempt.puzzle_id == Puzzle.id,
            PuzzleAttempt.user_id == user.id,
            PuzzleAttempt.solved == True,
        )
    )

    base_query = db.query(Puzzle).filter(~solved_subquery.exists())

    if theme:
        base_query = base_query.join(PuzzleTheme, PuzzleTheme.puzzle_id == Puzzle.id).filter(
            PuzzleTheme.theme == theme
        )

    # If explicit rating bounds provided, filter and randomize
    if min_rating is not None or max_rating is not None:
        query = base_query
        if min_rating is not None:
            query = query.filter(Puzzle.rating >= min_rating)
        if max_rating is not None:
            query = query.filter(Puzzle.rating <= max_rating)
        return query.order_by(func.random()).limit(limit).all()

    # Dynamic rating window based on user rating
    user_rating_record = db.query(UserPuzzleRating).filter(UserPuzzleRating.user_id == user.id).first()
    curr_rating = user_rating_record.rating if user_rating_record else 1200

    # 1. Target window ±150
    w_min = max(400, curr_rating - 150)
    w_max = curr_rating + 150
    puzzles = (
        base_query.filter(Puzzle.rating >= w_min, Puzzle.rating <= w_max)
        .order_by(func.random())
        .limit(limit)
        .all()
    )

    # 2. If fewer than limit, widen window to ±300
    if len(puzzles) < limit:
        w_min2 = max(400, curr_rating - 300)
        w_max2 = curr_rating + 300
        puzzles = (
            base_query.filter(Puzzle.rating >= w_min2, Puzzle.rating <= w_max2)
            .order_by(func.random())
            .limit(limit)
            .all()
        )

    # 3. If still fewer, remove rating filter completely
    if len(puzzles) < limit:
        puzzles = base_query.order_by(func.random()).limit(limit).all()

    return puzzles


@router.get("/next", response_model=PuzzleOut)
def get_next_puzzle(
    theme: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Returns ONE unsolved puzzle near user's rating, randomized across calls.
    """
    solved_subquery = (
        db.query(PuzzleAttempt.id)
        .filter(
            PuzzleAttempt.puzzle_id == Puzzle.id,
            PuzzleAttempt.user_id == user.id,
            PuzzleAttempt.solved == True,
        )
    )

    base_query = db.query(Puzzle).filter(~solved_subquery.exists())

    if theme:
        base_query = base_query.join(PuzzleTheme, PuzzleTheme.puzzle_id == Puzzle.id).filter(
            PuzzleTheme.theme == theme
        )

    user_rating_record = db.query(UserPuzzleRating).filter(UserPuzzleRating.user_id == user.id).first()
    curr_rating = user_rating_record.rating if user_rating_record else 1200

    # Target ±150
    puzzle = (
        base_query.filter(Puzzle.rating >= max(400, curr_rating - 150), Puzzle.rating <= curr_rating + 150)
        .order_by(func.random())
        .first()
    )

    if not puzzle:
        # Widen ±300
        puzzle = (
            base_query.filter(Puzzle.rating >= max(400, curr_rating - 300), Puzzle.rating <= curr_rating + 300)
            .order_by(func.random())
            .first()
        )

    if not puzzle:
        # Fallback to any unsolved puzzle
        puzzle = base_query.order_by(func.random()).first()

    if not puzzle:
        raise HTTPException(status_code=404, detail="No unsolved puzzles available")

    return puzzle


@router.get("/themes", response_model=List[PuzzleThemeOut])
def get_puzzle_themes(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Returns list of all available puzzle themes with counts for theme selector.
    """
    results = (
        db.query(PuzzleTheme.theme, func.count(PuzzleTheme.puzzle_id).label("count"))
        .group_by(PuzzleTheme.theme)
        .order_by(func.count(PuzzleTheme.puzzle_id).desc())
        .all()
    )
    return [{"theme": r[0], "count": r[1]} for r in results]


@router.get("/daily", response_model=PuzzleOut)
def get_daily_puzzle(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Returns the daily puzzle, deterministic and stable for the UTC day for everyone.
    Picked from curated pool (popularity high, rating 800-1800) without OFFSET over full table.
    """
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    day_hash = int(hashlib.sha256(today_str.encode()).hexdigest()[:8], 16)

    # Curated pool IDs (ordered deterministically by ID)
    pool_ids = (
        db.query(Puzzle.id)
        .filter(Puzzle.rating >= 800, Puzzle.rating <= 1800, Puzzle.popularity >= 85)
        .order_by(Puzzle.id.asc())
        .all()
    )
    if not pool_ids:
        # Fallback if popularity not populated
        pool_ids = (
            db.query(Puzzle.id)
            .filter(Puzzle.rating >= 800, Puzzle.rating <= 1800)
            .order_by(Puzzle.id.asc())
            .all()
        )
    if not pool_ids:
        # Fallback to any puzzle
        pool_ids = db.query(Puzzle.id).order_by(Puzzle.id.asc()).limit(500).all()

    if not pool_ids:
        raise HTTPException(status_code=404, detail="No puzzles available")

    chosen_id = pool_ids[day_hash % len(pool_ids)][0]
    puzzle = db.query(Puzzle).filter(Puzzle.id == chosen_id).first()
    if not puzzle:
        raise HTTPException(status_code=404, detail="Daily puzzle not found")

    return puzzle


@router.get("/rating", response_model=UserPuzzleRatingOut)
def get_user_puzzle_rating(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Returns user's puzzle rating profile. Defaults to 1200 for new users.
    """
    user_rating = db.query(UserPuzzleRating).filter(UserPuzzleRating.user_id == user.id).first()
    if not user_rating:
        user_rating = UserPuzzleRating(
            user_id=user.id,
            rating=1200,
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
    """
    Submits a puzzle attempt:
      - Repeat attempt on same puzzle: stored with rating_delta=0, streak unchanged.
      - Hint used (used_hint=True): solve earns no rating, streak not extended or broken.
      - First attempt without hint: Elo rating change applied.
        K=40 for first 20 attempts, K=24 after. Floor 400.
    """
    puzzle = db.query(Puzzle).filter(Puzzle.id == puzzle_id).first()
    if not puzzle:
        raise HTTPException(status_code=404, detail="Puzzle not found")

    user_rating_record = db.query(UserPuzzleRating).filter(UserPuzzleRating.user_id == user.id).first()
    if not user_rating_record:
        user_rating_record = UserPuzzleRating(
            user_id=user.id,
            rating=1200,
            streak=0,
            best_streak=0,
        )
        db.add(user_rating_record)
        db.flush()

    # Check for prior attempt by this user on this puzzle
    prior_attempt = (
        db.query(PuzzleAttempt.id)
        .filter(PuzzleAttempt.user_id == user.id, PuzzleAttempt.puzzle_id == puzzle.id)
        .first()
    )
    is_repeat = prior_attempt is not None

    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    # Case 1: Repeat attempt (already attempted this puzzle)
    if is_repeat:
        attempt = PuzzleAttempt(
            user_id=user.id,
            puzzle_id=puzzle.id,
            solved=body.solved,
            time_seconds=body.time_seconds,
            rating_delta=0,
            used_hint=body.used_hint,
            is_repeat=True,
        )
        db.add(attempt)
        db.commit()

        return PuzzleAttemptOut(
            solved=body.solved,
            rating=user_rating_record.rating,
            rating_delta=0,
            streak=user_rating_record.streak,
            best_streak=user_rating_record.best_streak,
            is_repeat=True,
            message="Repeat attempt; rating and streak unchanged.",
        )

    # Case 2: First attempt with hint used
    if body.used_hint:
        attempt = PuzzleAttempt(
            user_id=user.id,
            puzzle_id=puzzle.id,
            solved=body.solved,
            time_seconds=body.time_seconds,
            rating_delta=0,
            used_hint=True,
            is_repeat=False,
        )
        db.add(attempt)
        db.commit()

        return PuzzleAttemptOut(
            solved=body.solved,
            rating=user_rating_record.rating,
            rating_delta=0,
            streak=user_rating_record.streak,
            best_streak=user_rating_record.best_streak,
            is_repeat=False,
            message="Hint used; solve earns no rating change.",
        )

    # Case 3: First attempt without hint (full Elo evaluation)
    current_rating = user_rating_record.rating
    puzzle_rating = puzzle.rating

    # K-factor: K=40 for user's first 20 non-repeat attempts, K=24 after
    first_attempts_count = (
        db.query(func.count(PuzzleAttempt.id))
        .filter(PuzzleAttempt.user_id == user.id, PuzzleAttempt.is_repeat == False)
        .scalar()
        or 0
    )
    k_factor = 40 if first_attempts_count < 20 else 24

    # Standard Elo formula
    expected_score = 1.0 / (1.0 + 10.0 ** ((puzzle_rating - current_rating) / 400.0))
    actual_score = 1.0 if body.solved else 0.0
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
        used_hint=False,
        is_repeat=False,
    )
    db.add(attempt)
    db.commit()

    return PuzzleAttemptOut(
        solved=body.solved,
        rating=new_rating,
        rating_delta=delta,
        streak=new_streak,
        best_streak=best_streak,
        is_repeat=False,
        message=None,
    )
