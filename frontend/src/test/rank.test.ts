import { describe, expect, it } from 'vitest';
import { RANKS, rankFor } from '@/lib/rank';

describe('piece rank tiers', () => {
  it('maps ratings to the right tier', () => {
    expect(rankFor(400).tier.id).toBe('pawn');
    expect(rankFor(905).tier.id).toBe('knight');
    expect(rankFor(1000).tier.id).toBe('bishop');
    expect(rankFor(2400).tier.id).toBe('king');
  });
  it('reports progress to the next tier', () => {
    const r = rankFor(900);
    expect(r.next?.id).toBe('bishop');
    expect(r.toNext).toBe(100);
    expect(r.progress).toBeCloseTo(0.5);
    expect(rankFor(2400).progress).toBe(1);
  });
  it('has ascending thresholds and an icon per tier', () => {
    RANKS.forEach((t, i) => {
      if (i) expect(t.min).toBeGreaterThan(RANKS[i - 1].min);
      expect(t.icon).toMatch(/rank_.*\.webp$/);
    });
  });
});
