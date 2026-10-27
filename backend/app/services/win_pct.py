import math
from typing import Optional

DEFAULT_SLOPE = 0.00368208

def get_win_pct_slope(rating: Optional[int] = None) -> float:
    """
    Returns the sigmoid slope k based on player rating.
    Lower ratings have flatter curves (swings are less fatal).
    Calibrated against Chess.com expected-points model:
      - <= 1000: 0.0020
      - >= 2200: 0.00368208
      - in between: linear interpolation
    """
    if rating is None or rating <= 0:
        return DEFAULT_SLOPE
    if rating <= 1000:
        return 0.0020
    if rating >= 2200:
        return DEFAULT_SLOPE
    return 0.0020 + ((rating - 1000) / 1200.0) * (DEFAULT_SLOPE - 0.0020)


def win_pct(cp: float, rating: Optional[int] = None) -> float:
    """
    Win probability model from centipawns.
    Formula specified in frontend/src/lib/winPct.ts:
    50 + 50 * (2 / (1 + exp(-k * cp)) - 1)
    """
    if math.isnan(cp):
        return 50.0
    if cp > 4000:
        return 100.0
    if cp < -4000:
        return 0.0
    k = get_win_pct_slope(rating)
    try:
        pct = 50.0 + 50.0 * (2.0 / (1.0 + math.exp(-k * cp)) - 1.0)
        return min(100.0, max(0.0, round(pct, 1)))
    except OverflowError:
        return 100.0 if cp > 0 else 0.0


def eval_to_win_pct(
    eval_score: Optional[float] = None,
    mate: Optional[int] = None,
    rating: Optional[int] = None
) -> float:
    """
    Computes win percentage from eval in pawns (from White's POV) or mate.
    mate: number of moves to mate.
      > 0: White forces mate -> 100.0%
      < 0: Black forces mate -> 0.0%
      == 0: Checkmate position. If eval_score >= 0, White delivered mate (100.0%), else Black delivered mate (0.0%).
    """
    if mate is not None:
        if mate > 0:
            return 100.0
        elif mate < 0:
            return 0.0
        else:
            if eval_score is not None:
                return 100.0 if eval_score >= 0 else 0.0
            return 100.0

    if eval_score is None or math.isnan(eval_score):
        return 50.0
    return win_pct(eval_score * 100.0, rating=rating)
