import { ScoutProfile } from '../types';
import { MOCK_GAMES } from './mockGames';

/**
 * Mock Scout profiles for ALL-CHESS Phase 1.
 * Clearly fictional usernames per Section 0 hard rules.
 */
export const MOCK_SCOUT_PROFILES: Record<string, ScoutProfile> = {
  PawnStorm22: {
    username: 'PawnStorm22',
    rating: 920, // MOCK
    winRate: 54.2, // MOCK
    mostPlayed: [
      { eco: 'C50', name: 'Italian Game', games: 42, winRate: 58.0, drawRate: 8.0, lossRate: 34.0, avgAccuracy: 82.1 },
      { eco: 'B20', name: 'Sicilian Defense', games: 35, winRate: 51.4, drawRate: 11.4, lossRate: 37.2, avgAccuracy: 79.5 },
      { eco: 'D00', name: 'London System', games: 20, winRate: 55.0, drawRate: 10.0, lossRate: 35.0, avgAccuracy: 80.0 },
    ],
    recentGames: [MOCK_GAMES[0], MOCK_GAMES[2]],
  },
  TacticsKnight: {
    username: 'TacticsKnight',
    rating: 915, // MOCK
    winRate: 58.5, // MOCK
    mostPlayed: [
      { eco: 'B12', name: 'Caro-Kann Defense', games: 50, winRate: 62.0, drawRate: 12.0, lossRate: 26.0, avgAccuracy: 85.0 },
      { eco: 'C45', name: 'Scotch Game', games: 28, winRate: 53.5, drawRate: 10.7, lossRate: 35.8, avgAccuracy: 81.2 },
    ],
    recentGames: [MOCK_GAMES[2], MOCK_GAMES[11]],
  },
  GM_Example: {
    username: 'GM_Example',
    rating: 1400, // MOCK
    title: 'BOT',
    winRate: 68.0, // MOCK
    mostPlayed: [
      { eco: 'E60', name: "King's Indian Defense", games: 120, winRate: 70.0, drawRate: 15.0, lossRate: 15.0, avgAccuracy: 89.4 },
      { eco: 'D35', name: "Queen's Gambit Declined", games: 85, winRate: 65.0, drawRate: 20.0, lossRate: 15.0, avgAccuracy: 88.0 },
    ],
    recentGames: [MOCK_GAMES[5], MOCK_GAMES[10]],
  },
};
