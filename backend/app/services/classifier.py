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

SEE_PIECE_VALUES: Dict[chess.PieceType, int] = {
    chess.PAWN: 100,
    chess.KNIGHT: 320,
    chess.BISHOP: 330,
    chess.ROOK: 500,
    chess.QUEEN: 900,
    chess.KING: 20000,
}


def see_capture_sequence(board: chess.Board, square: chess.Square) -> int:
    """
    Computes Static Exchange Evaluation (SEE) for capturing on square,
    from the perspective of board.turn.
    Returns the net material gain (in centipawns) if board.turn captures on square.
    """
    piece = board.piece_at(square)
    if not piece:
        return 0

    attackers = board.attackers(board.turn, square)
    if not attackers:
        return 0

    best_attacker_sq = None
    min_val = 999999
    for sq in attackers:
        atk_piece = board.piece_at(sq)
        if atk_piece:
            val = SEE_PIECE_VALUES.get(atk_piece.piece_type, 100)
            if val < min_val:
                min_val = val
                best_attacker_sq = sq

    if best_attacker_sq is None:
        return 0

    promo = chess.QUEEN if (
        board.piece_at(best_attacker_sq).piece_type == chess.PAWN
        and chess.square_rank(square) in (0, 7)
    ) else None
    cap_move = chess.Move(best_attacker_sq, square, promotion=promo)

    victim_val = SEE_PIECE_VALUES.get(piece.piece_type, 100)
    b_copy = board.copy()
    b_copy.push(cap_move)

    return max(0, victim_val - see_capture_sequence(b_copy, square))


def is_material_sacrifice(board: chess.Board, move: chess.Move) -> bool:
    """
    Detects if a move is a genuine material sacrifice using Static Exchange Evaluation.
    A piece only counts as sacrificed if the opponent can actually win net material
    by capturing on move.to_square (accounting for any material captured by the mover).
    Protected pieces where opponent loses material on exchange are NOT sacrifices.
    """
    piece = board.piece_at(move.from_square)
    if not piece or piece.piece_type in (chess.PAWN, chess.KING):
        return False

    mover_val = SEE_PIECE_VALUES.get(piece.piece_type, 0)
    captured = board.piece_at(move.to_square)
    captured_val = SEE_PIECE_VALUES.get(captured.piece_type, 0) if captured else 0

    # Test position after the move
    test_board = board.copy()
    test_board.push(move)

    # Opponent turn: what can opponent net by capturing on move.to_square?
    opp_net_gain = see_capture_sequence(test_board, move.to_square)

    # To be a genuine sacrifice: opponent net gain on the square must exceed
    # the mover's capture value by at least 150 centipawns (more than a minor piece trade)
    return (opp_net_gain - captured_val) >= 150


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
    is_checkmate: bool = False,
) -> MoveClassificationType:
    """
    Classifies a move based on win% drop from the mover's point of view.
    eval_before_pawns and eval_after_pawns are in pawns from White's POV.
    """
    if is_book:
        return 'book'

    # If this move delivered checkmate, mover won immediately -> win% 100
    if is_checkmate or mate_after == 0:
        if is_sacrifice:
            return 'brilliant'
        if gap_to_second_win_pct >= CLASSIFICATION_THRESHOLDS["great_min_gap_win_pct"]:
            return 'great'
        return 'best'

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

    # 5. Miss: opponent just made mistake or blunder (NOT inaccuracy), and player dropped >= 5% while a winning chance existed
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
