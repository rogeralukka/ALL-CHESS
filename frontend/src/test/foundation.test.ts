import { describe, it, expect } from 'vitest';
import { Chess } from 'chess.js';
import { MOCK_GAMES } from '@/data/mock/mockGames';
import { CLASSIFICATION_META } from '@/components/ClassificationBadge';
import { winPct, evalToWinPct } from '@/lib/winPct';
import { EXPRESSION_MAP, getExpressionForEvent, CoachEvent } from '@/features/coach/expressionMap';
import { MoveClassification } from '@/data/types';
import { BOARD_THEMES } from '@/data/boardThemes';

describe('ALL-CHESS Step 1A: Foundation Suite', () => {
  it('validates that every single mock PGN has 100% legal moves', () => {
    expect(MOCK_GAMES.length).toBeGreaterThanOrEqual(12);

    for (const game of MOCK_GAMES) {
      const chess = new Chess();
      expect(() => {
        chess.loadPgn(game.pgn);
      }).not.toThrow();

      const history = chess.history();
      expect(history.length).toBeGreaterThan(0);
      expect(game.moves.length).toBe(history.length);

      // Verify move integrity
      for (const move of game.moves) {
        expect(move.from).toMatch(/^[a-h][1-8]$/);
        expect(move.to).toMatch(/^[a-h][1-8]$/);
        expect(move.fen).toBeTruthy();
      }
    }
  });

  it('validates that all 10 move classifications are properly defined with colors and glyphs', () => {
    const requiredLabels: MoveClassification[] = [
      'brilliant',
      'great',
      'book',
      'best',
      'excellent',
      'good',
      'inaccuracy',
      'mistake',
      'miss',
      'blunder',
    ];

    for (const label of requiredLabels) {
      const meta = CLASSIFICATION_META[label];
      expect(meta).toBeDefined();
      expect(meta.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(meta.label).toBeTruthy();
      expect(meta.name).toBeTruthy();
    }
  });

  it('validates winPct formula accurately computes winning probabilities', () => {
    // 0 cp should yield 50%
    expect(winPct(0)).toBe(50);
    // positive cp yields > 50%
    expect(winPct(100)).toBeGreaterThan(50);
    expect(winPct(300)).toBeGreaterThan(70);
    expect(winPct(500)).toBeGreaterThan(85);
    // negative cp yields < 50%
    expect(winPct(-100)).toBeLessThan(50);
    // check extreme bounds clamp cleanly between 0 and 100
    expect(winPct(5000)).toBe(100);
    expect(winPct(-5000)).toBe(0);

    // check mate evaluations
    expect(evalToWinPct(0, 1)).toBe(100);
    expect(evalToWinPct(0, -1)).toBe(0);
  });

  it('validates expressionMap covers all 10 classification labels and all coach events', () => {
    const requiredEvents: CoachEvent[] = [
      'brilliant',
      'great',
      'book',
      'best',
      'excellent',
      'good',
      'inaccuracy',
      'mistake',
      'miss',
      'blunder',
      'explain',
      'analysing',
      'loading',
      'greeting',
      'resume',
      'welcome_back',
      'win',
      'puzzle_solved',
      'level_up',
      'loss',
      'draw',
      'idle',
    ];

    const validExpressions = ['neutral', 'thinking', 'thumbsup', 'brilliant', 'embarrassed', 'wave'];

    for (const ev of requiredEvents) {
      const exp = getExpressionForEvent(ev);
      expect(validExpressions).toContain(exp);
      expect(EXPRESSION_MAP[ev]).toBeDefined();
    }
  });

  it('validates board themes are properly configured', () => {
    expect(BOARD_THEMES.length).toBe(8);
    for (const bt of BOARD_THEMES) {
      expect(bt.id).toBeTruthy();
      expect(bt.name).toBeTruthy();
      expect(bt.light).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(bt.dark).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });
});
