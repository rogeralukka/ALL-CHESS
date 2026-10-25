from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.user import User
from app.schemas.auth import SessionCreate, SessionResponse, UserResponse
from app.auth import set_session_cookie, clear_session_cookie, get_current_user

router = APIRouter(prefix="/session", tags=["Session"])

@router.post("", response_model=SessionResponse)
def create_session(
    data: SessionCreate,
    response: Response,
    db: Session = Depends(get_db)
):
    if data.passcode.strip() != settings.app_passcode:
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
            updated = True
        if data.lichess_username and data.lichess_username.strip() != user.lichess_username:
            user.lichess_username = data.lichess_username.strip()
            updated = True
        if updated:
            db.commit()
            db.refresh(user)

    set_session_cookie(response, user.id)

    return SessionResponse(
        user=UserResponse(
            id=user.id,
            username=user.username,
            chesscom_username=user.chesscom_username,
            lichess_username=user.lichess_username
        )
    )

@router.get("", response_model=SessionResponse)
def get_session(current_user: User = Depends(get_current_user)):
    return SessionResponse(
        user=UserResponse(
            id=current_user.id,
            username=current_user.username,
            chesscom_username=current_user.chesscom_username,
            lichess_username=current_user.lichess_username
        )
    )

@router.delete("")
def delete_session(response: Response):
    clear_session_cookie(response)
    return {"ok": True}
