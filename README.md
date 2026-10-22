# ALL-CHESS ♟️

A completely free, private alternative to Chess.com's paid review tier—featuring automated game synchronization, Stockfish move evaluation, an adaptive bot coach, an opening/phase tracker, and a gamified learning roadmap.

---

## 🌟 Key Features

* **Authentic Coach Character:** Powered by 6 distinct, hand-crafted transparent expressions reacting in real time to your moves:
  * 👋 **Friendly Waving:** Welcome greeting on Home screen, pre-game lobby, and friendly rematch invites.
  * 😐 **Aloof / Observant:** Idle, calm observation, and balanced positions ($0.0$).
  * 👉 **Cheeky Finger-Gun:** Brilliant sacrifices (`!!`), game wins, and tactical masterclasses.
  * 👍 **Cheerful Thumbs-Up:** Best moves (`★`), book openings, and solid piece development.
  * 😳 **Embarrassed:** Blunders (`??`), tactical misses, and hanging pieces.
  * 🤔 **Thoughtful:** In-depth engine calculation, puzzle hints, and sharp positions.
* **Chess.com & Lichess Zero-Auth Sync:** Automatically pulls and caches all games by username using public APIs without requiring passwords. Auto-syncs every 15 minutes.
* **Move-by-Move Review:** Full Chess.com classification palette (`!!` Brilliant, `!` Great, `★` Best, `✓✓` Excellent, `✓` Good, `B` Book, `?!` Inaccuracy, `?` Mistake, `×` Miss, `??` Blunder).
* **Two-Tier Coaching Engine:**
  * **Tier 1 (Source of Truth):** Deterministic chess rules via engine and pattern detection (hanging pieces, forks, pins, skewers, mate threats).
  * **Tier 2 (Natural Language Polish):** Warm, conversational coaching feedback powered by Google Gemini and Groq with automatic key rotation.
* **Hybrid Analysis Engine:** Client-side Web Worker Stockfish WASM for zero-cost execution on any device, with permanent cloud/database caching so reviewed games load in `<50ms`.
* **Dual Themes:** Full first-class support for both **Duskboard (Dark)** and **Dawnboard (Light)**.

---

## 📁 Repository Structure

```
ALL-CHESS/
├── avatar/                  # Original high-res source PNGs for the 6 expressions
├── assets/
│   ├── coach/               # Processed transparent bust and full-body coach assets
│   └── previews/            # Studio screenshots and reference captures
├── frontend/                # React 18 / Vite / Tailwind / TypeScript frontend & PWA
│   ├── public/              # Optimized WebP coach assets, open-source pieces & PWA manifest
│   ├── src/                 # Application architecture (app, components, features, data, lib, styles)
│   └── scripts/             # Sharp asset optimization and screenshot automation
├── docs/                    # Phase reports, architecture decisions, reference guides & screenshots
├── backend/                 # FastAPI service for native Stockfish & game ingestion (Phase 2)
│   ├── main.py
│   └── requirements.txt
├── avatar_showcase.html     # Standalone interactive Coach Studio & Playground
├── .env.example             # Environment template for API keys
└── .gitignore               # Secret protection rules
```

---

## 🚀 Quick Start

### 1. Frontend Web App (Phase 1 — Complete)
```bash
cd frontend
npm install
npm run dev
```
Run verification checks:
```bash
npm test     # 25 Vitest unit tests across 4 test suites
npm run lint # Strict ESLint validation (0 errors, 0 warnings)
npm run build# TypeScript type-check and production bundle
```

### 2. Interactive Coach Studio
Double click and open `avatar_showcase.html` in any web browser to test all 6 authentic character expressions with live move simulations and dark/light mode toggles.

### 3. Backend Engine Setup (Out of scope for Phase 1 — Phase 2 Seam)
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## 🛡️ Privacy & Security
* **Phase 1 is 100% Mock & Zero-Secret:** Operates entirely with mock data and fictional usernames. No API keys or environment variables required.
* **BYOK AI Architecture (Phase 3 Seam):** When users configure custom AI keys in Settings, keys are stored strictly in client-side `localStorage.all_chess_byok` and never leave the browser.
* **Public Data Ingestion (Phase 4 Seam):** Public profile and game syncing requires zero passwords or credentials.
