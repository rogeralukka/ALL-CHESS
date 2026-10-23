# ALL-CHESS Phase 1 Architecture & Design Decisions

This document records all architectural choices, design trade-offs, and open-source licence audits made during Phase 1.

---

## 1. Piece Set Selection & Licence Terms
- **Chosen Set:** `cburnett` (Colin M.L. Burnett), the standard open-source piece set used across Lichess and Wikimedia Commons.
- **Source & Author:** Colin M.L. Burnett (User:Cburnett on Wikimedia Commons; packaged in Lichess).
- **Exact Licence Terms:** Tri-licensed under:
  1. GNU General Public License version 2 or later (GPLv2+)
  2. Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)
  3. Free Art License 1.3 (Licence Art Libre)
- **Attribution & Compliance:**
  - Full licence declaration and attribution text maintained at `frontend/public/pieces/cburnett/LICENSE`.
  - Piece loading is designed completely data-driven through `PIECE_SETS` array in `src/data/boardThemes.ts` so additional piece sets can be added without modifying the board renderer.

---

## 2. Palette & Design Token Distance from Competitors
- **Zero Proprietary Asset Reuse:** Absolutely no Chess.com hex values, piece sets, SVGs, or art assets are used.
- **Duskboard (Dark):** Page `#141312`, card `#1e1d1b`, raised `#2a2826`, border `rgba(255,255,255,.08)`, text `rgba(255,255,255,.88)`. Primary buttons use an amber vertical gradient (`#f6b13a` to `#e8920a`) with 1px inset highlight.
- **Dawnboard (Light):** Page `#faf8f5`, card `#ffffff`, raised `#f2efe9`, border `#e8e4df`, text `#1e1b18`. Same amber accent with high-contrast text (`#1e1b18`).
- **Classification Palette:**
  - Brilliant: `#2bc4b0` (`!!`)
  - Great: `#6f9bd1` (`!`)
  - Book: `#c99a6e` (open book)
  - Best: `#7bb661` (star)
  - Excellent: `#8cc46a` (thumbs-up)
  - Good: `#9fbf86` (check)
  - Inaccuracy: `#f2c14e` (`?!`)
  - Mistake: `#f59a4b` (`?`)
  - Miss: `#ef7d6e` (cross)
  - Blunder: `#e8483b` (`??`)

---

## 3. Coach Avatar & Expression Architecture
- **6 Hand-crafted Expressions:** Mapped to data-driven semantic keys:
  - `neutral`: `coach_neutral.png` (Aloof / Observant)
  - `thinking`: `coach_thinking.png` (Thoughtful)
  - `thumbsup`: `coach_best.png` (Cheerful Thumbs-Up)
  - `brilliant`: `coach_brilliant.png` (Cheeky Finger-Gun)
  - `embarrassed`: `coach_blunder.png` (Embarrassed)
  - `wave`: `coach_welcome.png` (Friendly Waving)
- **Sharp Optimization:** Script `scripts/optimize-coach.mjs` generates compressed WebP assets (`256px` for bust, `768px` for full body) and emits `public/assets/coach/manifest.json`.
- **Motion Scale:** 150ms cross-fade + 2-3% scale settle over 300ms, subtle 4s idle breathing loop (`translateY(2px)`), instant 0ms when `prefers-reduced-motion` is active.

---

## 4. Privacy & Mock Data Integrity
- **No API Keys or Secrets:** Phase 1 uses zero API keys. `.env*` is strictly ignored in `.gitignore`.
- **Fictional Usernames Only:** All mock games, friends, and opponents strictly use fictional names (`You`, `PawnStorm22`, `GM_Example`, `TacticsKnight`, `BishopSniper`, `RookRoller`, `friend_01`, `CoachAllChess`).
- **Legal Move Verification:** 100% of mock games and puzzles are verified via `chess.js` unit tests.

---

## 5. Step 1D: Settings Staging, BYOK Architecture & Profile Charts
- **Settings Staging Model:**
  - Board, piece set, and background selections update a local staged state immediately to provide instant real-time feedback on the live 3x3 preview chessboard.
  - Changes only propagate to the global Zustand store and persistent `localStorage` when the user clicks **Save Changes**. The **Revert** button cleanly resets staged state to store values.
- **BYOK (Bring Your Own Key) Clean Architectural Seam:**
  - Designed specifically for the transition to Phase 3 without any breaking changes.
  - Stores keys strictly inside browser `localStorage.all_chess_byok`.
  - Keys never touch network requests or server instances in Phase 1. Masked inputs with show/hide password toggles ensure shoulder-surfing privacy.
- **Recharts Integration & Theme Consistency:**
  - The `Profile` rating trajectory uses an `AreaChart` with an amber linear gradient (`#f59e0b` at 40% opacity fading to 0%) and custom tooltip rendered with theme tokens (`bg-theme-card border-theme-border text-theme-text`).
  - Works seamlessly across Duskboard and Dawnboard without hardcoding dark or light backgrounds into the SVG canvas.
- **Opponent Scout Decoupling:**
  - Scout analysis is built around public player identities with zero authentication requirements, preparing the application for direct Chess.com / Lichess public API ingestion in Phase 4.

---

## 6. Procedural Sound System & Audio Licence Terms
- **Approach:** Procedural synthesis via native HTML5 Web Audio API (`src/lib/sound.ts`).
- **Zero Proprietary Audio:** Zero audio samples from Chess.com, Lichess, or any proprietary soundboard are used.
- **Licence Terms:** CC0 1.0 Universal (Public Domain Dedication). The synthesizer produces acoustic wooden board knocks, capture thuds, harmonic alert chimes, double-strike castling, and celebratory puzzle chords directly in real-time.
- **Performance & Reliability:** 0 byte download footprint, zero network latency, non-overlapping channel management with gain curves, and graceful fallback when audio contexts are unavailable.
