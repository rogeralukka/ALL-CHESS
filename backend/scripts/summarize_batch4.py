import json
from collections import Counter

with open("backend/.cache/game_by_game_batch4.json", "r", encoding="utf-8") as f:
    games = json.load(f)

users = ["ishowspeed", "gyrostomp", "loveandpeach", "nickorlando24"]
by_user = {u: [g for g in games if g["user"] == u] for u in users}

CLASS_ORDER = ["brilliant", "great", "best", "excellent", "good", "book", "forced", "inaccuracy", "mistake", "miss", "blunder"]

total_counts = Counter()
total_arrows = Counter()
total_squares = Counter()
total_moves = 0

for g in games:
    for color in ("white", "black"):
        for cls, count in g["counts"][color].items():
            total_counts[cls] += count
            total_moves += count
        for kind, count in g["arrows"][color].items():
            total_arrows[kind] += count
        for kind, count in g["squares"][color].items():
            total_squares[kind] += count

print(f"Total Batch 4 Games: {len(games)}")
print(f"Total Moves: {total_moves}")

print("\n--- Move Classification Breakdown ---")
for cls in CLASS_ORDER:
    pct = total_counts[cls] / total_moves * 100
    print(f"  {cls:<12}: {total_counts[cls]:>5} ({pct:4.1f}%)")

print("\n--- Visual Annotations Breakdown ---")
for kind, count in total_arrows.items():
    print(f"  Arrow {kind:<10}: {count:>5}")
for kind, count in total_squares.items():
    print(f"  Square {kind:<9}: {count:>5}")

# Breakdown by tier
print("\n--- Accuracy & Rating Summary by Account Tier ---")
print("| Account | Elo Tier | Games | Avg CC Acc (W/B) | Avg Our Acc (W/B) | Avg Error (MAE) | Total Br/Gr/Bl |")
for u in users:
    u_games = by_user[u]
    if not u_games: continue
    avg_cc_w = sum(g["cc"]["white"] for g in u_games) / len(u_games)
    avg_cc_b = sum(g["cc"]["black"] for g in u_games) / len(u_games)
    avg_our_w = sum(g["ours"]["white"] for g in u_games) / len(u_games)
    avg_our_b = sum(g["ours"]["black"] for g in u_games) / len(u_games)
    avg_mae = sum(g["mae"] for g in u_games) / len(u_games)
    br = sum(g["counts"]["white"]["brilliant"] + g["counts"]["black"]["brilliant"] for g in u_games)
    gr = sum(g["counts"]["white"]["great"] + g["counts"]["black"]["great"] for g in u_games)
    bl = sum(g["counts"]["white"]["blunder"] + g["counts"]["black"]["blunder"] for g in u_games)
    print(f"| {u:<13} | {len(u_games):>5} | {avg_cc_w:4.1f} / {avg_cc_b:4.1f} | {avg_our_w:4.1f} / {avg_our_b:4.1f} | {avg_mae:4.2f} | {br}/{gr}/{bl} |")

# Sample Brilliant moves
brilliants = []
for g in games:
    for km in g["key_moves"]:
        if km["cls"] == "brilliant":
            brilliants.append((g["id"], g["user"], km))

print(f"\nTotal Brilliant Moves in Batch 4: {len(brilliants)}")
for gid, u, km in brilliants[:8]:
    print(f"  [{u:<13}] Game {gid} | Ply {km['ply']:>2} ({km['color']}) {km['san']:<7} | Coach: {km['coach']} | Explain: {km['explain']} | Arrows: {km['arrows']}")
