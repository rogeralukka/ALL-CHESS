/**
 * Game-style rank tiers named after the pieces. Purely cosmetic: they turn a rating into a
 * "level" so progress reads like a game, the same way the roadmap does.
 */
export interface RankTier {
  id: 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
  name: string;
  min: number;
  color: string;
  icon: string;
}

export const RANKS: RankTier[] = [
  { id: 'pawn', name: 'Pawn', min: 0, color: '#9aa5b4', icon: '/assets/ui/rank_pawn.webp' },
  { id: 'knight', name: 'Knight', min: 800, color: '#7bb661', icon: '/assets/ui/rank_knight.webp' },
  { id: 'bishop', name: 'Bishop', min: 1000, color: '#5aa9e6', icon: '/assets/ui/rank_bishop.webp' },
  { id: 'rook', name: 'Rook', min: 1200, color: '#a78bfa', icon: '/assets/ui/rank_rook.webp' },
  { id: 'queen', name: 'Queen', min: 1500, color: '#f472b6', icon: '/assets/ui/rank_queen.webp' },
  { id: 'king', name: 'King', min: 1800, color: '#f5b833', icon: '/assets/ui/rank_king.webp' },
];

export function rankFor(rating: number) {
  let i = 0;
  while (i + 1 < RANKS.length && rating >= RANKS[i + 1].min) i++;
  const tier = RANKS[i];
  const next = RANKS[i + 1];
  const progress = next ? (rating - tier.min) / (next.min - tier.min) : 1;
  return { tier, next, progress: Math.max(0, Math.min(1, progress)), toNext: next ? next.min - rating : 0 };
}
