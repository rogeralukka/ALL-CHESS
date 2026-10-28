"""Analysis jobs run inside the API process, so a restart must not leave a review stuck forever."""
from datetime import datetime, timedelta, timezone

from app.models.analysis import AnalysisJob, fail_orphaned_jobs


def _make_game(auth_client):
    body = {"moves": ["e4", "e5", "Qh5", "Nc6", "Bc4", "Nf6", "Qxf7#"], "userColor": "white", "result": "1-0"}
    return auth_client.post("/api/v1/games/coach", json=body).json()["id"]


def test_fail_orphaned_jobs_marks_unfinished_only(db_session, test_user):
    for status in ("queued", "processing", "done"):
        db_session.add(AnalysisJob(user_id=test_user.id, job_type="analysis", status=status, progress=5))
    db_session.commit()

    assert fail_orphaned_jobs(db_session) == 2
    statuses = sorted(j.status for j in db_session.query(AnalysisJob).all())
    assert statuses == ["done", "failed", "failed"]


def test_stale_processing_job_is_not_reused(auth_client, db_session, test_user, monkeypatch):
    monkeypatch.setattr("app.routers.games.run_game_analysis_task", lambda *a, **k: None)
    game_id = _make_game(auth_client)
    old = AnalysisJob(user_id=test_user.id, game_id=game_id, job_type="analysis", status="processing", progress=5)
    db_session.add(old)
    db_session.commit()
    old.updated_at = datetime.now(timezone.utc) - timedelta(minutes=30)
    db_session.commit()
    old_id = old.id

    resp = auth_client.post(f"/api/v1/games/{game_id}/analyze", json={})
    assert resp.status_code == 200
    assert resp.json()["jobId"] != old_id
    db_session.expire_all()
    assert db_session.get(AnalysisJob, old_id).status == "failed"


def test_recent_processing_job_is_reused(auth_client, db_session, test_user, monkeypatch):
    monkeypatch.setattr("app.routers.games.run_game_analysis_task", lambda *a, **k: None)
    game_id = _make_game(auth_client)
    live = AnalysisJob(user_id=test_user.id, game_id=game_id, job_type="analysis", status="processing", progress=40)
    db_session.add(live)
    db_session.commit()

    resp = auth_client.post(f"/api/v1/games/{game_id}/analyze", json={})
    assert resp.json()["jobId"] == live.id
