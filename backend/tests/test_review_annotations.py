"""
Tests for Review Annotations and Improved Commentary (arrows, highlights, bestMove, refutation, pv).
"""

import chess
from app.schemas.game import MoveAnnotations
from app.services.annotation_service import (
    compute_move_annotations,
    compute_squares_annotation,
    compute_tint,
    generate_improved_commentary,
)

# ---------------------------------------------------------------------------
# Unit tests: compute_tint
# ---------------------------------------------------------------------------


def test_compute_tint_mappings():
    assert compute_tint("brilliant") == "brilliant"
    assert compute_tint("great") == "great"
    assert compute_tint("best") == "best"
    assert compute_tint("excellent") == "best"
    assert compute_tint("good") == "good"
    assert compute_tint("book") == "good"
    assert compute_tint("inaccuracy") == "inaccuracy"
    assert compute_tint("mistake") == "mistake"
    assert compute_tint("miss") == "miss"
    assert compute_tint("blunder") == "blunder"
    assert compute_tint(None) is None


# ---------------------------------------------------------------------------
# Unit tests: compute_squares_annotation (king-danger, hanging, attacked, target)
# ---------------------------------------------------------------------------


def test_squares_king_in_check():
    # Fool's mate position: White king on e1 is in check from Qh4
    board = chess.Board("rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3")
    assert board.is_check()
    sqs = compute_squares_annotation(board)
    assert any(s["square"] == "e1" and s["kind"] == "king-danger" for s in sqs)
    danger = next(s for s in sqs if s["square"] == "e1")
    assert "White king is in check" in danger["reason"]


def test_squares_hanging_piece():
    # White queen on d5 is completely undefended, Black to move can capture it with pawn on e6
    board = chess.Board("rnb1kbnr/pppp1ppp/4p3/3Q4/8/8/PPPPPPPP/RNB1KBNR b KQkq - 0 3")
    sqs = compute_squares_annotation(board)
    assert any(s["square"] == "d5" and s["kind"] == "hanging" for s in sqs)
    hanging = next(s for s in sqs if s["square"] == "d5")
    assert "undefended queen" in hanging["reason"]


def test_squares_miss_target_square():
    # Target square should be highlighted if space permits
    board = chess.Board()
    target_sq = chess.F7
    sqs = compute_squares_annotation(board, best_move_to_sq=target_sq, is_miss=True)
    assert any(s["square"] == "f7" and s["kind"] == "target" for s in sqs)


# ---------------------------------------------------------------------------
# Fixture tests: f3 blunder / e6 miss / cxd5 mistake / Qxc7 brilliant
# ---------------------------------------------------------------------------


def test_f3_blunder_annotations():
    # 1. e4 e5 2. f3?? allows 2... Qh4+ (or mate threats)
    board_before = chess.Board(
        "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2"
    )
    played_move = chess.Move.from_uci("f2f3")
    board_after = board_before.copy()
    board_after.push(played_move)

    pos_before = {
        "best_move_san": "Nf3",
        "eval": 0.3,
        "mate": None,
        "top_lines": [{"pv": ["Nf3", "Nc6", "Bb5"], "eval": 0.3, "mate": None}],
    }
    pos_after = {
        "best_move_san": "Qh4+",
        "eval": -2.5,
        "mate": None,
        "top_lines": [{"pv": ["Qh4+", "g3", "Qxe4+"], "eval": -2.5, "mate": None}],
    }

    ann = compute_move_annotations(
        board_before=board_before,
        board_after=board_after,
        played_move=played_move,
        san_move="f3",
        classification="blunder",
        pos_before=pos_before,
        pos_after=pos_after,
    )

    assert ann["tint"] == "blunder"
    # Rule 1: bestMove emitted for blunder with arrow kind 'best'
    assert ann["bestMove"] is not None
    assert ann["bestMove"]["san"] == "Nf3"
    assert ann["bestMove"]["from"] == "g1"
    assert ann["bestMove"]["to"] == "f3"
    assert any(
        a["kind"] == "best" and a["from"] == "g1" and a["to"] == "f3"
        for a in ann["arrows"]
    )

    # Rule 2: refutation emitted for blunder with arrow kind 'refutation'
    assert ann["refutation"] is not None
    assert ann["refutation"]["san"] == "Qh4+"
    assert ann["refutation"]["from"] == "d8"
    assert ann["refutation"]["to"] == "h4"
    assert any(
        a["kind"] == "refutation" and a["from"] == "d8" and a["to"] == "h4"
        for a in ann["arrows"]
    )

    # Commentary
    comment = generate_improved_commentary(
        san="f3",
        classification="blunder",
        best_san="Nf3",
        eval_before=0.3,
        eval_after=-2.5,
        refutation_san="Qh4+",
        squares=ann["squares"],
    )
    assert "f3" in comment
    assert "allows Qh4+" in comment or "loses" in comment
    assert "Nf3 was better." in comment


def test_cxd5_mistake_annotations():
    # Position: 1. d4 d5 2. c4 e6. White plays cxd5 (mistake)
    board_before = chess.Board(
        "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3"
    )
    played_move = chess.Move.from_uci("c4d5")
    board_after = board_before.copy()
    board_after.push(played_move)

    pos_before = {
        "best_move_san": "Nf3",
        "eval": 0.4,
        "mate": None,
        "top_lines": [{"pv": ["Nf3", "Nf6", "Nc3"], "eval": 0.4, "mate": None}],
    }
    pos_after = {
        "best_move_san": "exd5",
        "eval": 0.0,
        "mate": None,
        "top_lines": [{"pv": ["exd5", "Nf3", "Nf6"], "eval": 0.0, "mate": None}],
    }

    ann = compute_move_annotations(
        board_before=board_before,
        board_after=board_after,
        played_move=played_move,
        san_move="cxd5",
        classification="mistake",
        pos_before=pos_before,
        pos_after=pos_after,
    )

    assert ann["tint"] == "mistake"
    # Rule 1: bestMove emitted for mistake
    assert ann["bestMove"] is not None
    assert ann["bestMove"]["san"] == "Nf3"
    assert any(
        a["kind"] == "best" and a["from"] == "g1" and a["to"] == "f3"
        for a in ann["arrows"]
    )

    # Rule 2: refutation emitted for mistake
    assert ann["refutation"] is not None
    assert ann["refutation"]["san"] == "exd5"
    assert any(
        a["kind"] == "refutation" and a["from"] == "e6" and a["to"] == "d5"
        for a in ann["arrows"]
    )

    # Commentary
    comment = generate_improved_commentary(
        san="cxd5",
        classification="mistake",
        best_san="Nf3",
        eval_before=0.4,
        eval_after=0.0,
        refutation_san="exd5",
    )
    assert "cxd5" in comment
    assert "Nf3 was better." in comment


def test_e6_miss_annotations():
    # White has Qxf7# available, but plays a passive move e5 (miss)
    board_before = chess.Board(
        "r1bqkb1r/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4"
    )
    played_move = chess.Move.from_uci("e4e5")  # pushes e5 instead of delivering mate
    board_after = board_before.copy()
    board_after.push(played_move)

    pos_before = {
        "best_move_san": "Qxf7#",
        "eval": 99.0,
        "mate": 1,
        "top_lines": [{"pv": ["Qxf7#"], "eval": 99.0, "mate": 1}],
    }
    pos_after = {
        "best_move_san": "Nxe5",
        "eval": 0.0,
        "mate": None,
        "top_lines": [{"pv": ["Nxe5", "Qe2", "d5"], "eval": 0.0, "mate": None}],
    }

    ann = compute_move_annotations(
        board_before=board_before,
        board_after=board_after,
        played_move=played_move,
        san_move="e5",
        classification="miss",
        pos_before=pos_before,
        pos_after=pos_after,
    )

    assert ann["tint"] == "miss"
    # Rule 1: bestMove emitted for miss
    assert ann["bestMove"] is not None
    assert ann["bestMove"]["san"] == "Qxf7#"
    assert ann["bestMove"]["to"] == "f7"
    assert any(a["kind"] == "best" for a in ann["arrows"])

    # Target square highlight for the missed target f7
    assert any(s["square"] == "f7" and s["kind"] == "target" for s in ann["squares"])

    # Commentary
    comment = generate_improved_commentary(
        san="e5",
        classification="miss",
        best_san="Qxf7#",
        mate_before=1,
    )
    assert "e5 misses mate." in comment
    assert "Qxf7# wins mate." in comment


def test_qxc7_brilliant_annotations():
    # Brilliant queen sacrifice
    board_before = chess.Board(
        "r1b1k2r/ppq2ppp/2n1p3/3pP3/8/1QP2N2/PP1NBPPP/R3K2R w KQkq - 0 11"
    )
    played_move = chess.Move.from_uci("b3b7")
    board_after = board_before.copy()
    board_after.push(played_move)

    pos_before = {
        "best_move_san": "Qb7",
        "eval": 3.0,
        "mate": None,
        "top_lines": [{"pv": ["Qb7", "Qxb7", "Bxa6"], "eval": 3.0, "mate": None}],
    }
    pos_after = {
        "best_move_san": "Qxb7",
        "eval": 3.0,
        "mate": None,
        "top_lines": [{"pv": ["Qxb7", "Bxa6", "O-O"], "eval": 3.0, "mate": None}],
    }

    ann = compute_move_annotations(
        board_before=board_before,
        board_after=board_after,
        played_move=played_move,
        san_move="Qb7",
        classification="brilliant",
        pos_before=pos_before,
        pos_after=pos_after,
    )

    assert ann["tint"] == "brilliant"
    # Rule 1: bestMove NOT emitted for brilliant
    assert ann["bestMove"] is None
    # Rule 3: threat arrow emitted for follow-up threat
    assert any(a["kind"] == "threat" for a in ann["arrows"])

    comment = generate_improved_commentary(
        san="Qb7",
        classification="brilliant",
    )
    assert "Qb7 is brilliant:" in comment


def test_great_move_annotations():
    board_before = chess.Board(
        "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3"
    )
    played_move = chess.Move.from_uci("f1b5")
    board_after = board_before.copy()
    board_after.push(played_move)

    pos_before = {
        "best_move_san": "Bb5",
        "eval": 0.5,
        "mate": None,
        "top_lines": [{"pv": ["Bb5", "a6", "Ba4"], "eval": 0.5, "mate": None}],
    }
    pos_after = {
        "best_move_san": "a6",
        "eval": 0.5,
        "mate": None,
        "top_lines": [{"pv": ["a6", "Ba4", "Nf6"], "eval": 0.5, "mate": None}],
    }

    ann = compute_move_annotations(
        board_before=board_before,
        board_after=board_after,
        played_move=played_move,
        san_move="Bb5",
        classification="great",
        pos_before=pos_before,
        pos_after=pos_after,
    )
    assert ann["tint"] == "great"
    assert ann["bestMove"] is None
    assert any(a["kind"] == "threat" for a in ann["arrows"])

    comment = generate_improved_commentary(san="Bb5", classification="great")
    assert "Bb5 is a great move:" in comment


def test_inaccuracy_annotations():
    board_before = chess.Board()
    played_move = chess.Move.from_uci("h2h3")
    board_after = board_before.copy()
    board_after.push(played_move)

    pos_before = {
        "best_move_san": "e4",
        "eval": 0.3,
        "mate": None,
        "top_lines": [{"pv": ["e4", "e5", "Nf3"], "eval": 0.3, "mate": None}],
    }
    pos_after = {
        "best_move_san": "e5",
        "eval": 0.0,
        "mate": None,
        "top_lines": [{"pv": ["e5", "e4", "Nf6"], "eval": 0.0, "mate": None}],
    }

    ann = compute_move_annotations(
        board_before=board_before,
        board_after=board_after,
        played_move=played_move,
        san_move="h3",
        classification="inaccuracy",
        pos_before=pos_before,
        pos_after=pos_after,
    )
    assert ann["tint"] == "inaccuracy"
    assert ann["bestMove"] is not None
    assert ann["bestMove"]["san"] == "e4"
    assert any(
        a["kind"] == "best" and a["from"] == "e2" and a["to"] == "e4"
        for a in ann["arrows"]
    )
    assert ann["refutation"] is None

    comment = generate_improved_commentary(
        san="h3", classification="inaccuracy", best_san="e4"
    )
    assert comment == "h3 is slightly inaccurate. e4 keeps the edge."


# ---------------------------------------------------------------------------
# Rule 7: Book move or forced move emits only tint
# ---------------------------------------------------------------------------


def test_book_move_emits_only_tint():
    board_before = chess.Board()
    played_move = chess.Move.from_uci("e2e4")
    board_after = board_before.copy()
    board_after.push(played_move)

    ann = compute_move_annotations(
        board_before=board_before,
        board_after=board_after,
        played_move=played_move,
        san_move="e4",
        classification="book",
        is_book=True,
    )
    assert ann["tint"] == "good"
    assert ann["arrows"] == []
    assert ann["squares"] == []
    assert ann["bestMove"] is None
    assert ann["refutation"] is None
    assert ann["pv"] == []


def test_forced_move_emits_only_tint():
    # Only 1 legal move (num_legal_moves = 1)
    board_before = chess.Board()
    played_move = chess.Move.from_uci("e2e4")
    board_after = board_before.copy()
    board_after.push(played_move)

    ann = compute_move_annotations(
        board_before=board_before,
        board_after=board_after,
        played_move=played_move,
        san_move="e4",
        classification="best",
        num_legal_moves=1,
    )
    assert ann["tint"] == "best"
    assert ann["arrows"] == []
    assert ann["squares"] == []
    assert ann["bestMove"] is None
    assert ann["refutation"] is None
    assert ann["pv"] == []


# ---------------------------------------------------------------------------
# Missing engine fields fallback test
# ---------------------------------------------------------------------------


def test_missing_engine_fields_fallback():
    # When engine data is missing, arrows must be empty (never invent engine moves)
    board_before = chess.Board(
        "rnb1kbnr/pppp1ppp/4p3/3Q4/8/8/PPPPPPPP/RNB1KBNR b KQkq - 0 3"
    )
    played_move = chess.Move.from_uci("e6d5")  # Black takes queen on d5
    board_after = board_before.copy()
    board_after.push(played_move)

    ann = compute_move_annotations(
        board_before=board_before,
        board_after=board_after,
        played_move=played_move,
        san_move="exd5",
        classification="best",
        pos_before=None,
        pos_after=None,
    )

    assert ann["tint"] == "best"
    assert ann["arrows"] == []
    assert ann["bestMove"] is None
    assert ann["refutation"] is None
    assert ann["pv"] == []
    # Squares must still be computed from python-chess heuristics
    assert isinstance(ann["squares"], list)


# ---------------------------------------------------------------------------
# Schema and JSON validation test
# ---------------------------------------------------------------------------


def test_schema_move_annotations_json_dump():
    raw_ann = {
        "tint": "blunder",
        "arrows": [{"from": "f2", "to": "f3", "kind": "best"}],
        "squares": [{"square": "f3", "kind": "hanging", "reason": "undefended"}],
        "bestMove": {"san": "Nf3", "from": "g1", "to": "f3", "uci": "g1f3"},
        "refutation": {"san": "Qh4+", "from": "d8", "to": "h4", "uci": "d8h4"},
        "pv": ["Nf3", "Nc6", "Bb5"],
    }
    obj = MoveAnnotations.model_validate(raw_ann)
    dumped = obj.model_dump(by_alias=True)

    assert dumped["tint"] == "blunder"
    assert dumped["arrows"][0]["from"] == "f2"
    assert dumped["arrows"][0]["kind"] == "best"
    assert dumped["bestMove"]["san"] == "Nf3"
    assert dumped["bestMove"]["from"] == "g1"
    assert dumped["refutation"]["san"] == "Qh4+"
    assert dumped["pv"] == ["Nf3", "Nc6", "Bb5"]


# ---------------------------------------------------------------------------
# Integration test: POST /api/v1/games/{id}/evaluations stores annotations
# ---------------------------------------------------------------------------


def test_evaluations_endpoint_stores_annotations(auth_client):
    moves = ["e4", "e5", "Qh5", "Nc6", "Bc4", "Nf6", "Qxf7#"]
    body = {"moves": moves, "userColor": "white", "result": "1-0"}
    game_id = auth_client.post("/api/v1/games/coach", json=body).json()["id"]

    # Provide browser positions with lines + bestUci, pvUci, replyUci
    board = chess.Board()
    positions = []
    for i, san in enumerate([None] + moves):
        if san is not None:
            board.push_san(san)
        if board.is_game_over():
            positions.append({"lines": []})
        elif i == 5:
            # Position 5: Before Nf6 (Black to move). Best move is Qe7.
            positions.append(
                {
                    "lines": [{"pv": ["d8e7"], "cp": -50, "depth": 14}],
                    "bestUci": "d8e7",
                    "pvUci": ["d8e7"],
                }
            )
        elif i == 6:
            # Position 6: After Nf6 (White to move). Qxf7# is mate in 1.
            positions.append(
                {
                    "lines": [{"pv": ["h5f7"], "mate": 1, "depth": 14}],
                    "bestUci": "h5f7",
                    "pvUci": ["h5f7"],
                }
            )
        else:
            legal = list(board.legal_moves)
            best_uci = legal[0].uci()
            positions.append(
                {
                    "lines": [{"pv": [best_uci], "cp": 20, "depth": 14}],
                    "bestUci": best_uci,
                    "pvUci": [best_uci],
                }
            )

    resp = auth_client.post(
        f"/api/v1/games/{game_id}/evaluations",
        json={"level": "standard", "positions": positions},
    )
    assert resp.status_code == 200
    job_id = resp.json()["jobId"]
    job = auth_client.get(f"/api/v1/jobs/{job_id}").json()
    assert job["status"] == "done"

    game = auth_client.get(f"/api/v1/games/{game_id}").json()
    assert "moves" in game
    assert len(game["moves"]) == len(moves)

    # Verify that each move has annotations populated
    for m in game["moves"]:
        assert "annotations" in m
        ann = m["annotations"]
        assert ann is not None
        assert "tint" in ann
        assert "arrows" in ann
        assert "squares" in ann
        assert "pv" in ann

    # Check move 5 (Nf6) is a blunder and has bestMove, refutation, arrows
    blunder_move = game["moves"][5]
    assert blunder_move["classification"] == "blunder"
    assert blunder_move["annotations"]["tint"] == "blunder"
    assert blunder_move["annotations"]["bestMove"] is not None
    assert blunder_move["annotations"]["bestMove"]["san"] == "Qe7"
    assert blunder_move["annotations"]["refutation"] is not None
    assert blunder_move["annotations"]["refutation"]["san"] == "Qxf7#"
    assert len(blunder_move["annotations"]["arrows"]) >= 2
