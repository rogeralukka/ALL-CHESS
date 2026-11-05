import json
import math

data = json.load(open('backend/.cache/drops_626_corrected.json', encoding='utf-8'))

def eval_combined(s=8.0, p=1.1, wp=0.3, blunder_coeff=0.7):
    errs = []
    roger_errs = []
    bands = {"< 60%": [], "60 - 70%": [], "70 - 80%": [], "80 - 90%": [], "90%+": []}
    users = {}

    for g in data:
        u = g["user"]
        if u not in users: users[u] = []
        for c in ('white', 'black'):
            drops = g[f'{c}_drops']
            classes = g[f'{c}_classes']
            if not drops: continue
            cc = g['cc'][c]

            accs = [max(0.0, min(100.0, round(100.0 * math.exp(-((d / s) ** p)), 1))) for d in drops]
            weights = [(1.0 + d / 5.0) ** wp for d in drops]
            base_acc = sum(w * a for w, a in zip(weights, accs)) / sum(weights)

            n_blunders = sum(1 for cls in classes if cls in ('blunder', 'miss'))
            blunder_rate = n_blunders / len(drops)
            if blunder_rate > 0.10:
                reduction = (blunder_rate - 0.10) * blunder_coeff
                final_acc = max(10.0, base_acc * (1.0 - reduction))
            else:
                final_acc = base_acc

            pred = round(final_acc, 1)
            err = abs(pred - cc)
            errs.append(err)
            users[u].append(err)
            if u == "rogeralukka": roger_errs.append(err)

            if cc < 60: bands["< 60%"].append(err)
            elif cc < 70: bands["60 - 70%"].append(err)
            elif cc < 80: bands["70 - 80%"].append(err)
            elif cc < 90: bands["80 - 90%"].append(err)
            else: bands["90%+"].append(err)

    return {
        "overall": sum(errs) / len(errs),
        "roger": sum(roger_errs) / len(roger_errs),
        "bands": {k: sum(v) / len(v) for k, v in bands.items()},
        "users": {k: sum(v) / len(v) for k, v in users.items()},
    }

print("Combined (Missed Mate fix + Blunder Rate discount):")
for coeff in [0.0, 0.4, 0.6, 0.7, 0.8]:
    res = eval_combined(blunder_coeff=coeff)
    print(f"coeff={coeff:.1f} -> Overall={res['overall']:.2f} | Roger={res['roger']:.2f} | <60%={res['bands']['< 60%']:.2f} | 60-70%={res['bands']['60 - 70%']:.2f} | Gyro={res['users']['gyrostomp']:.2f} | Speed={res['users']['ishowspeed']:.2f}")
