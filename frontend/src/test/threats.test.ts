import { describe, it, expect } from 'vitest';
import { Chess } from 'chess.js';
import { threatenedSquares } from '@/lib/threats';

const after = (moves: string[]) => {
  const c = new Chess();
  moves.forEach((m) => c.move(m));
  return c.fen();
};

describe('threatenedSquares', () => {
  it('flags an undefended pawn attacked by the queen, but not a defended pawn the queen only outranks', () => {
    // 1.e4 e5 2.Qh5: the queen attacks e5 (undefended) and f7 (defended by the king)
    expect(threatenedSquares(after(['e4', 'e5', 'Qh5']), 'h5')).toEqual(['e5']);
  });

  it('flags a bigger piece attacked by a smaller one even when it is defended', () => {
    // 1.e4 d5 2.exd5 Qxd5 3.Nc3 attacks the queen on d5 with a knight
    expect(threatenedSquares(after(['e4', 'd5', 'exd5', 'Qxd5', 'Nc3']), 'c3')).toContain('d5');
  });

  it('returns nothing for a quiet move or an empty destination', () => {
    expect(threatenedSquares(after(['e4']), 'e4')).toEqual([]);
    expect(threatenedSquares(after(['e4']), 'e5')).toEqual([]);
  });
});
