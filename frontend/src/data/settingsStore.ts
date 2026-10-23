import { create } from 'zustand';
import { storage } from '@/lib/storage';

export type AppTheme = 'dusk' | 'dawn' | 'system';
export type MotionLevel = 'full' | 'reduced' | 'off';
export type AnimationSpeed = 'off' | 'fast' | 'medium' | 'slow';
export type MoveMethod = 'both' | 'drag' | 'click';
export type CoordinateStyle = 'inside' | 'outside';
export type BackgroundStyle = 'standard' | 'felt' | 'wood';

export interface UserSettings {
  appTheme: AppTheme;
  motionLevel: MotionLevel;
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
  soundVolume: number; // 0 to 1
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
  motionLevel: 'full',
  boardThemeId: 'sand-clay',
  pieceSetId: 'staunty',
  background: 'standard',
  animationSpeed: 'medium',
  moveMethod: 'both',
  coordinates: 'inside',
  autoQueen: true,
  coachEnabled: true,
  coachVoiceEnabled: false,
  soundEnabled: true,
  soundVolume: 0.7,
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

// Bump when a default changes in a way existing users should pick up once.
const SETTINGS_VERSION = 2;

const getInitialSettings = (): UserSettings => {
  const stored = storage.get<Partial<UserSettings> & { settingsVersion?: number }>('all_chess_settings', {});
  const merged: UserSettings = { ...DEFAULT_SETTINGS, ...stored };
  if ((stored.settingsVersion ?? 1) < 2) {
    // v2: the old default piece set (thin outline) is replaced by the shaded default.
    if (!stored.pieceSetId || stored.pieceSetId === 'cburnett') merged.pieceSetId = DEFAULT_SETTINGS.pieceSetId;
    storage.set('all_chess_settings', { ...merged, settingsVersion: SETTINGS_VERSION });
  }
  return merged;
};

export const applyThemeToDom = (theme: AppTheme) => {
  let effective = theme;
  if (theme === 'system') {
    effective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dusk' : 'dawn';
  }
  document.documentElement.setAttribute('data-theme', effective);
};

export const applyMotionToDom = (motion: MotionLevel) => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-motion', motion);
  }
};

export const useSettingsStore = create<SettingsStore>((set, get) => {
  const initial = getInitialSettings();
  applyThemeToDom(initial.appTheme);
  applyMotionToDom(initial.motionLevel || 'full');

  return {
    ...initial,
    updateSettings: (newSettings) => {
      const updated = { ...get(), ...newSettings, settingsVersion: SETTINGS_VERSION };
      set(newSettings);
      storage.set('all_chess_settings', updated);
      if (newSettings.appTheme) {
        applyThemeToDom(newSettings.appTheme);
      }
      if (newSettings.motionLevel) {
        applyMotionToDom(newSettings.motionLevel);
      }
    },
    setAppTheme: (theme) => {
      get().updateSettings({ appTheme: theme });
    },
    resetSettings: () => {
      set(DEFAULT_SETTINGS);
      storage.set('all_chess_settings', DEFAULT_SETTINGS);
      applyThemeToDom(DEFAULT_SETTINGS.appTheme);
      applyMotionToDom(DEFAULT_SETTINGS.motionLevel);
    },
  };
});
