"""Reviews whose Stockfish search ran in the user's browser: the server only grades and stores them."""
import chess

MOVES = ["e4", "e5", "Qh5", "Nc6", "Bc4", "Nf6", "Qxf7#"]


def _make_game(auth_client):
    body = {"moves": MOVES, "userColor": "white", "result": "1-0"}
    return auth_client.post("/api/v1/games/coach", json=body).json()["id"]


def _positions(cp_by_ply=None, drop_lines_at=None):
    """Fake browser output: one legal-move line per live position (score from the side to move's view)."""
    board = chess.Board()
    fens_moves = [None] + MOVES
    out = []
    for i, san in enumerate(fens_moves):
        if san is not None:
            board.push_san(san)
        if board.is_game_over():
            out.append({"lines": []})
            continue
        legal = list(board.legal_moves)
        lines = [] if drop_lines_at == i else [{"pv": [legal[0].uci()], "cp": (cp_by_ply or {}).get(i, 20), "depth": 12}]
        out.append({"lines": lines})
    return out


def test_browser_evaluations_complete_a_review(auth_client):
    game_id = _make_game(auth_client)
    resp = auth_client.post(f"/api/v1/games/{game_id}/evaluations", json={"level": "standard", "positions": _positions()})
    assert resp.status_code == 200, resp.text
    job = auth_client.get(f"/api/v1/jobs/{resp.json()['jobId']}").json()
    assert job["status"] == "done" and job["progress"] == 100

    game = auth_client.get(f"/api/v1/games/{game_id}").json()
    assert game["accuracy"]["white"] is not None
    assert game["analysisLevel"] == "standard"
    assert all(m["eval"] is not None and m["classification"] for m in game["moves"])
    # final position is checkmate, which the server recognises without any engine data
    assert game["moves"][-1]["eval"]["mate"] == 0


def test_black_to_move_scores_are_converted_to_white_view(auth_client):
    game_id = _make_game(auth_client)
    # +300 for the side to move. Position 1 (after 1.e4) has Black to move, so White's view is -3.00.
    resp = auth_client.post(f"/api/v1/games/{game_id}/evaluations", json={"positions": _positions({1: 300})})
    assert auth_client.get(f"/api/v1/jobs/{resp.json()['jobId']}").json()["status"] == "done"
    first = auth_client.get(f"/api/v1/games/{game_id}").json()["moves"][0]
    assert first["eval"]["eval"] == -3.0


def test_wrong_number_of_positions_is_rejected(auth_client):
    game_id = _make_game(auth_client)
    resp = auth_client.post(f"/api/v1/games/{game_id}/evaluations", json={"positions": _positions()[:-1]})
    assert resp.status_code == 422


def test_missing_lines_fail_the_job_instead_of_inventing_evals(auth_client):
    game_id = _make_game(auth_client)
    resp = auth_client.post(f"/api/v1/games/{game_id}/evaluations", json={"positions": _positions(drop_lines_at=2)})
    assert resp.status_code == 200
    job = auth_client.get(f"/api/v1/jobs/{resp.json()['jobId']}").json()
    assert job["status"] == "failed"


def test_requires_login(client):
    resp = client.post("/api/v1/games/x/evaluations", json={"positions": [{"lines": []}]})
    assert resp.status_code == 401


def test_illegal_pv_moves_are_ignored(auth_client):
    game_id = _make_game(auth_client)
    positions = _positions()
    positions[0]["lines"] = [{"pv": ["e2e4", "a1a8"], "cp": 30, "depth": 10}]  # second move is illegal
    resp = auth_client.post(f"/api/v1/games/{game_id}/evaluations", json={"positions": positions})
    assert auth_client.get(f"/api/v1/jobs/{resp.json()['jobId']}").json()["status"] == "done"
