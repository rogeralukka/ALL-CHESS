import json
import os
import uuid
import logging
from typing import Any, Dict, List, Optional, Literal
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session
import app.database
from app.config import BACKEND_DIR, settings
from app.database import get_db
from app.models.user import User
from app.models.game import Game as GameModel
from app.models.analysis import AnalysisJob, GameAnalysis, STALE_JOB_MINUTES
from app.schemas.game import Game, AnalyzeGameRequest, BrowserEvaluationsRequest, CoachGameCreate, CoachGameCreated
from app.schemas.job import JobResponse
from app.auth import get_current_user
from app.services.engine_service import analyze_game_moves_full, LEVEL_ORDER

logger = logging.getLogger("all_chess.games_router")
import re
import chess
import chess.pgn
from datetime import datetime, timedelta, timezone
from app.services.pgn_parser import parse_pgn_game

def extract_termination(dg: GameModel) -> Optional[str]:
    if getattr(dg, "termination", None):
        return dg.termination
    if dg.pgn:
        m = re.search(r'\[Termination\s+"([^"]+)"\]', dg.pgn)
        if m:
            return m.group(1)
    return None

def ensure_opening_name(op: Any) -> Dict[str, Any]:
    res = dict(op or {})
    name = res.get("name")
    if not name or str(name).strip() in ("", "Unknown", "Unknown Opening"):
        eco = res.get("eco", "A00")
        res["name"] = f"Opening ({eco})"
    return res

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
                opening=ensure_opening_name(dg.opening),
                moves=dg.moves,
                is_user_white=dg.is_user_white,
                accuracy=dg.accuracy,
                estimated_rating=dg.estimated_rating,
                phase_grades=dg.phase_grades,
                termination=extract_termination(dg),
                analysis_level=dg.analysis_level or ("standard" if dg.accuracy else None),
                analysis_depth=dg.analysis_depth or (18 if dg.accuracy else None)
            )
        )

    return results

@router.post("/coach", response_model=CoachGameCreated, status_code=201)
def save_coach_game(
    body: CoachGameCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save a finished Play Coach game so it can be opened in Review."""
    board = chess.Board()
    game = chess.pgn.Game()
    user_is_white = body.user_color == "white"
    user_name = current_user.username
    game.headers["Event"] = "Play Coach"
    game.headers["Site"] = "ALL-CHESS"
    game.headers["Date"] = datetime.now(timezone.utc).strftime("%Y.%m.%d")
    game.headers["White"] = user_name if user_is_white else body.opponent_name
    game.headers["Black"] = body.opponent_name if user_is_white else user_name
    user_elo = str(body.user_rating or 800)
    game.headers["WhiteElo"] = user_elo if user_is_white else str(body.opponent_rating)
    game.headers["BlackElo"] = str(body.opponent_rating) if user_is_white else user_elo
    game.headers["Result"] = body.result
    if body.termination:
        game.headers["Termination"] = body.termination

    node = game
    for san in body.moves:
        try:
            move = board.parse_san(san)
        except ValueError:
            raise HTTPException(status_code=422, detail=f"Illegal move '{san}' at ply {len(board.move_stack) + 1}.")
        node = node.add_variation(move)
        board.push(move)

    pgn_text = str(game)
    parsed = parse_pgn_game(
        pgn_text=pgn_text,
        target_user_names=[user_name],
        source="vs_coach",
        platform="coach",
    )
    db_game = GameModel(
        user_id=current_user.id,
        source=parsed["source"],
        platform=parsed["platform"],
        pgn=parsed["pgn"],
        white=parsed["white"],
        black=parsed["black"],
        result=parsed["result"],
        date=parsed["date"],
        time_control=parsed["timeControl"],
        speed=parsed["speed"],
        opening=parsed["opening"],
        moves=parsed["moves"],
        is_user_white=parsed["isUserWhite"],
        accuracy=parsed["accuracy"],
        estimated_rating=parsed["estimatedRating"],
        phase_grades=parsed["phaseGrades"],
        termination=body.termination,
    )
    db.add(db_game)
    db.commit()
    db.refresh(db_game)
    return CoachGameCreated(id=db_game.id)


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
        opening=ensure_opening_name(dg.opening),
        moves=dg.moves,
        is_user_white=dg.is_user_white,
        accuracy=dg.accuracy,
        estimated_rating=dg.estimated_rating,
        phase_grades=dg.phase_grades,
        termination=extract_termination(dg),
        analysis_level=dg.analysis_level or ("standard" if dg.accuracy else None),
        analysis_depth=dg.analysis_depth or (18 if dg.accuracy else None)
    )


async def run_game_analysis_task(
    job_id: str,
    game_id: str,
    user_id: str,
    level: str = "standard",
    external_evals: Optional[List[Dict[str, Any]]] = None
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
            level=level,
            is_user_white=game.is_user_white,
            white_rating=white_r,
            black_rating=black_r,
            on_progress=update_progress,
            db=db,
            external_evals=external_evals
        )

        real_depth = analysis_result.get("analysisDepth", 18)

        # Cache in game_analysis table
        existing_analysis = db.query(GameAnalysis).filter(
            GameAnalysis.game_id == game.id,
            GameAnalysis.depth == real_depth
        ).first()

        if existing_analysis:
            existing_analysis.analysis_data = analysis_result
        else:
            new_analysis = GameAnalysis(
                game_id=game.id,
                depth=real_depth,
                analysis_data=analysis_result
            )
            db.add(new_analysis)

        # Never silently overwrite a deep analysis with a shallower one
        current_level_rank = LEVEL_ORDER.get(game.analysis_level, 0) if game.analysis_level else 0
        new_level_rank = LEVEL_ORDER.get(level, 1)

        if new_level_rank >= current_level_rank:
            game.moves = analysis_result["moves"]
            game.accuracy = analysis_result["accuracy"]
            game.estimated_rating = analysis_result["estimatedRating"]
            game.phase_grades = analysis_result.get("phaseGradesAll") or analysis_result.get("phaseGrades")
            game.analysis_level = level
            game.analysis_depth = real_depth

        job.status = "done"
        job.progress = 100
        job.result = {
            "accuracy": analysis_result["accuracy"],
            "estimatedRating": analysis_result["estimatedRating"],
            "phaseGrades": game.phase_grades,
            "analysisLevel": game.analysis_level,
            "analysisDepth": game.analysis_depth
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
    payload: Optional[AnalyzeGameRequest] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    game = db.query(GameModel).filter(
        GameModel.id == game_id,
        GameModel.user_id == current_user.id
    ).first()
    if not game:
        raise HTTPException(status_code=404, detail=f"Game '{game_id}' not found.")

    req_level = payload.level if payload and payload.level else "standard"
    force = payload.force if payload and payload.force is not None else False
    req_rank = LEVEL_ORDER.get(req_level, 1)

    # 1. Without force, return the cached analysis if it was made at the same or a deeper level
    if not force and game.accuracy:
        current_lvl = game.analysis_level or "standard"
        current_rank = LEVEL_ORDER.get(current_lvl, 1)
        if current_rank >= req_rank:
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
                    "accuracy": game.accuracy,
                    "estimatedRating": game.estimated_rating,
                    "phaseGrades": game.phase_grades,
                    "analysisLevel": current_lvl,
                    "analysisDepth": game.analysis_depth or 18
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

    if active_job and not force:
        age = datetime.now(timezone.utc) - active_job.updated_at.replace(tzinfo=timezone.utc)
        if age <= timedelta(minutes=STALE_JOB_MINUTES):
            return JobResponse(job_id=active_job.id)
        # No progress for a long time: its worker is gone. Fail it and start fresh.
        active_job.status = "failed"
        active_job.error_message = "Stalled. Restarted."
        db.commit()

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

    background_tasks.add_task(run_game_analysis_task, job.id, game.id, current_user.id, req_level)
    return JobResponse(job_id=job.id)


@router.post("/{game_id}/evaluations", response_model=JobResponse)
def submit_browser_evaluations(
    game_id: str,
    payload: BrowserEvaluationsRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Finish a review whose engine search ran in the user's browser. The server only grades the moves,
    computes accuracy and writes commentary, so no engine is needed here. Poll /jobs/{id} as usual."""
    game = db.query(GameModel).filter(
        GameModel.id == game_id,
        GameModel.user_id == current_user.id
    ).first()
    if not game:
        raise HTTPException(status_code=404, detail=f"Game '{game_id}' not found.")

    expected = len(game.moves or []) + 1
    if len(payload.positions) != expected:
        raise HTTPException(
            status_code=422,
            detail=f"Expected {expected} positions (moves + 1), got {len(payload.positions)}."
        )

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

    external = [{"lines": [ln.model_dump() for ln in pos.lines]} for pos in payload.positions]
    background_tasks.add_task(run_game_analysis_task, job.id, game.id, current_user.id, payload.level, external)
    return JobResponse(job_id=job.id)
