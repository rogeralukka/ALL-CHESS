"""Login cookie flags follow COOKIE_SECURE / COOKIE_SAMESITE (production runs on https)."""
from fastapi import Response

from app.auth import set_session_cookie
from app.config import settings


def _cookie_header(monkeypatch, secure, samesite):
    monkeypatch.setattr(settings, "cookie_secure", secure)
    monkeypatch.setattr(settings, "cookie_samesite", samesite)
    resp = Response()
    set_session_cookie(resp, "user-1")
    return resp.headers["set-cookie"].lower()


def test_default_cookie_works_over_plain_http(monkeypatch):
    header = _cookie_header(monkeypatch, False, "lax")
    assert "httponly" in header and "samesite=lax" in header
    assert "secure" not in header


def test_production_cookie_is_secure(monkeypatch):
    header = _cookie_header(monkeypatch, True, "lax")
    assert "secure" in header and "samesite=lax" in header


def test_cross_site_cookie_forces_secure(monkeypatch):
    header = _cookie_header(monkeypatch, False, "none")
    assert "samesite=none" in header and "secure" in header


def test_unknown_samesite_falls_back_to_lax(monkeypatch):
    header = _cookie_header(monkeypatch, False, "bogus")
    assert "samesite=lax" in header
