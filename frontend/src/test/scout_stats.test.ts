import { describe, it, expect } from 'vitest';
import { overallAccuracy, overallResults } from '@/features/scout/stats';
import type { ScoutProfile } from '@/data/types';

const base: ScoutProfile = { username: 'x', rating: null, winRate: null, mostPlayed: [], recentGames: [] };

describe('scout stats helpers', () => {
  it('returns null when a player has no games, instead of inventing numbers', () => {
    expect(overallResults(base)).toBeNull();
    expect(overallAccuracy(base)).toBeNull();
  });

  it('weights results by games per opening', () => {
    const p: ScoutProfile = {
      ...base,
      mostPlayed: [
        { eco: 'C50', name: 'Italian', games: 30, winRate: 60, drawRate: 10, lossRate: 30, avgAccuracy: 80 },
        { eco: 'B20', name: 'Sicilian', games: 10, winRate: 20, drawRate: 10, lossRate: 70, avgAccuracy: null },
      ],
    };
    const r = overallResults(p)!;
    expect(r.games).toBe(40);
    expect(Math.round(r.win)).toBe(50);
    expect(Math.round(r.loss)).toBe(40);
    // accuracy only counts openings that have it
    expect(overallAccuracy(p)).toBe(80);
  });
});
