import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { puzzleRepository } from '@/data/repositories';
import { api, ApiError } from '@/data/api';
import type { Puzzle } from '@/data/types';

const samplePuzzle: Puzzle = {
  id: '00008',
  fen: 'r6k/pp2r2p/4Rp1Q/3p4/8/1N1P2b1/PqP3PP/7K w - - 0 25',
  solution: ['Rxe7', 'Qb1+', 'Nc1', 'Qxc1+', 'Qxc1'],
  solutionUci: ['e6e7', 'b2b1', 'b3c1', 'b1c1', 'h6c1'],
  setupMoveUci: 'f2g3',
  rating: 1819,
  theme: ['crushing', 'hangingPiece'],
  goal: 'White to move — win the hanging piece',
};

describe('puzzleRepository: the Lichess puzzle endpoints', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_USE_MOCKS', 'false');
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('getNextPuzzle calls /puzzles/next, with the theme when one is chosen', async () => {
    const get = vi.spyOn(api, 'get').mockResolvedValue(samplePuzzle);
    expect(await puzzleRepository.getNextPuzzle()).toEqual(samplePuzzle);
    expect(get).toHaveBeenLastCalledWith('/puzzles/next');
    await puzzleRepository.getNextPuzzle('mateIn2');
    expect(get).toHaveBeenLastCalledWith('/puzzles/next?theme=mateIn2');
  });

  it('getPuzzleInRange asks for one puzzle inside the rating band', async () => {
    const get = vi.spyOn(api, 'get').mockResolvedValue([samplePuzzle]);
    const p = await puzzleRepository.getPuzzleInRange(1200, 1299, 'fork');
    expect(p?.id).toBe('00008');
    const url = String(get.mock.calls[0][0]);
    expect(url.startsWith('/puzzles?')).toBe(true);
    const q = new URLSearchParams(url.split('?')[1]);
    expect(q.get('min_rating')).toBe('1200');
    expect(q.get('max_rating')).toBe('1299');
    expect(q.get('limit')).toBe('1');
    expect(q.get('theme')).toBe('fork');
  });

  it('getPuzzleInRange returns null when the band has no puzzle', async () => {
    vi.spyOn(api, 'get').mockResolvedValue([]);
    expect(await puzzleRepository.getPuzzleInRange(400, 499)).toBeNull();
  });

  it('getThemes and getRating read the server', async () => {
    vi.spyOn(api, 'get').mockImplementation(async (url: string) => {
      if (url === '/puzzles/themes') return [{ theme: 'fork', count: 11912 }];
      if (url === '/puzzles/rating') return { rating: 1234, streak: 2, bestStreak: 5, lastAttemptDate: null };
      throw new Error(`Unexpected url: ${url}`);
    });
    expect(await puzzleRepository.getThemes()).toEqual([{ theme: 'fork', count: 11912 }]);
    expect((await puzzleRepository.getRating())?.rating).toBe(1234);
  });

  it('submitAttempt posts solved, timeSeconds and usedHint', async () => {
    const result = { solved: true, rating: 1228, ratingDelta: 28, streak: 1, bestStreak: 1, isRepeat: false, message: null };
    const post = vi.spyOn(api, 'post').mockResolvedValue(result);
    const res = await puzzleRepository.submitAttempt('00008', { solved: true, timeSeconds: 15, usedHint: false });
    expect(res).toEqual(result);
    expect(post).toHaveBeenCalledWith('/puzzles/00008/attempt', { solved: true, timeSeconds: 15, usedHint: false });
  });

  it('every new call fails soft (null or empty) so the screen can fall back to the built-in puzzles', async () => {
    vi.spyOn(api, 'get').mockRejectedValue(new ApiError(401, 'Unauthorized', 'no session'));
    vi.spyOn(api, 'post').mockRejectedValue(new Error('network down'));
    expect(await puzzleRepository.getNextPuzzle()).toBeNull();
    expect(await puzzleRepository.getPuzzleInRange(400, 499)).toBeNull();
    expect(await puzzleRepository.getThemes()).toEqual([]);
    expect(await puzzleRepository.getRating()).toBeNull();
    expect(await puzzleRepository.submitAttempt('x', { solved: false, timeSeconds: 3, usedHint: true })).toBeNull();
  });

  it('in mock mode the new calls make no request and signal "use the built-in puzzles"', async () => {
    vi.stubEnv('VITE_USE_MOCKS', 'true');
    const get = vi.spyOn(api, 'get');
    const post = vi.spyOn(api, 'post');
    expect(await puzzleRepository.getNextPuzzle()).toBeNull();
    expect(await puzzleRepository.getPuzzleInRange(400, 499)).toBeNull();
    expect(await puzzleRepository.getThemes()).toEqual([]);
    expect(await puzzleRepository.getRating()).toBeNull();
    expect(await puzzleRepository.submitAttempt('x', { solved: true, timeSeconds: 1, usedHint: false })).toBeNull();
    expect(get).not.toHaveBeenCalled();
    expect(post).not.toHaveBeenCalled();
  });
});
