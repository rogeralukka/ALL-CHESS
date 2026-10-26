import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api, ApiError } from '@/data/api';
import {
  gameRepository,
  statsRepository,
  friendRepository,
  puzzleRepository,
  learnRepository,
  scoutRepository,
} from '@/data/repositories';

describe('API Client (frontend/src/data/api.ts)', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('constructs correct request options and parses JSON response', async () => {
    const mockData = { user: { id: 'u1', username: 'testuser' } };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockData,
    });
    global.fetch = fetchMock;

    const res = await api.get('/session');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [calledUrl, calledOptions] = fetchMock.mock.calls[0];
    expect(calledUrl).toContain('/api/v1/session');
    expect(calledOptions.credentials).toBe('include');
    expect(calledOptions.method).toBe('GET');
    expect(res).toEqual(mockData);
  });

  it('serializes request body in POST and PUT requests', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ ok: true }),
    });
    global.fetch = fetchMock;

    await api.post('/session', { passcode: 'secret', username: 'alice' });

    const [, postOptions] = fetchMock.mock.calls[0];
    expect(postOptions.method).toBe('POST');
    expect(postOptions.body).toBe(JSON.stringify({ passcode: 'secret', username: 'alice' }));

    await api.put('/session', { username: 'alice_updated' });
    const [, putOptions] = fetchMock.mock.calls[1];
    expect(putOptions.method).toBe('PUT');
    expect(putOptions.body).toBe(JSON.stringify({ username: 'alice_updated' }));
  });

  it('throws typed ApiError with status, error, and detail on error responses', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ error: 'Invalid passcode', detail: 'Passcode is incorrect.' }),
    });

    try {
      await api.post('/session', { passcode: 'wrong' });
      expect.fail('Expected ApiError to be thrown');
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(ApiError);
      const apiErr = err as ApiError;
      expect(apiErr.status).toBe(400);
      expect(apiErr.error).toBe('Invalid passcode');
      expect(apiErr.detail).toBe('Passcode is incorrect.');
      expect(apiErr.message).toBe('Passcode is incorrect.');
    }
  });

  it('emits "auth-required" custom event on 401 response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ error: 'Unauthorized', detail: 'Not logged in.' }),
    });

    let eventEmitted = false;
    const listener = () => {
      eventEmitted = true;
    };
    window.addEventListener('auth-required', listener);

    try {
      await api.get('/session');
    } catch {
      // expected error
    }

    expect(eventEmitted).toBe(true);
    window.removeEventListener('auth-required', listener);
  });
});

describe('Repositories & Mock Fallbacks', () => {
  it('returns mock data when VITE_USE_MOCKS is enabled in test environment', async () => {
    const games = await gameRepository.getGames();
    expect(Array.isArray(games)).toBe(true);
    expect(games.length).toBeGreaterThan(0);

    const first = await gameRepository.getGameById('game-01');
    expect(first).toBeDefined();
    expect(first?.id).toBe('game-01');
  });

  it('statsRepository returns mock data when VITE_USE_MOCKS is enabled', async () => {
    const ratings = await statsRepository.getUserRatings();
    expect(ratings.length).toBe(3);
    expect(ratings.map((r) => r.mode)).toEqual(['Rapid', 'Blitz', 'Bullet']);

    const history = await statsRepository.getRatingHistory('90d');
    expect(Array.isArray(history)).toBe(true);
    expect(history.length).toBeGreaterThan(0);
  });

  it('phase 3 endpoints cleanly fall back to mocks', async () => {
    const friends = await friendRepository.getFriends();
    expect(Array.isArray(friends)).toBe(true);
    expect(friends.length).toBeGreaterThan(0);

    const puzzles = await puzzleRepository.getPuzzles();
    expect(Array.isArray(puzzles)).toBe(true);
    expect(puzzles.length).toBeGreaterThan(0);

    const stages = await learnRepository.getStages();
    expect(Array.isArray(stages)).toBe(true);
    expect(stages.length).toBeGreaterThan(0);

    const profiles = await scoutRepository.searchProfiles('magnus');
    expect(Array.isArray(profiles)).toBe(true);
  });
});
