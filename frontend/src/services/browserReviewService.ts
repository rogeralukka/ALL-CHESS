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

/** Same depth/time budget per level as the backend's own engine uses. */
export const BROWSER_LIMITS: Record<AnalysisLevel['id'], SearchLimits> = {
  standard: { depth: 18, movetimeMs: 350, multipv: 3 },
  deep: { depth: 22, movetimeMs: 600, multipv: 3 },
  deeper: { depth: 26, movetimeMs: 1000, multipv: 3 },
  max: { depth: 32, movetimeMs: 2000, multipv: 3 },
};

export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

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

/**
 * Searches every FEN in order with a dedicated worker and returns one entry per FEN.
 * Checkmate/stalemate positions come back with no lines, which the backend recognises on its own.
 * Throws if the engine cannot start or hangs, so the caller can fall back to the server.
 */
export async function searchPositions(fens: string[], limits: SearchLimits, opts: SearchOptions = {}): Promise<BrowserPosition[]> {
  const worker = (opts.createWorker ?? defaultWorker)();
  const grace = opts.graceMs ?? 15000;
  try {
    const uciok = waitFor(worker, 'uciok', 20000);
    worker.postMessage('uci');
    await uciok;
    worker.postMessage('setoption name Hash value 16');
    worker.postMessage(`setoption name MultiPV value ${limits.multipv}`);
    const ready = waitFor(worker, 'readyok', 20000);
    worker.postMessage('isready');
    await ready;

    const out: BrowserPosition[] = [];
    for (let i = 0; i < fens.length; i++) {
      if (opts.isCancelled?.()) throw new Error('cancelled');
      out.push(await searchOne(worker, fens[i], limits, limits.movetimeMs + grace));
      opts.onProgress?.(Math.round(((i + 1) / fens.length) * 100));
    }
    return out;
  } finally {
    try {
      worker.postMessage('quit');
    } catch {
      // ignore
    }
    worker.terminate();
  }
}
