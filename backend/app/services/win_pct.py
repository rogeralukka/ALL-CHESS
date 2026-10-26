import math
from typing import Optional

def win_pct(cp: float) -> float:
    """
    Win probability model from centipawns.
    Formula specified in frontend/src/lib/winPct.ts:
    50 + 50 * (2 / (1 + exp(-0.00368208 * cp)) - 1)
    """
    if math.isnan(cp):
        return 50.0
    if cp > 4000:
        return 100.0
    if cp < -4000:
        return 0.0
    try:
        pct = 50.0 + 50.0 * (2.0 / (1.0 + math.exp(-0.00368208 * cp)) - 1.0)
        return min(100.0, max(0.0, round(pct, 1)))
    except OverflowError:
        return 100.0 if cp > 0 else 0.0

def eval_to_win_pct(eval_score: Optional[float] = None, mate: Optional[int] = None) -> float:
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
    return win_pct(eval_score * 100.0)
