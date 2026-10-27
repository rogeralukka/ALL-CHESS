import { Game } from '@/data/types';
import { OpeningService } from '@/services/openingService';

/** "Sicilian Defense: Najdorf Variation" → "Sicilian Defense" (the family name, like Chess.com's history list). */
export const openingFamily = (name: string) => name.split(':')[0].trim();

/** Opening name for a game: the stored one when it is a real name, otherwise looked up from the moves. */
export function openingNameFor(g: Game): string | null {
  const stored = g.opening?.name?.trim();
  if (stored && !/^(unknown|n\/a|-+)$/i.test(stored)) return openingFamily(stored);
  const found = OpeningService.identifyOpening(g.moves.slice(0, 16).map((m) => m.san));
  return found ? openingFamily(found.name) : null;
}

/** How the game ended. Uses the backend value when present, otherwise what the moves reveal. */
export function terminationFor(g: Game): string | null {
  const last = g.moves[g.moves.length - 1];
  if (last?.san.includes('#')) return 'Checkmate';
  if (g.termination) {
    const t = g.termination.replace(/^.*\b(won|drawn|draw)\b\s*(by)?\s*/i, '').trim();
    return t ? t.charAt(0).toUpperCase() + t.slice(1) : g.termination;
  }
  if (g.result === '1/2-1/2') return 'Draw';
  return null;
}
