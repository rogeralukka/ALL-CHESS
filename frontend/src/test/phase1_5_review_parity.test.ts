import { describe, it, expect } from 'vitest';
import { toFigurineSan } from '@/lib/formatters';
import { MOCK_GAMES } from '@/data/mock/mockGames';

describe('Phase 1.5 Section 5: Review Screen Parity', () => {
  it('formats figurine symbols correctly for standard chess moves', () => {
    expect(toFigurineSan('Bxf7+')).toBe('♝xf7+');
    expect(toFigurineSan('Nf3')).toBe('♞f3');
    expect(toFigurineSan('Rad1')).toBe('♜ad1');
    expect(toFigurineSan('Qh5')).toBe('♛h5');
    expect(toFigurineSan('Kxf7')).toBe('♚xf7');
    expect(toFigurineSan('e4')).toBe('e4');
  });

  it('guarantees game-01 move 6 (Bxf7+) has realistic eval in [-3.6, -3.0]', () => {
    const game01 = MOCK_GAMES.find((g) => g.id === 'game-01');
    expect(game01).toBeDefined();

    const move6 = game01?.moves[10]; // 6. Bxf7+
    expect(move6?.san).toBe('Bxf7+');
    expect(move6?.classification).toBe('blunder');
    expect(move6?.eval?.eval).toBe(-3.54);
    expect(move6?.eval?.eval).toBeLessThanOrEqual(-3.0);
    expect(move6?.eval?.eval).toBeGreaterThanOrEqual(-3.6);
  });

  it('formats evaluation numbers as absolute values without sign on leading side', () => {
    const evalScore = -3.54;
    const absText = Math.abs(evalScore).toFixed(1);
    expect(absText).toBe('3.5');
  });

  it('identifies biggest swing move correctly in game-01 as move 6 (Bxf7+)', () => {
    const game01 = MOCK_GAMES.find((g) => g.id === 'game-01');
    expect(game01).toBeDefined();

    let biggestSwingMove = null;
    let maxSwing = 0;
    const moves = game01!.moves;

    const clamp = (val: number) => Math.min(6.0, Math.max(-6.0, val));
    for (let idx = 0; idx < moves.length; idx++) {
      const m = moves[idx];
      const prev = idx === 0 ? 0.2 : clamp(moves[idx - 1].eval?.eval ?? 0);
      const curr = clamp(m.eval?.eval ?? 0);
      const diff = Math.abs(curr - prev);
      if (diff > maxSwing) {
        maxSwing = diff;
        biggestSwingMove = m;
      }
    }

    expect(biggestSwingMove).toBeDefined();
    expect(biggestSwingMove?.moveNumber).toBe(6);
    expect(biggestSwingMove?.san).toBe('Bxf7+');
    expect(biggestSwingMove?.classification).toBe('blunder');
    expect(maxSwing).toBeGreaterThanOrEqual(3.5);
  });
});
