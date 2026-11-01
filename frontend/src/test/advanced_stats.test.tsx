import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AdvancedStats } from '@/features/stats/AdvancedStats';
import { AreaChart, GradeBadge } from '@/features/stats/StatBits';
import { buildStatsUrl } from '@/features/stats/advancedStatsApi';

const get = vi.fn();
vi.mock('@/data/api', () => ({ api: { get: (...a: unknown[]) => get(...a) } }));

const overview = {
  rating: 1405,
  ratingDelta: 42,
  history: [
    { date: '2026-10-01', rating: 1360 },
    { date: '2026-10-09', rating: 1405 },
  ],
  games: 20,
  wins: 12,
  draws: 2,
  losses: 6,
  winPct: 60,
  drawPct: 10,
  lossPct: 30,
  scores: { openings: 1450, tactics: null, strategy: 1480, endgames: null },
};

beforeEach(() => get.mockReset());

describe('advanced stats', () => {
  it('builds the endpoint url with mode, range, colour and side', () => {
    expect(buildStatsUrl('tactics', { mode: 'rapid', range: '30d', side: 'allowed' })).toBe('/stats/advanced/tactics?mode=rapid&range=30d&side=allowed');
  });

  it('shows rating, game tallies and area scores on the overview, and leaves unknown scores blank', async () => {
    get.mockResolvedValue(overview);
    render(
      <MemoryRouter initialEntries={['/stats?mode=rapid&range=90d']}>
        <AdvancedStats />
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByTestId('stats-rating')).toHaveTextContent('1405'));
    expect(get).toHaveBeenCalledWith('/stats/advanced/overview?mode=rapid&range=90d');
    expect(screen.getByText('1450')).toBeInTheDocument();
    expect(screen.getAllByText('–').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByTestId('stats-areas')).toBeInTheDocument();
  });

  it('switching tab and range reloads with the new query and labels peers as estimates', async () => {
    const strategy = {
      overall: { value: 70, peers: 80, grade: 'C' },
      pawnStructure: { value: null, peers: 80, grade: null },
      attacking: { value: 60, peers: 75, grade: 'C' },
      defending: { value: 50, peers: 70, grade: 'D' },
      activePiece: { value: 55, peers: 70, grade: 'D' },
      spaceAdvantage: { value: null, peers: 70, grade: null },
      peersEstimated: true,
    };
    get.mockImplementation((url?: string) => Promise.resolve(String(url ?? '').includes('/overview') ? overview : strategy));
    render(
      <MemoryRouter initialEntries={['/stats']}>
        <AdvancedStats />
      </MemoryRouter>,
    );
    fireEvent.click(await screen.findByRole('tab', { name: 'Strategy' }));
    await waitFor(() => expect(screen.getByTestId('stats-strategy')).toBeInTheDocument());
    expect(get).toHaveBeenCalledWith('/stats/advanced/strategy?mode=all&range=90d');
    expect(screen.getAllByText(/PEERS \(EST\.\)/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: '30D' }));
    await waitFor(() => expect(get).toHaveBeenCalledWith('/stats/advanced/strategy?mode=all&range=30d'));
  });
});

describe('stat widgets', () => {
  it('area chart shows an empty message with no points and plots when there are some', () => {
    const { rerender } = render(<AreaChart points={[]} ariaLabel="x" />);
    expect(screen.getByTestId('chart-empty')).toBeInTheDocument();
    rerender(<AreaChart points={[{ label: 'a', value: 1 }, { label: 'b', value: 3 }]} ariaLabel="x" />);
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
  });

  it('grade badge renders the letter, or a dash when there is no grade', () => {
    const { rerender } = render(<GradeBadge grade="B" />);
    expect(screen.getByLabelText('Grade B')).toBeInTheDocument();
    rerender(<GradeBadge grade={null} />);
    expect(screen.getByText('–')).toBeInTheDocument();
  });
});
