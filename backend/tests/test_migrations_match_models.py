"""Every column a model declares must exist after `alembic upgrade head`.

The unit tests build tables with create_all, so a model column without a migration passes
CI and then fails on the real (Postgres) database. This catches that.
"""
import os
import subprocess
import sys
from pathlib import Path

from sqlalchemy import create_engine, inspect

BACKEND = Path(__file__).resolve().parent.parent


def test_alembic_head_has_every_model_column(tmp_path):
    db = tmp_path / "mig.db"
    env = {**os.environ, "DATABASE_URL": f"sqlite:///{db}"}
    subprocess.run(
        [sys.executable, "-m", "alembic", "upgrade", "head"],
        cwd=BACKEND, env=env, check=True, capture_output=True,
    )

    sys.path.insert(0, str(BACKEND))
    from app.database import Base
    import app.models  # noqa: F401  (registers the models)

    insp = inspect(create_engine(f"sqlite:///{db}"))
    missing = []
    for table in Base.metadata.sorted_tables:
        have = {c["name"] for c in insp.get_columns(table.name)}
        missing += [f"{table.name}.{c.name}" for c in table.columns if c.name not in have]
    assert not missing, f"models declare columns with no migration: {missing}"
