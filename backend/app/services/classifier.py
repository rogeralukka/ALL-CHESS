from typing import Optional, Literal, Dict
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
    "best_max_drop": 0.0,
    "excellent_max_drop": 2.0,
    "good_max_drop": 5.5,
    "inaccuracy_max_drop": 10.0,
    "mistake_max_drop": 18.0,
    "miss_min_drop": 10.0,
    "great_min_gap_win_pct": 6.0,
    "great_min_after_win_pct": 35.0,
    "great_max_before_win_pct": 90.0,
    "brilliant_max_drop": 5.0,
    "brilliant_min_after_win_pct": 40.0,
    "brilliant_max_before_win_pct": 93.0,
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
    if not piece or piece.piece_type == chess.KING:
        return False

    captured = board.piece_at(move.to_square)
    captured_val = SEE_PIECE_VALUES.get(captured.piece_type, 0) if captured else 0

    # Test position after the move
    test_board = board.copy()
    test_board.push(move)

    opp_net_gain = see_capture_sequence(test_board, move.to_square)
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
    rating: Optional[int] = None,
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

    # Check for completely decisive positions (|eval| >= 20.0 or forced mate)
    is_winning_side = (color == 'w' and (eval_before_pawns >= 15.0 or (mate_before is not None and mate_before > 0))) or \
                      (color == 'b' and (eval_before_pawns <= -15.0 or (mate_before is not None and mate_before < 0)))
    is_losing_side = (color == 'w' and (eval_before_pawns <= -15.0 or (mate_before is not None and mate_before < 0))) or \
                     (color == 'b' and (eval_before_pawns >= 15.0 or (mate_before is not None and mate_before > 0)))

    if is_winning_side:
        still_winning = (color == 'w' and (eval_after_pawns >= 12.0 or (mate_after is not None and mate_after > 0))) or \
                        (color == 'b' and (eval_after_pawns <= -12.0 or (mate_after is not None and mate_after < 0)))
        if still_winning:
            if is_top_engine_move:
                return 'best'
            return 'excellent'

    if is_losing_side:
        if is_top_engine_move:
            return 'best'
        if is_recapture:
            return 'excellent'
        # Check if defender shortened mate (made defeat faster)
        mate_shortened = False
        if mate_before is not None and mate_after is not None:
            if color == 'w' and mate_before < 0 and mate_after < 0 and abs(mate_after) < abs(mate_before):
                mate_shortened = True
            elif color == 'b' and mate_before > 0 and mate_after > 0 and abs(mate_after) < abs(mate_before):
                mate_shortened = True
        # Only penalize allowing mate if the position wasn't already overwhelmingly lost (|eval| < 18.0)
        allowed_forced_mate = False
        if mate_before is None and mate_after is not None:
            if color == 'w' and mate_after < 0 and eval_before_pawns > -18.0:
                allowed_forced_mate = True
            elif color == 'b' and mate_after > 0 and eval_before_pawns < 18.0:
                allowed_forced_mate = True

        if allowed_forced_mate or mate_shortened:
            return 'inaccuracy'
        return 'excellent'

    # Compute win% from White's POV
    white_win_before = eval_to_win_pct(eval_before_pawns, mate_before, rating=rating)
    white_win_after = eval_to_win_pct(eval_after_pawns, mate_after, rating=rating)

    # Convert to mover's POV
    if color == 'w':
        mover_before = white_win_before
        mover_after = white_win_after
    else:
        mover_before = 100.0 - white_win_before
        mover_after = 100.0 - white_win_after

    # Drop in mover's winning chances
    drop = max(0.0, mover_before - mover_after)

    # 1. Brilliant: material is given up versus best-play baseline, win% stays within ~5 of best move, not completely winning
    if (
        is_sacrifice
        and not is_recapture
        and drop <= CLASSIFICATION_THRESHOLDS["brilliant_max_drop"]
        and mover_after >= CLASSIFICATION_THRESHOLDS["brilliant_min_after_win_pct"]
        and mover_before < CLASSIFICATION_THRESHOLDS["brilliant_max_before_win_pct"]
    ):
        return 'brilliant'

    # 2. Great: top engine move, not a recapture, more than 1 legal move:
    if is_top_engine_move and not is_recapture and num_legal_moves > 1:
        if (
            gap_to_second_win_pct >= CLASSIFICATION_THRESHOLDS["great_min_gap_win_pct"]
            and mover_after >= CLASSIFICATION_THRESHOLDS["great_min_after_win_pct"]
            and mover_before < CLASSIFICATION_THRESHOLDS["great_max_before_win_pct"]
        ):
            return 'great'
        if gap_to_second_win_pct >= 4.0:
            if mover_before <= 42.0 and mover_after >= 48.0:
                return 'great'
            if mover_before <= 55.0 and mover_after >= 62.0:
                return 'great'

    # 3. Best: ONLY the engine top move
    if is_top_engine_move:
        return 'best'

    # 4. Miss: player failed to take a tactical shot (best move wins material/mate)
    # or opponent just made an error and player gave back >= 10 win%.
    # Never overrides an outright blunder (allowing mate in 1 or checkmate).
    is_mate_drop = (mate_after == 0) or (mate_after is not None and abs(mate_after) <= 1)
    if (
        drop >= CLASSIFICATION_THRESHOLDS["miss_min_drop"]
        and not is_mate_drop
        and (drop < 35.0 or opponent_just_made_mistake)
    ):
        if opponent_just_made_mistake and (best_wins_material_or_mate or (best_eval_gap is not None and best_eval_gap >= 1.2)):
            return 'miss'
        if best_wins_material_or_mate and (best_eval_gap is not None and best_eval_gap >= 1.5):
            return 'miss'

    # 5. Excellent: drop <= excellent_max_drop AND eval gap <= 0.35 pawns
    if drop <= CLASSIFICATION_THRESHOLDS["excellent_max_drop"] and (best_eval_gap is None or best_eval_gap <= 0.35):
        return 'excellent'

    # In clearly winning positions (mover_before >= 75.0), preserving advantage is excellent
    if mover_before >= 75.0 and mover_after >= 75.0 and drop <= CLASSIFICATION_THRESHOLDS["good_max_drop"] and (best_eval_gap is None or best_eval_gap <= 0.5):
        return 'excellent'

    # 6. Good: drop <= good_max_drop
    if drop <= CLASSIFICATION_THRESHOLDS["good_max_drop"] or (drop <= 7.5 and (best_eval_gap is None or best_eval_gap <= 0.75)):
        return 'good'

    # 7. Inaccuracy: drop <= inaccuracy_max_drop
    if drop <= CLASSIFICATION_THRESHOLDS["inaccuracy_max_drop"]:
        if best_eval_gap is not None:
            if (best_eval_gap >= 1.35 and mover_before <= 50.0) or (best_eval_gap >= 3.0):
                return 'mistake'
        return 'inaccuracy'

    # 8. Mistake: drop <= mistake_max_drop, or player preserves winning advantage (mover_after >= 55.0)
    if drop <= CLASSIFICATION_THRESHOLDS["mistake_max_drop"] or (mover_after >= 55.0 and drop <= 30.0):
        return 'mistake'

    # 9. Blunder: drop > 18.0%
    return 'blunder'
