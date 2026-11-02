import { describe, expect, it } from 'vitest';
import { filterByHistoryTab, gameOrigin, historyCounts } from '@/lib/gameHistory';

type G = Parameters<typeof gameOrigin>[0];
const games: G[] = [
  { platform: 'chesscom', source: 'online' },
  { platform: 'chesscom', source: 'online' },
  { platform: 'lichess', source: 'online' },
  { platform: 'coach', source: 'vs_coach' },
  { platform: null, source: 'vs_coach' },
  { platform: undefined, source: 'online' },
];

describe('game history sections', () => {
  it('tells where a game was played, including old rows with no platform', () => {
    expect(games.map(gameOrigin)).toEqual(['chesscom', 'chesscom', 'lichess', 'allchess', 'allchess', 'chesscom']);
  });
  it('counts every section and All is the total', () => {
    expect(historyCounts(games)).toEqual({ all: 6, chesscom: 3, lichess: 1, allchess: 2 });
  });
  it('filters by section and keeps everything for All', () => {
    expect(filterByHistoryTab(games, 'all')).toHaveLength(6);
    expect(filterByHistoryTab(games, 'lichess')).toHaveLength(1);
    expect(filterByHistoryTab(games, 'allchess').every((g) => gameOrigin(g) === 'allchess')).toBe(true);
  });
});
