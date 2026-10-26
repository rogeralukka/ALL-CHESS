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
    "best_max_drop": 0.0,  # Dropped drop <= 0.5 rule; only engine top move/equal is best
    "excellent_max_drop": 1.5,
    "good_max_drop": 4.0,
    "inaccuracy_max_drop": 13.0,
    "mistake_max_drop": 25.0,
    "miss_min_drop": 14.0,
    "great_min_gap_win_pct": 6.5,
    "great_min_after_win_pct": 40.0,
    "great_max_before_win_pct": 95.0,
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
    is_recapture: bool = False,
    num_legal_moves: int = 2,
    best_wins_material_or_mate: bool = False,
    best_eval_gap: float = 0.0,
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
        if gap_to_second_win_pct >= CLASSIFICATION_THRESHOLDS["great_min_gap_win_pct"] and not is_recapture and num_legal_moves > 1:
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

    # 1. Brilliant: top move, genuine material sacrifice, stays winning/good, wasn't trivially winning
    if (
        is_sacrifice
        and is_top_engine_move
        and mover_after >= CLASSIFICATION_THRESHOLDS["brilliant_min_after_win_pct"]
        and mover_before < CLASSIFICATION_THRESHOLDS["brilliant_max_before_win_pct"]
    ):
        return 'brilliant'

    # 2. Great: top engine move, NOT a recapture, more than 1 legal move,
    # large gap to 2nd move, and saved or progressed game
    if (
        is_top_engine_move
        and not is_recapture
        and num_legal_moves > 1
        and gap_to_second_win_pct >= CLASSIFICATION_THRESHOLDS["great_min_gap_win_pct"]
        and mover_after >= CLASSIFICATION_THRESHOLDS["great_min_after_win_pct"]
        and (mover_before < CLASSIFICATION_THRESHOLDS["great_max_before_win_pct"] or opponent_just_made_mistake)
    ):
        return 'great'

    # 3. Best: ONLY the engine top move (or equal eval to it)
    if is_top_engine_move:
        return 'best'

    # 4. Miss: Player had a clearly winning or tactical continuation available
    # (the best line's win% is >= 14-15 points above move played, or eval gap >= 3 pawns,
    # and best line wins material or mates), usually right after opponent's error.
    # Takes priority over mistake/blunder.
    # Must NOT be given when player was already worse and best line only held equality.
    # Must NOT be given when player is still comfortably winning (> 85%).
    is_miss = (
        best_wins_material_or_mate
        and (drop >= CLASSIFICATION_THRESHOLDS["miss_min_drop"] or best_eval_gap >= 3.0)
        and not (mover_before < 45.0 and mover_before + drop < 55.0 and best_eval_gap < 3.0)
        and (opponent_just_made_mistake or drop >= 20.0 or best_eval_gap >= 3.0)
        and mover_after < 85.0
    )
    if is_miss:
        return 'miss'

    # 5. Excellent: drop <= 1.5%
    if drop <= CLASSIFICATION_THRESHOLDS["excellent_max_drop"]:
        return 'excellent'

    # 6. Good: drop <= 4.0%
    if drop <= CLASSIFICATION_THRESHOLDS["good_max_drop"]:
        return 'good'

    # 7. Inaccuracy: drop <= 13.0%
    if drop <= CLASSIFICATION_THRESHOLDS["inaccuracy_max_drop"]:
        return 'inaccuracy'

    # 8. Mistake: drop <= 25.0%
    if drop <= CLASSIFICATION_THRESHOLDS["mistake_max_drop"]:
        return 'mistake'

    # 9. Blunder: drop > 25.0%
    return 'blunder'
