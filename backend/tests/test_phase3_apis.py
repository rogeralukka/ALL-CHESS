import json
from pathlib import Path
import pytest
from fastapi.testclient import TestClient
import chess

from app.services.coach_service import (
    validate_move_legality,
    generate_template_comment,
    generate_move_comment,
)

DATA_DIR = Path(__file__).resolve().parent.parent / "app" / "data"


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


def test_coach_explain_move_api_camelcase(auth_client: TestClient):
    # Verify camelCase input contract: fenBefore, bestMove
    payload = {
        "fenBefore": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "san": "e4",
        "classification": "book",
        "bestMove": "e4",
    }
    r = auth_client.post("/api/v1/coach/explain-move", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert "comment" in data
    assert "e4" in data["comment"]
    assert data["provider"] in ("gemini", "groq", "template")


def test_puzzles_list_and_daily_api(auth_client: TestClient):
    # List puzzles near rating
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
    assert "goal" in p1
    assert "to move" in p1["goal"]

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


def test_puzzle_rating_and_attempt_flow_camelcase(auth_client: TestClient):
    # Check initial user puzzle rating - assert camelCase bestStreak
    r_init = auth_client.get("/api/v1/puzzles/rating")
    assert r_init.status_code == 200
    init_data = r_init.json()
    assert init_data["rating"] == 650
    assert init_data["streak"] == 0
    assert "bestStreak" in init_data

    # Fetch a real puzzle ID from the database
    puzzles = auth_client.get("/api/v1/puzzles?limit=1").json()
    puzzle_id = puzzles[0]["id"]

    # Submit successful attempt with camelCase timeSeconds
    attempt_payload = {"solved": True, "timeSeconds": 15}
    r_att1 = auth_client.post(f"/api/v1/puzzles/{puzzle_id}/attempt", json=attempt_payload)
    assert r_att1.status_code == 200
    att1 = r_att1.json()
    assert att1["solved"] is True
    assert att1["rating"] > 650
    assert att1["ratingDelta"] >= 5
    assert att1["streak"] == 1
    assert att1["bestStreak"] == 1

    # Submit failed attempt
    fail_payload = {"solved": False, "timeSeconds": 30}
    r_att2 = auth_client.post(f"/api/v1/puzzles/{puzzle_id}/attempt", json=fail_payload)
    assert r_att2.status_code == 200
    att2 = r_att2.json()
    assert att2["solved"] is False
    assert att2["ratingDelta"] <= -5
    assert att2["streak"] == 0
    assert att2["bestStreak"] == 1


def test_new_user_has_zero_friends_and_no_completed_lessons(auth_client: TestClient):
    # 1. No fake friends for user
    r_friends = auth_client.get("/api/v1/friends")
    assert r_friends.status_code == 200
    assert r_friends.json() == []

    # 2. No completed lessons for a fresh user
    r_stages = auth_client.get("/api/v1/learn/stages")
    assert r_stages.status_code == 200
    stages = r_stages.json()
    assert len(stages) == 14

    # Assert nothing is done
    done_stages = [s for s in stages if s.get("status") == "done"]
    assert len(done_stages) == 0, f"Expected 0 done stages for new user, got {len(done_stages)}"

    # Assert first stage of each category is current, others are locked
    categories_seen = set()
    for s in stages:
        cat = s["category"]
        if cat not in categories_seen:
            assert s["status"] == "current", f"First stage of category {cat} ({s['id']}) should be current"
            categories_seen.add(cat)
        else:
            assert s["status"] == "locked", f"Subsequent stage {s['id']} should be locked"


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
    assert r_streak.json()["current_streak"] >= 1


def test_all_imported_puzzles_validation():
    """Validates every single puzzle in puzzles.json."""
    puzzles_file = DATA_DIR / "puzzles.json"
    assert puzzles_file.exists(), f"puzzles.json not found at {puzzles_file}"

    with open(puzzles_file, "r", encoding="utf-8") as f:
        puzzles = json.load(f)

    assert len(puzzles) >= 4900, f"Expected ~5000 puzzles, found {len(puzzles)}"

    for p in puzzles:
        pid = p["id"]
        fen = p["fen"]
        board = chess.Board(fen)
        assert board.is_valid(), f"Invalid starting FEN in puzzle {pid}: {fen}"

        solution = p["solution"]
        assert len(solution) > 0, f"Puzzle {pid} has empty solution"

        for move_san in solution:
            try:
                move = board.parse_san(move_san)
            except Exception as e:
                raise AssertionError(f"Illegal SAN move '{move_san}' in puzzle {pid}: {e}")
            assert move in board.legal_moves, f"Move '{move_san}' illegal in position in puzzle {pid}"
            board.push(move)

        themes = p.get("theme", [])
        has_mate_theme = any(t == "mate" or t.startswith("mateIn") for t in themes)
        if has_mate_theme:
            assert board.is_checkmate(), f"Puzzle {pid} has mate theme but does not end in checkmate"


def test_all_lesson_stages_and_steps_validation():
    """Validates every single lesson stage and step in stages.json."""
    stages_file = DATA_DIR / "stages.json"
    assert stages_file.exists(), f"stages.json not found at {stages_file}"

    with open(stages_file, "r", encoding="utf-8") as f:
        stages = json.load(f)

    assert len(stages) == 14, f"Expected 14 stages, got {len(stages)}"

    total_steps = 0
    for s in stages:
        sid = s["id"]
        assert "status" not in s, f"Stage {sid} has forbidden 'status' attribute"

        steps = s.get("steps", [])
        assert 4 <= len(steps) <= 8, f"Stage {sid} has {len(steps)} steps (must be between 4 and 8)"
        total_steps += len(steps)

        for step in steps:
            step_id = step["id"]
            fen = step["fen"]
            board = chess.Board(fen)
            assert board.is_valid(), f"Illegal FEN in {sid} -> {step_id}: {fen}"

            if step.get("isInteractive"):
                req_move = step.get("requiredMove")
                assert req_move, f"Interactive step {sid} -> {step_id} missing requiredMove"
                try:
                    move = board.parse_san(req_move)
                except Exception as e:
                    raise AssertionError(f"Illegal requiredMove '{req_move}' in {sid} -> {step_id}: {e}")
                assert move in board.legal_moves, f"Move '{req_move}' not in legal_moves for {sid} -> {step_id}"

    assert total_steps >= 56
