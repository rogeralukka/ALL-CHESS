import json
import math
from collections import defaultdict

data = json.load(open('backend/.cache/drops_626_games.json', encoding='utf-8'))

def calc_pred(drops, classes, s=8.0, p=1.10, wp=0.30, coeff=0.55):
    accs = [max(0.0, min(100.0, round(100.0 * math.exp(-((d / s) ** p)), 1))) for d in drops]
    weights = [(1.0 + d / 5.0) ** wp for d in drops]
    base_acc = sum(w * a for w, a in zip(weights, accs)) / sum(weights)
    n_blunders = sum(1 for cls in classes if cls in ('blunder', 'miss'))
    blunder_rate = n_blunders / len(drops)
    if blunder_rate > 0.12:
        reduction = (blunder_rate - 0.12) * coeff
        return round(max(15.0, base_acc * (1.0 - reduction)), 1)
    return round(base_acc, 1)

order = ["ishowspeed", "gyrostomp", "rogeralukka", "nickorlando24", "loveandpeach", "hikaru"]
display_names = {
    "ishowspeed": "IShowSpeed (~119 Elo Beginner)",
    "gyrostomp": "Gyrostomp (~637 Elo Developing)",
    "rogeralukka": "RogerAlukka (~700-900 Elo HELD-OUT TEST)",
    "nickorlando24": "NickOrlando24 (~1150 Elo Club)",
    "loveandpeach": "LoveAndPeach (~2504 Elo Master)",
    "hikaru": "Hikaru (~3300 Elo Super GM)",
}

for u in order:
    u_games = [g for g in data if g["user"] == u]
    print(f"\n#### Tier: {display_names[u]}")
    print(f"| {'Game ID':<12} | {'Color / Elo':<14} | {'Chess.com':>10} | {'Current':>8} | {'Improved':>9} | {'Curr Err':>9} | {'Impr Err':>9} | {'Status':>8} |")
    print(f"|{'-'*14}|{'-'*16}|{'-'*12}|{'-'*10}|{'-'*11}|{'-'*11}|{'-'*11}|{'-'*10}|")
    for g in u_games[:4]:
        for c in ('white', 'black'):
            drops = g[f'{c}_drops']
            classes = g[f'{c}_classes']
            if not drops: continue
            cc = g['cc'][c]
            curr = g['current'][c]
            impr = calc_pred(drops, classes)
            c_err = abs(curr - cc)
            i_err = abs(impr - cc)
            stat = "BETTER" if i_err < c_err else ("SAME" if abs(i_err - c_err) < 0.05 else "WORSE")
            r = g.get(f'{c}_rating', 1500)
            print(f"| {g['id']:<12} | {c.capitalize():<5} ({r:<4}) | {cc:>9.1f}% | {curr:>7.1f}% | {impr:>8.1f}% | {c_err:>8.2f} | {i_err:>8.2f} | {stat:>8} |")
