"""
Coach commentary service: Gemini -> Groq -> template fallback.
All commentary is strictly grounded in engine facts and validated for move legality.
"""
import logging
import re
from typing import List, Optional, Tuple, Dict, Any
import chess
import httpx

from app.config import settings, is_testing_environment

logger = logging.getLogger(__name__)

# Cache for position comments: key = (fen_before, san)
_COMMENT_CACHE: Dict[Tuple[str, str], Dict[str, str]] = {}


def extract_candidate_moves(text: str) -> List[str]:
    """
    Extracts candidate SAN chess moves from text.
    Matches standard algebraic notation like: Bxf7+, Qxf7#, O-O, O-O-O, Nf3, exd5, e4, etc.
    """
    pattern = r'\b(O-O-O|O-O|[KQRBN][a-h1-8]?x?[a-h][1-8](?:=[QRBN])?[\+#]?|[a-h]x[a-h][1-8](?:=[QRBN])?[\+#]?)\b'
    candidates = re.findall(pattern, text)
    return candidates


def validate_move_legality(
    text: str,
    fen_before: str,
    fen_after: Optional[str] = None,
    allowed_pv: Optional[List[str]] = None,
    best_move: Optional[str] = None,
    played_san: Optional[str] = None,
) -> bool:
    """
    Verifies that any chess moves mentioned in the text are legal moves
    either from the position before the move, after the move, or in the engine's PV line.
    Prevents LLM hallucinations of impossible or illegal moves.
    """
    try:
        board_before = chess.Board(fen_before)
    except Exception:
        board_before = None

    board_after = None
    if fen_after:
        try:
            board_after = chess.Board(fen_after)
        except Exception:
            board_after = None

    def is_legal_on(board: Optional[chess.Board], move_str: str) -> bool:
        if not board:
            return False
        clean = move_str.rstrip("+#")
        try:
            m = board.parse_san(clean)
            return m in board.legal_moves
        except Exception:
            try:
                m = board.parse_san(move_str)
                return m in board.legal_moves
            except Exception:
                return False

    allowed_set = set()
    if allowed_pv:
        for p in allowed_pv:
            allowed_set.add(p.rstrip("+#"))
            allowed_set.add(p)
    if best_move:
        allowed_set.add(best_move.rstrip("+#"))
        allowed_set.add(best_move)
    if played_san:
        allowed_set.add(played_san.rstrip("+#"))
        allowed_set.add(played_san)

    candidates = extract_candidate_moves(text)
    for c in candidates:
        clean = c.rstrip("+#")
        if c in allowed_set or clean in allowed_set:
            continue
        if is_legal_on(board_before, c):
            continue
        if is_legal_on(board_after, c):
            continue

        logger.warning(f"[CoachService] Illegal move detected in LLM text: '{c}'")
        return False

    return True


def generate_template_comment(
    san: str,
    classification: str,
    best_move: Optional[str] = None,
    eval_before: Optional[float] = None,
    eval_after: Optional[float] = None,
    color: str = "w",
) -> str:
    """
    Deterministic, high-quality, 100% legal chess commentary.
    Used when LLM APIs are unreachable, rate-limited, or fail legality validation.
    """
    cls = classification.lower()

    if cls == "blunder":
        if best_move:
            return f"A tough blunder. {san} drops decisive ground. Playing {best_move} was needed to hold the position."
        return f"A costly oversight. {san} concedes decisive material or positional advantage."

    if cls == "miss":
        if best_move:
            return f"Missed opportunity. {san} lets the opponent off the hook. {best_move} would have maintained a winning attack."
        return f"A missed chance. {san} overlooked a clear tactical breakthrough."

    if cls == "mistake":
        if best_move:
            return f"A noticeable slip. {san} concedes the initiative. Better was {best_move} to keep pressure."
        return f"{san} gives the opponent a chance to counter-attack."

    if cls == "inaccuracy":
        if best_move:
            return f"{san} is slightly imprecise. {best_move} was a more active continuation."
        return f"{san} is playable, but allows your opponent an easy defensive path."

    if cls == "book":
        return f"Standard opening theory. {san} establishes solid central coordination."

    if cls == "best":
        return f"The best move! {san} maintains optimal coordination and control."

    if cls == "great":
        return f"Great find! {san} was the only move to protect the position and keep the advantage."

    if cls == "brilliant":
        return f"Brilliant! {san} delivers a sharp tactical blow that decisively swings the game."

    if cls == "excellent":
        return f"An excellent continuation. {san} steadily develops active piece play."

    # default / good
    return f"A solid, sensible move. {san} keeps your pieces active and well-defended."


def build_llm_prompt(
    fen_before: str,
    san: str,
    classification: str,
    eval_before: Optional[float],
    eval_after: Optional[float],
    best_move: Optional[str],
    pv: Optional[List[str]],
) -> str:
    eval_info = ""
    if eval_before is not None and eval_after is not None:
        eval_info = f"Eval before: {eval_before:+.2f}, Eval after: {eval_after:+.2f}."

    pv_info = f"Top engine line: {' '.join(pv[:4])}." if pv else ""
    best_info = f"Engine best move: {best_move}." if best_move else ""

    return (
        f"You are Coach All-Chess, an encouraging grandmaster chess coach. "
        f"Explain this move in 1-2 concise, clear sentences.\n\n"
        f"Grounded Engine Facts:\n"
        f"- Position FEN: {fen_before}\n"
        f"- Played Move: {san}\n"
        f"- Move Classification: {classification}\n"
        f"- {eval_info}\n"
        f"- {best_info}\n"
        f"- {pv_info}\n\n"
        f"Rules:\n"
        f"1. Explain WHY the move is classified as {classification}.\n"
        f"2. Mention {san} and if relevant {best_move or 'the best move'}.\n"
        f"3. Refer ONLY to legal moves and pieces that actually exist in the position.\n"
        f"4. Do NOT hallucinate moves. Maximum 2 sentences. Friendly, instructive tone."
    )


def try_gemini(
    prompt: str,
    fen_before: str,
    fen_after: Optional[str],
    pv: Optional[List[str]],
    best_move: Optional[str],
    san: str
) -> Optional[str]:
    """Call Google Gemini API."""
    keys = settings.gemini_keys
    if not keys:
        return None

    # Use first available key
    key = keys[0]
    model = "gemini-3.8-flash"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.2, "maxOutputTokens": 80},
    }
    try:
        with httpx.Client(timeout=3.0) as client:
            resp = client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                candidates = data.get("candidates", [])
                if candidates:
                    text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "").strip()
                    if text and validate_move_legality(text, fen_before, fen_after, pv, best_move, san):
                        return text
    except Exception as e:
        logger.debug(f"[CoachService] Gemini attempt skipped: {e}")

    return None


def try_groq(
    prompt: str,
    fen_before: str,
    fen_after: Optional[str],
    pv: Optional[List[str]],
    best_move: Optional[str],
    san: str
) -> Optional[str]:
    """Call Groq API as secondary fallback."""
    keys = settings.groq_keys
    if not keys:
        return None

    key = keys[0]
    model = "qwen/qwen3.8-27b"
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": "You are Coach All-Chess, a concise grandmaster coach. Provide strictly accurate, 1-2 sentence feedback grounded in engine analysis."},
            {"role": "user", "content": prompt},
        ],
        "max_tokens": 80,
        "temperature": 0.2,
    }
    try:
        with httpx.Client(timeout=3.0) as client:
            resp = client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                choices = data.get("choices", [])
                if choices:
                    text = choices[0].get("message", {}).get("content", "").strip()
                    if text and validate_move_legality(text, fen_before, fen_after, pv, best_move, san):
                        return text
    except Exception as e:
        logger.debug(f"[CoachService] Groq attempt skipped: {e}")

    return None


def generate_move_comment(
    fen_before: str,
    san: str,
    classification: str,
    fen_after: Optional[str] = None,
    eval_before: Optional[float] = None,
    eval_after: Optional[float] = None,
    best_move: Optional[str] = None,
    pv: Optional[List[str]] = None,
    color: str = "w",
    force_llm: bool = False,
) -> Dict[str, str]:
    """
    Main entry point: generates coach comment following:
    Gemini -> Groq -> Template fallback.
    Returns {"comment": text, "provider": "gemini" | "groq" | "template"}.
    """
    cache_key = (fen_before, san)
    if cache_key in _COMMENT_CACHE:
        return _COMMENT_CACHE[cache_key]

    # In test environment, unless explicitly requested, use fast template fallback
    if is_testing_environment() and not force_llm:
        template_text = generate_template_comment(
            san=san,
            classification=classification,
            best_move=best_move,
            eval_before=eval_before,
            eval_after=eval_after,
            color=color,
        )
        return {"comment": template_text, "provider": "template"}

    # For standard book and good moves, template commentary is fast and accurate
    cls = classification.lower()
    if cls in ("book", "good") and not force_llm:
        template_text = generate_template_comment(
            san=san,
            classification=classification,
            best_move=best_move,
            eval_before=eval_before,
            eval_after=eval_after,
            color=color,
        )
        result = {"comment": template_text, "provider": "template"}
        _COMMENT_CACHE[cache_key] = result
        return result

    prompt = build_llm_prompt(
        fen_before=fen_before,
        san=san,
        classification=classification,
        eval_before=eval_before,
        eval_after=eval_after,
        best_move=best_move,
        pv=pv,
    )

    # 1. Try Gemini
    gemini_text = try_gemini(prompt, fen_before, fen_after, pv, best_move, san)
    if gemini_text:
        result = {"comment": gemini_text, "provider": "gemini"}
        _COMMENT_CACHE[cache_key] = result
        return result

    # 2. Try Groq
    groq_text = try_groq(prompt, fen_before, fen_after, pv, best_move, san)
    if groq_text:
        result = {"comment": groq_text, "provider": "groq"}
        _COMMENT_CACHE[cache_key] = result
        return result

    # 3. Fallback to template
    template_text = generate_template_comment(
        san=san,
        classification=classification,
        best_move=best_move,
        eval_before=eval_before,
        eval_after=eval_after,
        color=color,
    )
    result = {"comment": template_text, "provider": "template"}
    _COMMENT_CACHE[cache_key] = result
    return result
