import { describe, it, expect } from 'vitest';
import {
  statsRepository,
  scoutRepository,
  friendRepository,
} from '@/data/repositories';
import { BOARD_THEMES, BOARD_PRESETS, PIECE_SETS } from '@/data/boardThemes';

describe('ALL-CHESS Step 1D: Profile, Scout, Settings Suite', () => {
  describe('Stats & Profile Repository', () => {
    it('returns rating history points with rapid, blitz, and bullet ratings', async () => {
      const history = await statsRepository.getRatingHistory();
      expect(history.length).toBeGreaterThan(0);
      for (const pt of history) {
        expect(pt.date).toBeDefined();
        expect(pt.rapid).toBeGreaterThan(500);
        expect(pt.blitz).toBeGreaterThan(500);
        expect(pt.bullet).toBeGreaterThan(500);
      }
    });

    it('returns opening stats with valid ECO codes and win rates', async () => {
      const openings = await statsRepository.getOpeningStats();
      expect(openings.length).toBeGreaterThan(0);
      for (const op of openings) {
        expect(op.eco).toMatch(/^[A-E]\d{2}$/);
        expect(op.games).toBeGreaterThan(0);
        expect(op.winRate).toBeGreaterThanOrEqual(0);
        expect(op.winRate).toBeLessThanOrEqual(100);
      }
    });

    it('returns phase points lost for opening, middlegame, and endgame', async () => {
      const phaseLoss = await statsRepository.getPhasePointsLost();
      expect(phaseLoss.opening).toBeGreaterThan(0);
      expect(phaseLoss.middlegame).toBeGreaterThan(0);
      expect(phaseLoss.endgame).toBeGreaterThan(0);
    });

    it('returns strengths and weaknesses with labels and deltas', async () => {
      const sw = await statsRepository.getStrengthsAndWeaknesses();
      expect(sw.strengths.length).toBeGreaterThan(0);
      expect(sw.weaknesses.length).toBeGreaterThan(0);
      expect(sw.strengths[0].delta).toContain('+');
      expect(sw.weaknesses[0].delta).toContain('-');
    });
  });

  describe('Scout Repository', () => {
    it('searches profiles by username query case-insensitively', async () => {
      const results = await scoutRepository.searchProfiles('pawn');
      expect(results.length).toBe(1);
      expect(results[0].username).toBe('PawnStorm22');
    });

    it('fetches full scout profile with opening repertoire and recent games', async () => {
      const profile = await scoutRepository.getProfile('PawnStorm22');
      expect(profile).toBeDefined();
      expect(profile?.rating).toBe(920);
      expect(profile?.winRate).toBeGreaterThan(50);
      expect(profile?.mostPlayed.length).toBeGreaterThan(0);
      expect(profile?.recentGames.length).toBeGreaterThan(0);
    });
  });

  describe('Friends Repository', () => {
    it('retrieves friends with online status and ratings', async () => {
      const friends = await friendRepository.getFriends();
      expect(friends.length).toBe(3);
      expect(friends.some((f) => f.online)).toBe(true);
      expect(friends.every((f) => f.rating > 0)).toBe(true);
    });
  });

  describe('Board & Settings Configurations', () => {
    it('ships exactly 8 board themes as required by Section 3.4', () => {
      expect(BOARD_THEMES.length).toBe(8);
      const themeIds = BOARD_THEMES.map((t) => t.id);
      expect(themeIds).toContain('sand-clay');
      expect(themeIds).toContain('classic-green');
      expect(themeIds).toContain('brown');
      expect(themeIds).toContain('icy-sea');
      expect(themeIds).toContain('walnut');
      expect(themeIds).toContain('slate');
      expect(themeIds).toContain('paper');
      expect(themeIds).toContain('blue');
    });

    it('ships 6 board presets and open-license piece set', () => {
      expect(BOARD_PRESETS.length).toBe(6);
      expect(PIECE_SETS.length).toBeGreaterThan(0);
      expect(PIECE_SETS[0].id).toBe('cburnett');
      expect(PIECE_SETS[0].license).toContain('CC BY-SA 3.0');
    });
  });
});
