import logging
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.routers.auth import get_current_user
from app.models.user import User
from app.models.friend import Friend
from app.services.chesscom_client import ChesscomClient
from app.services.lichess_client import LichessClient
from app.services.seeder import seed_initial_friends_for_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/friends", tags=["friends"])


class FriendRatings(BaseModel):
    rapid: Optional[int] = None
    blitz: Optional[int] = None
    bullet: Optional[int] = None


class FriendOut(BaseModel):
    id: str
    username: str
    platform: str
    rating: int
    ratings: Optional[FriendRatings] = None
    online: bool
    avatarUrl: Optional[str] = None
    lastActive: Optional[str] = None


class AddFriendIn(BaseModel):
    username: str
    platform: str = "chesscom"


@router.get("", response_model=List[FriendOut])
def get_friends(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    seed_initial_friends_for_user(db, user.id)
    friends = db.query(Friend).filter(Friend.user_id == user.id).all()

    results = []
    for f in friends:
        r_dict = f.ratings or {}
        results.append(
            FriendOut(
                id=f.id,
                username=f.username,
                platform=f.platform,
                rating=f.rating,
                ratings=FriendRatings(
                    rapid=r_dict.get("rapid"),
                    blitz=r_dict.get("blitz"),
                    bullet=r_dict.get("bullet"),
                ),
                online=f.online,
                avatarUrl=f.avatar_url,
                lastActive=f.last_active,
            )
        )
    return results


@router.post("", response_model=FriendOut)
def add_friend(
    body: AddFriendIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    # Check if friend already exists for this user
    existing = (
        db.query(Friend)
        .filter(Friend.user_id == user.id, Friend.username.ilike(body.username.strip()))
        .first()
    )
    if existing:
        r_dict = existing.ratings or {}
        return FriendOut(
            id=existing.id,
            username=existing.username,
            platform=existing.platform,
            rating=existing.rating,
            ratings=FriendRatings(
                rapid=r_dict.get("rapid"),
                blitz=r_dict.get("blitz"),
                bullet=r_dict.get("bullet"),
            ),
            online=existing.online,
            avatarUrl=existing.avatar_url,
            lastActive=existing.last_active,
        )

    clean_username = body.username.strip()
    platform = body.platform.lower()

    rapid_r = 900
    blitz_r = 870
    bullet_r = 850
    avatar = None

    # Try fetching real per-speed ratings from platform
    if platform == "chesscom":
        try:
            stats = ChesscomClient().get_player_stats(clean_username)
            if stats:
                if "chess_rapid" in stats:
                    rapid_r = stats["chess_rapid"].get("last", {}).get("rating", rapid_r)
                if "chess_blitz" in stats:
                    blitz_r = stats["chess_blitz"].get("last", {}).get("rating", blitz_r)
                if "chess_bullet" in stats:
                    bullet_r = stats["chess_bullet"].get("last", {}).get("rating", bullet_r)

            profile = ChesscomClient().get_player_profile(clean_username)
            if profile and "avatar" in profile:
                avatar = profile["avatar"]
        except Exception as e:
            logger.info(f"Could not fetch Chess.com stats for friend {clean_username}: {e}")

    elif platform == "lichess":
        try:
            perf = LichessClient().get_player_stats(clean_username)
            if perf and "perfs" in perf:
                perfs = perf["perfs"]
                if "rapid" in perfs:
                    rapid_r = perfs["rapid"].get("rating", rapid_r)
                if "blitz" in perfs:
                    blitz_r = perfs["blitz"].get("rating", blitz_r)
                if "bullet" in perfs:
                    bullet_r = perfs["bullet"].get("rating", bullet_r)
        except Exception as e:
            logger.info(f"Could not fetch Lichess stats for friend {clean_username}: {e}")

    ratings_data = {
        "rapid": rapid_r,
        "blitz": blitz_r,
        "bullet": bullet_r,
    }

    new_friend = Friend(
        user_id=user.id,
        username=clean_username,
        platform=platform,
        rating=rapid_r,
        ratings=ratings_data,
        online=True,
        avatar_url=avatar,
        last_active="Just now",
    )
    db.add(new_friend)
    db.commit()
    db.refresh(new_friend)

    return FriendOut(
        id=new_friend.id,
        username=new_friend.username,
        platform=new_friend.platform,
        rating=new_friend.rating,
        ratings=FriendRatings(rapid=rapid_r, blitz=blitz_r, bullet=bullet_r),
        online=new_friend.online,
        avatarUrl=new_friend.avatar_url,
        lastActive=new_friend.last_active,
    )


@router.delete("/{friend_id}")
def delete_friend(
    friend_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    f = db.query(Friend).filter(Friend.user_id == user.id, Friend.id == friend_id).first()
    if not f:
        raise HTTPException(status_code=404, detail="Friend not found")
    db.delete(f)
    db.commit()
    return {"success": True, "deleted_id": friend_id}
