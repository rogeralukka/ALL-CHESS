import { describe, expect, it } from 'vitest';
import { currentStreak, playedDays, weekPlayed } from '@/lib/streak';

const at = (iso: string) => ({ date: iso });
// a Wednesday
const now = new Date('2026-11-04T20:00:00');

describe('streak', () => {
  it('counts days in a row ending today', () => {
    const games = [at('2026-11-04T10:00:00'), at('2026-11-03T10:00:00'), at('2026-11-02T22:00:00')];
    expect(currentStreak(games, now)).toBe(3);
  });

  it('still counts when today has no game yet, but stops at a gap', () => {
    expect(currentStreak([at('2026-11-03T10:00:00'), at('2026-11-02T10:00:00')], now)).toBe(2);
    expect(currentStreak([at('2026-11-02T10:00:00')], now)).toBe(0);
  });

  it('counts several games on one day once', () => {
    const games = [at('2026-11-04T10:00:00'), at('2026-11-04T11:00:00'), at('2026-11-04T12:00:00')];
    expect(currentStreak(games, now)).toBe(1);
    expect(playedDays(games).size).toBe(1);
  });

  it('is zero with no games and ignores unusable dates', () => {
    expect(currentStreak([], now)).toBe(0);
    expect(currentStreak([{ date: null }, { date: 'nonsense' }], now)).toBe(0);
  });

  it('marks the days played this week, Monday first', () => {
    const { played, todayIndex } = weekPlayed([at('2026-11-02T10:00:00'), at('2026-11-04T10:00:00')], now);
    expect(todayIndex).toBe(2);
    expect(played).toEqual([true, false, true, false, false, false, false]);
  });
});
