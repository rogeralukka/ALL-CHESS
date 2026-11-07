/**
 * Puzzle levels follow the player's puzzle rating: one level per 100 rating points, from 400 to 2800
 * (24 levels), matching the rating range of the Lichess puzzle set we serve.
 */
export const PUZZLE_MIN_RATING = 400;
export const PUZZLE_LEVEL_WIDTH = 100;
export const PUZZLE_LEVELS = 24;
export const PUZZLE_MAX_RATING = PUZZLE_MIN_RATING + PUZZLE_LEVELS * PUZZLE_LEVEL_WIDTH; // 2800

/** 1-based level for a rating, clamped to 1..PUZZLE_LEVELS. */
export function levelForRating(rating: number): number {
  const lvl = Math.floor((rating - PUZZLE_MIN_RATING) / PUZZLE_LEVEL_WIDTH) + 1;
  return Math.min(PUZZLE_LEVELS, Math.max(1, lvl));
}

/** Inclusive rating band of a 1-based level (the top level has no upper cap in practice, but the puzzle set ends at 2800). */
export function levelBand(level: number): { min: number; max: number } {
  const l = Math.min(PUZZLE_LEVELS, Math.max(1, Math.round(level)));
  const min = PUZZLE_MIN_RATING + (l - 1) * PUZZLE_LEVEL_WIDTH;
  return { min, max: min + PUZZLE_LEVEL_WIDTH - 1 };
}

/** 0..1: how far through the current level the rating is (1 at or above the top of the last level). */
export function levelProgress(rating: number): number {
  if (rating >= PUZZLE_MAX_RATING) return 1;
  if (rating <= PUZZLE_MIN_RATING) return 0;
  return ((rating - PUZZLE_MIN_RATING) % PUZZLE_LEVEL_WIDTH) / PUZZLE_LEVEL_WIDTH;
}
