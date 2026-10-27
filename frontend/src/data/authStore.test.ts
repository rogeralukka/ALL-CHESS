import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from './authStore';
import { api, ApiError } from './api';

vi.mock('./api', async (orig) => {
  const mod = await orig<typeof import('./api')>();
  return { ...mod, api: { ...mod.api, get: vi.fn(), post: vi.fn(), del: vi.fn() } };
});

const user = { id: 'u1', username: 'roger' };

describe('authStore background session checks', () => {
  beforeEach(() => {
    vi.mocked(api.get).mockReset();
    useAuthStore.setState({ user, isAuthenticated: true, isLoading: false, error: null });
  });

  it('silent checks never flip isLoading (would unmount the app)', async () => {
    const seen: boolean[] = [];
    const unsub = useAuthStore.subscribe((s) => seen.push(s.isLoading));
    vi.mocked(api.get).mockResolvedValue({ user: { ...user } });
    await useAuthStore.getState().checkSession({ silent: true });
    unsub();
    expect(seen.every((v) => v === false)).toBe(true);
  });

  it('keeps the same user object when nothing changed', async () => {
    vi.mocked(api.get).mockResolvedValue({ user: { ...user } });
    const before = useAuthStore.getState().user;
    await useAuthStore.getState().checkSession({ silent: true });
    expect(useAuthStore.getState().user).toBe(before);
  });

  it('does not log out on a transient network error', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('offline'));
    await useAuthStore.getState().checkSession({ silent: true });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('logs out when the session is really gone (401)', async () => {
    vi.mocked(api.get).mockRejectedValue(new ApiError(401, 'unauthorized', 'nope'));
    await useAuthStore.getState().checkSession({ silent: true });
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('initial (non-silent) check still shows loading', async () => {
    const seen: boolean[] = [];
    const unsub = useAuthStore.subscribe((s) => seen.push(s.isLoading));
    vi.mocked(api.get).mockResolvedValue({ user });
    await useAuthStore.getState().checkSession();
    unsub();
    expect(seen[0]).toBe(true);
  });
});
