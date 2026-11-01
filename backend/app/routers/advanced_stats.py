import logging
from typing import List, Literal, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.game import Game as GameModel
from app.auth import get_current_user
from app.schemas.advanced_stats import (
    AdvancedOverviewResponse,
    AdvancedOpeningsResponse,
    AdvancedTacticsResponse,
    AdvancedEndgamesResponse,
    AdvancedStrategyResponse,
    BrilliantMoveItem,
)
from app.services.advanced_stats_service import (
    filter_games,
    compute_advanced_overview,
    compute_advanced_openings,
    compute_advanced_tactics,
    compute_advanced_endgames,
    compute_advanced_strategy,
    extract_brilliant_moves,
    get_user_rating,
)

logger = logging.getLogger("all_chess.advanced_stats")

router = APIRouter(prefix="/stats/advanced", tags=["Advanced Stats"])


def _get_user_filtered_games(
    current_user: User,
    db: Session,
    mode: str,
    date_range: str,
    color: str
) -> List[GameModel]:
    """Fetches user games from database and applies shared query parameter filters."""
    raw_games = (
        db.query(GameModel)
        .filter(GameModel.user_id == current_user.id)
        .order_by(GameModel.date.asc())
        .all()
    )
    return filter_games(raw_games, mode=mode, date_range=date_range, color=color)


def _resolve_user_rating(user: User, games: List[GameModel]) -> Optional[int]:
    """Finds current user rating from their games or profile."""
    for g in reversed(games):
        r = get_user_rating(g)
        if r:
            return r
    return 1200


@router.get("/overview", response_model=AdvancedOverviewResponse)
def get_advanced_overview(
    mode: Optional[Literal['bullet', 'blitz', 'rapid', 'daily', 'all']] = Query('all'),
    range: Optional[Literal['7d', '30d', '90d', '1y', 'all']] = Query('90d'),
    color: Optional[Literal['all', 'white', 'black']] = Query('all'),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns user's Advanced Overview stats:
    Rating, rating delta, rating history, games, wins, draws, losses, percentages,
    and area scores (openings, tactics, strategy, endgames).
    """
    games = _get_user_filtered_games(current_user, db, mode=mode or 'all', date_range=range or '90d', color=color or 'all')
    user_rating = _resolve_user_rating(current_user, games)
    return compute_advanced_overview(games, user_rating=user_rating)


@router.get("/openings", response_model=AdvancedOpeningsResponse)
def get_advanced_openings(
    mode: Optional[Literal['bullet', 'blitz', 'rapid', 'daily', 'all']] = Query('all'),
    range: Optional[Literal['7d', '30d', '90d', '1y', 'all']] = Query('90d'),
    color: Optional[Literal['all', 'white', 'black']] = Query('all'),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns user's Advanced Openings stats:
    Opening accuracy, average mistakes, average book moves, and performance by opening.
    """
    games = _get_user_filtered_games(current_user, db, mode=mode or 'all', date_range=range or '90d', color=color or 'all')
    user_rating = _resolve_user_rating(current_user, games)
    return compute_advanced_openings(games, user_rating=user_rating, color_filter=color or 'all')


@router.get("/tactics", response_model=AdvancedTacticsResponse)
def get_advanced_tactics(
    mode: Optional[Literal['bullet', 'blitz', 'rapid', 'daily', 'all']] = Query('all'),
    range: Optional[Literal['7d', '30d', '90d', '1y', 'all']] = Query('90d'),
    color: Optional[Literal['all', 'white', 'black']] = Query('all'),
    side: Optional[Literal['found', 'allowed']] = Query('found'),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns user's Advanced Tactics conversion rates across 9 tactical categories:
    checkmates, freePieces, forks, pins, discoveries, removesDefender, brilliantSacrifices,
    trappedPieces, otherTactics.
    side: 'found' (user's turn opportunities) | 'allowed' (opponent's turn opportunities conceded).
    """
    games = _get_user_filtered_games(current_user, db, mode=mode or 'all', date_range=range or '90d', color=color or 'all')
    user_rating = _resolve_user_rating(current_user, games)
    return compute_advanced_tactics(games, user_rating=user_rating, side=side or 'found')


@router.get("/endgames", response_model=AdvancedEndgamesResponse)
def get_advanced_endgames(
    mode: Optional[Literal['bullet', 'blitz', 'rapid', 'daily', 'all']] = Query('all'),
    range: Optional[Literal['7d', '30d', '90d', '1y', 'all']] = Query('90d'),
    color: Optional[Literal['all', 'white', 'black']] = Query('all'),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns user's Advanced Endgames statistics:
    Win percentage from Better / Equal / Worse starting positions,
    and accuracy broken down by remaining material type (overall, rookAndPawn, kingAndPawn, queen, other).
    """
    games = _get_user_filtered_games(current_user, db, mode=mode or 'all', date_range=range or '90d', color=color or 'all')
    user_rating = _resolve_user_rating(current_user, games)
    return compute_advanced_endgames(games, user_rating=user_rating)


@router.get("/strategy", response_model=AdvancedStrategyResponse)
def get_advanced_strategy(
    mode: Optional[Literal['bullet', 'blitz', 'rapid', 'daily', 'all']] = Query('all'),
    range: Optional[Literal['7d', '30d', '90d', '1y', 'all']] = Query('90d'),
    color: Optional[Literal['all', 'white', 'black']] = Query('all'),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns user's Advanced Strategy statistics:
    Middlegame accuracy under documented heuristics:
    overall, pawnStructure, attacking, defending, activePiece, spaceAdvantage.
    """
    games = _get_user_filtered_games(current_user, db, mode=mode or 'all', date_range=range or '90d', color=color or 'all')
    user_rating = _resolve_user_rating(current_user, games)
    return compute_advanced_strategy(games, user_rating=user_rating)


@router.get("/brilliant-moves", response_model=List[BrilliantMoveItem])
def get_brilliant_moves(
    mode: Optional[Literal['bullet', 'blitz', 'rapid', 'daily', 'all']] = Query('all'),
    range: Optional[Literal['7d', '30d', '90d', '1y', 'all']] = Query('90d'),
    color: Optional[Literal['all', 'white', 'black']] = Query('all'),
    limit: int = Query(40, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns list of the user's games containing brilliant moves, sorted newest first.
    """
    games = _get_user_filtered_games(current_user, db, mode=mode or 'all', date_range=range or '90d', color=color or 'all')
    return extract_brilliant_moves(games, limit=limit)
