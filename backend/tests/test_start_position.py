"""Games that do not start from the normal position (odds chess, set-up positions) must be reviewed from
their real starting position, or moves stop being legal on the server's board (here 32. Ka2 with a phantom
pawn on a2) and the first evaluation is the wrong position's."""
import chess

from app.services.engine_service import _run_single_pass_review_sync
from app.services.pgn_parser import start_fen_from_pgn

ODDS_START = "rnbqkbnr/pppppppp/8/8/8/8/1PPPPPPP/1NBQKBNR w Kkq - 0 1"  # White plays without the a1 rook and a2 pawn
SANS = (
    "Nf3 d5 d4 e6 g3 Bb4+ Bd2 Bd6 Bg2 Nc6 O-O Nf6 c3 O-O Re1 e5 dxe5 Bxe5 Nxe5 Nxe5 e4 dxe4 Bxe4 Bg4 Qc2 Re8 "
    "Bg5 Nxe4 Bxd8 Rexd8 f4 Nf3+ Kg2 Nxe1+ Kf1 Nxc2 Kg2 Rd2+ Kf1 Nxc3 Nxd2 Rd8 Ne4 Nxe4 Kg2 Rd1 h3 Bf5 Kf3 Nd2+ "
    "Ke2 Nd4+ Kxd1 N2f3 Kc1 Bxh3 Kb1 Nd2+ Kc1 N2b3+ Kb1 Bf5+ Ka2"
).split()


def _moves_and_fake_evals(start_fen: str):
    board = chess.Board(start_fen)
    moves, ext = [], []
    for san in SANS:
        mv = board.parse_san(san)
        # a browser search result for the position before this move: one line, the played move
        ext.append({"lines": [{"pv": [mv.uci()], "cp": 0, "mate": None, "depth": 12}]})
        color = "w" if board.turn else "b"
        board.push(mv)
        moves.append({"san": san, "from": chess.square_name(mv.from_square), "to": chess.square_name(mv.to_square), "color": color, "fen": board.fen()})
    reply = next(iter(board.legal_moves))
    ext.append({"lines": [{"pv": [reply.uci()], "cp": 0, "mate": None, "depth": 12}]})
    return moves, ext


def test_start_fen_from_pgn():
    pgn = '[Event "Live Chess - Odds Chess"]\n[SetUp "1"]\n[FEN "' + ODDS_START + '"]\n\n1. Nf3 d5 *'
    assert start_fen_from_pgn(pgn) == ODDS_START
    assert start_fen_from_pgn('[Event "x"]\n\n1. e4 e5 *') is None
    assert start_fen_from_pgn(None) is None
    # a FEN header that is just the normal start counts as a normal game
    assert start_fen_from_pgn('[FEN "' + chess.STARTING_FEN + '"]\n\n1. e4 *') is None


def test_odds_game_is_reviewed_from_its_real_start():
    moves, ext = _moves_and_fake_evals(ODDS_START)
    r = _run_single_pass_review_sync(None, moves, external_evals=ext, start_fen=ODDS_START)
    out = r["moves"]
    assert out[0]["_fen_before"] == ODDS_START
    # every position the server graded is the real one, including after 32. Ka2
    for m_in, m_out in zip(moves, out):
        assert m_out["_fen_after"] == m_in["fen"]


def test_a_game_reviewed_without_a_rating_does_not_break_the_games_list(auth_client, test_user, db_session):
    """Odds games are saved with estimatedRating {white: null, black: null}. That one row used to make GET /games
    answer 500, so the player saw no games at all."""
    from app.models.game import Game as GameModel

    def row(game_id, rating):
        return GameModel(
            id=game_id, user_id=test_user.id, source="online", platform="chesscom", pgn="1. e4 e5",
            white={"username": test_user.username, "rating": 888}, black={"username": "Opp", "rating": 900},
            result="1-0", date="2026-10-28T10:00:00Z", time_control="600", speed="rapid",
            opening={"eco": "C20", "name": "King's Pawn"}, moves=[], is_user_white=True,
            accuracy={"white": 80.0, "black": 70.0}, estimated_rating=rating,
        )

    db_session.add(row("odds-game", {"white": None, "black": None}))
    db_session.add(row("normal-game", {"white": 1500, "black": 1200}))
    db_session.commit()

    for url in ("/api/v1/games?lite=true", "/api/v1/games"):
        res = auth_client.get(url)
        assert res.status_code == 200, res.text
        games = {g["id"]: g for g in res.json()}
        assert set(games) == {"odds-game", "normal-game"}
        assert "estimatedRating" not in games["odds-game"]
        assert games["normal-game"]["estimatedRating"] == {"white": 1500, "black": 1200}
    assert auth_client.get("/api/v1/games/odds-game").status_code == 200
