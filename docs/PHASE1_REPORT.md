# ALL-CHESS Phase 1 Build & Fixes Report

Comprehensive build verification, test results, deviations, and responsive screenshot logs for Phase 1 and the Phase 1 Fixes of ALL-CHESS.

---

## 1. Overview of Phase 1 Implementation & Fixes

Phase 1 establishes the complete offline-first, client-side foundation of ALL-CHESS across four implementation steps and two review fix phases:
1. **Commit 1 (`phase1-fix1: review data and review board` - `3eba258`):** Addressed P0 core review data contradictions, Retry Mistake interactive loop, game result discrepancies, mobile review scroll cutoff, piece slide animation layer, pointer event touch drag, and classification badge placement.
2. **Commit 2 (`phase1-fix2: polish and prompt gaps`):** Addressed P1 review panel button rules and refutation stepper, wired illegal move teaching moments with highlighted squares, aligned the Home dashboard with live repository data and ratings, transformed the Learn roadmap into an illustrated winding path with 3-step lessons, enhanced the Game Summary and Eval Graph with dynamic swing callouts, optimized coach assets from 15MB to 1.77MB loaded via manifest, enforced color discipline (reserving green for chess classifications), corrected the cburnett piece tri-license, expanded unit tests to 34 passing tests, and captured complete responsive screenshots.

---

## 2. Honest Accounting of Deviations & Design Adjustments

### Step 1A: Shell, Design System, Board & Coach
- **Board Piece Animation Layer (Adjusted in Fix 1):** Initially, pieces were rendered nested inside individual square DOM elements using HTML5 drag-and-drop. This prevented CSS `transform: translate3d(...)` piece sliding transitions and broke drag-and-drop on mobile touchscreens. Replaced with an absolute piece layer positioned with GPU transforms keyed by stable piece IDs, respecting user animation duration (Off, 100ms, 200ms, 350ms) and `prefers-reduced-motion`, and powered by unified Pointer Events with snap-back physics.
- **Coach Asset Pipeline (Adjusted in Fix 2):** Avatar assets were initially copied as raw 15 MB PNGs with paths hardcoded in `CoachAvatar.tsx`. Updated `optimize-coach.mjs` to generate 256px bust and 768px full WebP assets with resized PNG fallbacks directly from the read-only `avatar/` directory, registering them in `manifest.json`. `CoachAvatar.tsx` now loads assets strictly data-driven via `getCoachAsset`.
- **Color Discipline (Adjusted in Fix 2):** The Hint button and certain success chips initially used emerald green, conflicting with the chess classification palette. Restricted green strictly to move quality badges (Best, Excellent) and positive board arrows; interactive actions and highlights now consistently use the warm amber accent (`#f59e0b`).

### Step 1B: Review Flow
- **Review Mock Data Contradictions (Adjusted in Fix 1):** Initially, `build-mock-games.mjs` generated a synthetic linear eval ramp and reused the played move as the top engine line. This caused `6. Bxf7+` in game-01 to show an increasing evaluation and self-referential best move. Corrected by hand-authoring `game-01` to 27 full moves (54 plies) with a true blunder drop from +0.3 to -2.4, best move `c3`, refutation variation `Kxf7 Ng5+ Kg8`, and matching checkmate `27... Rxf1#` (0-1). Rebuilt generator for games 02-12 so eval deltas strictly agree with classifications and all PV sequences are legal from the position before the move.
- **Game Results Audit (Adjusted in Fix 1):** `game-01` had PGN ending in checkmate by Black (`27... Rxf1#`) but was marked `1-0`; `game-12` ended in a drawn position but was marked `0-1`. Both were corrected to reflect the true chess state, and a unit test was added to guarantee `result` matches checkmate/draw across all games.
- **Retry Mistake Flow (Adjusted in Fix 1):** Initially allowed moving the opponent's pieces from the position after the mistake and accepted any move. Rewritten to load `fenBeforeMove`, enforce the mover's turn, validate user moves against `bestMove` and top lines, show coach reactions, and offer "Show answer".
- **Phone Review Scrolling (Adjusted in Fix 1):** Calling `scrollIntoView()` on active moves scrolled the outer window on 390px screens, cutting off the chessboard. Resolved by switching to container-local `scrollTop` and pinning the chessboard as sticky at the top on mobile.
- **Classification Badge Placement (Adjusted in Fix 1):** Re-positioned badges inside the destination square's top-right corner to prevent obscuring neighboring pieces.
- **Review Panel & Button Rules (Adjusted in Fix 1 & 2):** Coach bubble header updated to format `[Icon] Move is a classification` with right-aligned eval chip. "Show Best" displays green arrow and position after best move then offers "Resume Game". "Explain Move" steps through the refutation variation with red arrows and "Got it!" return. "Show Best" is hidden on Best and Book moves; Retry is only offered for Inaccuracy, Mistake, Miss, and Blunder.

### Step 1C: Play Coach, Learn, Puzzles
- **Illegal Move Teaching Moment (Adjusted in Fix 2):** Wired `onIllegalMove` in `Board.tsx` to `PlayGame.tsx`, triggering `ILLEGAL_MOVE_TEACHING_LINES` in the coach speech bubble, highlighting all legal destination squares for that piece, and triggering the coach `thinking` expression.
- **Learn Roadmap & 3-Step Lessons (Adjusted in Fix 2):** Transformed the single-step plain list into an illustrated winding path with a sunset atmosphere, node status states (done, current with pulsing "You are here", locked), stage detail breakdown card, and "Also suggested" card. Stages 1 to 3 were given 3 steps each: explain (board + arrows), demonstrate, and an interactive "your move" step with move validation via `chess.js` and coach feedback.
- **Mobile Learn Tab Row (Adjusted in Fix 2):** Responsive labels ("Endgame", "Openings", "Middlegame") and container wrap prevent tab row cut-off on 390px mobile viewports.

### Step 1D: Profile, Scout, Home, Settings
- **Home Screen Mockup Alignment (Adjusted in Fix 2):** Removed hardcoded values ("27 moves, 84.2% accuracy, 1-0 Win"). Bound all cards to repositories. Added "Your ratings" card (Rapid 905 +15, Blitz 870 +5, Bullet 880 +5 with "Adjust" link), 3 recent games list with an "Analyzing 62%" state on the 3rd game, and changed friends buttons from "Challenge" to "Compare" (navigating to the friends leaderboard). Replaced the duplicate "Sync Accounts" button with a subtle sync status badge ("Synced 12m ago").
- **Piece Set Licence (Adjusted in Fix 2):** Audited the cburnett piece set and updated `public/pieces/cburnett/LICENSE` and `docs/PHASE1_DECISIONS.md` to reflect the complete tri-license (GPLv2+, CC BY-SA 3.0, Free Art License 1.3) and author attribution.

---

## 3. Known Gaps (Scheduled for Subsequent Phases)

- **Phase 2 (Engine):** Client-side Stockfish WASM integration will replace synthetic engine evaluation with live multi-PV evaluation at configurable search depths.
- **Phase 3 (Coach Brain):** Client-side LLM narration via BYOK (Google Gemini, Groq, OpenRouter) will replace template lines with dynamic conversational analysis.
- **Phase 4 (Data & Sync):** Live Chess.com and Lichess public API game sync will replace mock game ingestion.

---

## 4. Verification & Test Suite Results

The test suite consists of **34 unit tests** across 5 test suites, all passing cleanly:

```bash
cd frontend
npm run lint  # 0 errors, 0 warnings (--max-warnings 0)
npm test      # 34 passed (34)
npm run build # TypeScript strict mode & Vite production bundle clean
```

### Test Breakdown:
- **`foundation.test.ts` (5 tests):** Verifies theme classes, button variants, board theme registry, piece set registry, and mock game count.
- **`review.test.ts` (9 tests):** Verifies 27-move game-01 structure and move 6 blunder (+0.3 -> -2.4), result matches final position if checkmate/draw across all games, legality of all PV and bestMove sequences from position before move, eval drop agreement with classifications (blunder >= 2.5, mistake >= 1.0, inaccuracy >= 0.4), retry accepts only best move or top lines, speed filtering, result filtering, search filtering, and phase grades.
- **`play_learn_puzzles.test.ts` (6 tests):** Verifies puzzle legality, mate-in-1 checkmate verification, daily puzzle access, 8 endgame stages, and lesson step FEN / move verification.
- **`profile_settings.test.ts` (9 tests):** Verifies rating history, opening stats, phase points lost, strengths/weaknesses, scout search, friends list, board themes, and settings store.
- **`polish_gaps.test.ts` (5 tests):** Verifies move-list / variation reducer (next, prev, select, start variation, step variation, exit variation), typewriter hook (skip immediately reveals full text, reduced motion bypasses timer), and theme tokens (resolves distinct page, card, raised, text, and classification tokens for both dusk and dawn).

---

## 5. Responsive Screenshot Gallery

All screenshots captured in Google Chrome across mobile (390px), tablet (820px), and desktop (1440px) viewports in both Duskboard (dark) and Dawnboard (light) themes.

### Phase 1 Fixes Screenshots (`docs/screenshots/phase1/fixes/`)

#### 1. Review Board on the Blunder (`6. Bxf7+`)
- **Dusk:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/review-blunder-dusk-390.png) | [820px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/review-blunder-dusk-820.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/review-blunder-dusk-1440.png)
- **Dawn:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/review-blunder-dawn-390.png) | [820px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/review-blunder-dawn-820.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/review-blunder-dawn-1440.png)

#### 2. Review Board: Show Best Move (`c3`)
- **Dusk:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/review-showbest-dusk-390.png) | [820px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/review-showbest-dusk-820.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/review-showbest-dusk-1440.png)
- **Dawn:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/review-showbest-dawn-390.png) | [820px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/review-showbest-dawn-820.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/review-showbest-dawn-1440.png)

#### 3. Review Board: Explain Move (Refutation Line Stepper)
- **Dusk:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/review-explain-dusk-390.png) | [820px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/review-explain-dusk-820.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/review-explain-dusk-1440.png)
- **Dawn:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/review-explain-dawn-390.png) | [820px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/review-explain-dawn-820.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/review-explain-dawn-1440.png)

#### 4. Review Board: Retry Mistake Mode
- **Dusk:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/review-retry-dusk-390.png) | [820px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/review-retry-dusk-820.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/review-retry-dusk-1440.png)
- **Dawn:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/review-retry-dawn-390.png) | [820px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/review-retry-dawn-820.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/review-retry-dawn-1440.png)

#### 5. Play Coach In-Game Sparring
- **Dusk:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/play-ingame-dusk-390.png) | [820px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/play-ingame-dusk-820.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/play-ingame-dusk-1440.png)
- **Dawn:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/play-ingame-dawn-390.png) | [820px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/play-ingame-dawn-820.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/play-ingame-dawn-1440.png)

#### 6. Play Coach Game-Over Modal
- **Dusk:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/play-gameover-dusk-390.png) | [820px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/play-gameover-dusk-820.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/play-gameover-dusk-1440.png)
- **Dawn:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/play-gameover-dawn-390.png) | [820px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/play-gameover-dawn-820.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/play-gameover-dawn-1440.png)

#### 7. Lesson Player (3-Step Roadmap)
- **Dusk:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/lesson-player-dusk-390.png) | [820px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/lesson-player-dusk-820.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/lesson-player-dusk-1440.png)
- **Dawn:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/lesson-player-dawn-390.png) | [820px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/lesson-player-dawn-820.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/lesson-player-dawn-1440.png)

#### 8. Tactical Puzzle Reward Overlay
- **Dusk:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/puzzle-reward-dusk-390.png) | [820px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/puzzle-reward-dusk-820.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/puzzle-reward-dusk-1440.png)
- **Dawn:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/puzzle-reward-dawn-390.png) | [820px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/puzzle-reward-dawn-820.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1/fixes/puzzle-reward-dawn-1440.png)
