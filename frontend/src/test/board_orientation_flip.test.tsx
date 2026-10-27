import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { EvalBar } from '@/features/board/EvalBar';
import { ReviewBoard } from '@/features/review/ReviewBoard';
import { GameSummary } from '@/features/review/GameSummary';
import { PlayGame } from '@/features/play/PlayGame';
import type { Game } from '@/data/types';
import { useAuthStore } from '@/data/authStore';

const sampleBlackUserGame: Game = {
  id: 'game-7f0c27d796c4',
  source: 'online',
  white: { username: 'Lollati', rating: 650 },
  black: { username: 'You', rating: 700 },
  isUserWhite: false,
  result: '0-1',
  date: '2026-03-20',
  speed: 'blitz',
  timeControl: '3+0',
  pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 0-1',
  accuracy: { white: 60.4, black: 62.5 },
  moves: [
    {
      moveNumber: 1,
      color: 'w',
      san: 'e4',
      from: 'e2',
      to: 'e4',
      fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
      classification: 'book',
      eval: { eval: 0.2, bestMove: 'e4' },
    },
    {
      moveNumber: 1,
      color: 'b',
      san: 'e5',
      from: 'e7',
      to: 'e5',
      fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2',
      classification: 'book',
      eval: { eval: 0.2, bestMove: 'e5' },
    },
  ],
  opening: { eco: 'C50', name: 'Italian Game' },
};

describe('Board Orientation and Label Flipping', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: { username: 'roger' } as never, isAuthenticated: true });
  });

  describe('EvalBar direction and anchoring', () => {
    it('anchors white fill at bottom when orientation is white, and at top when orientation is black', () => {
      const { rerender } = render(<EvalBar evalScore={2.0} orientation="white" />);
      let fill = screen.getByTestId('eval-fill-white');
      expect(fill.className).toContain('bottom-0');
      expect(fill.className).not.toContain('top-0');

      rerender(<EvalBar evalScore={2.0} orientation="black" />);
      fill = screen.getByTestId('eval-fill-white');
      expect(fill.className).toContain('top-0');
      expect(fill.className).not.toContain('bottom-0');
    });

    it('positions the leading score text correctly and applies high-contrast styling', () => {
      // White is leading (+3.0) with orientation="white" (White at bottom)
      const { rerender } = render(<EvalBar evalScore={3.0} orientation="white" />);
      const bottomScore = screen.getByTestId('eval-score-bottom');
      expect(bottomScore.textContent).toBe('3.0');
      // Dark text on white fill at bottom
      expect(bottomScore.className).toContain('text-[#141312]');
      expect(screen.queryByTestId('eval-score-top')).toBeNull();

      // White is leading (+3.0) with orientation="black" (White at top)
      rerender(<EvalBar evalScore={3.0} orientation="black" />);
      const topScore = screen.getByTestId('eval-score-top');
      expect(topScore.textContent).toBe('3.0');
      // Dark text on white fill at top
      expect(topScore.className).toContain('text-[#141312]');
      expect(screen.queryByTestId('eval-score-bottom')).toBeNull();

      // Black is leading (-4.0) with orientation="white" (Black at top)
      rerender(<EvalBar evalScore={-4.0} orientation="white" />);
      const blackTopScore = screen.getByTestId('eval-score-top');
      expect(blackTopScore.textContent).toBe('4.0');
      // Light text on black background at top
      expect(blackTopScore.className).toContain('text-[#faf8f5]');
      expect(screen.queryByTestId('eval-score-bottom')).toBeNull();
    });
  });

  describe('ReviewBoard player labels and orientation flip', () => {
    it('orients to user colour (Black at bottom, You at bottom) and flips with button & key F', () => {
      render(
        <MemoryRouter>
          <ReviewBoard game={sampleBlackUserGame} onBackToSummary={() => {}} />
        </MemoryRouter>
      );

      // Initially, orientation follows user colour (Black at bottom)
      // Top player is White (Lollati), Bottom player is Black (You)
      const topBar = screen.getByTestId('player-top');
      const bottomBar = screen.getByTestId('player-bottom');
      expect(topBar.textContent).toContain('Lollati');
      expect(bottomBar.textContent).toContain('roger');

      // Click the Flip button
      const flipBtn = screen.getByRole('button', { name: /flip/i });
      fireEvent.click(flipBtn);

      // After flipping to White at bottom: Top is Black (You), Bottom is White (Lollati)
      expect(screen.getByTestId('player-top').textContent).toContain('roger');
      expect(screen.getByTestId('player-bottom').textContent).toContain('Lollati');

      // Press 'F' key to flip back
      fireEvent.keyDown(window, { key: 'f' });
      expect(screen.getByTestId('player-top').textContent).toContain('Lollati');
      expect(screen.getByTestId('player-bottom').textContent).toContain('roger');
    });
  });

  describe('GameSummary player labels and orientation flip', () => {
    it('orients to user colour and flips player bars on Flip button click', () => {
      render(
        <MemoryRouter>
          <GameSummary game={sampleBlackUserGame} onStartReview={() => {}} />
        </MemoryRouter>
      );

      // Initially Black at bottom: Top is White (Lollati), Bottom is Black (You)
      expect(screen.getByTestId('player-top').textContent).toContain('Lollati');
      expect(screen.getByTestId('player-bottom').textContent).toContain('roger');

      // Click Flip button
      const flipBtn = screen.getByRole('button', { name: /flip/i });
      fireEvent.click(flipBtn);

      // After flip: Top is You, Bottom is Lollati
      expect(screen.getByTestId('player-top').textContent).toContain('roger');
      expect(screen.getByTestId('player-bottom').textContent).toContain('Lollati');
    });
  });

  describe('PlayGame player labels and orientation flip', () => {
    it('swaps top and bottom player positions when board is flipped via F key', () => {
      render(
        <MemoryRouter>
          <PlayGame />
        </MemoryRouter>
      );

      // In default white orientation for user:
      // Top is Coach All-Chess, Bottom is You
      expect(screen.getByTestId('player-top').textContent).toContain('Coach All-Chess');
      expect(screen.getByTestId('player-bottom').textContent).toContain('roger');

      // Press 'F' key to flip orientation
      fireEvent.keyDown(window, { key: 'f' });

      // After flip: Top is You, Bottom is Coach All-Chess
      expect(screen.getByTestId('player-top').textContent).toContain('roger');
      expect(screen.getByTestId('player-bottom').textContent).toContain('Coach All-Chess');
    });
  });
});
