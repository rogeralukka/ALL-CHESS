import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useAuthStore } from '@/data/authStore';
import type { Game, Move } from '@/data/types';

// the phone layout is switched on and off per test
const layout = { phone: false };
vi.mock('@/lib/useMediaQuery', async (orig) => {
  const mod = await orig<typeof import('@/lib/useMediaQuery')>();
  return { ...mod, usePhoneLayout: () => layout.phone, useMediaQuery: () => layout.phone };
});

import { ReviewBoard } from '@/features/review/ReviewBoard';

const mv = (i: number, san: string, from: string, to: string, fen: string, extra: Partial<Move> = {}): Move => ({
  moveNumber: Math.floor(i / 2) + 1,
  color: i % 2 === 0 ? 'w' : 'b',
  san,
  from,
  to,
  fen,
  classification: 'good',
  eval: { eval: 0.2, bestMove: san },
  ...extra,
});

const game: Game = {
  id: 'g1',
  source: 'online',
  platform: 'chesscom',
  white: { username: 'roger', rating: 900 },
  black: { username: 'foe', rating: 900 },
  isUserWhite: true,
  result: '1-0',
  date: '2026-11-01',
  speed: 'rapid',
  timeControl: '10+0',
  pgn: '',
  accuracy: { white: 80, black: 70 },
  opening: { eco: 'C20', name: 'King pawn' },
  moves: [
    mv(0, 'e4', 'e2', 'e4', 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'),
    mv(1, 'e5', 'e7', 'e5', 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2'),
    mv(2, 'Qh5', 'd1', 'h5', 'rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2', {
      classification: 'mistake',
      annotations: { arrows: [], squares: [], explain: ['Qh5 is a mistake.', 'Nf3 was better.'] },
    }),
    mv(3, 'Nc6', 'b8', 'c6', 'r1bqkbnr/pppp1ppp/2n5/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR w KQkq - 2 3'),
  ],
};

const renderBoard = () =>
  render(
    <MemoryRouter>
      <ReviewBoard game={game} onBackToSummary={() => {}} />
    </MemoryRouter>,
  );

describe('Show is an on/off switch like Best', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: { username: 'roger' } as never, isAuthenticated: true });
  });

  it('desktop: stays on when you step to the next move, until you switch it off', () => {
    layout.phone = false;
    renderBoard();
    const show = () => screen.getByTestId('desktop-show');
    expect(show().getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(show());
    expect(show().getAttribute('aria-pressed')).toBe('true');
    expect(show().textContent).toMatch(/Show: on/);
    fireEvent.click(screen.getByLabelText('Next Move'));
    fireEvent.click(screen.getByLabelText('Next Move'));
    expect(show().getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(show());
    expect(show().getAttribute('aria-pressed')).toBe('false');
  });

  it('phone: Show stays on across moves and Explain is its own button on a mistake', () => {
    layout.phone = true;
    renderBoard();
    fireEvent.click(screen.getByTestId('mobile-show'));
    expect(screen.getByTestId('mobile-show').getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByTestId('mobile-next'));
    fireEvent.click(screen.getByTestId('mobile-next'));
    // now on Qh5, a mistake with an explanation
    expect(screen.getByTestId('mobile-show').getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByTestId('mobile-explain')).toBeTruthy();
  });
});
