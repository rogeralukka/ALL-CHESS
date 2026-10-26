import chess
from app.services.win_pct import win_pct, eval_to_win_pct
from app.services.classifier import classify_move, is_material_sacrifice, see_capture_sequence
from app.services.accuracy import (
    move_accuracy,
    calculate_game_accuracy,
    calculate_player_accuracy,
    estimate_performance_ratings
)

def test_win_pct_formula():
    # 0 centipawns should equal 50%
    assert win_pct(0) == 50.0
    # +100 cp (1 pawn advantage)
    pct_100 = win_pct(100)
    assert 58.0 <= pct_100 <= 60.0
    # +1000 cp should be near 98-99%
    assert win_pct(1000) > 95.0
    # Clamp extreme bounds
    assert win_pct(5000) == 100.0
    assert win_pct(-5000) == 0.0

def test_eval_to_win_pct():
    # Mate scores
    assert eval_to_win_pct(mate=2) == 100.0
    assert eval_to_win_pct(mate=-1) == 0.0
    # Mate 0 (checkmate position)
    assert eval_to_win_pct(eval_score=99.0, mate=0) == 100.0
    assert eval_to_win_pct(eval_score=-99.0, mate=0) == 0.0
    # Pawn eval score
    assert eval_to_win_pct(eval_score=0.0) == 50.0
    assert eval_to_win_pct(eval_score=1.0) == win_pct(100.0)

def test_classify_move():
    # Book move
    assert classify_move(0.2, 0.2, 'w', is_book=True) == 'book'

    # Best move (small or zero drop)
    assert classify_move(0.5, 0.5, 'w') == 'best'

    # Excellent move (drop ~ 2%)
    assert classify_move(1.0, 0.9, 'w') == 'excellent'

    # Inaccuracy
    assert classify_move(1.0, 0.4, 'w') in ['good', 'inaccuracy']

    # Blunder (large swing: went from winning 2.5 to losing -1.5)
    assert classify_move(2.5, -1.5, 'w') in ['blunder', 'miss']

def test_checkmate_moves_never_blunder():
    # White mating move: White delivers mate -> mate_after=0, eval_after=99.0
    white_mate = classify_move(
        eval_before_pawns=5.0,
        eval_after_pawns=99.0,
        color='w',
        mate_after=0,
        is_checkmate=True
    )
    assert white_mate in ('best', 'great'), f"White mating move classified as {white_mate}, expected best/great"
    assert white_mate != 'blunder'

    # Black mating move: Black delivers mate -> mate_after=0, eval_after=-99.0
    black_mate = classify_move(
        eval_before_pawns=-5.0,
        eval_after_pawns=-99.0,
        color='b',
        mate_after=0,
        is_checkmate=True
    )
    assert black_mate in ('best', 'great'), f"Black mating move classified as {black_mate}, expected best/great"
    assert black_mate != 'blunder'

def test_protected_knight_attacked_by_queen_is_not_sacrifice():
    # White pawn on c3, White moves knight from f3 to d4.
    # At d4, Black queen on d8 attacks d4.
    # But d4 is defended by White's pawn on c3. If Black plays Qxd4, White plays cxd4 (net -580 cp for Black).
    # Static Exchange Evaluation recognizes this is NOT a material sacrifice.
    board = chess.Board('rnbqkbnr/pppp1ppp/8/8/8/2P2N2/PP1PPPPP/RNBQKB1R w KQkq - 0 1')
    move = chess.Move.from_uci('f3d4')
    assert is_material_sacrifice(board, move) is False

    # Unprotected knight attacked by pawn: Black has pawn on d6, White plays Nf3-e5
    # Black can simply capture dxe5 netting a full minor piece without any return.
    board_sac = chess.Board('rnbqkbnr/ppp1pppp/3p4/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 0 1')
    sac_move = chess.Move.from_uci('f3e5')
    assert is_material_sacrifice(board_sac, sac_move) is True

def test_accuracy_empty_moves_returns_none():
    assert calculate_player_accuracy([], []) is None
    game_acc = calculate_game_accuracy([])
    assert game_acc == {"white": None, "black": None}

def test_move_accuracy():
    assert move_accuracy(0.0) == 100.0
    assert move_accuracy(50.0) < 20.0

def test_estimate_performance_ratings_calibration():
    # 50% accuracy -> ~500
    res_50 = estimate_performance_ratings({"white": 50.0, "black": 50.0})
    assert res_50["white"] == 500

    # 75% accuracy -> ~1200
    res_75 = estimate_performance_ratings({"white": 75.0, "black": 75.0})
    assert res_75["white"] == 1200

    # 78.9% accuracy -> calibrated rating ~1408
    res_78 = estimate_performance_ratings({"white": 78.9, "black": 78.9})
    assert res_78["white"] == 1408

    # 90% accuracy -> ~2000
    res_90 = estimate_performance_ratings({"white": 90.0, "black": 90.0})
    assert res_90["white"] == 2000

    # 98% accuracy -> ~2700
    res_98 = estimate_performance_ratings({"white": 98.0, "black": 98.0})
    assert res_98["white"] == 2700
