"""
Tests for Chess.com parity v3:
  1. estimate_game_rating monotonic curve calibration
  2. Book moves & bookEnd in review payload
  3. Miss definition (Game A h5, Game B cxd4)
  4. Brilliant (Game A f4) & Great move classifications
  5. mateIn on MoveEval and TopEngineLine
  6. Annotation rules from Section 3 (arrows, squares, tints)
  7. Parity fixture verification across Game A, Game B, Earlier Game
"""

import json
import os
from collections import Counter
import chess

from app.config import BACKEND_DIR
from app.schemas.game import MoveEval, TopEngineLine
from app.services.accuracy import estimate_game_rating, estimate_performance_ratings
from app.services.annotation_service import compute_move_annotations
from app.services.classifier import (
    classify_move,
    is_material_sacrifice,
)
from app.services.engine_service import (
    BOOK_POSITION_EPDS,
    BOOK_PREFIXES,
)
from app.services.win_pct import eval_to_win_pct


# ---------------------------------------------------------------------------
# 1. Game rating monotonic calibration
# ---------------------------------------------------------------------------


def test_estimate_game_rating_calibration():
    # Prompt calibration points:
    # 53.0 -> 150, 63.9 -> 650, 68.0 -> 900, 72.1 -> 1200, 75.3 -> 1300, 81.3 -> 1500
    points = [
        (53.0, 150),
        (63.9, 650),
        (68.0, 900),
        (72.1, 1200),
        (74.2, 1250),
        (75.3, 1300),
        (81.3, 1500),
        (83.3, 1550),  # Chess.com, game 186073066724 re-reviewed (rogeralukka 83.3 -> 1550, Max_2404 74.2 -> 1250)
    ]
    for acc, expected in points:
        est = estimate_game_rating(acc)
        assert est is not None
        assert abs(est - expected) <= 50, f"Accuracy {acc} rated {est}, expected ~{expected}"

    # Bounds & monotone properties
    r_prev = estimate_game_rating(50.0)
    for a in range(51, 100):
        r_curr = estimate_game_rating(float(a))
        assert r_curr >= r_prev, f"Rating curve not monotone at {a}%"
        r_prev = r_curr

    assert estimate_game_rating(0.0) == 100
    assert estimate_game_rating(100.0) == 2500
    # no more runaway extrapolation above the last measured point (85.8% used to give 1836)
    assert estimate_game_rating(85.8) <= 1650

    # estimate_performance_ratings uses estimate_game_rating
    perf = estimate_performance_ratings({"white": 68.0, "black": 75.3})
    assert abs(perf["white"] - 900) <= 50
    assert abs(perf["black"] - 1300) <= 50


# ---------------------------------------------------------------------------
# 2. Book moves & bookEnd
# ---------------------------------------------------------------------------


def test_eco_book_moves_and_book_end():
    # Scandinavian Defense: 1. e4 d5
    b = chess.Board()
    b.push_san("e4")
    assert ("e4",) in BOOK_PREFIXES or b.epd() in BOOK_POSITION_EPDS
    b.push_san("d5")
    assert ("e4", "d5") in BOOK_PREFIXES or b.epd() in BOOK_POSITION_EPDS

    # Game A opening sequence: 1. e4 Nc6 2. Nf3 e5 3. Bc4 d6
    game_a_moves = ["e4", "Nc6", "Nf3", "e5", "Bc4", "d6"]
    b_test = chess.Board()
    prefix = []
    for m in game_a_moves:
        prefix.append(m)
        b_test.push_san(m)
        is_book = tuple(prefix) in BOOK_PREFIXES or b_test.epd() in BOOK_POSITION_EPDS
        assert is_book, f"Move {m} in sequence should be in ECO book"


def test_book_moves_never_inaccuracies():
    # Even if eval drop exists, book move is always 'book'
    cls = classify_move(
        eval_before_pawns=0.5,
        eval_after_pawns=-1.0,
        color="w",
        is_book=True,
    )
    assert cls == "book"


# ---------------------------------------------------------------------------
# 3. Miss definition: Game A h5 and Game B cxd4
# ---------------------------------------------------------------------------


def test_game_a_h5_miss():
    # Game A ply 15: Black plays h5 instead of capturing Nxe4 (+0.14 -> +2.76, drop ~22%)
    cls = classify_move(
        eval_before_pawns=0.14,
        eval_after_pawns=2.76,
        color="b",
        opponent_just_made_mistake=True,
        is_top_engine_move=False,
        best_wins_material_or_mate=True,
        best_eval_gap=2.62,
    )
    assert cls == "miss"


def test_game_b_cxd4_miss():
    # Game B ply 22: White plays cxd4 instead of Bg5 skewer (-0.36 -> -2.73, drop ~20%)
    cls = classify_move(
        eval_before_pawns=-0.36,
        eval_after_pawns=-2.73,
        color="w",
        opponent_just_made_mistake=True,
        is_top_engine_move=False,
        best_wins_material_or_mate=True,
        best_eval_gap=2.37,
    )
    assert cls == "miss"


# ---------------------------------------------------------------------------
# 4. Brilliant (Game A f4) & Great moves
# ---------------------------------------------------------------------------


def test_game_a_bf4_brilliant():
    # Game A ply 41: Black plays Bf4 (piece sacrifice), eval stays -6.07 (drop 1.7%, win% 90.3%)
    board_before = chess.Board("2k4r/1pp2p2/p1n2qp1/4p1b1/2N1P3/PQPB1bPp/1P3P1P/4R1K1 b - - 1 21")
    move = chess.Move.from_uci("g5f4")
    assert is_material_sacrifice(board_before, move)

    cls = classify_move(
        eval_before_pawns=-6.65,
        eval_after_pawns=-6.07,
        color="b",
        is_sacrifice=True,
        is_top_engine_move=False,
        is_recapture=False,
    )
    assert cls == "brilliant"


def test_great_move_classification():
    # Single top engine move with large gap to second (gap >= 6.0%)
    cls = classify_move(
        eval_before_pawns=0.5,
        eval_after_pawns=0.5,
        color="w",
        is_top_engine_move=True,
        is_recapture=False,
        num_legal_moves=10,
        gap_to_second_win_pct=8.0,
    )
    assert cls == "great"


# ---------------------------------------------------------------------------
# 5. mateIn on MoveEval and TopEngineLine schemas
# ---------------------------------------------------------------------------


def test_mate_in_schemas():
    line = TopEngineLine(
        move="Qxf7#",
        eval=99.0,
        mate=1,
        mateIn=1,
        depth=14,
        why="Delivers mate",
        pv=["Qxf7#"],
    )
    dumped_line = line.model_dump(by_alias=True)
    assert dumped_line["mateIn"] == 1

    me = MoveEval(
        eval=99.0,
        mate=5,
        mateIn=5,
        bestMove="Qxf7#",
        lines=[line],
    )
    dumped_eval = me.model_dump(by_alias=True)
    assert dumped_eval["mateIn"] == 5
    assert dumped_eval["lines"][0]["mateIn"] == 1


# ---------------------------------------------------------------------------
# 6. Annotation rules from Section 3
# ---------------------------------------------------------------------------


def test_annotation_section3_rules():
    # 1. Book / best / excellent / good: no arrows, no squares
    board = chess.Board()
    for cl in ("book", "best", "excellent", "good"):
        ann = compute_move_annotations(
            board_before=board,
            board_after=board,
            played_move=chess.Move.from_uci("e2e4"),
            san_move="e4",
            classification=cl,
        )
        assert ann["arrows"] == []
        assert ann["squares"] == []

    # 2. Miss: exactly ONE arrow (kind: "best"), no refutation arrow
    b_before = chess.Board("r1bqkb1r/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4")
    m_miss = chess.Move.from_uci("e4e5")
    b_after = b_before.copy()
    b_after.push(m_miss)
    pos_b = {"best_move_san": "Qxf7#", "eval": 99.0, "mate": 1, "top_lines": [{"pv": ["Qxf7#"], "eval": 99.0, "mate": 1}]}
    pos_a = {"best_move_san": "Nxe5", "eval": 0.0, "mate": None, "top_lines": [{"pv": ["Nxe5"], "eval": 0.0, "mate": None}]}
    ann_miss = compute_move_annotations(
        board_before=b_before,
        board_after=b_after,
        played_move=m_miss,
        san_move="e5",
        classification="miss",
        pos_before=pos_b,
        pos_after=pos_a,
    )
    assert len(ann_miss["arrows"]) == 1
    assert ann_miss["arrows"][0]["kind"] == "best"
    assert ann_miss["refutation"] is None

    # 3. Mistake: refutation arrow first, best arrow second. Blunder: refutation arrow only (v5 rule)
    ann_mistake = compute_move_annotations(
        board_before=b_before,
        board_after=b_after,
        played_move=m_miss,
        san_move="e5",
        classification="mistake",
        pos_before=pos_b,
        pos_after=pos_a,
    )
    assert len(ann_mistake["arrows"]) == 2
    assert ann_mistake["arrows"][0]["kind"] == "refutation"
    assert ann_mistake["arrows"][1]["kind"] == "best"

    ann_blunder = compute_move_annotations(
        board_before=b_before,
        board_after=b_after,
        played_move=m_miss,
        san_move="e5",
        classification="blunder",
        pos_before=pos_b,
        pos_after=pos_a,
    )
    assert len(ann_blunder["arrows"]) == 1
    assert ann_blunder["arrows"][0]["kind"] == "refutation"
    assert len(ann_blunder["squares"]) == 0


# ---------------------------------------------------------------------------
# 7. Regression & Parity Fixture Test on the Three Games
# ---------------------------------------------------------------------------


def test_parity_three_games_fixture():
    fixture_path = os.path.join(BACKEND_DIR, "tests", "fixtures", "parity_games_evals.json")
    assert os.path.isfile(fixture_path), "parity_games_evals.json fixture missing"
    with open(fixture_path, "r", encoding="utf-8") as f:
        evals_data = json.load(f)

    chesscom_targets = {
        "170446908310": {
            "name": "Game A",
            "white": {"brilliant": 0, "great": 1, "book": 3, "best": 9, "excellent": 8, "good": 6, "inaccuracy": 1, "mistake": 3, "miss": 1, "blunder": 2},
            "black": {"brilliant": 1, "great": 1, "book": 3, "best": 10, "excellent": 10, "good": 4, "inaccuracy": 2, "mistake": 1, "miss": 2, "blunder": 0},
        },
        "185643420616": {
            "name": "Game B",
            "white": {"brilliant": 0, "great": 1, "book": 1, "best": 7, "excellent": 2, "good": 6, "inaccuracy": 5, "mistake": 2, "miss": 4, "blunder": 1},
            "black": {"brilliant": 0, "great": 2, "book": 1, "best": 6, "excellent": 8, "good": 3, "inaccuracy": 6, "mistake": 1, "miss": 0, "blunder": 2},
        },
        "186073066724": {
            "name": "Earlier Game",
            "white": {"brilliant": 1, "great": 2, "book": 2, "best": 15, "excellent": 8, "good": 4, "inaccuracy": 2, "mistake": 0, "miss": 2, "blunder": 0},
            "black": {"brilliant": 0, "great": 0, "book": 3, "best": 11, "excellent": 9, "good": 2, "inaccuracy": 3, "mistake": 6, "miss": 1, "blunder": 0},
        },
    }

    print("\n" + "=" * 80)
    print(f"{'Game':<12} | {'Side':<5} | {'Class':<11} | {'Chess.com':<10} | {'Ours':<6} | {'Residual'}")
    print("=" * 80)

    for gid, targets in chesscom_targets.items():
        data = evals_data[gid]
        moves = data["moves"]
        is_in_book = True
        sans_so_far = []
        last_made_mistake = False

        for idx, m in enumerate(moves):
            board_before = chess.Board(m["_fen_before"])
            san = m["san"]
            sans_so_far.append(san)
            board_after = chess.Board(m["_fen_after"])

            is_bk = False
            if is_in_book:
                if tuple(sans_so_far) in BOOK_PREFIXES or board_after.epd() in BOOK_POSITION_EPDS:
                    is_bk = True
                else:
                    is_in_book = False

            played_move = chess.Move.from_uci(board_before.parse_san(san).uci())
            is_sac = is_material_sacrifice(board_before, played_move)

            is_recap = False
            if board_before.move_stack:
                prev_m = board_before.peek()
                if played_move.to_square == prev_m.to_square:
                    b_copy = board_before.copy()
                    b_copy.pop()
                    if b_copy.is_capture(prev_m) and board_before.is_capture(played_move):
                        is_recap = True

            lines = m["eval"].get("lines", [])
            gap_2nd = 0.0
            best_eval_gap = 0.0
            best_wins_mat = False
            if lines:
                top_l = lines[0]
                b_ev = top_l.get("eval", m["_eval_after"])
                b_m = top_l.get("mate")
                if m["color"] == "w":
                    best_eval_gap = b_ev - m["_eval_after"]
                else:
                    best_eval_gap = m["_eval_after"] - b_ev
                if b_m is not None:
                    best_wins_mat = True
                else:
                    tb = board_before.copy()
                    mover_color = chess.WHITE if m["color"] == "w" else chess.BLACK
                    opp_color = chess.BLACK if m["color"] == "w" else chess.WHITE
                    init_mat = sum([1, 3, 3, 5, 9][p - 1] * len(tb.pieces(p, mover_color)) for p in range(1, 6)) - sum([1, 3, 3, 5, 9][p - 1] * len(tb.pieces(p, opp_color)) for p in range(1, 6))
                    for psan in top_l.get("pv", [])[:4]:
                        try:
                            tb.push_san(psan)
                        except Exception:
                            break
                        cur_mat = sum([1, 3, 3, 5, 9][p - 1] * len(tb.pieces(p, mover_color)) for p in range(1, 6)) - sum([1, 3, 3, 5, 9][p - 1] * len(tb.pieces(p, opp_color)) for p in range(1, 6))
                        if cur_mat - init_mat >= 1:
                            best_wins_mat = True
                            break
                if len(lines) >= 2:
                    w1 = eval_to_win_pct(lines[0]["eval"], lines[0].get("mate"))
                    w2 = eval_to_win_pct(lines[1]["eval"], lines[1].get("mate"))
                    gap_2nd = abs(w1 - w2)

            is_top = (san == m["eval"].get("bestMove"))

            c = classify_move(
                eval_before_pawns=m["_eval_before"],
                eval_after_pawns=m["_eval_after"],
                color=m["color"],
                is_book=is_bk,
                is_sacrifice=is_sac,
                gap_to_second_win_pct=gap_2nd,
                opponent_just_made_mistake=last_made_mistake,
                is_top_engine_move=is_top,
                is_checkmate=(m["eval"].get("mate") == 0),
                is_recapture=is_recap,
                num_legal_moves=len(list(board_before.legal_moves)),
                best_wins_material_or_mate=best_wins_mat,
                best_eval_gap=best_eval_gap,
            )
            last_made_mistake = c in ("inaccuracy", "mistake", "miss", "blunder")
            m["test_classification"] = c

        w_cnt = Counter(m["test_classification"] for m in moves if m["color"] == "w")
        b_cnt = Counter(m["test_classification"] for m in moves if m["color"] == "b")

        # Assert key parity milestones:
        if gid == "170446908310":
            # Game A: Book 3/3, Brilliant Black 1/1, Blunder 2/0
            assert w_cnt.get("book", 0) == 3
            assert b_cnt.get("book", 0) == 3
            assert b_cnt.get("brilliant", 0) == 1
            assert b_cnt.get("blunder", 0) == 0
            assert w_cnt.get("blunder", 0) == 2
        elif gid == "185643420616":
            # Game B: Book 1/1, Miss >= 3 for White
            assert w_cnt.get("book", 0) == 1
            assert b_cnt.get("book", 0) == 1
            assert w_cnt.get("miss", 0) >= 3

        for side, counts, cc_counts in [("White", w_cnt, targets["white"]), ("Black", b_cnt, targets["black"])]:
            for cl in ["brilliant", "great", "book", "best", "excellent", "good", "inaccuracy", "mistake", "miss", "blunder"]:
                cc = cc_counts.get(cl, 0)
                us = counts.get(cl, 0)
                res = us - cc
                print(f"{targets['name']:<12} | {side:<5} | {cl:<11} | {cc:<10} | {us:<6} | {res:+d}")
