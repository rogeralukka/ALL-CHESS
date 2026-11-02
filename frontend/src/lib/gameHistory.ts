import type { Game } from '@/data/types';

export type HistoryTab = 'all' | 'chesscom' | 'lichess' | 'allchess';

export const HISTORY_TABS: { value: HistoryTab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'chesscom', label: 'Chess.com' },
  { value: 'lichess', label: 'Lichess' },
  { value: 'allchess', label: 'ALL-CHESS' },
];

/** Where a game was played. Older rows without a platform are told apart by how they were made. */
export function gameOrigin(g: Pick<Game, 'platform' | 'source'>): 'chesscom' | 'lichess' | 'allchess' {
  if (g.platform === 'lichess') return 'lichess';
  if (g.platform === 'coach' || g.source === 'vs_coach') return 'allchess';
  return 'chesscom';
}

export function filterByHistoryTab<T extends Pick<Game, 'platform' | 'source'>>(games: T[], tab: HistoryTab): T[] {
  return tab === 'all' ? games : games.filter((g) => gameOrigin(g) === tab);
}

export function historyCounts(games: Pick<Game, 'platform' | 'source'>[]): Record<HistoryTab, number> {
  const c: Record<HistoryTab, number> = { all: games.length, chesscom: 0, lichess: 0, allchess: 0 };
  for (const g of games) c[gameOrigin(g)]++;
  return c;
}
