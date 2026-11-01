import { describe, expect, it } from 'vitest';
import { annotationArrows, annotationSquares } from '@/lib/annotations';

describe('annotation helpers', () => {
  const a = {
    arrows: [
      { from: 'f1', to: 'b5', kind: 'best' as const },
      { from: 'd5', to: 'd4', kind: 'refutation' as const },
      { from: 'g1', to: 'f3', kind: 'threat' as const },
    ],
  };

  it('draws what Chess.com draws for each grade', () => {
    expect(annotationArrows(a, 'miss')).toEqual([{ from: 'f1', to: 'b5', color: 'green' }]);
    expect(annotationArrows(a, 'blunder')).toEqual([{ from: 'd5', to: 'd4', color: 'red' }]);
    expect(annotationArrows(a, 'mistake')).toEqual([{ from: 'd5', to: 'd4', color: 'red' }]);
    expect(annotationArrows(a, 'inaccuracy')).toEqual([{ from: 'f1', to: 'b5', color: 'green' }]);
    expect(annotationArrows(a, 'great')).toEqual([{ from: 'g1', to: 'f3', color: 'blue' }]);
    expect(annotationArrows(a, 'brilliant')).toEqual([{ from: 'g1', to: 'f3', color: 'blue' }]);
  });

  it('draws nothing on clean moves and never the played move', () => {
    expect(annotationArrows(a, 'best')).toEqual([]);
    expect(annotationArrows(a, 'book')).toEqual([]);
    expect(annotationArrows({ arrows: [{ from: 'e2', to: 'e4', kind: 'played' as const }] }, 'miss')).toEqual([]);
  });

  it('marks danger squares red and the better move green on errors only', () => {
    const sq = { squares: [{ square: 'd5', kind: 'hanging' as const, reason: '' }, { square: 'e1', kind: 'king-danger' as const, reason: '' }], bestMove: { san: 'Qe7', from: 'd8', to: 'e7', uci: 'd8e7' } };
    expect(annotationSquares(sq, 'blunder')).toEqual({ threats: ['d5', 'e1'], targets: ['e7'] });
    expect(annotationSquares(sq, 'miss')).toEqual({ threats: ['d5', 'e1'], targets: [] });
    expect(annotationSquares(sq, 'best')).toEqual({ threats: ['e1'], targets: [] });
    expect(annotationSquares({}, 'blunder')).toEqual({ threats: [], targets: [] });
  });
});

import { needsAnnotationRefresh } from '@/lib/annotations';
import type { Move } from '@/data/types';

describe('needsAnnotationRefresh', () => {
  const mv = (extra: Partial<Move>): Move => ({ san: 'e4', from: 'e2', to: 'e4', color: 'w', fen: 'x', moveNumber: 1, ...extra });
  it('flags a graded review that has no annotations', () => {
    expect(needsAnnotationRefresh([mv({ eval: { eval: 0.2 } })])).toBe(true);
  });
  it('leaves new reviews, unanalysed games and empty games alone', () => {
    expect(needsAnnotationRefresh([mv({ eval: { eval: 0.2 }, annotations: { tint: 'best' } })])).toBe(false);
    expect(needsAnnotationRefresh([mv({})])).toBe(false);
    expect(needsAnnotationRefresh([])).toBe(false);
    expect(needsAnnotationRefresh(undefined)).toBe(false);
  });
});
