"""Compares our review against Chess.com's own review for the games in tests/fixtures/chesscom_calibration.

    cd backend && python scripts/calibrate_vs_chesscom.py [evals_d18|evals_d12] [--tune]

Each fixture game has Chess.com's accuracies (and, where we have a screenshot, its move-class counts and game
ratings). The engine evaluations are saved next to it (what the browser's Stockfish returned at that depth), so
this runs offline in a few seconds and exercises the real grading code (`_run_single_pass_review_sync`).

Prints, per game: Chess.com vs ours for accuracy, then class counts and ratings where known.
`--tune` grid-searches the accuracy constants and reports a leave-one-game-out check. A change only counts as an
improvement when the leave-one-out error goes down; fitting six games without that check just memorises them.
"""
import copy
import itertools
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
os.environ.setdefault("APP_PASSCODE", "dev-local-test-pass")
os.environ.setdefault("SESSION_SECRET", "dev-local-test-secret-0123456789abcdef")
os.environ.setdefault("TESTING", "1")

from app.config import settings  # noqa: E402
from app.services.accuracy import calculate_game_accuracy, estimate_game_rating  # noqa: E402
from app.services.engine_service import _run_single_pass_review_sync  # noqa: E402

FIXTURE = os.path.join(os.path.dirname(HERE), "tests", "fixtures", "chesscom_calibration")
CLASS_ORDER = ["brilliant", "great", "book", "best", "excellent", "good", "inaccuracy", "mistake", "miss", "blunder"]
LONG_GAME_PLIES = 40  # very short games swing on a single move, so they are reported but not used for tuning


def load_games(evals_dir: str = "evals_d18"):
    games = json.load(open(os.path.join(FIXTURE, "games.json")))
    out = {}
    for gid, g in games.items():
        evals = json.load(open(os.path.join(FIXTURE, evals_dir, f"search-{gid}.json")))
        white_rating = g.get("cc_rating", {}).get("white") if g.get("cc_rating") else None
        black_rating = g.get("cc_rating", {}).get("black") if g.get("cc_rating") else None
        review = _run_single_pass_review_sync(
            None,
            [dict(m) for m in g["moves"]],
            white_rating=white_rating,
            black_rating=black_rating,
            external_evals=[{"lines": e["lines"]} for e in evals],
        )
        out[gid] = {"moves": review["moves"], "cc": g["cc"], "counts": g.get("cc_counts"), "rating": g.get("cc_rating")}
    return out


def ours(game, scale=None, power=None, weight_power=None):
    acc = calculate_game_accuracy(
        copy.deepcopy(game["moves"]),
        level="standard",
        scale=scale,
        power=power,
        weight_power=weight_power,
    )
    return acc["white"], acc["black"]


def class_counts(moves, color):
    counts = {c: 0 for c in CLASS_ORDER}
    for m in moves:
        if m["color"] == color and m.get("classification") in counts:
            counts[m["classification"]] += 1
    return [counts[c] for c in CLASS_ORDER]


def mean_abs_error(games, ids=None, scale=None, power=None, weight_power=None):
    errs = []
    for gid, g in games.items():
        if ids is not None and gid not in ids:
            continue
        w, b = ours(g, scale=scale, power=power, weight_power=weight_power)
        errs += [abs(w - g["cc"]["white"]), abs(b - g["cc"]["black"])]
    return sum(errs) / len(errs)


def long_ids(games):
    return [gid for gid, g in games.items() if len(g["moves"]) >= LONG_GAME_PLIES]


def report(games):
    for gid, g in games.items():
        w, b = ours(game=g)
        print(f"{gid} ({len(g['moves'])} plies)  Chess.com {g['cc']['white']}/{g['cc']['black']}   ours {w}/{b}   diff {w - g['cc']['white']:+.1f}/{b - g['cc']['black']:+.1f}")
        if g["counts"]:
            print(f"   classes {CLASS_ORDER}")
            for side, color in (("white", "w"), ("black", "b")):
                print(f"   {side}: Chess.com {g['counts'][side]}  ours {class_counts(g['moves'], color)}")
        if g["rating"]:
            rw, rb = estimate_game_rating(w), estimate_game_rating(b)
            print(f"   rating: Chess.com {g['rating']['white']}/{g['rating']['black']}  ours {rw}/{rb}")
    ids = long_ids(games)
    print(f"mean |accuracy error| on games of {LONG_GAME_PLIES}+ plies ({len(ids)} games): {mean_abs_error(games, ids):.2f}; all games: {mean_abs_error(games):.2f}")


def tune(games):
    ids = long_ids(games)
    cur = (settings.accuracy_chesscom_scale, settings.accuracy_chesscom_power, settings.accuracy_chesscom_weight_power)

    def err(params, subset):
        return mean_abs_error(games, subset, scale=params[0], power=params[1], weight_power=params[2])

    grid = list(itertools.product([5.0, 6.0, 7.0, 8.0, 9.0, 10.0], [0.9, 1.0, 1.1, 1.2, 1.3, 1.5], [0.0, 0.2, 0.3, 0.4, 0.6, 0.8]))
    best = min(grid, key=lambda p: err(p, ids))
    loo_cur = loo_tuned = 0.0
    for hold in ids:
        rest = [i for i in ids if i != hold]
        p = min(grid, key=lambda q: err(q, rest))
        loo_cur += err(cur, [hold])
        loo_tuned += err(p, [hold])
    print(f"current {cur}: error {err(cur, ids):.2f} | best {best}: error {err(best, ids):.2f}")
    print(f"leave-one-game-out error: current {loo_cur / len(ids):.2f}, re-tuned {loo_tuned / len(ids):.2f}  (adopt a change only if this goes DOWN)")


if __name__ == "__main__":
    evals = next((a for a in sys.argv[1:] if a.startswith("evals_")), "evals_d18")
    games = load_games(evals)
    report(games)
    if "--tune" in sys.argv:
        tune(games)
