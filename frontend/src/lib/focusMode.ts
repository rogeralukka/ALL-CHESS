import { useEffect } from 'react';
import { create } from 'zustand';

/**
 * "Focus mode": while a game is running on a phone the bottom tab bar is hidden, as in the Chess.com app,
 * so the game's own action bar (Resign, Hint, Undo...) can sit at the bottom of the screen.
 */
export const useFocusMode = create<{ on: boolean; set: (on: boolean) => void }>((set) => ({
  on: false,
  set: (on) => set({ on }),
}));

export const useHideTabBar = (when: boolean) => {
  const set = useFocusMode((s) => s.set);
  useEffect(() => {
    set(when);
    return () => set(false);
  }, [when, set]);
};
