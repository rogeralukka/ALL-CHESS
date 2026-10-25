from app.services.pgn_parser import parse_pgn_game, parse_time_control, match_opening

SAMPLE_PGN = """[Event "Live Chess"]
[Site "Chess.com"]
[Date "2026.10.22"]
[White "TestGrandmaster"]
[Black "TacticsKnight"]
[Result "1-0"]
[UTCDate "2026.10.22"]
[UTCTime "19:30:00"]
[WhiteElo "1450"]
[BlackElo "1420"]
[TimeControl "600"]
[ECO "C50"]

1. e4 {[%clk 0:10:00]} 1... e5 {[%clk 0:09:58]} 2. Nf3 {[%clk 0:09:57]} 2... Nc6 {[%clk 0:09:55]} 3. Bc4 {[%clk 0:09:54]} 3... Bc5 {[%clk 0:09:50]} 1-0"""

def test_parse_time_control():
    label, speed = parse_time_control("600")
    assert label == "10 min"
    assert speed == "rapid"

    label, speed = parse_time_control("180+2")
    assert label == "3|2"
    assert speed == "blitz"

    label, speed = parse_time_control("60")
    assert label == "1 min"
    assert speed == "bullet"

def test_match_opening():
    # Italian Game: e4, e5, Nf3, Nc6, Bc4
    moves = ["e4", "e5", "Nf3", "Nc6", "Bc4"]
    opening = match_opening(moves)
    assert opening["eco"] == "C50"
    assert "Italian Game" in opening["name"]

    # Barnes defense: e4 f6
    moves_barnes = ["e4", "f6"]
    opening_barnes = match_opening(moves_barnes)
    assert opening_barnes["eco"] == "B00"
    assert "Barnes" in opening_barnes["name"]

def test_parse_pgn_game():
    parsed = parse_pgn_game(
        pgn_text=SAMPLE_PGN,
        target_user_names=["TestGrandmaster"],
        source="online",
        platform="chesscom"
    )

    assert parsed["result"] == "1-0"
    assert parsed["timeControl"] == "10 min"
    assert parsed["speed"] == "rapid"
    assert parsed["source"] == "online"
    assert parsed["platform"] == "chesscom"
    assert parsed["isUserWhite"] is True
    assert parsed["white"]["username"] == "You"
    assert parsed["white"]["rating"] == 1450
    assert parsed["black"]["username"] == "TacticsKnight"
    assert parsed["black"]["rating"] == 1420
    assert len(parsed["moves"]) == 6

    first_move = parsed["moves"][0]
    assert first_move["san"] == "e4"
    assert first_move["from"] == "e2"
    assert first_move["to"] == "e4"
    assert first_move["color"] == "w"
    assert first_move["moveNumber"] == 1
    assert "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR" in first_move["fen"]
