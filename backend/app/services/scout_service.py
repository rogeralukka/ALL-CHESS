import logging
import asyncio
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional, List, Tuple
from sqlalchemy.orm import Session
from app.models.scout import ScoutCache
from app.database import utc_now
from app.services.chesscom_client import ChesscomClient
from app.services.lichess_client import LichessClient
from app.services.pgn_parser import parse_pgn_game
from app.schemas.stats import OpeningStat
from app.schemas.game import Game

logger = logging.getLogger("all_chess.scout")


async def get_or_fetch_scout_profile(
    username: str,
    platform: str,
    db: Session
) -> Optional[Dict[str, Any]]:
    clean_user = username.strip().lower()
    platform = platform.strip().lower() if platform else "chesscom"

    # 1. Check database cache
    cached = (
        db.query(ScoutCache)
        .filter(ScoutCache.username == clean_user)
        .first()
    )
    def is_not_expired(dt: datetime) -> bool:
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt > utc_now()

    if cached and is_not_expired(cached.expires_at):
        return cached.profile_json

    # 2. Fetch live data from platform
    raw_games: List[Dict[str, Any]] = []
    stats: Optional[Dict[str, Any]] = None
    profile: Optional[Dict[str, Any]] = None
    display_name = username.strip()
    title: Optional[str] = None
    rating = 1000

    if platform == "chesscom":
        client = ChesscomClient()
        try:
            profile = await client.fetch_player_profile(clean_user)
            if profile and profile.get("username"):
                display_name = profile["username"]
                title = profile.get("title")

            stats = await client.fetch_player_stats(clean_user)
            if stats:
                rapid_st = stats.get("chess_rapid", {}).get("last", {})
                blitz_st = stats.get("chess_blitz", {}).get("last", {})
                bullet_st = stats.get("chess_bullet", {}).get("last", {})
                rating = rapid_st.get("rating") or blitz_st.get("rating") or bullet_st.get("rating") or rating

            raw_games = await client.fetch_recent_games(clean_user, max_games=50)
        except Exception as e:
            logger.warning(f"Failed to fetch Chess.com data for scout {clean_user}: {e}")

    elif platform == "lichess":
        lclient = LichessClient()
        try:
            stats = await lclient.fetch_player_stats(clean_user)
            if stats:
                display_name = stats.get("username", display_name)
                title = stats.get("title")
                perfs = stats.get("perfs", {})
                rating = (
                    perfs.get("rapid", {}).get("rating")
                    or perfs.get("blitz", {}).get("rating")
                    or perfs.get("bullet", {}).get("rating")
                    or rating
                )

            raw_games = await lclient.fetch_games(clean_user, max_games=50)
        except Exception as e:
            logger.warning(f"Failed to fetch Lichess data for scout {clean_user}: {e}")

    # If nothing was found and no games exist, player doesn't exist
    if not raw_games and not stats and not profile:
        return None

    # 3. Parse games and compute scout analytics
    parsed_games: List[Dict[str, Any]] = []
    stats_by_eco: Dict[Tuple[str, str], Dict[str, Any]] = {}
    total_wins = 0

    user_aliases = [clean_user, display_name.lower()]

    for g in raw_games:
        pgn = g.get("pgn")
        if not pgn:
            continue

        ext_id = None
        if platform == "chesscom":
            ext_id = g.get("url", "").split("/")[-1] if g.get("url") else None
        else:
            ext_id = g.get("id")

        try:
            parsed = parse_pgn_game(
                pgn_text=pgn,
                target_user_names=user_aliases,
                source="online",
                platform=platform,
                external_id=ext_id
            )
            if not parsed.get("id"):
                import uuid
                parsed["id"] = f"scout-{ext_id or uuid.uuid4().hex[:12]}"
            parsed_games.append(parsed)

            is_white = parsed.get("isUserWhite", True)
            res = parsed.get("result", "*")
            is_win = (is_white and res == "1-0") or (not is_white and res == "0-1")
            is_draw = res in ("1/2-1/2", "0.5-0.5")
            is_loss = (is_white and res == "0-1") or (not is_white and res == "1-0")

            if is_win:
                total_wins += 1

            op = parsed.get("opening") or {}
            eco = op.get("eco", "A00")
            name = op.get("name", "Unknown Opening")
            key = (eco, name)

            if key not in stats_by_eco:
                stats_by_eco[key] = {
                    "eco": eco,
                    "name": name,
                    "games": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "accuracies": []
                }

            s = stats_by_eco[key]
            s["games"] += 1
            if is_win:
                s["wins"] += 1
            elif is_draw:
                s["draws"] += 1
            elif is_loss:
                s["losses"] += 1

            acc = parsed.get("accuracy")
            if acc and isinstance(acc, dict):
                op_acc = acc.get("white") if is_white else acc.get("black")
                if op_acc is not None:
                    s["accuracies"].append(float(op_acc))
        except Exception as e:
            logger.debug(f"Error parsing game for scout: {e}")
            continue

    total_games = len(parsed_games)
    win_rate = round((total_wins / total_games) * 100, 1) if total_games > 0 else 50.0

    # Build mostPlayed OpeningStat list
    most_played: List[Dict[str, Any]] = []
    for (eco, name), s in sorted(stats_by_eco.items(), key=lambda item: item[1]["games"], reverse=True)[:6]:
        g_count = s["games"]
        w_pct = round((s["wins"] / g_count) * 100, 1) if g_count > 0 else 0.0
        d_pct = round((s["draws"] / g_count) * 100, 1) if g_count > 0 else 0.0
        l_pct = round((s["losses"] / g_count) * 100, 1) if g_count > 0 else 0.0
        avg_acc = round(sum(s["accuracies"]) / len(s["accuracies"]), 1) if s["accuracies"] else 78.5

        most_played.append({
            "eco": eco,
            "name": name,
            "games": g_count,
            "winRate": w_pct,
            "drawRate": d_pct,
            "lossRate": l_pct,
            "avgAccuracy": avg_acc
        })

    # Fallback opening stat if no games were parsed
    if not most_played:
        most_played.append({
            "eco": "C50",
            "name": "Italian Game",
            "games": 1,
            "winRate": 50.0,
            "drawRate": 10.0,
            "lossRate": 40.0,
            "avgAccuracy": 80.0
        })

    profile_result: Dict[str, Any] = {
        "username": display_name,
        "rating": int(rating),
        "title": title,
        "winRate": win_rate,
        "mostPlayed": most_played,
        "recentGames": parsed_games[:20]
    }

    # 4. Cache in ScoutCache for 24 hours
    expires_at = utc_now() + timedelta(hours=24)
    if cached:
        cached.profile_json = profile_result
        cached.cached_at = utc_now()
        cached.expires_at = expires_at
    else:
        new_cache = ScoutCache(
            username=clean_user,
            profile_json=profile_result,
            cached_at=utc_now(),
            expires_at=expires_at
        )
        db.add(new_cache)
    db.commit()

    return profile_result


def search_cached_scout_profiles(
    query: str,
    db: Session,
    limit: int = 10
) -> List[Dict[str, Any]]:
    clean_q = query.strip().lower()
    now = utc_now()
    rows = (
        db.query(ScoutCache)
        .filter(ScoutCache.expires_at > now.replace(tzinfo=None))
        .all()
    )
    results: List[Dict[str, Any]] = []
    for r in rows:
        if clean_q in r.username.lower():
            results.append(r.profile_json)
            if len(results) >= limit:
                break
    return results
