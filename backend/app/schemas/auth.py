from typing import Optional
from datetime import datetime
from app.schemas.common import CamelModel

class SessionCreate(CamelModel):
    passcode: str
    username: str
    chesscom_username: Optional[str] = None
    lichess_username: Optional[str] = None

class UserResponse(CamelModel):
    id: str
    username: str
    chesscom_username: Optional[str] = None
    lichess_username: Optional[str] = None
    avatar_url: Optional[str] = None
    country_code: Optional[str] = None
    created_at: Optional[datetime] = None

class SessionResponse(CamelModel):
    user: UserResponse
    avatar_url: Optional[str] = None
    country_code: Optional[str] = None
    created_at: Optional[datetime] = None
