from typing import List, Literal, Optional
from app.schemas.common import CamelModel

class RatingPoint(CamelModel):
    date: str
    rapid: int
    blitz: int
    bullet: int

class RatingSummary(CamelModel):
    mode: Literal['Rapid', 'Blitz', 'Bullet']
    rating: int
    delta_weekly: int

class OpeningStat(CamelModel):
    eco: str
    name: str
    games: int
    win_rate: float
    draw_rate: float
    loss_rate: float
    avg_accuracy: Optional[float] = None

class PhasePointsLost(CamelModel):
    opening: float
    middlegame: float
    endgame: float
    #: how many reviewed games these averages were measured from (0 = nothing to show yet)
    total_analyzed: int = 0

class StrengthWeakness(CamelModel):
    label: str
    delta: str
    type: Literal['strength', 'weakness']

class StrengthsWeaknessesResponse(CamelModel):
    strengths: List[StrengthWeakness]
    weaknesses: List[StrengthWeakness]
    #: how many reviewed games these insights were measured from (0 = nothing to show yet)
    total_analyzed: int = 0

class SyncResponse(CamelModel):
    synced_count: int
    chesscom: int
    lichess: int
    message: str
