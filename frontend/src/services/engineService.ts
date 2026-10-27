import { Chess, Square } from 'chess.js';
import { stockfishPlay } from './stockfishPlayService';

export interface EngineSearchOptions {
  levelRating: number;
  timeDelayMin?: number;
  timeDelayMax?: number;
}

export interface EngineSearchResult {
  move: {
    from: string;
    to: string;
    promotion?: string;
    san: string;
    captured?: string;
    isCheck?: boolean;
    isCastle?: boolean;
  };
  evalScore: number; // in pawns from current side's perspective
  depth: number;
  isNotable: boolean;
  notableReason?: 'capture' | 'check' | 'castle' | 'development' | 'eval_swing';
}

// Piece values in centipawns
const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Simplified piece-square tables (white perspective, rank 8 to rank 1)
const PST_PAWN = [
  0,  0,  0,  0,  0,  0,  0,  0,
 50, 50, 50, 50, 50, 50, 50, 50,
 10, 10, 20, 30, 30, 20, 10, 10,
  5,  5, 10, 25, 25, 10,  5,  5,
  0,  0,  0, 20, 20,  0,  0,  0,
  5, -5,-10,  0,  0,-10, -5,  5,
  5, 10, 10,-20,-20, 10, 10,  5,
  0,  0,  0,  0,  0,  0,  0,  0
];

const PST_KNIGHT = [
 -50,-40,-30,-30,-30,-30,-40,-50,
 -40,-20,  0,  0,  0,  0,-20,-40,
 -30,  0, 10, 15, 15, 10,  0,-30,
 -30,  5, 15, 20, 20, 15,  5,-30,
 -30,  0, 15, 20, 20, 15,  0,-30,
 -30,  5, 10, 15, 15, 10,  5,-30,
 -40,-20,  0,  5,  5,  0,-20,-40,
 -50,-40,-30,-30,-30,-30,-40,-50,
];

const PST_BISHOP = [
 -20,-10,-10,-10,-10,-10,-10,-20,
 -10,  0,  0,  0,  0,  0,  0,-10,
 -10,  0,  5, 10, 10,  5,  0,-10,
 -10,  5,  5, 10, 10,  5,  5,-10,
 -10,  0, 10, 10, 10, 10,  0,-10,
 -10, 10, 10, 10, 10, 10, 10,-10,
 -10,  5,  0,  0,  0,  0,  5,-10,
 -20,-10,-10,-10,-10,-10,-10,-20,
];

const PST_ROOK = [
   0,  0,  0,  0,  0,  0,  0,  0,
   5, 10, 10, 10, 10, 10, 10,  5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
   0,  0,  0,  5,  5,  0,  0,  0
];

const PST_QUEEN = [
 -20,-10,-10, -5, -5,-10,-10,-20,
 -10,  0,  0,  0,  0,  0,  0,-10,
 -10,  0,  5,  5,  5,  5,  0,-10,
  -5,  0,  5,  5,  5,  5,  0, -5,
   0,  0,  5,  5,  5,  5,  0, -5,
 -10,  5,  5,  5,  5,  5,  0,-10,
 -10,  0,  5,  0,  0,  0,  0,-10,
 -20,-10,-10, -5, -5,-10,-10,-20
];

const PST_KING = [
 -30,-40,-40,-50,-50,-40,-40,-30,
 -30,-40,-40,-50,-50,-40,-40,-30,
 -30,-40,-40,-50,-50,-40,-40,-30,
 -30,-40,-40,-50,-50,-40,-40,-30,
 -20,-30,-30,-40,-40,-30,-30,-20,
 -10,-20,-20,-20,-20,-20,-20,-10,
  20, 20,  0,  0,  0,  0, 20, 20,
  20, 30, 10,  0,  0, 10, 30, 20
];

export class EngineService {
  /**
   * Evaluates the current board state in centipawns from the perspective of the side to move.
   */
  public static evaluatePosition(chess: Chess): number {
    const board = chess.board();
    let score = 0;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (!piece) continue;

        const val = PIECE_VALUES[piece.type] || 0;
        const squareIdx = r * 8 + c;
        const flippedIdx = (7 - r) * 8 + c;

        let pstVal = 0;
        if (piece.type === 'p') pstVal = piece.color === 'w' ? PST_PAWN[squareIdx] : PST_PAWN[flippedIdx];
        else if (piece.type === 'n') pstVal = piece.color === 'w' ? PST_KNIGHT[squareIdx] : PST_KNIGHT[flippedIdx];
        else if (piece.type === 'b') pstVal = piece.color === 'w' ? PST_BISHOP[squareIdx] : PST_BISHOP[flippedIdx];
        else if (piece.type === 'r') pstVal = piece.color === 'w' ? PST_ROOK[squareIdx] : PST_ROOK[flippedIdx];
        else if (piece.type === 'q') pstVal = piece.color === 'w' ? PST_QUEEN[squareIdx] : PST_QUEEN[flippedIdx];
        else if (piece.type === 'k') pstVal = piece.color === 'w' ? PST_KING[squareIdx] : PST_KING[flippedIdx];

        const totalVal = val + pstVal;
        score += piece.color === 'w' ? totalVal : -totalVal;
      }
    }

    // Return relative to current player to move
    return chess.turn() === 'w' ? score : -score;
  }

  /**
   * Sorts legal moves with heuristic move ordering (captures MVV-LVA, checks, promotions).
   */
  private static orderMoves(chess: Chess, moves: Array<{ from: string; to: string; promotion?: string; captured?: string }>) {
    return moves.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // 1. Captures MVV-LVA
      if (a.captured) {
        const victimVal = PIECE_VALUES[a.captured] || 100;
        const attackerPiece = chess.get(a.from as Square);
        const attackerVal = attackerPiece ? PIECE_VALUES[attackerPiece.type] || 100 : 100;
        scoreA += victimVal * 10 - attackerVal;
      }
      if (b.captured) {
        const victimVal = PIECE_VALUES[b.captured] || 100;
        const attackerPiece = chess.get(b.from as Square);
        const attackerVal = attackerPiece ? PIECE_VALUES[attackerPiece.type] || 100 : 100;
        scoreB += victimVal * 10 - attackerVal;
      }

      // 2. Promotions
      if (a.promotion === 'q') scoreA += 800;
      if (b.promotion === 'q') scoreB += 800;

      return scoreB - scoreA;
    });
  }

  /**
   * Negamax search with Alpha-Beta pruning.
   */
  private static negamax(chess: Chess, depth: number, alpha: number, beta: number): number {
    if (depth === 0 || chess.isGameOver()) {
      return this.evaluatePosition(chess);
    }

    const legalMoves = chess.moves({ verbose: true });
    this.orderMoves(chess, legalMoves);

    let maxEval = -Infinity;
    for (const move of legalMoves) {
      chess.move(move);
      const evalScore = -this.negamax(chess, depth - 1, -beta, -alpha);
      chess.undo();

      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (alpha >= beta) break; // Cutoff
    }
    return maxEval;
  }

  /**
   * Computes the best move for the current position using strength-level settings.
   */
  public static async searchBestMove(
    fen: string,
    options: EngineSearchOptions
  ): Promise<EngineSearchResult | null> {
    const chess = new Chess(fen);
    const legalMoves = chess.moves({ verbose: true });
    if (legalMoves.length === 0) return null;

    // Strength mapping
    let depth = 2;
    let blunderChance = 0.25;
    let topN = 4;

    if (options.levelRating <= 800) {
      depth = 2;
      blunderChance = 0.25;
      topN = 4;
    } else if (options.levelRating <= 1200) {
      depth = 2;
      blunderChance = 0.10;
      topN = 2;
    } else {
      depth = 3;
      blunderChance = 0.0;
      topN = 1;
    }

    const startTime = performance.now();
    this.orderMoves(chess, legalMoves);

    // Score top-level moves with alpha-beta
    const scoredMoves: Array<{
      move: (typeof legalMoves)[0];
      score: number;
    }> = [];

    for (const move of legalMoves) {
      chess.move(move);
      const score = -this.negamax(chess, depth - 1, -Infinity, Infinity);
      chess.undo();
      scoredMoves.push({ move, score });
    }

    // Sort scored moves (higher score is better for side to move)
    scoredMoves.sort((a, b) => b.score - a.score);

    // Prefer real Stockfish (strength-limited to the level); the light engine is the fallback.
    let selectedMove = scoredMoves[0];
    let usedStockfish = false;
    const uci = await stockfishPlay.bestMove(fen, options.levelRating);
    if (uci) {
      const hit = scoredMoves.find(
        (m) => m.move.from + m.move.to + (m.move.promotion ?? '') === uci,
      );
      if (hit) {
        selectedMove = hit;
        usedStockfish = true;
      }
    }

    // Choose move based on blunder chance (light engine only)
    if (!usedStockfish && blunderChance > 0 && scoredMoves.length > 1 && Math.random() < blunderChance) {
      const candidates = scoredMoves.slice(0, Math.min(scoredMoves.length, topN));
      selectedMove = candidates[Math.floor(Math.random() * candidates.length)];
    }

    // Varied human-like think delay (400ms to 750ms total)
    const computeTime = performance.now() - startTime;
    const minDelay = options.timeDelayMin ?? 400;
    const maxDelay = options.timeDelayMax ?? 750;
    const targetDelay = Math.floor(minDelay + Math.random() * (maxDelay - minDelay));
    const remainingDelay = Math.max(30, targetDelay - computeTime);
    await new Promise((r) => setTimeout(r, remainingDelay));

    // Classify if move is notable (capture, check, castling, major development)
    const mv = selectedMove.move;
    let isNotable = false;
    let notableReason: EngineSearchResult['notableReason'];

    if (mv.captured) {
      isNotable = true;
      notableReason = 'capture';
    } else if (mv.san.includes('+') || mv.san.includes('#')) {
      isNotable = true;
      notableReason = 'check';
    } else if (mv.san.includes('O-O')) {
      isNotable = true;
      notableReason = 'castle';
    } else if (['N', 'B'].includes(mv.piece.toUpperCase()) && ['1', '8'].includes(mv.from[1])) {
      isNotable = true;
      notableReason = 'development';
    }

    const evalInPawns = Number((selectedMove.score / 100).toFixed(1));

    return {
      move: {
        from: mv.from,
        to: mv.to,
        promotion: mv.promotion,
        san: mv.san,
        captured: mv.captured,
        isCheck: mv.san.includes('+') || mv.san.includes('#'),
        isCastle: mv.san.includes('O-O'),
      },
      evalScore: evalInPawns,
      depth,
      isNotable,
      notableReason,
    };
  }
}
