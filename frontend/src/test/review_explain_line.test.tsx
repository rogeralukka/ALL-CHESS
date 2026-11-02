import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useAuthStore } from '@/data/authStore';
import type { Game, Move } from '@/data/types';
import { ReviewBoard } from '@/features/review/ReviewBoard';

const mv = (i: number, san: string, from: string, to: string, fen: string, extra: Partial<Move> = {}): Move => ({
  moveNumber: Math.floor(i / 2) + 1,
  color: i % 2 === 0 ? 'w' : 'b',
  san,
  from,
  to,
  fen,
  classification: 'book',
  eval: { eval: 0.2, bestMove: san },
  ...extra,
});

// 1. e4 e5 2. Qh5 (a mistake). The engine line from BEFORE the move starts with Nf3, which is not even legal for Black
// after Qh5. The review data's own line (annotations.pv) is Black's refutation, legal from AFTER the move.
const game: Game = {
  id: 'g2',
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
      eval: { eval: -0.5, bestMove: 'Nf3', lines: [{ move: 'Nf3', eval: 0.3, depth: 14, pv: ['Nf3', 'Nc6', 'Bc4'] }] },
      annotations: { arrows: [], squares: [], pv: ['Nc6', 'Bc4', 'Nf6'], explain: ['Qh5 brings the queen out too early.', 'Nf3 was better.'] },
    }),
  ],
};

describe('Explain follows the review data line', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: { username: 'roger' } as never, isAuthenticated: true });
  });

  it('steps through the refutation from annotations.pv, not the engine line from before the move', () => {
    render(
      <MemoryRouter>
        <ReviewBoard game={game} onBackToSummary={() => {}} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByLabelText('Next Move'));
    fireEvent.click(screen.getByLabelText('Next Move'));
    fireEvent.click(screen.getByRole('button', { name: /Explain/ }));
    const text = document.body.textContent ?? '';
    expect(text).toContain('Next in the line: Nc6.');
    expect(text).not.toContain('Nf3.');
  });
});
