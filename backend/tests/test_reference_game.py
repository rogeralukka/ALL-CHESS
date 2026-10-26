import pytest
import chess
from app.services.classifier import classify_move
from app.services.accuracy import (
    move_accuracy,
    calculate_game_accuracy,
    estimate_performance_ratings
)

def test_reference_game_recapture_not_great():
    """
    Move 7: 6... Bxh3 was played by Black, capturing White's knight on h3.
    White responds 7. gxh3 recapturing on h3.
    Recaptures must NOT be classified as 'great'.
    """
    cls = classify_move(
        eval_before_pawns=-0.52,
        eval_after_pawns=-0.57,
        color='w',
        is_top_engine_move=True,
        gap_to_second_win_pct=34.0, # even with a 34% gap to 2nd move
        is_recapture=True,          # it was a direct recapture
        num_legal_moves=29
    )
    assert cls == 'best', f"Expected 'best' for recapture, got '{cls}'"
    assert cls != 'great'


def test_reference_game_single_legal_move_not_great():
    """
    Moves with only 1 legal move cannot be classified as 'great'.
    """
    cls = classify_move(
        eval_before_pawns=-1.0,
        eval_after_pawns=-1.0,
        color='w',
        is_top_engine_move=True,
        gap_to_second_win_pct=25.0,
        is_recapture=False,
        num_legal_moves=1
    )
    assert cls == 'best'
    assert cls != 'great'


def test_reference_game_white_misses():
    """
    Verify tactical misses on reference game:
    - Move 23: White played cxd4 instead of Bg5 (skewering/winning the d8 rook)
    - Move 41: White played Qa4 instead of Bg4 (pinning and winning the blundered e6 queen)
    """
    # Move 23 (cxd4): Best line Bg5 won material (d8 rook), gap >= 20%
    move_23_cls = classify_move(
        eval_before_pawns=-0.41,
        eval_after_pawns=-3.13,
        color='w',
        opponent_just_made_mistake=True, # Black played 22... O-O-O (inaccuracy)
        best_wins_material_or_mate=True,
        best_eval_gap=2.72,
        is_top_engine_move=False
    )
    assert move_23_cls == 'miss'

    # Move 41 (Qa4): Opponent just blundered Qxe6??, best line Bg4 won queen, gap 40%
    move_41_cls = classify_move(
        eval_before_pawns=-0.48,
        eval_after_pawns=-8.15,
        color='w',
        opponent_just_made_mistake=True, # Black blundered Qxe6 on move 40
        best_wins_material_or_mate=True,
        best_eval_gap=7.67,
        is_top_engine_move=False
    )
    assert move_41_cls == 'miss'


def test_reference_game_white_blunder():
    """
    Move 31: White played Qa4 blundering the a1 rook to 32... Qxa1+
    Must be classified as 'blunder'.
    """
    move_31_cls = classify_move(
        eval_before_pawns=6.12,
        eval_after_pawns=-4.89,
        color='w',
        is_top_engine_move=False,
        best_wins_material_or_mate=False
    )
    assert move_31_cls == 'blunder'


def test_reference_game_black_no_false_misses():
    """
    Black in reference game had 0 misses on Chess.com.
    Moves where Black is already completely winning (like 42... g5) or where
    the best line only holds equality must NOT be flagged as misses.
    """
    # Move 42 (42... g5): Black is at 95.3% winPct and stays at 88.8% (eval -5.62).
    # Comfortably winning positions should NOT be flagged as misses.
    move_42_cls = classify_move(
        eval_before_pawns=-8.15,
        eval_after_pawns=-5.62,
        color='b',
        opponent_just_made_mistake=True,
        best_wins_material_or_mate=False,
        is_top_engine_move=False
    )
    assert move_42_cls != 'miss'
    assert move_42_cls in ('excellent', 'good', 'inaccuracy')


def test_reference_game_calibrated_accuracy_and_ratings():
    """
    Reference Game:
      White (rating 270): target accuracy 51.3 +- 3.0, rating ~100
      Black (rating 885): target accuracy 59.7 +- 3.0, rating ~500
    """
    # Test accuracy formula
    # Move accuracy uses the softer chesscom curve
    assert 90.0 <= move_accuracy(1.0, method="chesscom") <= 100.0
    assert 5.0 <= move_accuracy(20.0, method="chesscom") <= 20.0
    assert move_accuracy(75.0, method="chesscom") < 5.0

    # Test performance rating mapping
    ratings = estimate_performance_ratings(
        accuracy={"white": 51.5, "black": 60.8},
        white_base_rating=270,
        black_base_rating=885
    )
    assert ratings["white"] == 100, f"Expected White rating ~100, got {ratings['white']}"
    assert 450 <= ratings["black"] <= 600, f"Expected Black rating ~500, got {ratings['black']}"
