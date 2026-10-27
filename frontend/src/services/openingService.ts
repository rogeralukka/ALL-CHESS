import openingsData from '../data/openings.json';
import ecoData from '../data/ecoOpenings.json';

export interface OpeningMatch {
  eco: string;
  name: string;
  idea: string;
  plies: number;
}

interface Entry {
  eco: string;
  name: string;
  idea: string;
  plies: number;
}

const strip = (san: string) => san.replace(/[+#]/g, '');

/** What each ECO family is generally about, used when a line has no hand-written idea. */
const FAMILY_IDEA: Record<string, string> = {
  A: 'A flank or irregular opening: the fight for the centre is delayed, so piece placement and pawn structure decide the plans.',
  B: 'A semi-open game (1.e4 with an uneven reply): Black fights for the centre from the side, usually leading to sharper, unbalanced play.',
  C: 'An open or French-type game after 1.e4: quick development, central tension and early king safety matter most.',
  D: 'A closed or semi-closed Queen’s Pawn game: a slower fight for the centre with pawn breaks like c4 and e4 deciding the plans.',
  E: 'An Indian defence: Black lets White build a centre, then challenges it with pieces and a well-timed pawn break.',
};

let table: Map<string, Entry> | null = null;
let maxPlies = 0;

function build(): Map<string, Entry> {
  const map = new Map<string, Entry>();
  // Big ECO list first, then curated entries overwrite on identical move strings (they carry ideas).
  for (const [eco, name, moves] of ecoData as Array<[string, string, string]>) {
    const plies = moves.split(' ').length;
    map.set(moves, { eco, name, idea: FAMILY_IDEA[eco[0]] ?? '', plies });
    if (plies > maxPlies) maxPlies = plies;
  }
  for (const op of openingsData as Array<{ eco: string; name: string; idea: string; moves: string[] }>) {
    const key = op.moves.join(' ');
    map.set(key, { eco: op.eco, name: op.name, idea: op.idea, plies: op.moves.length });
    if (op.moves.length > maxPlies) maxPlies = op.moves.length;
  }
  return map;
}

export class OpeningService {
  /**
   * Identifies the longest matching opening for the given array of SAN moves
   * (about 3,800 named lines from the open ECO list, plus hand-written ideas for the main ones).
   */
  public static identifyOpening(movesSans: string[]): OpeningMatch | null {
    if (!movesSans || movesSans.length === 0) return null;
    if (!table) table = build();
    const clean = movesSans.map(strip);
    for (let n = Math.min(clean.length, maxPlies); n >= 1; n--) {
      const hit = table.get(clean.slice(0, n).join(' '));
      if (hit) return { eco: hit.eco, name: hit.name, idea: hit.idea, plies: hit.plies };
    }
    return null;
  }
}
