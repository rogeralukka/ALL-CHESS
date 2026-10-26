from typing import Optional, List, Literal, Dict
from pydantic import Field
from app.schemas.common import CamelModel

MoveClassification = Literal[
    'brilliant',
    'great',
    'book',
    'best',
    'excellent',
    'good',
    'inaccuracy',
    'mistake',
    'miss',
    'blunder'
]

class TopEngineLine(CamelModel):
    move: str
    eval: float
    mate: Optional[int] = None
    depth: int
    why: str
    pv: List[str]

class MoveEval(CamelModel):
    eval: float
    mate: Optional[int] = None
    best_move: Optional[str] = None
    win_pct: Optional[float] = None
    why: Optional[str] = None
    lines: Optional[List[TopEngineLine]] = None

class Move(CamelModel):
    san: str
    from_square: str = Field(..., alias="from")
    to: str
    promotion: Optional[str] = None
    color: Literal['w', 'b']
    fen: str
    move_number: int
    classification: Optional[MoveClassification] = None
    eval: Optional[MoveEval] = None
    coach_comment: Optional[str] = None
    variation: Optional[List[str]] = None
    time_spent: Optional[float] = None

class Player(CamelModel):
    username: str
    rating: int
    title: Optional[str] = None
    avatar_url: Optional[str] = None

class Opening(CamelModel):
    eco: str
    name: str

class PhaseGrade(CamelModel):
    opening: Literal['A', 'B', 'C', 'D', 'N/A']
    middlegame: Literal['A', 'B', 'C', 'D', 'N/A']
    tactics: Literal['A', 'B', 'C', 'D', 'N/A']
    endgame: Literal['A', 'B', 'C', 'D', 'N/A']

class Accuracy(CamelModel):
    white: float
    black: float

class EstimatedRating(CamelModel):
    white: int
    black: int

class Game(CamelModel):
    id: str
    pgn: str
    white: Player
    black: Player
    result: Literal['1-0', '0-1', '1/2-1/2', '*']
    date: str
    time_control: str
    speed: Literal['bullet', 'blitz', 'rapid', 'daily']
    source: Literal['online', 'vs_coach']
    platform: Optional[Literal['chesscom', 'lichess', 'coach']] = None
    opening: Opening
    moves: List[Move]
    is_user_white: Optional[bool] = None
    accuracy: Optional[Accuracy] = None
    estimated_rating: Optional[EstimatedRating] = None
    phase_grades: Optional[PhaseGrade] = None

class GameFilterParams(CamelModel):
    opening: Optional[str] = None
    color: Optional[Literal['white', 'black', 'all']] = 'all'
    result: Optional[Literal['win', 'loss', 'draw', 'all']] = 'all'
    source: Optional[Literal['online', 'vs_coach', 'all']] = 'all'
    speed: Optional[Literal['bullet', 'blitz', 'rapid', 'all']] = 'all'
    search_query: Optional[str] = None
