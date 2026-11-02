/** Days you actually played, and the streak built from them. Nothing here is invented. */

type Dated = { date?: string | null };

const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** The local calendar days on which at least one game was played. */
export function playedDays(games: Dated[]): Set<string> {
  const days = new Set<string>();
  for (const g of games) {
    if (!g.date) continue;
    const d = new Date(g.date);
    if (!Number.isNaN(d.getTime())) days.add(dayKey(d));
  }
  return days;
}

/**
 * Days in a row with at least one game, counting back from today.
 * A day you have not played yet does not break the streak, so it also counts back from yesterday.
 */
export function currentStreak(games: Dated[], now = new Date()): number {
  const days = playedDays(games);
  if (days.size === 0) return 0;
  const cursor = new Date(now);
  if (!days.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(dayKey(cursor))) return 0;
  }
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** Monday-to-Sunday flags for this week: did you play that day, and which one is today. */
export function weekPlayed(games: Dated[], now = new Date()): { played: boolean[]; todayIndex: number } {
  const days = playedDays(games);
  const todayIndex = (now.getDay() + 6) % 7;
  const monday = new Date(now);
  monday.setDate(monday.getDate() - todayIndex);
  const played = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return days.has(dayKey(d));
  });
  return { played, todayIndex };
}
