import json
import math

data = json.load(open('backend/.cache/drops_626_games.json', encoding='utf-8'))

# Test games
# 1. Extreme blunder game: 166350282836 (Gyro - CC 22.94 / 24.28)
# 2. Moderate blunder game: 186304162924 (Nick - CC 37.0 / 45.7)
# 3. Normal club game: 139277051974 (Roger - CC 73.89 / 64.79)
# 4. Master game: 181983501641 (Peach - CC 82.4 / 89.5)
# 5. GM game: 184154310943 (Hikaru - CC 67.7 / 75.8)

test_games = ['166350282836', '186304162924', '139277051974', '181983501641', '184154310943']

def test_blunder_ratio_model(penalty_coeff):
    errs = []
    for g in data:
        for c in ('white', 'black'):
            drops = g[f'{c}_drops']
            classes = g[f'{c}_classes']
            if not drops: continue
            cc = g['cc'][c]
            
            # Move accuracy
            accs = [max(0.0, min(100.0, round(100.0 * math.exp(-((d / 8.0) ** 1.1)), 1))) for d in drops]
            weights = [(1.0 + d / 5.0) ** 0.3 for d in drops]
            base_acc = sum(w * a for w, a in zip(weights, accs)) / sum(weights)
            
            # Blunder penalty factor
            n_blunders = sum(1 for cls in classes if cls in ('blunder', 'miss'))
            blunder_rate = n_blunders / len(drops)
            
            # If blunder rate is high (> 10%), apply progressive reduction
            if blunder_rate > 0.10:
                reduction = (blunder_rate - 0.10) * penalty_coeff
                final_acc = max(10.0, base_acc * (1.0 - reduction))
            else:
                final_acc = base_acc
                
            pred = round(final_acc, 1)
            errs.append(abs(pred - cc))
            
    return sum(errs) / len(errs)

print("Tuning blunder rate progressive reduction:")
for coeff in [0.0, 0.2, 0.4, 0.5, 0.6, 0.8, 1.0]:
    mae = test_blunder_ratio_model(coeff)
    print(f"Coeff = {coeff:.1f} -> Overall 626 Games MAE = {mae:.3f}")

print("\nBenchmark games with coeff = 0.7:")
for gid in ['166350282836', '186304162924', '139277051974', '181983501641', '184154310943']:
    g = [x for x in data if str(x['id']) == gid][0]
    for c in ('white', 'black'):
        drops = g[f'{c}_drops']
        classes = g[f'{c}_classes']
        cc = g['cc'][c]
        accs = [max(0.0, min(100.0, round(100.0 * math.exp(-((d / 8.0) ** 1.1)), 1))) for d in drops]
        weights = [(1.0 + d / 5.0) ** 0.3 for d in drops]
        base_acc = sum(w * a for w, a in zip(weights, accs)) / sum(weights)
        n_blunders = sum(1 for cls in classes if cls in ('blunder', 'miss'))
        blunder_rate = n_blunders / len(drops)
        if blunder_rate > 0.10:
            reduction = (blunder_rate - 0.10) * 0.7
            pred = round(max(10.0, base_acc * (1.0 - reduction)), 1)
        else:
            pred = round(base_acc, 1)
        print(f"  {g['user']:12s} ({gid}) {c}: CC={cc:5.1f} | Base={base_acc:5.1f} | Pred={pred:5.1f} | Err={abs(pred - cc):4.1f}")
