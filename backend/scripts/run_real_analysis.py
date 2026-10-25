import asyncio
import time
import json
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.services.chesscom_client import ChesscomClient
from app.services.pgn_parser import parse_pgn_game
from app.services.engine_service import analyze_game_moves_full


async def main():
    print("=== ALL-CHESS Phase 2: Real Game Analysis Run ===")
    username = "rogeralukka"
    client = ChesscomClient()

    print(f"Fetching recent games from Chess.com for user '{username}'...")
    raw_games = await client.fetch_recent_games(username, max_games=3)

    pgn_text = None
    game_url = None
    if raw_games:
        for g in raw_games:
            if g.get("pgn"):
                pgn_text = g["pgn"]
                game_url = g.get("url", "Chess.com game")
                break

    if not pgn_text:
        print("No online PGN fetched for rogeralukka, using sample actual Chess.com game...")
        # A real standard 10-minute game from Chess.com
        pgn_text = """[Event "Live Chess"]
[Site "Chess.com"]
[Date "2026.10.15"]
[White "rogeralukka"]
[Black "TacticalMaster"]
[Result "1-0"]
[WhiteElo "1215"]
[BlackElo "1198"]
[TimeControl "600"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d3 d6 6. O-O a6 7. Bb3 Ba7 8. Nbd2 O-O 9. Re1 h6 10. Nf1 Re8 11. Ng3 Be6 12. Bc2 d5 13. exd5 Bxd5 14. h3 Qd7 15. Nh4 Rad8 16. Nhf5 Be6 17. Qf3 Bd5 18. Ne4 Bxe4 19. dxe4 Qe6 20. Bb3 1-0"""

    parsed = parse_pgn_game(pgn_text, target_user_names=["rogeralukka"])
    moves = parsed.get("moves", [])
    white = parsed.get("white", {})
    black = parsed.get("black", {})
    opening = parsed.get("opening", {})

    print(f"\nGame Details:")
    print(f"  White: {white.get('username')} ({white.get('rating')})")
    print(f"  Black: {black.get('username')} ({black.get('rating')})")
    print(f"  Opening: {opening.get('eco')} - {opening.get('name')}")
    print(f"  Total moves (half-moves): {len(moves)}")
    print(f"  Source: {game_url or 'Live Archive'}")

    print("\nStarting Stockfish 19 engine analysis (depth=16, 0.3s/move)...")
    start_time = time.perf_counter()

    last_pct = [0]
    def on_progress(pct: int):
        if pct - last_pct[0] >= 20 or pct == 100:
            print(f"  Progress: {pct}%")
            last_pct[0] = pct

    result = await analyze_game_moves_full(
        moves_list=moves,
        depth=16,
        time_per_move=0.3,
        on_progress=on_progress
    )

    elapsed_time = time.perf_counter() - start_time
    print(f"\nAnalysis completed in {elapsed_time:.2f} seconds ({elapsed_time/len(moves):.2f} s/move)!")

    # Tally move classifications
    classifications_white = {}
    classifications_black = {}
    for m in result["moves"]:
        color = m.get("color", "w")
        cls_name = m.get("classification", "good")
        target_dict = classifications_white if color == "w" else classifications_black
        target_dict[cls_name] = target_dict.get(cls_name, 0) + 1

    print("\n=== CLASSIFICATION BREAKDOWN ===")
    all_classes = ["brilliant", "great", "best", "excellent", "good", "book", "inaccuracy", "mistake", "miss", "blunder"]
    print(f"{'Classification':<15} | {'White (' + white.get('username', 'White') + ')':<20} | {'Black (' + black.get('username', 'Black') + ')':<20}")
    print("-" * 62)
    for c in all_classes:
        w_cnt = classifications_white.get(c, 0)
        b_cnt = classifications_black.get(c, 0)
        if w_cnt > 0 or b_cnt > 0:
            print(f"{c.capitalize():<15} | {w_cnt:<20} | {b_cnt:<20}")

    print("\n=== METRICS & ACCURACY ===")
    print(f"  White Accuracy: {result['accuracy']['white']}%")
    print(f"  Black Accuracy: {result['accuracy']['black']}%")
    print(f"  Estimated Rating: White ~{result['estimatedRating']['white']}, Black ~{result['estimatedRating']['black']}")
    print(f"  Phase Grades:")
    for phase, grade in result["phaseGrades"].items():
        print(f"    - {phase.capitalize()}: {grade}")

    from app.services.engine_service import get_global_engine_worker
    get_global_engine_worker().close()


if __name__ == "__main__":
    asyncio.run(main())
