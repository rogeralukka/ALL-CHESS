/**
 * Stockfish opponent for Play Coach. Uses its own worker so the strength options set here never
 * leak into analysis searches. Returns null whenever Stockfish is unavailable so the caller can
 * fall back to the built-in light engine.
 */

export const MIN_LEVEL = 400;
export const MAX_LEVEL = 3200; // "Max": full-strength Stockfish
const UCI_ELO_MIN = 1320; // Stockfish's lowest supported UCI_Elo
const UCI_ELO_MAX = 3190;

export interface PlayStrength {
  limitStrength: boolean;
  elo?: number;
  skill?: number;
  movetimeMs: number;
  depth?: number;
}

/** Pure mapping from a displayed level to Stockfish settings (exported for tests). */
export function strengthFor(rating: number): PlayStrength {
  const r = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.round(rating)));
  if (r >= MAX_LEVEL) return { limitStrength: false, movetimeMs: 1500 };
  if (r < UCI_ELO_MIN) {
    // Below Stockfish's Elo floor: Skill Level 0..~6 plus a shallow search.
    const t = (r - MIN_LEVEL) / (UCI_ELO_MIN - MIN_LEVEL);
    return { limitStrength: false, skill: Math.round(t * 6), depth: 1 + Math.round(t * 3), movetimeMs: 150 };
  }
  const elo = Math.min(UCI_ELO_MAX, r);
  return { limitStrength: true, elo, movetimeMs: r >= 2400 ? 900 : 400 };
}

class StockfishPlay {
  private worker: Worker | null = null;
  private failed = false;
  private chain: Promise<unknown> = Promise.resolve();

  private init(): Worker | null {
    if (this.failed) return null;
    if (this.worker) return this.worker;
    if (typeof window === 'undefined' || typeof Worker === 'undefined') {
      this.failed = true;
      return null;
    }
    try {
      const w = new Worker(new URL('/stockfish/stockfish-19-lite-single.js', window.location.origin).href);
      w.onerror = () => {
        this.failed = true;
        this.worker = null;
      };
      w.postMessage('uci');
      this.worker = w;
      return w;
    } catch {
      this.failed = true;
      return null;
    }
  }

  /** Best move in UCI form (e.g. "e2e4", "e7e8q") for the level, or null if the engine can't help. */
  bestMove(fen: string, rating: number): Promise<string | null> {
    const run = () => this.search(fen, rating);
    const next = this.chain.then(run, run);
    this.chain = next.catch(() => null);
    return next;
  }

  private search(fen: string, rating: number): Promise<string | null> {
    const w = this.init();
    if (!w) return Promise.resolve(null);
    const s = strengthFor(rating);
    return new Promise((resolve) => {
      const done = (v: string | null) => {
        clearTimeout(timer);
        w.removeEventListener('message', onMsg);
        resolve(v);
      };
      const timer = setTimeout(() => done(null), s.movetimeMs + 8000);
      const onMsg = (e: MessageEvent) => {
        const line = typeof e.data === 'string' ? e.data : '';
        if (line.startsWith('bestmove')) {
          const mv = line.split(/\s+/)[1];
          done(mv && mv !== '(none)' ? mv : null);
        }
      };
      w.addEventListener('message', onMsg);
      w.postMessage('ucinewgame');
      w.postMessage(`setoption name UCI_LimitStrength value ${s.limitStrength}`);
      if (s.limitStrength && s.elo) w.postMessage(`setoption name UCI_Elo value ${s.elo}`);
      w.postMessage(`setoption name Skill Level value ${s.skill ?? 20}`);
      w.postMessage('setoption name MultiPV value 1');
      w.postMessage(`position fen ${fen}`);
      w.postMessage(s.depth ? `go depth ${s.depth} movetime ${s.movetimeMs}` : `go movetime ${s.movetimeMs}`);
    });
  }
}

export const stockfishPlay = new StockfishPlay();
