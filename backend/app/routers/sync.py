import logging
import asyncio
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.game import Game as GameModel
from app.schemas.stats import SyncResponse
from app.auth import get_current_user
from app.services.chesscom_client import ChesscomClient
from app.services.lichess_client import LichessClient
from app.services.pgn_parser import parse_pgn_game

logger = logging.getLogger("all_chess.sync")
router = APIRouter(prefix="/sync", tags=["Sync"])

@router.post("", response_model=SyncResponse, response_model_exclude_none=True)
async def sync_games(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chesscom_count = 0
    lichess_count = 0
    skipped_count = 0

    user_aliases = [current_user.username]
    if current_user.chesscom_username:
        user_aliases.append(current_user.chesscom_username)
    if current_user.lichess_username:
        user_aliases.append(current_user.lichess_username)

    # Preload existing external_ids for O(1) lookup
    existing_chesscom_ids = {
        row[0]
        for row in db.query(GameModel.external_id)
        .filter(GameModel.user_id == current_user.id, GameModel.platform == "chesscom")
        .all()
        if row[0]
    }
    existing_lichess_ids = {
        row[0]
        for row in db.query(GameModel.external_id)
        .filter(GameModel.user_id == current_user.id, GameModel.platform == "lichess")
        .all()
        if row[0]
    }

    # 1. Sync Chess.com (Walk newest first, stop once a whole archive is already in DB)
    if current_user.chesscom_username:
        client = ChesscomClient()
        archives = await client.fetch_archives(current_user.chesscom_username)
        # Walk archives newest to oldest
        for archive_url in reversed(archives):
            await asyncio.sleep(0.1)  # small delay between requests
            games_in_archive = await client.fetch_archive_games(archive_url)
            if not games_in_archive:
                continue

            archive_ext_ids = [
                g.get("url", "").split("/")[-1]
                for g in games_in_archive
                if g.get("url")
            ]

            # If user already had games and EVERY game in this archive is in DB: stop
            if existing_chesscom_ids and archive_ext_ids and all(eid in existing_chesscom_ids for eid in archive_ext_ids):
                logger.info(f"Incremental sync: archive {archive_url} is fully in DB. Stopping walk.")
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
                        user_id=current_user.id,
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

        # Final commit for any remaining Chess.com games
        db.commit()

    # 2. Sync Lichess (since=0 on first sync, since=<last timestamp> on later syncs)
    if current_user.lichess_username:
        l_client = LichessClient()
        latest_lichess = (
            db.query(GameModel.date)
            .filter(GameModel.user_id == current_user.id, GameModel.platform == "lichess")
            .order_by(GameModel.date.desc())
            .first()
        )
        since_ms = 0
        if latest_lichess and latest_lichess[0]:
            try:
                dt = datetime.fromisoformat(latest_lichess[0].replace("Z", "+00:00"))
                since_ms = int(dt.timestamp() * 1000) + 1
            except Exception:
                since_ms = 0

        raw_games = await l_client.fetch_games(current_user.lichess_username, since=since_ms)
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
                    user_id=current_user.id,
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

        # Final commit for remaining Lichess games
        db.commit()

    if skipped_count > 0:
        logger.info(f"Sync complete. Skipped {skipped_count} unparseable games.")

    total = chesscom_count + lichess_count
    msg = f"Synced {total} new games ({chesscom_count} Chess.com, {lichess_count} Lichess)." if total > 0 else "All games are up to date."

    return SyncResponse(
        synced_count=total,
        chesscom=chesscom_count,
        lichess=lichess_count,
        message=msg
    )
