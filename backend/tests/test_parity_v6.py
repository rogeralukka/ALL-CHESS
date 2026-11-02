"""
Tests for Parity v6:
1. Explain sentences filled for 100% of non-book, non-forced moves (<= 110 chars each).
2. Proven reasons (material SEE, pin/skewer/fork, mate threat, check, castling, development, centre, passed pawn, trade).
3. Zero banned filler words in explain[] or eval.lines[].why.
4. PV refutations legal from board_after for blunders/mistakes; best continuations from board_before for others.
5. eval.lines[].why is either a proven sentence (<= 110 chars) or None (null in JSON).
"""

import json
import os
import chess

from app.config import BACKEND_DIR
from app.services.coach_service import generate_template_comment

BANNED_FILLER_WORDS = [
    "tactical harmony",
    "piece harmony",
    "positional continuation",
    "sharp and critical continuation",
    "keeps the balance",
    "keeping your position steady",
    "maintains maximum pressure",
    "maintains tactical harmony",
    "solid positional continuation",
    "firmer positional pressure",
    "engine recommended line",
]


def test_v6_no_banned_filler_words_in_any_game():
    """Ensure no explain sentence or line why across all 4 stored fixtures contains banned filler."""
    fixture_path = os.path.join(BACKEND_DIR, "tests", "fixtures", "parity_games_evals.json")
    with open(fixture_path, "r", encoding="utf-8") as f:
        games = json.load(f)

    banned_hits = []
    for gid, g in games.items():
        for idx, m in enumerate(g.get("moves", [])):
            ann = m.get("annotations") or {}
            for sent in ann.get("explain", []):
                s_low = sent.lower()
                for b in BANNED_FILLER_WORDS:
                    if b in s_low:
                        banned_hits.append((gid, idx, "explain", b, sent))

            ev = m.get("eval") or {}
            for line in ev.get("lines", []):
                why = line.get("why")
                if why:
                    w_low = why.lower()
                    for b in BANNED_FILLER_WORDS:
                        if b in w_low:
                            banned_hits.append((gid, idx, "why", b, why))

    assert len(banned_hits) == 0, f"Found banned filler words: {banned_hits}"


def test_v6_coach_service_no_banned_filler():
    """Ensure generate_template_comment has no banned filler words across all classes."""
    for cls in ("brilliant", "great", "best", "excellent", "good", "book", "forced", "inaccuracy", "mistake", "blunder", "miss"):
        cmt = generate_template_comment(
            san="Nf3",
            classification=cls,
            best_move="Nf3",
            eval_before=0.5,
            eval_after=0.5,
            pv=["Nf3", "Nc6"],
            color="w",
        )
        c_low = cmt.lower()
        for b in BANNED_FILLER_WORDS:
            assert b not in c_low, f"Banned filler '{b}' found in generate_template_comment for {cls}: {cmt}"


def test_v6_four_fixtures_explain_coverage_and_proven_rate():
    """
    Asserts:
    - 100% of non-book, non-forced moves have >= 1 explain sentence
    - Every sentence <= 110 characters
    - > 50% of non-book, non-forced moves have a concrete proven reason
    """
    fixture_path = os.path.join(BACKEND_DIR, "tests", "fixtures", "parity_games_evals.json")
    with open(fixture_path, "r", encoding="utf-8") as f:
        games = json.load(f)

    total_non_book = 0
    with_explain = 0
    proven_count = 0

    for gid, g in games.items():
        for m in g.get("moves", []):
            cl = m.get("classification")
            if cl in ("book", "forced"):
                continue

            total_non_book += 1
            ann = m.get("annotations") or {}
            expl = ann.get("explain", [])
            rc = ann.get("reasonCode", "")

            if len(expl) >= 1:
                with_explain += 1

            for s in expl:
                assert len(s) <= 110, f"Explain sentence exceeds 110 chars: '{s}' ({len(s)})"

            # Proven reason check
            has_proven_sentence = any(
                keyword in s
                for s in expl
                for keyword in (
                    "wins ", "leaves your ", "loses your ", "allows ",
                    "threatens mate", "fork", "skewer", "pin", "Castles",
                    "trades ", "captures ", "gives check", "passed pawn",
                    "centre", "develops ", "open ", "semi-open",
                    "centralizes ", "solidifies "
                )
            )
            is_proven_rc = rc in (
                "loses_piece", "allows_mate", "allows_check", "mate_threat",
                "fork", "skewer", "pin", "castling", "trade", "capture",
                "capture_undefended", "check", "passed_pawn", "centre_control",
                "development", "open_file", "semi_open_file", "central_knight",
                "pawn_structure",
            )
            if is_proven_rc or has_proven_sentence:
                proven_count += 1

    assert total_non_book > 0
    assert with_explain == total_non_book, f"Expected 100% explain coverage, got {with_explain}/{total_non_book}"
    proven_pct = (proven_count / total_non_book) * 100.0
    assert proven_pct >= 50.0, f"Expected >= 50% proven reasons, got {proven_pct:.1f}% ({proven_count}/{total_non_book})"


def test_v6_pv_refutation_legal_from_board_after():
    """
    For blunders and mistakes, PV must be legal from board_after.
    For misses, inaccuracies, and best moves, PV must be legal from board_before.
    """
    fixture_path = os.path.join(BACKEND_DIR, "tests", "fixtures", "parity_games_evals.json")
    with open(fixture_path, "r", encoding="utf-8") as f:
        games = json.load(f)

    for gid, g in games.items():
        board = chess.Board()
        for m in g.get("moves", []):
            san = m["san"]
            cl = (m.get("classification") or "").lower()
            mv = board.parse_san(san)
            b_before = board.copy()
            board.push(mv)
            b_after = board.copy()

            ann = m.get("annotations") or {}
            pv = ann.get("pv", [])
            if not pv:
                continue

            if cl in ("blunder", "mistake"):
                tb = b_after.copy()
                first_pv = pv[0]
                try:
                    tb.parse_san(first_pv)
                except Exception as e:
                    assert False, f"Game {gid} move {san} ({cl}): PV {first_pv} not legal on board_after: {e}"
            elif cl in ("miss", "inaccuracy", "best"):
                tb = b_before.copy()
                first_pv = pv[0]
                try:
                    tb.parse_san(first_pv)
                except Exception as e:
                    assert False, f"Game {gid} move {san} ({cl}): PV {first_pv} not legal on board_before: {e}"


def test_v6_lines_why_concrete_or_null():
    """Every lines[].why must be <= 110 chars and either a non-empty string or None."""
    fixture_path = os.path.join(BACKEND_DIR, "tests", "fixtures", "parity_games_evals.json")
    with open(fixture_path, "r", encoding="utf-8") as f:
        games = json.load(f)

    for gid, g in games.items():
        for m in g.get("moves", []):
            ev = m.get("eval") or {}
            for line in ev.get("lines", []):
                why = line.get("why")
                if why is not None:
                    assert isinstance(why, str)
                    assert len(why) <= 110, f"why string exceeds 110 chars: '{why}'"
                    assert len(why.strip()) > 0
                    for b in BANNED_FILLER_WORDS:
                        assert b not in why.lower()
