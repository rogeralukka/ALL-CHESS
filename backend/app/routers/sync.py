import logging
import asyncio
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import get_db, SessionLocal
from app.models.user import User
from app.models.game import Game as GameModel
from app.models.analysis import AnalysisJob
from app.schemas.job import JobResponse
from app.auth import get_current_user
from app.services.chesscom_client import ChesscomClient
from app.services.lichess_client import LichessClient
from app.services.pgn_parser import parse_pgn_game

logger = logging.getLogger("all_chess.sync")
router = APIRouter(prefix="/sync", tags=["Sync"])


async def run_sync_job_task(job_id: str, user_id: str) -> None:
    db = SessionLocal()
    try:
        job = db.query(AnalysisJob).filter(AnalysisJob.id == job_id).first()
        user = db.query(User).filter(User.id == user_id).first()
        if not job or not user:
            return

        job.status = "processing"
        job.progress = 5
        db.commit()

        chesscom_count = 0
        lichess_count = 0
        skipped_count = 0

        user_aliases = [user.username]
        if user.chesscom_username:
            user_aliases.append(user.chesscom_username)
        if user.lichess_username:
            user_aliases.append(user.lichess_username)

        # Preload existing external_ids for O(1) lookup
        existing_chesscom_ids = {
            row[0]
            for row in db.query(GameModel.external_id)
            .filter(GameModel.user_id == user.id, GameModel.platform == "chesscom")
            .all()
            if row[0]
        }
        existing_lichess_ids = {
            row[0]
            for row in db.query(GameModel.external_id)
            .filter(GameModel.user_id == user.id, GameModel.platform == "lichess")
            .all()
            if row[0]
        }

        # 1. Sync Chess.com
        if user.chesscom_username:
            client = ChesscomClient()
            archives = await client.fetch_archives(user.chesscom_username)
            total_archives = max(1, len(archives))
            full_walk_completed = True

            for idx, archive_url in enumerate(reversed(archives)):
                await asyncio.sleep(0.1)  # small delay between requests
                games_in_archive = await client.fetch_archive_games(archive_url)
                if not games_in_archive:
                    continue

                archive_ext_ids = [
                    g.get("url", "").split("/")[-1]
                    for g in games_in_archive
                    if g.get("url")
                ]

                # Stop shortcut ONLY applies if backfill_done is True!
                if (
                    user.chesscom_backfill_done
                    and existing_chesscom_ids
                    and archive_ext_ids
                    and all(eid in existing_chesscom_ids for eid in archive_ext_ids)
                ):
                    logger.info(f"Incremental sync: archive {archive_url} is fully in DB. Stopping walk.")
                    full_walk_completed = False
                    break

                for g in reversed(games_in_archive):
                    url = g.get("url", "")
                    ext_id = url.split("/")[-1] if url else None
                    if not ext_id or ext_id in existing_chesscom_ids:
                        continue

                    pgn = g.get("pgn")
                    if not pgn:
                        continue

                    try:
                        parsed = parse_pgn_game(
                            pgn_text=pgn,
                            target_user_names=user_aliases,
                            source="online",
                            platform="chesscom",
                            external_id=ext_id
                        )
                        db_game = GameModel(
                            user_id=user.id,
                            source=parsed["source"],
                            platform=parsed["platform"],
                            external_id=parsed["externalId"],
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
                            phase_grades=parsed["phaseGrades"]
                        )
                        db.add(db_game)
                        existing_chesscom_ids.add(ext_id)
                        chesscom_count += 1

                        if chesscom_count % 50 == 0:
                            db.commit()
                    except Exception as e:
                        skipped_count += 1
                        logger.warning(f"Skipped unparseable Chess.com game {ext_id}: {e}")

                job.progress = min(85, 5 + int(((idx + 1) / total_archives) * 80))
                db.commit()

            # If a full walk finished across all archives, mark backfill_done = True
            if full_walk_completed:
                user.chesscom_backfill_done = True

            db.commit()

        # 2. Sync Lichess
        if user.lichess_username:
            l_client = LichessClient()
            since_ms = 0
            if user.lichess_backfill_done:
                latest_lichess = (
                    db.query(GameModel.date)
                    .filter(GameModel.user_id == user.id, GameModel.platform == "lichess")
                    .order_by(GameModel.date.desc())
                    .first()
                )
                if latest_lichess and latest_lichess[0]:
                    try:
                        dt = datetime.fromisoformat(latest_lichess[0].replace("Z", "+00:00"))
                        since_ms = int(dt.timestamp() * 1000) + 1
                    except Exception:
                        since_ms = 0

            raw_games = await l_client.fetch_games(user.lichess_username, since=since_ms)
            for g in raw_games:
                ext_id = g.get("id")
                if not ext_id or ext_id in existing_lichess_ids:
                    continue

                pgn = g.get("pgn")
                if not pgn:
                    continue

                try:
                    parsed = parse_pgn_game(
                        pgn_text=pgn,
                        target_user_names=user_aliases,
                        source="online",
                        platform="lichess",
                        external_id=ext_id
                    )
                    db_game = GameModel(
                        user_id=user.id,
                        source=parsed["source"],
                        platform=parsed["platform"],
                        external_id=parsed["externalId"],
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
                        phase_grades=parsed["phaseGrades"]
                    )
                    db.add(db_game)
                    existing_lichess_ids.add(ext_id)
                    lichess_count += 1

                    if lichess_count % 50 == 0:
                        db.commit()
                except Exception as e:
                    skipped_count += 1
                    logger.warning(f"Skipped unparseable Lichess game {ext_id}: {e}")

            user.lichess_backfill_done = True
            db.commit()

        total = chesscom_count + lichess_count
        msg = f"Synced {total} new games ({chesscom_count} Chess.com, {lichess_count} Lichess)." if total > 0 else "All games are up to date."

        job.status = "done"
        job.progress = 100
        job.result = {
            "syncedCount": total,
            "chesscom": chesscom_count,
            "lichess": lichess_count,
            "skipped": skipped_count,
            "message": msg
        }
        db.commit()

    except Exception as e:
        logger.exception(f"Sync job {job_id} failed: {e}")
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


@router.post("", response_model=JobResponse, response_model_exclude_none=True)
async def sync_games(
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = AnalysisJob(
        user_id=current_user.id,
        job_type="sync",
        status="queued",
        progress=0
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    # Launch background task
    background_tasks.add_task(run_sync_job_task, job.id, current_user.id)

    return JobResponse(job_id=job.id)
