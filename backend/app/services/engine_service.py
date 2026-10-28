import os
import shutil
import json
import asyncio
import logging
from typing import List, Dict, Any, Optional, Callable, AsyncIterator
from contextlib import asynccontextmanager
import chess
import chess.engine
from app.config import settings, BACKEND_DIR
from app.services.win_pct import eval_to_win_pct
from app.services.classifier import classify_move, is_material_sacrifice
from app.services.accuracy import (
    calculate_game_accuracy,
    estimate_performance_ratings,
    calculate_phase_grades
)
from app.config import is_testing_environment
from app.services.coach_service import generate_template_comment, generate_batch_move_comments_async
from app.schemas.game import TopEngineLine
from sqlalchemy.orm import Session

logger = logging.getLogger("all_chess.engine")

# Load openings.json once and index book sequences
OPENINGS_FILE = os.path.join(BACKEND_DIR, "app", "data", "openings.json")
try:
    with open(OPENINGS_FILE, "r", encoding="utf-8") as f:
        _RAW_OPENINGS = json.load(f)
except Exception:
    _RAW_OPENINGS = []

BOOK_PREFIXES = set()
BOOK_POSITION_EPDS = set()

for entry in _RAW_OPENINGS:
    m_list = entry.get("moves", [])
    if m_list:
        for k in range(1, len(m_list) + 1):
            BOOK_PREFIXES.add(tuple(m_list[:k]))

        b_temp = chess.Board()
        for san_move in m_list:
            try:
                b_temp.push_san(san_move)
                BOOK_POSITION_EPDS.add(b_temp.epd())
            except Exception:
                break


def get_stockfish_executable_path() -> str:
    path = settings.stockfish_path
    candidates = []
    if os.path.isabs(path):
        candidates.append(path)
    else:
        candidates.append(os.path.normpath(os.path.join(BACKEND_DIR, path)))
        candidates.append(os.path.normpath(os.path.join(BACKEND_DIR.parent, path)))
        candidates.append(os.path.normpath(os.path.join(os.getcwd(), path)))
        if path.startswith("backend/") or path.startswith("backend\\"):
            candidates.append(os.path.normpath(os.path.join(BACKEND_DIR, path[8:])))

    for name in ("stockfish", "stockfish.exe", "/usr/games/stockfish", "/usr/bin/stockfish"):
        which_path = shutil.which(name)
        if which_path and os.path.isfile(which_path):
            candidates.append(which_path)

    for c in candidates:
        if os.path.isfile(c):
            return c
        if os.path.isfile(f"{c}.exe"):
            return f"{c}.exe"

    raise FileNotFoundError(
        f"Stockfish binary not found at '{candidates[0]}'. "
        "Please check STOCKFISH_PATH in backend/.env or install stockfish."
    )


def generate_line_why_template(board: chess.Board, move: chess.Move) -> str:
    """Generates a human-friendly, piece-aware concrete reason for the suggested line."""
    to_sq_name = chess.square_name(move.to_square)
    from_sq_name = chess.square_name(move.from_square)

    # 1. Castling
    if board.is_castling(move) or move in (
        chess.Move.from_uci("e1g1"), chess.Move.from_uci("e1c1"),
        chess.Move.from_uci("e8g8"), chess.Move.from_uci("e8c8")
    ):
        side = "kingside" if chess.square_file(move.to_square) > chess.square_file(move.from_square) else "queenside"
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
        cap_name = chess.piece_name(captured.piece_type) if captured else ("pawn" if board.is_en_passant(move) else "piece")
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
        is_white_starting = (color == chess.WHITE and from_sq_name in ("c1", "f1"))
        is_black_starting = (color == chess.BLACK and from_sq_name in ("c8", "f8"))
        if is_white_starting or is_black_starting:
            prepares_castling = False
            if color == chess.WHITE:
                if from_sq_name == "f1" and board.has_kingside_castling_rights(chess.WHITE):
                    prepares_castling = True
                elif from_sq_name == "c1" and board.has_queenside_castling_rights(chess.WHITE):
                    prepares_castling = True
            else:
                if from_sq_name == "f8" and board.has_kingside_castling_rights(chess.BLACK):
                    prepares_castling = True
                elif from_sq_name == "c8" and board.has_queenside_castling_rights(chess.BLACK):
                    prepares_castling = True

            if prepares_castling:
                return f"Develops the bishop to {to_sq_name} and prepares castling."
            return f"Develops the bishop to {to_sq_name}."

        if to_sq_name in ("b2", "g2", "b7", "g7"):
            return f"Fianchettos the bishop on {to_sq_name} along the long diagonal."
        return ""

    if piece_type == chess.KNIGHT:
        is_white_starting = (color == chess.WHITE and from_sq_name in ("b1", "g1"))
        is_black_starting = (color == chess.BLACK and from_sq_name in ("b8", "g8"))
        if is_white_starting or is_black_starting:
            prepares_castling = False
            if color == chess.WHITE:
                if from_sq_name == "g1" and board.has_kingside_castling_rights(chess.WHITE):
                    prepares_castling = True
                elif from_sq_name == "b1" and board.has_queenside_castling_rights(chess.WHITE):
                    prepares_castling = True
            else:
                if from_sq_name == "g8" and board.has_kingside_castling_rights(chess.BLACK):
                    prepares_castling = True
                elif from_sq_name == "b8" and board.has_queenside_castling_rights(chess.BLACK):
                    prepares_castling = True

            if prepares_castling:
                return f"Develops the knight to {to_sq_name} and prepares castling."
            return f"Develops the knight to {to_sq_name}."

        if to_sq_name in ("d5", "e5", "d4", "e4", "f5", "c5", "f4", "c4"):
            return f"Posts the knight on {to_sq_name}."
        return ""

    if piece_type == chess.PAWN:
        if move.promotion:
            return f"Promotes pawn to {chess.piece_name(move.promotion)} on {to_sq_name}."
        if (color == chess.WHITE and chess.square_rank(move.to_square) == 6) or            (color == chess.BLACK and chess.square_rank(move.to_square) == 1):
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
            sq for sq in chess.SQUARES
            if chess.square_file(sq) == file_idx and board.piece_at(sq) and board.piece_at(sq).piece_type == chess.PAWN
        ]
        if len(pawns_on_file) == 0:
            file_letter = chr(ord('a') + file_idx)
            return f"Places the rook on the open {file_letter}-file."
        if len(pawns_on_file) == 1 and board.piece_at(pawns_on_file[0]).color != color:
            file_letter = chr(ord('a') + file_idx)
            return f"Positions the rook on the semi-open {file_letter}-file."
        if (color == chess.WHITE and chess.square_rank(move.to_square) == 6) or            (color == chess.BLACK and chess.square_rank(move.to_square) == 1):
            return f"Infiltrates the 7th rank with the rook on {to_sq_name}."
        return ""

    if piece_type == chess.QUEEN:
        if to_sq_name in ("d4", "e4", "d5", "e5", "c4", "f4", "c5", "f5"):
            return f"Centralizes the queen on {to_sq_name}."
        return ""

    if piece_type == chess.KING:
        central_squares = {"d4", "e4", "d5", "e5", "c4", "c5", "f4", "f5", "d3", "e3", "d6", "e6"}
        if len(board.piece_map()) <= 10 and to_sq_name in central_squares:
            return f"Centralizes the king on {to_sq_name} for the endgame."
        return ""

    return ""


def _analyse_fen_sync(
    engine: chess.engine.SimpleEngine,
    fen: str,
    depth: int = 14,
    multipv: int = 3,
    time_limit: float = 0.5
) -> List[TopEngineLine]:
    board = chess.Board(fen)

    if board.is_checkmate():
        # Checkmate position
        mover_color = not board.turn
        eval_pawns = 99.0 if mover_color == chess.WHITE else -99.0
        return [TopEngineLine(move="", eval=eval_pawns, mate=0, depth=depth, why="Checkmate", pv=[])]

    if board.is_stalemate() or board.is_insufficient_material():
        return [TopEngineLine(move="", eval=0.0, mate=None, depth=depth, why="Drawn position", pv=[])]

    limit = chess.engine.Limit(depth=depth, time=time_limit)
    infos = engine.analyse(board, limit=limit, multipv=multipv)
    if isinstance(infos, dict):
        infos = [infos]

    lines: List[TopEngineLine] = []
    for info in infos:
        pv = info.get("pv", [])
        if not pv:
            continue

        score = info.get("score")
        eval_pawns = 0.0
        mate_val = None
        if score:
            white_score = score.white()
            if white_score.is_mate():
                m_num = white_score.mate()
                mate_val = m_num
                if m_num == 0:
                    eval_pawns = 99.0 if board.turn == chess.BLACK else -99.0
                elif m_num > 0:
                    eval_pawns = 99.0
                else:
                    eval_pawns = -99.0
            else:
                cp = white_score.score()
                eval_pawns = round(cp / 100.0, 2) if cp is not None else 0.0

        pv_sans: List[str] = []
        temp_board = board.copy()
        for m in pv[:8]:
            try:
                pv_sans.append(temp_board.san(m))
                temp_board.push(m)
            except Exception:
                break

        first_move_san = pv_sans[0] if pv_sans else pv[0].uci()
        why_text = generate_line_why_template(board, pv[0])

        lines.append(
            TopEngineLine(
                move=first_move_san,
                eval=eval_pawns,
                mate=mate_val,
                depth=info.get("depth", depth),
                why=why_text,
                pv=pv_sans
            )
        )
    return lines


class EnginePool:
    """
    Manages a pool of independent SimpleEngine subprocesses (one per concurrent job),
    eliminating cross-thread UCI pipe corruption.
    """
    def __init__(self, size: int = 2):
        self.size = size
        self._queue: Optional[asyncio.Queue[chess.engine.SimpleEngine]] = None
        self._all_engines: List[chess.engine.SimpleEngine] = []
        self._lock = asyncio.Lock()

    async def _init_pool(self) -> None:
        if self._queue is not None:
            return
        self._queue = asyncio.Queue(maxsize=self.size)
        path = get_stockfish_executable_path()
        for _ in range(self.size):
            engine = chess.engine.SimpleEngine.popen_uci(path)
            engine.configure({"Threads": settings.engine_threads, "Hash": settings.engine_hash_mb})
            self._all_engines.append(engine)
            await self._queue.put(engine)

    @asynccontextmanager
    async def acquire(self) -> AsyncIterator[chess.engine.SimpleEngine]:
        async with self._lock:
            if self._queue is None:
                await self._init_pool()

        engine = await self._queue.get()
        try:
            try:
                engine.ping()
            except Exception:
                logger.warning("Engine in pool unresponsive, restarting...")
                try:
                    engine.quit()
                except Exception:
                    pass
                path = get_stockfish_executable_path()
                engine = chess.engine.SimpleEngine.popen_uci(path)
                engine.configure({"Threads": settings.engine_threads, "Hash": settings.engine_hash_mb})
            yield engine
        finally:
            await self._queue.put(engine)

    def close(self) -> None:
        for e in self._all_engines:
            try:
                e.quit()
            except Exception:
                pass
        self._all_engines.clear()
        self._queue = None


_GLOBAL_ENGINE_POOL = EnginePool(size=settings.engine_pool_size)
ANALYSIS_LEVELS: Dict[str, Dict[str, Any]] = {
    "standard": {"depth": 18, "time_per_move": 0.35, "multipv": 3},
    "deep": {"depth": 22, "time_per_move": 0.6, "multipv": 3},
    "deeper": {"depth": 26, "time_per_move": 1.0, "multipv": 3},
    "max": {"depth": 32, "time_per_move": 2.0, "multipv": 3},
}

LEVEL_ORDER: Dict[str, int] = {
    "standard": 1,
    "deep": 2,
    "deeper": 3,
    "max": 4,
}



def get_global_engine_pool() -> EnginePool:
    return _GLOBAL_ENGINE_POOL


async def analyze_position(
    fen: str,
    depth: int = 14,
    multipv: int = 3,
    time_limit: float = 0.5
) -> List[TopEngineLine]:
    """Analyzes a single FEN position using a dedicated engine from the pool."""
    pool = get_global_engine_pool()
    async with pool.acquire() as engine:
        return await asyncio.to_thread(_analyse_fen_sync, engine, fen, depth, multipv, time_limit)


def _run_single_pass_review_sync(
    engine: chess.engine.SimpleEngine,
    moves_list: List[Dict[str, Any]],
    depth: int = 18,
    time_per_move: float = 0.35,
    multipv: int = 3,
    is_user_white: bool = True,
    white_rating: Optional[int] = None,
    black_rating: Optional[int] = None,
    on_progress: Optional[Callable[[int], None]] = None,
    db: Optional[Session] = None,
    level: str = "standard"
) -> Dict[str, Any]:
    """
    ONE EVAL PER POSITION:
    Evaluates each position in the game exactly once (depth 16 / 0.3s, MultiPV 3).
    A move's 'after' eval is the 'before' eval of the next position.
    Checkmate / stalemate are identified without wasteful engine searches.
    """
    total_moves = len(moves_list)
    if total_moves == 0:
        return {
            "moves": [],
            "accuracy": {"white": None, "black": None},
            "estimatedRating": {"white": None, "black": None},
            "phaseGrades": {"opening": "N/A", "middlegame": "N/A", "tactics": "N/A", "endgame": "N/A"}
        }

    # 1. Step through positions and evaluate each position ONCE
    board = chess.Board()
    positions: List[chess.Board] = [board.copy()]
    played_chess_moves: List[Optional[chess.Move]] = []
    is_sacrifice_flags: List[bool] = []

    for raw_m in moves_list:
        san_str = raw_m.get("san", "")
        from_sq = raw_m.get("from")
        to_sq = raw_m.get("to")
        promo = raw_m.get("promotion")

        chess_m = None
        try:
            chess_m = board.parse_san(san_str)
        except Exception:
            if from_sq and to_sq:
                try:
                    uci_str = f"{from_sq}{to_sq}{promo.lower() if promo else ''}"
                    chess_m = chess.Move.from_uci(uci_str)
                except Exception:
                    pass

        is_sac = False
        if chess_m and chess_m in board.legal_moves:
            is_sac = is_material_sacrifice(board, chess_m)
            board.push(chess_m)
        else:
            board = chess.Board(raw_m.get("fen", board.fen()))

        played_chess_moves.append(chess_m)
        is_sacrifice_flags.append(is_sac)
        positions.append(board.copy())

    # Now evaluate positions 0 .. total_moves (N + 1 positions total)
    pos_evals: List[Dict[str, Any]] = []
    depths_reached: List[int] = []
    total_positions = len(positions)

    for p_idx, pos_board in enumerate(positions):
        if pos_board.is_checkmate():
            # Mover who created this position won
            # If pos_board.turn is BLACK, White delivered checkmate (+99)
            eval_val = 99.0 if pos_board.turn == chess.BLACK else -99.0
            pos_evals.append({
                "eval": eval_val,
                "mate": 0,
                "best_move_san": None,
                "gap_to_second": 0.0,
                "top_lines": []
            })
        elif pos_board.is_stalemate() or pos_board.is_insufficient_material():
            pos_evals.append({
                "eval": 0.0,
                "mate": None,
                "best_move_san": None,
                "gap_to_second": 0.0,
                "top_lines": []
            })
        else:
            # Engine search
            limit = chess.engine.Limit(depth=depth, time=time_per_move)
            infos = engine.analyse(pos_board, limit=limit, multipv=multipv)
            if isinstance(infos, dict):
                infos = [infos]

            top_lines: List[Dict[str, Any]] = []
            best_eval = 0.2
            best_mate = None
            best_san = None

            for i, info in enumerate(infos):
                pv = info.get("pv", [])
                if not pv:
                    continue
                score = info.get("score")
                line_eval = 0.0
                line_mate = None
                if score:
                    w_sc = score.white()
                    if w_sc.is_mate():
                        m_dist = w_sc.mate()
                        line_mate = m_dist
                        line_eval = 99.0 if m_dist > 0 else -99.0
                    else:
                        cp = w_sc.score()
                        line_eval = round(cp / 100.0, 2) if cp is not None else 0.0

                if i == 0:
                    best_eval = line_eval
                    best_mate = line_mate
                    try:
                        best_san = pos_board.san(pv[0])
                    except Exception:
                        best_san = pv[0].uci()

                pv_sans: List[str] = []
                tb = pos_board.copy()
                for m in pv[:6]:
                    try:
                        pv_sans.append(tb.san(m))
                        tb.push(m)
                    except Exception:
                        break

                why_desc = generate_line_why_template(pos_board, pv[0])
                top_lines.append({
                    "move": pv_sans[0] if pv_sans else pv[0].uci(),
                    "eval": line_eval,
                    "mate": line_mate,
                    "depth": info.get("depth", depth),
                    "why": why_desc,
                    "pv": pv_sans
                })

            gap_2nd = 0.0
            if len(top_lines) >= 2:
                w1 = eval_to_win_pct(top_lines[0]["eval"], top_lines[0]["mate"])
                w2 = eval_to_win_pct(top_lines[1]["eval"], top_lines[1]["mate"])
                gap_2nd = abs(w1 - w2)

            if top_lines:
                depths_reached.append(top_lines[0].get("depth", depth))
            pos_evals.append({
                "eval": best_eval,
                "mate": best_mate,
                "best_move_san": best_san,
                "gap_to_second": gap_2nd,
                "top_lines": top_lines
            })

        if on_progress:
            on_progress(int(((p_idx + 1) / total_positions) * 100))

    # 2. Correlate moves: move i starts at pos i, ends at pos i+1
    analyzed_moves: List[Dict[str, Any]] = []
    is_in_book = True
    current_move_sans: List[str] = []
    last_mover_made_mistake = False

    for idx, raw_move in enumerate(moves_list):
        san_move = raw_move.get("san", "")
        color = raw_move.get("color", "w")
        current_move_sans.append(san_move)

        pos_before = pos_evals[idx]
        pos_after = pos_evals[idx + 1]

        # Book move identification (stops at first non-book move)
        is_book_move = False
        if is_in_book:
            resulting_board = positions[idx + 1]
            if tuple(current_move_sans) in BOOK_PREFIXES or resulting_board.epd() in BOOK_POSITION_EPDS:
                is_book_move = True
            else:
                is_in_book = False

        board_before = positions[idx]
        n_legal = len(list(board_before.legal_moves))

        # Check recapture: opponent captured on S, current move captures back on S
        is_recap = False
        if board_before.move_stack:
            prev_m = board_before.peek()
            cur_m = played_chess_moves[idx]
            if cur_m and cur_m.to_square == prev_m.to_square:
                b_copy = board_before.copy()
                b_copy.pop()
                if b_copy.is_capture(prev_m) and board_before.is_capture(cur_m):
                    is_recap = True

        # Check if played move is top move ONLY (second lines with equal eval become excellent)
        is_top = (san_move == pos_before["best_move_san"])

        is_cm = (pos_after["mate"] == 0)

        # Detect if best line wins material or delivers mate
        best_wins_material_or_mate = False
        best_eval_gap = 0.0
        if pos_before.get("top_lines"):
            top_l = pos_before["top_lines"][0]
            b_ev = top_l.get("eval", pos_after["eval"])
            b_m = top_l.get("mate")
            if color == 'w':
                best_eval_gap = b_ev - pos_after["eval"]
            else:
                best_eval_gap = pos_after["eval"] - b_ev

            if b_m is not None:
                best_wins_material_or_mate = True
            else:
                tb = board_before.copy()
                mover_color = chess.WHITE if color == 'w' else chess.BLACK
                opp_color = chess.BLACK if color == 'w' else chess.WHITE
                init_mat = sum([1, 3, 3, 5, 9][p-1] * len(tb.pieces(p, mover_color)) for p in range(1, 6)) - \
                           sum([1, 3, 3, 5, 9][p-1] * len(tb.pieces(p, opp_color)) for p in range(1, 6))
                for psan in top_l.get("pv", [])[:4]:
                    try:
                        tb.push_san(psan)
                    except Exception:
                        break
                    cur_mat = sum([1, 3, 3, 5, 9][p-1] * len(tb.pieces(p, mover_color)) for p in range(1, 6)) - \
                              sum([1, 3, 3, 5, 9][p-1] * len(tb.pieces(p, opp_color)) for p in range(1, 6))
                    if cur_mat - init_mat >= 2:
                        best_wins_material_or_mate = True
                        break

        mover_rating = white_rating if color == 'w' else black_rating
        classification = classify_move(
            eval_before_pawns=pos_before["eval"],
            eval_after_pawns=pos_after["eval"],
            color=color,
            mate_before=pos_before["mate"],
            mate_after=pos_after["mate"],
            is_book=is_book_move,
            is_sacrifice=is_sacrifice_flags[idx],
            gap_to_second_win_pct=pos_before["gap_to_second"],
            opponent_just_made_mistake=last_mover_made_mistake,
            is_top_engine_move=is_top,
            is_checkmate=is_cm,
            is_recapture=is_recap,
            num_legal_moves=n_legal,
            best_wins_material_or_mate=best_wins_material_or_mate,
            best_eval_gap=best_eval_gap,
            rating=mover_rating,
        )

        last_mover_made_mistake = (classification in ("inaccuracy", "mistake", "miss", "blunder"))

        # Win% calculation
        played_win_pct = eval_to_win_pct(pos_after["eval"], pos_after["mate"], rating=mover_rating)
        if color == 'b':
            played_win_pct = round(100.0 - played_win_pct, 1)

        top_lines = pos_before["top_lines"]
        top_pv = top_lines[0].get("pv", []) if top_lines else []
        engine_line_why = top_lines[0].get("why", "Engine recommended line") if top_lines else "Engine recommended line"

        # Generate why for the move actually played
        cur_chess_m = played_chess_moves[idx]
        played_move_why = ""
        if cur_chess_m and cur_chess_m in board_before.legal_moves:
            played_move_why = generate_line_why_template(board_before, cur_chess_m)

        # Fast template comment for baseline
        tmpl_comment = generate_template_comment(
            san=raw_move["san"],
            classification=classification,
            best_move=pos_before["best_move_san"],
            eval_before=pos_before["eval"],
            eval_after=pos_after["eval"],
            pv=top_pv,
            color=color,
        )

        updated_m = dict(raw_move)
        updated_m["classification"] = classification
        updated_m["coachComment"] = tmpl_comment
        updated_m["eval"] = {
            "eval": pos_after["eval"],
            "mate": pos_after["mate"],
            "bestMove": pos_before["best_move_san"],
            "winPct": played_win_pct,
            "why": played_move_why if played_move_why else (engine_line_why if is_top else ""),
            "bestWhy": engine_line_why,
            "lines": pos_before["top_lines"]
        }
        # Metadata for post-engine turning-point LLM pass
        updated_m["_fen_before"] = board_before.fen()
        updated_m["_fen_after"] = positions[idx + 1].fen()
        updated_m["_eval_before"] = pos_before["eval"]
        updated_m["_eval_after"] = pos_after["eval"]
        updated_m["_color"] = color
        analyzed_moves.append(updated_m)

    # Compute game-level accuracy using the Chess.com calibrated method
    accuracy = calculate_game_accuracy(analyzed_moves, method="chesscom")
    est_ratings = estimate_performance_ratings(
        accuracy,
        white_base_rating=white_rating,
        black_base_rating=black_rating
    )
    phase_grades = calculate_phase_grades(analyzed_moves, is_user_white=is_user_white)

    real_depth = int(round(sum(depths_reached) / len(depths_reached))) if depths_reached else depth
    return {
        "moves": analyzed_moves,
        "accuracy": accuracy,
        "estimatedRating": est_ratings,
        "phaseGrades": {
            "white": phase_grades["white"],
            "black": phase_grades["black"]
        },
        "phaseGradesAll": phase_grades,
        "analysisLevel": level,
        "analysisDepth": real_depth
    }


def select_critical_turning_point_indices(analyzed_moves: List[Dict[str, Any]], max_llm_calls: int = 8) -> List[int]:
    blunders = []
    misses = []
    brilliants_greats = []
    mistakes = []
    critical_bests = []

    for idx, m in enumerate(analyzed_moves):
        cls = m.get("classification")
        if cls == "blunder":
            blunders.append(idx)
        elif cls == "miss":
            misses.append(idx)
        elif cls in ("brilliant", "great"):
            brilliants_greats.append(idx)
        elif cls == "mistake":
            mistakes.append(idx)
        elif cls == "best":
            lines = m.get("eval", {}).get("lines", [])
            if len(lines) >= 2:
                eval1 = lines[0].get("eval", 0.0) or 0.0
                eval2 = lines[1].get("eval", 0.0) or 0.0
                if abs(eval1 - eval2) >= 1.5:
                    critical_bests.append(idx)

    critical_bests = critical_bests[:2]
    selected = []
    for group in (blunders, misses, brilliants_greats, mistakes, critical_bests):
        for idx in group:
            if idx not in selected and len(selected) < max_llm_calls:
                selected.append(idx)

    return sorted(selected)


async def analyze_game_moves_full(
    moves_list: List[Dict[str, Any]],
    level: str = "standard",
    depth: Optional[int] = None,
    time_per_move: Optional[float] = None,
    is_user_white: bool = True,
    white_rating: Optional[int] = None,
    black_rating: Optional[int] = None,
    on_progress: Optional[Callable[[int], None]] = None,
    db: Optional[Session] = None
) -> Dict[str, Any]:
    """
    Performs game review across every position in a game according to specified analysis level.
    Acquires an exclusive SimpleEngine instance from the pool.
    """
    level_cfg = ANALYSIS_LEVELS.get(level, ANALYSIS_LEVELS["standard"])
    target_depth = depth if depth is not None else level_cfg["depth"]
    target_time = time_per_move if time_per_move is not None else level_cfg["time_per_move"]
    multipv = level_cfg.get("multipv", 3)

    pool = get_global_engine_pool()
    async with pool.acquire() as engine:
        review_data = await asyncio.to_thread(
            _run_single_pass_review_sync,
            engine,
            moves_list,
            target_depth,
            target_time,
            multipv,
            is_user_white,
            white_rating,
            black_rating,
            on_progress,
            db,
            level
        )

    # Scale turning points comment limit with depth level
    level_comment_limits = {
        "standard": 8,
        "deep": 12,
        "deeper": 16,
        "max": 20
    }
    max_llm_calls = level_comment_limits.get(level, 8)
    analyzed_moves = review_data["moves"]
    critical_indices = select_critical_turning_point_indices(analyzed_moves, max_llm_calls=max_llm_calls)

    if critical_indices and not is_testing_environment():
        items_to_generate = []
        for c_idx in critical_indices:
            m = analyzed_moves[c_idx]
            lines = m.get("eval", {}).get("lines", [])
            top_pv = lines[0].get("pv", []) if lines else []
            items_to_generate.append({
                "fen_before": m["_fen_before"],
                "san": m["san"],
                "classification": m["classification"],
                "fen_after": m["_fen_after"],
                "eval_before": m["_eval_before"],
                "eval_after": m["_eval_after"],
                "best_move": m["eval"]["bestMove"],
                "pv": top_pv,
                "color": m["_color"],
            })

        try:
            llm_results = await generate_batch_move_comments_async(items_to_generate, db=db, concurrency_limit=2)
            for c_idx, res in zip(critical_indices, llm_results):
                if res and res.get("comment"):
                    analyzed_moves[c_idx]["coachComment"] = res["comment"]
        except Exception as e:
            logger.warning(f"[EngineService] LLM commentary batch generation error: {e}")

    # Remove temporary internal keys
    for m in analyzed_moves:
        for k in ("_fen_before", "_fen_after", "_eval_before", "_eval_after", "_color"):
            m.pop(k, None)

    return review_data
