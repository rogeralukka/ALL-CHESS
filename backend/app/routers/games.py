import json
import os
from typing import List, Optional, Literal
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.config import BACKEND_DIR
from app.database import get_db
from app.models.user import User
from app.models.game import Game as GameModel
from app.schemas.game import Game, GameFilterParams
from app.auth import get_current_user

router = APIRouter(prefix="/games", tags=["Games"])

MOCK_GAMES_FILE = os.path.join(BACKEND_DIR, "app", "data", "mock_games.json")

def seed_initial_games_if_empty(db: Session, user: User) -> None:
    count = db.query(GameModel).filter(GameModel.user_id == user.id).count()
    if count > 0:
        return

    if not os.path.exists(MOCK_GAMES_FILE):
        return

    try:
        with open(MOCK_GAMES_FILE, "r", encoding="utf-8") as f:
            mock_games = json.load(f)
            
        for g in mock_games:
            # Map mock game to DB
            is_white = g.get("white", {}).get("username") == "You"
            db_game = GameModel(
                id=g["id"],
                user_id=user.id,
                source=g.get("source", "online"),
                platform=g.get("platform", "coach" if g.get("source") == "vs_coach" else "chesscom"),
                external_id=g.get("id"),
                pgn=g.get("pgn", ""),
                white=g.get("white", {}),
                black=g.get("black", {}),
                result=g.get("result", "*"),
                date=g.get("date", "2026-10-22T19:30:00Z"),
                time_control=g.get("timeControl", "10 min"),
                speed=g.get("speed", "rapid"),
                opening=g.get("opening", {"eco": "A00", "name": "Unknown"}),
                moves=g.get("moves", []),
                is_user_white=is_white,
                accuracy=g.get("accuracy"),
                estimated_rating=g.get("estimatedRating"),
                phase_grades=g.get("phaseGrades")
            )
            db.add(db_game)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Warning: failed to seed mock games: {e}")

@router.get("", response_model=List[Game])
def get_games(
    opening: Optional[str] = Query(None),
    color: Optional[Literal['white', 'black', 'all']] = Query('all'),
    result: Optional[Literal['win', 'loss', 'draw', 'all']] = Query('all'),
    source: Optional[Literal['online', 'vs_coach', 'all']] = Query('all'),
    speed: Optional[Literal['bullet', 'blitz', 'rapid', 'all']] = Query('all'),
    search_query: Optional[str] = Query(None, alias="searchQuery"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    seed_initial_games_if_empty(db, current_user)

    query = db.query(GameModel).filter(GameModel.user_id == current_user.id)

    if speed and speed != 'all':
        query = query.filter(GameModel.speed == speed)
    if source and source != 'all':
        query = query.filter(GameModel.source == source)
    if color and color != 'all':
        query = query.filter(GameModel.is_user_white == (color == 'white'))

    db_games = query.order_by(GameModel.date.desc()).all()
    results: List[Game] = []

    for dg in db_games:
        # Check result filter
        if result and result != 'all':
            is_white = dg.is_user_white
            if result == 'win':
                if not ((is_white and dg.result == '1-0') or (not is_white and dg.result == '0-1')):
                    continue
            elif result == 'loss':
                if not ((is_white and dg.result == '0-1') or (not is_white and dg.result == '1-0')):
                    continue
            elif result == 'draw':
                if dg.result != '1/2-1/2':
                    continue

        # Check opening filter
        if opening:
            op_name = (dg.opening or {}).get("name", "").lower()
            op_eco = (dg.opening or {}).get("eco", "").lower()
            if opening.lower() not in op_name and opening.lower() != op_eco:
                continue

        # Check searchQuery filter
        if search_query:
            q = search_query.lower()
            white_user = (dg.white or {}).get("username", "").lower()
            black_user = (dg.black or {}).get("username", "").lower()
            op_name = (dg.opening or {}).get("name", "").lower()
            if q not in white_user and q not in black_user and q not in op_name:
                continue

        # Convert to Pydantic Game schema
        results.append(
            Game(
                id=dg.id,
                pgn=dg.pgn,
                white=dg.white,
                black=dg.black,
                result=dg.result,
                date=dg.date,
                time_control=dg.time_control,
                speed=dg.speed,
                source=dg.source,
                platform=dg.platform,
                opening=dg.opening,
                moves=dg.moves,
                accuracy=dg.accuracy,
                estimated_rating=dg.estimated_rating,
                phase_grades=dg.phase_grades
            )
        )

    return results

@router.get("/{game_id}", response_model=Game)
def get_game_by_id(
    game_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    dg = db.query(GameModel).filter(
        GameModel.id == game_id,
        GameModel.user_id == current_user.id
    ).first()

    if not dg:
        raise HTTPException(status_code=404, detail=f"Game '{game_id}' not found.")

    return Game(
        id=dg.id,
        pgn=dg.pgn,
        white=dg.white,
        black=dg.black,
        result=dg.result,
        date=dg.date,
        time_control=dg.time_control,
        speed=dg.speed,
        source=dg.source,
        platform=dg.platform,
        opening=dg.opening,
        moves=dg.moves,
        accuracy=dg.accuracy,
        estimated_rating=dg.estimated_rating,
        phase_grades=dg.phase_grades
    )
