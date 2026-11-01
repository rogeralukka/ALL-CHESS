from typing import Optional, List
from pydantic import Field
from app.schemas.common import CamelModel


class AdvancedOverviewScores(CamelModel):
    openings: Optional[int] = None
    tactics: Optional[int] = None
    strategy: Optional[int] = None
    endgames: Optional[int] = None


class AdvancedOverviewHistory(CamelModel):
    date: str
    rating: int


class AdvancedOverviewResponse(CamelModel):
    rating: int
    rating_delta: int
    history: List[AdvancedOverviewHistory]
    games: int
    wins: int
    draws: int
    losses: int
    win_pct: float
    draw_pct: float
    loss_pct: float
    scores: AdvancedOverviewScores


class MetricSeriesPoint(CamelModel):
    date: str
    value: float


class MetricWithSeries(CamelModel):
    value: Optional[float] = None
    peers: Optional[float] = None
    grade: Optional[str] = None
    series: List[MetricSeriesPoint] = Field(default_factory=list)


class OpeningStatItem(CamelModel):
    name: str
    eco: str
    games: int
    win_pct: float
    accuracy: Optional[float] = None
    peers: Optional[float] = None
    grade: Optional[str] = None


class AdvancedOpeningsResponse(CamelModel):
    opening_accuracy: MetricWithSeries
    avg_opening_mistakes: MetricWithSeries
    avg_book_moves: MetricWithSeries
    by_opening: List[OpeningStatItem]
    peers_estimated: bool = True


class TacticCategoryItem(CamelModel):
    key: str
    label: str
    value: Optional[float] = None
    peers: Optional[float] = None
    grade: Optional[str] = None
    opportunities: int
    samples: int


class AdvancedTacticsResponse(CamelModel):
    categories: List[TacticCategoryItem]
    peers_estimated: bool = True


class EndgameMetricItem(CamelModel):
    value: Optional[float] = None
    peers: Optional[float] = None
    grade: Optional[str] = None


class EndgameWinPct(CamelModel):
    from_better: EndgameMetricItem
    from_equal: EndgameMetricItem
    from_worse: EndgameMetricItem


class EndgameAccuracy(CamelModel):
    overall: EndgameMetricItem
    rook_and_pawn: EndgameMetricItem
    king_and_pawn: EndgameMetricItem
    queen: EndgameMetricItem
    other: EndgameMetricItem


class AdvancedEndgamesResponse(CamelModel):
    win_pct: EndgameWinPct
    accuracy: EndgameAccuracy
    peers_estimated: bool = True


class AdvancedStrategyResponse(CamelModel):
    overall: EndgameMetricItem
    pawn_structure: EndgameMetricItem
    attacking: EndgameMetricItem
    defending: EndgameMetricItem
    active_piece: EndgameMetricItem
    space_advantage: EndgameMetricItem
    peers_estimated: bool = True


class BrilliantMoveItem(CamelModel):
    game_id: str
    move_index: int
    fen: str
    san: str
    opponent: str
    opponent_rating: int
    date: str
