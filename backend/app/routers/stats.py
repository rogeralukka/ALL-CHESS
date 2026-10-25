from typing import List, Literal, Optional
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.game import Game as GameModel
from app.schemas.stats import (
    RatingPoint,
    RatingSummary,
    OpeningStat,
    PhasePointsLost,
    StrengthsWeaknessesResponse
)
from app.auth import get_current_user

router = APIRouter(prefix="/stats", tags=["Stats"])

@router.get("/rating-history", response_model=List[RatingPoint])
def get_rating_history(
    range: Optional[Literal['30d', '90d', 'all']] = Query('90d'),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    games = (
        db.query(GameModel)
        .filter(GameModel.user_id == current_user.id)
        .order_by(GameModel.date.asc())
        .all()
    )

    if not games:
        return []

    now = datetime.now(timezone.utc)
    cutoff = None
    if range == '30d':
        cutoff = now - timedelta(days=30)
    elif range == '90d':
        cutoff = now - timedelta(days=90)

    current_ratings = {"rapid": 0, "blitz": 0, "bullet": 0}
    history_by_date = {}

    for g in games:
        d_str = g.date[:10] if g.date else ""
        if not d_str:
            continue

        speed = g.speed.lower() if g.speed else "rapid"
        user_rating = g.white.get("rating") if g.is_user_white else g.black.get("rating")
        if user_rating and isinstance(user_rating, int) and speed in current_ratings:
            current_ratings[speed] = user_rating

        history_by_date[d_str] = dict(current_ratings)

    points: List[RatingPoint] = []
    for d_str, r_dict in sorted(history_by_date.items()):
        if cutoff:
            try:
                dt = datetime.fromisoformat(d_str).replace(tzinfo=timezone.utc)
                if dt < cutoff:
                    continue
            except Exception:
                pass

        points.append(
            RatingPoint(
                date=d_str,
                rapid=r_dict["rapid"],
                blitz=r_dict["blitz"],
                bullet=r_dict["bullet"]
            )
        )

    return points

@router.get("/ratings", response_model=List[RatingSummary])
def get_ratings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    games = (
        db.query(GameModel)
        .filter(GameModel.user_id == current_user.id)
        .order_by(GameModel.date.desc())
        .all()
    )

    results: List[RatingSummary] = []
    seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)

    for speed_key, mode_name in [("rapid", "Rapid"), ("blitz", "Blitz"), ("bullet", "Bullet")]:
        speed_games = [g for g in games if (g.speed or "").lower() == speed_key]
        if not speed_games:
            results.append(RatingSummary(mode=mode_name, rating=0, delta_weekly=0))
            continue

        # games are already in date desc order
        latest_game = speed_games[0]
        latest_rating = (latest_game.white.get("rating") if latest_game.is_user_white else latest_game.black.get("rating")) or 0

        # Find game closest to 7 days ago
        past_rating = latest_rating
        found_past = False
        for g in speed_games:
            try:
                g_date = datetime.fromisoformat(g.date.replace("Z", "+00:00"))
                if g_date <= seven_days_ago:
                    past_rating = (g.white.get("rating") if g.is_user_white else g.black.get("rating")) or latest_rating
                    found_past = True
                    break
            except Exception:
                continue

        if not found_past and len(speed_games) > 1:
            earliest_game = speed_games[-1]
            past_rating = (earliest_game.white.get("rating") if earliest_game.is_user_white else earliest_game.black.get("rating")) or latest_rating

        delta = latest_rating - past_rating
        results.append(RatingSummary(mode=mode_name, rating=latest_rating, delta_weekly=delta))

    return results

@router.get("/openings", response_model=List[OpeningStat])
def get_opening_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    games = db.query(GameModel).filter(GameModel.user_id == current_user.id).all()
    if not games:
        return []

    # Aggregate by ECO + name
    stats_by_eco = {}
    for g in games:
        op = g.opening or {}
        eco = op.get("eco", "A00")
        name = op.get("name", "Unknown Opening")
        key = (eco, name)

        if key not in stats_by_eco:
            stats_by_eco[key] = {
                "eco": eco,
                "name": name,
                "games": 0,
                "wins": 0,
                "draws": 0,
                "losses": 0,
                "accuracies": []
            }

        data = stats_by_eco[key]
        data["games"] += 1

        is_white = g.is_user_white
        res = g.result
        if (is_white and res == "1-0") or (not is_white and res == "0-1"):
            data["wins"] += 1
        elif res == "1/2-1/2":
            data["draws"] += 1
        elif (is_white and res == "0-1") or (not is_white and res == "1-0"):
            data["losses"] += 1

        acc_obj = g.accuracy or {}
        user_acc = acc_obj.get("white") if is_white else acc_obj.get("black")
        if user_acc is not None and isinstance(user_acc, (int, float)):
            data["accuracies"].append(float(user_acc))

    results: List[OpeningStat] = []
    for (eco, name), data in sorted(stats_by_eco.items(), key=lambda x: x[1]["games"], reverse=True):
        count = data["games"]
        win_rate = round((data["wins"] / count) * 100.0, 1) if count else 0.0
        draw_rate = round((data["draws"] / count) * 100.0, 1) if count else 0.0
        loss_rate = round((data["losses"] / count) * 100.0, 1) if count else 0.0
        accs = data["accuracies"]
        avg_acc = round(sum(accs) / len(accs), 1) if accs else None

        results.append(
            OpeningStat(
                eco=eco,
                name=name,
                games=count,
                win_rate=win_rate,
                draw_rate=draw_rate,
                loss_rate=loss_rate,
                avg_accuracy=avg_acc
            )
        )

    return results

@router.get("/phases", response_model=PhasePointsLost)
def get_phase_points_lost(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Until Phase 2 deep analysis exists, return exact zeros
    return PhasePointsLost(
        opening=0.0,
        middlegame=0.0,
        endgame=0.0
    )

@router.get("/insights", response_model=StrengthsWeaknessesResponse)
def get_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Until Phase 2 deep analysis exists, return empty lists
    return StrengthsWeaknessesResponse(
        strengths=[],
        weaknesses=[]
    )
