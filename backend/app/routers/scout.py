from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.auth import get_current_user
from app.schemas.scout import ScoutProfile
from app.services.scout_service import get_or_fetch_scout_profile, search_cached_scout_profiles

router = APIRouter(prefix="/scout", tags=["Scout"])


@router.get("", response_model=List[ScoutProfile])
def search_scout(
    query: str = Query("", description="Opponent username search query"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Searches previously scouted opponent profiles from cache."""
    return search_cached_scout_profiles(query, db)


@router.get("/{username}", response_model=ScoutProfile)
async def get_scout_profile(
    username: str,
    platform: str = Query("chesscom", description="Platform: chesscom or lichess"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Fetches comprehensive opponent scouting report: rating, win rate,
    opening repertoire stats, and recent games. Cached for 24 hours.
    """
    profile = await get_or_fetch_scout_profile(username, platform, db)
    if not profile:
        raise HTTPException(
            status_code=404,
            detail=f"Opponent '{username}' not found or has no public games on {platform}."
        )
    return profile
