import pytest
from fastapi.testclient import TestClient
import chess

from app.services.coach_service import (
    validate_move_legality,
    generate_template_comment,
    generate_move_comment,
)


def test_coach_move_legality_validator():
    # Position before 6. Bxf7+ in Italian
    # 1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. d3 Nf6 5. O-O O-O
    b = chess.Board()
    for m in ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'd3', 'Nf6', 'O-O', 'O-O']:
        b.push_san(m)
    fen_before = b.fen()

    b_after = b.copy()
    b_after.push_san('Bxf7+')
    fen_after = b_after.fen()

    # Valid commentary referencing legal moves
    valid_text = "Bxf7+ is a blunder because after Kxf7 White has no attack and c3 was the right move."
    assert validate_move_legality(valid_text, fen_before, fen_after, ['c3', 'd6'], best_move='c3', played_san='Bxf7+') is True

    # Hallucinated illegal move (e.g. Queen jumping across pieces)
    invalid_text = "You should have played Qe8# which is completely impossible here."
    assert validate_move_legality(invalid_text, fen_before, fen_after, ['c3', 'd6'], best_move='c3', played_san='Bxf7+') is False

    # Another hallucinated move
    invalid_text2 = "Nxd5+ wins a piece immediately."
    assert validate_move_legality(invalid_text2, fen_before, fen_after, ['c3'], best_move='c3', played_san='Bxf7+') is False


def test_coach_template_comment_fallback():
    comment_blunder = generate_template_comment(san="Bxf7+", classification="blunder", best_move="c3")
    assert "Bxf7+" in comment_blunder
    assert "c3" in comment_blunder
    assert "blunder" in comment_blunder.lower()

    comment_best = generate_template_comment(san="Nf3", classification="best")
    assert "Nf3" in comment_best
    assert "best move" in comment_best.lower()

    comment_great = generate_template_comment(san="Rd8#", classification="great")
    assert "Rd8#" in comment_great

    comment_miss = generate_template_comment(san="Qd2", classification="miss", best_move="Qxf7#")
    assert "Qxf7#" in comment_miss


def test_coach_explain_move_api(auth_client: TestClient):
    payload = {
        "fen_before": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "san": "e4",
        "classification": "book",
        "best_move": "e4",
    }
    r = auth_client.post("/api/v1/coach/explain-move", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert "comment" in data
    assert "e4" in data["comment"]
    assert data["provider"] in ("gemini", "groq", "template")


def test_puzzles_list_and_daily_api(auth_client: TestClient):
    # List puzzles
    r = auth_client.get("/api/v1/puzzles?limit=10")
    assert r.status_code == 200
    puzzles = r.json()
    assert len(puzzles) > 0
    p1 = puzzles[0]
    assert "id" in p1
    assert "fen" in p1
    assert "solution" in p1
    assert isinstance(p1["solution"], list)
    assert "rating" in p1

    # Get puzzle by id
    puz_id = p1["id"]
    r2 = auth_client.get(f"/api/v1/puzzles/{puz_id}")
    assert r2.status_code == 200
    assert r2.json()["id"] == puz_id

    # Daily puzzle
    r_daily = auth_client.get("/api/v1/puzzles/daily")
    assert r_daily.status_code == 200
    daily = r_daily.json()
    assert "id" in daily
    assert "solution" in daily


def test_puzzle_rating_and_attempt_flow(auth_client: TestClient):
    # Check initial user puzzle rating
    r_init = auth_client.get("/api/v1/puzzles/rating")
    assert r_init.status_code == 200
    init_data = r_init.json()
    assert init_data["rating"] == 650
    assert init_data["streak"] == 0

    # Submit successful attempt
    attempt_payload = {"solved": True, "time_seconds": 15}
    r_att1 = auth_client.post("/api/v1/puzzles/puz-01/attempt", json=attempt_payload)
    assert r_att1.status_code == 200
    att1 = r_att1.json()
    assert att1["solved"] is True
    assert att1["rating"] > 650
    assert att1["rating_delta"] >= 5
    assert att1["streak"] == 1
    assert att1["best_streak"] == 1

    # Submit failed attempt
    fail_payload = {"solved": False, "time_seconds": 30}
    r_att2 = auth_client.post("/api/v1/puzzles/puz-01/attempt", json=fail_payload)
    assert r_att2.status_code == 200
    att2 = r_att2.json()
    assert att2["solved"] is False
    assert att2["rating_delta"] <= -5
    assert att2["streak"] == 0
    assert att2["best_streak"] == 1


def test_learn_stages_and_progression_api(auth_client: TestClient):
    # Fetch stages
    r = auth_client.get("/api/v1/learn/stages?category=endgame")
    assert r.status_code == 200
    stages = r.json()
    assert len(stages) > 0
    first_stage = stages[0]
    assert "id" in first_stage
    assert "title" in first_stage
    assert "steps" in first_stage
    assert first_stage["category"] == "endgame"

    # Complete a stage
    r_comp = auth_client.post(
        f"/api/v1/learn/stages/{first_stage['id']}/complete",
        json={"stars": 3, "xp": 75},
    )
    assert r_comp.status_code == 200
    comp_data = r_comp.json()
    assert comp_data["success"] is True
    assert comp_data["status"] == "done"
    assert comp_data["stars"] == 3
    assert comp_data["xp"] == 75

    # Check streak
    r_streak = auth_client.get("/api/v1/learn/streak")
    assert r_streak.status_code == 200
    streak_data = r_streak.json()
    assert streak_data["current_streak"] >= 1
    assert streak_data["longest_streak"] >= 1


def test_friends_crud_and_real_ratings(auth_client: TestClient):
    # Initial friends list
    r_list = auth_client.get("/api/v1/friends")
    assert r_list.status_code == 200
    friends = r_list.json()
    assert len(friends) >= 3
    for f in friends:
        assert "username" in f
        assert "rating" in f
        assert "ratings" in f
        assert f["ratings"]["rapid"] is not None

    # Add friend
    add_payload = {"username": "Hikaru", "platform": "chesscom"}
    r_add = auth_client.post("/api/v1/friends", json=add_payload)
    assert r_add.status_code == 200
    new_friend = r_add.json()
    assert new_friend["username"].lower() == "hikaru"
    assert "ratings" in new_friend
    assert new_friend["rating"] > 0

    # Delete friend
    r_del = auth_client.delete(f"/api/v1/friends/{new_friend['id']}")
    assert r_del.status_code == 200
    assert r_del.json()["success"] is True
