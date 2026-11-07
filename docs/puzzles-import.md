# Lichess Puzzle Database Import Runbook

This runbook guides Master through importing ~100,000 high-quality, balanced Lichess puzzles into the ALL-CHESS Neon PostgreSQL database.

---

## 1. Prerequisites

1. Activate your backend virtual environment:
   ```bash
   # Windows PowerShell
   backend\.venv\Scripts\Activate.ps1

   # Linux / macOS
   source backend/.venv/bin/activate
   ```
2. Ensure database migrations are applied:
   ```bash
   cd backend
   alembic upgrade head
   cd ..
   ```
3. Set your `DATABASE_URL` environment variable:
   ```bash
   # Windows PowerShell
   $env:DATABASE_URL = "postgresql://user:password@ep-xyz.region.aws.neon.tech/neondb?sslmode=require"

   # Linux / macOS
   export DATABASE_URL="postgresql://user:password@ep-xyz.region.aws.neon.tech/neondb?sslmode=require"
   ```
   > [!NOTE]
   > The importer reads `DATABASE_URL` strictly from the environment. It never logs, displays, or prompts for credentials.

---

## 2. Execution Commands

### Step A: Dry-Run and Size Projection (Recommended first step)
Simulates parsing, filters, theme balancing, and calculates projected table + index storage:
```bash
python backend/scripts/import_puzzles_to_db.py --dry-run --target 100000
```
- Checks that the projected table + index size does not exceed Neon's 120 MB safety limit (calibrated at 1.9x ratio).

### Step B: (Optional) Pre-download the Compressed Dump
To avoid network interruptions during streaming:
```bash
python backend/scripts/import_puzzles_to_db.py --download-only
```
- Resumable download saved to `backend/.cache/lichess_db_puzzle.csv.zst` (~295 MB).

### Step C: Execute Full Import
Run the importer with batch upserts (idempotent, batch size 1,000):
```bash
python backend/scripts/import_puzzles_to_db.py --target 100000
```

---

## 3. Estimated Runtime

- **Download**: ~295 MB compressed stream (approx. 1–3 minutes on standard broadband).
- **Processing & Upserts**: ~200–300 rows/second through batch upserts.
- **Total Runtime**: Approx. **5 to 8 minutes** for 100,000 puzzles against Neon.

---

## 4. Verification Queries

After completion, verify the table counts, distribution, and storage in your PostgreSQL client:

```sql
-- 1. Total row count (should be ~100,000)
SELECT count(*) AS total_puzzles FROM puzzles;

-- 2. Total theme relations
SELECT count(*) AS total_themes FROM puzzle_themes;

-- 3. Distribution across 100-point rating bands (400 to 2800)
SELECT (rating / 100) * 100 AS band_start,
       (rating / 100) * 100 + 100 AS band_end,
       count(*) AS count
FROM puzzles
GROUP BY (rating / 100) * 100
ORDER BY band_start ASC;

-- 4. Top tactical themes
SELECT theme, count(*) AS count
FROM puzzle_themes
GROUP BY theme
ORDER BY count DESC
LIMIT 25;

-- 5. Physical storage used on Neon
SELECT pg_size_pretty(pg_total_relation_size('puzzles')) AS puzzles_table_and_indexes,
       pg_size_pretty(pg_total_relation_size('puzzle_themes')) AS themes_table_and_indexes;
```

---

## 5. Rollback Runbook

Every import run tags its puzzles with a unique `import_run` identifier (e.g. `run_20261107_122500_60b574`).

> [!WARNING]
> **Foreign Key Constraints & Starter Puzzle Re-tagging**:
> 1. `puzzle_attempts.puzzle_id` references `puzzles.id` without `CASCADE`. Attempting to delete a puzzle that a user has attempted will fail with a foreign key constraint violation.
> 2. The batch upsert re-tags existing starter puzzles with the new `import_run`.

### Safe Rollback Query:

To roll back an import run safely without violating foreign keys for puzzles that already have user attempts:

1. List the available import runs:
   ```sql
   SELECT import_run, count(*), min(rating), max(rating)
   FROM puzzles
   GROUP BY import_run;
   ```

2. Safe deletion query (deletes only puzzles that have NO user attempts):
   ```sql
   -- puzzle_themes rows are automatically deleted via ON DELETE CASCADE
   DELETE FROM puzzles
   WHERE import_run = 'run_20261107_122500_60b574'
     AND id NOT IN (SELECT puzzle_id FROM puzzle_attempts);
   ```

3. If any starter puzzles were re-tagged and need their `import_run` cleared or reset:
   ```sql
   UPDATE puzzles
   SET import_run = 'starter_seed'
   WHERE id IN (SELECT puzzle_id FROM puzzle_attempts)
     AND import_run = 'run_20261107_122500_60b574';
   ```
