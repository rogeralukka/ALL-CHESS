from typing import List, Optional
from app.schemas.common import CamelModel
from app.schemas.stats import OpeningStat
from app.schemas.game import Game

class ScoutProfile(CamelModel):
    username: str
    rating: Optional[int] = None
    title: Optional[str] = None
    win_rate: Optional[float] = None
    most_played: List[OpeningStat] = []
    recent_games: List[Game] = []
