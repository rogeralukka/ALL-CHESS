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

The test suite consists of **55 unit tests** across 9 test suites, all passing cleanly:

```bash
cd frontend
npm run lint  # 0 errors, 0 warnings (--max-warnings 0)
npm test      # 55 passed (55)
npm run test:e2e # 5 smoke suites pass with 0 errors/warnings across dev and preview matrix
npm run build # TypeScript strict mode & Vite production bundle clean
```

### Test Breakdown:
- **`foundation.test.ts` (5 tests):** Verifies theme classes, button variants, board theme registry, piece set registry, and mock game count.
- **`review.test.ts` (9 tests):** Verifies 27-move game-01 structure and move 6 blunder (+0.3 -> -2.4), result matches final position if checkmate/draw across all games, legality of all PV and bestMove sequences from position before move, eval drop agreement with classifications (blunder >= 2.5, mistake >= 1.0, inaccuracy >= 0.4), retry accepts only best move or top lines, speed filtering, result filtering, search filtering, and phase grades.
- **`play_learn_puzzles.test.ts` (6 tests):** Verifies puzzle legality, mate-in-1 checkmate verification, daily puzzle access, 8 endgame stages, and lesson step FEN / move verification.
- **`profile_settings.test.ts` (9 tests):** Verifies rating history, opening stats, phase points lost, strengths/weaknesses, scout search, friends list, board themes, and settings store.
- **`polish_gaps.test.ts` (5 tests):** Verifies move-list / variation reducer (next, prev, select, start variation, step variation, exit variation), typewriter hook (skip immediately reveals full text, reduced motion bypasses timer), and theme tokens (resolves distinct page, card, raised, text, and classification tokens for both dusk and dawn).
- **`phase1_5_motion_sound.test.ts` (6 tests):** Verifies motion modes, reduced motion fallbacks, and audio triggers.
- **`phase1_5_review_parity.test.ts` (4 tests):** Verifies review board layout, figurine SAN conversion, and move classification badges.
- **`board_coach_render.test.tsx` (5 tests):** Verifies dev-mode piece rendering under React StrictMode double-mounting, piece count stability, and coach bubble avatar asset resolution.
- **`section_b_behavior.test.tsx` (6 tests):** Verifies Negamax engine search with piece-square tables, blunder probability curves across coach levels, 22 ECO opening detections, notable tactical moves filter, and review button state transitions.

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

---

## 6. Phase 1.5 "Feels Like Chess.com" Polish Pass

Phase 1.5 executed a comprehensive polish pass across four sequential commits, resolving critical browser-level rendering issues, upgrading the tactile motion and audio engine, achieving visual and structural parity with Chess.com on Game Review, and polishing all primary application screens.

### 6.1 Honest Accounting of Deliverables

| Requirement / Item | Status | Implementation Details & Architectural Decisions |
|---|---|---|
| **1. Empty Board Fix (P0)** | **Done** | Module-level `EMPTY = []` constant default for array props (`arrows`, `badges`, `highlights`, `legalTargets`) in `Board.tsx`. Added array equality guard in `setComputedLegalTargets` effect, and memoized array literals across callers. Eliminated infinite re-render loop and "Maximum update depth exceeded" errors. |
| **2. Browser Smoke Tests (P0)** | **Done** | Implemented `frontend/scripts/run-smoke-tests.mjs` executed via `npm run test:e2e`. Visits 9 routes across 4 viewports/motion matrix (`desktop-no-pref`, `desktop-reduced`, `mobile-no-pref`, `mobile-reduced`). Enforces **zero console errors/warnings**, asserts board piece counts ($\ge 2$), and verifies the `??` blunder badge on f7 at move 6. |
| **3. Motion System Revamp** | **Done** | Implemented unified `useMotion()` hook with Full / Reduced / Off settings. Reduced mode keeps progressive coach text typing, subtle 120-150ms cross-fades, badge fades, and 80ms piece slides, removing only large bounces/rays/confetti. Tied `data-motion` attribute to `<html>` for global CSS token alignment. |
| **4. Tactile Sound & Buttons** | **Done** | Built zero-latency procedural Web Audio engine in `sound.ts` with custom synthesis for move, capture, check, castle, promote, illegal, game-end, and puzzle-correct/wrong events (CC0 licensed in `docs/PHASE1_DECISIONS.md`). Upgraded `Button.tsx` with beveled gradients, 1px inset highlights/shadows, and active pushdown transforms. Added board piece lift, grab cursor, and Full-mode illegal snapback shake. |
| **5. Review Screen Parity** | **Done** | **Summary Layout:** Unified to the same two-column layout as Review Board (board + eval on left/top; summary on right/bottom).<br>**Move-Quality Table:** Full width with White/Black player circular avatars as column headers, hiding zero rows behind expander.<br>**Coach Summary Line:** Dynamically generated from data (biggest swing move, phase grades, and match result).<br>**Bubble Header:** Unclipped avatar portrait, move SAN rendered with chess figurine piece icon via `toFigurineSan`.<br>**Buttons:** Single row of 3 equal-width buttons (Explain, Best, Next).<br>**Board on Blunder:** Checked king glows red (`bg-red-600/50 ring-2 ring-red-500`), destination square amber, source tinted, refutation arrow `e8 -> f7`, and `??` badge on f7.<br>**Eval Bar & Numbers:** Absolute value printed at leading side's end (`3.5` at top when Black leads); realistic blunder drop from `+0.3` to `-3.54` for a lost bishop.<br>**Move List:** Compact 27px rows, full width, classification badge directly before SAN, SAN colored for bad moves.<br>**Graph:** Thin graph pinned above transport controls with colored dots on key moves, quality-colored cursor, and hover tooltips.<br>**Header & Tally:** Back arrow, "Game Review", sound toggle; opening name moved above move list; material tally (`+N` badge and captured piece figurines) beside player names. |
| **6. Screen Polish** | **Done** | **Learn Path:** Round nodes with titles underneath, dashed path drawn behind nodes, current node pulses in Full mode, descriptions contained strictly in detail card.<br>**Home:** Streak chips with filled done state and amber outline for today; 3 entry cards (Lessons, Puzzles, Play Coach) with interactive-off mini board previews, icons, progress bars, and primary actions.<br>**Profile:** Removed "PRO" badge and "Online" chip from user card; transformed Win/Draw/Loss into a segmented bar with labels under each segment; fixed-width numerical slots (`w-12 text-right`) for Strengths and Weaknesses deltas.<br>**Play Coach Lobby:** Selected level cards display accent outline (`border-amber-500 ring-2 ring-amber-500/40`) and checkmark badge; board remains visible next to the lobby on desktop (and top on mobile) during match setup.<br>**Typography & Spacing:** Strict tabular numbers (`font-mono tabular-nums`) applied to ratings, evals, and counts; consistent 12px uppercase tracking labels; standardized 16px padding (`p-4`) and 12px gaps (`gap-3` / `space-y-3`) across all cards. |
| **7. Honest Reporting & Evidence** | **Done** | Captured 32 high-resolution screenshots across all required screens, viewports (390px, 1440px), and themes (Dusk, Dawn), along with 5-second WebM screen recordings of stepping moves 1-8 and solving the first puzzle. |

---

### 6.2 Screen Recordings (`docs/recordings/`)

- **Stepping Moves 1 to 8 in Game Review:** [review-stepping-moves1-8.webm](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/recordings/review-stepping-moves1-8.webm)
- **Solving Tactical Puzzle #1 (Back-Rank Mate-in-1):** [puzzle-solve-animation.webm](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/recordings/puzzle-solve-animation.webm)

---

### 6.3 Phase 1.5 Screenshot Gallery (`docs/screenshots/phase1_5/`)

#### 1. Game Review at Move 6 Blunder (`6. Bxf7+`)
- **Dusk:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/review-move6-dusk-390.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/review-move6-dusk-1440.png)
- **Dawn:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/review-move6-dawn-390.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/review-move6-dawn-1440.png)

#### 2. Review Board: Show Best Move (`c3`)
- **Dusk:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/review-showbest-dusk-390.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/review-showbest-dusk-1440.png)
- **Dawn:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/review-showbest-dawn-390.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/review-showbest-dawn-1440.png)

#### 3. Review Board: Explain Move (Refutation Stepper)
- **Dusk:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/review-explain-dusk-390.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/review-explain-dusk-1440.png)
- **Dawn:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/review-explain-dawn-390.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/review-explain-dawn-1440.png)

#### 4. Game Summary (Two-Column Layout with Dynamic Coach Summary)
- **Dusk:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/review-summary-dusk-390.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/review-summary-dusk-1440.png)
- **Dawn:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/review-summary-dawn-390.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/review-summary-dawn-1440.png)

#### 5. Play Coach Match in Progress (e2 to e4)
- **Dusk:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/play-ingame-dusk-390.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/play-ingame-dusk-1440.png)
- **Dawn:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/play-ingame-dawn-390.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/play-ingame-dawn-1440.png)

#### 6. Tactical Puzzle Solved State (`Rd8#`)
- **Dusk:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/puzzle-solved-dusk-390.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/puzzle-solved-dusk-1440.png)
- **Dawn:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/puzzle-solved-dawn-390.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/puzzle-solved-dawn-1440.png)

#### 7. Learn Roadmap Path (Round Nodes, Dashed Path Behind)
- **Dusk:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/learn-path-dusk-390.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/learn-path-dusk-1440.png)
- **Dawn:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/learn-path-dawn-390.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/learn-path-dawn-1440.png)

#### 8. Learn Lesson Interactive Player
- **Dusk:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/learn-lesson-dusk-390.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/learn-lesson-dusk-1440.png)
- **Dawn:** [390px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/learn-lesson-dawn-390.png) | [1440px](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_5/learn-lesson-dawn-1440.png)

---

## 7. Phase 1.6 Screen-by-Screen Parity, Behavior & Polish Accounting

Phase 1.6 executed the comprehensive five-part remediation and parity roadmap specified in `ANTIGRAVITY_PHASE1_6_PROMPT.md`, covering dev-mode board rendering, engine and coach behaviour, responsive layout parity against desktop and mobile benchmarks, a dual-format CC0 recorded audio system, and 36 screen-by-screen parity captures.

### 7.1 Honest Accounting of Deliverables

| Requirement / Item | Status | Implementation Details & Architectural Decisions |
|---|---|---|
| **A1. Dev-Mode Board Rendering** | **Done** | Fixed piece rendering under React StrictMode double-mounting in `Board.tsx`. Replaced mutation-prone state initialization with pure reducer cloning and counter ref tracking (`mountCountRef`). Eliminated race conditions where pieces failed to render in dev mode while working in preview. |
| **A2. Typewriter & Reduced Motion** | **Done** | Fixed `useTypewriter` hook to instantly synchronize text on move selection or skip clicks, and immediately display full text when `prefers-reduced-motion` or `data-motion="reduced"\|"off"` is active without lagging behind user interactions. |
| **A3. Test Coverage Gaps** | **Done** | Added 21 new unit tests across `board_coach_render.test.tsx`, `section_b_behavior.test.tsx`, and `polish_gaps.test.ts` (total 55 passing tests). Covers dev-mode StrictMode mounting, piece coordinate stability, coach avatar paths, Negamax search depth, blunder probabilities, and ECO opening detection. |
| **B1. Play Coach Engine Intelligence** | **Done** | Implemented `EngineService` in `src/lib/engine.ts` using 2-ply and 3-ply Negamax with piece-square tables (PST). Blunder probabilities are calibrated inversely by coach level (e.g. Beginner has 25% blunder chance, Master has 0%). Simulated thinking delay between 400ms and 750ms provides realistic human-like pacing. |
| **B2. Live ECO Opening Detection** | **Done** | Created dynamic ECO detection for 22 primary openings (Ruy Lopez, Sicilian, French, Caro-Kann, Queen's Gambit, King's Indian, etc.) rendered live above the move list. Coach only comments on notable moves (captures, checks, blunders, opening completions) rather than speaking every move. |
| **B3. Review Action Button Rules** | **Done** | Refactored `ReviewBoard.tsx` button bar to enforce strict state rules: "Explain" is shown for Book moves; "Explain" and "Show Best" are hidden for Best and Excellent moves; "Next" is always visible and triggers auto-advance. |
| **B4. Click-to-Move Illegal Parity** | **Done** | Unified click-to-move illegal path with drag-and-drop: clicking an illegal destination square flashes the square red (`bg-red-500/40`), plays the CC0 illegal audio sound, and snaps selection off. |
| **B5. Resign Confirmation Scrim** | **Done** | Added a modal confirmation popover with a 40% dark scrim (`bg-black/40 backdrop-blur-sm`) on the Resign button in `PlayGame.tsx` to prevent accidental match loss. |
| **B6. Puzzle Reward Cascade** | **Done** | Upgraded `Puzzles.tsx` with a reward cascade upon puzzle completion: +15 rating chip floating upward with scale and fade, live count-up animation on current rating, and an automated smooth transition to the next puzzle. |
| **C1. Mobile 390px Layout Fixes** | **Done** | **Settings:** Replaced long single-column scroll with a card directory pattern and back arrow navigation.<br>**Home:** Rating chips converted to a horizontal swipeable strip with subtle edge fade masks.<br>**Lobby & Learn:** Reduced mini-board preview size to 64px 2x2 tiles to prevent vertical layout crowding. |
| **C2. Desktop 1707x932 Parity** | **Done** | Right panel locked to 480–500px matching Chess.com; 48px height on primary action buttons and transport controls; 30px move rows with 13px bold font and alternating zebra striping; tight neutral SAN selection box; 32px move number column; full-width coach speech bubble with unclipped avatar. |
| **C3. Type Scale & Truncation** | **Done** | Enforced minimum 12px font size across all UI labels and secondary text (11px strictly reserved for board file/rank coordinates); long opening and lesson titles styled with `line-clamp-2` and full title tooltips on hover. |
| **C4. Tap Targets** | **Done** | All interactive controls meet or exceed 44x44px on mobile viewports and 32x32px on desktop viewports. |
| **C5. Learn Roadmap Path** | **Done** | Learn roadmap SVG path rendered strictly behind stage nodes using layered z-index (`z-0` for SVG road, `z-10` for nodes). Labels are offset below nodes, and a glowing "You are here" pin marks active progress. |
| **D1. Motion Settings** | **Done** | Three-tier motion toggle (Full / Reduced / Off) maintained in Settings and Zustand store. Detects system `prefers-reduced-motion` with a one-time non-intrusive banner while defaulting to Full mode; CSS overrides in `tokens.css` scoped via `:root:not([data-motion="full"])`. |
| **D2. Dual-Format Recorded CC0 Audio** | **Done** | Replaced all synthetic oscillator beeps with 10 real recorded acoustic samples in dual `.mp3` and `.ogg` formats (move, capture, check, castle, promote, illegal, game_start, game_end, puzzle_correct, puzzle_wrong). Normalized to -16 LUFS with stereo panning by board file (-0.15 to +0.15). Audited CC0 licenses in `docs/PHASE1_DECISIONS.md`. |
| **D3. Piece Motion & In-Board Promotion** | **Done** | 100ms fade-out on captured pieces at destination square; 400ms red radial check flash on checked king; simultaneous slide for king and rook on castle moves; rewritten `PromotionDialog` as an in-board vertical picker positioned directly over the promotion square; removed hover scale on outer piece container. |
| **D4. Panel Transitions** | **Done** | Fixed-container heights with 200ms `framer-motion` cross-fades eliminate layout jumps between Summary and Review Board in `ReviewRouter.tsx`, and between Lobby and In-Game in `PlayGame.tsx`. |
| **D5. Skeletons & Layout Stability** | **Done** | Implemented `ReviewSkeleton` in `ReviewRouter.tsx` matching the exact dimensions of the chessboard and right panel, preventing layout shifts during route transitions. |
| **D6. Focus Rings & Keyboard Navigation** | **Done** | Added 2px amber accent focus ring (`focus-visible:ring-2 focus-visible:ring-amber-500`) across all interactive elements in `globals.css`. Added Escape key listeners to close modals, popovers, and the promotion dialog. |
| **E. Screen-by-Screen Parity Gallery** | **Done** | Generated 36 high-resolution screenshots covering all 9 application screens across Dusk and Dawn themes in desktop (1440x900) and mobile (390x844) viewports. |

---

### 7.2 Phase 1.6 Screen-by-Screen Parity Gallery (`docs/screenshots/phase1_6/`)

#### 1. Home Dashboard (`01-home`)
- **Dusk:** [Desktop (1440x900)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/01-home-dusk-desktop.png) | [Mobile (390x844)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/01-home-dusk-mobile.png)
- **Dawn:** [Desktop (1440x900)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/01-home-dawn-desktop.png) | [Mobile (390x844)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/01-home-dawn-mobile.png)

#### 2. Game Review: Summary View (`02-review-summary`)
- **Dusk:** [Desktop (1440x900)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/02-review-summary-dusk-desktop.png) | [Mobile (390x844)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/02-review-summary-dusk-mobile.png)
- **Dawn:** [Desktop (1440x900)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/02-review-summary-dawn-desktop.png) | [Mobile (390x844)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/02-review-summary-dawn-mobile.png)

#### 3. Game Review: Review Board at Move 6 Blunder (`03-review-board`)
- **Dusk:** [Desktop (1440x900)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/03-review-board-dusk-desktop.png) | [Mobile (390x844)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/03-review-board-dusk-mobile.png)
- **Dawn:** [Desktop (1440x900)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/03-review-board-dawn-desktop.png) | [Mobile (390x844)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/03-review-board-dawn-mobile.png)

#### 4. Play Coach: Setup Lobby (`04-play-lobby`)
- **Dusk:** [Desktop (1440x900)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/04-play-lobby-dusk-desktop.png) | [Mobile (390x844)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/04-play-lobby-dusk-mobile.png)
- **Dawn:** [Desktop (1440x900)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/04-play-lobby-dawn-desktop.png) | [Mobile (390x844)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/04-play-lobby-dawn-mobile.png)

#### 5. Play Coach: In-Game Match (`05-play-ingame`)
- **Dusk:** [Desktop (1440x900)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/05-play-ingame-dusk-desktop.png) | [Mobile (390x844)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/05-play-ingame-dusk-mobile.png)
- **Dawn:** [Desktop (1440x900)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/05-play-ingame-dawn-desktop.png) | [Mobile (390x844)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/05-play-ingame-dawn-mobile.png)

#### 6. Tactical Puzzles Screen (`06-puzzles`)
- **Dusk:** [Desktop (1440x900)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/06-puzzles-dusk-desktop.png) | [Mobile (390x844)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/06-puzzles-dusk-mobile.png)
- **Dawn:** [Desktop (1440x900)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/06-puzzles-dawn-desktop.png) | [Mobile (390x844)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/06-puzzles-dawn-mobile.png)

#### 7. Learn Roadmap Screen (`07-learn`)
- **Dusk:** [Desktop (1440x900)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/07-learn-dusk-desktop.png) | [Mobile (390x844)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/07-learn-dusk-mobile.png)
- **Dawn:** [Desktop (1440x900)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/07-learn-dawn-desktop.png) | [Mobile (390x844)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/07-learn-dawn-mobile.png)

#### 8. Player Profile Screen (`08-profile`)
- **Dusk:** [Desktop (1440x900)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/08-profile-dusk-desktop.png) | [Mobile (390x844)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/08-profile-dusk-mobile.png)
- **Dawn:** [Desktop (1440x900)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/08-profile-dawn-desktop.png) | [Mobile (390x844)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/08-profile-dawn-mobile.png)

#### 9. Settings Screen (`09-settings`)
- **Dusk:** [Desktop (1440x900)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/09-settings-dusk-desktop.png) | [Mobile (390x844)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/09-settings-dusk-mobile.png)
- **Dawn:** [Desktop (1440x900)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/09-settings-dawn-desktop.png) | [Mobile (390x844)](file:///C:/Users/Roger/Documents/AA%20PROJECTS/CHESS%20GUIDE/docs/screenshots/phase1_6/09-settings-dawn-mobile.png)

