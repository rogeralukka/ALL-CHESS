import asyncio
import hmac
import re
import time
import logging
from collections import defaultdict
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.user import User
from app.schemas.auth import LinkedAccountsUpdate, SessionCreate, SessionResponse, UserResponse
from app.auth import set_session_cookie, clear_session_cookie, get_current_user
from app.services.chesscom_client import ChesscomClient
from app.services.lichess_client import LichessClient

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
        profile = await asyncio.wait_for(client.fetch_player_profile(user.chesscom_username), timeout=_VERIFY_TIMEOUT_SECS)
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


_VERIFY_TIMEOUT_SECS = 8.0
_HANDLE_RE = re.compile(r"^[A-Za-z0-9_-]{1,64}$")


def _clean_handle(value: str | None, label: str) -> str | None:
    """None/blank = unlink. Otherwise a valid platform username."""
    if value is None or not value.strip():
        return None
    handle = value.strip()
    if not _HANDLE_RE.match(handle):
        raise HTTPException(
            status_code=422,
            detail=f"{label} usernames can only contain letters, numbers, _ and - (max 64).",
        )
    return handle


async def _verify_exists(platform: str, handle: str) -> None:
    """Refuse a username that does not exist on the platform. Network trouble never blocks (we cannot tell)."""
    try:
        if platform == "chesscom":
            lookup = ChesscomClient().fetch_player_profile(handle)
        else:
            lookup = LichessClient().fetch_player_stats(handle)
        # a slow platform must not make logging in hang
        profile = await asyncio.wait_for(lookup, timeout=_VERIFY_TIMEOUT_SECS)
    except Exception as e:  # noqa: BLE001
        logger.warning(f"Could not verify {platform} user {handle}: {e}")
        return
    if profile is None:
        label = "Chess.com" if platform == "chesscom" else "Lichess"
        raise HTTPException(status_code=404, detail=f"{label} user '{handle}' was not found.")


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
    new_cc = _clean_handle(data.chesscom_username, "Chess.com")
    new_li = _clean_handle(data.lichess_username, "Lichess")

    # A login needs a real Chess.com or Lichess account: the one given now, or one already linked to this name.
    has_cc = new_cc or (user.chesscom_username if user else None)
    has_li = new_li or (user.lichess_username if user else None)
    if not has_cc and not has_li:
        raise HTTPException(
            status_code=422,
            detail="Enter your Chess.com or Lichess username to log in.",
        )
    if new_cc and (not user or new_cc.lower() != (user.chesscom_username or "").lower()):
        await _verify_exists("chesscom", new_cc)
    if new_li and (not user or new_li.lower() != (user.lichess_username or "").lower()):
        await _verify_exists("lichess", new_li)

    if not user:
        user = User(
            username=clean_username,
            chesscom_username=new_cc,
            lichess_username=new_li,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Update linked usernames if provided
        updated = False
        if new_cc and new_cc != user.chesscom_username:
            if new_cc.lower() != (user.chesscom_username or "").lower():
                user.avatar_url = None
                user.country_code = None
                user.chesscom_backfill_done = False
            user.chesscom_username = new_cc
            updated = True
        if new_li and new_li != user.lichess_username:
            if new_li.lower() != (user.lichess_username or "").lower():
                user.lichess_backfill_done = False
            user.lichess_username = new_li
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


@router.patch("/linked-accounts", response_model=SessionResponse, response_model_exclude_none=True)
async def update_linked_accounts(
    data: LinkedAccountsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Link, change or unlink the Chess.com / Lichess usernames of the signed-in user (no passcode needed)."""
    sent = data.model_fields_set
    new_cc = _clean_handle(data.chesscom_username, "Chess.com") if "chesscom_username" in sent else current_user.chesscom_username
    new_li = _clean_handle(data.lichess_username, "Lichess") if "lichess_username" in sent else current_user.lichess_username
    if not new_cc and not new_li:
        raise HTTPException(status_code=422, detail="Keep at least one account linked (Chess.com or Lichess).")

    chesscom_changed = False
    if "chesscom_username" in sent:
        if (new_cc or "").lower() != (current_user.chesscom_username or "").lower():
            if new_cc:
                await _verify_exists("chesscom", new_cc)
            current_user.avatar_url = None
            current_user.country_code = None
            current_user.chesscom_backfill_done = False
            chesscom_changed = True
        current_user.chesscom_username = new_cc
    if "lichess_username" in sent:
        if (new_li or "").lower() != (current_user.lichess_username or "").lower():
            if new_li:
                await _verify_exists("lichess", new_li)
            current_user.lichess_backfill_done = False
        current_user.lichess_username = new_li
    db.commit()
    db.refresh(current_user)
    if chesscom_changed and current_user.chesscom_username:
        await sync_user_chesscom_profile(current_user, db)

    user_resp = UserResponse(
        id=current_user.id,
        username=current_user.username,
        chesscom_username=current_user.chesscom_username,
        lichess_username=current_user.lichess_username,
        avatar_url=current_user.avatar_url,
        country_code=current_user.country_code,
        created_at=current_user.created_at,
    )
    return SessionResponse(
        user=user_resp,
        avatar_url=current_user.avatar_url,
        country_code=current_user.country_code,
        created_at=current_user.created_at,
    )


@router.delete("")
def delete_session(response: Response):
    clear_session_cookie(response)
    return {"ok": True}
