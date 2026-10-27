import pytest

from app.database import normalize_db_url


@pytest.mark.parametrize("raw", [
    "postgresql://u:p@host/db?sslmode=require",
    "postgres://u:p@host/db?sslmode=require",
])
def test_plain_postgres_urls_use_psycopg2(raw):
    assert normalize_db_url(raw) == "postgresql+psycopg2://u:p@host/db?sslmode=require"


def test_explicit_driver_and_sqlite_untouched():
    assert normalize_db_url("postgresql+psycopg2://u:p@h/d") == "postgresql+psycopg2://u:p@h/d"
    assert normalize_db_url("sqlite:////data/x.db") == "sqlite:////data/x.db"
