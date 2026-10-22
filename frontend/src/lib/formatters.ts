/**
 * Formats chess evaluation into display string
 * e.g. +1.4, -0.6, 0.0, M2, -M1
 */
export function formatEval(evalScore?: number, mate?: number | null): string {
  if (mate !== null && mate !== undefined) {
    return mate > 0 ? `M${mate}` : `-M${Math.abs(mate)}`;
  }
  if (evalScore === undefined || isNaN(evalScore)) return '0.0';
  if (evalScore === 0) return '0.0';
  return evalScore > 0 ? `+${evalScore.toFixed(1)}` : evalScore.toFixed(1);
}

/**
 * Formats time in seconds to mm:ss
 */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

/**
 * Formats ISO date into short readable format (e.g. Oct 22, 2026)
 */
export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}
