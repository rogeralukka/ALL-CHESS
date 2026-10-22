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
├── frontend/                # React / Vite responsive web app & PWA
│   └── public/assets/coach/ # Client-ready coach avatar assets
├── backend/                 # FastAPI service for native Stockfish & game ingestion
│   ├── main.py
│   └── requirements.txt
├── avatar_showcase.html     # Standalone interactive Coach Studio & Playground
├── .env.example             # Environment template for API keys
└── .gitignore               # Secret protection rules
```

---

## 🚀 Quick Start

### 1. Interactive Coach Studio
Double click and open `avatar_showcase.html` in any web browser to test all 6 authentic character expressions with live move simulations and dark/light mode toggles.

### 2. Backend Engine Setup (Optional)
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local` and add your free Google Gemini API key:
```env
VITE_GEMINI_API_KEY_1=your_key_here
```

---

## 🛡️ Privacy & Security
* API keys are kept strictly local in `.env.local` and `localStorage` (BYOK pattern).
* Public game fetching requires zero passwords.
