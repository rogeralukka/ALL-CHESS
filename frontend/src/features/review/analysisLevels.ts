/**
 * Review depth levels. `id` is what the backend receives as `level`; `depth` is only the
 * frontend's expectation for labelling (the backend reports the real depth as `analysisDepth`).
 * "standard" is meant to match what Chess.com's Game Review searches to; each step goes deeper.
 */
export interface AnalysisLevel {
  id: 'standard' | 'deep' | 'deeper' | 'max';
  name: string;
  depth: number;
  blurb: string;
}

export const ANALYSIS_LEVELS: AnalysisLevel[] = [
  { id: 'standard', name: 'Standard', depth: 18, blurb: 'Same depth as Chess.com Game Review. Fastest.' },
  { id: 'deep', name: 'Deep', depth: 22, blurb: 'Catches quieter mistakes Standard calls fine.' },
  { id: 'deeper', name: 'Deeper', depth: 26, blurb: 'Long calculations and subtle positional errors.' },
  { id: 'max', name: 'Max', depth: 32, blurb: 'Strongest Stockfish search. Brutal and slow.' },
];

export const DEFAULT_LEVEL: AnalysisLevel['id'] = 'standard';

const KEY = 'all_chess_analysis_level';

export function loadLevel(): AnalysisLevel['id'] {
  try {
    const v = localStorage.getItem(KEY);
    if (v && ANALYSIS_LEVELS.some((l) => l.id === v)) return v as AnalysisLevel['id'];
  } catch {
    // ignore
  }
  return DEFAULT_LEVEL;
}

export function saveLevel(id: AnalysisLevel['id']): void {
  try {
    localStorage.setItem(KEY, id);
  } catch {
    // ignore
  }
}

export const levelById = (id?: string) => ANALYSIS_LEVELS.find((l) => l.id === id);
