"""SQLite accepts `server_default=text("0")` on a Boolean column; Postgres (Neon) rejects it.

The test suite runs on SQLite, so that mistake passed CI, the migration failed on the real database,
and the app silently fell back to create_all, leaving the new columns missing (every games query 500'd).
Use sa.false() / sa.true() for boolean defaults instead.
"""
import re
from pathlib import Path

VERSIONS = Path(__file__).resolve().parent.parent / "alembic" / "versions"


def test_no_numeric_text_defaults_on_boolean_columns():
    bad = []
    for f in sorted(VERSIONS.glob("*.py")):
        src = f.read_text()
        for m in re.finditer(r"sa\.Column\([^)]*sa\.Boolean\(\)[^)]*\)", src):
            if re.search(r"server_default\s*=\s*sa\.text\(\s*['\"][01]['\"]\s*\)", m.group(0)):
                bad.append(f.name)
    assert not bad, f"Boolean server_default must be sa.false()/sa.true(), not text('0'/'1'): {bad}"
