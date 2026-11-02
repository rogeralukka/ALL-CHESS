"""
Tests for Parity v4: Commentary v2, Reason Codes, Mate Squares, Review Summary,
and Depth-14 Parity on Game A, Game B, and Earlier Game.
"""

import json
import os
from collections import Counter
import chess

from app.config import BACKEND_DIR
from app.services.annotation_service import (
    compute_commentary_v2,
    compute_move_annotations,
    generate_improved_commentary,
)
from app.services.engine_service import generate_review_headline


def test_commentary_v2_scholars_mate_blunder():
    # 1.e4 e5 2.Qh5 Nc6 3.Bc4 Nf6?? -> "Nf6 allows mate in 1. Qe7 was better."
    board_before = chess.Board()
    for m_str in ["e4", "e5", "Qh5", "Nc6", "Bc4"]:
        board_before.push_san(m_str)

    played_move = chess.Move.from_uci("g8f6")
    board_after = board_before.copy()
    board_after.push(played_move)

    pos_before = {
        "best_move_san": "Qe7",
        "eval": -0.5,
        "mate": None,
        "top_lines": [{"pv": ["Qe7", "Nf3", "Nf6"], "eval": -0.5, "mate": None}],
    }
    pos_after = {
        "best_move_san": "Qxf7#",
        "eval": 99.0,
        "mate": 1,
        "top_lines": [{"pv": ["Qxf7#"], "eval": 99.0, "mate": 1}],
    }

    ann = compute_move_annotations(
        board_before=board_before,
        board_after=board_after,
        played_move=played_move,
        san_move="Nf6",
        classification="blunder",
        pos_before=pos_before,
        pos_after=pos_after,
    )

    assert ann["reasonCode"] == "allows_mate"
    assert "Nf6 allows mate in 1." in ann["explain"][0]
    assert "Qe7 was better." in ann["explain"][1]
    assert "f7" in ann["mateSquares"]
    assert "e8" in ann["mateSquares"]

    comment = generate_improved_commentary(
        san="Nf6",
        classification="blunder",
        best_san="Qe7",
        board_before=board_before,
        board_after=board_after,
        played_move=played_move,
    )
    assert comment == "Nf6 allows mate in 1. Qe7 was better."


def test_commentary_v2_piece_drop_blunder():
    # Blunder that drops a piece: Re1 loses your rook on e1. Rd3 was better.
    board_before = chess.Board("4q1k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1")
    played_move = chess.Move.from_uci("d1e1")
    board_after = board_before.copy()
    board_after.push(played_move)

    pos_before = {
        "best_move_san": "Rd3",
        "eval": 0.0,
        "mate": None,
        "top_lines": [{"pv": ["Rd3"], "eval": 0.0, "mate": None}],
    }
    pos_after = {
        "best_move_san": "Qxe1#",
        "eval": -99.0,
        "mate": -1,
        "top_lines": [{"pv": ["Qxe1#"], "eval": -99.0, "mate": -1}],
    }

    ann = compute_move_annotations(
        board_before=board_before,
        board_after=board_after,
        played_move=played_move,
        san_move="Re1",
        classification="blunder",
        pos_before=pos_before,
        pos_after=pos_after,
    )

    assert ann["reasonCode"] in ("allows_mate", "loses_piece")
    assert "Re1" in ann["explain"][0]
    assert "Rd3 was better." in ann["explain"][1]

    # Non-mating piece drop: White bishop moves to d5 where Black pawn on c6 captures it undefended
    board_drop_after = chess.Board("rnbqkbnr/pp1ppppp/2p5/3B4/8/8/PPPPPPPP/RNBQK1NR b KQkq - 0 2")
    details = compute_commentary_v2(
        san="Bd5",
        classification="blunder",
        best_san="Nf3",
        board_after=board_drop_after,
        played_move=chess.Move.from_uci("f1d5"),
    )
    assert details["reason_code"] == "loses_piece"
    assert "Bd5 loses your bishop on d5." in details["explain"]
    assert "Nf3 was better." in details["explain"]


def test_commentary_v2_fallback_mistake():
    # Fallback -> "h5 is a mistake. Nxe4 was better."
    details = compute_commentary_v2(
        san="h5",
        classification="mistake",
        best_san="Nxe4",
    )
    assert details["reason_code"] == "mistake"
    assert details["explain"] == ["h5 is a mistake.", "Nxe4 was better."]
    assert details["comment"] == "h5 is a mistake. Nxe4 was better."


def test_commentary_v2_inaccuracy_lowercase_pawn():
    # Pawn SANs stay lowercase ("f6 ..."); the comment starts with the exact SAN.
    details = compute_commentary_v2(
        san="f6",
        classification="inaccuracy",
        best_san="c5",
    )
    assert details["reason_code"] == "inaccuracy"
    assert details["explain"] == ["f6 is slightly inaccurate.", "c5 keeps the edge."]
    assert details["comment"] == "f6 is slightly inaccurate. c5 keeps the edge."
    assert details["comment"].startswith("f6 ")


def test_review_summary_headline():
    headline = generate_review_headline({"white": 68.1, "black": 73.3})
    assert "White played with 68.1% accuracy" in headline
    assert "Black played with 73.3% accuracy" in headline


def test_depth_14_parity_fixture_verification():
    fixture_path = os.path.join(BACKEND_DIR, "tests", "fixtures", "parity_games_evals.json")
    assert os.path.isfile(fixture_path), "parity_games_evals.json fixture missing"
    with open(fixture_path, "r", encoding="utf-8") as f:
        evals_data = json.load(f)

    # 1. Game A (170446908310)
    data_a = evals_data["170446908310"]
    acc_a = data_a["accuracy"]
    assert abs(acc_a["white"] - 68.0) <= 2.0, f"Game A White accuracy {acc_a['white']} vs 68.0"
    assert abs(acc_a["black"] - 75.3) <= 2.0, f"Game A Black accuracy {acc_a['black']} vs 75.3"
    assert "reviewSummary" in data_a
    assert data_a["reviewSummary"]["headline"] is not None

    b_moves_a = [m for m in data_a["moves"] if m["color"] == "b"]
    b_cnt_a = Counter(m["classification"] for m in b_moves_a)
    # Check that Black classes are within +-1 of Chess.com
    cc_black_a = {"brilliant": 1, "great": 1, "book": 3, "best": 10, "excellent": 10, "good": 4, "inaccuracy": 2, "mistake": 1, "miss": 2, "blunder": 0}
    for cl, cc_val in cc_black_a.items():
        our_val = b_cnt_a.get(cl, 0)
        assert abs(our_val - cc_val) <= 1, f"Game A Black {cl}: ours {our_val} vs CC {cc_val}"

    # 2. Game B (185643420616)
    data_b = evals_data["185643420616"]
    acc_b = data_b["accuracy"]
    assert abs(acc_b["black"] - 63.9) <= 2.0, f"Game B Black accuracy {acc_b['black']} vs 63.9"

    w_moves_b = [m for m in data_b["moves"] if m["color"] == "w"]
    w_cnt_b = Counter(m["classification"] for m in w_moves_b)
    assert w_cnt_b.get("blunder", 0) == 1  # CC 1
    assert abs(w_cnt_b.get("mistake", 0) - 2) <= 1  # CC 2, ours 1
    assert w_cnt_b.get("miss", 0) == 4     # CC 4, ours 4

    b_moves_b = [m for m in data_b["moves"] if m["color"] == "b"]
    b_cnt_b = Counter(m["classification"] for m in b_moves_b)
    assert b_cnt_b.get("blunder", 0) == 2  # CC 2, ours 2
    assert b_cnt_b.get("mistake", 0) == 1  # CC 1, ours 1
    assert abs(b_cnt_b.get("inaccuracy", 0) - 6) <= 1  # CC 6, ours 5

    # 3. Earlier Game (186073066724)
    data_e = evals_data["186073066724"]
    b_moves_e = [m for m in data_e["moves"] if m["color"] == "b"]
    b_cnt_e = Counter(m["classification"] for m in b_moves_e)
    # Fixed from earlier far-off state (Good 13 vs 2, Mistake 0 vs 6, Inaccuracy 0 vs 3)
    assert abs(b_cnt_e.get("good", 0) - 2) <= 1, f"Earlier Game Black good: {b_cnt_e.get('good', 0)} vs 2"
    assert abs(b_cnt_e.get("inaccuracy", 0) - 3) <= 1, f"Earlier Game Black inaccuracy: {b_cnt_e.get('inaccuracy', 0)} vs 3"
    assert abs(b_cnt_e.get("mistake", 0) - 6) <= 1, f"Earlier Game Black mistake: {b_cnt_e.get('mistake', 0)} vs 6"
