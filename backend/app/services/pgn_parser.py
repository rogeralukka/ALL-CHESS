import io
import json
import os
import re
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional, Tuple
import chess
import chess.pgn
from app.config import BACKEND_DIR

# Load openings.json once
OPENINGS_FILE = os.path.join(BACKEND_DIR, "app", "data", "openings.json")
try:
    with open(OPENINGS_FILE, "r", encoding="utf-8") as f:
        OPENINGS_DATA = json.load(f)
except Exception:
    OPENINGS_DATA = []

def match_opening(move_sans: List[str], header_eco: Optional[str] = None, header_name: Optional[str] = None) -> Dict[str, str]:
    """Finds best matching opening from openings.json based on move sequence."""
    best_match = None
    best_len = 0

    for item in OPENINGS_DATA:
        item_moves = item.get("moves", [])
        length = len(item_moves)
        if length > len(move_sans):
            continue
        if move_sans[:length] == item_moves:
            if length > best_len:
                best_len = length
                best_match = {"eco": item.get("eco", "A00"), "name": item.get("name", "Unknown Opening")}

    if best_match:
        return best_match
        
    if header_name:
        return {"eco": header_eco or "A00", "name": header_name}
    if header_eco:
        return {"eco": header_eco, "name": f"Opening ({header_eco})"}

    return {"eco": "A00", "name": "Custom Opening"}

def parse_time_control(tc_str: Optional[str]) -> Tuple[str, str]:
    """
    Parses raw time control string into (human_label, speed).
    speed: 'bullet' | 'blitz' | 'rapid' | 'daily'
    """
    if not tc_str or tc_str == "-" or tc_str == "?":
        return "10 min", "rapid"

    # Daily / correspondence (e.g. 1/86400)
    if "/" in tc_str:
        parts = tc_str.split("/")
        try:
            seconds = int(parts[1])
            days = max(1, seconds // 86400)
            return f"{days} day" if days == 1 else f"{days} days", "daily"
        except Exception:
            return "Daily", "daily"

    # Base + increment (e.g. "180+2")
    if "+" in tc_str:
        parts = tc_str.split("+")
        try:
            base = int(parts[0])
            inc = int(parts[1])
            base_min = base // 60
            label = f"{base_min}|{inc}"
            total_est = base + (inc * 40)
            if total_est < 180:
                speed = "bullet"
            elif total_est < 600:
                speed = "blitz"
            elif total_est < 3600:
                speed = "rapid"
            else:
                speed = "daily"
            return label, speed
        except Exception:
            return tc_str, "blitz"

    # Flat seconds (e.g. "600", "180", "60")
    try:
        base = int(tc_str)
        if base < 180:
            return f"{base // 60 or 1} min", "bullet"
        elif base < 600:
            return f"{base // 60} min", "blitz"
        elif base < 3600:
            return f"{base // 60} min", "rapid"
        else:
            return f"{base // 3600} hr", "daily"
    except Exception:
        return tc_str, "rapid"

def parse_iso_date(headers: Dict[str, str]) -> str:
    """Produces ISO UTC date string from PGN headers."""
    utc_date = headers.get("UTCDate") or headers.get("Date")
    utc_time = headers.get("UTCTime") or "12:00:00"

    if utc_date and utc_date != "????.??.??":
        clean_date = utc_date.replace(".", "-")
        try:
            # Check format YYYY-MM-DD
            dt = datetime.strptime(f"{clean_date} {utc_time}", "%Y-%m-%d %H:%M:%S")
            return dt.replace(tzinfo=timezone.utc).isoformat().replace("+00:00", "Z")
        except Exception:
            try:
                dt = datetime.strptime(clean_date, "%Y-%m-%d")
                return dt.replace(tzinfo=timezone.utc).isoformat().replace("+00:00", "Z")
            except Exception:
                pass

    return datetime.utcnow().replace(tzinfo=timezone.utc).isoformat().replace("+00:00", "Z")

def parse_pgn_game(
    pgn_text: str,
    target_user_names: List[str],
    source: str = "online",
    platform: Optional[str] = "chesscom",
    external_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Parses a single PGN text into the exact Game dictionary format.
    target_user_names: list of aliases for the current user (e.g. [app_username, chesscom_name, lichess_name])
    """
    game_io = io.StringIO(pgn_text.strip())
    parsed = chess.pgn.read_game(game_io)
    if not parsed:
        raise ValueError("Invalid PGN text")

    headers = dict(parsed.headers)
    white_name = headers.get("White", "White Player")
    black_name = headers.get("Black", "Black Player")
    
    try:
        white_rating = int(headers.get("WhiteElo", "1200"))
    except ValueError:
        white_rating = 1200
        
    try:
        black_rating = int(headers.get("BlackElo", "1200"))
    except ValueError:
        black_rating = 1200

    # Determine if user is White or Black
    target_lower = {name.lower() for name in target_user_names if name}
    is_user_white = white_name.lower() in target_lower
    is_user_black = black_name.lower() in target_lower

    if is_user_white and not is_user_black:
        white_display_name = "You"
        black_display_name = black_name
    elif is_user_black and not is_user_white:
        white_display_name = white_name
        black_display_name = "You"
    else:
        white_display_name = white_name
        black_display_name = black_name

    white_player = {
        "username": white_display_name,
        "rating": white_rating,
        "title": headers.get("WhiteTitle") or None,
        "avatarUrl": None
    }
    black_player = {
        "username": black_display_name,
        "rating": black_rating,
        "title": headers.get("BlackTitle") or None,
        "avatarUrl": None
    }

    result = headers.get("Result", "*")
    if result not in ["1-0", "0-1", "1/2-1/2", "*"]:
        result = "*"

    time_control_label, speed = parse_time_control(headers.get("TimeControl"))
    date_iso = parse_iso_date(headers)

    # Traverse moves
    board = parsed.board()
    move_sans = []
    moves_list = []
    move_number = 1

    last_time = None
    clk_pattern = re.compile(r"\[%clk\s+([0-9:]+)\]")

    for node in parsed.mainline():
        move = node.move
        color = 'w' if board.turn == chess.WHITE else 'b'
        san = board.san(move)
        move_sans.append(san)

        from_sq = chess.square_name(move.from_square)
        to_sq = chess.square_name(move.to_square)
        promotion = chess.piece_symbol(move.promotion).lower() if move.promotion else None

        # Calculate time spent if clock comments exist
        time_spent = None
        if node.comment:
            clk_match = clk_pattern.search(node.comment)
            if clk_match:
                clk_str = clk_match.group(1)
                parts = clk_str.split(":")
                try:
                    if len(parts) == 3:
                        cur_seconds = int(parts[0]) * 3600 + int(parts[1]) * 60 + float(parts[2])
                    elif len(parts) == 2:
                        cur_seconds = int(parts[0]) * 60 + float(parts[1])
                    else:
                        cur_seconds = float(parts[0])
                    if last_time is not None:
                        time_spent = max(0.1, round(last_time - cur_seconds, 1))
                    last_time = cur_seconds
                except Exception:
                    pass

        board.push(move)
        fen_after = board.fen()

        move_dict = {
            "san": san,
            "from": from_sq,
            "to": to_sq,
            "promotion": promotion,
            "color": color,
            "fen": fen_after,
            "moveNumber": move_number,
            "classification": None,
            "eval": None,
            "coachComment": None,
            "variation": None,
            "timeSpent": time_spent
        }
        moves_list.append(move_dict)

        if color == 'b':
            move_number += 1

    opening = match_opening(move_sans, headers.get("ECO"), headers.get("Opening"))

    game_dict = {
        "pgn": pgn_text,
        "white": white_player,
        "black": black_player,
        "result": result,
        "date": date_iso,
        "timeControl": time_control_label,
        "speed": speed,
        "source": source,
        "platform": platform,
        "externalId": external_id,
        "opening": opening,
        "moves": moves_list,
        "isUserWhite": is_user_white,
        "accuracy": None,
        "estimatedRating": None,
        "phaseGrades": None
    }
    return game_dict
