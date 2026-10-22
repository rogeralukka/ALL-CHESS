import { describe, it, expect } from 'vitest';
import { Chess } from 'chess.js';
import { puzzleRepository, learnRepository } from '@/data/repositories';
import { MOCK_PUZZLES } from '@/data/mock/mockPuzzles';
import { MOCK_LEARN_STAGES } from '@/data/mock/mockLearn';

describe('ALL-CHESS Step 1C: Play, Learn, Puzzles Suite', () => {
  describe('Puzzles Module', () => {
    it('loads all curated mock puzzles with valid FEN and solutions', async () => {
      const puzzles = await puzzleRepository.getPuzzles();
      expect(puzzles.length).toBe(42);

      // Verify each puzzle has a valid FEN parseable by chess.js
      for (const p of puzzles) {
        expect(() => new Chess(p.fen)).not.toThrow();
        expect(p.solution.length).toBeGreaterThan(0);
        expect(p.rating).toBeGreaterThan(0);
        expect(p.goal.length).toBeGreaterThan(0);
      }
    });

    it('guarantees first puzzle is back-rank mate-in-1', async () => {
      const first = await puzzleRepository.getPuzzleById('puz-01');
      expect(first).toBeDefined();
      expect(first?.solution[0]).toBe('Rd8#');
      expect(first?.theme).toContain('backRank');
      expect(first?.theme).toContain('mateIn1');

      // Test move legality of first puzzle
      const chess = new Chess(first!.fen);
      const move = chess.move(first!.solution[0]);
      expect(move).toBeDefined();
      expect(chess.isCheckmate()).toBe(true);
    });

    it('provides daily puzzle correctly', async () => {
      const daily = await puzzleRepository.getDailyPuzzle();
      expect(daily).toBeDefined();
      expect(daily.id).toBe(MOCK_PUZZLES[0].id);
    });
  });

  describe('Learn Roadmap Module', () => {
    it('contains 8 endgame stages matching the mockup roadmap', async () => {
      const endgameStages = await learnRepository.getStages('endgame');
      expect(endgameStages.length).toBe(8);

      // Verify progression statuses
      expect(endgameStages[0].status).toBe('done');
      expect(endgameStages[1].status).toBe('current');
      expect(endgameStages[2].status).toBe('locked');

      // Check stage XP and steps
      for (const stage of endgameStages) {
        expect(stage.xp).toBeGreaterThan(0);
        expect(stage.steps.length).toBeGreaterThan(0);
      }
    });

    it('validates lesson step FENs and required moves in interactive lessons', () => {
      for (const stage of MOCK_LEARN_STAGES) {
        for (const step of stage.steps) {
          if (step.fen) {
            const chess = new Chess(step.fen);
            if (step.isInteractive && step.requiredMove) {
              const move = chess.move(step.requiredMove);
              expect(move).toBeDefined();
            }
          }
        }
      }
    });

    it('loads openings and middlegame categories', async () => {
      const openings = await learnRepository.getStages('openings');
      expect(openings.length).toBeGreaterThan(0);

      const middlegame = await learnRepository.getStages('middlegame');
      expect(middlegame.length).toBeGreaterThan(0);
    });
  });
});
