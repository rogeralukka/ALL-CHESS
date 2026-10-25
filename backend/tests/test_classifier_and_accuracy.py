from app.services.win_pct import win_pct, eval_to_win_pct
from app.services.classifier import classify_move
from app.services.accuracy import move_accuracy, calculate_game_accuracy

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

def test_move_accuracy():
    assert move_accuracy(0.0) == 100.0
    assert move_accuracy(50.0) < 20.0
