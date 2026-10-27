import { Game, Move, MoveClassification, PhaseGrade } from '@/data/types';
import { OpeningService, OpeningMatch } from '@/services/openingService';

export type PhaseId = 'opening' | 'middlegame' | 'endgame';
export type Grade = 'A' | 'B' | 'C' | 'D' | 'N/A';

export interface SideStat {
  moves: number;
  accuracy: number; // 0-100
  grade: Grade;
  good: number; // best / great / brilliant / book / excellent
  errors: number; // mistake / miss / blunder
}

export interface PhaseStat {
  phase: PhaseId;
  /** half-move indices [from, to) covered by this phase */
  range: [number, number];
  white: SideStat | null;
  black: SideStat | null;
}

const WEIGHT: Record<MoveClassification, number> = {
  brilliant: 1,
  great: 1,
  best: 1,
  book: 1,
  excellent: 0.95,
  good: 0.8,
  inaccuracy: 0.55,
  miss: 0.4,
  mistake: 0.3,
  blunder: 0,
};

export const gradeFor = (accuracy: number): Grade => (accuracy >= 90 ? 'A' : accuracy >= 80 ? 'B' : accuracy >= 65 ? 'C' : 'D');

const PIECE_POINTS: Record<string, number> = { q: 9, r: 5, b: 3, n: 3 };

/** Non-pawn material for each side in a FEN. */
export function nonPawnMaterial(fen: string): { w: number; b: number; queens: number } {
  const board = fen.split(' ')[0];
  let w = 0;
  let b = 0;
  let queens = 0;
  for (const ch of board) {
    const pts = PIECE_POINTS[ch.toLowerCase()];
    if (!pts) continue;
    if (ch === ch.toUpperCase()) w += pts;
    else b += pts;
    if (ch.toLowerCase() === 'q') queens++;
  }
  return { w, b, queens };
}

/** Index of the last book move, or -1. */
export function lastBookIndex(moves: Move[]): number {
  let last = -1;
  moves.forEach((m, i) => {
    if (m.classification === 'book') last = i;
  });
  return last;
}

/** Half-move index where the endgame begins (or moves.length when it never does). */
export function endgameStart(moves: Move[]): number {
  for (let i = 0; i < moves.length; i++) {
    const { w, b } = nonPawnMaterial(moves[i].fen);
    if (w <= 13 && b <= 13) return i + 1;
  }
  return moves.length;
}

export function phaseBoundaries(moves: Move[]): { openingEnd: number; endgameFrom: number } {
  const endgameFrom = endgameStart(moves);
  const openingEnd = Math.min(Math.max(lastBookIndex(moves) + 1 + 6, 12), 24, endgameFrom);
  return { openingEnd, endgameFrom };
}

function sideStat(moves: Move[], color: 'w' | 'b'): SideStat | null {
  const mine = moves.filter((m) => m.color === color && m.classification);
  if (mine.length === 0) return null;
  const accuracy = (mine.reduce((n, m) => n + WEIGHT[m.classification as MoveClassification], 0) / mine.length) * 100;
  return {
    moves: mine.length,
    accuracy,
    grade: gradeFor(accuracy),
    good: mine.filter((m) => ['best', 'great', 'brilliant', 'book', 'excellent'].includes(m.classification as string)).length,
    errors: mine.filter((m) => ['mistake', 'miss', 'blunder'].includes(m.classification as string)).length,
  };
}

/** Opening / Middlegame / Endgame stats for BOTH players. */
export function computePhases(moves: Move[]): PhaseStat[] {
  if (!moves.length) return [];
  const { openingEnd, endgameFrom } = phaseBoundaries(moves);
  const ranges: Array<[PhaseId, number, number]> = [
    ['opening', 0, openingEnd],
    ['middlegame', openingEnd, endgameFrom],
    ['endgame', endgameFrom, moves.length],
  ];
  return ranges.map(([phase, from, to]) => {
    const slice = moves.slice(from, to);
    return { phase, range: [from, to] as [number, number], white: sideStat(slice, 'w'), black: sideStat(slice, 'b') };
  });
}

/** Backend grades, whether flat (user's colour) or per colour. Missing colours are undefined. */
export function backendGrades(game: Game): { white?: PhaseGrade; black?: PhaseGrade } {
  const g = game.phaseGrades;
  if (!g) return {};
  if ('white' in g || 'black' in g) return g as { white?: PhaseGrade; black?: PhaseGrade };
  const userIsWhite = game.isUserWhite ?? game.white.username === 'You';
  return userIsWhite ? { white: g as PhaseGrade } : { black: g as PhaseGrade };
}

/** The opening played after `plies` half-moves (SAN list), or null when it is not a known opening. */
export function openingAt(moves: Move[], plies: number): OpeningMatch | null {
  return OpeningService.identifyOpening(moves.slice(0, plies).map((m) => m.san));
}

/**
 * What to say on a move that is (or just stopped being) book:
 * names the opening, says what the line is for, and flags when theory ends.
 */
export function bookCommentary(moves: Move[], index: number): string | null {
  const m = moves[index];
  if (!m) return null;
  const here = openingAt(moves, index + 1);
  const prev = index > 0 ? openingAt(moves, index) : null;

  if (m.classification === 'book') {
    if (here) {
      const isNew = !prev || prev.name !== here.name;
      return isNew
        ? `${here.name} (${here.eco}). ${here.idea}`
        : `Still in the ${here.name}. ${here.idea}`;
    }
    return 'A well-known theory move, though it does not match a named opening in my list.';
  }

  const wasBook = index > 0 && moves[index - 1].classification === 'book';
  if (wasBook) {
    const last = openingAt(moves, index);
    return last
      ? `Out of theory. The last known position was the ${last.name} (${last.eco}), and this move leaves it.`
      : 'Out of theory. From here you are on your own.';
  }
  return null;
}

/** Name for the whole game's opening, from the longest book prefix. */
export function gameOpening(game: Game): OpeningMatch | null {
  const last = lastBookIndex(game.moves);
  const m = openingAt(game.moves, last >= 0 ? last + 1 : Math.min(12, game.moves.length));
  if (m) return m;
  return game.opening?.name ? { eco: game.opening.eco, name: game.opening.name, idea: '', plies: 0 } : null;
}


export interface PhaseRow {
  phase: PhaseId;
  label: string;
  white: { grade: Grade; accuracy: number | null; moves: number };
  black: { grade: Grade; accuracy: number | null; moves: number };
}

const LABEL: Record<PhaseId, string> = { opening: 'Opening', middlegame: 'Middlegame', endgame: 'Endgame' };

/** Rows for the review table: both colours, backend grade when it supplied one, otherwise computed here. */
export function phaseRows(game: Game): PhaseRow[] {
  const be = backendGrades(game);
  const side = (stat: SideStat | null, backend: Grade | undefined) => ({
    grade: (backend ?? stat?.grade ?? 'N/A') as Grade,
    accuracy: stat ? stat.accuracy : null,
    moves: stat?.moves ?? 0,
  });
  return computePhases(game.moves)
    .filter((p) => p.white || p.black)
    .map((p) => ({
      phase: p.phase,
      label: LABEL[p.phase],
      white: side(p.white, be.white?.[p.phase]),
      black: side(p.black, be.black?.[p.phase]),
    }));
}
