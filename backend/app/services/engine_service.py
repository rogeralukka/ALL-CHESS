import os
import shutil
import asyncio
import logging
from typing import List, Dict, Any, Optional, Callable
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

_ENGINE_SEMAPHORE = asyncio.Semaphore(2)


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
        "Please check STOCKFISH_PATH in backend/.env or run backend/scripts/setup.ps1 (setup.sh)."
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


class EngineWorker:
    def __init__(self, stockfish_path: str):
        self.stockfish_path = stockfish_path
        self._engine: Optional[chess.engine.SimpleEngine] = None

    def get_or_create_engine(self) -> chess.engine.SimpleEngine:
        if self._engine is not None:
            try:
                # Ping engine
                self._engine.ping()
                return self._engine
            except Exception:
                logger.warning("Stockfish engine was unresponsive. Restarting...")
                self.close()

        logger.info(f"Launching Stockfish from {self.stockfish_path}")
        engine = chess.engine.SimpleEngine.popen_uci(self.stockfish_path)
        engine.configure({
            "Threads": 4,
            "Hash": 256
        })
        self._engine = engine
        return self._engine

    def close(self) -> None:
        if self._engine is not None:
            try:
                self._engine.quit()
            except Exception:
                pass
            self._engine = None

    def analyse_fen_sync(
        self,
        fen: str,
        depth: int = 14,
        multipv: int = 3,
        time_limit: float = 0.5
    ) -> List[TopEngineLine]:
        engine = self.get_or_create_engine()
        board = chess.Board(fen)

        limit = chess.engine.Limit(depth=depth, time=time_limit)
        infos = engine.analyse(board, limit=limit, multipv=multipv)

        # Normalise infos to list
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
                    mate_val = white_score.mate()
                    eval_pawns = 99.0 if (mate_val and mate_val > 0) else -99.0
                else:
                    cp = white_score.score()
                    eval_pawns = round(cp / 100.0, 2) if cp is not None else 0.0

            # Convert PV to SAN
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


_GLOBAL_ENGINE_WORKER: Optional[EngineWorker] = None


def get_global_engine_worker() -> EngineWorker:
    global _GLOBAL_ENGINE_WORKER
    if _GLOBAL_ENGINE_WORKER is None:
        path = get_stockfish_executable_path()
        _GLOBAL_ENGINE_WORKER = EngineWorker(path)
    return _GLOBAL_ENGINE_WORKER


async def analyze_position(
    fen: str,
    depth: int = 14,
    multipv: int = 3,
    time_limit: float = 0.5
) -> List[TopEngineLine]:
    """Analyzes a single FEN position asynchronously behind the concurrency semaphore."""
    async with _ENGINE_SEMAPHORE:
        worker = get_global_engine_worker()
        return await asyncio.to_thread(worker.analyse_fen_sync, fen, depth, multipv, time_limit)


async def analyze_game_moves_full(
    moves_list: List[Dict[str, Any]],
    depth: int = 16,
    time_per_move: float = 0.3,
    on_progress: Optional[Callable[[int], None]] = None
) -> Dict[str, Any]:
    """
    Performs full depth 16 game review across every position in a game.
    Runs inside the 2-job concurrency semaphore.
    """
    async with _ENGINE_SEMAPHORE:
        worker = get_global_engine_worker()

        def _run_full_review() -> Dict[str, Any]:
            board = chess.Board()
            analyzed_moves: List[Dict[str, Any]] = []
            total_moves = len(moves_list)

            last_eval = 0.2
            last_mate: Optional[int] = None
            last_mover_made_mistake = False

            for idx, raw_move in enumerate(moves_list):
                # 1. Analyze position BEFORE the move
                limit = chess.engine.Limit(depth=depth, time=time_per_move)
                engine = worker.get_or_create_engine()
                infos = engine.analyse(board, limit=limit, multipv=3)
                if isinstance(infos, dict):
                    infos = [infos]

                # Extract top engine lines
                top_lines: List[Dict[str, Any]] = []
                best_line_eval = 0.2
                best_line_mate = None
                best_move_san = raw_move.get("san", "")
                gap_to_second_win_pct = 0.0

                for i, info in enumerate(infos):
                    pv = info.get("pv", [])
                    if not pv:
                        continue
                    score = info.get("score")
                    line_eval = 0.0
                    line_mate = None
                    if score:
                        w_score = score.white()
                        if w_score.is_mate():
                            line_mate = w_score.mate()
                            line_eval = 99.0 if (line_mate and line_mate > 0) else -99.0
                        else:
                            cp = w_score.score()
                            line_eval = round(cp / 100.0, 2) if cp is not None else 0.0

                    if i == 0:
                        best_line_eval = line_eval
                        best_line_mate = line_mate
                        try:
                            best_move_san = board.san(pv[0])
                        except Exception:
                            best_move_san = pv[0].uci()

                    pv_sans: List[str] = []
                    tb = board.copy()
                    for m in pv[:6]:
                        try:
                            pv_sans.append(tb.san(m))
                            tb.push(m)
                        except Exception:
                            break

                    why_desc = generate_line_why_template(board, pv[0])
                    top_lines.append({
                        "move": pv_sans[0] if pv_sans else pv[0].uci(),
                        "eval": line_eval,
                        "mate": line_mate,
                        "depth": info.get("depth", depth),
                        "why": why_desc,
                        "pv": pv_sans
                    })

                # Calculate gap to 2nd line in win%
                if len(top_lines) >= 2:
                    win1 = eval_to_win_pct(top_lines[0]["eval"], top_lines[0]["mate"])
                    win2 = eval_to_win_pct(top_lines[1]["eval"], top_lines[1]["mate"])
                    gap_to_second_win_pct = abs(win1 - win2)

                # 2. Find and execute played move
                color = raw_move.get("color", "w")
                san_move = raw_move.get("san", "")
                from_sq = raw_move.get("from")
                to_sq = raw_move.get("to")
                promo = raw_move.get("promotion")

                played_chess_move = None
                try:
                    played_chess_move = board.parse_san(san_move)
                except Exception:
                    if from_sq and to_sq:
                        try:
                            uci_str = f"{from_sq}{to_sq}{promo.lower() if promo else ''}"
                            played_chess_move = chess.Move.from_uci(uci_str)
                        except Exception:
                            pass

                is_sac = False
                if played_chess_move and played_chess_move in board.legal_moves:
                    is_sac = is_material_sacrifice(board, played_chess_move)
                    board.push(played_chess_move)
                else:
                    # Fallback if unparseable move
                    board = chess.Board(raw_move.get("fen", board.fen()))

                # 3. Analyze position AFTER the move
                infos_after = engine.analyse(board, limit=chess.engine.Limit(depth=min(12, depth), time=0.15), multipv=1)
                if isinstance(infos_after, list) and infos_after:
                    infos_after = infos_after[0]
                after_eval = best_line_eval
                after_mate = best_line_mate
                if isinstance(infos_after, dict) and infos_after.get("score"):
                    w_sc = infos_after["score"].white()
                    if w_sc.is_mate():
                        after_mate = w_sc.mate()
                        after_eval = 99.0 if (after_mate and after_mate > 0) else -99.0
                    else:
                        cp = w_sc.score()
                        after_eval = round(cp / 100.0, 2) if cp is not None else best_line_eval

                # 4. Classify move
                is_top = (san_move == best_move_san)
                is_book_move = raw_move.get("classification") == "book" or (idx < 6 and raw_move.get("classification") == "book")

                classification = classify_move(
                    eval_before_pawns=best_line_eval,
                    eval_after_pawns=after_eval,
                    color=color,
                    mate_before=best_line_mate,
                    mate_after=after_mate,
                    is_book=is_book_move,
                    is_sacrifice=is_sac,
                    gap_to_second_win_pct=gap_to_second_win_pct,
                    opponent_just_made_mistake=last_mover_made_mistake,
                    is_top_engine_move=is_top
                )

                last_mover_made_mistake = (classification in ("mistake", "blunder", "inaccuracy"))

                # Win%
                played_win_pct = eval_to_win_pct(after_eval, after_mate)
                if color == 'b':
                    played_win_pct = round(100.0 - played_win_pct, 1)

                updated_m = dict(raw_move)
                updated_m["classification"] = classification
                updated_m["eval"] = {
                    "eval": after_eval,
                    "mate": after_mate,
                    "bestMove": best_move_san,
                    "winPct": played_win_pct,
                    "why": top_lines[0]["why"] if top_lines else "Best engine line.",
                    "lines": top_lines
                }
                analyzed_moves.append(updated_m)

                if on_progress and total_moves > 0:
                    on_progress(int(((idx + 1) / total_moves) * 100))

            accuracy = calculate_game_accuracy(analyzed_moves)
            est_ratings = estimate_performance_ratings(accuracy)
            phase_grades = calculate_phase_grades(analyzed_moves)

            return {
                "moves": analyzed_moves,
                "accuracy": accuracy,
                "estimatedRating": est_ratings,
                "phaseGrades": phase_grades
            }

        return await asyncio.to_thread(_run_full_review)
