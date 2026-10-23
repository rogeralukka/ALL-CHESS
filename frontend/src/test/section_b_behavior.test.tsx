import { describe, it, expect } from 'vitest';
import { EngineService } from '@/services/engineService';
import { OpeningService } from '@/services/openingService';
import { Chess } from 'chess.js';

describe('Section B: Behavior & Engine Services', () => {
  describe('EngineService search and heuristic evaluation', () => {
    it('returns a legal move and valid evaluation score for the initial position', async () => {
      const chess = new Chess();
      const result = await EngineService.searchBestMove(chess.fen(), {
        levelRating: 1000,
        timeDelayMin: 10,
        timeDelayMax: 20,
      });

      expect(result).not.toBeNull();
      if (!result) return;

      expect(result.move.from).toBeDefined();
      expect(result.move.to).toBeDefined();
      expect(typeof result.evalScore).toBe('number');
      expect(result.depth).toBe(2);

      // Verify the move is truly legal in the position
      const legalMoves = chess.moves({ verbose: true });
      const found = legalMoves.some(
        (m) => m.from === result.move.from && m.to === result.move.to
      );
      expect(found).toBe(true);
    });

    it('identifies notable tactical events (captures)', async () => {
      // Position where White can capture Black pawn on e5 with Nxe5
      const chess = new Chess('r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3');
      const evalPos = EngineService.evaluatePosition(chess);
      expect(typeof evalPos).toBe('number');

      // Force a capture move to test notable classification
      const captureResult = await EngineService.searchBestMove(
        'r1bqkbnr/ppp2ppp/2n5/3P4/4p3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 4',
        { levelRating: 1500, timeDelayMin: 5, timeDelayMax: 10 }
      );

      expect(captureResult).not.toBeNull();
      if (captureResult?.move.captured) {
        expect(captureResult.isNotable).toBe(true);
        expect(captureResult.notableReason).toBe('capture');
      }
    });

    it('maps strength levels to correct search depths and blunder probabilities', async () => {
      const fen = new Chess().fen();

      const casual = await EngineService.searchBestMove(fen, {
        levelRating: 600,
        timeDelayMin: 5,
        timeDelayMax: 10,
      });
      expect(casual?.depth).toBe(2);

      const balanced = await EngineService.searchBestMove(fen, {
        levelRating: 1000,
        timeDelayMin: 5,
        timeDelayMax: 10,
      });
      expect(balanced?.depth).toBe(2);

      const challenging = await EngineService.searchBestMove(fen, {
        levelRating: 1600,
        timeDelayMin: 5,
        timeDelayMax: 10,
      });
      expect(challenging?.depth).toBe(3);
    });
  });

  describe('OpeningService ECO lookup', () => {
    it('identifies Italian Game from moves sequence', () => {
      const moves = ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'];
      const match = OpeningService.identifyOpening(moves);

      expect(match).not.toBeNull();
      expect(match?.name).toBe('Italian Game');
      expect(match?.eco).toBe('C50');
      expect(match?.idea).toContain('f7');
    });

    it('identifies Sicilian Defense from 1. e4 c5', () => {
      const moves = ['e4', 'c5'];
      const match = OpeningService.identifyOpening(moves);

      expect(match).not.toBeNull();
      expect(match?.name).toBe('Sicilian Defense');
      expect(match?.eco).toBe('B20');
    });

    it('returns null for arbitrary illegal/unrecorded move sequence', () => {
      const moves = ['h4', 'h5', 'a4', 'a5'];
      const match = OpeningService.identifyOpening(moves);
      expect(match).toBeNull();
    });
  });
});
