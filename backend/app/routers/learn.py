import json
from pathlib import Path
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db, utc_now
from app.routers.auth import get_current_user
from app.models.user import User
from app.models.learn import LessonProgress, UserStreak

router = APIRouter(prefix="/learn", tags=["learn"])

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
STAGES_FILE = DATA_DIR / "stages.json"


def load_raw_stages() -> List[Dict[str, Any]]:
    if not STAGES_FILE.exists():
        return []
    with open(STAGES_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


class CompleteStageIn(BaseModel):
    stars: int = 3
    xp: int = 50


@router.get("/stages")
def get_stages(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    stages = load_raw_stages()
    if category:
        stages = [s for s in stages if s.get("category") == category]

    # Query user's progress
    progress_records = (
        db.query(LessonProgress)
        .filter(LessonProgress.user_id == user.id)
        .all()
    )
    progress_map = {p.stage_id: p for p in progress_records}

    result = []
    for s in stages:
        stage_copy = dict(s)
        p = progress_map.get(s["id"])
        if p:
            stage_copy["status"] = p.status
            stage_copy["stars"] = p.stars
            stage_copy["xp"] = p.xp
        result.append(stage_copy)

    return result


@router.get("/stages/{stage_id}")
def get_stage_by_id(
    stage_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    stages = load_raw_stages()
    stage = next((s for s in stages if s["id"] == stage_id), None)
    if not stage:
        raise HTTPException(status_code=404, detail="Lesson stage not found")

    p = (
        db.query(LessonProgress)
        .filter(LessonProgress.user_id == user.id, LessonProgress.stage_id == stage_id)
        .first()
    )

    stage_copy = dict(stage)
    if p:
        stage_copy["status"] = p.status
        stage_copy["stars"] = p.stars
        stage_copy["xp"] = p.xp

    return stage_copy


@router.post("/stages/{stage_id}/complete")
def complete_stage(
    stage_id: str,
    body: CompleteStageIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    stages = load_raw_stages()
    stage_idx = next((i for i, s in enumerate(stages) if s["id"] == stage_id), -1)
    if stage_idx == -1:
        raise HTTPException(status_code=404, detail="Lesson stage not found")

    # Update or create progress for this stage
    prog = (
        db.query(LessonProgress)
        .filter(LessonProgress.user_id == user.id, LessonProgress.stage_id == stage_id)
        .first()
    )
    if not prog:
        prog = LessonProgress(
            user_id=user.id,
            stage_id=stage_id,
            status="done",
            stars=body.stars,
            xp=body.xp,
            last_completed_at=utc_now(),
        )
        db.add(prog)
    else:
        prog.status = "done"
        prog.stars = max(prog.stars, body.stars)
        prog.xp = max(prog.xp, body.xp)
        prog.last_completed_at = utc_now()

    # Automatically unlock next stage in this category if locked
    next_stage_id = None
    curr_category = stages[stage_idx].get("category")
    next_stage = None
    for j in range(stage_idx + 1, len(stages)):
        if stages[j].get("category") == curr_category:
            next_stage = stages[j]
            break

    if next_stage:
        next_stage_id = next_stage["id"]
        next_prog = (
            db.query(LessonProgress)
            .filter(LessonProgress.user_id == user.id, LessonProgress.stage_id == next_stage_id)
            .first()
        )
        if not next_prog:
            next_prog = LessonProgress(
                user_id=user.id,
                stage_id=next_stage_id,
                status="current",
                stars=0,
                xp=0,
            )
            db.add(next_prog)
        elif next_prog.status == "locked":
            next_prog.status = "current"

    # Update user streak
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    streak_record = (
        db.query(UserStreak)
        .filter(UserStreak.user_id == user.id)
        .first()
    )
    if not streak_record:
        streak_record = UserStreak(
            user_id=user.id,
            current_streak=1,
            longest_streak=1,
            last_active_date=today_str,
        )
        db.add(streak_record)
    else:
        if streak_record.last_active_date != today_str:
            yesterday_str = (datetime.now(timezone.utc) - timedelta(days=1)).strftime("%Y-%m-%d")
            if streak_record.last_active_date == yesterday_str:
                streak_record.current_streak += 1
            else:
                streak_record.current_streak = 1
            streak_record.longest_streak = max(streak_record.longest_streak, streak_record.current_streak)
            streak_record.last_active_date = today_str

    db.commit()

    return {
        "success": True,
        "stage_id": stage_id,
        "status": "done",
        "stars": prog.stars,
        "xp": prog.xp,
        "next_stage_id": next_stage_id,
    }


@router.get("/streak")
def get_user_streak(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    streak_record = (
        db.query(UserStreak)
        .filter(UserStreak.user_id == user.id)
        .first()
    )
    if not streak_record:
        today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        streak_record = UserStreak(
            user_id=user.id,
            current_streak=1,
            longest_streak=1,
            last_active_date=today_str,
        )
        db.add(streak_record)
        db.commit()
        db.refresh(streak_record)

    return {
        "current_streak": streak_record.current_streak,
        "longest_streak": streak_record.longest_streak,
        "last_active_date": streak_record.last_active_date,
    }
