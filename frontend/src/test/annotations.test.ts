import { describe, expect, it } from 'vitest';
import { annotationArrows, annotationSquares } from '@/lib/annotations';

describe('annotation helpers', () => {
  it('uses Chess.com colours: green best, red refutation, blue for a miss or a threat', () => {
    const a = {
      arrows: [
        { from: 'f1', to: 'b5', kind: 'best' as const },
        { from: 'd5', to: 'd4', kind: 'refutation' as const },
        { from: 'g1', to: 'f3', kind: 'threat' as const },
      ],
    };
    expect(annotationArrows(a, 'blunder')).toEqual([
      { from: 'f1', to: 'b5', color: 'green' },
      { from: 'd5', to: 'd4', color: 'red' },
      { from: 'g1', to: 'f3', color: 'blue' },
    ]);
    expect(annotationArrows(a, 'miss')[1].color).toBe('blue');
  });

  it('leaves the played move to the board and drops duplicates', () => {
    const a = { arrows: [{ from: 'e2', to: 'e4', kind: 'played' as const }, { from: 'a1', to: 'a2', kind: 'best' as const }, { from: 'a1', to: 'a2', kind: 'missed' as const }] };
    expect(annotationArrows(a, 'mistake')).toEqual([{ from: 'a1', to: 'a2', color: 'green' }]);
  });

  it('lists each marked square once', () => {
    expect(annotationSquares({ squares: [{ square: 'd5', kind: 'hanging', reason: '' }, { square: 'd5', kind: 'target', reason: '' }, { square: 'e1', kind: 'king-danger', reason: '' }] })).toEqual(['d5', 'e1']);
    expect(annotationSquares({})).toEqual([]);
  });
});
