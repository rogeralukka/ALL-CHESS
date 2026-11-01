"""
Tests for Advanced Stats API.
Asserts:
  - Shape of all 6 endpoints (/overview, /openings, /tactics, /endgames, /strategy, /brilliant-moves)
  - Login required (401)
  - Data isolation (another user's games never leak)
  - Mode / range / color filters
  - Null rules (overview < 5 games, tactics < 3 opportunities, endgames < 3 games, strategy < 5 moves)
"""

import pytest
from datetime import datetime, timezone, timedelta
from app.models.game import Game
from app.models.user import User
from app.auth import sign_user_id
from app.config import settings


def _create_sample_game(
    user_id: str,
    game_id: str,
    speed: str = "rapid",
    is_user_white: bool = True,
    days_ago: int = 2,
    result: str = "1-0",
    opening_name: str = "Italian Game",
    opening_eco: str = "C50",
    has_accuracy: bool = True,
    has_brilliant: bool = False,
    is_endgame: bool = True
) -> Game:
    date_str = (datetime.now(timezone.utc) - timedelta(days=days_ago)).isoformat()

    # Build moves
    # Moves 0-11: Opening (Italian Game)
    # Moves 12-25: Middlegame
    # Moves 26+: Endgame (few pieces left)
    moves = [
        # 1. e4 e5
        {"san": "e4", "from": "e2", "to": "e4", "color": "w", "move_number": 1, "classification": "book", "accuracy": 98.0, "eval": {"eval": 0.2, "best_move": "e4"}, "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"},
        {"san": "e5", "from": "e7", "to": "e5", "color": "b", "move_number": 1, "classification": "book", "accuracy": 97.0, "eval": {"eval": 0.2, "best_move": "e5"}, "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2"},
        # 2. Nf3 Nc6
        {"san": "Nf3", "from": "g1", "to": "f3", "color": "w", "move_number": 2, "classification": "book", "accuracy": 95.0, "eval": {"eval": 0.3, "best_move": "Nf3"}, "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2"},
        {"san": "Nc6", "from": "b8", "to": "c6", "color": "b", "move_number": 2, "classification": "book", "accuracy": 95.0, "eval": {"eval": 0.3, "best_move": "Nc6"}, "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3"},
        # 3. Bc4 Bc5
        {"san": "Bc4", "from": "f1", "to": "c4", "color": "w", "move_number": 3, "classification": "book", "accuracy": 96.0, "eval": {"eval": 0.3, "best_move": "Bc4"}, "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3"},
        {"san": "Bc5", "from": "f8", "to": "c5", "color": "b", "move_number": 3, "classification": "book", "accuracy": 94.0, "eval": {"eval": 0.3, "best_move": "Bc5"}, "fen": "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4"},
        # 4. c3 Nf6
        {"san": "c3", "from": "c2", "to": "c3", "color": "w", "move_number": 4, "classification": "best", "accuracy": 92.0, "eval": {"eval": 0.4, "best_move": "c3"}, "fen": "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R b KQkq - 0 4"},
        {"san": "Nf6", "from": "g8", "to": "f6", "color": "b", "move_number": 4, "classification": "best", "accuracy": 91.0, "eval": {"eval": 0.4, "best_move": "Nf6"}, "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 1 5"},
        # 5. d4 exd4
        {"san": "d4", "from": "d2", "to": "d4", "color": "w", "move_number": 5, "classification": "good", "accuracy": 88.0, "eval": {"eval": 0.4, "best_move": "d4"}, "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2BPP3/2P2N2/PP3PPP/RNBQK2R b KQkq - 0 5"},
        {"san": "exd4", "from": "e5", "to": "d4", "color": "b", "move_number": 5, "classification": "good", "accuracy": 89.0, "eval": {"eval": 0.4, "best_move": "exd4"}, "fen": "r1bqk2r/pppp1ppp/2n2n2/2b5/2BpP3/2P2N2/PP3PPP/RNBQK2R w KQkq - 0 6"},
        # 6. cxd4 Bb4+
        {"san": "cxd4", "from": "c3", "to": "d4", "color": "w", "move_number": 6, "classification": "best", "accuracy": 90.0, "eval": {"eval": 0.5, "best_move": "cxd4"}, "fen": "r1bqk2r/pppp1ppp/2n2n2/2b5/2BPP3/5N2/PP3PPP/RNBQK2R b KQkq - 0 6"},
        {"san": "Bb4+", "from": "c5", "to": "b4", "color": "b", "move_number": 6, "classification": "inaccuracy", "accuracy": 70.0, "eval": {"eval": 0.8, "best_move": "Bb6"}, "fen": "r1bqk2r/pppp1ppp/2n2n2/8/1bBPP3/5N2/PP3PPP/RNBQK2R w KQkq - 1 7"},
    ]

    # Middlegame moves
    if has_brilliant:
        moves.append({
            "san": "Bxf7+", "from": "c4", "to": "f7", "color": "w", "move_number": 7,
            "classification": "brilliant", "accuracy": 99.0,
            "eval": {"eval": 3.5, "best_move": "Bxf7+", "why": "Material sacrifice for king attack"},
            "fen": "r1bqk2r/pppp1Bpp/2n2n2/8/1b1PP3/5N2/PP3PPP/RNBQK2R b KQkq - 0 7"
        })
        moves.append({
            "san": "Kxf7", "from": "e8", "to": "f7", "color": "b", "move_number": 7,
            "classification": "best", "accuracy": 85.0,
            "eval": {"eval": 3.5, "best_move": "Kxf7"},
            "fen": "r1bq3r/pppp1kpp/2n2n2/8/1b1PP3/5N2/PP3PPP/RNBQK2R w KQ - 0 8"
        })
    else:
        moves.append({
            "san": "Bd2", "from": "c1", "to": "d2", "color": "w", "move_number": 7,
            "classification": "best", "accuracy": 88.0,
            "eval": {"eval": 0.6, "best_move": "Bd2"},
            "fen": "r1bqk2r/pppp1ppp/2n2n2/8/1bBPP3/5N2/PP1B1PPP/RN1QK2R b KQkq - 2 7"
        })
        moves.append({
            "san": "Bxd2+", "from": "b4", "to": "d2", "color": "b", "move_number": 7,
            "classification": "good", "accuracy": 85.0,
            "eval": {"eval": 0.6, "best_move": "Bxd2+"},
            "fen": "r1bqk2r/pppp1ppp/2n2n2/8/2BPP3/5N2/PP1b1PPP/RN1QK2R w KQkq - 0 8"
        })

    # More moves up to move 15 for middlegame stats
    for m_num in range(8, 14):
        moves.append({
            "san": f"h{m_num%8+1}", "from": "h2", "to": f"h{m_num%8+1}", "color": "w", "move_number": m_num,
            "classification": "good", "accuracy": 82.0,
            "eval": {"eval": 1.2, "best_move": "h3"},
            "fen": "r1bqk2r/pppp1ppp/2n2n2/8/2BPP3/5N2/PP1N1PPP/R2QK2R b KQkq - 1 8"
        })
        moves.append({
            "san": f"a{m_num%8+1}", "from": "a7", "to": f"a{m_num%8+1}", "color": "b", "move_number": m_num,
            "classification": "good", "accuracy": 80.0,
            "eval": {"eval": 1.2, "best_move": "a6"},
            "fen": "r1bqk2r/pppp1ppp/2n2n2/8/2BPP3/5N2/PP1N1PPP/R2QK2R w KQkq - 1 9"
        })

    # Endgame move with material <= 13 non-pawn (e.g. King and Rook only)
    if is_endgame:
        endgame_fen = "8/5k2/8/8/8/8/4R3/4K3 w - - 0 40"
        moves.append({
            "san": "Re3", "from": "e2", "to": "e3", "color": "w", "move_number": 40,
            "classification": "best", "accuracy": 90.0,
            "eval": {"eval": 5.0, "best_move": "Re3"},
            "fen": endgame_fen
        })
        moves.append({
            "san": "Kf6", "from": "f7", "to": "f6", "color": "b", "move_number": 40,
            "classification": "good", "accuracy": 80.0,
            "eval": {"eval": 5.0, "best_move": "Kf6"},
            "fen": "8/8/5k2/8/8/4R3/8/4K3 w - - 1 41"
        })
        moves.append({
            "san": "Kd2", "from": "e1", "to": "d2", "color": "w", "move_number": 41,
            "classification": "best", "accuracy": 92.0,
            "eval": {"eval": 5.2, "best_move": "Kd2"},
            "fen": "8/8/5k2/8/8/4R3/3K4/8 b - - 2 41"
        })
        moves.append({
            "san": "Kf5", "from": "f6", "to": "f5", "color": "b", "move_number": 41,
            "classification": "good", "accuracy": 78.0,
            "eval": {"eval": 5.2, "best_move": "Kf5"},
            "fen": "8/8/8/5k2/8/4R3/3K4/8 w - - 3 42"
        })

    return Game(
        id=game_id,
        user_id=user_id,
        source="online",
        platform="chesscom",
        pgn="1. e4 e5 ...",
        white={"username": "TestGrandmaster" if is_user_white else "OpponentUser", "rating": 1400},
        black={"username": "OpponentUser" if is_user_white else "TestGrandmaster", "rating": 1380},
        result=result,
        date=date_str,
        time_control="10 min",
        speed=speed,
        opening={"name": opening_name, "eco": opening_eco},
        moves=moves,
        is_user_white=is_user_white,
        accuracy={"white": 88.5, "black": 81.2} if has_accuracy else None,
        estimated_rating={"white": 1500, "black": 1350} if has_accuracy else None,
        termination="Won by resignation"
    )


# -----------------------------------------------------------------------------
# Test Cases
# -----------------------------------------------------------------------------

def test_unauthenticated_requests_return_401(client):
    """Verifies that all 6 endpoints return 401 when no session is active."""
    endpoints = [
        "/api/v1/stats/advanced/overview",
        "/api/v1/stats/advanced/openings",
        "/api/v1/stats/advanced/tactics",
        "/api/v1/stats/advanced/endgames",
        "/api/v1/stats/advanced/strategy",
        "/api/v1/stats/advanced/brilliant-moves",
    ]
    for ep in endpoints:
        resp = client.get(ep)
        assert resp.status_code == 401, f"{ep} did not return 401: {resp.text}"


def test_data_isolation_between_users(db_session, client, auth_client, test_user):
    """Ensures another user's games never leak into the current user's stats."""
    # Create a second user
    other_user = User(username="OtherGrandmaster")
    db_session.add(other_user)
    db_session.commit()
    db_session.refresh(other_user)

    # Add game only for other_user
    other_game = _create_sample_game(
        user_id=other_user.id,
        game_id="game-other-1",
        has_brilliant=True
    )
    db_session.add(other_game)
    db_session.commit()

    # Current user has 0 games
    res = auth_client.get("/api/v1/stats/advanced/overview?range=all")
    assert res.status_code == 200
    data = res.json()
    assert data["games"] == 0
    assert data["wins"] == 0

    # Brilliant moves must be empty for test_user
    res_b = auth_client.get("/api/v1/stats/advanced/brilliant-moves")
    assert res_b.status_code == 200
    assert len(res_b.json()) == 0

    # Switch cookie to other_user
    token = sign_user_id(other_user.id)
    client.cookies.set(settings.session_cookie_name, token)
    res_other = client.get("/api/v1/stats/advanced/brilliant-moves")
    assert res_other.status_code == 200
    assert len(res_other.json()) == 1
    assert res_other.json()[0]["gameId"] == "game-other-1"


def test_advanced_overview_shape_and_null_rules(db_session, auth_client, test_user):
    """Checks overview shape and score null rule (returns null when < 5 analysed games)."""
    # Create 3 games (less than 5)
    for i in range(3):
        g = _create_sample_game(user_id=test_user.id, game_id=f"game-ov-{i}", days_ago=i + 1)
        db_session.add(g)
    db_session.commit()

    res = auth_client.get("/api/v1/stats/advanced/overview?range=all")
    assert res.status_code == 200
    data = res.json()

    assert "rating" in data
    assert "ratingDelta" in data
    assert "history" in data
    assert data["games"] == 3
    assert data["wins"] == 3
    assert data["winPct"] == 100.0

    # Because < 5 analysed games, scores must be null
    scores = data["scores"]
    assert scores["openings"] is None
    assert scores["tactics"] is None
    assert scores["strategy"] is None
    assert scores["endgames"] is None

    # Now add 3 more games (total 6 analysed games >= 5)
    for i in range(3, 6):
        g = _create_sample_game(user_id=test_user.id, game_id=f"game-ov-{i}", days_ago=i + 1)
        db_session.add(g)
    db_session.commit()

    res2 = auth_client.get("/api/v1/stats/advanced/overview?range=all")
    data2 = res2.json()
    assert data2["games"] == 6
    scores2 = data2["scores"]
    assert scores2["openings"] is not None
    assert scores2["openings"] > 1000
    assert scores2["endgames"] is not None


def test_advanced_openings_shape_and_filtering(db_session, auth_client, test_user):
    """Validates openings endpoint shape, time series, byOpening breakdown, and peer benchmarks."""
    for i in range(4):
        g = _create_sample_game(
            user_id=test_user.id,
            game_id=f"game-op-{i}",
            opening_name="Ruy Lopez" if i % 2 == 0 else "Italian Game",
            opening_eco="C60" if i % 2 == 0 else "C50",
            days_ago=i + 1
        )
        db_session.add(g)
    db_session.commit()

    res = auth_client.get("/api/v1/stats/advanced/openings?range=all")
    assert res.status_code == 200
    data = res.json()

    assert data["peersEstimated"] is True
    assert "openingAccuracy" in data
    assert "avgOpeningMistakes" in data
    assert "avgBookMoves" in data
    assert "byOpening" in data

    op_acc = data["openingAccuracy"]
    assert op_acc["value"] is not None
    assert op_acc["peers"] is not None
    assert op_acc["grade"] in ("A", "B", "C", "D", "E")
    assert len(op_acc["series"]) > 0

    by_op = data["byOpening"]
    assert len(by_op) == 2
    assert any(o["name"] == "Ruy Lopez" for o in by_op)
    assert any(o["name"] == "Italian Game" for o in by_op)


def test_advanced_tactics_shape_and_null_rules(db_session, auth_client, test_user):
    """Verifies tactics 9 categories, found/allowed params, and null rule when opportunities < 3."""
    # 1 game with a brilliant sacrifice opportunity
    g = _create_sample_game(
        user_id=test_user.id,
        game_id="game-tac-1",
        has_brilliant=True
    )
    db_session.add(g)
    db_session.commit()

    res = auth_client.get("/api/v1/stats/advanced/tactics?side=found&range=all")
    assert res.status_code == 200
    data = res.json()

    assert data["peersEstimated"] is True
    cats = data["categories"]
    assert len(cats) == 9
    cat_keys = [c["key"] for c in cats]
    assert "forks" in cat_keys
    assert "pins" in cat_keys
    assert "checkmates" in cat_keys
    assert "brilliantSacrifices" in cat_keys

    # Since opportunities < 3, value must be null
    for c in cats:
        if c["opportunities"] < 3:
            assert c["value"] is None
            assert c["grade"] is None

    # Test allowed side query param
    res_allowed = auth_client.get("/api/v1/stats/advanced/tactics?side=allowed&range=all")
    assert res_allowed.status_code == 200
    assert len(res_allowed.json()["categories"]) == 9


def test_advanced_endgames_shape_and_material_bucketing(db_session, auth_client, test_user):
    """Validates endgames shape, winPct fromBetter/equal/worse, and accuracy buckets."""
    # Add 3 endgame games so opportunities count >= 3 for testing non-null values
    for i in range(3):
        g = _create_sample_game(
            user_id=test_user.id,
            game_id=f"game-end-{i}",
            result="1-0",
            is_endgame=True
        )
        db_session.add(g)
    db_session.commit()

    res = auth_client.get("/api/v1/stats/advanced/endgames?range=all")
    assert res.status_code == 200
    data = res.json()

    assert data["peersEstimated"] is True
    win_pct = data["winPct"]
    assert "fromBetter" in win_pct
    assert "fromEqual" in win_pct
    assert "fromWorse" in win_pct

    acc = data["accuracy"]
    assert "overall" in acc
    assert "rookAndPawn" in acc
    assert "kingAndPawn" in acc
    assert "queen" in acc
    assert "other" in acc

    # 3 games were rook & pawn endgames with win eval >= 5.0 (fromBetter)
    assert acc["overall"]["value"] is not None
    assert win_pct["fromBetter"]["value"] == 100.0


def test_advanced_strategy_shape(db_session, auth_client, test_user):
    """Verifies strategy returns documented heuristics and flags peersEstimated."""
    for i in range(3):
        g = _create_sample_game(
            user_id=test_user.id,
            game_id=f"game-strat-{i}",
            days_ago=i + 1
        )
        db_session.add(g)
    db_session.commit()

    res = auth_client.get("/api/v1/stats/advanced/strategy?range=all")
    assert res.status_code == 200
    data = res.json()

    assert data["peersEstimated"] is True
    for key in ("overall", "pawnStructure", "attacking", "defending", "activePiece", "spaceAdvantage"):
        assert key in data
        assert "value" in data[key]
        assert "peers" in data[key]
        assert "grade" in data[key]


def test_brilliant_moves_listing_and_limit(db_session, auth_client, test_user):
    """Checks brilliant moves extraction, formatting, and limit parameter."""
    for i in range(3):
        g = _create_sample_game(
            user_id=test_user.id,
            game_id=f"game-brill-{i}",
            has_brilliant=True,
            days_ago=i + 1
        )
        db_session.add(g)
    db_session.commit()

    res = auth_client.get("/api/v1/stats/advanced/brilliant-moves?limit=2")
    assert res.status_code == 200
    data = res.json()

    assert len(data) == 2
    item = data[0]
    assert "gameId" in item
    assert "moveIndex" in item
    assert "fen" in item
    assert "san" in item
    assert "opponent" in item
    assert "opponentRating" in item
    assert "date" in item
    assert item["san"] == "Bxf7+"


def test_shared_filters_mode_range_color(db_session, auth_client, test_user):
    """Tests mode, range, and color filtering behavior across endpoints."""
    # Blitz game as White 2 days ago
    g1 = _create_sample_game(
        user_id=test_user.id,
        game_id="game-filter-1",
        speed="blitz",
        is_user_white=True,
        days_ago=2
    )
    # Rapid game as Black 10 days ago
    g2 = _create_sample_game(
        user_id=test_user.id,
        game_id="game-filter-2",
        speed="rapid",
        is_user_white=False,
        days_ago=10
    )
    # Bullet game as White 100 days ago
    g3 = _create_sample_game(
        user_id=test_user.id,
        game_id="game-filter-3",
        speed="bullet",
        is_user_white=True,
        days_ago=100
    )
    db_session.add_all([g1, g2, g3])
    db_session.commit()

    # 1. Mode filter: blitz only -> should match only g1
    res_blitz = auth_client.get("/api/v1/stats/advanced/overview?mode=blitz&range=all").json()
    assert res_blitz["games"] == 1

    # 2. Color filter: black only -> should match only g2
    res_black = auth_client.get("/api/v1/stats/advanced/overview?color=black&range=all").json()
    assert res_black["games"] == 1

    # 3. Range filter: 7d -> should exclude g2 (10 days) and g3 (100 days)
    res_7d = auth_client.get("/api/v1/stats/advanced/overview?range=7d").json()
    assert res_7d["games"] == 1

    # 4. Range filter: 90d -> should include g1 and g2, exclude g3
    res_90d = auth_client.get("/api/v1/stats/advanced/overview?range=90d").json()
    assert res_90d["games"] == 2
