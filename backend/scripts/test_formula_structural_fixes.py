import json
import math
import sys
import os

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(HERE)
sys.path.insert(0, BACKEND_DIR)

from app.services.win_pct import eval_to_win_pct

data = json.load(open('backend/.cache/drops_626_games.json', encoding='utf-8'))

# Key test games
# 1. Hikaru outlier (184752512081 - target 60.01)
# 2. Gyro low game (77621514773 - target 39.97)
# 3. Roger test game (139277051974 - target 64.79)
# 4. Peach master game (181983501641 - target 82.4)

test_targets = {
    '184752512081': {'user': 'hikaru', 'color': 'white', 'cc': 60.01},
    '77621514773': {'user': 'gyrostomp', 'color': 'white', 'cc': 39.97},
    '139277051974': {'user': 'rogeralukka', 'color': 'black', 'cc': 64.79},
    '181983501641': {'user': 'loveandpeach', 'color': 'white', 'cc': 82.4},
}

def compute_game_acc(drops, classes, scale=8.0, power=1.1, wp=0.30, harmonic_ratio=0.15, min_acc=1.0):
    if not drops:
        return 100.0
    
    # Per-move accuracy
    accs = []
    weights = []
    blunder_miss_count = 0
    
    for d, cls in zip(drops, classes):
        if cls in ('blunder', 'miss'):
            blunder_miss_count += 1
            # Blunder/miss has low floor
            raw_a = 100.0 * math.exp(-((d / scale) ** power))
            a = max(min_acc, min(100.0, raw_a))
        else:
            raw_a = 100.0 * math.exp(-((d / scale) ** power))
            a = max(min_acc, min(100.0, raw_a))
            
        w = (1.0 + d / 5.0) ** wp
        accs.append(a)
        weights.append(w)
        
    tot_w = sum(weights)
    arith = sum(w * a for w, a in zip(weights, accs)) / tot_w
    
    if harmonic_ratio > 0.0:
        harm = tot_w / sum(w / a for w, a in zip(weights, accs))
        val = (1.0 - harmonic_ratio) * arith + harmonic_ratio * harm
    else:
        val = arith
        
    return round(min(100.0, max(0.0, val)), 1)

print("Testing blend parameters on key benchmark games:")
for h_ratio in [0.0, 0.05, 0.08, 0.10, 0.15]:
    for s in [8.0, 8.5]:
        for p in [1.10, 1.15]:
            print(f"\n--- s={s}, p={p}, harmonic={h_ratio} ---")
            for gid, info in test_targets.items():
                g = [x for x in data if str(x['id']) == gid][0]
                drops = list(g[f"{info['color']}_drops"])
                classes = list(g[f"{info['color']}_classes"])
                
                # Apply missed mate fix to Hikaru game
                if gid == '184752512081':
                    for i in [21, 22, 23, 24]: # plies 43, 45, 47, 49
                        if i < len(drops):
                            drops[i] = 30.0
                            classes[i] = 'miss'
                            
                pred = compute_game_acc(drops, classes, scale=s, power=p, harmonic_ratio=h_ratio)
                err = abs(pred - info['cc'])
                print(f"  {info['user']:12s} ({gid}): Target={info['cc']:5.1f} | Pred={pred:5.1f} | Err={err:4.1f}")
