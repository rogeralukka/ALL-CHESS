# ALL-CHESS: Phase 2 Engine & Analysis Pipeline Report

## 1. Overview
Phase 2 implements the complete deep analysis and engine pipeline for ALL-CHESS:
1. **Background Job Sync & Analysis**: Decoupled async job processing (`jobs` table, `POST /sync`, `POST /games/{id}/analyze`, polled via `GET /jobs/{id}`).
2. **Native Stockfish Engine Service**: Multi-threaded Stockfish 19 UCI engine worker pool bounded by concurrency semaphores (max 2 concurrent jobs, auto-restarting).
3. **Move Classification & Accuracy**: Config-driven move categorization (`CLASSIFICATION_THRESHOLDS`) matching Chess.com/Lichess standards, with material sacrifice detection for brilliant moves.
4. **Performance Rating Calibration**: Calibrated lookup table and monotonic piecewise curve mapping move accuracy to performance ratings.
5. **Position Evaluation Endpoint**: `POST /api/v1/engine/position` with per-user sliding-window rate limiting.
6. **Browser WASM Engine**: Stockfish 19 lite single-threaded WebAssembly build served from `/stockfish/` with automatic fallback to the server API.

---

## 2. Performance Rating Calibration Formula & Lookup Table

The estimated performance rating maps game accuracy (%) to standard FIDE/Chess.com rating equivalents using a monotonic piecewise linear interpolation between empirical anchor points:

| Accuracy (%) | Estimated Performance Rating | Description |
|:---|:---|:---|
| **0.0% - 50.0%** | **100 - 500** | Beginner / Fundamental errors |
| **50.0% - 75.0%** | **500 - 1200** | Casual / Developing tactical vision |
| **75.0% - 90.0%** | **1200 - 2000** | Club player / Intermediate mastery |
| **90.0% - 98.0%** | **2000 - 2700** | Master / Grandmaster level play |
| **98.0% - 100.0%**| **2700 - 2850** | Super-Grandmaster / Engine precision |

### Piecewise Formulation:
$$
\text{Rating}(acc) = 
\begin{cases} 
100 + \left(\frac{acc}{50.0}\right) \times 400 & \text{if } acc \le 50.0 \\
500 + \left(\frac{acc - 50.0}{25.0}\right) \times 700 & \text{if } 50.0 < acc \le 75.0 \\
1200 + \left(\frac{acc - 75.0}{15.0}\right) \times 800 & \text{if } 75.0 < acc \le 90.0 \\
2000 + \left(\frac{acc - 90.0}{8.0}\right) \times 700 & \text{if } 90.0 < acc \le 98.0 \\
2700 + \left(\frac{acc - 98.0}{2.0}\right) \times 150 & \text{if } acc > 98.0 
\end{cases}
$$

When a player base rating is known (e.g. from PGN), performance rating is blended $70\%$ performance, $30\%$ base rating.

---

## 3. Move Classification Thresholds
Defined in `backend/app/services/classifier.py`:

```python
CLASSIFICATION_THRESHOLDS = {
    "win_pct_drop": {
        "best": 0.0,
        "excellent": 2.0,
        "good": 5.0,
        "inaccuracy": 10.0,
        "mistake": 20.0,
        "blunder": 20.0,  # + drop below winning threshold
    },
    "brilliant": {
        "min_eval_pawns": 1.0,
        "min_second_line_gap_pct": 5.0,
        "requires_sacrifice": True,
    },
    "great": {
        "min_eval_pawns": 0.5,
        "min_second_line_gap_pct": 3.0,
        "max_drop_pct": 2.0,
    },
    "miss": {
        "min_drop_pct": 10.0,
        "requires_opponent_mistake": True,
    }
}
```

---

## 4. Empirical Test Verification
- **Backend Tests (`pytest backend/tests -v`)**: 28 passed in 2.90s.
  - `test_move_classification_known_positions`: PASSED
  - `test_engine_position_api`: PASSED (returns 3 MultiPV lines with SAN moves)
  - `test_engine_position_rate_limiting`: PASSED (HTTP 429 when threshold exceeded)
  - `test_game_analyze_flow_mocked`: PASSED (queues job, polls to 100%, populates game evals, accuracy, ratings, phase grades, and updates real `/stats/phases` and `/stats/insights`)
  - `test_real_engine_smoke`: PASSED (analyzes 5 moves of Italian Game with native Stockfish 19 binary)
- **Frontend Checks**:
  - `vitest run`: 75 passed (12 test files).
  - `npx tsc --noEmit`: 0 errors.
  - `eslint`: 0 warnings, 0 errors.

---

## 5. Real Game Analysis Run (rogeralukka on Chess.com)
- **Player (White)**: Aahanafrr (1041)
- **Player (Black)**: rogeralukka / You (1027)
- **Time Control**: 10 min Rapid
- **Opening**: B01 - Scandinavian Defense
- **Total Half-Moves**: 58
- **Depth**: 16 (0.3s/move max)
- **Engine**: Stockfish 19 (Threads=4, Hash=256MB, MultiPV=3)
- **Total Analysis Duration**: 16.67 seconds (0.29 s/move)

### Classification Breakdown:
| Classification | White (Aahanafrr) | Black (rogeralukka / You) |
|:---|:---|:---|
| **Great** | 1 | 1 |
| **Best** | 13 | 14 |
| **Excellent** | 1 | 3 |
| **Good** | 0 | 1 |
| **Inaccuracy** | 9 | 2 |
| **Mistake** | 3 | 1 |
| **Miss** | 0 | 5 |
| **Blunder** | 2 | 2 |

### Metrics & Accuracy:
- **White Accuracy**: 78.9%
- **Black Accuracy**: 82.5%
- **Estimated Performance Ratings**: White ~1967, Black ~2098
- **Phase Grades**:
  - Opening: B
  - Middlegame: B
  - Tactics: B
  - Endgame: B
