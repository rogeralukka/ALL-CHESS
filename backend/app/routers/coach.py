from typing import List, Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.routers.auth import get_current_user
from app.models.user import User
from app.services.coach_service import generate_move_comment

router = APIRouter(prefix="/coach", tags=["coach"])


class ExplainMoveIn(BaseModel):
    fen_before: str
    san: str
    classification: str = "good"
    fen_after: Optional[str] = None
    eval_before: Optional[float] = None
    eval_after: Optional[float] = None
    best_move: Optional[str] = None
    pv: Optional[List[str]] = None
    color: str = "w"


class ExplainMoveOut(BaseModel):
    comment: str
    provider: str


@router.post("/explain-move", response_model=ExplainMoveOut)
def explain_move(
    body: ExplainMoveIn,
    user: User = Depends(get_current_user),
):
    result = generate_move_comment(
        fen_before=body.fen_before,
        san=body.san,
        classification=body.classification,
        fen_after=body.fen_after,
        eval_before=body.eval_before,
        eval_after=body.eval_after,
        best_move=body.best_move,
        pv=body.pv,
        color=body.color,
    )
    return ExplainMoveOut(
        comment=result["comment"],
        provider=result["provider"],
    )
