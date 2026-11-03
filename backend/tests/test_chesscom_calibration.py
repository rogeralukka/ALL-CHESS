"""Guards our review against Chess.com's own review, using saved Chess.com results (tests/fixtures/chesscom_calibration).

Chess.com publishes accuracy, move-class counts and a game rating per game. We saved their numbers for a handful of
games together with the engine evaluations our browser produced, so these checks run offline.

The bounds are tightened to match Chess.com calibration targets.
"""
import copy
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "scripts"))

import calibrate_vs_chesscom as cal  # noqa: E402
from app.services.accuracy import calculate_game_accuracy, estimate_game_rating  # noqa: E402

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
    # Calibrated MAE on long games is ~1.88, tightened from <= 3.0 bound
    assert cal.mean_abs_error(games, cal.long_ids(games)) <= 2.0


def test_max_game_is_not_inflated():
    """Target on the Max_2404 game at d18:
    - accuracy within +-2.0 of 83.3 (White) and 74.2 (Black)
    - game ratings within +-100 of 1550 (White) and 1250 (Black)
    - move class counts within +-1 (+-2 for excellent/good).
    """
    g = cal.load_games("evals_d18")[MAX_GAME]
    w, b = cal.ours(g)
    assert abs(w - 83.3) <= 2.0, f"White accuracy {w} outside +-2.0 of 83.3"
    assert abs(b - 74.2) <= 2.0, f"Black accuracy {b} outside +-2.0 of 74.2"

    rw, rb = estimate_game_rating(w), estimate_game_rating(b)
    assert abs(rw - 1550) <= 100, f"White rating {rw} outside +-100 of 1550"
    assert abs(rb - 1250) <= 100, f"Black rating {rb} outside +-100 of 1250"

    # Class counts
    w_counts = cal.class_counts(g["moves"], "w")
    b_counts = cal.class_counts(g["moves"], "b")
    w_cc = g["counts"]["white"]
    b_cc = g["counts"]["black"]

    # Order: [brilliant, great, book, best, excellent, good, inaccuracy, mistake, miss, blunder]
    for idx, name in enumerate(cal.CLASS_ORDER):
        tol = 2 if name in ("excellent", "good", "best") else 1
        assert abs(w_counts[idx] - w_cc[idx]) <= tol, (
            f"White {name} count {w_counts[idx]} differs from Chess.com {w_cc[idx]} by > {tol}"
        )
        assert abs(b_counts[idx] - b_cc[idx]) <= tol, (
            f"Black {name} count {b_counts[idx]} differs from Chess.com {b_cc[idx]} by > {tol}"
        )


def test_review_levels_are_ordered_by_strictness():
    """Addendum requirement:
    Standard (d18) targets Chess.com. Deep (d20), Deeper (d22) and Max (d24) must each
    be strictly non-increasing in accuracy and game rating for the same game.
    """
    g = cal.load_games("evals_d18")[MAX_GAME]
    levels = ["standard", "deep", "deeper", "max"]

    prev_acc_w = 100.0
    prev_acc_b = 100.0
    prev_rat_w = 3000
    prev_rat_b = 3000

    for lvl in levels:
        res = calculate_game_accuracy(copy.deepcopy(g["moves"]), level=lvl)
        acc_w, acc_b = res["white"], res["black"]
        rat_w, rat_b = estimate_game_rating(acc_w), estimate_game_rating(acc_b)

        assert acc_w <= prev_acc_w, f"Level {lvl} White accuracy {acc_w} > previous {prev_acc_w}"
        assert acc_b <= prev_acc_b, f"Level {lvl} Black accuracy {acc_b} > previous {prev_acc_b}"
        assert rat_w <= prev_rat_w, f"Level {lvl} White rating {rat_w} > previous {prev_rat_w}"
        assert rat_b <= prev_rat_b, f"Level {lvl} Black rating {rat_b} > previous {prev_rat_b}"

        prev_acc_w = acc_w
        prev_acc_b = acc_b
        prev_rat_w = rat_w
        prev_rat_b = rat_b


def test_d12_vs_d18_accuracy_stability():
    """Accuracy should not shift by more than ~3 points between depth 12 and 18 on long games."""
    d18_games = cal.load_games("evals_d18")
    d12_games = cal.load_games("evals_d12")
    long_ids = cal.long_ids(d18_games)

    for gid in long_ids:
        w18, b18 = cal.ours(d18_games[gid])
        w12, b12 = cal.ours(d12_games[gid])
        shift_w = abs(w18 - w12)
        shift_b = abs(b18 - b12)
        assert shift_w <= 3.5, f"Game {gid} White shifted by {shift_w:.2f} (> 3.5) between d12 and d18"
        assert shift_b <= 3.5, f"Game {gid} Black shifted by {shift_b:.2f} (> 3.5) between d12 and d18"


def test_real_deeper_searches_never_score_higher_than_standard():
    """The saved-evals check above re-grades the same depth-18 data, which only tests the level scale. This one grades
    the Max_2404 game with the evaluations real searches produced at depth 12, 18, 20 and 24 (browser Stockfish).
    Deeper search has less evaluation noise, which pushes accuracy UP; the level scale has to outweigh that."""
    import json

    from app.services.engine_service import _run_single_pass_review_sync

    game = json.load(open(os.path.join(cal.FIXTURE, "games.json")))[MAX_GAME]
    runs = [("evals_d18", "standard"), ("evals_d20_max_game", "deep"), ("evals_d24_max_game", "max")]
    prev = None
    for folder, level in runs:
        evals = json.load(open(os.path.join(cal.FIXTURE, folder, f"search-{MAX_GAME}.json")))
        review = _run_single_pass_review_sync(
            None, [dict(m) for m in game["moves"]], external_evals=[{"lines": e["lines"]} for e in evals], level=level
        )
        acc = calculate_game_accuracy(copy.deepcopy(review["moves"]), level=level)
        cur = (acc["white"], acc["black"], estimate_game_rating(acc["white"]), estimate_game_rating(acc["black"]))
        if prev is not None:
            assert all(c <= p for c, p in zip(cur, prev)), f"{level} {cur} scored higher than the level below {prev}"
        prev = cur
    assert prev[0] < 84.9 and prev[1] < 72.8  # Max is strictly stricter than Standard, not just tied
