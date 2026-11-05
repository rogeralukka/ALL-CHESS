import json
import math
import os

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(HERE)
CACHE_DIR = os.path.join(BACKEND_DIR, ".cache")

games = json.load(open(os.path.join(CACHE_DIR, "drops_all_1226_games.json"), encoding='utf-8'))

# Collect (player_rating, cc_accuracy) for all 2,452 player-game evaluations
pairs = []
for g in games:
    for col in ('white', 'black'):
        r = g.get(f'{col}_rating')
        acc = g['cc'][col]
        if r is not None and r > 0 and acc is not None:
            pairs.append((r, acc, g['user']))

print(f"Total valid (rating, accuracy) pairs: {len(pairs)}")

# Group by rating brackets
brackets = {
    "< 500": [],
    "500 - 800": [],
    "800 - 1200": [],
    "1200 - 1600": [],
    "1600 - 2000": [],
    "2000 - 2500": [],
    "2500 - 3000": [],
    "3000+": []
}

for r, acc, u in pairs:
    if r < 500: brackets["< 500"].append((r, acc))
    elif r < 800: brackets["500 - 800"].append((r, acc))
    elif r < 1200: brackets["800 - 1200"].append((r, acc))
    elif r < 1600: brackets["1200 - 1600"].append((r, acc))
    elif r < 2000: brackets["1600 - 2000"].append((r, acc))
    elif r < 2500: brackets["2000 - 2500"].append((r, acc))
    elif r < 3000: brackets["2500 - 3000"].append((r, acc))
    else: brackets["3000+"].append((r, acc))

print("\n--- EXPECTED ACCURACY BY PLAYER RATING BRACKET ---")
for b, data in brackets.items():
    if not data: continue
    avg_r = sum(x[0] for x in data) / len(data)
    avg_acc = sum(x[1] for x in data) / len(data)
    print(f"{b:<15} ({len(data):>4} evals): Avg Player Rating = {avg_r:>4.0f} | Avg Accuracy = {avg_acc:5.1f}%")
