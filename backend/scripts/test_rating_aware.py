import json
import math

data = json.load(open('backend/.cache/drops_626_games.json', encoding='utf-8'))

def eval_rating_aware(scale=8.5, power=1.35, min_acc=1.0):
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
            r = g.get(f"{color}_rating") or 1500
            if not drops:
                continue

            # Rating-adaptive wp: 0.55 at 500 Elo down to 0.22 at 2500+ Elo
            t = (max(500, min(2600, r)) - 500) / 2100.0
            wp = 0.55 - 0.33 * t

            accs = [max(min_acc, min(100.0, round(100.0 * math.exp(-((d / scale) ** power)), 1))) for d in drops]
            weights = [(1.0 + d / 5.0) ** wp for d in drops]
            tot_w = sum(weights)
            arith = sum(w * a for w, a in zip(weights, accs)) / tot_w
            pred = round(arith, 1)

            err = abs(pred - cc)
            user_errs[u].append(err)
            if u == "rogeralukka":
                test_errs.append(err)
            else:
                train_errs.append(err)

    return {
        "overall_mae": (sum(train_errs) + sum(test_errs)) / (len(train_errs) + len(test_errs)),
        "train_mae": sum(train_errs) / len(train_errs),
        "test_mae": sum(test_errs) / len(test_errs),
        "users": {u: sum(errs) / len(errs) for u, errs in user_errs.items()},
    }


print("--- RATING-ADAPTIVE ACCURACY FORMULA ---")
for s in [8.0, 8.5, 9.0, 9.5]:
    for p in [1.2, 1.25, 1.3, 1.35, 1.4]:
        res = eval_rating_aware(scale=s, power=p)
        print(f"scale={s:4.1f}, power={p:4.2f} -> Overall: {res['overall_mae']:.2f} | Train: {res['train_mae']:.2f} | Roger: {res['test_mae']:.2f} | Speed: {res['users']['ishowspeed']:.2f} | Gyro: {res['users']['gyrostomp']:.2f} | Hikaru: {res['users']['hikaru']:.2f} | Nick: {res['users']['nickorlando24']:.2f} | Peach: {res['users']['loveandpeach']:.2f}")
