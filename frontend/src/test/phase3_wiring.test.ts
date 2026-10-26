import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { puzzleRepository, learnRepository, friendRepository } from '@/data/repositories';
import { api } from '@/data/api';
import type { Friend, Puzzle, LessonStage } from '@/data/types';

describe('Phase 3 Frontend Repositories Wiring', () => {
  const originalUseMocks = import.meta.env.VITE_USE_MOCKS;

  beforeEach(() => {
    vi.restoreAllMocks();
    import.meta.env.VITE_USE_MOCKS = 'false';
  });

  afterEach(() => {
    import.meta.env.VITE_USE_MOCKS = originalUseMocks;
  });

  it('friendRepository calls GET /friends and receives per-speed ratings', async () => {
    const mockFriends: Friend[] = [
      {
        id: 'f-1',
        username: 'Magnus',
        rating: 2850,
        ratings: { rapid: 2850, blitz: 2890, bullet: 2900 },
        online: true,
      },
    ];

    vi.spyOn(api, 'get').mockResolvedValueOnce(mockFriends);

    const friends = await friendRepository.getFriends();
    expect(api.get).toHaveBeenCalledWith('/friends');
    expect(friends.length).toBe(1);
    expect(friends[0].username).toBe('Magnus');
    expect(friends[0].ratings?.rapid).toBe(2850);
    expect(friends[0].ratings?.blitz).toBe(2890);
    expect(friends[0].ratings?.bullet).toBe(2900);
  });

  it('friendRepository addFriend calls POST /friends with platform', async () => {
    const newFriend: Friend = {
      id: 'f-2',
      username: 'Hikaru',
      rating: 2820,
      ratings: { rapid: 2820, blitz: 2880, bullet: 2910 },
      online: true,
    };

    vi.spyOn(api, 'post').mockResolvedValueOnce(newFriend);

    const res = await friendRepository.addFriend('Hikaru');
    expect(api.post).toHaveBeenCalledWith('/friends', { username: 'Hikaru', platform: 'chesscom' });
    expect(res.username).toBe('Hikaru');
    expect(res.ratings?.blitz).toBe(2880);
  });

  it('puzzleRepository calls GET /puzzles and /puzzles/daily', async () => {
    const samplePuzzle: Puzzle = {
      id: 'puz-01',
      fen: '6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1',
      solution: ['Rd8#'],
      rating: 650,
      theme: ['mateIn1', 'backRank'],
      goal: 'Deliver mate in 1',
    };

    vi.spyOn(api, 'get').mockImplementation(async (url: string) => {
      if (url === '/puzzles') return [samplePuzzle];
      if (url === '/puzzles/daily') return samplePuzzle;
      if (url === '/puzzles/puz-01') return samplePuzzle;
      throw new Error(`Unexpected url: ${url}`);
    });

    const puzzles = await puzzleRepository.getPuzzles();
    expect(api.get).toHaveBeenCalledWith('/puzzles');
    expect(puzzles.length).toBe(1);
    expect(puzzles[0].solution).toEqual(['Rd8#']);

    const daily = await puzzleRepository.getDailyPuzzle();
    expect(api.get).toHaveBeenCalledWith('/puzzles/daily');
    expect(daily.id).toBe('puz-01');

    const byId = await puzzleRepository.getPuzzleById('puz-01');
    expect(api.get).toHaveBeenCalledWith('/puzzles/puz-01');
    expect(byId?.rating).toBe(650);
  });

  it('learnRepository calls GET /learn/stages and category filter', async () => {
    const sampleStage: LessonStage = {
      id: 'endgame-1',
      title: 'King + Rook vs King',
      category: 'endgame',
      status: 'done',
      xp: 50,
      description: 'Master boxing enemy king',
      steps: [],
    };

    vi.spyOn(api, 'get').mockImplementation(async (url: string) => {
      if (url === '/learn/stages') return [sampleStage];
      if (url === '/learn/stages?category=endgame') return [sampleStage];
      if (url === '/learn/stages/endgame-1') return sampleStage;
      throw new Error(`Unexpected url: ${url}`);
    });

    const allStages = await learnRepository.getStages();
    expect(api.get).toHaveBeenCalledWith('/learn/stages');
    expect(allStages.length).toBe(1);

    const endgameStages = await learnRepository.getStages('endgame');
    expect(api.get).toHaveBeenCalledWith('/learn/stages?category=endgame');
    expect(endgameStages[0].category).toBe('endgame');

    const single = await learnRepository.getStageById('endgame-1');
    expect(api.get).toHaveBeenCalledWith('/learn/stages/endgame-1');
    expect(single?.status).toBe('done');
  });
});
