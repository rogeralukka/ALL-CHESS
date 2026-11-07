import { describe, it, expect } from 'vitest';
import { levelForRating, levelBand, levelProgress, PUZZLE_LEVELS } from '@/lib/puzzleLevel';

describe('puzzle levels follow the puzzle rating', () => {
  it('has 24 levels, one per 100 rating points from 400 to 2800', () => {
    expect(PUZZLE_LEVELS).toBe(24);
    expect(levelForRating(400)).toBe(1);
    expect(levelForRating(499)).toBe(1);
    expect(levelForRating(500)).toBe(2);
    expect(levelForRating(1200)).toBe(9);
    expect(levelForRating(2799)).toBe(24);
  });

  it('clamps ratings outside the range', () => {
    expect(levelForRating(100)).toBe(1);
    expect(levelForRating(0)).toBe(1);
    expect(levelForRating(2800)).toBe(24);
    expect(levelForRating(3400)).toBe(24);
  });

  it('gives each level an inclusive 100-point band', () => {
    expect(levelBand(1)).toEqual({ min: 400, max: 499 });
    expect(levelBand(9)).toEqual({ min: 1200, max: 1299 });
    expect(levelBand(24)).toEqual({ min: 2700, max: 2799 });
    // out-of-range levels are clamped
    expect(levelBand(0)).toEqual({ min: 400, max: 499 });
    expect(levelBand(99)).toEqual({ min: 2700, max: 2799 });
  });

  it('reports progress through the current level from 0 to 1', () => {
    expect(levelProgress(1200)).toBe(0);
    expect(levelProgress(1250)).toBeCloseTo(0.5);
    expect(levelProgress(1299)).toBeCloseTo(0.99);
    expect(levelProgress(300)).toBe(0);
    expect(levelProgress(2800)).toBe(1);
    expect(levelProgress(3000)).toBe(1);
  });

  it('a rating inside a band maps back to that band', () => {
    for (let lvl = 1; lvl <= PUZZLE_LEVELS; lvl++) {
      const { min, max } = levelBand(lvl);
      expect(levelForRating(min)).toBe(lvl);
      expect(levelForRating(max)).toBe(lvl);
    }
  });
});
