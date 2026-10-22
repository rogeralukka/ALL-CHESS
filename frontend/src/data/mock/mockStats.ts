import { OpeningStat, RatingPoint } from '../types';

/**
 * Mock stats data for ALL-CHESS Phase 1.
 * All numbers labeled as MOCK per Section 6 requirements.
 */

export const MOCK_RATING_HISTORY: RatingPoint[] = [
  { date: '2026-07-24', rapid: 840, blitz: 790, bullet: 750 },
  { date: '2026-08-01', rapid: 855, blitz: 810, bullet: 780 },
  { date: '2026-08-15', rapid: 870, blitz: 805, bullet: 800 },
  { date: '2026-09-01', rapid: 860, blitz: 830, bullet: 820 },
  { date: '2026-09-15', rapid: 885, blitz: 845, bullet: 840 },
  { date: '2026-10-01', rapid: 895, blitz: 850, bullet: 865 },
  { date: '2026-10-10', rapid: 910, blitz: 865, bullet: 875 },
  { date: '2026-10-22', rapid: 905, blitz: 870, bullet: 880 },
];

export const MOCK_OPENING_STATS: OpeningStat[] = [
  { eco: 'C50', name: 'Italian Game', games: 28, winRate: 64.3, drawRate: 7.1, lossRate: 28.6, avgAccuracy: 84.2 },
  { eco: 'B12', name: 'Caro-Kann Defense', games: 22, winRate: 59.1, drawRate: 13.6, lossRate: 27.3, avgAccuracy: 81.5 },
  { eco: 'B20', name: 'Sicilian Defense', games: 19, winRate: 52.6, drawRate: 10.5, lossRate: 36.8, avgAccuracy: 78.9 },
  { eco: 'D00', name: 'London System', games: 16, winRate: 56.2, drawRate: 12.5, lossRate: 31.3, avgAccuracy: 80.1 },
  { eco: 'B01', name: 'Scandinavian Defense', games: 12, winRate: 66.7, drawRate: 8.3, lossRate: 25.0, avgAccuracy: 85.0 },
  { eco: 'D35', name: "Queen's Gambit Declined", games: 10, winRate: 50.0, drawRate: 20.0, lossRate: 30.0, avgAccuracy: 77.4 },
];

export const MOCK_PHASE_POINTS_LOST = {
  opening: 0.3,    // MOCK: points lost per game
  middlegame: 1.6, // MOCK
  endgame: 1.0,    // MOCK
};

export const MOCK_STRENGTHS = [
  { label: 'King Safety', delta: '+0.8', type: 'strength' },
  { label: 'Queen Development', delta: '+0.6', type: 'strength' },
  { label: 'Back-Rank Defense', delta: '+0.5', type: 'strength' },
];

export const MOCK_WEAKNESSES = [
  { label: 'Hanging Minors', delta: '-1.2', type: 'weakness' },
  { label: 'Pawn Structure', delta: '-0.9', type: 'weakness' },
  { label: 'Time Management', delta: '-0.6', type: 'weakness' },
];

export const MOCK_ADVANCED_STATS_ROWS = [
  { id: 'openings', name: 'Openings Mastery', score: 88, delta: '+4.2%', trend: 'up' },
  { id: 'tactics', name: 'Tactical Awareness', score: 76, delta: '+1.5%', trend: 'up' },
  { id: 'strategy', name: 'Strategic Planning', score: 71, delta: '-0.8%', trend: 'down' },
  { id: 'endgames', name: 'Endgame Technique', score: 82, delta: '+3.1%', trend: 'up' },
  { id: 'brilliant', name: 'Brilliant Finds', score: 65, delta: '+5.0%', trend: 'up' },
];

export const MOCK_OPENING_TABLE = [
  { stat: 'Avg Opening Accuracy', grade: 'A', you: '84.2%', peers: '78.5%' },
  { stat: 'Avg Book Moves', grade: 'B', you: '6.4 moves', peers: '5.8 moves' },
  { stat: 'Opening Mistakes', grade: 'A', you: '0.4 / game', peers: '0.9 / game' },
  { stat: 'Equalize as Black', grade: 'B', you: '54.5%', peers: '49.0%' },
];
