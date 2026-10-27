# Deploying ALL-CHESS

Two pieces: the **frontend** on Vercel and the **API** (FastAPI + Stockfish) on Render.

## 1. API on Render (about 10 minutes)
1. Render dashboard, **New**, **Blueprint**, pick this repo. Render reads `render.yaml`.
2. It asks for the values marked `sync: false`:
   - `APP_PASSCODE`: the shared passcode your friends type to log in. Pick something strong.
   - `FRONTEND_ORIGIN`: your Vercel URL, e.g. `https://all-chess.vercel.app` (you can fill it in after step 2 below).
   - `CHESSCOM_CONTACT_EMAIL`: your email (sent to Chess.com in the sync User-Agent).
   `SESSION_SECRET` is generated for you.
3. The first deploy builds the Docker image (installs Stockfish), mounts a 1 GB disk at `/data` and keeps the SQLite database there, so games survive restarts.
4. Check `https://<your-service>.onrender.com/health` returns `{"status":"ok"}`.

The Starter plan is needed for the persistent disk. On the free plan the service sleeps after 15 minutes idle and its files are wiped on every restart.

## 2. Frontend on Vercel
1. New Project, import the repo, set **Root Directory** to `frontend` (framework: Vite).
2. `frontend/vercel.json` forwards `/api/*` to `https://all-chess-api.onrender.com`. If your Render service has a different URL, change it there.
   Because the browser only ever talks to the Vercel domain, the login cookie works without cross-site settings.
3. Deploy, then put the Vercel URL into `FRONTEND_ORIGIN` on Render.

## 3. Settings reference (backend env)
| Variable | Meaning |
|---|---|
| `APP_PASSCODE` | shared login passcode (required, no placeholder) |
| `SESSION_SECRET` | signs session cookies (required) |
| `FRONTEND_ORIGIN` | allowed browser origin for CORS |
| `DATABASE_URL` | `sqlite:////data/all_chess.db` on Render (4 slashes = absolute path) |
| `STOCKFISH_PATH` | set to `/usr/games/stockfish` by the Dockerfile |
| `COOKIE_SECURE` | `true` on https |
| `COOKIE_SAMESITE` | `lax` (default). Use `none` only if the frontend calls the API directly across sites (needs `COOKIE_SECURE=true`) |

## Notes
- Each friend logs in with the shared passcode and their own username; games and stats are separate per username.
- Reviewing a game runs Stockfish on the server. The Starter plan has 0.5 CPU, so a deep review of a long game takes a while; the in-browser Play Coach engine does not use the server.
- Never commit `.env` or a database file.
