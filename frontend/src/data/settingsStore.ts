import { create } from 'zustand';
import { storage } from '@/lib/storage';

export type AppTheme = 'dusk' | 'dawn' | 'system';
export type AnimationSpeed = 'off' | 'fast' | 'medium' | 'slow';
export type MoveMethod = 'both' | 'drag' | 'click';
export type CoordinateStyle = 'inside' | 'outside';
export type BackgroundStyle = 'standard' | 'felt' | 'wood';

export interface UserSettings {
  appTheme: AppTheme;
  boardThemeId: string;
  pieceSetId: string;
  background: BackgroundStyle;
  animationSpeed: AnimationSpeed;
  moveMethod: MoveMethod;
  coordinates: CoordinateStyle;
  autoQueen: boolean;
  coachEnabled: boolean;
  coachVoiceEnabled: boolean;
  soundEnabled: boolean;
  evalBarEnabled: boolean;
  showLegalMoves: boolean;
  suggestionArrows: boolean;
  threatArrows: boolean;
  engineDepth: number; // MOCK depth in Phase 1
  byokKeys: {
    gemini?: string;
    groq?: string;
  };
}

const DEFAULT_SETTINGS: UserSettings = {
  appTheme: 'dusk',
  boardThemeId: 'sand-clay',
  pieceSetId: 'cburnett',
  background: 'standard',
  animationSpeed: 'medium',
  moveMethod: 'both',
  coordinates: 'inside',
  autoQueen: true,
  coachEnabled: true,
  coachVoiceEnabled: false,
  soundEnabled: true,
  evalBarEnabled: true,
  showLegalMoves: true,
  suggestionArrows: true,
  threatArrows: true,
  engineDepth: 16,
  byokKeys: {},
};

interface SettingsStore extends UserSettings {
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  setAppTheme: (theme: AppTheme) => void;
  resetSettings: () => void;
}

const getInitialSettings = (): UserSettings => {
  return storage.get<UserSettings>('all_chess_settings', DEFAULT_SETTINGS);
};

export const applyThemeToDom = (theme: AppTheme) => {
  let effective = theme;
  if (theme === 'system') {
    effective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dusk' : 'dawn';
  }
  document.documentElement.setAttribute('data-theme', effective);
};

export const useSettingsStore = create<SettingsStore>((set, get) => {
  const initial = getInitialSettings();
  applyThemeToDom(initial.appTheme);

  return {
    ...initial,
    updateSettings: (newSettings) => {
      const updated = { ...get(), ...newSettings };
      set(newSettings);
      storage.set('all_chess_settings', updated);
      if (newSettings.appTheme) {
        applyThemeToDom(newSettings.appTheme);
      }
    },
    setAppTheme: (theme) => {
      get().updateSettings({ appTheme: theme });
    },
    resetSettings: () => {
      set(DEFAULT_SETTINGS);
      storage.set('all_chess_settings', DEFAULT_SETTINGS);
      applyThemeToDom(DEFAULT_SETTINGS.appTheme);
    },
  };
});
