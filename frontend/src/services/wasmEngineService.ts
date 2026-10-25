import { Chess } from 'chess.js';
import { TopEngineLine } from '../data/types';

interface InternalLineData {
  multipv: number;
  evalPawns: number;
  mate?: number;
  depth: number;
  uciMoves: string[];
}

function generateWhy(_chess: Chess, sanMove: string): string {
  if (sanMove.includes('x')) {
    return 'Captures opponent piece to win material and relieve tactical pressure.';
  }
  if (sanMove.includes('+')) {
    return 'Delivers check to disrupt opponent coordination and limit king mobility.';
  }
  if (sanMove.includes('#')) {
    return 'Delivers checkmate, terminating the game.';
  }
  if (sanMove === 'O-O' || sanMove === 'O-O-O') {
    return 'Castles to secure king safety and activate the rook onto an active file.';
  }
  if (['e4', 'd4', 'e5', 'd5', 'c4', 'c5'].includes(sanMove)) {
    return `Stakes a firm claim on central square ${sanMove} and opens piece avenues.`;
  }
  if (sanMove.startsWith('N') || sanMove.startsWith('B')) {
    return `Develops minor piece ${sanMove} to contest key squares.`;
  }
  return `Solid positional move ${sanMove} reinforcing control and piece coordination.`;
}

class WasmEngineService {
  private worker: Worker | null = null;
  private workerFailed = false;
  private isBusy = false;
  private pendingQueue: Array<() => void> = [];

  private initWorker(): boolean {
    if (this.workerFailed) return false;
    if (this.worker) return true;
    if (typeof window === 'undefined' || typeof Worker === 'undefined') {
      this.workerFailed = true;
      return false;
    }

    try {
      // Load single-threaded Stockfish 19 lite WASM worker from public/stockfish
      const workerUrl = new URL('/stockfish/stockfish-19-lite-single.js', window.location.origin).href;
      const w = new Worker(workerUrl);
      w.onerror = (e) => {
        console.warn('Stockfish WASM worker error, falling back to server API:', e);
        this.workerFailed = true;
        this.worker = null;
      };
      w.postMessage('uci');
      w.postMessage('isready');
      this.worker = w;
      return true;
    } catch (e) {
      console.warn('Could not initialize Stockfish WASM worker, falling back to server API:', e);
      this.workerFailed = true;
      this.worker = null;
      return false;
    }
  }

  private async acquireLock(): Promise<void> {
    if (!this.isBusy) {
      this.isBusy = true;
      return;
    }
    await new Promise<void>((resolve) => {
      this.pendingQueue.push(resolve);
    });
    this.isBusy = true;
  }

  private releaseLock(): void {
    if (this.pendingQueue.length > 0) {
      const next = this.pendingQueue.shift();
      if (next) next();
    } else {
      this.isBusy = false;
    }
  }

  private async searchWithWorker(
    fen: string,
    depth = 14,
    multipv = 3,
    timeoutMs = 6000
  ): Promise<TopEngineLine[]> {
    await this.acquireLock();
    try {
      if (!this.initWorker() || !this.worker) {
        throw new Error('Worker unavailable');
      }

      const w = this.worker;
      const isBlack = fen.split(' ')[1] === 'b';
      const linesMap = new Map<number, InternalLineData>();

      return await new Promise<TopEngineLine[]>((resolve, reject) => {
        const timer = setTimeout(() => {
          cleanup();
          reject(new Error('WASM engine search timed out'));
        }, timeoutMs);

        const onMessage = (event: MessageEvent) => {
          const line = typeof event.data === 'string' ? event.data : '';
          if (!line) return;

          // Match info lines: e.g. "info depth 14 ... multipv 1 score cp 35 ... pv e2e4 e7e5"
          if (line.startsWith('info') && line.includes('pv')) {
            const depthMatch = line.match(/\bdepth\s+(\d+)/);
            const mpvMatch = line.match(/\bmultipv\s+(\d+)/);
            const scoreCpMatch = line.match(/\bscore\s+cp\s+(-?\d+)/);
            const scoreMateMatch = line.match(/\bscore\s+mate\s+(-?\d+)/);
            const pvMatch = line.match(/\bpv\s+(.+)$/);

            const mpv = mpvMatch ? parseInt(mpvMatch[1], 10) : 1;
            const currentDepth = depthMatch ? parseInt(depthMatch[1], 10) : depth;

            let evalPawns = 0.0;
            let mateVal: number | undefined;

            if (scoreMateMatch) {
              const m = parseInt(scoreMateMatch[1], 10);
              mateVal = isBlack ? -m : m;
              evalPawns = mateVal > 0 ? 99.0 : -99.0;
            } else if (scoreCpMatch) {
              const cp = parseInt(scoreCpMatch[1], 10);
              evalPawns = Number((((isBlack ? -cp : cp) / 100)).toFixed(2));
            }

            if (pvMatch) {
              const uciMoves = pvMatch[1].trim().split(/\s+/);
              linesMap.set(mpv, {
                multipv: mpv,
                evalPawns,
                mate: mateVal,
                depth: currentDepth,
                uciMoves,
              });
            }
          } else if (line.startsWith('bestmove')) {
            cleanup();

            // Convert gathered lines to TopEngineLine with SAN notation
            const resultLines: TopEngineLine[] = [];
            const sortedKeys = Array.from(linesMap.keys()).sort((a, b) => a - b);

            for (const key of sortedKeys.slice(0, multipv)) {
              const item = linesMap.get(key);
              if (!item || !item.uciMoves.length) continue;

              const tempChess = new Chess(fen);
              const pvSans: string[] = [];

              for (const uciMove of item.uciMoves.slice(0, 8)) {
                const from = uciMove.slice(0, 2);
                const to = uciMove.slice(2, 4);
                const promotion = uciMove.length > 4 ? uciMove[4] : undefined;
                try {
                  const mRes = tempChess.move({ from, to, promotion });
                  if (mRes) {
                    pvSans.push(mRes.san);
                  } else {
                    break;
                  }
                } catch {
                  break;
                }
              }

              const firstMoveSan = pvSans[0] || item.uciMoves[0];
              const whyText = generateWhy(new Chess(fen), firstMoveSan);

              resultLines.push({
                move: firstMoveSan,
                eval: item.evalPawns,
                mate: item.mate,
                depth: item.depth,
                why: whyText,
                pv: pvSans,
              });
            }

            resolve(resultLines);
          }
        };

        const cleanup = () => {
          clearTimeout(timer);
          w.removeEventListener('message', onMessage);
        };

        w.addEventListener('message', onMessage);
        w.postMessage(`position fen ${fen}`);
        w.postMessage(`setoption name MultiPV value ${multipv}`);
        w.postMessage(`go depth ${depth}`);
      });
    } finally {
      this.releaseLock();
    }
  }

  private async searchWithServerApi(
    fen: string,
    depth = 14,
    multipv = 3
  ): Promise<TopEngineLine[]> {
    const res = await fetch('/api/v1/engine/position', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fen, depth, multipv }),
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error(`Server engine position API error: ${res.statusText}`);
    }

    const data: TopEngineLine[] = await res.json();
    return data;
  }

  public async getTopLines(
    fen: string,
    depth = 14,
    multipv = 3
  ): Promise<TopEngineLine[]> {
    // 1. Try browser Stockfish WASM worker
    if (this.initWorker()) {
      try {
        const lines = await this.searchWithWorker(fen, depth, multipv);
        if (lines && lines.length > 0) {
          return lines;
        }
      } catch (err) {
        console.warn('WASM engine search failed or timed out; falling back to API:', err);
      }
    }

    // 2. Fall back to backend POST /api/v1/engine/position
    try {
      return await this.searchWithServerApi(fen, depth, multipv);
    } catch (apiErr) {
      console.warn('Backend engine position API failed; falling back to heuristic line:', apiErr);
    }

    // 3. Graceful offline fallback using chess.js legal moves
    try {
      const chess = new Chess(fen);
      const moves = chess.moves({ verbose: true });
      if (moves.length === 0) return [];

      const topMove = moves[0];
      const whyDesc = generateWhy(chess, topMove.san);
      return [
        {
          move: topMove.san,
          eval: 0.0,
          depth,
          why: whyDesc,
          pv: [topMove.san],
        },
      ];
    } catch {
      return [];
    }
  }

  public async getBestMove(
    fen: string,
    depth = 14
  ): Promise<{ move: string; eval: number; why: string }> {
    const lines = await this.getTopLines(fen, depth, 1);
    if (lines && lines.length > 0) {
      return {
        move: lines[0].move,
        eval: lines[0].eval,
        why: lines[0].why || 'Best tactical move determined by engine.',
      };
    }
    return {
      move: 'e4',
      eval: 0.2,
      why: 'Controls central squares and allows natural piece development.',
    };
  }
}

export const wasmEngineService = new WasmEngineService();
