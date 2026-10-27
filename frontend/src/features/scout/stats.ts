import { ScoutProfile } from '@/data/types';

/** Overall win/draw/loss split, weighted by games per opening. Null when there is nothing to show. */
export function overallResults(p: ScoutProfile): { win: number; draw: number; loss: number; games: number } | null {
  const games = p.mostPlayed.reduce((n, o) => n + o.games, 0);
  if (games <= 0) return null;
  const w = (k: 'winRate' | 'drawRate' | 'lossRate') => p.mostPlayed.reduce((n, o) => n + o[k] * o.games, 0) / games;
  return { win: w('winRate'), draw: w('drawRate'), loss: w('lossRate'), games };
}

/** Games-weighted accuracy over the openings that have accuracy data. Null when none do. */
export function overallAccuracy(p: ScoutProfile): number | null {
  const withAcc = p.mostPlayed.filter((o) => o.avgAccuracy != null);
  const games = withAcc.reduce((n, o) => n + o.games, 0);
  if (!games) return null;
  return withAcc.reduce((n, o) => n + (o.avgAccuracy as number) * o.games, 0) / games;
}
