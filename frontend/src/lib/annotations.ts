import { Arrow, Move, MoveAnnotations } from '@/data/types';

/**
 * Turn the backend's review annotations into board arrows, using Chess.com's colours:
 * green = the better move, red = the punishing reply, blue = a missed tactic or a follow-up threat.
 * The played move (orange) is added by the caller because it depends on the "Show" toggle.
 */
export function annotationArrows(a: MoveAnnotations, classification: Move['classification']): Arrow[] {
  const out: Arrow[] = [];
  for (const ar of a.arrows ?? []) {
    if (ar.kind === 'played') continue;
    const color: Arrow['color'] = ar.kind === 'best' ? 'green' : ar.kind === 'refutation' ? (classification === 'miss' ? 'blue' : 'red') : 'blue';
    if (!out.some((o) => o.from === ar.from && o.to === ar.to)) out.push({ from: ar.from, to: ar.to, color });
  }
  return out;
}

/** Squares worth marking red after the move: hanging pieces, targets, a king in check */
export function annotationSquares(a: MoveAnnotations): string[] {
  return Array.from(new Set((a.squares ?? []).map((s) => s.square)));
}

/** True when the backend sent annotations for this move (older games have none) */
export function hasAnnotations(m?: Move): m is Move & { annotations: MoveAnnotations } {
  return !!m?.annotations;
}
