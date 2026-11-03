from typing import Literal

from app.schemas.common import CamelModel
from pydantic import Field

MoveClassification = Literal[
    "brilliant",
    "great",
    "book",
    "forced",
    "best",
    "excellent",
    "good",
    "inaccuracy",
    "mistake",
    "miss",
    "blunder",
]


class TopEngineLine(CamelModel):
    move: str
    eval: float
    mate: int | None = None
    mate_in: int | None = None
    depth: int
    why: str | None = None
    pv: list[str]


class MoveEval(CamelModel):
    eval: float
    mate: int | None = None
    mate_in: int | None = None
    best_move: str | None = None
    win_pct: float | None = None
    why: str | None = None
    best_why: str | None = None
    lines: list[TopEngineLine] | None = None
    eval_before: float | None = None
    eval_after: float | None = None
    mate_before: int | None = None
    mate_after: int | None = None
    mate_in_before: int | None = None
    mate_in_after: int | None = None


MoveAnnotationTint = Literal[
    "brilliant", "great", "best", "good", "inaccuracy", "mistake", "miss", "blunder"
]


class MoveAnnotationArrow(CamelModel):
    from_square: str = Field(..., alias="from")
    to: str
    kind: Literal["best", "refutation", "threat", "alt", "played", "missed"]


class MoveAnnotationSquare(CamelModel):
    square: str
    kind: Literal["attacked", "hanging", "target", "king-danger"]
    reason: str
    tone: Literal["green", "orange"] | None = None


class MoveRef(CamelModel):
    san: str
    from_square: str = Field(..., alias="from")
    to: str
    uci: str


class MoveAnnotations(CamelModel):
    tint: MoveAnnotationTint | None = None
    arrows: list[MoveAnnotationArrow] = Field(default_factory=list)
    squares: list[MoveAnnotationSquare] = Field(default_factory=list)
    best_move: MoveRef | str | None = None
    best_uci: str | None = None
    refutation: MoveRef | str | None = None
    pv: list[str] | None = Field(default_factory=list)
    reason_code: str | None = None
    explain: list[str] | None = Field(default_factory=list)
    mate_squares: list[str] | None = Field(default_factory=list)


class Move(CamelModel):
    san: str
    from_square: str = Field(..., alias="from")
    to: str
    promotion: str | None = None
    color: Literal["w", "b"]
    fen: str
    move_number: int
    classification: MoveClassification | None = None
    eval: MoveEval | None = None
    coach_comment: str | None = None
    variation: list[str] | None = None
    time_spent: float | None = None
    annotations: MoveAnnotations | None = None


class Player(CamelModel):
    username: str
    rating: int
    title: str | None = None
    avatar_url: str | None = None


class Opening(CamelModel):
    eco: str
    name: str


class PhaseGrade(CamelModel):
    opening: Literal["A", "B", "C", "D", "N/A"]
    middlegame: Literal["A", "B", "C", "D", "N/A"]
    tactics: Literal["A", "B", "C", "D", "N/A"]
    endgame: Literal["A", "B", "C", "D", "N/A"]


class Accuracy(CamelModel):
    white: float
    black: float


class EstimatedRating(CamelModel):
    white: int
    black: int


class ClassCounts(CamelModel):
    brilliant: int = 0
    great: int = 0
    best: int = 0
    excellent: int = 0
    good: int = 0
    book: int = 0
    forced: int = 0
    inaccuracy: int = 0
    mistake: int = 0
    miss: int = 0
    blunder: int = 0


class ReviewSummary(CamelModel):
    headline: str | None = None
    counts: ClassCounts | dict[str, int] | None = None
    white_counts: ClassCounts | dict[str, int] | None = None
    black_counts: ClassCounts | dict[str, int] | None = None


class Game(CamelModel):
    id: str
    pgn: str | None = None
    white: Player
    black: Player
    result: Literal["1-0", "0-1", "1/2-1/2", "*"]
    date: str
    time_control: str
    speed: Literal["bullet", "blitz", "rapid", "daily"]
    source: Literal["online", "vs_coach"]
    platform: Literal["chesscom", "lichess", "coach"] | None = None
    opening: Opening
    moves: list[Move] | None = None
    is_user_white: bool | None = None
    accuracy: Accuracy | None = None
    estimated_rating: EstimatedRating | None = None
    phase_grades: PhaseGrade | dict[str, PhaseGrade] | None = None
    termination: str | None = None
    analysis_depth: int | None = None
    analysis_level: str | None = None
    book_end: int | None = None
    move_count: int | None = None
    ends_in_mate: bool | None = None
    review_summary: ReviewSummary | None = None


class CoachGameCreate(CamelModel):
    """A finished Play Coach game, saved so it can be reviewed like any other game."""

    moves: list[str] = Field(..., min_length=1, max_length=600)  # SAN, in play order
    user_color: Literal["white", "black"]
    result: Literal["1-0", "0-1", "1/2-1/2"]
    opponent_name: str = Field(default="Coach All-Chess", max_length=64)
    opponent_rating: int = Field(default=800, ge=100, le=3500)
    user_rating: int | None = Field(default=None, ge=100, le=3500)
    speed: Literal["bullet", "blitz", "rapid", "daily"] | None = None
    termination: str | None = Field(default=None, max_length=128)


class CoachGameCreated(CamelModel):
    id: str


class AnalyzeGameRequest(CamelModel):
    level: Literal["standard", "deep", "deeper", "max"] | None = "standard"
    force: bool | None = False


class BrowserEngineLine(CamelModel):
    """One engine line as reported by the browser's Stockfish: UCI moves and the raw UCI score
    from the point of view of the side to move."""

    pv: list[str] = Field(..., min_length=1, max_length=24)
    cp: int | None = Field(default=None, ge=-100000, le=100000)
    mate: int | None = Field(default=None, ge=-1000, le=1000)
    depth: int = Field(default=1, ge=0, le=128)


class BrowserPosition(CamelModel):
    lines: list[BrowserEngineLine] = Field(default_factory=list, max_length=5)
    best_uci: str | None = None
    pv_uci: list[str] | None = None
    reply_uci: str | None = None


class BrowserEvaluationsRequest(CamelModel):
    """Per-position engine results computed on the user's own device. positions[i] is the position before
    move i, and the last entry is the final position, so there are len(moves) + 1 of them."""

    level: Literal["standard", "deep", "deeper", "max"] = "standard"
    # True when the person asked for this re-run: the result replaces the stored review even if it is shallower
    force: bool = False
    positions: list[BrowserPosition] = Field(..., min_length=1, max_length=1201)


class GameFilterParams(CamelModel):
    opening: str | None = None
    color: Literal["white", "black", "all"] | None = "all"
    result: Literal["win", "loss", "draw", "all"] | None = "all"
    source: Literal["online", "vs_coach", "all"] | None = "all"
    speed: Literal["bullet", "blitz", "rapid", "all"] | None = "all"
    search_query: str | None = None
