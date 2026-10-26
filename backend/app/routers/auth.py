import hmac
import time
import logging
from collections import defaultdict
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.user import User
from app.schemas.auth import SessionCreate, SessionResponse, UserResponse
from app.auth import set_session_cookie, clear_session_cookie, get_current_user
from app.services.chesscom_client import ChesscomClient

logger = logging.getLogger("all_chess.auth")
router = APIRouter(prefix="/session", tags=["Session"])

# Rate limiting for POST /session: max 10 attempts per minute per IP
_SESSION_ATTEMPTS = defaultdict(list)
_RATE_LIMIT_WINDOW_SECS = 60
_MAX_SESSION_ATTEMPTS = 10

def check_session_rate_limit(request: Request) -> None:
    client_ip = request.client.host if request.client else "127.0.0.1"
    now = time.time()
    # Filter attempts within the sliding window
    attempts = [t for t in _SESSION_ATTEMPTS[client_ip] if now - t < _RATE_LIMIT_WINDOW_SECS]
    if len(attempts) >= _MAX_SESSION_ATTEMPTS:
        raise HTTPException(
            status_code=429,
            detail="Too many session attempts. Please wait a minute before trying again."
        )
    attempts.append(now)
    _SESSION_ATTEMPTS[client_ip] = attempts


async def sync_user_chesscom_profile(user: User, db: Session) -> None:
    if not user.chesscom_username:
        return
    try:
        client = ChesscomClient()
        profile = await client.fetch_player_profile(user.chesscom_username)
        if profile:
            changed = False
            if profile.get("avatar") and user.avatar_url != profile["avatar"]:
                user.avatar_url = profile["avatar"]
                changed = True
            country_val = profile.get("country")
            if country_val:
                code = country_val.split("/")[-1].upper()
                if user.country_code != code:
                    user.country_code = code
                    changed = True
            if changed:
                db.commit()
                db.refresh(user)
    except Exception as e:
        logger.warning(f"Failed to fetch Chess.com profile for {user.chesscom_username}: {e}")


@router.post("", response_model=SessionResponse, response_model_exclude_none=True)
async def create_session(
    data: SessionCreate,
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    check_session_rate_limit(request)

    if not hmac.compare_digest(data.passcode.strip(), settings.app_passcode.strip()):
        raise HTTPException(
            status_code=401,
            detail="Invalid app passcode."
        )

    clean_username = data.username.strip()
    if not clean_username:
        raise HTTPException(
            status_code=400,
            detail="Username is required."
        )

    user = db.query(User).filter(User.username == clean_username).first()
    if not user:
        user = User(
            username=clean_username,
            chesscom_username=data.chesscom_username.strip() if data.chesscom_username else None,
            lichess_username=data.lichess_username.strip() if data.lichess_username else None
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Update linked usernames if provided
        updated = False
        if data.chesscom_username and data.chesscom_username.strip() != user.chesscom_username:
            user.chesscom_username = data.chesscom_username.strip()
            user.avatar_url = None
            user.country_code = None
            updated = True
        if data.lichess_username and data.lichess_username.strip() != user.lichess_username:
            user.lichess_username = data.lichess_username.strip()
            updated = True
        if updated:
            db.commit()
            db.refresh(user)

    if user.chesscom_username:
        await sync_user_chesscom_profile(user, db)

    set_session_cookie(response, user.id)

    user_resp = UserResponse(
        id=user.id,
        username=user.username,
        chesscom_username=user.chesscom_username,
        lichess_username=user.lichess_username,
        avatar_url=user.avatar_url,
        country_code=user.country_code,
        created_at=user.created_at
    )
    return SessionResponse(
        user=user_resp,
        avatar_url=user.avatar_url,
        country_code=user.country_code,
        created_at=user.created_at
    )


@router.get("", response_model=SessionResponse, response_model_exclude_none=True)
async def get_session(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.chesscom_username and (not current_user.avatar_url or not current_user.country_code):
        await sync_user_chesscom_profile(current_user, db)

    user_resp = UserResponse(
        id=current_user.id,
        username=current_user.username,
        chesscom_username=current_user.chesscom_username,
        lichess_username=current_user.lichess_username,
        avatar_url=current_user.avatar_url,
        country_code=current_user.country_code,
        created_at=current_user.created_at
    )
    return SessionResponse(
        user=user_resp,
        avatar_url=current_user.avatar_url,
        country_code=current_user.country_code,
        created_at=current_user.created_at
    )


@router.delete("")
def delete_session(response: Response):
    clear_session_cookie(response)
    return {"ok": True}
