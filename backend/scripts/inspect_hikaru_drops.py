import json
import math
import sys
import os

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(HERE)
CACHE_DIR = os.path.join(BACKEND_DIR, ".cache")

data = json.load(open(os.path.join(CACHE_DIR, "drops_all_1226_games.json"), encoding='utf-8'))

hikaru_games = [g for g in data if g['user'] == 'hikaru']
print(f"Total Hikaru games: {len(hikaru_games)}")

# Compare drops and per-move accuracies
# Check how many drops are in [0, 0.5], [0.5, 2.0], [2.0, 5.0], [5.0, 10.0], [10.0+]
drop_buckets = {"< 0.5": 0, "0.5 - 2.0": 0, "2.0 - 5.0": 0, "5.0 - 10.0": 0, "> 10.0": 0}
total_moves = 0

for g in hikaru_games:
    for col in ('white', 'black'):
        drops = g[f'{col}_drops']
        total_moves += len(drops)
        for d in drops:
            if d < 0.5: drop_buckets["< 0.5"] += 1
            elif d < 2.0: drop_buckets["0.5 - 2.0"] += 1
            elif d < 5.0: drop_buckets["2.0 - 5.0"] += 1
            elif d < 10.0: drop_buckets["5.0 - 10.0"] += 1
            else: drop_buckets["> 10.0"] += 1

print("\nHikaru drop distribution:")
for b, c in drop_buckets.items():
    print(f"  {b:<12}: {c:>6} ({c/total_moves*100:5.1f}%)")

# What move accuracy does our formula assign to each drop?
print("\nCurrent move accuracy per drop (scale=8.0, power=1.1):")
for test_drop in [0.0, 0.2, 0.5, 1.0, 2.0, 3.0, 5.0, 8.0, 10.0, 15.0, 20.0]:
    acc = 100.0 * math.exp(-((test_drop / 8.0) ** 1.1))
    print(f"  Drop {test_drop:4.1f}% -> Move Acc = {acc:5.1f}%")
