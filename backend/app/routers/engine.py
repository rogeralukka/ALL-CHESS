import time
import logging
from typing import List, Optional, Dict
from fastapi import APIRouter, Depends, HTTPException
from pydantic import Field
import chess
from app.auth import get_current_user
from app.models.user import User
from app.schemas.common import CamelModel
from app.schemas.game import TopEngineLine
from app.services.engine_service import analyze_position

logger = logging.getLogger("all_chess.engine_router")
router = APIRouter(prefix="/engine", tags=["Engine"])

class EnginePositionRequest(CamelModel):
    fen: str
    depth: Optional[int] = Field(default=14, ge=1, le=24)
    multipv: Optional[int] = Field(default=3, ge=1, le=5)

# In-memory sliding-window rate limiter per user (60 requests per 60 seconds)
_RATE_LIMIT_WINDOW = 60.0
_MAX_REQUESTS_PER_WINDOW = 60
_USER_REQUEST_TIMESTAMPS: Dict[str, List[float]] = {}


def check_rate_limit(user_id: str) -> None:
    now = time.time()
    timestamps = _USER_REQUEST_TIMESTAMPS.get(user_id, [])
    # Filter timestamps within the current window
    valid_timestamps = [t for t in timestamps if now - t < _RATE_LIMIT_WINDOW]
    if len(valid_timestamps) >= _MAX_REQUESTS_PER_WINDOW:
        raise HTTPException(
            status_code=429,
            detail="Engine evaluation rate limit exceeded. Please wait a moment before sending more requests."
        )
    valid_timestamps.append(now)
    _USER_REQUEST_TIMESTAMPS[user_id] = valid_timestamps


@router.post("/position", response_model=List[TopEngineLine])
async def evaluate_position(
    req: EnginePositionRequest,
    current_user: User = Depends(get_current_user)
) -> List[TopEngineLine]:
    check_rate_limit(current_user.id)

    # Validate FEN
    try:
        chess.Board(req.fen)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid FEN position: {e}")

    depth = req.depth or 14
    multipv = req.multipv or 3

    try:
        lines = await analyze_position(fen=req.fen, depth=depth, multipv=multipv)
        return lines
    except Exception as e:
        logger.exception(f"Position evaluation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Engine evaluation error: {str(e)}")
