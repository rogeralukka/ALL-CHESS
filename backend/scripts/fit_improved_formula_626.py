"""Fits and compares improved accuracy formulas across all 626 games.

Training Set (589 games across all tiers):
  - ishowspeed (~119 Elo)
  - gyrostomp (~637 Elo)
  - nickorlando24 (~1150 Elo)
  - loveandpeach (~2504 Elo)
  - hikaru (~3300 Elo)

Held-out Test Set (37 games):
  - rogeralukka (~700-900 Elo) - STRICT CONSTRAINT: Never trained on!

Outputs:
  - MAE, Max Error, Bias across overall dataset, training set, and Roger held-out set.
  - Per-rating band accuracy comparison:
      < 60%, 60-70%, 70-80%, 80-90%, 90%+
  - 3-way side-by-side comparison tables:
      Chess.com -> Current Formula -> Improved Formula
"""

import json
import math
import os
import sys
import time
from typing import Any, Callable, Dict, List, Tuple

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(HERE)
sys.path.insert(0, BACKEND_DIR)

CACHE_DIR = os.path.join(BACKEND_DIR, ".cache")
DROPS_FILE = os.path.join(CACHE_DIR, "drops_626_games.json")
RESULTS_OUT_FILE = os.path.join(CACHE_DIR, "improved_formula_results.json")


def load_dataset() -> List[Dict[str, Any]]:
    if not os.path.exists(DROPS_FILE):
        raise FileNotFoundError(f"Missing {DROPS_FILE}. Run extract_all_626_drops.py first.")
    with open(DROPS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


# -----------------------------------------------------------------------------
# 1. Formula Implementations
# -----------------------------------------------------------------------------

def current_formula_acc(drops: List[float], scale: float = 8.0, power: float = 1.1, weight_power: float = 0.30) -> float:
    if not drops:
        return 100.0
    accs = [min(100.0, max(0.0, round(100.0 * math.exp(-((d / scale) ** power)), 1))) for d in drops]
    weights = [(1.0 + d / 5.0) ** weight_power for d in drops]
    tot_w = sum(weights)
    if tot_w <= 0:
        return 100.0
    return round(min(100.0, max(0.0, sum(w * a for w, a in zip(weights, accs)) / tot_w)), 1)


def improved_power_floor_acc(
    drops: List[float],
    scale: float = 10.0,
    power: float = 1.45,
    weight_power: float = 0.22,
    drop_cap: float = 35.0,
    min_move_acc: float = 2.0,
) -> float:
    """Improved Formula Variant:
    1. Higher power (1.45 vs 1.1): Flattens shoulder for near-best moves (drops < 2% get 97-100%).
    2. Capped drop weight: Blunders are penalized, but cannot infinitely overweight the arithmetic mean.
    3. Soft move floor (2.0%): Prevents multi-blunder low-Elo games from cratering to 10-20%.
    """
    if not drops:
        return 100.0
    accs = []
    weights = []
    for d in drops:
        raw_a = 100.0 * math.exp(-((d / scale) ** power))
        a = min(100.0, max(min_move_acc, round(raw_a, 1)))
        w = (1.0 + min(d, drop_cap) / 5.0) ** weight_power
        accs.append(a)
        weights.append(w)
    tot_w = sum(weights)
    if tot_w <= 0:
        return 100.0
    return round(min(100.0, max(0.0, sum(w * a for w, a in zip(weights, accs)) / tot_w)), 1)


def evaluate_model(
    dataset: List[Dict[str, Any]],
    acc_fn: Callable[[List[float]], float],
    split_user: str = "rogeralukka",
) -> Dict[str, Any]:
    train_samples = []
    test_samples = []
    all_samples = []

    for g in dataset:
        w_pred = acc_fn(g["white_drops"])
        b_pred = acc_fn(g["black_drops"])
        w_cc = g["cc"]["white"]
        b_cc = g["cc"]["black"]

        w_item = {
            "id": g["id"],
            "user": g["user"],
            "player": g.get("white_user"),
            "color": "white",
            "rating": g.get("white_rating"),
            "cc": w_cc,
            "pred": w_pred,
            "err": round(w_pred - w_cc, 2),
            "abs_err": round(abs(w_pred - w_cc), 2),
        }
        b_item = {
            "id": g["id"],
            "user": g["user"],
            "player": g.get("black_user"),
            "color": "black",
            "rating": g.get("black_rating"),
            "cc": b_cc,
            "pred": b_pred,
            "err": round(b_pred - b_cc, 2),
            "abs_err": round(abs(b_pred - b_cc), 2),
        }

        all_samples.extend([w_item, b_item])
        if g["user"] == split_user:
            test_samples.extend([w_item, b_item])
        else:
            train_samples.extend([w_item, b_item])

    def calc_stats(samples):
        if not samples:
            return {"count": 0, "mae": 0.0, "max": 0.0, "bias": 0.0}
        return {
            "count": len(samples),
            "mae": round(sum(s["abs_err"] for s in samples) / len(samples), 2),
            "max": round(max(s["abs_err"] for s in samples), 2),
            "bias": round(sum(s["err"] for s in samples) / len(samples), 2),
        }

    bands = {
        "< 60%": [s for s in all_samples if s["cc"] < 60.0],
        "60 - 70%": [s for s in all_samples if 60.0 <= s["cc"] < 70.0],
        "70 - 80%": [s for s in all_samples if 70.0 <= s["cc"] < 80.0],
        "80 - 90%": [s for s in all_samples if 80.0 <= s["cc"] < 90.0],
        "90%+": [s for s in all_samples if s["cc"] >= 90.0],
    }

    user_stats = {}
    for u in set(s["user"] for s in all_samples):
        user_samples = [s for s in all_samples if s["user"] == u]
        user_stats[u] = calc_stats(user_samples)

    return {
        "overall": calc_stats(all_samples),
        "train": calc_stats(train_samples),
        "test_roger": calc_stats(test_samples),
        "bands": {k: calc_stats(v) for k, v in bands.items()},
        "users": user_stats,
        "samples": all_samples,
    }


def grid_search_improved(train_dataset: List[Dict[str, Any]]) -> Tuple[float, float, float, float]:
    """Finds optimal parameters on train set."""
    print("Running multi-parameter grid search on 589 training games...")
    best_loss = float("inf")
    best_params = (10.0, 1.45, 0.22, 35.0)

    # Grid
    scales = [8.0, 9.0, 10.0, 11.0, 12.0]
    powers = [1.2, 1.3, 1.4, 1.45, 1.5, 1.6]
    weight_powers = [0.15, 0.20, 0.25, 0.30]
    caps = [25.0, 35.0, 50.0, 100.0]

    for s in scales:
        for p in powers:
            for wp in weight_powers:
                for cap in caps:
                    tot_err = 0.0
                    n = 0
                    for g in train_dataset:
                        w_p = improved_power_floor_acc(g["white_drops"], s, p, wp, cap)
                        b_p = improved_power_floor_acc(g["black_drops"], s, p, wp, cap)
                        tot_err += abs(w_p - g["cc"]["white"]) + abs(b_p - g["cc"]["black"])
                        n += 2
                    mean_err = tot_err / n
                    if mean_err < best_loss:
                        best_loss = mean_err
                        best_params = (s, p, wp, cap)
                        print(f"  New best: scale={s}, power={p}, wp={wp}, cap={cap} -> Train MAE: {mean_err:.3f}")

    return best_params


def main():
    print("Loading 626 games dataset...")
    data = load_dataset()
    print(f"Loaded {len(data)} games.")

    train_data = [g for g in data if g["user"] != "rogeralukka"]
    test_data = [g for g in data if g["user"] == "rogeralukka"]
    print(f"Training games: {len(train_data)} | Held-out Roger games: {len(test_data)}")

    # 1. Evaluate Current Baseline
    print("\n--- 1. Evaluating Current Baseline Formula ---")
    current_eval = evaluate_model(data, current_formula_acc)
    print(f"Current Overall MAE: {current_eval['overall']['mae']} | Roger MAE: {current_eval['test_roger']['mae']}")

    # 2. Grid Search for Optimal Improved Formula
    opt_scale, opt_power, opt_wp, opt_cap = grid_search_improved(train_data)
    print(f"\nOptimal parameters: scale={opt_scale}, power={opt_power}, weight_power={opt_wp}, drop_cap={opt_cap}")

    # 3. Evaluate Optimal Improved Formula
    print("\n--- 2. Evaluating Improved Formula ---")
    improved_fn = lambda drops: improved_power_floor_acc(drops, opt_scale, opt_power, opt_wp, opt_cap)
    improved_eval = evaluate_model(data, improved_fn)

    print(f"Improved Overall MAE: {improved_eval['overall']['mae']} | Roger MAE: {improved_eval['test_roger']['mae']}")

    # Save summary
    results = {
        "current": current_eval,
        "improved": improved_eval,
        "best_params": {
            "scale": opt_scale,
            "power": opt_power,
            "weight_power": opt_wp,
            "drop_cap": opt_cap,
        },
    }
    with open(RESULTS_OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print(f"\nSaved results to {RESULTS_OUT_FILE}.")


if __name__ == "__main__":
    main()
