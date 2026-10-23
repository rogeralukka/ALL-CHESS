import { describe, it, expect, beforeEach } from 'vitest';
import { useSettingsStore } from '@/data/settingsStore';
import { sound } from '@/lib/sound';
import fs from 'fs';
import path from 'path';

describe('Phase 1.5 Motion, Sound & Feedback Suite', () => {
  beforeEach(() => {
    useSettingsStore.getState().resetSettings();
  });

  describe('Motion System & Store Configuration', () => {
    it('defaults to Full motion with support for Reduced and Off', () => {
      const state = useSettingsStore.getState();
      expect(state.motionLevel).toBe('full');

      state.updateSettings({ motionLevel: 'reduced' });
      expect(useSettingsStore.getState().motionLevel).toBe('reduced');

      state.updateSettings({ motionLevel: 'off' });
      expect(useSettingsStore.getState().motionLevel).toBe('off');
    });

    it('sets data-motion attribute on the DOM root element', () => {
      useSettingsStore.getState().updateSettings({ motionLevel: 'reduced' });
      expect(document.documentElement.getAttribute('data-motion')).toBe('reduced');

      useSettingsStore.getState().updateSettings({ motionLevel: 'full' });
      expect(document.documentElement.getAttribute('data-motion')).toBe('full');
    });
  });

  describe('Sound System Architecture', () => {
    it('has sound enabled by default with a volume of 0.7', () => {
      const state = useSettingsStore.getState();
      expect(state.soundEnabled).toBe(true);
      expect(state.soundVolume).toBe(0.7);
    });

    it('exposes all required sound methods without crashing in jsdom', () => {
      expect(typeof sound.move).toBe('function');
      expect(typeof sound.capture).toBe('function');
      expect(typeof sound.check).toBe('function');
      expect(typeof sound.castle).toBe('function');
      expect(typeof sound.promote).toBe('function');
      expect(typeof sound.illegal).toBe('function');
      expect(typeof sound.gameEnd).toBe('function');
      expect(typeof sound.puzzleCorrect).toBe('function');
      expect(typeof sound.puzzleWrong).toBe('function');

      // Calling them does not throw
      expect(() => {
        sound.move();
        sound.capture();
        sound.check();
        sound.castle();
        sound.promote();
        sound.illegal();
        sound.gameEnd();
        sound.puzzleCorrect();
        sound.puzzleWrong();
      }).not.toThrow();
    });
  });

  describe('Tokens & Bevelled Styling Integrity', () => {
    it('defines primary and secondary bevelled button tokens and motion levels in tokens.css', () => {
      const tokensPath = path.resolve(__dirname, '../styles/tokens.css');
      const css = fs.readFileSync(tokensPath, 'utf-8');

      expect(css).toContain('--btn-primary-bg: linear-gradient(180deg, #f6b13a 0%, #e8920a 100%)');
      expect(css).toContain('--btn-primary-hover-bg');
      expect(css).toContain('--btn-primary-active-bg');
      expect(css).toContain('--btn-primary-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4)');
      expect(css).toContain('--btn-secondary-bg');
      expect(css).toContain(':root[data-motion="full"]');
      expect(css).toContain(':root[data-motion="reduced"]');
      expect(css).toContain(':root[data-motion="off"]');
    });
  });
});
