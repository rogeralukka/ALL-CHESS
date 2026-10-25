from typing import Optional, Literal
from app.services.win_pct import eval_to_win_pct

MoveClassificationType = Literal[
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

def classify_move(
    eval_before_pawns: float,
    eval_after_pawns: float,
    color: Literal['w', 'b'],
    mate_before: Optional[int] = None,
    mate_after: Optional[int] = None,
    is_book: bool = False,
    is_sacrifice: bool = False,
    eval_gap_to_second: float = 0.0
) -> MoveClassificationType:
    """
    Classifies a move based on win% drop from the mover's point of view.
    eval_before_pawns and eval_after_pawns are in pawns from White's POV.
    """
    if is_book:
        return 'book'

    # Compute win% from White's POV
    white_win_before = eval_to_win_pct(eval_before_pawns, mate_before)
    white_win_after = eval_to_win_pct(eval_after_pawns, mate_after)

    # Convert to mover's POV
    if color == 'w':
        mover_before = white_win_before
        mover_after = white_win_after
    else:
        mover_before = 100.0 - white_win_before
        mover_after = 100.0 - white_win_after

    # Drop in mover's winning chances
    drop = max(0.0, mover_before - mover_after)

    # Brilliant: sound sacrifice that engine approves
    if is_sacrifice and drop <= 2.0 and mover_after >= 40.0:
        return 'brilliant'

    # Great: only move that preserves advantage
    if drop <= 0.5 and eval_gap_to_second >= 1.5:
        return 'great'

    # Best
    if drop <= 0.5:
        return 'best'

    # Excellent
    if drop <= 2.0:
        return 'excellent'

    # Good
    if drop <= 5.0:
        return 'good'

    # Inaccuracy
    if drop <= 10.0:
        return 'inaccuracy'

    # Mistake
    if drop <= 20.0:
        return 'mistake'

    # Miss: missed a clearly winning chance (was winning >= 70% before)
    if mover_before >= 70.0 and mover_after <= 50.0:
        return 'miss'

    # Blunder
    return 'blunder'
