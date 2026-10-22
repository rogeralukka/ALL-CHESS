/**
 * Win probability model from centipawns.
 * Formula specified in Section 6:
 * 50 + 50 * (2 / (1 + exp(-0.00368208 * cp)) - 1)
 */
export function winPct(cp: number): number {
  if (isNaN(cp)) return 50;
  // Clamp extreme values
  if (cp > 4000) return 100;
  if (cp < -4000) return 0;
  const pct = 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);
  return Math.min(100, Math.max(0, Math.round(pct * 10) / 10));
}

/**
 * Helper to compute win percentage from eval string or mate
 */
export function evalToWinPct(evalScore?: number, mate?: number | null): number {
  if (mate !== null && mate !== undefined) {
    if (mate > 0) return 100;
    if (mate < 0) return 0;
    return 50;
  }
  if (evalScore === undefined || isNaN(evalScore)) return 50;
  // Convert pawn units (e.g. +1.4) to centipawns (+140)
  return winPct(evalScore * 100);
}
