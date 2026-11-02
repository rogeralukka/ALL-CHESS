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


def is_pawn_passed(board: chess.Board, square: chess.Square) -> bool:
    """Checks if pawn on square is a passed pawn (no enemy pawns in front or on adjacent files)."""
    piece = board.piece_at(square)
    if not piece or piece.piece_type != chess.PAWN:
        return False
    color = piece.color
    file_idx = chess.square_file(square)
    rank_idx = chess.square_rank(square)
    enemy_color = not color

    files_to_check = [file_idx]
    if file_idx > 0:
        files_to_check.append(file_idx - 1)
    if file_idx < 7:
        files_to_check.append(file_idx + 1)

    for f in files_to_check:
        for r in range(rank_idx + 1, 8) if color == chess.WHITE else range(0, rank_idx):
            sq = chess.square(f, r)
            p = board.piece_at(sq)
            if p and p.color == enemy_color and p.piece_type == chess.PAWN:
                return False
    return True


def generate_line_why_template(board: chess.Board, move: chess.Move) -> str:
    """
    Generates a human-friendly, piece-aware concrete reason for the suggested line.
    Returns empty string if nothing concrete can be proven (no filler).
    """
    if not move or move not in board.legal_moves:
        return ""

    to_sq_name = chess.square_name(move.to_square)
    from_sq_name = chess.square_name(move.from_square)

    # 1. Castling
    if board.is_castling(move) or move in (
        chess.Move.from_uci("e1g1"),
        chess.Move.from_uci("e1c1"),
        chess.Move.from_uci("e8g8"),
        chess.Move.from_uci("e8c8"),
    ):
        side = (
            "kingside"
            if chess.square_file(move.to_square) > chess.square_file(move.from_square)
            else "queenside"
        )
        return f"Castles {side} to secure king safety and activate the rook."

    piece = board.piece_at(move.from_square)
    if not piece:
        return ""

    piece_type = piece.piece_type
    color = piece.color
    mover_name = chess.piece_name(piece_type)

    # 2. Captures
    if board.is_capture(move):
        captured = board.piece_at(move.to_square)
        cap_name = (
            chess.piece_name(captured.piece_type)
            if captured
            else ("pawn" if board.is_en_passant(move) else "piece")
        )
        return f"Captures {cap_name} on {to_sq_name} with the {mover_name}."

    # 3. Check / Checkmate
    if board.gives_check(move):
        b_after = board.copy()
        b_after.push(move)
        if b_after.is_checkmate():
            return f"Delivers checkmate on {to_sq_name}."
        return f"Delivers check on {to_sq_name}, disrupting opponent coordination."

    # 4. Piece-specific concrete logic
    if piece_type == chess.BISHOP:
        is_white_starting = color == chess.WHITE and from_sq_name in ("c1", "f1")
        is_black_starting = color == chess.BLACK and from_sq_name in ("c8", "f8")
        if is_white_starting or is_black_starting:
            prepares_castling = False
            if color == chess.WHITE:
                if from_sq_name == "f1" and board.has_kingside_castling_rights(
                    chess.WHITE
                ) or from_sq_name == "c1" and board.has_queenside_castling_rights(
                    chess.WHITE
                ):
                    prepares_castling = True
            else:
                if from_sq_name == "f8" and board.has_kingside_castling_rights(
                    chess.BLACK
                ) or from_sq_name == "c8" and board.has_queenside_castling_rights(
                    chess.BLACK
                ):
                    prepares_castling = True

            if prepares_castling:
                return f"Develops the bishop to {to_sq_name} and prepares castling."
            return f"Develops the bishop to {to_sq_name}."

        if to_sq_name in ("b2", "g2", "b7", "g7"):
            return f"Fianchettos the bishop on {to_sq_name} along the long diagonal."
        return ""

    if piece_type == chess.KNIGHT:
        is_white_starting = color == chess.WHITE and from_sq_name in ("b1", "g1")
        is_black_starting = color == chess.BLACK and from_sq_name in ("b8", "g8")
        if is_white_starting or is_black_starting:
            prepares_castling = False
            if color == chess.WHITE:
                if from_sq_name == "g1" and board.has_kingside_castling_rights(
                    chess.WHITE
                ) or from_sq_name == "b1" and board.has_queenside_castling_rights(
                    chess.WHITE
                ):
                    prepares_castling = True
            else:
                if from_sq_name == "g8" and board.has_kingside_castling_rights(
                    chess.BLACK
                ) or from_sq_name == "b8" and board.has_queenside_castling_rights(
                    chess.BLACK
                ):
                    prepares_castling = True

            if prepares_castling:
                return f"Develops the knight to {to_sq_name} and prepares castling."
            return f"Develops the knight to {to_sq_name}."

        if to_sq_name in ("d5", "e5", "d4", "e4", "f5", "c5", "f4", "c4"):
            return f"Posts the knight on {to_sq_name}."
        return ""

    if piece_type == chess.PAWN:
        if move.promotion:
            return (
                f"Promotes pawn to {chess.piece_name(move.promotion)} on {to_sq_name}."
            )
        if (color == chess.WHITE and chess.square_rank(move.to_square) == 6) or (
            color == chess.BLACK and chess.square_rank(move.to_square) == 1
        ):
            return f"Advances dangerous passed pawn to {to_sq_name}."
        if to_sq_name in ("e4", "d4", "e5", "d5"):
            return f"Claims central space with the pawn on {to_sq_name}."
        if to_sq_name in ("c4", "c5", "f4", "f5"):
            return f"Challenges the center with {to_sq_name}."
        if to_sq_name in ("c3", "c6", "e3", "e6", "d3", "d6"):
            return f"Solidifies pawn structure with {to_sq_name}."
        return ""

    if piece_type == chess.ROOK:
        file_idx = chess.square_file(move.to_square)
        pawns_on_file = [
            sq
            for sq in chess.SQUARES
            if chess.square_file(sq) == file_idx
            and board.piece_at(sq)
            and board.piece_at(sq).piece_type == chess.PAWN
        ]
        if len(pawns_on_file) == 0:
            file_letter = chr(ord("a") + file_idx)
            return f"Places the rook on the open {file_letter}-file."
        if len(pawns_on_file) == 1 and board.piece_at(pawns_on_file[0]).color != color:
            file_letter = chr(ord("a") + file_idx)
            return f"Positions the rook on the semi-open {file_letter}-file."
        if (color == chess.WHITE and chess.square_rank(move.to_square) == 6) or (
            color == chess.BLACK and chess.square_rank(move.to_square) == 1
        ):
            return f"Infiltrates the 7th rank with the rook on {to_sq_name}."
        return ""

    if piece_type == chess.QUEEN:
        if to_sq_name in ("d4", "e4", "d5", "e5", "c4", "f4", "c5", "f5"):
            return f"Centralizes the queen on {to_sq_name}."
        return ""

    if piece_type == chess.KING:
        central_squares = {
            "d4", "e4", "d5", "e5",
            "c4", "c5", "f4", "f5",
            "d3", "e3", "d6", "e6",
        }
        if len(board.piece_map()) <= 10 and to_sq_name in central_squares:
            return f"Centralizes the king on {to_sq_name} for the endgame."
        return ""

    # Skewer or pin or fork on b_after
    b_after = board.copy()
    b_after.push(move)
    sk = detect_skewer_or_pin(b_after, move)
    if sk:
        if sk[0] == "skewer":
            return f"Skewers the king and the {sk[2]}." if sk[1] == "king" else f"Skewers the {sk[1]} and the {sk[2]}."
        return f"Pins the {sk[1]} to the king." if sk[2] == "king" else f"Pins the {sk[1]} to the {sk[2]}."
    fk = detect_fork(b_after, move)
    if fk:
        return f"Forks the {fk[0]} and the {fk[1]}."

    return ""


def _describe_best_move(
    board_before: chess.Board | None,
    best_chess_move: chess.Move | None,
    best_san: str | None,
    default_suffix: str = "was better.",
) -> str | None:
    """Produces a proven explanation of what best_san does from board_before, max 110 chars."""
    if not best_san:
        return None
    if (
        not board_before
        or not best_chess_move
        or best_chess_move not in board_before.legal_moves
    ):
        return f"{best_san} {default_suffix}"

    if board_before.is_capture(best_chess_move):
        cap = board_before.piece_at(best_chess_move.to_square)
        cap_name = PIECE_NAMES.get(cap.piece_type, "piece") if cap else "piece"
        sq_n = chess.square_name(best_chess_move.to_square)
        defs = board_before.attackers(not board_before.turn, best_chess_move.to_square)
        if not defs:
            return f"{best_san} wins a {cap_name}: the {cap_name} on {sq_n} is undefended."
        return f"{best_san} wins material on {sq_n}."

    if board_before.gives_check(best_chess_move):
        b_best = board_before.copy()
        b_best.push(best_chess_move)
        if b_best.is_checkmate():
            return f"{best_san} delivers checkmate."
        return f"{best_san} gives check, forcing the king to move."

    p = board_before.piece_at(best_chess_move.from_square)
    if p and p.piece_type == chess.PAWN:
        to_sq = chess.square_name(best_chess_move.to_square)
        from_sq = chess.square_name(best_chess_move.from_square)
        if to_sq in ("e4", "d4", "e5", "d5"):
            return f"The pawn on {from_sq} is stronger on {to_sq}: it takes space and opens lines."

    if p and p.piece_type in (chess.KNIGHT, chess.BISHOP):
        from_sq = chess.square_name(best_chess_move.from_square)
        if from_sq in ("b1", "c1", "f1", "g1", "b8", "c8", "f8", "g8"):
            return f"{best_san} develops the piece to an active square."

    return f"{best_san} {default_suffix}"


def compute_commentary_v2(
    san: str,
    classification: str | None,
    best_san: str | None = None,
    board_before: chess.Board | None = None,
    board_after: chess.Board | None = None,
    played_move: chess.Move | None = None,
    best_chess_move: chess.Move | None = None,
    reply_chess_move: chess.Move | None = None,
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
    Returns 1-3 short python-chess-proven sentences (each <= 110 chars) with NO filler.
    """
    cls = (classification or "").lower()
    mate_squares: list[str] = []

    # 0. Book or Forced
    if is_book or cls == "book":
        s1 = f"{san} is a book move."
        return {
            "reason_code": "book_move",
            "explain": [s1],
            "mate_squares": [],
            "comment": s1,
        }

    if cls == "forced":
        s1 = f"{san} is forced."
        return {
            "reason_code": "forced",
            "explain": [s1],
            "mate_squares": [],
            "comment": s1,
        }

    # 1. Mate cases
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

    # 2. Blunder / Mistake
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
                        if san.startswith(("R", "N", "B", "Q")):
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
            alt = _describe_best_move(board_before, best_chess_move, best_san, "was better.")
            explain = [s1, alt] if alt else [s1]
            return {
                "reason_code": "loses_piece",
                "explain": explain,
                "mate_squares": [],
                "comment": " ".join(explain),
            }

        # Check refutation reply move on board_after
        if reply_chess_move and board_after and reply_chess_move in board_after.legal_moves:
            r_san = refutation_san or board_after.san(reply_chess_move)
            if board_after.is_capture(reply_chess_move):
                cap_pc = board_after.piece_at(reply_chess_move.to_square)
                cap_name = PIECE_NAMES.get(cap_pc.piece_type, "piece") if cap_pc else "piece"
                to_sq = chess.square_name(reply_chess_move.to_square)
                if played_move and reply_chess_move.to_square == played_move.to_square:
                    s1 = f"{san} leaves your {cap_name} hanging on {to_sq}."
                else:
                    s1 = f"{r_san} wins your {cap_name} on {to_sq}."
                alt = _describe_best_move(board_before, best_chess_move, best_san, "was better.")
                explain = [s1, alt] if alt else [s1]
                return {
                    "reason_code": "loses_piece",
                    "explain": explain,
                    "mate_squares": [],
                    "comment": " ".join(explain),
                }
            elif board_after.gives_check(reply_chess_move):
                s1 = f"{san} allows {r_san}, checking your king."
                alt = _describe_best_move(board_before, best_chess_move, best_san, "was better.")
                explain = [s1, alt] if alt else [s1]
                return {
                    "reason_code": "allows_check",
                    "explain": explain,
                    "mate_squares": [],
                    "comment": " ".join(explain),
                }
            else:
                sk = detect_skewer_or_pin(board_after, reply_chess_move)
                fk = detect_fork(board_after, reply_chess_move)
                if fk:
                    s1 = f"{san} allows {r_san}, forking your pieces."
                    alt = _describe_best_move(board_before, best_chess_move, best_san, "was better.")
                    explain = [s1, alt] if alt else [s1]
                    return {
                        "reason_code": "fork",
                        "explain": explain,
                        "mate_squares": [],
                        "comment": " ".join(explain),
                    }
                elif sk:
                    s1 = f"{san} allows {r_san}, pinning your pieces." if sk[0] == "pin" else f"{san} allows {r_san}, skewering your pieces."
                    alt = _describe_best_move(board_before, best_chess_move, best_san, "was better.")
                    explain = [s1, alt] if alt else [s1]
                    return {
                        "reason_code": sk[0],
                        "explain": explain,
                        "mate_squares": [],
                        "comment": " ".join(explain),
                    }

        if refutation_san and (refutation_san.endswith("+") or refutation_san.endswith("#")):
            s1 = f"{san} allows {refutation_san}."
            alt = _describe_best_move(board_before, best_chess_move, best_san, "was better.")
            explain = [s1, alt] if alt else [s1]
            return {
                "reason_code": cls,
                "explain": explain,
                "mate_squares": [],
                "comment": " ".join(explain),
            }

        if cls == "blunder":
            s1 = f"{san} is a blunder."
            alt = _describe_best_move(board_before, best_chess_move, best_san, "was better.")
            explain = [s1, alt] if alt else [s1]
            return {
                "reason_code": "blunder",
                "explain": explain,
                "mate_squares": [],
                "comment": " ".join(explain),
            }

        s1 = f"{san} is a mistake."
        alt = _describe_best_move(board_before, best_chess_move, best_san, "was better.")
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
            alt = _describe_best_move(board_before, best_chess_move, best_san, "wins material.") if (best_san and best_san != san) else None
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
        alt = _describe_best_move(board_before, best_chess_move, best_san, "keeps the edge.") if (best_san and best_san != san) else None
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

        # Castling
        if board_before and (board_before.is_castling(played_move) or played_move in (
            chess.Move.from_uci("e1g1"), chess.Move.from_uci("e8g8"),
            chess.Move.from_uci("e1c1"), chess.Move.from_uci("e8c8")
        )):
            side = "kingside" if chess.square_file(played_move.to_square) > chess.square_file(played_move.from_square) else "queenside"
            s1 = f"Castles {side} to secure king safety and activate the rook."
            return {
                "reason_code": "castling",
                "explain": [s1],
                "mate_squares": [],
                "comment": s1,
            }

        # Captures
        if board_before and board_before.is_capture(played_move):
            cap = board_before.piece_at(played_move.to_square)
            cap_name = PIECE_NAMES.get(cap.piece_type, "piece") if cap else "piece"
            mover = board_before.piece_at(played_move.from_square)
            to_sq = chess.square_name(played_move.to_square)
            if mover and cap and mover.piece_type == cap.piece_type:
                s1 = f"{san} trades the {cap_name}s on {to_sq}."
                return {
                    "reason_code": "trade",
                    "explain": [s1],
                    "mate_squares": [],
                    "comment": s1,
                }
            defs = board_before.attackers(not board_before.turn, played_move.to_square)
            if not defs:
                s1 = f"{san} captures the undefended {cap_name} on {to_sq}."
                return {
                    "reason_code": "capture_undefended",
                    "explain": [s1],
                    "mate_squares": [],
                    "comment": s1,
                }
            s1 = f"{san} captures on {to_sq}."
            return {
                "reason_code": "capture",
                "explain": [s1],
                "mate_squares": [],
                "comment": s1,
            }

        # Check
        if board_before and board_before.gives_check(played_move):
            s1 = f"{san} gives check, forcing the king to move."
            return {
                "reason_code": "check",
                "explain": [s1],
                "mate_squares": [],
                "comment": s1,
            }

        # Passed pawn
        if is_pawn_passed(board_after, played_move.to_square):
            s1 = f"{san} advances the passed pawn toward promotion."
            return {
                "reason_code": "passed_pawn",
                "explain": [s1],
                "mate_squares": [],
                "comment": s1,
            }

        # Centre control
        if detect_centre_control(san, played_move, board_after):
            s1 = f"{san} takes control of the centre."
            return {
                "reason_code": "centre_control",
                "explain": [s1],
                "mate_squares": [],
                "comment": s1,
            }

        # Development
        if board_before:
            mover = board_before.piece_at(played_move.from_square)
            if mover and mover.piece_type in (chess.KNIGHT, chess.BISHOP):
                from_sq = chess.square_name(played_move.from_square)
                if from_sq in ("b1", "c1", "f1", "g1", "b8", "c8", "f8", "g8"):
                    m_name = PIECE_NAMES.get(mover.piece_type, "piece")
                    s1 = f"{san} develops the {m_name} to an active square."
                    return {
                        "reason_code": "development",
                        "explain": [s1],
                        "mate_squares": [],
                        "comment": s1,
                    }

        # Rook open / semi-open file
        if board_before:
            mover = board_before.piece_at(played_move.from_square)
            if mover and mover.piece_type == chess.ROOK:
                file_idx = chess.square_file(played_move.to_square)
                pawns = [
                    sq
                    for sq in chess.SQUARES
                    if chess.square_file(sq) == file_idx
                    and board_after.piece_type_at(sq) == chess.PAWN
                ]
                f_name = chr(ord("a") + file_idx)
                if len(pawns) == 0:
                    s1 = f"{san} places the rook on the open {f_name}-file."
                    return {
                        "reason_code": "open_file",
                        "explain": [s1],
                        "mate_squares": [],
                        "comment": s1,
                    }
                elif len(pawns) == 1:
                    s1 = f"{san} positions the rook on the semi-open {f_name}-file."
                    return {
                        "reason_code": "semi_open_file",
                        "explain": [s1],
                        "mate_squares": [],
                        "comment": s1,
                    }

        # Centralizing knight
        if board_before:
            mover = board_before.piece_at(played_move.from_square)
            to_sq = chess.square_name(played_move.to_square)
            if mover and mover.piece_type == chess.KNIGHT and to_sq in (
                "d4", "e4", "d5", "e5", "c5", "f5", "c4", "f4"
            ):
                s1 = f"{san} centralizes the knight on {to_sq}."
                return {
                    "reason_code": "central_knight",
                    "explain": [s1],
                    "mate_squares": [],
                    "comment": s1,
                }

        # Solidifying pawn structure
        if board_before:
            mover = board_before.piece_at(played_move.from_square)
            to_sq = chess.square_name(played_move.to_square)
            if mover and mover.piece_type == chess.PAWN and to_sq in (
                "c3", "c6", "d3", "d6", "e3", "e6", "f3", "f6"
            ):
                s1 = f"{san} solidifies the pawn structure."
                return {
                    "reason_code": "pawn_structure",
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

    # PV: refutation line legal from board_after for blunders/mistakes;
    # best continuation legal from board_before for other moves.
    pv_sans: list[str] = []
    if cls_lower in ("blunder", "mistake"):
        tb = board_after.copy()
        target_pv = pv_moves_after
        if not target_pv and reply_chess_move:
            target_pv = [reply_chess_move]
    else:
        tb = board_before.copy()
        target_pv = pv_moves_before
        if not target_pv and best_chess_move:
            target_pv = [best_chess_move]

    for m in target_pv[:6]:
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
        best_chess_move=best_chess_move,
        reply_chess_move=reply_chess_move,
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
