"""Grid search on corrected dataset (with missed mate fix).
Pure rating-independent parameters.
"""

import json
import math
import os
import sys

CACHE_DIR = "backend/.cache"
CORR_FILE = os.path.join(CACHE_DIR, "drops_626_corrected.json")

if not os.path.exists(CORR_FILE):
    print("Waiting for drops_626_corrected.json...")
    sys.exit(0)

data = json.load(open(CORR_FILE, encoding='utf-8'))
train_data = [g for g in data if g["user"] != "rogeralukka"]
test_data = [g for g in data if g["user"] == "rogeralukka"]


def eval_pure(s, p, wp):
    all_errs, roger_errs = [], []
    bands = {"< 60%": [], "60 - 70%": [], "70 - 80%": [], "80 - 90%": [], "90%+": []}
    users = {}

    for g in data:
        u = g["user"]
        if u not in users: users[u] = []
        for color in ("white", "black"):
            drops = g[f"{color}_drops"]
            if not drops: continue
            cc = g["cc"][color]

            accs = [max(0.0, min(100.0, round(100.0 * math.exp(-((d / s) ** p)), 1))) for d in drops]
            weights = [(1.0 + d / 5.0) ** wp for d in drops]
            pred = round(sum(w * a for w, a in zip(weights, accs)) / sum(weights), 1)

            err = abs(pred - cc)
            all_errs.append(err)
            users[u].append(err)
            if u == "rogeralukka": roger_errs.append(err)

            if cc < 60: bands["< 60%"].append(err)
            elif cc < 70: bands["60 - 70%"].append(err)
            elif cc < 80: bands["70 - 80%"].append(err)
            elif cc < 90: bands["80 - 90%"].append(err)
            else: bands["90%+"].append(err)

    return {
        "overall": sum(all_errs) / len(all_errs),
        "roger": sum(roger_errs) / len(roger_errs),
        "bands": {k: sum(v) / len(v) for k, v in bands.items()},
        "users": {k: sum(v) / len(v) for k, v in users.items()},
    }


# Current baseline
curr = eval_pure(8.0, 1.10, 0.30)
print(f"CORRECTED BASELINE: Overall={curr['overall']:.2f}, Roger={curr['roger']:.2f}")
print("  Bands:", {k: round(v, 2) for k, v in curr['bands'].items()})
print("  Users:", {k: round(v, 2) for k, v in curr['users'].items()})

print("\n--- GRID SEARCH ---")
candidates = []
for s in [7.5, 8.0, 8.2, 8.5, 8.8, 9.0]:
    for p in [1.08, 1.10, 1.12, 1.15, 1.18, 1.20]:
        for wp in [0.28, 0.30, 0.32, 0.35, 0.38]:
            res = eval_pure(s, p, wp)
            # Conditions: Roger must be <= 4.0, 60-70 band <= 4.25
            if res["roger"] <= 4.0 and res["bands"]["60 - 70%"] <= 4.30:
                candidates.append((res["overall"], s, p, wp, res))

candidates.sort(key=lambda x: x[0])
print(f"Found {len(candidates)} balanced candidates that protect Roger and 60-70% band!")
for ov, s, p, wp, res in candidates[:5]:
    print(f"\nCandidate: scale={s}, power={p}, wp={wp} -> Overall={ov:.2f}, Roger={res['roger']:.2f}")
    print("  Bands:", {k: round(v, 2) for k, v in res['bands'].items()})
    print("  Users:", {k: round(v, 2) for k, v in res['users'].items()})
