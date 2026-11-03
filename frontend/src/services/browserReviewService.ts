/**
 * Game-review search that runs on the user's own device (Stockfish compiled to WASM in a Web Worker).
 *
 * The browser only searches: for every position of the game it reports the top lines (UCI moves + raw UCI score from the
 * side to move's point of view). The backend then grades the moves, computes accuracy and writes commentary, so a phone
 * or a laptop does the heavy work and the server stays small and free.
 */
import type { AnalysisLevel } from '@/features/review/analysisLevels';

export interface BrowserLine {
  pv: string[];
  cp: number | null;
  mate: number | null;
  depth: number;
}

export interface BrowserPosition {
  lines: BrowserLine[];
}

export interface SearchLimits {
  depth: number;
  movetimeMs: number;
  multipv: number;
}

/**
 * Every position is searched to a real depth. `movetimeMs` is only a safety cap for a pathological position:
 * a short time cap used to decide the depth instead (Standard "d18" reached ~15, Max "d32" ~17-23), and a review
 * in a background tab, which the browser slows down, came out shallower. Now it only takes longer.
 */
export const BROWSER_LIMITS: Record<AnalysisLevel['id'], SearchLimits> = {
  standard: { depth: 18, movetimeMs: 20000, multipv: 3 },
  deep: { depth: 20, movetimeMs: 30000, multipv: 3 },
  deeper: { depth: 22, movetimeMs: 45000, multipv: 3 },
  max: { depth: 24, movetimeMs: 60000, multipv: 3 },
};

export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

/** Where a game starts: the PGN's [FEN "..."] header for odds games and set-up positions, else the normal start. */
export function startFenOf(pgn?: string | null): string {
  const m = pgn?.match(/\[FEN\s+"([^"]+)"\]/);
  return m ? m[1].trim() : START_FEN;
}

export interface ParsedInfo {
  multipv: number;
  depth: number;
  cp: number | null;
  mate: number | null;
  pv: string[];
}

/** Parses one UCI "info" line. Returns null for lines without a usable principal variation or with a bound score. */
export function parseInfoLine(line: string): ParsedInfo | null {
  if (!line.startsWith('info ') || !/\spv\s/.test(line)) return null;
  // Aspiration-window bounds are not real scores.
  if (/\b(lowerbound|upperbound)\b/.test(line)) return null;
  const pvMatch = line.match(/\spv\s+(.+)$/);
  if (!pvMatch) return null;
  const cp = line.match(/\bscore\s+cp\s+(-?\d+)/);
  const mate = line.match(/\bscore\s+mate\s+(-?\d+)/);
  if (!cp && !mate) return null;
  const depth = line.match(/\bdepth\s+(\d+)/);
  const mpv = line.match(/\bmultipv\s+(\d+)/);
  return {
    multipv: mpv ? parseInt(mpv[1], 10) : 1,
    depth: depth ? parseInt(depth[1], 10) : 0,
    cp: cp ? parseInt(cp[1], 10) : null,
    mate: mate ? parseInt(mate[1], 10) : null,
    pv: pvMatch[1].trim().split(/\s+/).slice(0, 12),
  };
}

export interface EngineWorkerLike {
  postMessage(message: string): void;
  addEventListener(type: 'message' | 'error', listener: (event: MessageEvent) => void): void;
  removeEventListener(type: 'message' | 'error', listener: (event: MessageEvent) => void): void;
  terminate(): void;
}

export interface SearchOptions {
  createWorker?: () => EngineWorkerLike;
  onProgress?: (pct: number) => void;
  isCancelled?: () => boolean;
  /** Extra time allowed beyond the movetime before a single position counts as hung. */
  graceMs?: number;
  /** Engines run side by side; defaults to enginePoolSize() (1 when a test supplies createWorker) */
  workers?: number;
  /** Starts watching how smoothly the page draws; calls `onJank` when it stutters and returns a stop function. Defaults to a real requestAnimationFrame monitor. */
  frameMonitor?: (onJank: () => void) => () => void;
}

/**
 * How many engines to run side by side. Positions are independent, so several single-threaded engines each
 * take their own positions (measured on a 20-thread laptop at depth 18: 1 engine 2.97 s per position,
 * 4 engines 0.64 s, 8 engines 0.50 s). The multi-threaded Stockfish build was measured too and was ~6x slower.
 * A quarter of the cores, at most 4 (8 engines were only ~25% faster than 4 but made the page and the whole
 * machine stutter), so the page and the rest of the machine stay responsive.
 */
export function enginePoolSize(): number {
  const cores = typeof navigator !== 'undefined' && navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 2;
  return Math.max(1, Math.min(4, Math.floor(cores / 4)));
}

/** True when the page is stuttering: at least 40% of the recent frames took longer than 50 ms (a smooth page is ~17 ms). */
export function isJanky(frameGapsMs: number[]): boolean {
  if (frameGapsMs.length < 20) return false;
  const recent = frameGapsMs.slice(-20);
  return recent.filter((g) => g > 50).length >= 8;
}

/** Watches frame timing with requestAnimationFrame; calls onJank (at most every 4 s) while the page stutters. */
export function watchFrameRate(onJank: () => void): () => void {
  if (typeof requestAnimationFrame !== 'function' || typeof document === 'undefined') return () => {};
  let raf = 0;
  let last = 0;
  let lastJank = 0;
  let stopped = false;
  const gaps: number[] = [];
  const tick = (now: number) => {
    if (stopped) return;
    // a hidden tab pauses drawing; that is not stutter, so start the measurement again when it returns
    if (document.hidden) {
      last = 0;
      gaps.length = 0;
    } else {
      if (last) gaps.push(now - last);
      if (gaps.length > 40) gaps.shift();
      last = now;
      if (isJanky(gaps) && now - lastJank > 4000) {
        lastJank = now;
        gaps.length = 0;
        onJank();
      }
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
  };
}

function defaultWorker(): EngineWorkerLike {
  if (typeof window === 'undefined' || typeof Worker === 'undefined') {
    throw new Error('Web Workers are not available in this browser');
  }
  return new Worker(new URL('/stockfish/stockfish-19-lite-single.js', window.location.origin).href) as unknown as EngineWorkerLike;
}

function waitFor(worker: EngineWorkerLike, expected: string, timeoutMs: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const onMessage = (event: MessageEvent) => {
      if (typeof event.data === 'string' && event.data.trim() === expected) {
        cleanup();
        resolve();
      }
    };
    // The worker script failing to load (blocked, 404, unsupported) fires "error": give up right away.
    const onError = () => {
      cleanup();
      reject(new Error('Engine worker failed to load'));
    };
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error(`Engine did not answer "${expected}"`));
    }, timeoutMs);
    const cleanup = () => {
      clearTimeout(timer);
      worker.removeEventListener('message', onMessage);
      worker.removeEventListener('error', onError);
    };
    worker.addEventListener('message', onMessage);
    worker.addEventListener('error', onError);
  });
}

function searchOne(worker: EngineWorkerLike, fen: string, limits: SearchLimits, timeoutMs: number): Promise<BrowserPosition> {
  return new Promise((resolve, reject) => {
    const byPv = new Map<number, ParsedInfo>();
    const onMessage = (event: MessageEvent) => {
      const line = typeof event.data === 'string' ? event.data : '';
      if (!line) return;
      if (line.startsWith('info ')) {
        const info = parseInfoLine(line);
        if (info) {
          const prev = byPv.get(info.multipv);
          if (!prev || info.depth >= prev.depth) byPv.set(info.multipv, info);
        }
      } else if (line.startsWith('bestmove')) {
        cleanup();
        const lines = [...byPv.values()]
          .sort((a, b) => a.multipv - b.multipv)
          .map((i) => ({ pv: i.pv, cp: i.cp, mate: i.mate, depth: i.depth }));
        resolve({ lines });
      }
    };
    const onError = () => {
      cleanup();
      reject(new Error('Engine worker crashed'));
    };
    const timer = setTimeout(() => {
      cleanup();
      worker.postMessage('stop');
      reject(new Error('Engine search timed out'));
    }, timeoutMs);
    const cleanup = () => {
      clearTimeout(timer);
      worker.removeEventListener('message', onMessage);
      worker.removeEventListener('error', onError);
    };
    worker.addEventListener('message', onMessage);
    worker.addEventListener('error', onError);
    worker.postMessage(`position fen ${fen}`);
    worker.postMessage(`go depth ${limits.depth} movetime ${limits.movetimeMs}`);
  });
}

async function startEngine(worker: EngineWorkerLike, multipv: number): Promise<void> {
  const uciok = waitFor(worker, 'uciok', 20000);
  worker.postMessage('uci');
  await uciok;
  worker.postMessage('setoption name Hash value 16');
  worker.postMessage(`setoption name MultiPV value ${multipv}`);
  const ready = waitFor(worker, 'readyok', 20000);
  worker.postMessage('isready');
  await ready;
}

/**
 * Searches every FEN and returns one entry per FEN, in order. Several engines share the work: each takes the next
 * block of consecutive positions (neighbouring positions reuse each other's search in the hash).
 * Checkmate/stalemate positions come back with no lines, which the backend recognises on its own.
 * Throws if an engine cannot start or hangs, so the caller can fall back to the server.
 */
export async function searchPositions(fens: string[], limits: SearchLimits, opts: SearchOptions = {}): Promise<BrowserPosition[]> {
  const grace = opts.graceMs ?? 15000;
  const make = opts.createWorker ?? defaultWorker;
  const count = Math.max(1, Math.min(opts.workers ?? (opts.createWorker ? 1 : enginePoolSize()), fens.length || 1));
  const BLOCK = 4;
  const out: BrowserPosition[] = new Array(fens.length);
  let next = 0;
  let done = 0;
  let failed: unknown = null;
  const workers: EngineWorkerLike[] = [];
  // engines allowed to keep working; drops by one (never below 1) whenever the page starts to stutter
  let allowed = count;

  const runOne = async (worker: EngineWorkerLike, index: number) => {
    await startEngine(worker, limits.multipv);
    while (next < fens.length && !failed) {
      if (index >= allowed) return; // the page is struggling: this engine stands down, the others finish the work
      // claim a block; `to` is this engine's own end (the shared `next` moves on as other engines claim theirs)
      const from = next;
      const to = Math.min(fens.length, from + BLOCK);
      next = to;
      for (let i = from; i < to && !failed; i++) {
        if (opts.isCancelled?.()) throw new Error('cancelled');
        out[i] = await searchOne(worker, fens[i], limits, limits.movetimeMs + grace);
        done++;
        opts.onProgress?.(Math.round((done / fens.length) * 100));
        await new Promise((r) => setTimeout(r, 0)); // let the page draw between positions
      }
    }
  };

  let stopWatching = () => {};
  try {
    for (let k = 0; k < count; k++) workers.push(make());
    if (count > 1) {
      const monitor = opts.frameMonitor ?? (opts.createWorker ? undefined : watchFrameRate);
      stopWatching = monitor?.(() => {
        if (allowed > 1) allowed--;
      }) ?? (() => {});
    }
    await Promise.all(
      workers.map((w, k) =>
        runOne(w, k).catch((err) => {
          failed = failed ?? err;
          throw err;
        }),
      ),
    );
    return out;
  } finally {
    stopWatching();
    for (const w of workers) {
      try {
        w.postMessage('quit');
      } catch {
        // ignore
      }
      w.terminate();
    }
  }
}
