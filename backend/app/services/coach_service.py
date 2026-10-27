"""
Coach commentary service: Gemini -> Groq -> template fallback.
All commentary is strictly grounded in engine facts and validated for move legality.
Database persistence in coach_cache with key rotation and safe logging.
"""
import asyncio
import hashlib
import logging
import re
import time
from typing import List, Optional, Tuple, Dict, Any
import chess
import httpx
from sqlalchemy.orm import Session

from app.config import settings, is_testing_environment
from app.models.scout import CoachCache

logger = logging.getLogger(__name__)

# In-memory cache for position comments: key = (fen_before, san)
_COMMENT_CACHE: Dict[Tuple[str, str], Dict[str, str]] = {}

# Cooldown tracking for rate-limited (429) or failing (5xx) keys
_KEY_COOLDOWNS: Dict[str, float] = {}


def hash_fen(fen: str) -> str:
    """Computes a SHA256 hex digest for a FEN string."""
    return hashlib.sha256(fen.encode("utf-8")).hexdigest()


def is_key_on_cooldown(key: str) -> bool:
    return time.time() < _KEY_COOLDOWNS.get(key, 0.0)


def set_key_cooldown(key: str, seconds: float = 60.0) -> None:
    _KEY_COOLDOWNS[key] = time.time() + seconds


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
    pv: Optional[List[str]] = None,
    color: str = "w",
) -> str:
    """
    High-quality, grounded deterministic chess coach explanation fallback.
    Explains the exact tactical meaning based on classification and best move.
    Includes refutation/pv lines for mistakes and blunders.
    Clamped to <= 220 characters.
    """
    best_desc = f" The engine preferred {best_move}." if best_move and best_move != san else ""
    ref_pv = ""
    if pv and len(pv) >= 2:
        ref_pv = f" ({' '.join(pv[:3])})"

    if classification == "brilliant":
        comment = f"{san} is a brilliant move! You found a deep, sacrifice-backed tactical shot that seized control."
    elif classification == "great":
        comment = f"{san} is a great move. It was the only move that maintained your advantage in a sharp position."
    elif classification == "best":
        if best_move and best_move == san:
            comment = f"{san} is the top engine recommendation, maintaining the optimal course for your pieces."
        else:
            comment = f"{san} is the best move in the position, efficiently improving piece harmony."
    elif classification == "excellent":
        comment = f"{san} is an excellent move, finding nearly all the benefits of the engine line."
    elif classification == "good":
        comment = f"{san} is a solid and natural move, keeping your position steady.{best_desc}"
    elif classification == "book":
        comment = f"{san} follows established opening theory."
    elif classification == "inaccuracy":
        alt = f" Better was {best_move}." if best_move and best_move != san else ""
        comment = f"{san} is a small slip that slightly loosens control.{alt}"
    elif classification == "mistake":
        alt = f" Best was {best_move}{ref_pv}." if best_move and best_move != san else ""
        comment = f"{san} is a mistake that gives up real ground.{alt}"
    elif classification == "miss":
        alt = f" {best_move}{ref_pv} was winning." if best_move and best_move != san else ""
        comment = f"A critical opportunity was missed with {san}.{alt}"
    elif classification == "blunder":
        alt = f" {best_move}{ref_pv} was required." if best_move and best_move != san else ""
        comment = f"{san} is a blunder that loses decisive material or control.{alt}"
    else:
        comment = f"{san} was played."

    if len(comment) > 220:
        comment = comment[:217] + "..."
    return comment


def build_coach_prompt(
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

    pv_info = f"Top engine line: {' '.join(pv[:3])}." if pv else ""
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
        f"1. Explain WHY the move {san} is classified as {classification}.\n"
        f"2. Mention {san} and if relevant {best_move or 'the best move'}.\n"
        f"3. Do NOT invent other move names or squares unless they are in the Engine best move: {best_move}.\n"
        f"4. Maximum 2 sentences. Friendly, instructive tone."
    )


async def try_gemini_async(
    prompt: str,
    fen_before: str,
    fen_after: Optional[str],
    pv: Optional[List[str]],
    best_move: Optional[str],
    san: str,
    client: httpx.AsyncClient,
) -> Optional[str]:
    """Call Google Gemini API with header-based key and key rotation."""
    keys = settings.gemini_keys
    if not keys:
        return None

    model = "gemini-3.8-flash"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.2, "maxOutputTokens": 100},
    }

    for key_idx, key in enumerate(keys):
        if is_key_on_cooldown(key):
            continue

        headers = {
            "x-goog-api-key": key,
            "Content-Type": "application/json",
        }
        try:
            resp = await client.post(url, json=payload, headers=headers, timeout=2.0)
            if resp.status_code == 200:
                data = resp.json()
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [{}])
                    text = parts[0].get("text", "").strip() if parts else ""
                    if text and validate_move_legality(text, fen_before, fen_after, pv, best_move, san):
                        return text
            elif resp.status_code in (429, 500, 502, 503, 504):
                set_key_cooldown(key, seconds=60.0)
                logger.warning(f"[CoachService] Gemini key {key_idx + 1} returned status {resp.status_code}, rotating key...")
                continue
            else:
                set_key_cooldown(key, seconds=60.0)
                logger.debug(f"[CoachService] Gemini key {key_idx + 1} returned {resp.status_code}")
                continue
        except Exception as e:
            set_key_cooldown(key, seconds=30.0)
            logger.debug(f"[CoachService] Gemini key {key_idx + 1} request error: {type(e).__name__}")
            continue

    return None


async def try_groq_async(
    prompt: str,
    fen_before: str,
    fen_after: Optional[str],
    pv: Optional[List[str]],
    best_move: Optional[str],
    san: str,
    client: httpx.AsyncClient,
) -> Optional[str]:
    """Call Groq API with Qwen3 and key rotation."""
    keys = settings.groq_keys
    if not keys:
        return None

    model = "qwen/qwen3.8-27b"
    url = "https://api.groq.com/openai/v1/chat/completions"
    payload = {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": "You are Coach All-Chess, an encouraging grandmaster chess coach. Provide strictly accurate, 1-2 sentence feedback grounded in engine analysis.",
            },
            {"role": "user", "content": prompt},
        ],
        "max_tokens": 200,
        "temperature": 0.2,
    }

    for key_idx, key in enumerate(keys):
        if is_key_on_cooldown(key):
            continue

        headers = {
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
        }
        try:
            resp = await client.post(url, json=payload, headers=headers, timeout=2.5)
            if resp.status_code == 200:
                data = resp.json()
                choices = data.get("choices", [])
                if choices:
                    content = choices[0].get("message", {}).get("content", "").strip()
                    # Strip any reasoning or think tokens
                    clean = re.sub(r"<think>[\s\S]*?</think>", "", content).strip()
                    clean = re.sub(r"</?think>", "", clean).strip()
                    if clean and validate_move_legality(clean, fen_before, fen_after, pv, best_move, san):
                        return clean
            elif resp.status_code in (429, 500, 502, 503, 504):
                set_key_cooldown(key, seconds=60.0)
                logger.warning(f"[CoachService] Groq key {key_idx + 1} returned status {resp.status_code}, rotating key...")
                continue
            else:
                logger.debug(f"[CoachService] Groq key {key_idx + 1} returned {resp.status_code}")
                continue
        except Exception as e:
            logger.debug(f"[CoachService] Groq key {key_idx + 1} request error: {type(e).__name__}")
            continue

    return None


def get_cached_comment(db: Optional[Session], fen_before: str, san: str) -> Optional[Dict[str, str]]:
    """Checks in-memory cache and coach_cache database table."""
    mem_key = (fen_before, san)
    if mem_key in _COMMENT_CACHE:
        return _COMMENT_CACHE[mem_key]

    if db:
        try:
            f_hash = hash_fen(fen_before)
            entry = db.query(CoachCache).filter(CoachCache.fen_hash == f_hash, CoachCache.move_san == san).first()
            if entry:
                res = {"comment": entry.response_text, "provider": "cache"}
                _COMMENT_CACHE[mem_key] = res
                return res
        except Exception as e:
            logger.debug(f"[CoachService] Error reading coach_cache: {e}")

    return None


def save_cached_comment(
    db: Optional[Session],
    fen_before: str,
    san: str,
    comment: str,
    provider: str,
    expression: str = "neutral",
) -> None:
    """Stores comment in memory and coach_cache database table."""
    mem_key = (fen_before, san)
    _COMMENT_CACHE[mem_key] = {"comment": comment, "provider": provider}

    if db:
        try:
            f_hash = hash_fen(fen_before)
            entry = CoachCache(
                fen_hash=f_hash,
                move_san=san,
                response_text=comment,
                expression=expression,
            )
            db.add(entry)
            db.commit()
        except Exception as e:
            db.rollback()
            logger.debug(f"[CoachService] Error saving to coach_cache: {e}")


def generate_move_comment(
    fen_before: str,
    san: str,
    classification: str = "good",
    fen_after: Optional[str] = None,
    eval_before: Optional[float] = None,
    eval_after: Optional[float] = None,
    best_move: Optional[str] = None,
    pv: Optional[List[str]] = None,
    color: str = "w",
    db: Optional[Session] = None,
) -> Dict[str, str]:
    """
    Synchronous entrypoint for move explanation.
    Checks cache -> Gemini -> Groq -> template.
    """
    cached = get_cached_comment(db, fen_before, san)
    if cached:
        return cached

    # In unit tests, default to fast template generator to keep test execution rapid
    if is_testing_environment():
        tmpl = generate_template_comment(
            san=san,
            classification=classification,
            best_move=best_move,
            eval_before=eval_before,
            eval_after=eval_after,
            pv=pv,
            color=color,
        )
        save_cached_comment(db, fen_before, san, tmpl, "template")
        return {"comment": tmpl, "provider": "template"}

    prompt = build_coach_prompt(
        fen_before=fen_before,
        san=san,
        classification=classification,
        eval_before=eval_before,
        eval_after=eval_after,
        best_move=best_move,
        pv=pv,
    )

    async def _call():
        async with httpx.AsyncClient() as client:
            text = await try_gemini_async(prompt, fen_before, fen_after, pv, best_move, san, client)
            if text:
                return text, "gemini"
            text = await try_groq_async(prompt, fen_before, fen_after, pv, best_move, san, client)
            if text:
                return text, "groq"
            return None, None

    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
                llm_text, provider = pool.submit(lambda: asyncio.run(_call())).result()
        else:
            llm_text, provider = loop.run_until_complete(_call())
    except Exception:
        llm_text, provider = None, None

    if llm_text and provider:
        save_cached_comment(db, fen_before, san, llm_text, provider)
        return {"comment": llm_text, "provider": provider}

    tmpl = generate_template_comment(
        san=san,
        classification=classification,
        best_move=best_move,
        eval_before=eval_before,
        eval_after=eval_after,
        pv=pv,
        color=color,
    )
    save_cached_comment(db, fen_before, san, tmpl, "template")
    return {"comment": tmpl, "provider": "template"}


async def generate_batch_move_comments_async(
    items: List[Dict[str, Any]],
    db: Optional[Session] = None,
    concurrency_limit: int = 2,
) -> List[Dict[str, str]]:
    """
    Generates comments for multiple moves using an async concurrency pool (limit 2).
    Respects provider rate limits, cooldowns, and persists results in coach_cache.
    """
    semaphore = asyncio.Semaphore(concurrency_limit)
    results = [None] * len(items)

    async with httpx.AsyncClient() as client:
        async def _worker(idx: int, item: Dict[str, Any]):
            fen_before = item["fen_before"]
            san = item["san"]
            classification = item.get("classification", "good")
            fen_after = item.get("fen_after")
            eval_before = item.get("eval_before")
            eval_after = item.get("eval_after")
            best_move = item.get("best_move")
            pv = item.get("pv")
            color = item.get("color", "w")

            # Check cache
            cached = get_cached_comment(db, fen_before, san)
            if cached:
                results[idx] = cached
                return

            if is_testing_environment():
                tmpl = generate_template_comment(san, classification, best_move, eval_before, eval_after, pv, color)
                save_cached_comment(db, fen_before, san, tmpl, "template")
                results[idx] = {"comment": tmpl, "provider": "template"}
                return

            prompt = build_coach_prompt(fen_before, san, classification, eval_before, eval_after, best_move, pv)

            async with semaphore:
                # Try Gemini
                text = await try_gemini_async(prompt, fen_before, fen_after, pv, best_move, san, client)
                provider = "gemini"

                # Fallback to Groq
                if not text:
                    text = await try_groq_async(prompt, fen_before, fen_after, pv, best_move, san, client)
                    provider = "groq"

                if text:
                    save_cached_comment(db, fen_before, san, text, provider)
                    results[idx] = {"comment": text, "provider": provider}
                else:
                    tmpl = generate_template_comment(san, classification, best_move, eval_before, eval_after, pv, color)
                    save_cached_comment(db, fen_before, san, tmpl, "template")
                    results[idx] = {"comment": tmpl, "provider": "template"}

        tasks = [_worker(i, item) for i, item in enumerate(items)]
        await asyncio.gather(*tasks)

    return results
