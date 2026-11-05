import json
import math

data = json.load(open('backend/.cache/drops_626_games.json', encoding='utf-8'))

train_data = [g for g in data if g["user"] != "rogeralukka"]
test_data = [g for g in data if g["user"] == "rogeralukka"]


def eval_params(scale, power, wp, alpha, min_acc=1.0):
    train_errs = []
    test_errs = []
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
            weights = [(1.0 + d / 5.0) ** wp for d in drops]
            tot_w = sum(weights)
            arith = sum(w * a for w, a in zip(weights, accs)) / tot_w
            if alpha < 1.0:
                harm = tot_w / sum(w / a for w, a in zip(weights, accs))
                pred = round(alpha * arith + (1.0 - alpha) * harm, 1)
            else:
                pred = round(arith, 1)

            err = abs(pred - cc)
            user_errs[u].append(err)
            if u == "rogeralukka":
                test_errs.append(err)
            else:
                train_errs.append(err)

    return {
        "train_mae": sum(train_errs) / len(train_errs),
        "test_mae": sum(test_errs) / len(test_errs),
        "overall_mae": (sum(train_errs) + sum(test_errs)) / (len(train_errs) + len(test_errs)),
        "users": {u: sum(errs) / len(errs) for u, errs in user_errs.items()},
    }


# Baseline
print("--- CURRENT BASELINE (scale=8.0, power=1.1, wp=0.3, alpha=1.0) ---")
curr = eval_params(8.0, 1.1, 0.3, 1.0)
print(f"Overall MAE: {curr['overall_mae']:.2f} | Train: {curr['train_mae']:.2f} | Held-out Roger: {curr['test_mae']:.2f}")
for u, m in curr['users'].items():
    print(f"  {u:15s}: {m:.2f}")

# Grid of improved combinations
print("\n--- TESTING IMPROVED CANDIDATES ---")
candidates = [
    (8.0, 1.3, 0.5, 1.0),
    (8.0, 1.35, 0.55, 1.0),
    (8.0, 1.4, 0.6, 1.0),
    (8.5, 1.3, 0.55, 1.0),
    (9.0, 1.35, 0.6, 1.0),
    (8.5, 1.35, 0.65, 1.0),
    (8.0, 1.25, 0.45, 0.90),
    (9.0, 1.3, 0.4, 0.85),
    (9.5, 1.35, 0.35, 0.80),
]

for s, p, wp, a in candidates:
    res = eval_params(s, p, wp, a)
    print(f"scale={s:4.1f}, power={p:4.2f}, wp={wp:4.2f}, alpha={a:4.2f} -> Overall: {res['overall_mae']:.2f} | Train: {res['train_mae']:.2f} | Roger: {res['test_mae']:.2f} | Speed: {res['users']['ishowspeed']:.2f} | Gyro: {res['users']['gyrostomp']:.2f} | Hikaru: {res['users']['hikaru']:.2f} | Nick: {res['users']['nickorlando24']:.2f} | Peach: {res['users']['loveandpeach']:.2f}")
