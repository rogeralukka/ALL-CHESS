import json
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(HERE)
CACHE_DIR = os.path.join(BACKEND_DIR, ".cache")
sys.path.insert(0, BACKEND_DIR)
os.environ.setdefault("APP_PASSCODE", "dev-local-test-pass")
os.environ.setdefault("SESSION_SECRET", "dev-local-test-secret-0123456789abcdef")
os.environ.setdefault("TESTING", "1")

from app.services.accuracy import estimate_game_rating as old_rating

games = json.load(open(os.path.join(CACHE_DIR, "drops_all_1226_games.json"), encoding='utf-8'))

# Expected accuracy by rating:
# A player of rating R has an expected accuracy:
# E[acc](R) = 55.0 + 35.0 / (1.0 + exp(- (R - 1200) / 800))
# Let's test a simple monotonic anchor table calibrated against real Elo:
REAL_ELO_ANCHORS = [
    (0.0, 100),
    (55.0, 200),
    (60.0, 350),
    (65.0, 500),
    (68.0, 800),
    (72.0, 1200),
    (75.5, 1550),
    (78.5, 2000),
    (81.0, 2400),
    (83.5, 2800),
    (86.0, 3200),
    (92.0, 3500),
    (100.0, 3800),
]

def real_anchor_rating(acc):
    if acc is None: return 1500
    acc = max(0.0, min(100.0, float(acc)))
    if acc <= REAL_ELO_ANCHORS[0][0]: return REAL_ELO_ANCHORS[0][1]
    if acc >= REAL_ELO_ANCHORS[-1][0]: return REAL_ELO_ANCHORS[-1][1]
    for i in range(len(REAL_ELO_ANCHORS) - 1):
        a0, r0 = REAL_ELO_ANCHORS[i]
        a1, r1 = REAL_ELO_ANCHORS[i + 1]
        if a0 <= acc <= a1:
            t = (acc - a0) / (a1 - a0)
            return int(round(r0 + t * (r1 - r0)))
    return 1500

# Method 2: Baseline-Centered Performance Rating
# Performance = Base_Rating + (Acc - Expected_Acc) * Sensitivity
def expected_acc(base_r):
    # From empirical data:
    # 400 Elo -> 66%
    # 800 Elo -> 68%
    # 1500 Elo -> 76%
    # 2200 Elo -> 80%
    # 3200 Elo -> 86%
    if base_r <= 400: return 65.0
    if base_r >= 3300: return 86.0
    return 64.0 + (base_r / 3300.0) ** 0.8 * 22.0

def baseline_perf_rating(acc, base_r):
    if base_r is None: return real_anchor_rating(acc)
    exp_a = expected_acc(base_r)
    # 1% accuracy deviation is worth ~30-40 Elo around their baseline
    diff = acc - exp_a
    return max(100, min(3800, int(round(base_r + diff * 35.0))))

order = ["ishowspeed", "jynxzii", "gyrostomp", "rogeralukka", "nickorlando24", "samayraina", "garythursday", "loveandpeach", "hikaru"]
display_names = {
    "ishowspeed": "IShowSpeed (~119 Elo)",
    "jynxzii": "Jynxzii (~464 Elo)",
    "gyrostomp": "Gyrostomp (~637 Elo)",
    "rogeralukka": "RogerAlukka (~760 Elo)",
    "nickorlando24": "NickOrlando24 (~755 Elo)",
    "samayraina": "SamayRaina (~1562 Elo)",
    "garythursday": "GaryThursday (~2202 Elo)",
    "loveandpeach": "LoveAndPeach (~2539 Elo)",
    "hikaru": "Hikaru (~3213 Elo)",
}

print("=" * 130)
print(f"| {'Account':<28} | {'Actual Elo':>10} | {'Chess.com Acc':>13} | {'Old Broken Rating':>17} | {'Calibrated Global':>17} | {'Baseline Centered':>17} |")
print("=" * 130)

for u in order:
    u_games = [g for g in games if g['user'] == u]
    actual_elos = []
    cc_accs = []
    for g in u_games:
        for c in ('white', 'black'):
            if g.get(f'{c}_rating'): actual_elos.append(g[f'{c}_rating'])
            if g['cc'][c]: cc_accs.append(g['cc'][c])
            
    avg_elo = sum(actual_elos) / len(actual_elos)
    avg_acc = sum(cc_accs) / len(cc_accs)
    
    # compare ratings
    old_r = old_rating(avg_acc)
    calib_r = real_anchor_rating(avg_acc)
    base_r = baseline_perf_rating(avg_acc, avg_elo)
    
    print(f"| {display_names[u]:<28} | {avg_elo:>10.0f} | {avg_acc:>12.1f}% | {old_r:>17} | {calib_r:>17} | {base_r:>17} |")

print("=" * 130)
