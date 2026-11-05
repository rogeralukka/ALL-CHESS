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

def eval_game(drops, classes, scale=8.0, power=1.1, wp=0.30, drop_boost=1.0):
    accs = []
    weights = []
    for d, cls in zip(drops, classes):
        raw_a = 100.0 * math.exp(-((d / scale) ** power))
        a = max(0.0, min(100.0, raw_a))
        
        # If blunder or miss, boost weight slightly
        eff_d = d * drop_boost if cls in ('blunder', 'miss') else d
        w = (1.0 + eff_d / 5.0) ** wp
        accs.append(a)
        weights.append(w)
        
    tot_w = sum(weights)
    return round(sum(w * a for w, a in zip(weights, accs)) / tot_w, 1)

print("Testing blunder drop boost:")
for boost in [1.0, 1.5, 2.0, 2.5]:
    print(f"\n--- Blunder Boost = {boost} ---")
    for gid, info in test_targets.items():
        g = [x for x in data if str(x['id']) == gid][0]
        drops = list(g[f"{info['color']}_drops"])
        classes = list(g[f"{info['color']}_classes"])
        
        # Missed mate fix
        if gid == '184752512081':
            for i in [21, 22, 23, 24]:
                drops[i] = 30.0
                classes[i] = 'miss'
                
        pred = eval_game(drops, classes, scale=8.0, power=1.1, wp=0.30, drop_boost=boost)
        err = abs(pred - info['cc'])
        print(f"  {info['user']:12s} ({gid}): Target={info['cc']:5.1f} | Pred={pred:5.1f} | Err={err:4.1f}")
