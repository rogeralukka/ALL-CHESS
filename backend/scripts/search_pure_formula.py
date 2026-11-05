"""Searches for purely rating-independent formula improvements.
Must NOT use player rating! Must evaluate purely on game moves.
"""

import json
import math

data = json.load(open('backend/.cache/drops_626_games.json', encoding='utf-8'))
train_data = [g for g in data if g["user"] != "rogeralukka"]
test_data = [g for g in data if g["user"] == "rogeralukka"]


def eval_pure(scale, power, wp, cap=100.0, min_acc=0.0):
    all_errs = []
    train_errs = []
    test_errs = []
    band_errs = {"< 60%": [], "60 - 70%": [], "70 - 80%": [], "80 - 90%": [], "90%+": []}
    user_errs = {}

    for g in data:
        u = g["user"]
        if u not in user_errs:
            user_errs[u] = []
        for color in ("white", "black"):
            drops = g[f"{color}_drops"]
            cc = g["cc"][color]
            if not drops:
                continue

            accs = [max(min_acc, min(100.0, round(100.0 * math.exp(-((d / scale) ** power)), 1))) for d in drops]
            weights = [(1.0 + min(d, cap) / 5.0) ** wp for d in drops]
            tot_w = sum(weights)
            arith = sum(w * a for w, a in zip(weights, accs)) / tot_w
            pred = round(arith, 1)

            err = abs(pred - cc)
            all_errs.append(err)
            user_errs[u].append(err)
            if u == "rogeralukka":
                test_errs.append(err)
            else:
                train_errs.append(err)

            if cc < 60:
                band_errs["< 60%"].append(err)
            elif cc < 70:
                band_errs["60 - 70%"].append(err)
            elif cc < 80:
                band_errs["70 - 80%"].append(err)
            elif cc < 90:
                band_errs["80 - 90%"].append(err)
            else:
                band_errs["90%+"].append(err)

    return {
        "overall": sum(all_errs) / len(all_errs),
        "train": sum(train_errs) / len(train_errs),
        "roger": sum(test_errs) / len(test_errs),
        "bands": {k: sum(v) / len(v) for k, v in band_errs.items()},
        "users": {k: sum(v) / len(v) for k, v in user_errs.items()},
    }


# Current baseline
curr = eval_pure(8.0, 1.1, 0.3)
print(f"BASELINE: Overall={curr['overall']:.2f}, Roger={curr['roger']:.2f}")
print("  Bands:", {k: round(v, 2) for k, v in curr['bands'].items()})
print("  Users:", {k: round(v, 2) for k, v in curr['users'].items()})

print("\n--- GRID SEARCH (Rating-Independent) ---")
best_params = None
best_score = float("inf")

for s in [7.5, 8.0, 8.5, 9.0]:
    for p in [1.10, 1.15, 1.20, 1.25]:
        for wp in [0.25, 0.30, 0.35, 0.40]:
            for cap in [30.0, 45.0, 60.0, 100.0]:
                res = eval_pure(s, p, wp, cap)
                # Check if 60-70 band is NOT degraded (must be <= 4.25) and Roger is <= 4.0
                score = res["train"]
                if score < best_score:
                    best_score = score
                    best_params = (s, p, wp, cap, res)

s, p, wp, cap, res = best_params
print(f"\nBEST PURE: scale={s}, power={p}, wp={wp}, cap={cap}")
print(f"  Overall={res['overall']:.2f}, Train={res['train']:.2f}, Roger={res['roger']:.2f}")
print("  Bands:", {k: round(v, 2) for k, v in res['bands'].items()})
print("  Users:", {k: round(v, 2) for k, v in res['users'].items()})
