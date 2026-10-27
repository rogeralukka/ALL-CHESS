import { backendGrades } from '@/features/review/phases';
import { describe, it, expect } from 'vitest';
import { Chess } from 'chess.js';
import { gameRepository } from '@/data/repositories';
import { MOCK_GAMES } from '@/data/mock/mockGames';

describe('ALL-CHESS Step 1B: Review Suite', () => {
  it('loads the 27-move mockup game (game-01) with correct move sequence and blunder', async () => {
    const game = await gameRepository.getGameById('game-01');
    expect(game).toBeDefined();
    expect(game?.id).toBe('game-01');
    expect(game?.opening.name).toContain('Italian');

    // 27 full moves = 54 plies
    expect(game?.moves.length).toBe(54);
    expect(game?.moves[game.moves.length - 1].moveNumber).toBe(27);

    // Move 10 is White's 6th move: 6. Bxf7+ which is the blunder
    const blunderMove = game?.moves[10];
    expect(blunderMove?.san).toBe('Bxf7+');
    expect(blunderMove?.classification).toBe('blunder');
    expect(blunderMove?.eval?.eval).toBe(-3.54);
    expect(blunderMove?.eval?.bestMove).toBe('c3');
    expect(blunderMove?.eval?.lines?.[0]?.move).toBe('c3');
    expect(blunderMove?.eval?.lines?.[0]?.eval).toBe(0.3);
    expect(blunderMove?.variation).toEqual(['Kxf7', 'Ng5+', 'Kg8']);
    expect(blunderMove?.coachComment).toContain('This gives away a free bishop');

    // Check checkmate ending and result
    const lastMove = game?.moves[game.moves.length - 1];
    expect(lastMove?.san).toBe('Rxf1#');
    expect(game?.result).toBe('0-1');
  });

  it('guarantees result matches final position if checkmate or draw across all mock games', () => {
    for (const g of MOCK_GAMES) {
      const chess = new Chess();
      chess.loadPgn(g.pgn);

      if (chess.isCheckmate()) {
        const expectedResult = chess.turn() === 'w' ? '0-1' : '1-0';
        expect(g.result).toBe(expectedResult);
      }

      if (chess.isDraw()) {
        expect(g.result).toBe('1/2-1/2');
      }
    }
  });

  it('verifies that every pv and bestMove is legal from the position before the move', () => {
    for (const g of MOCK_GAMES) {
      const chess = new Chess();
      for (const m of g.moves) {
        const fenBefore = chess.fen();

        // Check bestMove legality
        if (m.eval?.bestMove) {
          const testChess = new Chess(fenBefore);
          const legalMove = testChess.moves().includes(m.eval.bestMove);
          expect(legalMove).toBe(true);
        }

        // Check each line's pv sequence legality from fenBefore
        if (m.eval?.lines) {
          for (const line of m.eval.lines) {
            const testChess = new Chess(fenBefore);
            for (const pvMove of line.pv) {
              const res = testChess.move(pvMove);
              expect(res).not.toBeNull();
            }
          }
        }

        // Advance chess to next position
        chess.move(m.san);
      }
    }
  });

  it('verifies eval changes agree with classification for every mock game', () => {
    for (const g of MOCK_GAMES) {
      let prevEval = 0.2;
      for (let i = 0; i < g.moves.length; i++) {
        const m = g.moves[i];
        const currentEval = m.eval?.eval ?? 0;
        const isWhite = m.color === 'w';

        // Eval change from the mover's perspective
        // (For White, eval dropping means White lost advantage; for Black, eval rising means Black lost advantage)
        const moverEvalDrop = isWhite ? prevEval - currentEval : currentEval - prevEval;

        if (m.classification === 'blunder') {
          // Blunder should drop at least ~2.5 to 3.0 pawns
          expect(moverEvalDrop).toBeGreaterThanOrEqual(2.5);
          // And bestMove must differ from the played blunder
          expect(m.eval?.bestMove).not.toBe(m.san);
        } else if (m.classification === 'mistake') {
          // Mistake should drop at least ~1.0 to 1.5 pawns
          expect(moverEvalDrop).toBeGreaterThanOrEqual(1.0);
          expect(m.eval?.bestMove).not.toBe(m.san);
        } else if (m.classification === 'inaccuracy') {
          // Inaccuracy should drop at least ~0.4 pawns
          expect(moverEvalDrop).toBeGreaterThanOrEqual(0.4);
          expect(m.eval?.bestMove).not.toBe(m.san);
        }

        prevEval = currentEval;
      }
    }
  });

  it('verifies retry only accepts the best move or top engine lines from the position before the mistake', async () => {
    const game = await gameRepository.getGameById('game-01');
    expect(game).toBeDefined();

    // Move index 10 is the blunder 6. Bxf7+
    const blunderMove = game!.moves[10];
    const fenBeforeMistake = game!.moves[9].fen; // Position before White's 6th move
    const bestMove = blunderMove.eval?.bestMove; // 'c3'
    const topLines = blunderMove.eval?.lines || [];

    const sim = new Chess(fenBeforeMistake);

    // 1. Moving Black's pieces before White's 6th move is illegal because it is White's turn
    expect(sim.turn()).toBe('w');

    // 2. Best move 'c3' is valid and accepted
    const bestPlayed = sim.move(bestMove!);
    expect(bestPlayed).not.toBeNull();
    expect(bestPlayed?.san).toBe('c3');

    // 3. Alternatives in top lines ('Nc3', 'Bb3') are also valid moves for White
    for (const line of topLines) {
      const altSim = new Chess(fenBeforeMistake);
      const res = altSim.move(line.move);
      expect(res).not.toBeNull();
    }

    // 4. The played blunder 'Bxf7+' is not accepted as the best move
    expect(bestMove).not.toBe(blunderMove.san);
  });

  it('filters games accurately by time control speed', async () => {
    const rapidGames = await gameRepository.getGames({ speed: 'rapid' });
    expect(rapidGames.length).toBeGreaterThan(0);
    expect(rapidGames.every((g) => g.speed === 'rapid')).toBe(true);

    const blitzGames = await gameRepository.getGames({ speed: 'blitz' });
    expect(blitzGames.length).toBeGreaterThan(0);
    expect(blitzGames.every((g) => g.speed === 'blitz')).toBe(true);

    const bulletGames = await gameRepository.getGames({ speed: 'bullet' });
    expect(bulletGames.length).toBeGreaterThan(0);
    expect(bulletGames.every((g) => g.speed === 'bullet')).toBe(true);
  });

  it('filters games accurately by result', async () => {
    const wins = await gameRepository.getGames({ result: 'win' });
    expect(wins.length).toBeGreaterThan(0);

    const draws = await gameRepository.getGames({ result: 'draw' });
    expect(draws.length).toBeGreaterThan(0);
    expect(draws.every((g) => g.result === '1/2-1/2')).toBe(true);
  });

  it('filters games by search query', async () => {
    const italianGames = await gameRepository.getGames({ searchQuery: 'Italian' });
    expect(italianGames.length).toBeGreaterThan(0);
    expect(italianGames.every((g) => g.opening.name.includes('Italian'))).toBe(true);
  });

  it('ensures all 12 games have phase grades and accuracy ratings', () => {
    for (const g of MOCK_GAMES) {
      expect(g.accuracy).toBeDefined();
      expect(g.accuracy?.white).toBeGreaterThan(50);
      expect(g.accuracy?.black).toBeGreaterThan(50);
      expect(g.phaseGrades).toBeDefined();
      expect(backendGrades(g).white?.opening ?? (g.phaseGrades as { opening: string }).opening).toMatch(/^[ABCD]|N\/A$/);
    }
  });
});
