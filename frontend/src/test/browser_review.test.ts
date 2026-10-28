import { describe, it, expect } from 'vitest';
import { parseInfoLine, searchPositions, BROWSER_LIMITS, EngineWorkerLike } from '@/services/browserReviewService';

describe('parseInfoLine', () => {
  it('reads depth, multipv, centipawn score and the pv', () => {
    const p = parseInfoLine('info depth 14 seldepth 20 multipv 2 score cp -35 nodes 1000 nps 5000 time 200 pv e7e5 g1f3 b8c6');
    expect(p).toEqual({ multipv: 2, depth: 14, cp: -35, mate: null, pv: ['e7e5', 'g1f3', 'b8c6'] });
  });
  it('reads mate scores', () => {
    expect(parseInfoLine('info depth 9 multipv 1 score mate 3 pv d1h5 g8f6')).toMatchObject({ mate: 3, cp: null });
  });
  it('ignores bound scores, info strings and lines without a pv', () => {
    expect(parseInfoLine('info depth 10 multipv 1 score cp 20 lowerbound pv e2e4')).toBeNull();
    expect(parseInfoLine('info string NNUE evaluation using nn.nnue')).toBeNull();
    expect(parseInfoLine('info depth 0 score mate 0')).toBeNull();
    expect(parseInfoLine('bestmove e2e4')).toBeNull();
  });
});

/** A fake Stockfish: answers the UCI handshake and replies to every "go" with canned lines. */
function fakeWorker(script: (fen: string) => string[], opts: { hang?: boolean } = {}) {
  const listeners = new Set<(e: MessageEvent) => void>();
  let fen = '';
  const sent: string[] = [];
  let terminated = false;
  const errorListeners = new Set<(e: MessageEvent) => void>();
  const emit = (data: string) => listeners.forEach((l) => l({ data } as MessageEvent));
  const worker: EngineWorkerLike = {
    postMessage(msg: string) {
      sent.push(msg);
      if (msg === 'uci') queueMicrotask(() => emit('uciok'));
      else if (msg === 'isready') queueMicrotask(() => emit('readyok'));
      else if (msg.startsWith('position fen ')) fen = msg.slice('position fen '.length);
      else if (msg.startsWith('go ') && !opts.hang) queueMicrotask(() => [...script(fen), 'bestmove e2e4'].forEach(emit));
    },
    addEventListener: (t, l) => void (t === 'error' ? errorListeners : listeners).add(l),
    removeEventListener: (t, l) => void (t === 'error' ? errorListeners : listeners).delete(l),
    terminate: () => {
      terminated = true;
    },
  };
  return { worker, sent, isTerminated: () => terminated, fail: () => errorListeners.forEach((l) => l({} as MessageEvent)) };
}

describe('searchPositions', () => {
  const lines = () => [
    'info depth 8 multipv 1 score cp 10 pv e2e4',
    'info depth 12 multipv 1 score cp 25 pv e2e4 e7e5',
    'info depth 12 multipv 2 score cp 5 pv d2d4',
    'info depth 11 multipv 3 score cp 0 lowerbound pv c2c4',
  ];

  it('returns the deepest line per multipv for every position and reports progress', async () => {
    const f = fakeWorker(() => lines());
    const progress: number[] = [];
    const out = await searchPositions(['fen-a', 'fen-b'], BROWSER_LIMITS.standard, { createWorker: () => f.worker, onProgress: (p) => progress.push(p) });
    expect(out).toHaveLength(2);
    expect(out[0].lines).toEqual([
      { pv: ['e2e4', 'e7e5'], cp: 25, mate: null, depth: 12 },
      { pv: ['d2d4'], cp: 5, mate: null, depth: 12 },
    ]);
    expect(progress).toEqual([50, 100]);
    expect(f.sent).toContain('go depth 18 movetime 350');
    expect(f.sent).toContain('setoption name MultiPV value 3');
    expect(f.isTerminated()).toBe(true);
  });

  it('returns no lines for a finished game position', async () => {
    const f = fakeWorker(() => ['info depth 0 score mate 0']);
    const out = await searchPositions(['mated'], BROWSER_LIMITS.standard, { createWorker: () => f.worker });
    expect(out[0].lines).toEqual([]);
  });

  it('rejects and cleans up when the engine hangs, so the caller can fall back to the server', async () => {
    const f = fakeWorker(() => [], { hang: true });
    await expect(searchPositions(['x'], { depth: 1, movetimeMs: 1, multipv: 1 }, { createWorker: () => f.worker, graceMs: 20 })).rejects.toThrow(/timed out/);
    expect(f.isTerminated()).toBe(true);
  });

  it('gives up immediately when the engine script fails to load', async () => {
    const f = fakeWorker(() => []);
    f.worker.postMessage = () => queueMicrotask(f.fail); // never answers, just errors
    await expect(searchPositions(['a'], BROWSER_LIMITS.standard, { createWorker: () => f.worker })).rejects.toThrow(/failed to load/);
    expect(f.isTerminated()).toBe(true);
  });

  it('stops when cancelled', async () => {
    const f = fakeWorker(() => lines());
    await expect(searchPositions(['a', 'b'], BROWSER_LIMITS.standard, { createWorker: () => f.worker, isCancelled: () => true })).rejects.toThrow(/cancelled/);
    expect(f.isTerminated()).toBe(true);
  });

  it('fails clearly when Workers are unavailable', async () => {
    await expect(searchPositions(['a'], BROWSER_LIMITS.standard, { createWorker: () => { throw new Error('no worker'); } })).rejects.toThrow('no worker');
  });
});
