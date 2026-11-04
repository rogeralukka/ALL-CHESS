import json
from collections import Counter

with open("backend/.cache/game_by_game_100_batch3.json", "r", encoding="utf-8") as f:
    games = json.load(f)

hikaru = [g for g in games if g["user"] == "hikaru"]
nick = [g for g in games if g["user"] == "nickorlando24"]

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

print(f"Total batch 3 games: {len(games)}")
print(f"Total moves: {total_moves}")
print("\nClassification breakdown:")
for cls in CLASS_ORDER:
    pct = total_counts[cls] / total_moves * 100
    print(f"  {cls:<12}: {total_counts[cls]:>5} ({pct:4.1f}%)")

print("\nArrow breakdown:")
for kind, count in total_arrows.items():
    print(f"  {kind:<12}: {count:>5}")

print("\nSquare breakdown:")
for kind, count in total_squares.items():
    print(f"  {kind:<12}: {count:>5}")

brilliants = []
for g in games:
    for km in g["key_moves"]:
        if km["cls"] == "brilliant":
            brilliants.append((g["id"], g["user"], km))

print(f"\nTotal brilliant moves in Batch 3: {len(brilliants)}")
print("Sample brilliant moves:")
for gid, u, km in brilliants[:8]:
    print(f"  [{u:<12}] Game {gid} | Ply {km['ply']:>2} ({km['color']}) {km['san']:<7} | Coach: {km['coach']} | Explain: {km['explain']} | Arrows: {km['arrows']}")

print("\n--- Hikaru Sample Table (10 games) ---")
print("| Game ID | Opponent (Rating) | Plies | CC Acc (W/B) | Our Acc (W/B) | Est. Rating (W/B) | Diff | Br/Gr/Be/In/Mi/Bl |")
for g in hikaru[:10]:
    w_opp = f"{g['white_user']} ({g['white_rating']})"
    b_opp = f"{g['black_user']} ({g['black_rating']})"
    opp = b_opp if "hikaru" in g['white_user'].lower() else w_opp
    pl = g["plies"]
    cc = f"{g['cc']['white']:.1f}/{g['cc']['black']:.1f}"
    our = f"{g['ours']['white']:.1f}/{g['ours']['black']:.1f}"
    est_r = f"{g['estimated_ratings']['white']}/{g['estimated_ratings']['black']}"
    mae = f"{g['mae']:.2f}"
    cw, cb = g["counts"]["white"], g["counts"]["black"]
    br = cw["brilliant"] + cb["brilliant"]
    gr = cw["great"] + cb["great"]
    be = cw["best"] + cb["best"]
    ina = cw["inaccuracy"] + cb["inaccuracy"]
    mis = cw["mistake"] + cb["mistake"] + cw["miss"] + cb["miss"]
    bl = cw["blunder"] + cb["blunder"]
    counts_str = f"{br}/{gr}/{be}/{ina}/{mis}/{bl}"
    print(f"| {g['id']} | {opp[:22]} | {pl} | {cc} | {our} | {est_r} | {mae} | {counts_str} |")

print("\n--- NickOrlando24 Sample Table (10 games) ---")
print("| Game ID | Opponent (Rating) | Plies | CC Acc (W/B) | Our Acc (W/B) | Est. Rating (W/B) | Diff | Br/Gr/Be/In/Mi/Bl |")
for g in nick[:10]:
    w_opp = f"{g['white_user']} ({g['white_rating']})"
    b_opp = f"{g['black_user']} ({g['black_rating']})"
    opp = b_opp if "nickorlando24" in g['white_user'].lower() else w_opp
    pl = g["plies"]
    cc = f"{g['cc']['white']:.1f}/{g['cc']['black']:.1f}"
    our = f"{g['ours']['white']:.1f}/{g['ours']['black']:.1f}"
    est_r = f"{g['estimated_ratings']['white']}/{g['estimated_ratings']['black']}"
    mae = f"{g['mae']:.2f}"
    cw, cb = g["counts"]["white"], g["counts"]["black"]
    br = cw["brilliant"] + cb["brilliant"]
    gr = cw["great"] + cb["great"]
    be = cw["best"] + cb["best"]
    ina = cw["inaccuracy"] + cb["inaccuracy"]
    mis = cw["mistake"] + cb["mistake"] + cw["miss"] + cb["miss"]
    bl = cw["blunder"] + cb["blunder"]
    counts_str = f"{br}/{gr}/{be}/{ina}/{mis}/{bl}"
    print(f"| {g['id']} | {opp[:22]} | {pl} | {cc} | {our} | {est_r} | {mae} | {counts_str} |")
