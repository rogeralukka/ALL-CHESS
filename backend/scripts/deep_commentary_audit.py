import json
import os
from collections import Counter

CACHE_DIR = "backend/.cache"
files = [
    os.path.join(CACHE_DIR, "game_by_game_149_analysis.json"),
    os.path.join(CACHE_DIR, "game_by_game_200_batch2.json"),
    os.path.join(CACHE_DIR, "game_by_game_100_batch3.json"),
]

all_games = []
for fpath in files:
    if os.path.exists(fpath):
        with open(fpath, "r", encoding="utf-8") as f:
            all_games.extend(json.load(f))

print(f"Total games loaded: {len(all_games)}")

# Audit key moves commentary & explain sentences
explain_patterns = Counter()
coach_patterns = Counter()
motifs = Counter()

sample_by_motif = {}

for g in all_games:
    for km in g.get("key_moves", []):
        expl = km.get("explain") or ""
        coach = km.get("coach") or ""
        cls = km.get("cls")

        # Categorize explain motif
        if "forks" in expl:
            motifs["fork"] += 1
            if "fork" not in sample_by_motif: sample_by_motif["fork"] = (g["id"], km)
        elif "skewers" in expl:
            motifs["skewer"] += 1
            if "skewer" not in sample_by_motif: sample_by_motif["skewer"] = (g["id"], km)
        elif "pins" in expl:
            motifs["pin"] += 1
            if "pin" not in sample_by_motif: sample_by_motif["pin"] = (g["id"], km)
        elif "threatens mate" in expl or "allows mate" in expl:
            motifs["mate_threat"] += 1
            if "mate_threat" not in sample_by_motif: sample_by_motif["mate_threat"] = (g["id"], km)
        elif "hanging" in expl or "loses your" in expl or "wins your" in expl:
            motifs["hanging_or_loss"] += 1
            if "hanging_or_loss" not in sample_by_motif: sample_by_motif["hanging_or_loss"] = (g["id"], km)
        elif "gives check" in expl or "checking" in expl:
            motifs["check"] += 1
            if "check" not in sample_by_motif: sample_by_motif["check"] = (g["id"], km)
        elif "captures" in expl or "trades" in expl:
            motifs["capture_or_trade"] += 1
            if "capture_or_trade" not in sample_by_motif: sample_by_motif["capture_or_trade"] = (g["id"], km)
        elif "passed pawn" in expl:
            motifs["passed_pawn"] += 1
            if "passed_pawn" not in sample_by_motif: sample_by_motif["passed_pawn"] = (g["id"], km)
        elif "centre" in expl:
            motifs["centre_control"] += 1
            if "centre_control" not in sample_by_motif: sample_by_motif["centre_control"] = (g["id"], km)
        elif "develops" in expl:
            motifs["development"] += 1
            if "development" not in sample_by_motif: sample_by_motif["development"] = (g["id"], km)
        elif "open" in expl and "file" in expl:
            motifs["open_file"] += 1
            if "open_file" not in sample_by_motif: sample_by_motif["open_file"] = (g["id"], km)
        elif "sacrifice" in expl or "initiative" in expl:
            motifs["tactical_sacrifice"] += 1
            if "tactical_sacrifice" not in sample_by_motif: sample_by_motif["tactical_sacrifice"] = (g["id"], km)
        else:
            motifs["generic_classification"] += 1
            if "generic_classification" not in sample_by_motif: sample_by_motif["generic_classification"] = (g["id"], km)

print("\n--- Key Moves Tactical Commentary Motif Counts ---")
for m, c in motifs.most_common():
    print(f"  {m:<24}: {c:>5}")

print("\n--- Sample Commentary per Tactical Motif ---")
for m, (gid, km) in sample_by_motif.items():
    print(f"[{m.upper()}] Game {gid} | Ply {km['ply']} {km['san']} ({km['cls']})")
    print(f"   Coach:   {km['coach']}")
    print(f"   Explain: {km['explain']}")
    print(f"   Arrows:  {km['arrows']}\n")
