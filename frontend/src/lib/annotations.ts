import { Arrow, Move, MoveAnnotations } from '@/data/types';

const ERRORS = ['inaccuracy', 'mistake', 'miss', 'blunder'];

/**
 * Turn the backend's review annotations into board arrows the way Chess.com draws them
 * (measured on real reviews):
 *  - miss: one green arrow, the move that was missed
 *  - mistake / blunder: the red reply that punishes it (the better move is on the Best button)
 *  - inaccuracy: one green arrow, the better move
 *  - great / brilliant: the follow-up threat in blue
 *  - everything else: no arrows
 * The played move (orange) is added by the caller because it depends on the "Show" toggle.
 */
export function annotationArrows(a: MoveAnnotations, classification: Move['classification']): Arrow[] {
  const list = (a.arrows ?? []).filter((ar) => ar.kind !== 'played');
  const pick = (kinds: string[], color: Arrow['color']): Arrow[] => {
    const ar = list.find((x) => kinds.includes(x.kind));
    return ar ? [{ from: ar.from, to: ar.to, color }] : [];
  };
  switch (classification) {
    case 'miss':
      return pick(['best', 'missed'], 'green');
    case 'mistake':
    case 'blunder':
      return pick(['refutation'], 'red');
    case 'inaccuracy':
      return pick(['best'], 'green');
    case 'great':
    case 'brilliant':
      return pick(['threat'], 'blue');
    default:
      return [];
  }
}

/**
 * Squares Chess.com paints on the board besides the move itself:
 *  threats = pieces in danger (red), targets = where the better move lands (green).
 * Errors always show the better move's destination; clean moves show nothing extra.
 */
export function annotationSquares(a: MoveAnnotations, classification?: Move['classification']): { threats: string[]; targets: string[] } {
  const threats = new Set<string>();
  const targets = new Set<string>();
  const isError = !!classification && ERRORS.includes(classification);
  for (const s of a.squares ?? []) {
    if (s.kind === 'target') {
      if (isError) targets.add(s.square);
    } else if (isError || s.kind === 'king-danger') {
      threats.add(s.square);
    }
  }
  if ((classification === 'mistake' || classification === 'blunder') && a.bestMove?.to) targets.add(a.bestMove.to);
  return { threats: Array.from(threats), targets: Array.from(targets) };
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
