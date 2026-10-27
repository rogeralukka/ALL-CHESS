import hmac
import hashlib
from typing import Optional
from fastapi import Request, Response, HTTPException, Depends
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.user import User

def sign_user_id(user_id: str) -> str:
    signature = hmac.new(
        settings.session_secret.encode("utf-8"),
        user_id.encode("utf-8"),
        hashlib.sha256
    ).hexdigest()
    return f"{user_id}.{signature}"

def verify_session_token(token: str) -> Optional[str]:
    if not token or "." not in token:
        return None
    user_id, signature = token.rsplit(".", 1)
    expected_sig = hmac.new(
        settings.session_secret.encode("utf-8"),
        user_id.encode("utf-8"),
        hashlib.sha256
    ).hexdigest()
    if hmac.compare_digest(signature, expected_sig):
        return user_id
    return None

def set_session_cookie(response: Response, user_id: str) -> None:
    token = sign_user_id(user_id)
    response.set_cookie(
        key=settings.session_cookie_name,
        value=token,
        max_age=86400 * 30, # 30 days
        httponly=True,
        samesite=settings.cookie_samesite if settings.cookie_samesite in ("lax", "strict", "none") else "lax",
        secure=settings.cookie_secure or settings.cookie_samesite == "none",  # False allows local HTTP dev
        path="/"
    )

def clear_session_cookie(response: Response) -> None:
    response.delete_cookie(
        key=settings.session_cookie_name,
        path="/"
    )

def get_current_user_optional(
    request: Request,
    db: Session = Depends(get_db)
) -> Optional[User]:
    token = request.cookies.get(settings.session_cookie_name)
    if not token:
        # Also check Authorization Bearer header for flexibility in curl/tests
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            
    if not token:
        return None
        
    user_id = verify_session_token(token)
    if not user_id:
        return None
        
    return db.query(User).filter(User.id == user_id).first()

def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
) -> User:
    user = get_current_user_optional(request, db)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Authentication required. Please authenticate with passcode."
        )
    return user
