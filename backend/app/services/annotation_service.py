"""
Annotation Service for ALL-CHESS Game Review.

Computes visual review annotations matching Chess.com:
  - Square tint based on move quality
  - Arrows (best move, refutation, follow-up threat, missed tactic)
  - Target/hanging/king-danger square highlights with plain English reasons
  - bestMove and refutation references
  - Up to 6 PV moves for the Explain stepper
  - Commentary v2: reasonCode, explain[], mateSquares[]
"""

from typing import Any

import chess

PIECE_VALUES = {
    chess.PAWN: 1,
    chess.KNIGHT: 3,
    chess.BISHOP: 3,
    chess.ROOK: 5,
    chess.QUEEN: 9,
    chess.KING: 100,
}

PIECE_NAMES = {
    chess.PAWN: "pawn",
    chess.KNIGHT: "knight",
    chess.BISHOP: "bishop",
    chess.ROOK: "rook",
    chess.QUEEN: "queen",
    chess.KING: "king",
}


def compute_tint(classification: str | None) -> str | None:
    """Maps move classification to Chess.com square tint."""
    if not classification:
        return None
    cls = classification.lower()
    if cls in (
        "brilliant",
        "great",
        "best",
        "good",
        "inaccuracy",
        "mistake",
        "miss",
        "blunder",
    ):
        return cls
    if cls == "excellent":
        return "best"
    if cls == "book":
        return "good"
    return None


def _resolve_move_on_board(board: chess.Board, cand: Any) -> chess.Move | None:
    """Attempts to resolve a move candidate (chess.Move, SAN, UCI) against a board."""
    if isinstance(cand, chess.Move):
        return cand if cand in board.legal_moves else None
    if isinstance(cand, str):
        try:
            m = board.parse_san(cand)
            if m in board.legal_moves:
                return m
        except Exception:
            pass
        try:
            m = chess.Move.from_uci(cand)
            if m in board.legal_moves:
                return m
        except Exception:
            pass
    return None


def resolve_pv_moves(
    board: chess.Board, pv: list[Any], max_moves: int = 6
) -> list[chess.Move]:
    """Resolves a sequence of PV moves (SAN, UCI, Move) iteratively on copies of board."""
    moves: list[chess.Move] = []
    tb = board.copy()
    for item in pv[:max_moves]:
        m = _resolve_move_on_board(tb, item)
        if m:
            moves.append(m)
            tb.push(m)
        else:
            break
    return moves


def compute_squares_annotation(
    board_after: chess.Board,
    best_move_to_sq: chess.Square | None = None,
    is_miss: bool = False,
) -> list[dict[str, str]]:
    """
    Identifies up to 4 significant squares after the move:
      - King square if in check (kind: "king-danger")
      - Hanging or profitably capturable enemy pieces (kind: "hanging" | "attacked")
      - Missed tactic target square if applicable (kind: "target")
    """
    squares: list[dict[str, str]] = []
    seen_squares = set()

    # 1. King in check
    if board_after.is_check():
        k_sq = board_after.king(board_after.turn)
        if k_sq is not None:
            sq_name = chess.square_name(k_sq)
            turn_name = "White" if board_after.turn == chess.WHITE else "Black"
            squares.append(
                {
                    "square": sq_name,
                    "kind": "king-danger",
                    "reason": f"{turn_name} king is in check",
                }
            )
            seen_squares.add(sq_name)

    # 2. Hanging and profitably capturable pieces for the side to move
    att_color = board_after.turn
    def_color = not att_color

    candidate_squares: list[dict[str, Any]] = []
    for sq in chess.SQUARES:
        tgt_piece = board_after.piece_at(sq)
        if (
            not tgt_piece
            or tgt_piece.color != def_color
            or tgt_piece.piece_type == chess.KING
        ):
            continue

        sq_name = chess.square_name(sq)
        if sq_name in seen_squares:
            continue

        att_attackers = board_after.attackers(att_color, sq)
        if not att_attackers:
            continue

        def_defenders = board_after.attackers(def_color, sq)
        lowest_att_sq = min(
            att_attackers,
            key=lambda s: PIECE_VALUES.get(board_after.piece_at(s).piece_type, 10),
        )
        lowest_att = board_after.piece_at(lowest_att_sq)
        if not lowest_att:
            continue

        att_name = PIECE_NAMES.get(lowest_att.piece_type, "piece")
        tgt_name = PIECE_NAMES.get(tgt_piece.piece_type, "piece")
        tgt_val = PIECE_VALUES.get(tgt_piece.piece_type, 0)
        att_val = PIECE_VALUES.get(lowest_att.piece_type, 0)

        if not def_defenders:
            candidate_squares.append(
                {
                    "square": sq_name,
                    "kind": "hanging",
                    "reason": f"{att_name} can capture the undefended {tgt_name}",
                    "priority": tgt_val * 10,
                }
            )
        elif tgt_val > att_val:
            candidate_squares.append(
                {
                    "square": sq_name,
                    "kind": "attacked",
                    "reason": f"{att_name} can capture the {tgt_name}",
                    "priority": (tgt_val - att_val) * 5,
                }
            )

    # Sort candidates by priority descending
    candidate_squares.sort(key=lambda x: x["priority"], reverse=True)
    for c in candidate_squares:
        if len(squares) >= 4:
            break
        squares.append(
            {"square": c["square"], "kind": c["kind"], "reason": c["reason"]}
        )
        seen_squares.add(c["square"])

    # 3. Destination of best move as target square (blunder, mistake, miss, inaccuracy)
    if best_move_to_sq is not None and len(squares) < 4:
        target_name = chess.square_name(best_move_to_sq)
        if target_name not in seen_squares:
            squares.append(
                {
                    "square": target_name,
                    "kind": "target",
                    "reason": "best move target",
                }
            )
            seen_squares.add(target_name)

    return squares[:4]


def compute_commentary_v2(
    san: str,
    classification: str | None,
    best_san: str | None = None,
    board_before: chess.Board | None = None,
    board_after: chess.Board | None = None,
    played_move: chess.Move | None = None,
    eval_before: float | None = None,
    eval_after: float | None = None,
    mate_before: int | None = None,
    mate_after: int | None = None,
    refutation_san: str | None = None,
    squares: list[dict[str, str]] | None = None,
    is_book: bool = False,
) -> dict[str, Any]:
    """
    Computes Commentary v2 with structured reasons, exact SAN start, and lowercase pawn SANs:
      - reason_code: e.g. "allows_mate", "loses_piece", "blunder", "mistake", "inaccuracy",
                     "missed_tactic", "tactical_sacrifice", "only_move", "best_move",
                     "book_move", "solid_move", "excellent_move"
      - explain: list[str] of 1-2 concise, filler-free sentences
      - mate_squares: list[str] of critical mating squares
      - comment: " ".join(explain)
    """
    cls = (classification or "").lower()
    mate_squares: list[str] = []

    # 1. Mate allowed or delivered
    is_mate_case = False
    opponent_mate_in_1 = False
    mating_move = None
    if board_after:
        if board_after.is_checkmate():
            is_mate_case = True
            k_sq = board_after.king(not board_after.turn)
            if k_sq is not None:
                mate_squares.append(chess.square_name(k_sq))
            s1 = f"{san} allows checkmate."
            reason_code = "allows_mate"
        else:
            for m in board_after.legal_moves:
                board_after.push(m)
                if board_after.is_checkmate():
                    opponent_mate_in_1 = True
                    mating_move = m
                    board_after.pop()
                    break
                board_after.pop()

            if opponent_mate_in_1 and mating_move:
                is_mate_case = True
                m_to = chess.square_name(mating_move.to_square)
                # The king being mated belongs to the mover (not board_after.turn)
                k_sq = board_after.king(not board_after.turn)
                k_name = chess.square_name(k_sq) if k_sq is not None else None
                if m_to not in mate_squares:
                    mate_squares.append(m_to)
                if k_name and k_name not in mate_squares:
                    mate_squares.append(k_name)
                s1 = f"{san} allows mate in 1."
                reason_code = "allows_mate"

    if (
        not is_mate_case
        and mate_after is not None
        and abs(mate_after) <= 3
        and cls in ("blunder", "mistake")
    ):
        is_mate_case = True
        reason_code = "allows_mate"
        m_count = abs(mate_after)
        s1 = f"{san} allows mate in {m_count}."
        if board_after:
            k_sq = board_after.king(not board_after.turn)
            if k_sq is not None:
                k_name = chess.square_name(k_sq)
                if k_name not in mate_squares:
                    mate_squares.append(k_name)

    if is_mate_case:
        alt = f"{best_san} was better." if best_san and best_san != san else None
        explain = [s1, alt] if alt else [s1]
        return {
            "reason_code": reason_code,
            "explain": explain,
            "mate_squares": mate_squares,
            "comment": " ".join(explain),
        }

    # 2. Check for piece drop proven by python-chess
    if cls in ("blunder", "mistake"):
        hanging_piece_desc = None
        if board_after:
            def_color = not board_after.turn
            att_color = board_after.turn
            # Check the piece just played
            if played_move:
                moved_pc = board_after.piece_at(played_move.to_square)
                if (
                    moved_pc
                    and moved_pc.color == def_color
                    and moved_pc.piece_type != chess.KING
                ):
                    att = board_after.attackers(att_color, played_move.to_square)
                    defs = board_after.attackers(def_color, played_move.to_square)
                    if att and not defs:
                        p_name = PIECE_NAMES.get(moved_pc.piece_type, "piece")
                        sq_name = chess.square_name(played_move.to_square)
                        hanging_piece_desc = f"{p_name} on {sq_name}"

            # If not moved piece, check other hanging pieces
            if not hanging_piece_desc and squares:
                for sq_info in squares:
                    if sq_info.get("kind") == "hanging":
                        sq_str = sq_info.get("square")
                        if sq_str:
                            sq_idx = chess.parse_square(sq_str)
                            pc = board_after.piece_at(sq_idx)
                            if pc and pc.color == def_color and pc.piece_type != chess.KING:
                                p_name = PIECE_NAMES.get(pc.piece_type, "piece")
                                hanging_piece_desc = f"{p_name} on {sq_str}"
                                break

        if hanging_piece_desc:
            s1 = f"{san} loses your {hanging_piece_desc}."
            alt = f"{best_san} was better." if best_san and best_san != san else None
            explain = [s1, alt] if alt else [s1]
            return {
                "reason_code": "loses_piece",
                "explain": explain,
                "mate_squares": [],
                "comment": " ".join(explain),
            }

        # Check refutation check move (e.g. Qh4+)
        if refutation_san and (refutation_san.endswith("+") or refutation_san.endswith("#")):
            s1 = f"{san} allows {refutation_san}."
            alt = f"{best_san} was better." if best_san and best_san != san else None
            explain = [s1, alt] if alt else [s1]
            return {
                "reason_code": cls,
                "explain": explain,
                "mate_squares": [],
                "comment": " ".join(explain),
            }

        if cls == "blunder":
            s1 = f"{san} is a blunder."
            alt = f"{best_san} was better." if best_san and best_san != san else None
            explain = [s1, alt] if alt else [s1]
            return {
                "reason_code": "blunder",
                "explain": explain,
                "mate_squares": [],
                "comment": " ".join(explain),
            }

        s1 = f"{san} is a mistake."
        alt = f"{best_san} was better." if best_san and best_san != san else None
        explain = [s1, alt] if alt else [s1]
        return {
            "reason_code": "mistake",
            "explain": explain,
            "mate_squares": [],
            "comment": " ".join(explain),
        }

    # 3. Miss
    if cls == "miss":
        if mate_before is not None or (mate_after is not None and abs(mate_after) <= 1):
            s1 = f"{san} misses mate."
            alt = f"{best_san} wins mate." if best_san and best_san != san else None
        else:
            s1 = f"{san} misses a tactical opportunity."
            alt = f"{best_san} wins material." if best_san and best_san != san else None
        explain = [s1, alt] if alt else [s1]
        return {
            "reason_code": "missed_tactic",
            "explain": explain,
            "mate_squares": [],
            "comment": " ".join(explain),
        }

    # 4. Inaccuracy
    if cls == "inaccuracy":
        s1 = f"{san} is slightly inaccurate."
        alt = f"{best_san} keeps the edge." if best_san and best_san != san else None
        explain = [s1, alt] if alt else [s1]
        return {
            "reason_code": "inaccuracy",
            "explain": explain,
            "mate_squares": [],
            "comment": " ".join(explain),
        }

    # 5. Brilliant
    if cls == "brilliant":
        s1 = f"{san} is brilliant: a tactical sacrifice that seizes the initiative."
        return {
            "reason_code": "tactical_sacrifice",
            "explain": [s1],
            "mate_squares": [],
            "comment": s1,
        }

    # 6. Great
    if cls == "great":
        s1 = f"{san} is a great move: the only move that maintains the advantage."
        return {
            "reason_code": "only_move",
            "explain": [s1],
            "mate_squares": [],
            "comment": s1,
        }

    # 7. Best
    if cls == "best":
        s1 = f"{san} is best."
        return {
            "reason_code": "best_move",
            "explain": [s1],
            "mate_squares": [],
            "comment": s1,
        }

    # 8. Book
    if is_book or cls == "book":
        s1 = f"{san} is a book move."
        return {
            "reason_code": "book_move",
            "explain": [s1],
            "mate_squares": [],
            "comment": s1,
        }

    # 9. Excellent
    if cls == "excellent":
        s1 = f"{san} is an excellent move."
        return {
            "reason_code": "excellent_move",
            "explain": [s1],
            "mate_squares": [],
            "comment": s1,
        }

    # 10. Good
    if cls == "good":
        s1 = f"{san} is a solid move."
        return {
            "reason_code": "solid_move",
            "explain": [s1],
            "mate_squares": [],
            "comment": s1,
        }

    s1 = f"{san} was played."
    return {
        "reason_code": "normal_move",
        "explain": [s1],
        "mate_squares": [],
        "comment": s1,
    }


def compute_move_annotations(
    board_before: chess.Board,
    board_after: chess.Board,
    played_move: chess.Move | None,
    san_move: str,
    classification: str | None,
    pos_before: dict[str, Any] | None = None,
    pos_after: dict[str, Any] | None = None,
    is_book: bool = False,
    num_legal_moves: int = 20,
    ext_pos_before: dict[str, Any] | None = None,
    ext_pos_after: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """
    Computes annotations payload for a single move according to prompt rules.
    """
    tint = compute_tint(classification)
    cls_lower = (classification or "").lower()

    # Rule: book / best / excellent / good: no arrows, no squares (Chess.com shows only tints)
    # Forced move (<= 1 legal move) also emits only tint.
    is_forced = num_legal_moves <= 1
    if is_book or cls_lower in ("book", "best", "excellent", "good") or is_forced:
        details = compute_commentary_v2(
            san=san_move,
            classification=classification,
            best_san=None,
            board_before=board_before,
            board_after=board_after,
            played_move=played_move,
            is_book=is_book,
        )
        return {
            "tint": tint,
            "arrows": [],
            "squares": [],
            "bestMove": None,
            "refutation": None,
            "pv": [],
            "reasonCode": details["reason_code"],
            "explain": details["explain"],
            "mateSquares": details["mate_squares"],
        }

    pos_before = pos_before or {}
    pos_after = pos_after or {}
    ext_pos_before = ext_pos_before or {}
    ext_pos_after = ext_pos_after or {}

    # Check for engine data availability
    top_lines_before = pos_before.get("top_lines") or []
    top_lines_after = pos_after.get("top_lines") or []
    has_engine_data = bool(
        top_lines_before
        or top_lines_after
        or ext_pos_before.get("best_uci")
        or ext_pos_before.get("pv_uci")
        or ext_pos_before.get("reply_uci")
        or ext_pos_before.get("lines")
        or ext_pos_after.get("best_uci")
        or ext_pos_after.get("lines")
    )

    if not has_engine_data:
        squares = compute_squares_annotation(
            board_after, best_move_to_sq=None, is_miss=False
        )
        details = compute_commentary_v2(
            san=san_move,
            classification=classification,
            best_san=None,
            board_before=board_before,
            board_after=board_after,
            played_move=played_move,
            squares=squares,
            is_book=is_book,
        )
        return {
            "tint": tint,
            "arrows": [],
            "squares": squares,
            "bestMove": None,
            "refutation": None,
            "pv": [],
            "reasonCode": details["reason_code"],
            "explain": details["explain"],
            "mateSquares": details["mate_squares"],
        }

    # 1. Resolve PV before
    raw_pv_before: list[Any] = []
    if ext_pos_before.get("pv_uci"):
        raw_pv_before = ext_pos_before["pv_uci"]
    elif top_lines_before and top_lines_before[0].get("pv"):
        raw_pv_before = top_lines_before[0]["pv"]
    elif ext_pos_before.get("best_uci"):
        raw_pv_before = [ext_pos_before["best_uci"]]

    pv_moves_before = resolve_pv_moves(board_before, raw_pv_before, max_moves=6)

    best_chess_move: chess.Move | None = None
    if ext_pos_before.get("best_uci"):
        best_chess_move = _resolve_move_on_board(
            board_before, ext_pos_before["best_uci"]
        )
    if not best_chess_move and pv_moves_before:
        best_chess_move = pv_moves_before[0]

    # 2. Resolve PV after (reply / refutation)
    raw_pv_after: list[Any] = []
    if ext_pos_after.get("pv_uci"):
        raw_pv_after = ext_pos_after["pv_uci"]
    elif top_lines_after and top_lines_after[0].get("pv"):
        raw_pv_after = top_lines_after[0]["pv"]
    elif ext_pos_after.get("best_uci"):
        raw_pv_after = [ext_pos_after["best_uci"]]
    elif ext_pos_before.get("reply_uci"):
        raw_pv_after = [ext_pos_before["reply_uci"]]

    pv_moves_after = resolve_pv_moves(board_after, raw_pv_after, max_moves=6)

    reply_chess_move: chess.Move | None = None
    if ext_pos_before.get("reply_uci"):
        reply_chess_move = _resolve_move_on_board(
            board_after, ext_pos_before["reply_uci"]
        )
    elif ext_pos_after.get("best_uci"):
        reply_chess_move = _resolve_move_on_board(
            board_after, ext_pos_after["best_uci"]
        )
    elif pv_moves_after:
        reply_chess_move = pv_moves_after[0]

    best_san: str | None = None
    if best_chess_move:
        try:
            best_san = board_before.san(best_chess_move)
        except Exception:
            best_san = best_chess_move.uci()

    reply_san: str | None = None
    if reply_chess_move:
        try:
            reply_san = board_after.san(reply_chess_move)
        except Exception:
            reply_san = reply_chess_move.uci()

    best_move_obj = None
    if best_chess_move and cls_lower in ("inaccuracy", "mistake", "miss", "blunder"):
        best_move_obj = {
            "san": best_san,
            "from": chess.square_name(best_chess_move.from_square),
            "to": chess.square_name(best_chess_move.to_square),
            "uci": best_chess_move.uci(),
        }

    refutation_obj = None
    if reply_chess_move and cls_lower in ("mistake", "blunder"):
        refutation_obj = {
            "san": reply_san,
            "from": chess.square_name(reply_chess_move.from_square),
            "to": chess.square_name(reply_chess_move.to_square),
            "uci": reply_chess_move.uci(),
        }

    # PV (first up to 6 SAN moves of best line from position before)
    pv_sans: list[str] = []
    tb = board_before.copy()
    for m in pv_moves_before[:6]:
        try:
            pv_sans.append(tb.san(m))
            tb.push(m)
        except Exception:
            break

    # Helper: check if arrow duplicates played move
    def is_dup_played(m_obj: chess.Move) -> bool:
        return bool(
            played_move
            and m_obj.from_square == played_move.from_square
            and m_obj.to_square == played_move.to_square
        )

    arrows: list[dict[str, str]] = []
    squares: list[dict[str, str]] = []

    if cls_lower in ("brilliant", "great"):
        threat_move = None
        if len(pv_moves_after) >= 2:
            threat_move = pv_moves_after[1]
        elif len(pv_moves_before) >= 3:
            threat_move = pv_moves_before[2]

        if threat_move and not is_dup_played(threat_move):
            arrows.append({
                "from": chess.square_name(threat_move.from_square),
                "to": chess.square_name(threat_move.to_square),
                "kind": "threat",
            })
        squares = []

    elif cls_lower == "miss":
        if best_chess_move and not is_dup_played(best_chess_move):
            arrows.append({
                "from": chess.square_name(best_chess_move.from_square),
                "to": chess.square_name(best_chess_move.to_square),
                "kind": "best",
            })
        best_target_sq = best_chess_move.to_square if best_chess_move else None
        squares = compute_squares_annotation(board_after, best_move_to_sq=best_target_sq, is_miss=True)

    elif cls_lower in ("blunder", "mistake"):
        if reply_chess_move and not is_dup_played(reply_chess_move):
            arrows.append({
                "from": chess.square_name(reply_chess_move.from_square),
                "to": chess.square_name(reply_chess_move.to_square),
                "kind": "refutation",
            })
        if best_chess_move and not is_dup_played(best_chess_move):
            arrows.append({
                "from": chess.square_name(best_chess_move.from_square),
                "to": chess.square_name(best_chess_move.to_square),
                "kind": "best",
            })
        best_target_sq = best_chess_move.to_square if best_chess_move else None
        squares = compute_squares_annotation(board_after, best_move_to_sq=best_target_sq, is_miss=False)

    elif cls_lower == "inaccuracy":
        if best_chess_move and not is_dup_played(best_chess_move):
            arrows.append({
                "from": chess.square_name(best_chess_move.from_square),
                "to": chess.square_name(best_chess_move.to_square),
                "kind": "best",
            })
        best_target_sq = best_chess_move.to_square if best_chess_move else None
        squares = compute_squares_annotation(board_after, best_move_to_sq=best_target_sq, is_miss=False)

    details = compute_commentary_v2(
        san=san_move,
        classification=classification,
        best_san=best_san,
        board_before=board_before,
        board_after=board_after,
        played_move=played_move,
        eval_before=pos_before.get("eval") if pos_before else None,
        eval_after=pos_after.get("eval") if pos_after else None,
        mate_before=pos_before.get("mate") if pos_before else None,
        mate_after=pos_after.get("mate") if pos_after else None,
        refutation_san=reply_san,
        squares=squares,
        is_book=is_book,
    )

    return {
        "tint": tint,
        "arrows": arrows[:2],
        "squares": squares[:4],
        "bestMove": best_move_obj,
        "refutation": refutation_obj,
        "pv": pv_sans,
        "reasonCode": details["reason_code"],
        "explain": details["explain"],
        "mateSquares": details["mate_squares"],
    }


def generate_improved_commentary(
    san: str,
    classification: str | None,
    best_san: str | None = None,
    eval_before: float | None = None,
    eval_after: float | None = None,
    mate_before: int | None = None,
    mate_after: int | None = None,
    color: str = "w",
    refutation_san: str | None = None,
    squares: list[dict[str, str]] | None = None,
    is_sacrifice: bool = False,
    best_wins_material_or_mate: bool = False,
    board_before: chess.Board | None = None,
    board_after: chess.Board | None = None,
    played_move: chess.Move | None = None,
    is_book: bool = False,
) -> str:
    """
    Concise, specific commentary matching Chess.com:
      - blunder/mistake: "<SAN> <loses|allows> <what>. <Best SAN> was better."
      - miss: "<SAN> misses <tactic>. <Best SAN> wins <material|mate>."
      - inaccuracy: "<SAN> is slightly inaccurate. <Best SAN> keeps the edge."
      - brilliant/great: "<SAN> is <brilliant|a great move>: <reason>."
      - Starts with exact SAN, pawn SAN lowercase.
    """
    details = compute_commentary_v2(
        san=san,
        classification=classification,
        best_san=best_san,
        board_before=board_before,
        board_after=board_after,
        played_move=played_move,
        eval_before=eval_before,
        eval_after=eval_after,
        mate_before=mate_before,
        mate_after=mate_after,
        refutation_san=refutation_san,
        squares=squares,
        is_book=is_book,
    )
    return details["comment"]
