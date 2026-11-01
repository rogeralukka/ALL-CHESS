import { describe, expect, it, vi, beforeEach } from 'vitest';
import { api } from '@/data/api';
import { gameRepository, invalidateGamesCache } from '@/data/repositories';

describe('games list cache', () => {
  beforeEach(() => {
    invalidateGamesCache();
    vi.restoreAllMocks();
    vi.stubEnv('VITE_USE_MOCKS', 'false');
  });

  it('shares one request between screens and asks for the light list', async () => {
    const spy = vi.spyOn(api, 'get').mockResolvedValue([{ id: 'g1', moveCount: 40 }] as never);
    const [a, b] = await Promise.all([gameRepository.getGames(), gameRepository.getGames()]);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toContain('lite=true');
    expect(a).toEqual(b);
    expect(a[0].moves).toEqual([]);
  });

  it('fetches again after a game changes', async () => {
    const spy = vi.spyOn(api, 'get').mockResolvedValue([] as never);
    await gameRepository.getGames();
    window.dispatchEvent(new CustomEvent('all-chess:games-changed'));
    await gameRepository.getGames();
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
