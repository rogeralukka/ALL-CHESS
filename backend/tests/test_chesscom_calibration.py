"""Guards our review against Chess.com's own review, using saved Chess.com results (tests/fixtures/chesscom_calibration).

Chess.com publishes accuracy, move-class counts and a game rating per game. We saved their numbers for a handful of
games together with the engine evaluations our browser produced, so these checks run offline.

The bounds are where we are today; tighten them as the calibration improves, never loosen them to make a change pass.
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "scripts"))

import calibrate_vs_chesscom as cal  # noqa: E402

MAX_GAME = "186073066724"  # Master vs Max_2404: Chess.com 83.3 / 74.2, game ratings 1550 / 1250


def test_every_fixture_game_loads_and_is_graded():
    games = cal.load_games("evals_d18")
    assert len(games) >= 6
    for g in games.values():
        assert len(g["moves"]) > 0
        w, b = cal.ours(g)
        assert w is not None and b is not None


def test_long_games_stay_close_to_chesscom_accuracy():
    games = cal.load_games("evals_d18")
    assert cal.mean_abs_error(games, cal.long_ids(games)) <= 3.0


def test_max_game_is_not_inflated():
    """The game Master compared by eye: at depth 18 we were ~+5 (white) and ~+6 (black) above Chess.com."""
    g = cal.load_games("evals_d18")[MAX_GAME]
    w, b = cal.ours(g)
    assert abs(w - 83.3) <= 7.0 and abs(b - 74.2) <= 7.0  # current: 86.4 / 78.5. Target for the calibration work: <= 2.0
