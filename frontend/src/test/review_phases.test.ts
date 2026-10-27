import { describe, it, expect } from 'vitest';
import { Chess } from 'chess.js';
import { Move, MoveClassification } from '@/data/types';
import { bookCommentary, computePhases, gradeFor, nonPawnMaterial, backendGrades, openingAt } from '@/features/review/phases';

function build(sans: string[], cls: (i: number) => MoveClassification): Move[] {
  const c = new Chess();
  return sans.map((san, i) => {
    const color = c.turn();
    const r = c.move(san);
    return { san, from: r.from, to: r.to, color, fen: c.fen(), moveNumber: Math.floor(i / 2) + 1, classification: cls(i) };
  });
}

describe('review phases and openings', () => {
  const sans = ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd4', 'exd4', 'cxd4', 'Bb4+'];
  const moves = build(sans, (i) => (i < 6 ? 'book' : i === 9 ? 'blunder' : 'best'));

  it('names the opening on a book move and says what it is for', () => {
    const text = bookCommentary(moves, 4)!;
    expect(text).toMatch(/Italian Game/);
    expect(text).toMatch(/C5\d/);
  });

  it('flags the move that leaves theory', () => {
    expect(bookCommentary(moves, 6)).toMatch(/Out of theory/);
  });

  it('finds deep named lines, not just main openings', () => {
    const m = openingAt(moves, 6);
    expect(m?.name).toMatch(/Giuoco Piano/);
  });

  it('scores both players per phase', () => {
    const [opening] = computePhases(moves);
    expect(opening.phase).toBe('opening');
    expect(opening.white).not.toBeNull();
    expect(opening.black).not.toBeNull();
    expect(opening.black!.errors).toBe(1); // the blunder at index 9 is Black's
    expect(opening.white!.errors).toBe(0);
    expect(opening.black!.accuracy).toBeLessThan(opening.white!.accuracy);
  });

  it('grades by accuracy', () => {
    expect(gradeFor(95)).toBe('A');
    expect(gradeFor(82)).toBe('B');
    expect(gradeFor(70)).toBe('C');
    expect(gradeFor(40)).toBe('D');
  });

  it('counts only non-pawn material', () => {
    expect(nonPawnMaterial('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')).toEqual({ w: 31, b: 31, queens: 2 });
  });

  it('accepts backend grades flat or per colour', () => {
    const g = { opening: 'A', middlegame: 'B', tactics: 'C', endgame: 'D' } as const;
    const base = { white: { username: 'You' }, black: { username: 'x' } } as never;
    expect(backendGrades({ ...(base as object), phaseGrades: g } as never).white).toEqual(g);
    expect(backendGrades({ ...(base as object), phaseGrades: { black: g } } as never).black).toEqual(g);
  });
});
