import { Chess, Square } from 'chess.js';

const VALUE: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

/**
 * Squares to paint red after a move: enemy pieces the moved piece now attacks that are either undefended
 * or worth more than the attacker (the "pressure" / "threat" squares the Chess.com review highlights).
 * Pure position logic from the board after the move; at most 4 squares.
 */
export function threatenedSquares(fenAfter: string, to: string): string[] {
  try {
    const chess = new Chess(fenAfter);
    const mover = chess.get(to as Square);
    if (!mover) return [];
    const enemy = mover.color === 'w' ? 'b' : 'w';
    const out: string[] = [];
    for (const row of chess.board()) {
      for (const cell of row) {
        if (!cell || cell.color !== enemy || cell.type === 'k') continue;
        if (!chess.attackers(cell.square, mover.color).includes(to as Square)) continue;
        const defended = chess.attackers(cell.square, enemy).length > 0;
        if (!defended || VALUE[cell.type] > VALUE[mover.type]) out.push(cell.square);
      }
    }
    return out.slice(0, 4);
  } catch {
    return [];
  }
}
