import { describe, it, expect } from 'vitest';
import { Chess } from 'chess.js';
import { isCorrectPuzzleMove } from '@/lib/puzzleCheck';
import { badgeBox } from '@/features/board/BadgeLayer';
import { MOCK_PUZZLES } from '@/data/mock/mockPuzzles';

describe('Puzzle answer check', () => {
  const p1 = MOCK_PUZZLES[0]; // back-rank mate in 1: Rd8#

  const play = (fen: string, from: string, to: string) => {
    const c = new Chess(fen);
    const m = c.move({ from, to });
    return { san: m.san, mate: c.isCheckmate() };
  };

  it('rejects a wrong move in a one-move puzzle (was accepted before)', () => {
    const { san, mate } = play(p1.fen, 'd1', 'd5');
    expect(isCorrectPuzzleMove(san, p1.solution[0], mate)).toBe(false);
  });

  it('accepts the solution move', () => {
    const { san, mate } = play(p1.fen, 'd1', 'd8');
    expect(isCorrectPuzzleMove(san, p1.solution[0], mate)).toBe(true);
  });

  it('accepts an alternative mate only when the solution is a mate', () => {
    expect(isCorrectPuzzleMove('Qh7#', 'Rd8#', true)).toBe(true);
    expect(isCorrectPuzzleMove('Qh7+', 'Nf7+', false)).toBe(false);
  });

  it('every one-move puzzle rejects every non-solution legal move that does not mate', () => {
    for (const pz of MOCK_PUZZLES.filter((x) => x.solution.length === 1)) {
      const c = new Chess(pz.fen);
      for (const m of c.moves({ verbose: true })) {
        const t = new Chess(pz.fen);
        t.move(m);
        const ok = isCorrectPuzzleMove(m.san, pz.solution[0], t.isCheckmate());
        if (m.san.replace(/[+#]/g, '') !== pz.solution[0].replace(/[+#]/g, '') && !t.isCheckmate()) {
          expect(ok).toBe(false);
        }
      }
    }
  });
});

describe('Board badge geometry (matches the reference measurement)', () => {
  it('is 0.40 of a square, centred 0.94 across and 0.06 down the destination square', () => {
    const sq = 12.5;
    const box = badgeBox('d5', 'white'); // col 3, row 3
    expect(box.size / sq).toBeCloseTo(0.4, 5);
    expect((box.left + box.size / 2) / sq - 3).toBeCloseTo(0.94, 5);
    expect((box.top + box.size / 2) / sq - 3).toBeCloseTo(0.06, 5);
  });

  it('flips with the board orientation', () => {
    const w = badgeBox('a1', 'white');
    const b = badgeBox('h8', 'black');
    expect(w.left).toBeCloseTo(b.left, 5);
    expect(w.top).toBeCloseTo(b.top, 5);
  });
});
