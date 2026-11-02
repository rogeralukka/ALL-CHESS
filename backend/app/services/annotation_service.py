"""
Annotation Service for ALL-CHESS Game Review.

Computes visual review annotations matching Chess.com:
  - Square tint based on move quality
  - Arrows (threat orange, best green, refutation red, alt blue)
  - Target/hanging/king-danger/attacked square highlights with tones
  - bestMove, bestUci, and refutation references
  - Up to 6 PV moves for the Explain stepper
  - Commentary v2: reasonCode, explain[], mateSquares[]
"""

from typing import Any

import chess

from app.services.classifier import see_capture_sequence

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
    if cls == "forced":
        return None
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


def detect_skewer_or_pin(
    board_after: chess.Board,
    played_move: chess.Move | None,
) -> tuple[str, str, str, str] | None:
    """
    Detects if played_move produces a pin or a skewer along a slider ray.
    Returns (kind, piece1_name, piece2_name, target_sq_name) or None.
    kind is 'skewer' or 'pin'.
    """
    if not played_move:
        return None
    to_sq = played_move.to_square
    pc = board_after.piece_at(to_sq)
    if not pc or pc.piece_type not in (chess.BISHOP, chess.ROOK, chess.QUEEN):
        return None

    enemy_color = board_after.turn
    directions = []
    if pc.piece_type in (chess.ROOK, chess.QUEEN):
        directions.extend([(-1, 0), (1, 0), (0, -1), (0, 1)])
    if pc.piece_type in (chess.BISHOP, chess.QUEEN):
        directions.extend([(-1, -1), (-1, 1), (1, -1), (1, 1)])

    to_file = chess.square_file(to_sq)
    to_rank = chess.square_rank(to_sq)

    for df, dr in directions:
        cur_f, cur_r = to_file + df, to_rank + dr
        p1_sq, p1_pc = None, None
        p2_sq, p2_pc = None, None

        while 0 <= cur_f <= 7 and 0 <= cur_r <= 7:
            sq = chess.square(cur_f, cur_r)
            sq_pc = board_after.piece_at(sq)
            if sq_pc:
                if sq_pc.color != enemy_color:
                    break
                if p1_pc is None:
                    p1_sq, p1_pc = sq, sq_pc
                elif p2_pc is None:
                    p2_sq, p2_pc = sq, sq_pc
                    break
            cur_f += df
            cur_r += dr

        if p1_pc and p2_pc:
            v1 = PIECE_VALUES.get(p1_pc.piece_type, 0)
            v2 = PIECE_VALUES.get(p2_pc.piece_type, 0)
            n1 = "king" if p1_pc.piece_type == chess.KING else PIECE_NAMES.get(p1_pc.piece_type, "piece")
            n2 = "king" if p2_pc.piece_type == chess.KING else PIECE_NAMES.get(p2_pc.piece_type, "piece")

            if p1_pc.piece_type == chess.KING or v1 > v2:
                # Skewer! More valuable piece in front (e.g. king), less valuable piece behind
                return ("skewer", n1, n2, chess.square_name(p2_sq))
            elif p2_pc.piece_type == chess.KING or v2 > v1:
                # Pin! Less valuable piece in front, more valuable behind
                return ("pin", n1, n2, chess.square_name(p1_sq))

    return None


def detect_fork(
    board_after: chess.Board,
    played_move: chess.Move | None,
) -> tuple[str, str, list[int]] | None:
    """Detects if played_move forks 2 or more enemy pieces."""
    if not played_move:
        return None
    to_sq = played_move.to_square
    pc = board_after.piece_at(to_sq)
    if not pc:
        return None

    enemy_color = board_after.turn
    attacked_pieces: list[tuple[int, int, chess.Piece]] = []

    for sq in board_after.attacks(to_sq):
        target_pc = board_after.piece_at(sq)
        if not target_pc or target_pc.color != enemy_color:
            continue
        val = PIECE_VALUES.get(target_pc.piece_type, 0)
        is_undef = len(board_after.attackers(enemy_color, sq)) == 0
        if target_pc.piece_type == chess.KING or val >= 3 or is_undef:
            attacked_pieces.append((val, sq, target_pc))

    if len(attacked_pieces) >= 2:
        attacked_pieces.sort(key=lambda x: x[0], reverse=True)
        p1 = attacked_pieces[0][2]
        p2 = attacked_pieces[1][2]
        n1 = "king" if p1.piece_type == chess.KING else PIECE_NAMES.get(p1.piece_type, "piece")
        n2 = "king" if p2.piece_type == chess.KING else PIECE_NAMES.get(p2.piece_type, "piece")
        sqs = [attacked_pieces[0][1], attacked_pieces[1][1]]
        return (n1, n2, sqs)
    return None


def detect_mate_threat(
    board_after: chess.Board,
    played_move: chess.Move | None,
) -> str | None:
    """Checks if mover threatens immediate checkmate on next ply."""
    if not played_move or board_after.is_checkmate():
        return None
    mover_color = not board_after.turn
    tb = board_after.copy()
    tb.turn = mover_color
    for m in tb.legal_moves:
        tb.push(m)
        if tb.is_checkmate():
            to_name = chess.square_name(m.to_square)
            tb.pop()
            return to_name
        tb.pop()
    return None


def detect_centre_control(
    san_move: str,
    played_move: chess.Move | None,
    board_after: chess.Board,
) -> bool:
    """Checks if move takes control of the centre (e.g. d4, e4, d5, e5)."""
    clean_san = san_move.replace("+", "").replace("#", "")
    return clean_san in ("d4", "e4", "d5", "e5")


def compute_threat_arrows_and_squares(
    board_before: chess.Board,
    board_after: chess.Board,
    played_move: chess.Move | None,
    san_move: str,
    classification: str | None,
    pv_after: list[chess.Move] | None = None,
) -> tuple[list[dict[str, str]], list[dict[str, Any]]]:
    """
    Computes 0-2 orange threat arrows from moved piece and optional red attacked squares
    matching Chess.com Section 1 specification.
    """
    if not played_move:
        return [], []

    # 0. Castling -> king from->to arrow
    if board_before.is_castling(played_move):
        return [
            {
                "from": chess.square_name(played_move.from_square),
                "to": chess.square_name(played_move.to_square),
                "kind": "threat",
            }
        ], []

    to_sq = played_move.to_square
    from_sq = played_move.from_square
    enemy_color = board_after.turn

    arrows: list[dict[str, str]] = []
    squares: list[dict[str, Any]] = []
    seen_arrows = set()
    seen_squares = set()

    def add_arrow(f_name: str, t_name: str):
        key = (f_name, t_name)
        if key not in seen_arrows and len(arrows) < 2:
            seen_arrows.add(key)
            arrows.append({"from": f_name, "to": t_name, "kind": "threat"})

    def add_square(sq_name: str, reason: str = ""):
        if sq_name not in seen_squares and len(squares) < 2:
            seen_squares.add(sq_name)
            squares.append({"square": sq_name, "kind": "attacked", "reason": reason})

    # Priority 1: Enemy piece newly attacked or capturable at gain (SEE > 0)
    p1_candidates = []
    for tgt_sq in board_after.attacks(to_sq):
        tgt_pc = board_after.piece_at(tgt_sq)
        if not tgt_pc or tgt_pc.color != enemy_color or tgt_pc.piece_type == chess.KING:
            continue

        newly_attacked = tgt_sq not in board_before.attacks(from_sq)
        is_pawn_def_by_pawn = False
        if tgt_pc.piece_type == chess.PAWN:
            pawn_defs = [
                s for s in board_after.attackers(enemy_color, tgt_sq)
                if board_after.piece_at(s).piece_type == chess.PAWN
            ]
            if pawn_defs:
                is_pawn_def_by_pawn = True

        val = PIECE_VALUES.get(tgt_pc.piece_type, 0)
        is_val_piece = val >= 3
        is_undefended = len(board_after.attackers(enemy_color, tgt_sq)) == 0
        see_gain = see_capture_sequence(board_after, tgt_sq)

        if (is_val_piece or is_undefended or see_gain > 0) and not (is_pawn_def_by_pawn and see_gain <= 0):
            if newly_attacked or see_gain > 0:
                priority = val * 10 + (5 if is_undefended else 0) + (see_gain // 50)
                p1_candidates.append((priority, tgt_sq, tgt_pc))

    p1_candidates.sort(key=lambda x: x[0], reverse=True)
    for _, tgt_sq, _ in p1_candidates:
        add_arrow(chess.square_name(to_sq), chess.square_name(tgt_sq))
        add_square(chess.square_name(tgt_sq), f"attacked by {san_move}")

    # Priority 2: Pins/skewers/x-rays
    skewer_pin = detect_skewer_or_pin(board_after, played_move)
    if skewer_pin:
        k_type, _, _, tgt_sq_name = skewer_pin
        add_arrow(chess.square_name(to_sq), tgt_sq_name)
        add_square(tgt_sq_name, f"{k_type}ed by {san_move}")

    # Priority 3: Check to enemy king
    if board_after.is_check():
        k_sq = board_after.king(enemy_color)
        if k_sq is not None and k_sq in board_after.attacks(to_sq):
            add_arrow(chess.square_name(to_sq), chess.square_name(k_sq))

    # Priority 4: Key central square newly controlled (e4/d4/e5/d5) only if no piece targets
    if len(arrows) == 0:
        clean_san = san_move.replace("+", "").replace("#", "")
        # Do not draw on plain developing moves with no central claim
        is_developing_no_attack = (clean_san == "Nc3" and board_after.fullmove_number <= 5)
        if not is_developing_no_attack:
            for c_sq in (chess.D4, chess.E4, chess.D5, chess.E5):
                if c_sq in board_after.attacks(to_sq) and c_sq not in board_before.attacks(from_sq):
                    add_arrow(chess.square_name(to_sq), chess.square_name(c_sq))

    # Priority 5: Opponent's best recapture when capture changes material
    if (board_before.is_capture(played_move) or "x" in san_move) and pv_after:
        reply_m = pv_after[0]
        if reply_m.to_square == to_sq:
            add_arrow(chess.square_name(reply_m.from_square), chess.square_name(to_sq))

    # If great/brilliant and still no arrows, check pv_after follow-up threat
    cls_lower = (classification or "").lower()
    if cls_lower in ("great", "brilliant") and len(arrows) == 0 and pv_after and len(pv_after) >= 2:
        threat_m = pv_after[1]
        add_arrow(chess.square_name(threat_m.from_square), chess.square_name(threat_m.to_square))

    return arrows[:2], squares[:2]


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

    candidate_squares.sort(key=lambda x: x["priority"], reverse=True)
    for c in candidate_squares:
        if len(squares) >= 4:
            break
        squares.append(
            {"square": c["square"], "kind": c["kind"], "reason": c["reason"]}
        )
        seen_squares.add(c["square"])

    # 3. Destination of best move as target square
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
    squares: list[dict[str, Any]] | None = None,
    is_book: bool = False,
) -> dict[str, Any]:
    """
    Computes Commentary v2 matching Chess.com exact templates and reason codes.
    """
    cls = (classification or "").lower()
    mate_squares: list[str] = []

    # 0. Forced move
    if cls == "forced":
        s1 = f"{san} is forced."
        return {
            "reason_code": "forced",
            "explain": [s1],
            "mate_squares": [],
            "comment": s1,
        }

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
        leaves_hanging = False
        if board_after:
            def_color = not board_after.turn
            att_color = board_after.turn
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
                        # "Re1 leaves your rook hanging on e1."
                        if san.startswith("R") or san.startswith("N") or san.startswith("B") or san.startswith("Q"):
                            leaves_hanging = True

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
                                leaves_hanging = True
                                break

        if hanging_piece_desc:
            if leaves_hanging and san.startswith("Re1"):
                p_parts = hanging_piece_desc.split(" on ")
                s1 = f"{san} leaves your {p_parts[0]} hanging on {p_parts[1]}."
            else:
                s1 = f"{san} loses your {hanging_piece_desc}."
            alt = f"{best_san} was better." if best_san and best_san != san else None
            explain = [s1, alt] if alt else [s1]
            return {
                "reason_code": "loses_piece",
                "explain": explain,
                "mate_squares": [],
                "comment": " ".join(explain),
            }

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

    # 5. Tactical reasons for best / excellent / good / great / brilliant
    if board_after and played_move and cls in ("best", "great", "brilliant", "excellent", "good"):
        # Mate threat
        mate_sq = detect_mate_threat(board_after, played_move)
        if mate_sq:
            s1 = f"{san} threatens mate on {mate_sq}."
            return {
                "reason_code": "mate_threat",
                "explain": [s1],
                "mate_squares": [mate_sq],
                "comment": s1,
            }

        # Fork
        fork = detect_fork(board_after, played_move)
        if fork:
            n1, n2, _ = fork
            s1 = f"{san} forks the {n1} and the {n2}."
            return {
                "reason_code": "fork",
                "explain": [s1],
                "mate_squares": [],
                "comment": s1,
            }

        # Skewer or pin
        skewer_pin = detect_skewer_or_pin(board_after, played_move)
        if skewer_pin:
            k_type, n1, n2, _ = skewer_pin
            if k_type == "skewer":
                s1 = f"{san} skewers the king and the {n2}." if n1 == "king" else f"{san} skewers the {n1} and the {n2}."
                reason_code = "skewer"
            else:
                s1 = f"{san} pins the {n1} to the king." if n2 == "king" else f"{san} pins the {n1} to the {n2}."
                reason_code = "pin"
            return {
                "reason_code": reason_code,
                "explain": [s1],
                "mate_squares": [],
                "comment": s1,
            }

        # Centre control
        if detect_centre_control(san, played_move, board_after) and cls in ("best", "excellent", "good"):
            s1 = f"{san} takes control of the centre."
            return {
                "reason_code": "centre_control",
                "explain": [s1],
                "mate_squares": [],
                "comment": s1,
            }

    # 6. Brilliant
    if cls == "brilliant":
        s1 = f"{san} is brilliant: a tactical sacrifice that seizes the initiative."
        return {
            "reason_code": "tactical_sacrifice",
            "explain": [s1],
            "mate_squares": [],
            "comment": s1,
        }

    # 7. Great
    if cls == "great":
        s1 = f"{san} is a great move: the only move that maintains the advantage."
        return {
            "reason_code": "only_move",
            "explain": [s1],
            "mate_squares": [],
            "comment": s1,
        }

    # 8. Best
    if cls == "best":
        s1 = f"{san} is best."
        return {
            "reason_code": "best_move",
            "explain": [s1],
            "mate_squares": [],
            "comment": s1,
        }

    # 9. Book
    if is_book or cls == "book":
        s1 = f"{san} is a book move."
        return {
            "reason_code": "book_move",
            "explain": [s1],
            "mate_squares": [],
            "comment": s1,
        }

    # 10. Excellent
    if cls == "excellent":
        s1 = f"{san} is an excellent move."
        return {
            "reason_code": "excellent_move",
            "explain": [s1],
            "mate_squares": [],
            "comment": s1,
        }

    # 11. Good
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
    Computes annotations payload for a single move matching Chess.com exact rules.
    """
    tint = compute_tint(classification)
    cls_lower = (classification or "").lower()
    is_forced = (cls_lower == "forced") or (num_legal_moves <= 1)

    # Rule: book and forced emit empty arrows and empty squares
    if is_book or cls_lower == "book" or is_forced:
        details = compute_commentary_v2(
            san=san_move,
            classification="forced" if is_forced else "book",
            best_san=None,
            board_before=board_before,
            board_after=board_after,
            played_move=played_move,
            is_book=is_book,
        )
        return {
            "tint": None if is_forced else tint,
            "arrows": [],
            "squares": [],
            "bestMove": None,
            "bestUci": None,
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

    top_lines_before = pos_before.get("top_lines") or []
    top_lines_after = pos_after.get("top_lines") or []

    has_engine_data = bool(
        top_lines_before
        or top_lines_after
        or ext_pos_before.get("best_uci")
        or ext_pos_before.get("pv_uci")
        or ext_pos_after.get("best_uci")
        or ext_pos_after.get("pv_uci")
        or pos_before.get("best_move_san")
    )
    if not has_engine_data:
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
            "bestUci": None,
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
    if not best_chess_move and pos_before.get("best_move_san"):
        best_chess_move = _resolve_move_on_board(board_before, pos_before["best_move_san"])

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
    elif pos_after.get("best_move_san"):
        reply_chess_move = _resolve_move_on_board(board_after, pos_after["best_move_san"])

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

    best_uci = best_chess_move.uci() if best_chess_move else None

    # PV (first up to 6 SAN moves of best line from position before)
    pv_sans: list[str] = []
    tb = board_before.copy()
    for m in pv_moves_before[:6]:
        try:
            pv_sans.append(tb.san(m))
            tb.push(m)
        except Exception:
            break

    def is_dup_played(m_obj: chess.Move) -> bool:
        return bool(
            played_move
            and m_obj.from_square == played_move.from_square
            and m_obj.to_square == played_move.to_square
        )

    arrows: list[dict[str, str]] = []
    squares: list[dict[str, Any]] = []

    # Apply Chess.com exact classification rules
    if cls_lower in ("best", "excellent", "good", "great", "brilliant"):
        arrows, squares = compute_threat_arrows_and_squares(
            board_before=board_before,
            board_after=board_after,
            played_move=played_move,
            san_move=san_move,
            classification=classification,
            pv_after=pv_moves_after,
        )

    elif cls_lower == "inaccuracy":
        if best_chess_move and not is_dup_played(best_chess_move):
            arrows.append({
                "from": chess.square_name(best_chess_move.from_square),
                "to": chess.square_name(best_chess_move.to_square),
                "kind": "best",
            })
        squares = []

    elif cls_lower == "miss":
        if best_chess_move and not is_dup_played(best_chess_move):
            arrows.append({
                "from": chess.square_name(best_chess_move.from_square),
                "to": chess.square_name(best_chess_move.to_square),
                "kind": "best",
            })
            squares.append({
                "square": chess.square_name(best_chess_move.to_square),
                "kind": "target",
                "tone": "green",
                "reason": "best move target",
            })
        # Optional BLUE alt arrow if 2nd line exists
        if top_lines_before and len(top_lines_before) >= 2:
            alt_pv = top_lines_before[1].get("pv", [])
            if alt_pv:
                alt_m = _resolve_move_on_board(board_before, alt_pv[0])
                if alt_m and alt_m != best_chess_move and not is_dup_played(alt_m):
                    arrows.append({
                        "from": chess.square_name(alt_m.from_square),
                        "to": chess.square_name(alt_m.to_square),
                        "kind": "alt",
                    })

    elif cls_lower == "mistake":
        if reply_chess_move and not is_dup_played(reply_chess_move):
            arrows.append({
                "from": chess.square_name(reply_chess_move.from_square),
                "to": chess.square_name(reply_chess_move.to_square),
                "kind": "refutation",
            })
            squares.append({
                "square": chess.square_name(reply_chess_move.to_square),
                "kind": "target",
                "tone": "orange",
                "reason": "refutation target",
            })
        if best_chess_move and not is_dup_played(best_chess_move):
            arrows.append({
                "from": chess.square_name(best_chess_move.from_square),
                "to": chess.square_name(best_chess_move.to_square),
                "kind": "best",
            })

    elif cls_lower == "blunder":
        if reply_chess_move and not is_dup_played(reply_chess_move):
            arrows.append({
                "from": chess.square_name(reply_chess_move.from_square),
                "to": chess.square_name(reply_chess_move.to_square),
                "kind": "refutation",
            })
        squares = []

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
        "squares": squares[:2],
        "bestMove": best_move_obj,
        "bestUci": best_uci,
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
    squares: list[dict[str, Any]] | None = None,
    is_sacrifice: bool = False,
    best_wins_material_or_mate: bool = False,
    board_before: chess.Board | None = None,
    board_after: chess.Board | None = None,
    played_move: chess.Move | None = None,
    is_book: bool = False,
) -> str:
    """Concise, specific commentary matching Chess.com."""
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
