import json
import math

data = json.load(open('backend/.cache/drops_626_games.json', encoding='utf-8'))

# Let's inspect the exact 626 games with true missed mates and blunder dampening
print(f"Total games loaded: {len(data)}")

def calc_acc(drops, s=8.0, p=1.1, wp=0.3):
    accs = [max(0.0, min(100.0, round(100.0 * math.exp(-((d / s) ** p)), 1))) for d in drops]
    weights = [(1.0 + d / 5.0) ** wp for d in drops]
    return round(sum(w * a for w, a in zip(weights, accs)) / sum(weights), 1)

# Check Roger accuracy on the clean original drops
roger_errs = []
for g in data:
    if g['user'] == 'rogeralukka':
        for c in ('white', 'black'):
            pred = calc_acc(g[f'{c}_drops'])
            roger_errs.append(abs(pred - g['cc'][c]))

print(f"Roger Baseline MAE on clean drops: {sum(roger_errs)/len(roger_errs):.2f}")
