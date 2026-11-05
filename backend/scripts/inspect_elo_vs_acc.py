import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(HERE)
CACHE_DIR = os.path.join(BACKEND_DIR, ".cache")

games = json.load(open(os.path.join(CACHE_DIR, "drops_all_1226_games.json"), encoding='utf-8'))

print(f"Total games: {len(games)}")

# Let's inspect the actual player Elo on Chess.com vs the accuracy
by_account = {}
for g in games:
    u = g['user']
    if u not in by_account:
        by_account[u] = {'w_elo': [], 'b_elo': [], 'w_acc': [], 'b_acc': []}
    by_account[u]['w_elo'].append(g.get('white_rating'))
    by_account[u]['b_elo'].append(g.get('black_rating'))
    by_account[u]['w_acc'].append(g['cc']['white'])
    by_account[u]['b_acc'].append(g['cc']['black'])

print("\n--- ACTUAL PLAYER RATINGS ON CHESS.COM VS CHESS.COM ACCURACY ---")
for u, data in by_account.items():
    valid_w_elo = [e for e in data['w_elo'] if e is not None]
    valid_b_elo = [e for e in data['b_elo'] if e is not None]
    all_elo = valid_w_elo + valid_b_elo
    avg_elo = sum(all_elo) / len(all_elo) if all_elo else 0
    all_acc = data['w_acc'] + data['b_acc']
    avg_acc = sum(all_acc) / len(all_acc)
    print(f"{u:<15}: Actual Player Elo on Chess.com = {avg_elo:5.0f} | Chess.com Acc = {avg_acc:5.1f}%")
