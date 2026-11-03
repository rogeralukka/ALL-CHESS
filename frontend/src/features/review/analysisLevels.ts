/**
 * Review depth levels. `id` is what the backend receives as `level`; `depth` is the depth every position is
 * searched to (browserReviewService BROWSER_LIMITS), and the backend reports the depth actually reached as
 * `analysisDepth`.
 */
export interface AnalysisLevel {
  id: 'standard' | 'deep' | 'deeper' | 'max';
  name: string;
  depth: number;
  blurb: string;
}

export const ANALYSIS_LEVELS: AnalysisLevel[] = [
  { id: 'standard', name: 'Standard', depth: 18, blurb: 'Every move searched to depth 18. Fastest.' },
  { id: 'deep', name: 'Deep', depth: 20, blurb: 'Depth 20: catches quieter mistakes. About twice as long.' },
  { id: 'deeper', name: 'Deeper', depth: 22, blurb: 'Depth 22: long calculations. A few minutes on a laptop.' },
  { id: 'max', name: 'Max', depth: 24, blurb: 'Depth 24: the deepest search. Slow, especially on a phone.' },
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
