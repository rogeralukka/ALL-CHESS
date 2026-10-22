import { describe, it, expect } from 'vitest';
import { gameRepository } from '@/data/repositories';
import { MOCK_GAMES } from '@/data/mock/mockGames';

describe('ALL-CHESS Step 1B: Review Suite', () => {
  it('loads the 27-move mockup game (game-01) with correct move sequence and blunder', async () => {
    const game = await gameRepository.getGameById('game-01');
    expect(game).toBeDefined();
    expect(game?.id).toBe('game-01');
    expect(game?.opening.name).toContain('Italian');

    // Move 10 is White's 6th move: 6. Bxf7+ which is the blunder
    const blunderMove = game?.moves[10];
    expect(blunderMove?.san).toBe('Bxf7+');
    expect(blunderMove?.classification).toBe('blunder');

    // Check checkmate ending
    const lastMove = game?.moves[game.moves.length - 1];
    expect(lastMove?.san).toBe('Rxf1#');
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
      expect(g.phaseGrades?.opening).toMatch(/^[ABCD]|N\/A$/);
    }
  });
});
