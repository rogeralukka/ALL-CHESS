import { useAuthStore } from '@/data/authStore';

/** The signed-in user's identity as it should be shown on screen. */
export function useCurrentUser() {
  const user = useAuthStore((s) => s.user);
  const username = user?.username?.trim() || 'Player';
  return {
    username,
    avatarUrl: user?.avatarUrl || null,
    countryCode: user?.countryCode || null,
    chesscomUsername: user?.chesscomUsername || null,
    lichessUsername: user?.lichessUsername || null,
    /** Game data stores the owner as "You"; show their real name instead. */
    label: (name: string) => (name === 'You' ? username : name),
  };
}
