import { describe, expect, it } from 'vitest';
import { annotationArrows, annotationSquares } from '@/lib/annotations';

describe('annotation helpers', () => {
  const a = {
    arrows: [
      { from: 'f1', to: 'b5', kind: 'best' as const },
      { from: 'd5', to: 'd4', kind: 'refutation' as const },
      { from: 'g1', to: 'f3', kind: 'threat' as const },
      { from: 'c1', to: 'h6', kind: 'threat' as const },
      { from: 'a1', to: 'a8', kind: 'threat' as const },
      { from: 'f1', to: 'a6', kind: 'alt' as const },
    ],
  };

  it('draws what Chess.com draws for each grade', () => {
    expect(annotationArrows(a, 'miss')).toEqual([
      { from: 'f1', to: 'b5', color: 'green' },
      { from: 'f1', to: 'a6', color: 'blue' },
    ]);
    expect(annotationArrows(a, 'blunder')).toEqual([{ from: 'd5', to: 'd4', color: 'red' }]);
    expect(annotationArrows(a, 'mistake')).toEqual([
      { from: 'd5', to: 'd4', color: 'red' },
      { from: 'f1', to: 'b5', color: 'green' },
    ]);
    expect(annotationArrows(a, 'inaccuracy')).toEqual([{ from: 'f1', to: 'b5', color: 'green' }]);
  });

  it('draws at most two orange threat arrows on clean moves', () => {
    const two = [
      { from: 'g1', to: 'f3', color: 'orange' },
      { from: 'c1', to: 'h6', color: 'orange' },
    ];
    for (const c of ['best', 'excellent', 'good', 'great', 'brilliant'] as const) {
      expect(annotationArrows(a, c)).toEqual(two);
    }
  });

  it('draws nothing on book moves and never the played move', () => {
    expect(annotationArrows(a, 'book')).toEqual([]);
    expect(annotationArrows({ arrows: [{ from: 'e2', to: 'e4', kind: 'played' as const }] }, 'miss')).toEqual([]);
    expect(annotationArrows({ arrows: [{ from: 'e2', to: 'e4', kind: 'played' as const }] }, 'good')).toEqual([]);
  });

  it('paints squares like Chess.com: miss = green target, mistake = orange target, blunder / inaccuracy = none', () => {
    const none = { threats: [], targets: [], orangeTargets: [] };
    expect(annotationSquares(a, 'miss')).toEqual({ ...none, targets: ['b5'] });
    expect(annotationSquares(a, 'mistake')).toEqual({ ...none, orangeTargets: ['d4'] });
    expect(annotationSquares(a, 'blunder')).toEqual(none);
    expect(annotationSquares(a, 'inaccuracy')).toEqual(none);
    expect(annotationSquares({}, 'mistake')).toEqual(none);
  });

  it('marks the king in check and attacked enemy pieces red on clean moves only', () => {
    const sq = {
      squares: [
        { square: 'd5', kind: 'attacked' as const, reason: '' },
        { square: 'e8', kind: 'king-danger' as const, reason: '' },
        { square: 'a1', kind: 'hanging' as const, reason: '' },
      ],
    };
    expect(annotationSquares(sq, 'best').threats).toEqual(['d5', 'e8']);
    expect(annotationSquares(sq, 'great').threats).toEqual(['d5', 'e8']);
    expect(annotationSquares(sq, 'blunder').threats).toEqual(['e8']);
  });

  it('uses the tone the backend gives a target square', () => {
    const sq = { squares: [{ square: 'c3', kind: 'target' as const, reason: '', tone: 'orange' as const }] };
    expect(annotationSquares(sq, 'mistake').orangeTargets).toEqual(['c3']);
    expect(annotationSquares({ squares: [{ square: 'g4', kind: 'target' as const, reason: '', tone: 'green' as const }] }, 'miss').targets).toEqual(['g4']);
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
