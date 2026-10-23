import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTypewriter } from '@/lib/useTypewriter';
import { moveListReducer, MoveListState } from '@/features/review/moveListReducer';
import fs from 'fs';
import path from 'path';

describe('ALL-CHESS P1 Fixes & Polish Suite', () => {
  describe('MoveList / Variation Reducer', () => {
    it('manages sequential navigation through main line moves', () => {
      let state: MoveListState = { currentMoveIndex: -1, activeVariation: null };

      // Step next
      state = moveListReducer(state, { type: 'NEXT_MOVE', maxIndex: 10 });
      expect(state.currentMoveIndex).toBe(0);

      // Step next again
      state = moveListReducer(state, { type: 'NEXT_MOVE', maxIndex: 10 });
      expect(state.currentMoveIndex).toBe(1);

      // Step prev
      state = moveListReducer(state, { type: 'PREV_MOVE' });
      expect(state.currentMoveIndex).toBe(0);

      // Step prev at start clamps to -1
      state = moveListReducer(state, { type: 'PREV_MOVE' });
      expect(state.currentMoveIndex).toBe(-1);
      state = moveListReducer(state, { type: 'PREV_MOVE' });
      expect(state.currentMoveIndex).toBe(-1);

      // Select specific move index directly
      state = moveListReducer(state, { type: 'SELECT_MOVE', index: 6 });
      expect(state.currentMoveIndex).toBe(6);
    });

    it('handles starting, stepping through, and exiting variations', () => {
      let state: MoveListState = { currentMoveIndex: 5, activeVariation: null };

      // Start refutation variation
      state = moveListReducer(state, {
        type: 'START_VARIATION',
        parentMoveIndex: 5,
        moves: ['Kxf7', 'Ng5+', 'Kg8'],
        title: 'Refutation of 6. Bxf7+',
      });

      expect(state.activeVariation).not.toBeNull();
      expect(state.activeVariation?.stepIndex).toBe(0);
      expect(state.activeVariation?.moves.length).toBe(3);

      // Step forward inside variation
      state = moveListReducer(state, { type: 'NEXT_VARIATION_STEP' });
      expect(state.activeVariation?.stepIndex).toBe(1);

      state = moveListReducer(state, { type: 'NEXT_VARIATION_STEP' });
      expect(state.activeVariation?.stepIndex).toBe(2);

      // Clamps at end of variation
      state = moveListReducer(state, { type: 'NEXT_VARIATION_STEP' });
      expect(state.activeVariation?.stepIndex).toBe(2);

      // Step backward inside variation
      state = moveListReducer(state, { type: 'PREV_VARIATION_STEP' });
      expect(state.activeVariation?.stepIndex).toBe(1);

      // Exit variation returns back to main line
      state = moveListReducer(state, { type: 'EXIT_VARIATION' });
      expect(state.activeVariation).toBeNull();
      expect(state.currentMoveIndex).toBe(5);
    });
  });

  describe('Typewriter Hook', () => {
    it('immediately outputs full text and completes when prefersReducedMotion is true', () => {
      const { result } = renderHook(() =>
        useTypewriter({
          text: 'Tactical blunder! The king can just capture.',
          speed: 40,
          prefersReducedMotion: true,
        })
      );

      expect(result.current.displayedText).toBe('Tactical blunder! The king can just capture.');
      expect(result.current.isComplete).toBe(true);
    });

    it('instantly reveals full text when skip() is invoked', () => {
      const fullText = 'Bxf7+ is a blunder giving away the bishop.';
      const { result } = renderHook(() =>
        useTypewriter({
          text: fullText,
          speed: 10, // Slow speed so it does not finish immediately
          prefersReducedMotion: false,
        })
      );

      act(() => {
        result.current.skip();
      });

      expect(result.current.displayedText).toBe(fullText);
      expect(result.current.isComplete).toBe(true);
    });
  });

  describe('Theme Tokens Verification', () => {
    it('resolves distinct and valid CSS tokens for both dusk and dawn themes', () => {
      const tokensCssPath = path.resolve(__dirname, '../styles/tokens.css');
      const cssContent = fs.readFileSync(tokensCssPath, 'utf-8');

      // Check Dusk theme tokens
      expect(cssContent).toContain(':root[data-theme="dusk"]');
      // phase 1.9: warm charcoal page with darker panels on top
      expect(cssContent).toMatch(/--color-page:\s*#2a2825/);
      expect(cssContent).toMatch(/--color-card:\s*#201e1c/);
      expect(cssContent).toMatch(/--color-raised:\s*#36332f/);
      expect(cssContent).toMatch(/--color-accent:\s*#f59e0b/);

      // Check Dawn theme tokens
      expect(cssContent).toContain(':root[data-theme="dawn"]');
      expect(cssContent).toMatch(/--color-page:\s*#f4f1ec/);
      expect(cssContent).toMatch(/--color-card:\s*#ffffff/);
      expect(cssContent).toMatch(/--color-raised:\s*#f2efe9/);

      // Check classification tokens
      expect(cssContent).toContain('--class-brilliant');
      expect(cssContent).toContain('--class-blunder');
      expect(cssContent).toContain('--class-best');
      expect(cssContent).toContain('--class-mistake');
      expect(cssContent).toContain('--class-inaccuracy');

      // Check reduced motion media query tokens
      expect(cssContent).toContain('@media (prefers-reduced-motion: reduce)');
      expect(cssContent).toContain('--motion-standard: 0ms !important');
    });
  });
});
