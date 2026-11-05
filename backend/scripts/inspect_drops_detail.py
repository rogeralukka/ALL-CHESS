import json

data = json.load(open('backend/.cache/drops_626_games.json', encoding='utf-8'))

for g in data:
    if g['user'] == 'gyrostomp':
        w_d = g['white_drops']
        b_d = g['black_drops']
        print(f"Gyrostomp Game {g['id']}:")
        print(f"  White (CC {g['cc']['white']}): avg drop {sum(w_d)/len(w_d):.2f}, max {max(w_d)}")
        print(f"    first 10 drops: {w_d[:10]}")
        print(f"    first 10 classes: {g['white_classes'][:10]}")
        print(f"  Black (CC {g['cc']['black']}): avg drop {sum(b_d)/len(b_d):.2f}, max {max(b_d)}")
        print(f"    first 10 drops: {b_d[:10]}")
        print(f"    first 10 classes: {g['black_classes'][:10]}")
        break

for g in data:
    if g['user'] == 'hikaru':
        w_d = g['white_drops']
        b_d = g['black_drops']
        print(f"\nHikaru Game {g['id']}:")
        print(f"  White (CC {g['cc']['white']}): avg drop {sum(w_d)/len(w_d):.2f}, max {max(w_d)}")
        print(f"    first 10 drops: {w_d[:10]}")
        print(f"  Black (CC {g['cc']['black']}): avg drop {sum(b_d)/len(b_d):.2f}, max {max(b_d)}")
        print(f"    first 10 drops: {b_d[:10]}")
        break
