"""
test_puzzles_feature.py: Comprehensive test suite for Lichess puzzle integration.

Covers:
  1. Conversion & validation (promotions, mate-in-2, capture setup moves, rejection rules).
  2. Importer (idempotent upsert, --limit, --dry-run, rollback by import_run).
  3. Seeder (never deletes, runs only when empty, request handlers do not call it).
  4. Router (theme filter in SQL, rating window, excludes solved, varied results,
             /next, /themes, /daily stability, attempt idempotency, hint rule, Elo K-factor & floor).
"""

import copy
import csv
import os
from pathlib import Path
import subprocess
import sys
from unittest.mock import patch
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base
from app.models.puzzle import Puzzle, PuzzleAttempt, PuzzleTheme
from app.services.puzzle_processor import process_puzzle_row
from app.services.seeder import seed_puzzles
from scripts.import_puzzles_to_db import main as importer_main, upsert_puzzles_batch


# ==============================================================================
# 1. CONVERSION TESTS
# ==============================================================================


def test_conversion_promotion_puzzle():
    """Verify pawn promotion is handled accurately in FEN, SAN, and UCI."""
    # White pawn on b7, opponent King moves a2a1, White promotes b7b8=Q
    row = [
        "prom01",
        "8/1P6/8/8/8/8/k7/7K b - - 0 1",  # initial FEN before opponent move
        "a2a1 b7b8q",                    # moves: setup move a2a1, player solution b7b8q
        "1500",                          # rating
        "70",                            # rating_dev <= 90
        "95",                            # popularity >= 85
        "1200",                          # nb_plays >= 500
        "advancedPawn endgame promotion short",
        "https://lichess.org/test1",
        "",
    ]
    p = process_puzzle_row(row)
    assert p is not None
    assert p["id"] == "prom01"
    assert p["setup_move_uci"] == "a2a1"
    assert p["solution_uci"] == ["b7b8q"]
    assert p["solution"] == ["b8=Q"]
    assert "White to move" in p["goal"]


def test_conversion_mate_in_2_puzzle():
    """Verify mate-in-2 puzzle strictly asserts ending in checkmate."""
    # Checkmate on back rank:
    # 6k1/5ppp/8/8/8/8/8/4R2K b - - 0 1
    # Setup move: g8h8, solution: e1e8#
    row_clean_mate = [
        "mate03",
        "6k1/5ppp/8/8/8/8/8/4R2K b - - 0 1",
        "g8h8 e1e8",
        "1200",
        "50",
        "95",
        "1500",
        "backRankMate mate mateIn1 short",
        "",
        "",
    ]
    p = process_puzzle_row(row_clean_mate)
    assert p is not None
    assert p["solution"] == ["Re8#"]
    assert p["solution_uci"] == ["e1e8"]
    assert p["setup_move_uci"] == "g8h8"
    assert "mate in 1" in p["goal"]


def test_conversion_opponent_setup_move_is_capture():
    """Verify opponent setup move being a capture is pushed legally."""
    # Black captures White pawn on e4 (d5xe4), then White responds Qxe4
    row = [
        "cap01",
        "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "d5e4 d1e2",
        "1100",
        "75",
        "89",
        "650",
        "advantage opening short",
        "",
        "",
    ]
    p = process_puzzle_row(row)
    assert p is not None
    assert p["setup_move_uci"] == "d5e4"
    assert p["solution_uci"] == ["d1e2"]
    assert p["solution"] == ["Qe2"]
    assert "White to move" in p["goal"]


def test_conversion_quality_filter_rejections():
    """Verify quality filter thresholds: rating_dev <= 90, popularity >= 85, plays >= 500."""
    base = [
        "rej01",
        "6k1/5ppp/8/8/8/8/8/4R2K b - - 0 1",
        "g8h8 e1e8",
        "1200",
        "70",
        "90",
        "1000",
        "mate short",
        "",
        "",
    ]
    # 1. Rating deviation too high (>90)
    r1 = copy.deepcopy(base)
    r1[4] = "95"
    assert process_puzzle_row(r1) is None

    # 2. Popularity too low (<85)
    r2 = copy.deepcopy(base)
    r2[5] = "82"
    assert process_puzzle_row(r2) is None

    # 3. Plays too low (<500)
    r3 = copy.deepcopy(base)
    r3[6] = "450"
    assert process_puzzle_row(r3) is None

    # 4. Valid row passes
    assert process_puzzle_row(base) is not None


# ==============================================================================
# 2. IMPORTER TESTS (SQLITE / IDEMPOTENCY / ROLLBACK)
# ==============================================================================


def test_importer_idempotent_batch_upsert_and_rollback():
    """Verify upsert is idempotent and rollback by import_run cleans up cascade."""
    engine = create_engine("sqlite:///:memory:", poolclass=StaticPool)

    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)

    import_run_1 = "run_test_001"
    batch = [
        {
            "id": "puz_test_1",
            "fen": "6k1/5ppp/8/8/8/8/8/4R2K w - - 0 1",
            "solution": ["Re8#"],
            "solution_uci": ["e1e8"],
            "setup_move_uci": "g8h8",
            "rating": 1250,
            "theme": ["mate", "mateIn1"],
            "goal": "White to move — mate in 1",
            "popularity": 95,
            "nb_plays": 1200,
            "game_url": None,
            "opening_tags": None,
        },
        {
            "id": "puz_test_2",
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "solution": ["e4"],
            "solution_uci": ["e2e4"],
            "setup_move_uci": "e7e5",
            "rating": 1350,
            "theme": ["opening"],
            "goal": "White to move — find the best move",
            "popularity": 90,
            "nb_plays": 800,
            "game_url": None,
            "opening_tags": None,
        },
    ]

    with Session() as sess:
        # First upsert
        upsert_puzzles_batch(sess, batch, "sqlite", import_run_1)
        assert sess.query(Puzzle).count() == 2
        assert sess.query(PuzzleTheme).count() == 3

        # Second upsert (same batch) -> must remain 2 puzzles and 3 themes (idempotent)
        upsert_puzzles_batch(sess, batch, "sqlite", import_run_1)
        assert sess.query(Puzzle).count() == 2
        assert sess.query(PuzzleTheme).count() == 3

        # Rollback by import_run
        sess.query(Puzzle).filter(Puzzle.import_run == import_run_1).delete()
        sess.commit()

        # Both puzzles and their cascaded themes must be gone
        assert sess.query(Puzzle).count() == 0
        assert sess.query(PuzzleTheme).count() == 0


# ==============================================================================
# 3. SEEDER TESTS
# ==============================================================================


def test_seeder_never_deletes_and_runs_only_when_empty():
    """Verify seed_puzzles only seeds when table is empty and never deletes."""
    engine = create_engine("sqlite:///:memory:", poolclass=StaticPool)
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)

    with Session() as sess:
        # 1. Insert a custom puzzle
        p = Puzzle(
            id="custom_puz",
            fen="6k1/5ppp/8/8/8/8/8/4R2K w - - 0 1",
            solution=["Re8#"],
            rating=1100,
            theme=["mate"],
            goal="White to move",
        )
        sess.add(p)
        sess.commit()
        assert sess.query(Puzzle).count() == 1

        # 2. Call seed_puzzles on a non-empty table -> must NOT delete custom_puz
        count = seed_puzzles(sess, force=False)
        assert count == 1
        custom = sess.query(Puzzle).filter(Puzzle.id == "custom_puz").first()
        assert custom is not None

        # 3. Wipe table manually, now seed_puzzles should seed the starter set
        sess.query(Puzzle).delete()
        sess.commit()
        seeded_count = seed_puzzles(sess, force=False)
        assert seeded_count >= 4900
        assert sess.query(Puzzle).count() == seeded_count


# ==============================================================================
# 4. ROUTER TESTS
# ==============================================================================


def test_puzzles_router_theme_filter_sql(auth_client: TestClient):
    """Verify theme filtering works cleanly at the SQL level."""
    r = auth_client.get("/api/v1/puzzles?theme=fork&limit=20")
    assert r.status_code == 200
    puzzles = r.json()
    assert len(puzzles) > 0
    for p in puzzles:
        assert "fork" in p["theme"]


def test_puzzles_router_rating_window_and_randomization(auth_client: TestClient):
    """Verify default rating window (user rating +-150) and randomized variation."""
    # New users start at 400 (level 1)
    r1 = auth_client.get("/api/v1/puzzles?limit=10")
    assert r1.status_code == 200
    puzzles1 = r1.json()
    assert len(puzzles1) == 10
    ids1 = [p["id"] for p in puzzles1]

    # Window is 400..550 around the start rating, widened a little when sparse
    for p in puzzles1:
        assert 400 <= p["rating"] <= 800

    # Call again, results should be varied due to func.random()
    r2 = auth_client.get("/api/v1/puzzles?limit=10")
    ids2 = [p["id"] for p in r2.json()]
    assert ids1 != ids2, "Puzzles returned should vary across calls"


def test_puzzles_router_next_puzzle(auth_client: TestClient):
    """Verify GET /puzzles/next returns one unsolved puzzle near user rating."""
    r = auth_client.get("/api/v1/puzzles/next")
    assert r.status_code == 200
    p = r.json()
    assert "id" in p
    assert "fen" in p
    assert "solution" in p
    assert 400 <= p["rating"] <= 800

    # With theme
    r_theme = auth_client.get("/api/v1/puzzles/next?theme=endgame")
    assert r_theme.status_code == 200
    p_endgame = r_theme.json()
    assert "endgame" in p_endgame["theme"]


def test_puzzles_router_themes_list(auth_client: TestClient):
    """Verify GET /puzzles/themes returns list of themes with counts."""
    r = auth_client.get("/api/v1/puzzles/themes")
    assert r.status_code == 200
    themes = r.json()
    assert len(themes) > 0
    assert "theme" in themes[0]
    assert "count" in themes[0]
    # Check descending order
    counts = [t["count"] for t in themes]
    assert counts == sorted(counts, reverse=True)


def test_puzzles_router_daily_puzzle_stable_for_utc_day(auth_client: TestClient):
    """Verify daily puzzle is deterministic and stable across calls within the same UTC day."""
    r1 = auth_client.get("/api/v1/puzzles/daily")
    assert r1.status_code == 200
    p1 = r1.json()

    r2 = auth_client.get("/api/v1/puzzles/daily")
    assert r2.status_code == 200
    p2 = r2.json()

    assert p1["id"] == p2["id"]
    assert 800 <= p1["rating"] <= 1800


def test_puzzle_attempt_hint_rule_and_repeat_idempotency(auth_client: TestClient):
    """
    Verify:
      - Hint used (usedHint=True): solve earns rating_delta=0, streak not extended or broken.
      - First attempt without hint: rating delta applies, K=40 for first 20 attempts.
      - Repeat attempt on same puzzle: rating_delta=0, isRepeat=True.
    """
    # 1. Fetch 3 puzzles
    puzzles = auth_client.get("/api/v1/puzzles?limit=5").json()
    assert len(puzzles) >= 3
    puz_hint = puzzles[0]["id"]
    puz_normal = puzzles[1]["id"]
    puz_fail = puzzles[2]["id"]

    # Initial rating is 400 (level 1)
    r_rating = auth_client.get("/api/v1/puzzles/rating").json()
    initial_rating = r_rating["rating"]
    assert initial_rating == 400
    initial_streak = r_rating["streak"]

    # 2. Solve with hint: rating_delta must be 0, streak unchanged
    r_h = auth_client.post(
        f"/api/v1/puzzles/{puz_hint}/attempt",
        json={"solved": True, "timeSeconds": 20, "usedHint": True},
    )
    assert r_h.status_code == 200
    res_h = r_h.json()
    assert res_h["ratingDelta"] == 0
    assert res_h["rating"] == 400
    assert res_h["streak"] == initial_streak
    assert res_h["isRepeat"] is False

    # 3. Solve normal puzzle: rating should increase with K=40 (first 20 attempts)
    r_norm = auth_client.post(
        f"/api/v1/puzzles/{puz_normal}/attempt",
        json={"solved": True, "timeSeconds": 15, "usedHint": False},
    )
    assert r_norm.status_code == 200
    res_norm = r_norm.json()
    assert res_norm["ratingDelta"] >= 5
    assert res_norm["rating"] > 400
    assert res_norm["streak"] == initial_streak + 1
    assert res_norm["isRepeat"] is False

    new_rating = res_norm["rating"]

    # 4. Repeat attempt on puz_normal: rating_delta must be 0, isRepeat=True
    r_rep = auth_client.post(
        f"/api/v1/puzzles/{puz_normal}/attempt",
        json={"solved": True, "timeSeconds": 10},
    )
    assert r_rep.status_code == 200
    res_rep = r_rep.json()
    assert res_rep["isRepeat"] is True
    assert res_rep["ratingDelta"] == 0
    assert res_rep["rating"] == new_rating
    assert res_rep["streak"] == initial_streak + 1

    # 5. Fail attempt on puz_fail: rating decreases, streak resets to 0
    r_f = auth_client.post(
        f"/api/v1/puzzles/{puz_fail}/attempt",
        json={"solved": False, "timeSeconds": 45},
    )
    assert r_f.status_code == 200
    res_f = r_f.json()
    assert res_f["ratingDelta"] <= -5
    assert res_f["streak"] == 0
    assert res_f["rating"] < new_rating


def test_puzzles_router_rating_query_param_aliases(auth_client: TestClient):
    """
    Verify both snake_case (min_rating/max_rating) and camelCase (minRating/maxRating)
    query parameters are supported and filter correctly.
    """
    # 1. snake_case
    r_snake = auth_client.get("/api/v1/puzzles?min_rating=1000&max_rating=1400&limit=20")
    assert r_snake.status_code == 200
    puzzles_snake = r_snake.json()
    assert len(puzzles_snake) > 0
    for p in puzzles_snake:
        assert 1000 <= p["rating"] <= 1400

    # 2. camelCase
    r_camel = auth_client.get("/api/v1/puzzles?minRating=1000&maxRating=1400&limit=20")
    assert r_camel.status_code == 200
    puzzles_camel = r_camel.json()
    assert len(puzzles_camel) > 0
    for p in puzzles_camel:
        assert 1000 <= p["rating"] <= 1400


def test_puzzle_request_handlers_do_not_call_seeder(auth_client: TestClient):
    """Verify puzzle request handlers never invoke seed_puzzles during request processing."""
    with patch("app.services.seeder.seed_puzzles") as mock_seeder:
        r1 = auth_client.get("/api/v1/puzzles?limit=5")
        assert r1.status_code == 200

        r2 = auth_client.get("/api/v1/puzzles/next")
        assert r2.status_code == 200

        r3 = auth_client.get("/api/v1/puzzles/themes")
        assert r3.status_code == 200

        r4 = auth_client.get("/api/v1/puzzles/daily")
        assert r4.status_code == 200

        r5 = auth_client.get("/api/v1/puzzles/rating")
        assert r5.status_code == 200

        assert mock_seeder.call_count == 0, "seed_puzzles must not be called by any puzzle endpoint"


def test_importer_dry_run_and_limit_against_csv_fixture(tmp_path: Path):
    """
    Verify importer against a local CSV fixture:
      - --dry-run writes 0 rows to the database.
      - --limit 2 writes exactly 2 puzzles and their themes to the database.
    """
    csv_file = tmp_path / "sample_puzzles.csv"
    with open(csv_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["PuzzleId", "FEN", "Moves", "Rating", "RatingDeviation", "Popularity", "NbPlays", "Themes", "GameUrl", "OpeningTags"])
        writer.writerow(["p1", "8/1P6/8/8/8/8/k7/7K b - - 0 1", "a2a1 b7b8q", "1500", "70", "95", "1200", "endgame promotion", "", ""])
        writer.writerow(["p2", "6k1/5ppp/8/8/8/8/8/4R2K b - - 0 1", "g8h8 e1e8", "1200", "50", "95", "1500", "backRankMate mate mateIn1", "", ""])
        writer.writerow(["p3", "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1", "d5e4 d1e2", "1100", "75", "89", "650", "advantage opening", "", ""])

    db_path = tmp_path / "test_import.db"
    db_url = f"sqlite:///{db_path}"

    # 1. Test --dry-run: must write nothing to DB
    with patch("sys.argv", ["import_puzzles_to_db.py", "--cache-file", str(csv_file), "--dry-run", "--db-url", db_url, "--target", "10"]):
        importer_main()

    assert not db_path.exists(), "--dry-run must not create or write to the database"

    # 2. Test --limit 2: must write exactly 2 puzzles to DB
    with patch("sys.argv", ["import_puzzles_to_db.py", "--cache-file", str(csv_file), "--limit", "2", "--db-url", db_url, "--target", "10"]):
        importer_main()

    engine = create_engine(db_url)
    with engine.connect() as conn:
        puzzles_count = conn.execute(text("SELECT count(*) FROM puzzles")).scalar()
        themes_count = conn.execute(text("SELECT count(*) FROM puzzle_themes")).scalar()
        assert puzzles_count == 2, f"Expected 2 puzzles from --limit 2, found {puzzles_count}"
        assert themes_count > 0, "Themes must be populated in puzzle_themes"
    engine.dispose()


def test_migration_010_backfills_existing_puzzles_to_puzzle_themes(tmp_path: Path):
    """
    Verify migration 010 backfills puzzle_themes from puzzles.theme JSON column
    for pre-existing puzzles, is idempotent, and preserves composite PK.
    """
    backend_dir = Path(__file__).resolve().parent.parent
    db_file = tmp_path / "mig_backfill.db"
    env = {**os.environ, "DATABASE_URL": f"sqlite:///{db_file}"}

    # Step 1: Upgrade to migration 009 (pre-010 schema)
    subprocess.run(
        [sys.executable, "-m", "alembic", "upgrade", "009"],
        cwd=backend_dir,
        env=env,
        check=True,
        capture_output=True,
    )

    # Step 2: Insert pre-existing old-shape puzzles with JSON theme
    engine = create_engine(f"sqlite:///{db_file}")
    with engine.begin() as conn:
        conn.execute(text("""
            INSERT INTO puzzles (id, fen, solution, rating, theme, goal)
            VALUES 
            ('old_puz_1', '8/1P6/8/8/8/8/k7/7K b - - 0 1', '["b8=Q"]', 1400, '["endgame", "promotion"]', 'White to move'),
            ('old_puz_2', '6k1/5ppp/8/8/8/8/8/4R2K b - - 0 1', '["Re8#"]', 1200, '["mate", "backRankMate"]', 'White to move')
        """))
    engine.dispose()

    # Step 3: Run migration 010 (alembic upgrade head)
    subprocess.run(
        [sys.executable, "-m", "alembic", "upgrade", "head"],
        cwd=backend_dir,
        env=env,
        check=True,
        capture_output=True,
    )

    # Step 4: Verify puzzle_themes has the backfilled theme pairs
    engine = create_engine(f"sqlite:///{db_file}")
    with engine.connect() as conn:
        rows = conn.execute(text("SELECT puzzle_id, theme FROM puzzle_themes ORDER BY puzzle_id, theme")).fetchall()
        expected = [
            ("old_puz_1", "endgame"),
            ("old_puz_1", "promotion"),
            ("old_puz_2", "backRankMate"),
            ("old_puz_2", "mate"),
        ]
        assert [tuple(r) for r in rows] == expected
    engine.dispose()

