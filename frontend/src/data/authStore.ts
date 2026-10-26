import { create } from 'zustand';
import { api, ApiError } from './api';

export interface UserSession {
  id: string;
  username: string;
  chesscomUsername?: string | null;
  lichessUsername?: string | null;
  avatarUrl?: string | null;
  countryCode?: string | null;
  createdAt?: string | null;
}

interface AuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  checkSession: () => Promise<boolean>;
  login: (data: {
    passcode: string;
    username: string;
    chesscomUsername?: string;
    lichessUsername?: string;
  }) => Promise<UserSession>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Multi-tab session synchronization
  if (typeof window !== 'undefined') {
    window.addEventListener('auth-required', () => {
      if (get().isAuthenticated) {
        set({ isAuthenticated: false, user: null });
      }
    });

    // Listen for login/logout in other tabs via storage events
    window.addEventListener('storage', (e) => {
      if (e.key === 'all_chess_auth_sync') {
        get().checkSession();
      }
    });

    // Re-verify session when returning focus to this tab
    window.addEventListener('focus', () => {
      get().checkSession();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        get().checkSession();
      }
    });
  }

  return {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    checkSession: async () => {
      set({ isLoading: true, error: null });
      try {
        const res = await api.get<{ user: UserSession }>('/session');
        if (res && res.user) {
          set({ user: res.user, isAuthenticated: true, isLoading: false });
          return true;
        }
        set({ user: null, isAuthenticated: false, isLoading: false });
        return false;
      } catch {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return false;
      }
    },

    login: async (payload) => {
      set({ error: null });
      try {
        const res = await api.post<{ user: UserSession }>('/session', {
          passcode: payload.passcode,
          username: payload.username,
          chesscomUsername: payload.chesscomUsername || undefined,
          lichessUsername: payload.lichessUsername || undefined,
        });

        if (res && res.user) {
          set({ user: res.user, isAuthenticated: true, error: null });
          try {
            localStorage.setItem('all_chess_auth_sync', Date.now().toString());
          } catch {
            // ignore localStorage quota errors
          }
          return res.user;
        }
        throw new Error('No user returned from session endpoint');
      } catch (err: unknown) {
        let errorMsg = 'Login failed';
        if (err instanceof ApiError) {
          errorMsg = typeof err.detail === 'string' ? err.detail : err.error;
        } else if (err instanceof Error) {
          errorMsg = err.message;
        }
        set({ error: errorMsg });
        throw err;
      }
    },

    logout: async () => {
      try {
        await api.del('/session');
      } catch {
        // ignore errors on logout
      } finally {
        set({ user: null, isAuthenticated: false, error: null });
        try {
          localStorage.setItem('all_chess_auth_sync', Date.now().toString());
        } catch {
          // ignore
        }
      }
    },

    clearError: () => set({ error: null }),
  };
});
