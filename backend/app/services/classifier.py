from typing import Optional, Literal, Dict, Any, List
import chess
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

# Explicit single configuration dict for thresholds as requested
CLASSIFICATION_THRESHOLDS: Dict[str, float] = {
    "best_max_drop": 0.5,
    "excellent_max_drop": 2.0,
    "good_max_drop": 5.0,
    "inaccuracy_max_drop": 10.0,
    "mistake_max_drop": 20.0,
    "miss_min_drop": 5.0,
    "miss_min_best_win_pct": 65.0,
    "great_min_gap_win_pct": 10.0,
    "great_min_after_win_pct": 40.0,
    "great_max_before_win_pct": 90.0,
    "brilliant_max_drop": 1.0,
    "brilliant_min_after_win_pct": 45.0,
    "brilliant_max_before_win_pct": 90.0,
}

PIECE_VALUES: Dict[chess.PieceType, int] = {
    chess.PAWN: 1,
    chess.KNIGHT: 3,
    chess.BISHOP: 3,
    chess.ROOK: 5,
    chess.QUEEN: 9,
    chess.KING: 0,
}


def is_material_sacrifice(board: chess.Board, move: chess.Move) -> bool:
    """
    Detects if a move is a genuine material sacrifice:
    1. Piece (not pawn/king) moves to a square where it can be captured by opponent,
       and the material given up is greater than any material captured on that move.
    """
    piece = board.piece_at(move.from_square)
    if not piece or piece.piece_type in (chess.PAWN, chess.KING):
        return False

    mover_val = PIECE_VALUES.get(piece.piece_type, 0)
    captured = board.piece_at(move.to_square)
    captured_val = PIECE_VALUES.get(captured.piece_type, 0) if captured else 0

    # Test position after the move
    test_board = board.copy()
    test_board.push(move)

    # Is the moved piece on to_square attacked by opponent?
    opponent_color = test_board.turn  # turn switched to opponent
    if test_board.is_attacked_by(opponent_color, move.to_square):
        # Piece can be taken and mover value exceeds captured value
        if mover_val > captured_val:
            return True

    return False


def classify_move(
    eval_before_pawns: float,
    eval_after_pawns: float,
    color: Literal['w', 'b'],
    mate_before: Optional[int] = None,
    mate_after: Optional[int] = None,
    is_book: bool = False,
    is_sacrifice: bool = False,
    gap_to_second_win_pct: float = 0.0,
    opponent_just_made_mistake: bool = False,
    is_top_engine_move: bool = False,
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

    # 1. Brilliant: near-best move (drop <= 1.0), material sacrifice, stays good (>= 45%), wasn't already >= 90%
    if (
        is_sacrifice
        and drop <= CLASSIFICATION_THRESHOLDS["brilliant_max_drop"]
        and mover_after >= CLASSIFICATION_THRESHOLDS["brilliant_min_after_win_pct"]
        and mover_before < CLASSIFICATION_THRESHOLDS["brilliant_max_before_win_pct"]
    ):
        return 'brilliant'

    # 2. Great: only good move (2nd-best line is 10+ win% worse) and saved or progressed game
    if (
        (is_top_engine_move or drop <= CLASSIFICATION_THRESHOLDS["best_max_drop"])
        and gap_to_second_win_pct >= CLASSIFICATION_THRESHOLDS["great_min_gap_win_pct"]
        and mover_after >= CLASSIFICATION_THRESHOLDS["great_min_after_win_pct"]
        and mover_before < CLASSIFICATION_THRESHOLDS["great_max_before_win_pct"]
    ):
        return 'great'

    # 3. Best: engine top move or drop <= 0.5
    if is_top_engine_move or drop <= CLASSIFICATION_THRESHOLDS["best_max_drop"]:
        return 'best'

    # 4. Excellent: drop <= 2.0
    if drop <= CLASSIFICATION_THRESHOLDS["excellent_max_drop"]:
        return 'excellent'

    # 5. Miss: opponent just blundered/made mistake, but player dropped >= 5% while a winning chance existed
    if (
        opponent_just_made_mistake
        and drop >= CLASSIFICATION_THRESHOLDS["miss_min_drop"]
        and mover_before >= CLASSIFICATION_THRESHOLDS["miss_min_best_win_pct"]
    ):
        return 'miss'

    # 6. Good: drop <= 5.0
    if drop <= CLASSIFICATION_THRESHOLDS["good_max_drop"]:
        return 'good'

    # 7. Inaccuracy: drop <= 10.0
    if drop <= CLASSIFICATION_THRESHOLDS["inaccuracy_max_drop"]:
        return 'inaccuracy'

    # 8. Mistake: drop <= 20.0
    if drop <= CLASSIFICATION_THRESHOLDS["mistake_max_drop"]:
        return 'mistake'

    # 9. Blunder: drop > 20.0
    return 'blunder'
