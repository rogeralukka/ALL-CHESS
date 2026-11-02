import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useAuthStore } from '@/data/authStore';
import type { Game } from '@/data/types';

const mk = (id: string, platform: Game['platform'], source: string, opp: string) =>
  ({
    id,
    platform,
    source,
    isUserWhite: true,
    white: { username: 'roger', rating: 900 },
    black: { username: opp, rating: 900 },
    result: '1-0',
    speed: 'rapid',
    date: '2026-10-20T10:00:00Z',
    moves: [],
    opening: { eco: 'A00', name: 'Test opening' },
  }) as unknown as Game;

const GAMES = [
  mk('a', 'chesscom', 'online', 'ChessComFoe'),
  mk('b', 'chesscom', 'online', 'ChessComFoe2'),
  mk('c', 'lichess', 'online', 'LichessFoe'),
  mk('d', 'coach', 'vs_coach', 'CoachBot'),
];

vi.mock('@/data/repositories', async (orig) => {
  const mod = await orig<typeof import('@/data/repositories')>();
  return { ...mod, gameRepository: { getGames: vi.fn(async () => GAMES), getGameById: vi.fn() } };
});

import { GameList } from '@/features/review/GameList';

const renderList = () =>
  render(
    <MemoryRouter>
      <GameList onSelectGame={() => {}} />
    </MemoryRouter>,
  );

describe('Review page source tabs', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: { id: 'u', username: 'roger', chesscomUsername: 'roger', lichessUsername: null } as never, isAuthenticated: true });
  });

  it('shows All / Chess.com / Lichess / ALL-CHESS with counts', async () => {
    renderList();
    await waitFor(() => expect(screen.getByTestId('history-tab-all').textContent).toContain('4'));
    expect(screen.getByTestId('history-tab-chesscom').textContent).toContain('2');
    expect(screen.getByTestId('history-tab-lichess').textContent).toContain('1');
    expect(screen.getByTestId('history-tab-allchess').textContent).toContain('1');
  });

  it('narrows the list and the stat tiles to the chosen source', async () => {
    renderList();
    await waitFor(() => expect(screen.getAllByText(/ChessComFoe/).length).toBeGreaterThan(0));
    fireEvent.click(screen.getByTestId('history-tab-lichess'));
    await waitFor(() => expect(screen.queryByText(/ChessComFoe/)).toBeNull());
    expect(screen.getAllByText(/LichessFoe/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/CoachBot/)).toBeNull();
  });

  it('explains an empty section instead of saying nothing matched', async () => {
    useAuthStore.setState({ user: { id: 'u', username: 'roger', chesscomUsername: 'roger', lichessUsername: null } as never, isAuthenticated: true });
    const { gameRepository } = await import('@/data/repositories');
    (gameRepository.getGames as ReturnType<typeof vi.fn>).mockResolvedValueOnce(GAMES.filter((g) => g.platform !== 'lichess'));
    renderList();
    await waitFor(() => expect(screen.getByTestId('history-tab-lichess').textContent).toContain('0'));
    fireEvent.click(screen.getByTestId('history-tab-lichess'));
    expect(await screen.findByTestId('history-empty')).toBeTruthy();
    expect(screen.getByTestId('history-empty').textContent).toMatch(/No Lichess account linked/);
  });
});
