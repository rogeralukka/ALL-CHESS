from typing import List, Literal, Optional
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
    StrengthsWeaknessesResponse,
    StrengthWeakness
)
from app.auth import get_current_user
from app.routers.games import seed_initial_games_if_empty

router = APIRouter(prefix="/stats", tags=["Stats"])

MOCK_RATING_HISTORY = [
    RatingPoint(date="2026-07-24", rapid=840, blitz=790, bullet=750),
    RatingPoint(date="2026-08-01", rapid=855, blitz=810, bullet=780),
    RatingPoint(date="2026-08-15", rapid=870, blitz=805, bullet=800),
    RatingPoint(date="2026-09-01", rapid=860, blitz=830, bullet=820),
    RatingPoint(date="2026-09-15", rapid=885, blitz=845, bullet=840),
    RatingPoint(date="2026-10-01", rapid=895, blitz=850, bullet=865),
    RatingPoint(date="2026-10-10", rapid=910, blitz=865, bullet=875),
    RatingPoint(date="2026-10-22", rapid=905, blitz=870, bullet=880),
]

@router.get("/rating-history", response_model=List[RatingPoint])
def get_rating_history(
    range: Optional[Literal['30d', '90d', 'all']] = Query('90d'),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    seed_initial_games_if_empty(db, current_user)
    if range == '30d':
        return MOCK_RATING_HISTORY[-4:]
    elif range == '90d':
        return MOCK_RATING_HISTORY[-6:]
    return MOCK_RATING_HISTORY

@router.get("/ratings", response_model=List[RatingSummary])
def get_ratings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    seed_initial_games_if_empty(db, current_user)
    # Derive latest ratings from games if available
    games = db.query(GameModel).filter(GameModel.user_id == current_user.id).order_by(GameModel.date.desc()).all()

    rapid_rating = 905
    blitz_rating = 870
    bullet_rating = 880

    for g in games:
        speed = g.speed
        user_rating = g.white.get("rating") if g.is_user_white else g.black.get("rating")
        if user_rating and isinstance(user_rating, int):
            if speed == "rapid" and rapid_rating == 905:
                rapid_rating = user_rating
            elif speed == "blitz" and blitz_rating == 870:
                blitz_rating = user_rating
            elif speed == "bullet" and bullet_rating == 880:
                bullet_rating = user_rating

    return [
        RatingSummary(mode="Rapid", rating=rapid_rating, delta_weekly=15),
        RatingSummary(mode="Blitz", rating=blitz_rating, delta_weekly=5),
        RatingSummary(mode="Bullet", rating=bullet_rating, delta_weekly=5),
    ]

@router.get("/openings", response_model=List[OpeningStat])
def get_opening_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    seed_initial_games_if_empty(db, current_user)
    games = db.query(GameModel).filter(GameModel.user_id == current_user.id).all()

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
        if user_acc:
            data["accuracies"].append(user_acc)

    results: List[OpeningStat] = []
    for (eco, name), data in sorted(stats_by_eco.items(), key=lambda x: x[1]["games"], reverse=True):
        count = data["games"]
        win_rate = round((data["wins"] / count) * 100.0, 1) if count else 0.0
        draw_rate = round((data["draws"] / count) * 100.0, 1) if count else 0.0
        loss_rate = round((data["losses"] / count) * 100.0, 1) if count else 0.0
        accs = data["accuracies"]
        avg_acc = round(sum(accs) / len(accs), 1) if accs else 80.0

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

    # If few games, return top default list
    if not results:
        results = [
            OpeningStat(eco='C50', name='Italian Game', games=28, win_rate=64.3, draw_rate=7.1, loss_rate=28.6, avg_accuracy=84.2),
            OpeningStat(eco='B12', name='Caro-Kann Defense', games=22, win_rate=59.1, draw_rate=13.6, loss_rate=27.3, avg_accuracy=81.5),
            OpeningStat(eco='B20', name='Sicilian Defense', games=19, win_rate=52.6, draw_rate=10.5, loss_rate=36.8, avg_accuracy=78.9),
            OpeningStat(eco='D00', name='London System', games=16, win_rate=56.2, draw_rate=12.5, loss_rate=31.3, avg_accuracy=80.1),
        ]
    return results

@router.get("/phases", response_model=PhasePointsLost)
def get_phase_points_lost(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return PhasePointsLost(
        opening=0.3,
        middlegame=1.6,
        endgame=1.0
    )

@router.get("/insights", response_model=StrengthsWeaknessesResponse)
def get_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return StrengthsWeaknessesResponse(
        strengths=[
            StrengthWeakness(label="King Safety", delta="+0.8", type="strength"),
            StrengthWeakness(label="Queen Development", delta="+0.6", type="strength"),
            StrengthWeakness(label="Back-Rank Defense", delta="+0.5", type="strength"),
        ],
        weaknesses=[
            StrengthWeakness(label="Hanging Minors", delta="-1.2", type="weakness"),
            StrengthWeakness(label="Pawn Structure", delta="-0.9", type="weakness"),
            StrengthWeakness(label="Time Management", delta="-0.6", type="weakness"),
        ]
    )
