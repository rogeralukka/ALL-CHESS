import json
import time
from pathlib import Path
from app.models.game import Game as GameModel
from app.models.friend import Friend
from app.services.pgn_parser import parse_pgn_game

FIXTURES_DIR = Path(__file__).resolve().parent / "fixtures"


def _load_fixture_pgn(game_id: str) -> str:
    with open(FIXTURES_DIR / "parity_three_games.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    return data[game_id]["pgn"]


def _enrich_moves(moves):
    annotated = []
    for idx, m in enumerate(moves):
        m_copy = dict(m)
        f_sq = m.get("from", "e2")
        t_sq = m.get("to", "e4")
        m_copy["classification"] = "best" if idx % 2 == 0 else "good"
        m_copy["eval"] = {"eval": 0.5, "mate": None}
        m_copy["coach_comment"] = f"{m.get('san')} is a solid move."
        m_copy["annotations"] = {
            "tint": "best",
            "arrows": [{"from": f_sq, "to": t_sq, "color": "green", "kind": "best"}],
            "squares": [{"square": t_sq, "color": "green", "kind": "target", "reason": "Target square"}],
            "best_move": {
                "uci": f"{f_sq}{t_sq}",
                "san": m.get("san"),
                "from": f_sq,
                "to": t_sq,
            },
            "pv": [m.get("san", "e4"), "e5", "Nf3"],
        }
        annotated.append(m_copy)
    return annotated


def test_games_lite_payload_shape_and_flags(auth_client, test_user, db_session):
    mate_pgn = _load_fixture_pgn("186073066724")  # Checkmate game (36. Qh4#)
    parsed_mate = parse_pgn_game(mate_pgn, target_user_names=[test_user.username])
    annotated_mate_moves = _enrich_moves(parsed_mate["moves"])

    resign_pgn = _load_fixture_pgn("185643420616")  # Resignation game
    parsed_resign = parse_pgn_game(resign_pgn, target_user_names=[test_user.username])
    annotated_resign_moves = _enrich_moves(parsed_resign["moves"])

    g_mate = GameModel(
        id="game-mate-001",
        user_id=test_user.id,
        source="online",
        platform="chesscom",
        pgn=parsed_mate["pgn"],
        white=parsed_mate["white"],
        black=parsed_mate["black"],
        result=parsed_mate["result"],
        date="2026-10-28T10:00:00Z",
        time_control="600",
        speed="rapid",
        opening=parsed_mate["opening"],
        moves=annotated_mate_moves,
        is_user_white=parsed_mate["isUserWhite"],
        accuracy={"white": 88.5, "black": 65.2},
        termination="rogeralukka won by checkmate",
        book_end=2,
    )

    g_resign = GameModel(
        id="game-resign-002",
        user_id=test_user.id,
        source="online",
        platform="chesscom",
        pgn=parsed_resign["pgn"],
        white=parsed_resign["white"],
        black=parsed_resign["black"],
        result=parsed_resign["result"],
        date="2026-10-20T10:00:00Z",
        time_control="1200",
        speed="rapid",
        opening=parsed_resign["opening"],
        moves=annotated_resign_moves,
        is_user_white=parsed_resign["isUserWhite"],
        accuracy={"white": 53.0, "black": 64.0},
        termination="rogeralukka won by resignation",
        book_end=1,
    )

    db_session.add_all([g_mate, g_resign])
    db_session.commit()

    # Query with lite=true
    resp_lite = auth_client.get("/api/v1/games?lite=true")
    assert resp_lite.status_code == 200
    lite_data = resp_lite.json()
    assert len(lite_data) == 2

    mate_item = next(g for g in lite_data if g["id"] == "game-mate-001")
    resign_item = next(g for g in lite_data if g["id"] == "game-resign-002")

    # 1. Lite response MUST NOT have 'moves' or 'pgn'
    assert "moves" not in mate_item
    assert "moves" not in resign_item
    assert "pgn" not in mate_item
    assert "pgn" not in resign_item

    # 2. Lite response MUST have 'moveCount' and 'endsInMate'
    assert "moveCount" in mate_item
    assert mate_item["moveCount"] == len(annotated_mate_moves)  # 71 half-moves
    assert mate_item["endsInMate"] is True

    assert "moveCount" in resign_item
    assert resign_item["moveCount"] == len(annotated_resign_moves)  # 58 half-moves
    assert resign_item["endsInMate"] is False

    # 3. bookEnd uses stored column without recomputing
    assert mate_item["bookEnd"] == 2
    assert resign_item["bookEnd"] == 1

    # 4. Other fields preserved
    assert mate_item["speed"] == "rapid"
    assert mate_item["result"] == "1-0"
    assert mate_item["termination"] == "rogeralukka won by checkmate"
    assert mate_item["white"]["username"] == parsed_mate["white"]["username"]


def test_games_lite_payload_size_reduction(auth_client, test_user, db_session):
    resign_pgn = _load_fixture_pgn("185643420616")
    parsed = parse_pgn_game(resign_pgn, target_user_names=[test_user.username])
    annotated_moves = _enrich_moves(parsed["moves"])

    # Seed 5 annotated fixture games
    for i in range(5):
        g = GameModel(
            id=f"game-size-{i:03d}",
            user_id=test_user.id,
            source="online",
            platform="chesscom",
            pgn=parsed["pgn"],
            white=parsed["white"],
            black=parsed["black"],
            result="0-1",
            date=f"2026-10-{20+i:02d}T10:00:00Z",
            time_control="1200",
            speed="rapid",
            opening=parsed["opening"],
            moves=annotated_moves,
            is_user_white=parsed["isUserWhite"],
            accuracy={"white": 53.0, "black": 64.0},
        )
        db_session.add(g)
    db_session.commit()

    resp_full = auth_client.get("/api/v1/games?lite=false")
    assert resp_full.status_code == 200
    full_bytes = len(resp_full.content)

    resp_lite = auth_client.get("/api/v1/games?lite=true")
    assert resp_lite.status_code == 200
    lite_bytes = len(resp_lite.content)

    ratio = full_bytes / lite_bytes
    print(f"\nSize test: full={full_bytes} B, lite={lite_bytes} B, ratio={ratio:.1f}x smaller")
    assert ratio >= 10.0, f"Expected at least 10x size reduction, got {ratio:.2f}x ({full_bytes} B vs {lite_bytes} B)"


def test_games_lite_limit_and_order(auth_client, test_user, db_session):
    resign_pgn = _load_fixture_pgn("185643420616")
    parsed = parse_pgn_game(resign_pgn, target_user_names=[test_user.username])

    for i in range(10):
        g = GameModel(
            id=f"game-limit-{i:02d}",
            user_id=test_user.id,
            source="online",
            platform="chesscom",
            pgn=parsed["pgn"],
            white={"username": test_user.username, "rating": 1000 + i},
            black={"username": "Opponent", "rating": 1000},
            result="1-0",
            date=f"2026-10-{10+i:02d}T10:00:00Z",
            time_control="600",
            speed="rapid",
            opening=parsed["opening"],
            moves=parsed["moves"],
            is_user_white=True,
        )
        db_session.add(g)
    db_session.commit()

    # Request limit=3
    resp = auth_client.get("/api/v1/games?lite=true&limit=3")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 3

    # Must be ordered by date desc
    dates = [d["date"] for d in data]
    assert dates == sorted(dates, reverse=True)
    assert data[0]["id"] == "game-limit-09"
    assert data[1]["id"] == "game-limit-08"
    assert data[2]["id"] == "game-limit-07"


def test_games_full_mode_preserves_moves_and_compatibility(auth_client, test_user, db_session):
    resign_pgn = _load_fixture_pgn("185643420616")
    parsed = parse_pgn_game(resign_pgn, target_user_names=[test_user.username])
    annotated_moves = _enrich_moves(parsed["moves"])

    g = GameModel(
        id="game-compat-001",
        user_id=test_user.id,
        source="online",
        platform="chesscom",
        pgn=parsed["pgn"],
        white={"username": test_user.username, "rating": 1200},
        black={"username": "Opponent", "rating": 1150},
        result="1-0",
        date="2026-10-25T12:00:00Z",
        time_control="600",
        speed="rapid",
        opening=parsed["opening"],
        moves=annotated_moves,
        is_user_white=True,
    )
    db_session.add(g)
    db_session.commit()

    # Default request without lite parameter
    resp_default = auth_client.get("/api/v1/games")
    assert resp_default.status_code == 200
    games = resp_default.json()
    assert len(games) >= 1
    found = next(x for x in games if x["id"] == "game-compat-001")
    assert "moves" in found
    assert len(found["moves"]) > 0
    assert "pgn" in found


def test_gzip_compression_enabled(auth_client, test_user, db_session):
    resign_pgn = _load_fixture_pgn("185643420616")
    parsed = parse_pgn_game(resign_pgn, target_user_names=[test_user.username])
    annotated_moves = _enrich_moves(parsed["moves"])

    # Create several games so JSON response exceeds GZipMiddleware minimum_size (1000 bytes)
    for i in range(5):
        g = GameModel(
            id=f"game-gzip-{i:02d}",
            user_id=test_user.id,
            source="online",
            platform="chesscom",
            pgn=parsed["pgn"],
            white={"username": test_user.username, "rating": 1200},
            black={"username": "Opponent", "rating": 1200},
            result="1-0",
            date=f"2026-10-{10+i:02d}T12:00:00Z",
            time_control="600",
            speed="rapid",
            opening=parsed["opening"],
            moves=annotated_moves,
            is_user_white=True,
        )
        db_session.add(g)
    db_session.commit()

    resp = auth_client.get("/api/v1/games", headers={"Accept-Encoding": "gzip"})
    assert resp.status_code == 200
    assert resp.headers.get("content-encoding") == "gzip"


def test_benchmark_50_annotated_games_timings(auth_client, test_user, db_session):
    """Measures and asserts local response times and payload sizes with 50 annotated games."""
    resign_pgn = _load_fixture_pgn("185643420616")
    parsed = parse_pgn_game(resign_pgn, target_user_names=[test_user.username])
    annotated_moves = _enrich_moves(parsed["moves"])

    # Seed 50 annotated games
    games = []
    for i in range(50):
        g = GameModel(
            id=f"bench-game-{i:03d}",
            user_id=test_user.id,
            source="online",
            platform="chesscom",
            pgn=parsed["pgn"],
            white={"username": test_user.username, "rating": 1000 + (i * 5)},
            black={"username": f"Opponent-{i}", "rating": 980 + (i * 4)},
            result="1-0" if i % 2 == 0 else "0-1",
            date=f"2026-09-01T{i%24:02d}:00:00Z",
            time_control="600",
            speed="rapid" if i % 3 == 0 else ("blitz" if i % 3 == 1 else "bullet"),
            opening=parsed["opening"],
            moves=annotated_moves,
            is_user_white=True,
            accuracy={"white": 82.0, "black": 71.0},
            move_count=len(annotated_moves),
            ends_in_mate=False,
            book_end=2,
        )
        games.append(g)
    db_session.add_all(games)

    # Seed 5 friends
    for i in range(5):
        f = Friend(
            id=f"bench-friend-{i}",
            user_id=test_user.id,
            username=f"friend_{i}",
            platform="chesscom",
            rating=1100 + i * 20,
            ratings={"rapid": 1100 + i * 20, "blitz": 1050, "bullet": 1000},
            online=(i % 2 == 0),
        )
        db_session.add(f)
    db_session.commit()

    # 1. Full GET /games
    t0 = time.perf_counter()
    resp_full = auth_client.get("/api/v1/games?lite=false")
    t_full = time.perf_counter() - t0
    full_size = len(resp_full.content)

    # 2. Lite GET /games?lite=true
    t0 = time.perf_counter()
    resp_lite = auth_client.get("/api/v1/games?lite=true")
    t_lite = time.perf_counter() - t0
    lite_size = len(resp_lite.content)

    # 3. GET /stats/ratings
    t0 = time.perf_counter()
    resp_ratings = auth_client.get("/api/v1/stats/ratings")
    t_ratings = time.perf_counter() - t0

    # 4. GET /puzzles/daily
    t0 = time.perf_counter()
    resp_puzzle = auth_client.get("/api/v1/puzzles/daily")
    t_puzzle = time.perf_counter() - t0

    # 5. GET /friends
    t0 = time.perf_counter()
    resp_friends = auth_client.get("/api/v1/friends")
    t_friends = time.perf_counter() - t0

    # 6. GET /learn/stages
    t0 = time.perf_counter()
    resp_stages = auth_client.get("/api/v1/learn/stages")
    t_stages = time.perf_counter() - t0

    assert resp_full.status_code == 200
    assert resp_lite.status_code == 200
    assert resp_ratings.status_code == 200
    assert resp_puzzle.status_code == 200
    assert resp_friends.status_code == 200
    assert resp_stages.status_code == 200

    # Lite payload must be at least 10x smaller (we expect ~80x smaller)
    ratio = full_size / lite_size
    assert ratio >= 10.0, f"Expected ratio >= 10.0, got {ratio:.1f}x"

    # Local response times for all endpoints should be fast (< 250ms locally)
    assert t_lite < 0.250, f"GET /games?lite=true took {t_lite*1000:.1f}ms"
    assert t_ratings < 0.250, f"GET /stats/ratings took {t_ratings*1000:.1f}ms"
    assert t_puzzle < 0.250, f"GET /puzzles/daily took {t_puzzle*1000:.1f}ms"
    assert t_friends < 0.250, f"GET /friends took {t_friends*1000:.1f}ms"
    assert t_stages < 0.250, f"GET /learn/stages took {t_stages*1000:.1f}ms"

    print("\n=======================================================")
    print("--- BENCHMARK RESULTS (50 Annotated Games) ---")
    print(f"GET /games (full):       {full_size:>10} B | {t_full*1000:>6.1f} ms")
    print(f"GET /games (lite=true):  {lite_size:>10} B | {t_lite*1000:>6.1f} ms  (Ratio: {ratio:.1f}x smaller)")
    print(f"GET /stats/ratings:      {len(resp_ratings.content):>10} B | {t_ratings*1000:>6.1f} ms")
    print(f"GET /puzzles/daily:      {len(resp_puzzle.content):>10} B | {t_puzzle*1000:>6.1f} ms")
    print(f"GET /friends:            {len(resp_friends.content):>10} B | {t_friends*1000:>6.1f} ms")
    print(f"GET /learn/stages:       {len(resp_stages.content):>10} B | {t_stages*1000:>6.1f} ms")
    print("=======================================================\n")
