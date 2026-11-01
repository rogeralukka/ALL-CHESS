import { useEffect, useState } from 'react';
import { api } from '@/data/api';

export type StatsMode = 'all' | 'bullet' | 'blitz' | 'rapid' | 'daily';
export type StatsRange = '7d' | '30d' | '90d' | '1y' | 'all';
export type StatsColor = 'all' | 'white' | 'black';
export type Grade = 'A' | 'B' | 'C' | 'D' | 'E';

export interface Metric {
  value: number | null;
  peers: number | null;
  grade: Grade | null;
  series?: Array<{ date: string; value: number }>;
}

export interface Overview {
  rating: number | null;
  ratingDelta: number | null;
  history: Array<{ date: string; rating: number }>;
  games: number;
  wins: number;
  draws: number;
  losses: number;
  winPct: number;
  drawPct: number;
  lossPct: number;
  scores: { openings: number | null; tactics: number | null; strategy: number | null; endgames: number | null };
}

export interface OpeningsStats {
  openingAccuracy: Metric;
  avgOpeningMistakes: Metric;
  avgBookMoves: Metric;
  byOpening: Array<{ name: string; eco?: string | null; games: number; winPct: number | null; accuracy: number | null; peers: number | null; grade: Grade | null }>;
  peersEstimated?: boolean;
}

export interface TacticsStats {
  categories: Array<{ key: string; label: string; value: number | null; peers: number | null; grade: Grade | null; opportunities: number; samples: number }>;
  peersEstimated?: boolean;
}

export interface EndgamesStats {
  winPct: Record<'fromBetter' | 'fromEqual' | 'fromWorse', Metric>;
  accuracy: Record<'overall' | 'rookAndPawn' | 'kingAndPawn' | 'queen' | 'other', Metric>;
  peersEstimated?: boolean;
}

export interface StrategyStats {
  overall: Metric;
  pawnStructure: Metric;
  attacking: Metric;
  defending: Metric;
  activePiece: Metric;
  spaceAdvantage: Metric;
  peersEstimated?: boolean;
}

export interface BrilliantMove {
  gameId: string;
  moveIndex: number;
  fen: string;
  san: string;
  opponent: string;
  opponentRating?: number | null;
  date: string;
}

export interface StatsQuery {
  mode: StatsMode;
  range: StatsRange;
  color?: StatsColor;
  side?: 'found' | 'allowed';
}

export const buildStatsUrl = (path: string, q: StatsQuery): string => {
  const p = new URLSearchParams({ mode: q.mode, range: q.range });
  if (q.color) p.set('color', q.color);
  if (q.side) p.set('side', q.side);
  return `/stats/advanced/${path}?${p.toString()}`;
};

export interface Loaded<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/** Loads one advanced-stats endpoint and reloads when the query changes (stale answers are ignored). */
export function useAdvancedStats<T>(path: string, q: StatsQuery): Loaded<T> {
  const [state, setState] = useState<Loaded<T>>({ data: null, loading: true, error: null });
  const url = buildStatsUrl(path, q);
  useEffect(() => {
    let live = true;
    setState((s) => ({ data: s.data, loading: true, error: null }));
    api
      .get<T>(url)
      .then((data) => live && setState({ data, loading: false, error: null }))
      .catch((e: unknown) => live && setState({ data: null, loading: false, error: e instanceof Error ? e.message : 'Could not load stats' }));
    return () => {
      live = false;
    };
  }, [url]);
  return state;
}

export const fmtPct = (v: number | null | undefined, digits = 1): string => (v === null || v === undefined ? '–' : `${v.toFixed(digits)}%`);
export const fmtNum = (v: number | null | undefined, digits = 1): string => (v === null || v === undefined ? '–' : v.toFixed(digits));
