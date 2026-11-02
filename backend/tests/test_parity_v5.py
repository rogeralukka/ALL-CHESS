"""
Tests for Parity v5: Chess.com-exact arrows, squares, and forced move classification.
Covers:
1. Visual language & arrow/square schema per class (10 classes).
2. Threat arrow generation (orange) and priority.
3. Forced move classification and review summary counts.
4. Fixture validation across the 4 games in parity_games_evals.json.
5. Non-regression: valid squares, castling as king move, no empty square references.
"""

import json
import os
import chess

from app.config import BACKEND_DIR
from app.services.annotation_service import compute_move_annotations
from app.services.classifier import classify_move


def test_v5_arrow_square_schema_all_classes():
    """
    Test the visual language table in Section 0 for all 10 move classes.
    """
    b_before = chess.Board("r1bqkb1r/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4")
    m = chess.Move.from_uci("e4e5")
    b_after = b_before.copy()
    b_after.push(m)

    pos_before = {
        "best_move_san": "Qxf7#",
        "best_uci": "h5f7",
        "eval": 99.0,
        "mate": 1,
        "top_lines": [{"pv": ["Qxf7#"], "eval": 99.0, "mate": 1}],
    }
    pos_after = {
        "best_move_san": "Nxe5",
        "best_uci": "c6e5",
        "eval": 0.0,
        "mate": None,
        "top_lines": [{"pv": ["Nxe5"], "eval": 0.0, "mate": None}],
    }

    # 1. Book: no arrows, no squares
    ann_book = compute_move_annotations(
        board_before=b_before,
        board_after=b_after,
        played_move=m,
        san_move="e5",
        classification="book",
    )
    assert ann_book["arrows"] == []
    assert ann_book["squares"] == []

    # 2. Forced: no arrows, no squares, tint is None
    ann_forced = compute_move_annotations(
        board_before=b_before,
        board_after=b_after,
        played_move=m,
        san_move="e5",
        classification="forced",
        num_legal_moves=1,
    )
    assert ann_forced["arrows"] == []
    assert ann_forced["squares"] == []
    assert ann_forced["tint"] is None
    assert ann_forced["reasonCode"] == "forced"

    # 3. Inaccuracy: exactly 1 GREEN best arrow, no squares
    ann_inacc = compute_move_annotations(
        board_before=b_before,
        board_after=b_after,
        played_move=m,
        san_move="e5",
        classification="inaccuracy",
        pos_before=pos_before,
        pos_after=pos_after,
    )
    assert len(ann_inacc["arrows"]) == 1
    assert ann_inacc["arrows"][0]["kind"] == "best"
    assert ann_inacc["squares"] == []

    # 4. Miss: GREEN best arrow (+ optional BLUE alt arrow), GREEN target square
    ann_miss = compute_move_annotations(
        board_before=b_before,
        board_after=b_after,
        played_move=m,
        san_move="e5",
        classification="miss",
        pos_before=pos_before,
        pos_after=pos_after,
    )
    assert len(ann_miss["arrows"]) >= 1
    assert ann_miss["arrows"][0]["kind"] == "best"
    assert any(s["kind"] == "target" and s.get("tone") == "green" for s in ann_miss["squares"])

    # 5. Mistake: RED refutation arrow + GREEN best arrow, ORANGE target square
    ann_mistake = compute_move_annotations(
        board_before=b_before,
        board_after=b_after,
        played_move=m,
        san_move="e5",
        classification="mistake",
        pos_before=pos_before,
        pos_after=pos_after,
    )
    assert len(ann_mistake["arrows"]) == 2
    assert ann_mistake["arrows"][0]["kind"] == "refutation"
    assert ann_mistake["arrows"][1]["kind"] == "best"
    assert any(s["kind"] == "target" and s.get("tone") == "orange" for s in ann_mistake["squares"])

    # 6. Blunder: RED refutation arrow ONLY, NO best arrow, NO squares
    ann_blunder = compute_move_annotations(
        board_before=b_before,
        board_after=b_after,
        played_move=m,
        san_move="e5",
        classification="blunder",
        pos_before=pos_before,
        pos_after=pos_after,
    )
    assert len(ann_blunder["arrows"]) == 1
    assert ann_blunder["arrows"][0]["kind"] == "refutation"
    assert ann_blunder["squares"] == []

    # 7. Best / Excellent / Good: 0-2 threat arrows, optional attacked squares
    for cl in ("best", "excellent", "good"):
        ann_good = compute_move_annotations(
            board_before=b_before,
            board_after=b_after,
            played_move=m,
            san_move="e5",
            classification=cl,
            pos_before=pos_before,
            pos_after=pos_after,
        )
        for arr in ann_good["arrows"]:
            assert arr["kind"] == "threat"
        for sq in ann_good["squares"]:
            assert sq["kind"] == "attacked"


def test_forced_move_classification():
    """
    Test forced classification logic:
    When num_legal_moves == 1, classify_move returns 'forced'.
    """
    # Check that regardless of eval swing, if num_legal_moves == 1, it's forced
    cls1 = classify_move(
        eval_before_pawns=0.0,
        eval_after_pawns=0.0,
        color="w",
        is_top_engine_move=True,
        num_legal_moves=1,
    )
    assert cls1 == "forced"

    cls2 = classify_move(
        eval_before_pawns=-5.0,
        eval_after_pawns=-5.0,
        color="b",
        is_top_engine_move=False,
        num_legal_moves=1,
    )
    assert cls2 == "forced"


def test_best_uci_included():
    """
    Test that bestUci (e.g. 'd1d3') is emitted on annotations.
    """
    b_before = chess.Board("r1bqkb1r/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4")
    m = chess.Move.from_uci("e4e5")
    b_after = b_before.copy()
    b_after.push(m)

    pos_before = {
        "best_move_san": "Qxf7#",
        "eval": 99.0,
        "mate": 1,
        "top_lines": [{"pv": ["Qxf7#"], "eval": 99.0, "mate": 1}],
    }
    ann = compute_move_annotations(
        board_before=b_before,
        board_after=b_after,
        played_move=m,
        san_move="e5",
        classification="inaccuracy",
        pos_before=pos_before,
        pos_after={"top_lines": []},
    )
    assert ann["bestUci"] == "h5f7"
    assert ann["bestMove"]["san"] == "Qxf7#"


def test_castling_arrow_is_king_move():
    """
    Castling arrows must be king moves (e1->g1, e8->g8, e1->c1, e8->c8), never rook moves.
    """
    board = chess.Board("rnbqk2r/pppp1ppp/5n2/2b1p3/4P3/5N2/PPPPBPPP/RNBQK2R w KQkq - 4 4")
    castle_move = chess.Move.from_uci("e1g1")
    board_after = board.copy()
    board_after.push(castle_move)

    ann = compute_move_annotations(
        board_before=board,
        board_after=board_after,
        played_move=castle_move,
        san_move="O-O",
        classification="best",
        pos_before={"top_lines": []},
        pos_after={"top_lines": []},
    )
    for a in ann["arrows"]:
        if a["from"] in ("e1", "e8"):
            assert a["to"] in ("g1", "c1", "g8", "c8")
        assert a["from"] not in ("h1", "a1", "h8", "a8")


def test_parity_v5_four_games_fixture():
    """
    Validate parity across all 4 games in parity_games_evals.json:
    - Game A (170446908310)
    - Game B (185643420616)
    - Earlier Game (186073066724)
    - 4th fixture: Game 186256716770 (rogeralukka vs Silva_Daltro)
    """
    fixture_path = os.path.join(BACKEND_DIR, "tests", "fixtures", "parity_games_evals.json")
    assert os.path.isfile(fixture_path), "parity_games_evals.json fixture missing"
    with open(fixture_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    assert "186256716770" in data, "Game 186256716770 missing from fixture"
    assert len(data) >= 4, "Expected at least 4 fixture games"

    game4 = data["186256716770"]
    moves4 = game4["moves"]
    assert len(moves4) == 59, f"Expected 59 plies, got {len(moves4)}"

    # Check review summary counts
    rev_summary = game4["reviewSummary"]
    assert "counts" in rev_summary
    counts = rev_summary["counts"]
    assert "forced" in counts
    assert counts["forced"] == 1
    total_counted = sum(counts.values())
    assert total_counted == len(moves4), f"Counts sum {total_counted} != total plies {len(moves4)}"

    # Check specific plies from Section 0 in Game 4
    # Ply 6 (3... c5): threat arrow c5->d4
    ply_c5 = moves4[5]
    assert ply_c5["san"] == "c5"
    assert any(a["from"] == "c5" and a["to"] == "d4" and a["kind"] == "threat" for a in ply_c5["annotations"]["arrows"])

    # Ply 8 (4... Nc6): threat arrows c6->d4 and c6->e5
    ply_nc6 = moves4[7]
    assert ply_nc6["san"] == "Nc6"
    assert any(a["from"] == "c6" and a["to"] == "d4" and a["kind"] == "threat" for a in ply_nc6["annotations"]["arrows"])

    # Ply 10 (5... Nf6): threat arrows f6->e4 and f6->d5
    ply_nf6 = moves4[9]
    assert ply_nf6["san"] == "Nf6"
    assert any(a["from"] == "f6" and a["to"] == "e4" and a["kind"] == "threat" for a in ply_nf6["annotations"]["arrows"])

    # Ply 11 (6. b3): inaccuracy, best arrow e3->e4, no squares
    ply_b3 = moves4[10]
    assert ply_b3["san"] == "b3"
    assert ply_b3["classification"] == "inaccuracy"
    assert any(a["kind"] == "best" for a in ply_b3["annotations"]["arrows"])
    assert len(ply_b3["annotations"]["squares"]) == 0

    # Ply 15 (8. Qf3): blunder, refutation arrow c8->g4 only, no best arrow, no squares
    ply_qf3 = moves4[14]
    assert ply_qf3["san"] == "Qf3"
    assert ply_qf3["classification"] == "blunder"
    assert len(ply_qf3["annotations"]["arrows"]) == 1
    assert ply_qf3["annotations"]["arrows"][0]["kind"] == "refutation"
    assert ply_qf3["annotations"]["arrows"][0]["from"] == "c8"
    assert ply_qf3["annotations"]["arrows"][0]["to"] == "g4"
    assert len(ply_qf3["annotations"]["squares"]) == 0

    # Ply 16 (8... Be6): mistake, refutation arrow + best arrow + orange target square
    ply_be6 = moves4[15]
    assert ply_be6["san"] == "Be6"
    assert ply_be6["classification"] == "mistake"
    kinds = [a["kind"] for a in ply_be6["annotations"]["arrows"]]
    assert "refutation" in kinds
    assert "best" in kinds
    assert any(s["kind"] == "target" and s.get("tone") == "orange" for s in ply_be6["annotations"]["squares"])

    # Ply 21 (11. cxd5): miss, best arrow + target square with tone green
    ply_cxd5 = moves4[20]
    assert ply_cxd5["san"] == "cxd5"
    assert ply_cxd5["classification"] == "miss"
    assert any(a["kind"] == "best" for a in ply_cxd5["annotations"]["arrows"])
    assert any(s["kind"] == "target" and s.get("tone") == "green" for s in ply_cxd5["annotations"]["squares"])

    # Ply 22 (11... Qxc3): brilliant, threat arrows + attacked squares
    ply_qxc3 = moves4[21]
    assert ply_qxc3["san"] == "Qxc3"
    assert ply_qxc3["classification"] in ("great", "brilliant")
    assert any(a["kind"] == "threat" for a in ply_qxc3["annotations"]["arrows"])
    assert any(s["kind"] == "attacked" for s in ply_qxc3["annotations"]["squares"])

    # Ply 34 (17... Qe1+): best, check, threat arrow
    ply_qe1 = moves4[33]
    assert ply_qe1["san"] == "Qe1+"
    assert any(a["kind"] == "threat" for a in ply_qe1["annotations"]["arrows"])

    # Ply 35 (18. Kb2): forced, no arrows, no squares, tint is None
    ply_kb2 = moves4[34]
    assert ply_kb2["san"] == "Kb2"
    assert ply_kb2["classification"] == "forced"
    assert ply_kb2["annotations"]["tint"] is None
    assert ply_kb2["annotations"]["arrows"] == []
    assert ply_kb2["annotations"]["squares"] == []

    # Non-regression across all games: verify square and arrow validity
    for gid, game in data.items():
        for idx, m in enumerate(game["moves"]):
            ann = m.get("annotations") or {}
            for arr in ann.get("arrows", []):
                assert arr["kind"] in ("threat", "best", "refutation", "alt")
                # Squares must be valid algebraic e.g. 'e4'
                assert len(arr["from"]) == 2 and arr["from"][0] in "abcdefgh" and arr["from"][1] in "12345678"
                assert len(arr["to"]) == 2 and arr["to"][0] in "abcdefgh" and arr["to"][1] in "12345678"
            for sq in ann.get("squares", []):
                assert sq["kind"] in ("attacked", "target", "king-danger", "hanging")
                assert len(sq["square"]) == 2 and sq["square"][0] in "abcdefgh" and sq["square"][1] in "12345678"
                if sq["kind"] == "target":
                    assert sq.get("tone") in ("green", "orange", None)
