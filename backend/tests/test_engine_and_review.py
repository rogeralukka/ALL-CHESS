import os
import pytest
import chess
from app.config import settings
from app.services.classifier import classify_move
from app.services.engine_service import (
    analyze_position,
    analyze_game_moves_full,
    get_stockfish_executable_path,
    generate_line_why_template,
    BOOK_PREFIXES,
    BOOK_POSITION_EPDS
)
from app.models.game import Game as GameModel


def has_stockfish() -> bool:
    try:
        path = get_stockfish_executable_path()
        return bool(path and os.path.exists(path))
    except Exception:
        return False


def test_move_classification_known_positions():
    # 1. Standard opening move in book
    book_cls = classify_move(
        eval_before_pawns=0.2,
        eval_after_pawns=0.2,
        color='w',
        is_book=True
    )
    assert book_cls == 'book'

    # 2. Known Blunder: White goes from comfortably winning (+3.5) to losing (-3.5)
    blunder_cls = classify_move(
        eval_before_pawns=3.5,
        eval_after_pawns=-3.5,
        color='w',
        is_book=False
    )
    assert blunder_cls == 'blunder'

    # 3. Brilliant / Great move: Tactical sacrifice with high winning eval and clear gap to second line
    brilliant_cls = classify_move(
        eval_before_pawns=2.0,
        eval_after_pawns=3.0,
        color='w',
        is_sacrifice=True,
        gap_to_second_win_pct=8.0,
        is_top_engine_move=True
    )
    assert brilliant_cls in ('brilliant', 'great')

    # 4. Miss: Opponent blundered on previous turn and current player missed the punish
    miss_cls = classify_move(
        eval_before_pawns=3.0,
        eval_after_pawns=0.5,
        color='w',
        opponent_just_made_mistake=True,
        best_wins_material_or_mate=True
    )
    assert miss_cls == 'miss'

    # 5. Best move
    best_cls = classify_move(
        eval_before_pawns=0.5,
        eval_after_pawns=0.5,
        color='w',
        is_top_engine_move=True
    )
    assert best_cls == 'best'

    # 6. Checkmate move is NEVER blunder
    white_mate_cls = classify_move(
        eval_before_pawns=4.0,
        eval_after_pawns=99.0,
        color='w',
        mate_after=0,
        is_checkmate=True
    )
    assert white_mate_cls in ('best', 'great')
    assert white_mate_cls != 'blunder'

    black_mate_cls = classify_move(
        eval_before_pawns=-4.0,
        eval_after_pawns=-99.0,
        color='b',
        mate_after=0,
        is_checkmate=True
    )
    assert black_mate_cls in ('best', 'great')
    assert black_mate_cls != 'blunder'


def test_scandinavian_defense_book_moves():
    # 1. e4 d5 should both be registered as book moves in the ECO book
    board = chess.Board()
    board.push_san("e4")
    assert ("e4",) in BOOK_PREFIXES or board.epd() in BOOK_POSITION_EPDS

    board.push_san("d5")
    assert ("e4", "d5") in BOOK_PREFIXES or board.epd() in BOOK_POSITION_EPDS


@pytest.mark.skipif(not has_stockfish(), reason="Stockfish binary not installed")
def test_engine_position_api(auth_client):
    start_fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    response = auth_client.post(
        "/api/v1/engine/position",
        json={"fen": start_fen, "depth": 10, "multipv": 3}
    )
    assert response.status_code == 200
    lines = response.json()
    assert isinstance(lines, list)
    assert len(lines) == 3
    for line in lines:
        assert "move" in line
        assert "eval" in line
        assert "why" in line
        assert "pv" in line
        assert isinstance(line["pv"], list)
        assert len(line["pv"]) >= 1


def test_engine_position_rate_limiting(auth_client, monkeypatch):
    from app.routers import engine as engine_module
    monkeypatch.setattr(engine_module, "_MAX_REQUESTS_PER_WINDOW", 3)

    # Mock analyze_position to test HTTP rate limiting independent of Stockfish presence
    async def mock_analyze_position(fen, depth=14, multipv=3, time_limit=0.5):
        return [
            {"move": "e4", "eval": 0.2, "mate": None, "depth": depth, "why": "Develops pawn", "pv": ["e4", "e5"]}
        ]
    monkeypatch.setattr(engine_module, "analyze_position", mock_analyze_position)

    start_fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

    # Make 3 allowed requests
    for _ in range(3):
        res = auth_client.post(
            "/api/v1/engine/position",
            json={"fen": start_fen, "depth": 8, "multipv": 1}
        )
        assert res.status_code == 200

    # 4th request must be rate limited (429)
    blocked_res = auth_client.post(
        "/api/v1/engine/position",
        json={"fen": start_fen, "depth": 8, "multipv": 1}
    )
    assert blocked_res.status_code == 429
    assert blocked_res.json()["error"] == "TooManyRequests"


def test_game_analyze_flow_mocked(auth_client, test_user, db_session, monkeypatch):
    async def mock_analyze_game(moves_list, depth=16, time_per_move=0.3, is_user_white=True, *args, **kwargs):
        on_progress = kwargs.get('on_progress')
        if on_progress:
            on_progress(50)
            on_progress(100)
        analyzed = []
        for idx, m in enumerate(moves_list):
            item = dict(m)
            item["classification"] = "best"
            item["eval"] = {
                "eval": 0.25,
                "mate": None,
                "bestMove": item.get("san", "e4"),
                "winPct": 51.5,
                "why": "Best line",
                "lines": []
            }
            analyzed.append(item)
        return {
            "moves": analyzed,
            "accuracy": {"white": 88.5, "black": 82.0},
            "estimatedRating": {"white": 1950, "black": 1750},
            "phaseGrades": {"opening": "A", "middlegame": "B", "tactics": "A", "endgame": "N/A"}
        }

    monkeypatch.setattr("app.routers.games.analyze_game_moves_full", mock_analyze_game)

    # 1. Create a game for user
    game_id = "test-game-for-analysis"
    db_game = GameModel(
        id=game_id,
        user_id=test_user.id,
        source="online",
        platform="chesscom",
        pgn="1. e4 e5 2. Nf3 Nc6",
        white={"username": test_user.username, "rating": 1200},
        black={"username": "Opponent", "rating": 1200},
        result="1-0",
        date="2026-10-25T12:00:00Z",
        time_control="10 min",
        speed="rapid",
        opening={"eco": "C44", "name": "King's Pawn Game"},
        moves=[
            {"san": "e4", "from": "e2", "to": "e4", "color": "w", "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1", "moveNumber": 1},
            {"san": "e5", "from": "e7", "to": "e5", "color": "b", "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2", "moveNumber": 1},
            {"san": "Nf3", "from": "g1", "to": "f3", "color": "w", "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2", "moveNumber": 2},
            {"san": "Nc6", "from": "b8", "to": "c6", "color": "b", "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3", "moveNumber": 2},
        ],
        is_user_white=True
    )
    db_session.add(db_game)
    db_session.commit()

    # 2. Trigger analysis
    analyze_res = auth_client.post(f"/api/v1/games/{game_id}/analyze")
    assert analyze_res.status_code == 200
    data = analyze_res.json()
    assert "jobId" in data
    job_id = data["jobId"]

    # 3. Poll job status
    job_res = auth_client.get(f"/api/v1/jobs/{job_id}")
    assert job_res.status_code == 200
    job_data = job_res.json()
    assert job_data["status"] == "done"
    assert job_data["progress"] == 100

    # 4. Confirm game has evals, accuracy, ratings, phaseGrades
    game_res = auth_client.get(f"/api/v1/games/{game_id}")
    assert game_res.status_code == 200
    analyzed_game = game_res.json()
    assert analyzed_game["accuracy"] is not None
    assert analyzed_game["estimatedRating"] is not None
    assert analyzed_game["phaseGrades"] is not None

    moves = analyzed_game["moves"]
    for m in moves:
        assert m["eval"] is not None
        assert "eval" in m["eval"]
        assert "bestMove" in m["eval"]

    # 5. Check /stats/phases and /stats/insights now return real values
    phases_res = auth_client.get("/api/v1/stats/phases")
    assert phases_res.status_code == 200
    phases = phases_res.json()
    assert "opening" in phases
    assert "middlegame" in phases
    assert "endgame" in phases

    insights_res = auth_client.get("/api/v1/stats/insights")
    assert insights_res.status_code == 200
    insights = insights_res.json()
    assert len(insights["strengths"]) > 0 or len(insights["weaknesses"]) > 0


@pytest.mark.skipif(not has_stockfish(), reason="Stockfish binary not installed")
@pytest.mark.asyncio
async def test_real_engine_smoke():
    test_moves = [
        {"san": "e4", "from": "e2", "to": "e4", "color": "w", "moveNumber": 1},
        {"san": "e5", "from": "e7", "to": "e5", "color": "b", "moveNumber": 1},
        {"san": "Nf3", "from": "g1", "to": "f3", "color": "w", "moveNumber": 2},
        {"san": "Nc6", "from": "b8", "to": "c6", "color": "b", "moveNumber": 2},
        {"san": "Bc4", "from": "f1", "to": "c4", "color": "w", "moveNumber": 3},
    ]

    result = await analyze_game_moves_full(test_moves, depth=10, time_per_move=0.2, is_user_white=True)
    assert "moves" in result
    assert "accuracy" in result
    assert "estimatedRating" in result
    assert "phaseGrades" in result

    assert len(result["moves"]) == 5
    for m in result["moves"]:
        assert m["classification"] is not None
        assert m["eval"] is not None
        assert -10.0 <= m["eval"]["eval"] <= 10.0


def test_generate_line_why_piece_aware():
    # 1. Bishop development preparing castling
    board_e4e5 = chess.Board("rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2")
    why_be2 = generate_line_why_template(board_e4e5, chess.Move.from_uci("f1e2"))
    assert why_be2.lower() == "develops the bishop to e2 and prepares castling."

    # 2. Knight development preparing castling
    why_nf3 = generate_line_why_template(board_e4e5, chess.Move.from_uci("g1f3"))
    assert why_nf3.lower() == "develops the knight to f3 and prepares castling."

    # 3. Central pawn move
    board_init = chess.Board()
    why_e4 = generate_line_why_template(board_init, chess.Move.from_uci("e2e4"))
    assert why_e4 == "Claims central space with the pawn on e4."

    # 4. Castling move
    board_ready_castle = chess.Board("rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4")
    why_castle = generate_line_why_template(board_ready_castle, chess.Move.from_uci("e1g1"))
    assert "castle" in why_castle.lower()

    # 5. Capture move
    board_cap = chess.Board("rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2")
    why_cap = generate_line_why_template(board_cap, chess.Move.from_uci("e4d5"))
    assert "captures pawn on d5" in why_cap.lower()

    # 6. Quiet move without concrete theme returns empty string
    board_quiet = chess.Board("rnbqkbnr/pppppppp/8/8/8/7P/PPPPPPP1/RNBQKBNR b KQkq - 0 1")
    # Black pushes h6
    why_quiet = generate_line_why_template(board_quiet, chess.Move.from_uci("h7h6"))
    assert why_quiet == ""
