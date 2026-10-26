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
from app.schemas.game import TopEngineLine

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
    """Generates a human-friendly template reason for the suggested line."""
    to_sq_name = chess.square_name(move.to_square)
    if board.is_capture(move):
        captured = board.piece_at(move.to_square)
        cap_name = chess.piece_name(captured.piece_type) if captured else "piece"
        return f"Captures {cap_name} on {to_sq_name}, winning material or relieving tactical tension."
    if board.gives_check(move):
        return f"Delivers check on {to_sq_name}, disrupting opponent coordination."
    if move in (chess.Move.from_uci("e1g1"), chess.Move.from_uci("e1c1"), chess.Move.from_uci("e8g8"), chess.Move.from_uci("e8c8")):
        return "Castles to secure king safety and activate the rook on an open file."
    if to_sq_name in ("e4", "d4", "e5", "d5", "c4", "c5"):
        return f"Stakes a central claim on {to_sq_name} and expands board influence."
    return f"Advances to {to_sq_name}, coordinating pieces and maintaining pressure."


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
            engine.configure({"Threads": 2, "Hash": 128})
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
                engine.configure({"Threads": 2, "Hash": 128})
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


_GLOBAL_ENGINE_POOL = EnginePool(size=2)


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
    depth: int = 16,
    time_per_move: float = 0.3,
    is_user_white: bool = True,
    white_rating: Optional[int] = None,
    black_rating: Optional[int] = None,
    on_progress: Optional[Callable[[int], None]] = None
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
            infos = engine.analyse(pos_board, limit=limit, multipv=3)
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

        # Check if played move is top move OR has equal eval/mate to top line
        is_top = (san_move == pos_before["best_move_san"])
        if not is_top and pos_before.get("top_lines"):
            top_line = pos_before["top_lines"][0]
            for line in pos_before["top_lines"][1:]:
                if line.get("move") == san_move:
                    if line.get("eval") == top_line.get("eval") and line.get("mate") == top_line.get("mate"):
                        is_top = True
                    break

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
            best_eval_gap=best_eval_gap
        )

        last_mover_made_mistake = (classification in ("inaccuracy", "mistake", "blunder"))

        # Win% calculation
        played_win_pct = eval_to_win_pct(pos_after["eval"], pos_after["mate"])
        if color == 'b':
            played_win_pct = round(100.0 - played_win_pct, 1)

        updated_m = dict(raw_move)
        updated_m["classification"] = classification
        updated_m["eval"] = {
            "eval": pos_after["eval"],
            "mate": pos_after["mate"],
            "bestMove": pos_before["best_move_san"],
            "winPct": played_win_pct,
            "why": pos_before["top_lines"][0]["why"] if pos_before["top_lines"] else "",
            "lines": pos_before["top_lines"]
        }
        analyzed_moves.append(updated_m)

    # Compute game-level accuracy using the Chess.com calibrated method
    accuracy = calculate_game_accuracy(analyzed_moves, method="chesscom")
    est_ratings = estimate_performance_ratings(
        accuracy,
        white_base_rating=white_rating,
        black_base_rating=black_rating
    )
    phase_grades = calculate_phase_grades(analyzed_moves, is_user_white=is_user_white)

    return {
        "moves": analyzed_moves,
        "accuracy": accuracy,
        "estimatedRating": est_ratings,
        "phaseGrades": phase_grades["user"],
        "phaseGradesAll": phase_grades
    }


async def analyze_game_moves_full(
    moves_list: List[Dict[str, Any]],
    depth: int = 16,
    time_per_move: float = 0.3,
    is_user_white: bool = True,
    white_rating: Optional[int] = None,
    black_rating: Optional[int] = None,
    on_progress: Optional[Callable[[int], None]] = None
) -> Dict[str, Any]:
    """
    Performs full depth 16 game review across every position in a game.
    Acquires an exclusive SimpleEngine instance from the pool.
    """
    pool = get_global_engine_pool()
    async with pool.acquire() as engine:
        return await asyncio.to_thread(
            _run_single_pass_review_sync,
            engine,
            moves_list,
            depth,
            time_per_move,
            is_user_white,
            white_rating,
            black_rating,
            on_progress
        )
