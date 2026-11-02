import { Arrow, Move, MoveAnnotations } from '@/data/types';

const CLEAN = ['best', 'excellent', 'good', 'great', 'brilliant'];

/**
 * Turn the backend's review annotations into board arrows exactly the way Chess.com draws them
 * (measured on real reviews; colours: orange = what the move does, green = the better move, red = the punishing reply):
 *  - best / excellent / good / great / brilliant: up to two orange threat arrows from the moved piece
 *  - inaccuracy: one green arrow, the better move
 *  - miss: the green better move (+ a blue extra idea when the backend has one)
 *  - mistake: the red punishing reply + the green better move
 *  - blunder: only the red punishing reply
 *  - book / forced: nothing
 * The played move itself (orange) is only added by the caller when "Show" is on.
 */
export function annotationArrows(a: MoveAnnotations, classification: Move['classification']): Arrow[] {
  const list = (a.arrows ?? []).filter((ar) => ar.kind !== 'played');
  const pick = (kinds: string[], color: Arrow['color'], max = 1): Arrow[] =>
    list
      .filter((x) => kinds.includes(x.kind))
      .slice(0, max)
      .map((x) => ({ from: x.from, to: x.to, color }));
  switch (classification) {
    case 'miss':
      return [...pick(['best', 'missed'], 'green'), ...pick(['alt'], 'blue')];
    case 'mistake':
      return [...pick(['refutation'], 'red'), ...pick(['best'], 'green')];
    case 'blunder':
      return pick(['refutation'], 'red');
    case 'inaccuracy':
      return pick(['best'], 'green');
    default:
      return classification && CLEAN.includes(classification) ? pick(['threat'], 'orange', 2) : [];
  }
}

export interface AnnotationSquares {
  /** red: the king in check, or enemy pieces the move attacks */
  threats: string[];
  /** green: where the missed best move lands */
  targets: string[];
  /** orange: the piece the punishing reply takes */
  orangeTargets: string[];
}

/**
 * Squares Chess.com paints on the board besides the move itself:
 *  miss = green target on the better move's destination; mistake = orange target on the piece that gets taken;
 *  blunder / inaccuracy = none; clean moves = the king in check and attacked enemy pieces in red.
 */
export function annotationSquares(a: MoveAnnotations, classification?: Move['classification']): AnnotationSquares {
  const threats = new Set<string>();
  const targets = new Set<string>();
  const orangeTargets = new Set<string>();
  const clean = !!classification && CLEAN.includes(classification);
  for (const s of a.squares ?? []) {
    if (s.kind === 'king-danger') threats.add(s.square);
    else if (s.kind === 'attacked' && clean) threats.add(s.square);
    else if (s.kind === 'target') {
      if (classification === 'miss') targets.add(s.square);
      else if (classification === 'mistake') (s.tone === 'green' ? targets : orangeTargets).add(s.square);
    }
  }
  if (classification === 'miss' && !targets.size) {
    const best = (a.arrows ?? []).find((x) => x.kind === 'best' || x.kind === 'missed');
    const to = best?.to ?? a.bestMove?.to;
    if (to) targets.add(to);
  }
  if (classification === 'mistake' && !orangeTargets.size && !targets.size) {
    const ref = (a.arrows ?? []).find((x) => x.kind === 'refutation');
    if (ref) orangeTargets.add(ref.to);
  }
  return { threats: Array.from(threats), targets: Array.from(targets), orangeTargets: Array.from(orangeTargets) };
}

/** True when the backend sent annotations for this move (older games have none) */
export function hasAnnotations(m?: Move): m is Move & { annotations: MoveAnnotations } {
  return !!m?.annotations;
}

/**
 * A game reviewed before the backend produced annotations has grades but no arrows or squares.
 * Such a review is worth running once more so the board can draw them.
 */
export function needsAnnotationRefresh(moves?: Move[]): boolean {
  if (!moves?.length) return false;
  return moves[0].eval !== undefined && !moves.some((m) => m.annotations);
}
