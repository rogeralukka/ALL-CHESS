import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CLASSIFICATION_META, ClassificationBadge } from '@/components/ClassificationBadge';
import { MoveQualityTable } from '@/features/review/MoveQualityTable';
import { annotationArrows, annotationSquares } from '@/lib/annotations';
import type { Game } from '@/data/types';

// the backend can report a move as "forced" (the only legal move): it must render, not break the review
const game = {
  white: { username: 'w', rating: 1000 },
  black: { username: 'b', rating: 1000 },
  moves: [
    { san: 'e4', color: 'w', classification: 'book' },
    { san: 'Kb2', color: 'w', classification: 'forced' },
    { san: 'Kb7', color: 'b', classification: 'forced' },
  ],
} as unknown as Game;

describe('forced move class', () => {
  it('has a neutral badge', () => {
    expect(CLASSIFICATION_META.forced.name).toBe('Forced');
    const { container } = render(<ClassificationBadge classification="forced" />);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('is counted in the move quality table without crashing', () => {
    render(<MoveQualityTable game={game} />);
    expect(screen.getAllByText('Forced').length).toBeGreaterThan(0);
  });

  it('draws no arrows or squares', () => {
    expect(annotationArrows({ arrows: [{ from: 'e2', to: 'e4', kind: 'threat' as const }] }, 'forced')).toEqual([]);
    const sq = annotationSquares({ squares: [] }, 'forced');
    expect(sq.targets).toEqual([]);
  });
});
