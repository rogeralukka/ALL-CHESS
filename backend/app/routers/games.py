import json
import os
import uuid
import logging
from typing import List, Optional, Literal
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session
import app.database
from app.config import BACKEND_DIR, settings
from app.database import get_db
from app.models.user import User
from app.models.game import Game as GameModel
from app.models.analysis import AnalysisJob, GameAnalysis
from app.schemas.game import Game
from app.schemas.job import JobResponse
from app.auth import get_current_user
from app.services.engine_service import analyze_game_moves_full

logger = logging.getLogger("all_chess.games_router")
router = APIRouter(prefix="/games", tags=["Games"])

MOCK_GAMES_FILE = os.path.join(BACKEND_DIR, "app", "data", "mock_games.json")

def maybe_seed_demo_data(db: Session, user: User) -> None:
    """Only seeds mock games if explicitly enabled by the dev flag SEED_DEMO_DATA=true."""
    if not settings.seed_demo_data:
        return

    count = db.query(GameModel).filter(GameModel.user_id == user.id).count()
    if count > 0:
        return

    if not os.path.exists(MOCK_GAMES_FILE):
        return

    try:
        with open(MOCK_GAMES_FILE, "r", encoding="utf-8") as f:
            mock_games = json.load(f)
            
        for g in mock_games:
            # Generate a fresh UUID per user per game so IDs never collide
            unique_id = f"game-{user.id[:8]}-{uuid.uuid4().hex[:8]}"
            is_white = g.get("white", {}).get("username") == "You"
            db_game = GameModel(
                id=unique_id,
                user_id=user.id,
                source=g.get("source", "online"),
                platform=g.get("platform", "coach" if g.get("source") == "vs_coach" else "chesscom"),
                external_id=unique_id,
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
        # Non-fatal warning
        print(f"Warning: failed to seed demo games: {e}")

@router.get("", response_model=List[Game], response_model_exclude_none=True)
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
    maybe_seed_demo_data(db, current_user)

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
                is_user_white=dg.is_user_white,
                accuracy=dg.accuracy,
                estimated_rating=dg.estimated_rating,
                phase_grades=dg.phase_grades
            )
        )

    return results

@router.get("/{game_id}", response_model=Game, response_model_exclude_none=True)
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
        is_user_white=dg.is_user_white,
        accuracy=dg.accuracy,
        estimated_rating=dg.estimated_rating,
        phase_grades=dg.phase_grades
    )


async def run_game_analysis_task(
    job_id: str,
    game_id: str,
    user_id: str,
    depth: int = 16
) -> None:
    db = app.database.SessionLocal()
    try:
        job = db.query(AnalysisJob).filter(AnalysisJob.id == job_id).first()
        game = db.query(GameModel).filter(
            GameModel.id == game_id,
            GameModel.user_id == user_id
        ).first()
        if not job or not game:
            return

        job.status = "processing"
        job.progress = 5
        db.commit()

        def update_progress(pct: int) -> None:
            job.progress = min(95, 5 + int(pct * 0.9))
            db.commit()

        white_r = game.white.get("rating") if isinstance(game.white, dict) else None
        black_r = game.black.get("rating") if isinstance(game.black, dict) else None

        analysis_result = await analyze_game_moves_full(
            moves_list=game.moves or [],
            depth=depth,
            time_per_move=0.3,
            is_user_white=game.is_user_white,
            white_rating=white_r,
            black_rating=black_r,
            on_progress=update_progress,
            db=db
        )

        # Cache in game_analysis
        existing_analysis = db.query(GameAnalysis).filter(
            GameAnalysis.game_id == game.id,
            GameAnalysis.depth == depth
        ).first()

        if existing_analysis:
            existing_analysis.analysis_data = analysis_result
        else:
            new_analysis = GameAnalysis(
                game_id=game.id,
                depth=depth,
                analysis_data=analysis_result
            )
            db.add(new_analysis)

        # Update game record
        game.moves = analysis_result["moves"]
        game.accuracy = analysis_result["accuracy"]
        game.estimated_rating = analysis_result["estimatedRating"]
        game.phase_grades = analysis_result["phaseGrades"]

        job.status = "done"
        job.progress = 100
        job.result = {
            "accuracy": analysis_result["accuracy"],
            "estimatedRating": analysis_result["estimatedRating"],
            "phaseGrades": analysis_result["phaseGrades"]
        }
        db.commit()

    except Exception as e:
        logger.exception(f"Game review task failed for game {game_id}: {e}")
        try:
            job = db.query(AnalysisJob).filter(AnalysisJob.id == job_id).first()
            if job:
                job.status = "failed"
                job.error_message = str(e)
                db.commit()
        except Exception:
            pass
    finally:
        db.close()


@router.post("/{game_id}/analyze", response_model=JobResponse)
def analyze_game(
    game_id: str,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    game = db.query(GameModel).filter(
        GameModel.id == game_id,
        GameModel.user_id == current_user.id
    ).first()
    if not game:
        raise HTTPException(status_code=404, detail=f"Game '{game_id}' not found.")

    # 1. Check cache in game_analysis table
    cached = db.query(GameAnalysis).filter(
        GameAnalysis.game_id == game_id,
        GameAnalysis.depth == 16
    ).first()

    if cached and cached.analysis_data:
        # If game moves not yet backfilled from cache, update them
        if not game.accuracy and isinstance(cached.analysis_data, dict):
            game.moves = cached.analysis_data.get("moves", game.moves)
            game.accuracy = cached.analysis_data.get("accuracy")
            game.estimated_rating = cached.analysis_data.get("estimatedRating")
            game.phase_grades = cached.analysis_data.get("phaseGrades")
            db.commit()

        # Return existing completed job or create a completed one
        existing_done_job = db.query(AnalysisJob).filter(
            AnalysisJob.game_id == game_id,
            AnalysisJob.user_id == current_user.id,
            AnalysisJob.job_type == "analysis",
            AnalysisJob.status == "done"
        ).first()

        if existing_done_job:
            return JobResponse(job_id=existing_done_job.id)

        job = AnalysisJob(
            user_id=current_user.id,
            game_id=game.id,
            job_type="analysis",
            status="done",
            progress=100,
            result={
                "accuracy": cached.analysis_data.get("accuracy"),
                "estimatedRating": cached.analysis_data.get("estimatedRating"),
                "phaseGrades": cached.analysis_data.get("phaseGrades")
            }
        )
        db.add(job)
        db.commit()
        db.refresh(job)
        return JobResponse(job_id=job.id)

    # 2. Check for active queued/processing job
    active_job = db.query(AnalysisJob).filter(
        AnalysisJob.game_id == game_id,
        AnalysisJob.user_id == current_user.id,
        AnalysisJob.job_type == "analysis",
        AnalysisJob.status.in_(["queued", "processing"])
    ).first()

    if active_job:
        return JobResponse(job_id=active_job.id)

    # 3. Create fresh job and queue in background
    job = AnalysisJob(
        user_id=current_user.id,
        game_id=game.id,
        job_type="analysis",
        status="queued",
        progress=0
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    background_tasks.add_task(run_game_analysis_task, job.id, game.id, current_user.id, 16)
    return JobResponse(job_id=job.id)
