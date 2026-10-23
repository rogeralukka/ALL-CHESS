import openingsData from '../data/openings.json';

export interface OpeningMatch {
  eco: string;
  name: string;
  idea: string;
  plies: number;
}

export class OpeningService {
  private static openings: Array<{
    eco: string;
    name: string;
    idea: string;
    moves: string[];
  }> = openingsData;

  /**
   * Identifies the longest matching opening for the given array of SAN moves.
   */
  public static identifyOpening(movesSans: string[]): OpeningMatch | null {
    if (!movesSans || movesSans.length === 0) return null;

    let bestMatch: OpeningMatch | null = null;
    let longestPly = 0;

    for (const op of this.openings) {
      if (op.moves.length > movesSans.length) continue;

      let matches = true;
      for (let i = 0; i < op.moves.length; i++) {
        // Strip check/mate symbols for robust matching
        const cleanOpMove = op.moves[i].replace(/[+#]/g, '');
        const cleanActualMove = movesSans[i].replace(/[+#]/g, '');
        if (cleanOpMove !== cleanActualMove) {
          matches = false;
          break;
        }
      }

      if (matches && op.moves.length > longestPly) {
        longestPly = op.moves.length;
        bestMatch = {
          eco: op.eco,
          name: op.name,
          idea: op.idea,
          plies: op.moves.length,
        };
      }
    }

    return bestMatch;
  }
}
