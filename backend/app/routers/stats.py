import asyncio
import logging
import os
import time
from typing import List, Literal, Optional, Dict, Tuple, Any
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, defer
from app.database import get_db
from app.models.user import User
from app.models.game import Game as GameModel
from app.schemas.stats import (
    RatingPoint,
    RatingSummary,
    OpeningStat,
    PhasePointsLost,
    StrengthWeakness,
    StrengthsWeaknessesResponse
)
from app.auth import get_current_user
from app.services.chesscom_client import ChesscomClient
from app.services.lichess_client import LichessClient

logger = logging.getLogger("all_chess.stats")
router = APIRouter(prefix="/stats", tags=["Stats"])

# In-memory cache for live platform stats (10 min TTL)
_LIVE_STATS_CACHE: Dict[Tuple[str, str], Tuple[float, Dict[str, Any]]] = {}
_STATS_CACHE_TTL_SECS = 600.0


async def get_cached_live_stats(platform: str, username: str) -> Optional[Dict[str, Any]]:
    if os.environ.get("TESTING") == "1":
        return None
    key = (platform, username.lower())
    now = time.time()
    if key in _LIVE_STATS_CACHE:
        cached_at, data = _LIVE_STATS_CACHE[key]
        if now - cached_at < _STATS_CACHE_TTL_SECS:
            return data

    data = None
    try:
        if platform == "chesscom":
            client = ChesscomClient()
            client.timeout = 2.0
            data = await asyncio.wait_for(client.fetch_player_stats(username), timeout=2.0)
        elif platform == "lichess":
            client = LichessClient()
            client.timeout = 2.0
            data = await asyncio.wait_for(client.fetch_player_stats(username), timeout=2.0)
    except Exception as e:
        logger.warning(f"Could not fetch live {platform} stats for {username}: {e}")

    if data:
        _LIVE_STATS_CACHE[key] = (now, data)
    return data


def resolve_platform(user: User, platform_param: Optional[str]) -> str:
    if platform_param in ("chesscom", "lichess"):
        return platform_param
    if user.chesscom_username:
        return "chesscom"
    if user.lichess_username:
        return "lichess"
    return "chesscom"


@router.get("/rating-history", response_model=List[RatingPoint])
def get_rating_history(
    range: Optional[Literal['30d', '90d', 'all']] = Query('90d'),
    platform: Optional[Literal['chesscom', 'lichess']] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_platform = resolve_platform(current_user, platform)

    games = (
        db.query(GameModel)
        .options(defer(GameModel.moves), defer(GameModel.pgn))
        .filter(GameModel.user_id == current_user.id, GameModel.platform == target_platform)
        .order_by(GameModel.date.asc())
        .all()
    )

    if not games:
        return []

    # 1. Determine first known rating for each speed (to carry backwards before first game)
    first_known_ratings: Dict[str, int] = {}
    for g in games:
        speed = (g.speed or "rapid").lower()
        rating = g.white.get("rating") if g.is_user_white else g.black.get("rating")
        if speed not in first_known_ratings and rating and isinstance(rating, int) and rating > 0:
            first_known_ratings[speed] = rating

    # 2. Track running rating per date. Speeds start at their first known rating (or 0 if never played).
    current_ratings = {
        "rapid": first_known_ratings.get("rapid", 0),
        "blitz": first_known_ratings.get("blitz", 0),
        "bullet": first_known_ratings.get("bullet", 0),
    }

    history_by_date: Dict[str, Dict[str, int]] = {}

    for g in games:
        d_str = g.date[:10] if g.date else ""
        if not d_str:
            continue

        speed = (g.speed or "rapid").lower()
        user_rating = g.white.get("rating") if g.is_user_white else g.black.get("rating")
        if user_rating and isinstance(user_rating, int) and speed in current_ratings:
            current_ratings[speed] = user_rating

        history_by_date[d_str] = dict(current_ratings)

    # 3. Apply range filtering
    now = datetime.now(timezone.utc)
    cutoff = None
    if range == '30d':
        cutoff = now - timedelta(days=30)
    elif range == '90d':
        cutoff = now - timedelta(days=90)

    points: List[RatingPoint] = []
    for d_str, r_dict in sorted(history_by_date.items()):
        if cutoff:
            try:
                dt = datetime.fromisoformat(d_str).replace(tzinfo=timezone.utc)
                if dt < cutoff:
                    continue
            except Exception:
                pass

        points.append(
            RatingPoint(
                date=d_str,
                rapid=r_dict["rapid"],
                blitz=r_dict["blitz"],
                bullet=r_dict["bullet"]
            )
        )

    return points


@router.get("/ratings", response_model=List[RatingSummary])
async def get_ratings(
    platform: Optional[Literal['chesscom', 'lichess']] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_platform = resolve_platform(current_user, platform)

    # 1. Attempt live stats fetch from platform public API (cached for 10 min)
    live_ratings: Dict[str, Optional[int]] = {"rapid": None, "blitz": None, "bullet": None}
    username_for_platform = (
        current_user.chesscom_username if target_platform == "chesscom"
        else current_user.lichess_username
    )

    if username_for_platform:
        stats_data = await get_cached_live_stats(target_platform, username_for_platform)
        if stats_data:
            if target_platform == "chesscom":
                rapid_info = stats_data.get("chess_rapid", {}).get("last", {})
                blitz_info = stats_data.get("chess_blitz", {}).get("last", {})
                bullet_info = stats_data.get("chess_bullet", {}).get("last", {})
                if rapid_info.get("rating"):
                    live_ratings["rapid"] = int(rapid_info["rating"])
                if blitz_info.get("rating"):
                    live_ratings["blitz"] = int(blitz_info["rating"])
                if bullet_info.get("rating"):
                    live_ratings["bullet"] = int(bullet_info["rating"])
            elif target_platform == "lichess":
                perfs = stats_data.get("perfs", {})
                if perfs.get("rapid", {}).get("rating"):
                    live_ratings["rapid"] = int(perfs["rapid"]["rating"])
                if perfs.get("blitz", {}).get("rating"):
                    live_ratings["blitz"] = int(perfs["blitz"]["rating"])
                if perfs.get("bullet", {}).get("rating"):
                    live_ratings["bullet"] = int(perfs["bullet"]["rating"])

    # 2. Query user's games on this platform sorted by date asc for delta calculation
    games = (
        db.query(GameModel)
        .options(defer(GameModel.moves), defer(GameModel.pgn))
        .filter(GameModel.user_id == current_user.id, GameModel.platform == target_platform)
        .order_by(GameModel.date.asc())
        .all()
    )

    results: List[RatingSummary] = []
    seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)

    def get_pre_game_rating(game: GameModel) -> int:
        r = game.white.get("rating") if game.is_user_white else game.black.get("rating")
        return int(r) if r and isinstance(r, int) else 0

    for speed_key, mode_name in [("rapid", "Rapid"), ("blitz", "Blitz"), ("bullet", "Bullet")]:
        speed_games = [g for g in games if (g.speed or "").lower() == speed_key]

        # Current rating: from live stats first, then fall back to latest game
        current_rating = live_ratings.get(speed_key)
        if current_rating is None:
            if speed_games:
                current_rating = get_pre_game_rating(speed_games[-1])
            else:
                current_rating = 0

        # If user has no current rating and no games for this speed, rating is 0, delta is 0
        if current_rating == 0 and not speed_games:
            results.append(RatingSummary(mode=mode_name, rating=0, delta_weekly=0))
            continue

        # deltaWeekly = current rating minus the rating after the last game played 7+ days ago.
        delta_weekly = 0
        if speed_games:
            last_7d_idx = None
            for idx, g in enumerate(speed_games):
                try:
                    g_dt = datetime.fromisoformat(g.date.replace("Z", "+00:00"))
                    if g_dt <= seven_days_ago:
                        last_7d_idx = idx
                except Exception:
                    pass

            if last_7d_idx is not None:
                if last_7d_idx + 1 < len(speed_games):
                    rating_after = get_pre_game_rating(speed_games[last_7d_idx + 1])
                else:
                    rating_after = current_rating
                delta_weekly = current_rating - rating_after
            else:
                rating_before = get_pre_game_rating(speed_games[0])
                delta_weekly = current_rating - rating_before

        results.append(RatingSummary(mode=mode_name, rating=current_rating, delta_weekly=delta_weekly))

    return results


@router.get("/openings", response_model=List[OpeningStat])
def get_opening_stats(
    platform: Optional[Literal['chesscom', 'lichess']] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # No platform asked for means every game the player has, including games played here against
    # the coach. Asking for one narrows it to that site.
    q = (
        db.query(GameModel)
        .options(defer(GameModel.moves), defer(GameModel.pgn))
        .filter(GameModel.user_id == current_user.id)
    )
    if platform:
        q = q.filter(GameModel.platform == resolve_platform(current_user, platform))
    games = q.all()
    if not games:
        return []

    # Aggregate by ECO + name
    stats_by_eco: Dict[Tuple[str, str], Dict[str, Any]] = {}
    for g in games:
        op = g.opening or {}
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

        data = stats_by_eco[key]
        data["games"] += 1

        is_white = g.is_user_white
        res = g.result
        if (is_white and res == "1-0") or (not is_white and res == "0-1"):
            data["wins"] += 1
        elif res == "1/2-1/2":
            data["draws"] += 1
        elif (is_white and res == "0-1") or (not is_white and res == "1-0"):
            data["losses"] += 1

        acc_obj = g.accuracy or {}
        user_acc = acc_obj.get("white") if is_white else acc_obj.get("black")
        if user_acc is not None and isinstance(user_acc, (int, float)):
            data["accuracies"].append(float(user_acc))

    results: List[OpeningStat] = []
    for (eco, name), data in sorted(stats_by_eco.items(), key=lambda x: x[1]["games"], reverse=True):
        count = data["games"]
        win_rate = round((data["wins"] / count) * 100.0, 1) if count else 0.0
        draw_rate = round((data["draws"] / count) * 100.0, 1) if count else 0.0
        loss_rate = round((data["losses"] / count) * 100.0, 1) if count else 0.0
        accs = data["accuracies"]
        avg_acc = round(sum(accs) / len(accs), 1) if accs else None

        results.append(
            OpeningStat(
                eco=eco,
                name=name,
                games=count,
                win_rate=win_rate,
                draw_rate=draw_rate,
                loss_rate=loss_rate,
                avg_accuracy=avg_acc
            )
        )

    return results


def compute_analyzed_game_metrics(games: List[GameModel]) -> Dict[str, Any]:
    analyzed_games = []
    for g in games:
        moves = g.moves or []
        if any(isinstance(m.get("eval"), dict) for m in moves):
            analyzed_games.append(g)

    if not analyzed_games:
        return {
            "total_analyzed": 0,
            "opening_loss": 0.0,
            "middlegame_loss": 0.0,
            "endgame_loss": 0.0,
            "blunders_per_game": 0.0,
            "misses_per_game": 0.0,
        }

    total_op_loss = 0.0
    total_mid_loss = 0.0
    total_end_loss = 0.0
    total_blunders = 0
    total_misses = 0

    for g in analyzed_games:
        moves = g.moves or []
        user_color = "w" if g.is_user_white else "b"

        prev_white_eval = 0.2
        game_op_loss = 0.0
        game_mid_loss = 0.0
        game_end_loss = 0.0

        for m in moves:
            color = m.get("color", "w")
            # stored moves use camelCase ("moveNumber"); the snake_case key never matched, which put
            # every move in the opening bucket and left middlegame/endgame at zero
            m_num = m.get("moveNumber") or m.get("move_number") or 1
            cls_name = m.get("classification", "")
            eval_dict = m.get("eval") or {}
            cur_white_eval = eval_dict.get("eval", prev_white_eval)
            if not isinstance(cur_white_eval, (int, float)):
                cur_white_eval = prev_white_eval

            if color == user_color:
                if user_color == "w":
                    loss = max(0.0, prev_white_eval - cur_white_eval)
                else:
                    loss = max(0.0, cur_white_eval - prev_white_eval)
                loss = min(5.0, loss)

                if m_num <= 10:
                    game_op_loss += loss
                elif m_num <= 30:
                    game_mid_loss += loss
                else:
                    game_end_loss += loss

                if cls_name == "blunder":
                    total_blunders += 1
                elif cls_name in ("miss", "mistake"):
                    total_misses += 1

            prev_white_eval = cur_white_eval

        total_op_loss += game_op_loss
        total_mid_loss += game_mid_loss
        total_end_loss += game_end_loss

    n = len(analyzed_games)
    return {
        "total_analyzed": n,
        "opening_loss": round(total_op_loss / n, 2),
        "middlegame_loss": round(total_mid_loss / n, 2),
        "endgame_loss": round(total_end_loss / n, 2),
        "blunders_per_game": round(total_blunders / n, 1),
        "misses_per_game": round(total_misses / n, 1),
    }


@router.get("/phases", response_model=PhasePointsLost)
def get_phase_points_lost(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    games = db.query(GameModel).options(defer(GameModel.pgn)).filter(GameModel.user_id == current_user.id).all()
    metrics = compute_analyzed_game_metrics(games)
    return PhasePointsLost(
        opening=metrics["opening_loss"],
        middlegame=metrics["middlegame_loss"],
        endgame=metrics["endgame_loss"],
        total_analyzed=metrics["total_analyzed"],
    )


@router.get("/insights", response_model=StrengthsWeaknessesResponse)
def get_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    games = db.query(GameModel).options(defer(GameModel.pgn)).filter(GameModel.user_id == current_user.id).all()
    metrics = compute_analyzed_game_metrics(games)

    if metrics["total_analyzed"] == 0:
        return StrengthsWeaknessesResponse(strengths=[], weaknesses=[], total_analyzed=0)

    # Everything below is measured from this player's own reviewed games. There is no invented
    # "peer" baseline: each phase is ranked against the player's other phases, and the error rates
    # are their own counts per game. Deltas carry the real number, never a canned one.
    strengths: List[StrengthWeakness] = []
    weaknesses: List[StrengthWeakness] = []

    phases = [
        ("Opening Play", metrics["opening_loss"]),
        ("Middlegame Play", metrics["middlegame_loss"]),
        ("Endgame Technique", metrics["endgame_loss"]),
    ]
    ranked = sorted(phases, key=lambda p: p[1])
    if ranked[0][1] < ranked[-1][1]:
        best_label, best_value = ranked[0]
        worst_label, worst_value = ranked[-1]
        strengths.append(
            StrengthWeakness(label=best_label, delta=f"{best_value:.2f}/game", type="strength")
        )
        weaknesses.append(
            StrengthWeakness(label=worst_label, delta=f"{worst_value:.2f}/game", type="weakness")
        )

    for label, rate in (
        ("Avoiding Blunders", metrics["blunders_per_game"]),
        ("Tactical Awareness", metrics["misses_per_game"]),
    ):
        entry = StrengthWeakness(
            label=label,
            delta=f"{rate:.2f}/game",
            type="strength" if rate == 0 else "weakness",
        )
        (strengths if rate == 0 else weaknesses).append(entry)

    weaknesses.sort(key=lambda w: float(w.delta.split("/")[0]), reverse=True)

    return StrengthsWeaknessesResponse(
        strengths=strengths,
        weaknesses=weaknesses,
        total_analyzed=metrics["total_analyzed"],
    )
