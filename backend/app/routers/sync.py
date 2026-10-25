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

router = APIRouter(prefix="/sync", tags=["Sync"])

@router.post("", response_model=SyncResponse, response_model_exclude_none=True)
async def sync_games(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chesscom_count = 0
    lichess_count = 0

    user_aliases = [current_user.username]
    if current_user.chesscom_username:
        user_aliases.append(current_user.chesscom_username)
    if current_user.lichess_username:
        user_aliases.append(current_user.lichess_username)

    # 1. Sync Chess.com
    if current_user.chesscom_username:
        client = ChesscomClient()
        raw_games = await client.fetch_recent_games(current_user.chesscom_username, max_games=30)
        for g in raw_games:
            url = g.get("url", "")
            ext_id = url.split("/")[-1] if url else None
            pgn = g.get("pgn")
            if not pgn:
                continue

            # Check if exists
            exists = db.query(GameModel).filter(
                GameModel.user_id == current_user.id,
                GameModel.platform == "chesscom",
                GameModel.external_id == ext_id
            ).first()
            if exists:
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
                chesscom_count += 1
            except Exception as e:
                print(f"Failed to parse Chess.com game {ext_id}: {e}")

    # 2. Sync Lichess
    if current_user.lichess_username:
        l_client = LichessClient()
        raw_games = await l_client.fetch_recent_games(current_user.lichess_username, max_games=30)
        for g in raw_games:
            ext_id = g.get("id")
            pgn = g.get("pgn")
            if not pgn:
                continue

            exists = db.query(GameModel).filter(
                GameModel.user_id == current_user.id,
                GameModel.platform == "lichess",
                GameModel.external_id == ext_id
            ).first()
            if exists:
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
                lichess_count += 1
            except Exception as e:
                print(f"Failed to parse Lichess game {ext_id}: {e}")

    if chesscom_count > 0 or lichess_count > 0:
        db.commit()

    total = chesscom_count + lichess_count
    msg = f"Synced {total} new games ({chesscom_count} Chess.com, {lichess_count} Lichess)." if total > 0 else "All games are up to date."

    return SyncResponse(
        synced_count=total,
        chesscom=chesscom_count,
        lichess=lichess_count,
        message=msg
    )
