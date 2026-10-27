import pytest
import chess
from app.services.engine_service import (
    ANALYSIS_LEVELS,
    LEVEL_ORDER,
    generate_line_why_template,
)
from app.services.accuracy import (
    non_pawn_material,
    compute_phase_boundaries,
    calculate_phase_grades,
)
from app.services.coach_service import generate_template_comment
from app.services.pgn_parser import parse_pgn_game
from app.schemas.game import Game


def test_analysis_levels_mapping_and_order():
    """Verify level to depth mapping and strict ordering."""
    assert "standard" in ANALYSIS_LEVELS
    assert "deep" in ANALYSIS_LEVELS
    assert "deeper" in ANALYSIS_LEVELS
    assert "max" in ANALYSIS_LEVELS

    assert ANALYSIS_LEVELS["standard"]["depth"] == 18
    assert ANALYSIS_LEVELS["deep"]["depth"] == 22
    assert ANALYSIS_LEVELS["deeper"]["depth"] == 26
    assert ANALYSIS_LEVELS["max"]["depth"] == 32

    # Verify monotonic increasing depth and time
    assert LEVEL_ORDER["standard"] < LEVEL_ORDER["deep"] < LEVEL_ORDER["deeper"] < LEVEL_ORDER["max"]
    assert ANALYSIS_LEVELS["standard"]["time_per_move"] < ANALYSIS_LEVELS["deep"]["time_per_move"]
    assert ANALYSIS_LEVELS["deep"]["time_per_move"] < ANALYSIS_LEVELS["deeper"]["time_per_move"]
    assert ANALYSIS_LEVELS["deeper"]["time_per_move"] < ANALYSIS_LEVELS["max"]["time_per_move"]


def test_non_pawn_material_counting():
    """Verify material counting matches Q=9, R=5, B=3, N=3."""
    # Starting position: each side has Q(9) + 2R(10) + 2B(6) + 2N(6) = 31 points
    start_mat = non_pawn_material("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
    assert start_mat["w"] == 31
    assert start_mat["b"] == 31
    assert start_mat["queens"] == 2

    # Endgame position: White has K+R (5 pts), Black has K+B+N (6 pts)
    endgame_mat = non_pawn_material("8/8/8/3k4/8/8/4K3/R3bn2 w - - 0 1")
    assert endgame_mat["w"] == 5
    assert endgame_mat["b"] == 6
    assert endgame_mat["queens"] == 0
    assert endgame_mat["w"] <= 13 and endgame_mat["b"] <= 13


def test_phase_boundaries_alignment():
    """
    Opening: from start to 6 half-moves after last book move, clamped to [12, 24] and <= endgameFrom.
    Endgame: starts at first position where both sides <= 13 non-pawn material.
    Middlegame: everything in between.
    """
    # 30-move dummy game with book on plies 0, 1
    moves = []
    # Starting board FEN (31 non-pawn pts each)
    heavy_fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    # Endgame board FEN (R vs R: 5 pts each <= 13)
    endgame_fen = "8/8/4k3/8/8/4K3/8/R6r w - - 0 30"

    for i in range(40):
        cls = "book" if i < 2 else "good"
        # Endgame reaches at ply 26
        fen = endgame_fen if i >= 26 else heavy_fen
        moves.append({
            "san": "e4",
            "color": "w" if i % 2 == 0 else "b",
            "classification": cls,
            "fen": fen,
            "accuracy": 85.0
        })

    opening_end, endgame_from = compute_phase_boundaries(moves)

    # last book index = 1. last_book + 1 + 6 = 8, clamped to min 12 -> opening_end = 12
    assert opening_end == 12
    # Endgame begins at ply 27 (first move resulting in <= 13 pts for both)
    assert endgame_from == 27


def test_nested_phase_grades_for_both_players():
    """Verify calculate_phase_grades returns nested white and black grades with A/B/C/D/N/A."""
    moves = []
    for i in range(30):
        color = "w" if i % 2 == 0 else "b"
        moves.append({
            "san": "Nf3" if i % 2 == 0 else "Nf6",
            "color": color,
            "classification": "book" if i < 2 else "best",
            "accuracy": 92.0 if color == "w" else 75.0,
            "fen": "8/8/8/8/8/8/8/8 w - - 0 1"
        })

    grades = calculate_phase_grades(moves)

    assert "white" in grades
    assert "black" in grades
    for color_key in ("white", "black"):
        c_grades = grades[color_key]
        assert "opening" in c_grades
        assert "middlegame" in c_grades
        assert "tactics" in c_grades
        assert "endgame" in c_grades
        for phase_name in ("opening", "middlegame", "tactics", "endgame"):
            assert c_grades[phase_name] in ("A", "B", "C", "D", "N/A")


def test_commentary_quality_and_concrete_why():
    """
    Verify:
    1. eval.why describes the played move concrete action
    2. comments clamp to <= 220 characters
    3. refutation lines are present for mistakes/blunders
    """
    board = chess.Board("rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2")
    move = chess.Move.from_uci("g1f3")
    why_text = generate_line_why_template(board, move)
    assert "knight" in why_text.lower()
    assert "f3" in why_text

    # Mistake with refutation PV
    comment_mistake = generate_template_comment(
        san="f4",
        classification="mistake",
        best_move="Nf3",
        eval_before=-0.8,
        eval_after=-2.2,
        pv=["Nf3", "d5", "d4"],
        color="w"
    )
    assert "mistake" in comment_mistake
    assert "Nf3" in comment_mistake
    assert "Nf3 d5 d4" in comment_mistake
    assert len(comment_mistake) <= 220

    # Blunder with refutation PV
    comment_blunder = generate_template_comment(
        san="Qa4",
        classification="blunder",
        best_move="fxe6",
        eval_before=-0.5,
        eval_after=-8.0,
        pv=["fxe6", "Qxe6", "Nf3"],
        color="w"
    )
    assert "blunder" in comment_blunder
    assert "fxe6" in comment_blunder
    assert "fxe6 Qxe6 Nf3" in comment_blunder
    assert len(comment_blunder) <= 220


def test_termination_parsed_from_pgn():
    """Verify termination header is extracted from PGN."""
    pgn = """[Event "Live Chess"]
[Site "Chess.com"]
[Date "2026.10.20"]
[White "Aahanafrr"]
[Black "rogeralukka"]
[Result "0-1"]
[Termination "rogeralukka won by resignation"]

1. e4 d5 2. exd5 0-1"""

    parsed = parse_pgn_game(pgn, target_user_names=["rogeralukka"])
    assert parsed.get("termination") == "rogeralukka won by resignation"
