import json

with open("backend/.cache/game_by_game_149_analysis.json", "r", encoding="utf-8") as f:
    games = json.load(f)

print(f"Total games analyzed: {len(games)}")

# 1. Roger's 37 games summary
roger_games = [g for g in games if g["user"] == "rogeralukka"]
print(f"\n--- Roger's Games ({len(roger_games)} games) ---")
for g in roger_games[:10]:
    cw, cb = g["cc"]["white"], g["cc"]["black"]
    ow, ob = g["ours"]["white"], g["ours"]["black"]
    dw, db = g["diff"]["white"], g["diff"]["black"]
    print(f"ID {g['id']} ({g['plies']} plies, {g['time_class']}): CC {cw:.1f}/{cb:.1f} vs Ours {ow:.1f}/{ob:.1f} (diff {dw:+.1f}/{db:+.1f}, MAE {g['mae']:.2f})")

# 2. Top 5 Closest Matching Games across the dataset
sorted_by_mae = sorted(games, key=lambda g: g["mae"])
print("\n--- Top 5 Closest Matching Games to Chess.com ---")
for g in sorted_by_mae[:5]:
    cw, cb = g["cc"]["white"], g["cc"]["black"]
    ow, ob = g["ours"]["white"], g["ours"]["black"]
    print(f"User: {g['user']:<12} | ID: {g['id']} ({g['plies']} plies) | CC: {cw:.1f}/{cb:.1f} | Ours: {ow:.1f}/{ob:.1f} | MAE: {g['mae']:.2f}")

# 3. Top 5 Outliers (Largest Error)
print("\n--- Top 5 Outlier Games (Largest Difference vs Chess.com) ---")
for g in sorted_by_mae[-5:]:
    cw, cb = g["cc"]["white"], g["cc"]["black"]
    ow, ob = g["ours"]["white"], g["ours"]["black"]
    dw, db = g["diff"]["white"], g["diff"]["black"]
    print(f"User: {g['user']:<12} | ID: {g['id']} ({g['plies']} plies) | CC: {cw:.1f}/{cb:.1f} | Ours: {ow:.1f}/{ob:.1f} | Diff: {dw:+.1f}/{db:+.1f} | MAE: {g['mae']:.2f}")

# 4. Brilliant moves across the dataset
brilliants = []
for g in games:
    for km in g["key_moves"]:
        if km["cls"] == "brilliant":
            brilliants.append((g["id"], g["user"], km))

print(f"\nTotal Brilliant moves identified across 149 games: {len(brilliants)}")
for gid, u, km in brilliants[:8]:
    print(f"  Game {gid} ({u}): Ply {km['ply']} {km['color']} {km['san']} -> {km['coach']} (Explain: {km['explain']}, Arrows: {km['arrows']})")
