from typing import Optional
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

class SessionResponse(CamelModel):
    user: UserResponse
