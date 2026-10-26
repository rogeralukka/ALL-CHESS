# ALL-CHESS: Phase 2 Engine & Analysis Pipeline Report

## 1. Overview
Phase 2 implements the complete deep analysis and engine pipeline for ALL-CHESS:
1. **Background Job Sync & Analysis**: Decoupled async job processing (`analysis_jobs` table, `POST /sync`, `POST /games/{id}/analyze`, polled via `GET /jobs/{id}`).
2. **Native Stockfish Engine Service**: Dedicated multi-engine subprocess pool (`EnginePool` with 2 isolated `SimpleEngine` instances via `asyncio.Queue`, auto-restarting on failure).
3. **One Eval Per Position Pipeline**: Position $i$ evaluation serves as move $i-1$'s "after" eval and move $i$'s "before" eval (halving total engine search time to ~0.28s/move).
4. **Move Classification & Accuracy**: Lichess-grade classification thresholds (`CLASSIFICATION_THRESHOLDS`) with Static Exchange Evaluation (SEE) material sacrifice verification, blunder-prevention on checkmate moves, and ECO book prefix matching stopping at the first non-book move.
5. **Phase Grades by User Perspective**: Evaluated from the user's color (`game.is_user_white`) across opening ($\le 10$), middlegame ($11-30$), endgame ($> 30$), and tactics.
6. **Performance Rating Calibration**: Calibrated piecewise linear lookup table mapping move accuracy to performance ratings.
7. **Database Migrations (Alembic)**: Automated migrations (`001_initial_schema`, `002_phase2_columns`) running on startup with safe SQLite batch schema evolution.
8. **Browser WASM Engine**: Stockfish 19 lite single-threaded WebAssembly build served from `/stockfish/` with automatic fallback to the server API.

---

## 2. Performance Rating Calibration & Formula Explanation

### Historical Discrepancy Explanation (78.9% → ~1967 vs ~1408)
In an earlier pre-calibration revision, an uncalibrated continuous power function was in place:
$$
\text{Rating}_{\text{uncalibrated}}(acc) = 400 + \left(\frac{acc}{100}\right)^{1.8} \times 2400
$$
For an accuracy of $acc = 78.9\%$:
$$
(0.789)^{1.8} \approx 0.65287 \implies 400 + 0.65287 \times 2400 = 400 + 1566.89 = 1966.89 \approx 1967
$$
Similarly, for $acc = 82.5\%$, $(0.825)^{1.8} \approx 0.70757 \implies 400 + 0.70757 \times 2400 = 2098.17 \approx 2098$.
This uncalibrated formula over-projected intermediate players into the candidate-master range (~1967).

### Calibrated Piecewise Function:
Under the active calibrated model in `accuracy.py`, the rating is defined by monotonic piecewise linear interpolation between empirical chess skill tiers:

| Accuracy (%) | Base Rating Range | Chess Skill Category |
|:---|:---|:---|
| **0.0% - 50.0%** | **100 - 500** | Beginner / Novice |
| **50.0% - 75.0%** | **500 - 1200** | Casual / Club Novice |
| **75.0% - 90.0%** | **1200 - 2000** | Intermediate / Club Competitor |
| **90.0% - 98.0%** | **2000 - 2700** | Master / Grandmaster |
| **98.0% - 100.0%**| **2700 - 2850** | Super-GM / Engine Level |

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

For $78.9\%$ accuracy ($75 < acc \le 90$):
$$
\text{Rating}(78.9) = 1200 + \left(\frac{78.9 - 75.0}{15.0}\right) \times 800 = 1200 + \left(\frac{3.9}{15.0}\right) \times 800 = 1200 + 208 = \mathbf{1408}
$$
And for $82.5\%$ accuracy:
$$
\text{Rating}(82.5) = 1200 + \left(\frac{82.5 - 75.0}{15.0}\right) \times 800 = 1200 + \left(\frac{7.5}{15.0}\right) \times 800 = 1200 + 400 = \mathbf{1600}
$$

When a user's base rating is present in game metadata (e.g. 1041 / 1027), the performance rating is blended as $70\%$ performance rating $+ 30\%$ base rating ($1298$ and $1428$).

---

## 3. Fresh Real Game Analysis Run
- **White**: You (1215)
- **Black**: TacticalMaster (1198)
- **Time Control**: 10 min Rapid
- **Opening**: C50 - Giuoco Piano
- **Total Half-Moves**: 39
- **Depth**: 16 (0.3s/move max)
- **Engine**: Stockfish 19 (`EnginePool` size=2, Threads=2, Hash=128MB)
- **Duration**: 11.24 seconds (~0.28 s/move)

### Classification Breakdown:
| Classification | White (You) | Black (TacticalMaster) |
|:---|:---|:---|
| **Great** | 1 | 0 |
| **Best** | 13 | 9 |
| **Excellent** | 2 | 2 |
| **Good** | 1 | 1 |
| **Book** | 3 | 3 |
| **Inaccuracy** | 0 | 2 |
| **Mistake** | 0 | 2 |
| **Blunder** | 0 | 0 |
| **Miss** | 0 | 0 |

### Metrics & Accuracy:
- **White Accuracy**: 96.7%
- **Black Accuracy**: 76.2%
- **Estimated Performance Ratings**: White ~2586 ($2000 + \frac{96.7 - 90}{8} \times 700$), Black ~1264 ($1200 + \frac{76.2 - 75}{15} \times 800$)
- **Phase Grades (User: White)**:
  - Opening: A
  - Middlegame: A
  - Tactics: A
  - Endgame: N/A

---

## 4. Claude Review Items Verification
1. **Checkmate = Blunder bug**: Fixed. Mating positions deliver $\pm 99.0$ eval, mate 0, and are classified as 'best' / 'great', never 'blunder'.
2. **One eval per position**: Implemented in `_run_single_pass_review_sync`. Evaluates position $0..N$ once at depth 16 MultiPV 3, cutting analysis time in half.
3. **Phase grades user perspective**: Grades calculated specifically for `game.is_user_white`.
4. **Book moves**: Evaluated against `openings.json` prefix trees and position EPDs; stops at first non-book move.
5. **Estimated rating explanation & fresh run**: Mathematical derivation documented; fresh run executed.
6. **Alembic Migrations**: Added `backend/alembic/` and `backend/alembic.ini`. Automatic `upgrade head` at startup with zero data loss to `all_chess.db`.
7. **Engine pool concurrency**: `EnginePool(size=2)` provides dedicated subprocesses via `asyncio.Queue` with auto-recovery.
8. **Classifier tightening**: Miss requires opponent blunder/mistake; Static Exchange Evaluation (SEE) detects genuine sacrifices and ignores protected pieces attacked by queen.
9. **Accuracy**: Lichess formula combines volatility-weighted arithmetic mean and harmonic mean; returns `None` when moves list is empty.
10. **Test suite resilience**: Tests skip or use mock when Stockfish is absent, guaranteeing 100% pass/skip on any fresh clone.
