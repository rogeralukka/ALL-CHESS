# ALL-CHESS Phase 1 Architecture & Design Decisions

This document records all architectural choices, design trade-offs, and open-source licence audits made during Phase 1.

---

## 1. Piece Set Selection & Licence Terms
- **Chosen Set:** `cburnett` (Colin M.L. Burnett), the standard open-source piece set used by Lichess and Wikimedia Commons.
- **Licence Terms:** Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0) / GPL.
- **Attribution & Compliance:**
  - Attribution file created at `frontend/public/pieces/cburnett/LICENSE`.
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
