import React, { useState, useEffect } from 'react';
import { Game } from '@/data/types';
import { gameRepository, GameFilter } from '@/data/repositories';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Skeleton } from '@/components/Skeleton';
import { Segmented } from '@/components/Segmented';
import { PageContainer, PageHeader } from '@/components/PageHeader';
import { Pill, StatTile } from '@/components/Bits';
import { GameHistoryTable } from '@/components/GameHistoryTable';
import { CoachAvatar } from '@/features/coach/CoachAvatar';
import { Search } from 'lucide-react';

interface GameListProps {
  onSelectGame: (gameId: string) => void;
}

export const GameList: React.FC<GameListProps> = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [speedFilter, setSpeedFilter] = useState<'all' | 'rapid' | 'blitz' | 'bullet'>('all');
  const [colorFilter, setColorFilter] = useState<'all' | 'white' | 'black'>('all');
  const [resultFilter, setResultFilter] = useState<'all' | 'win' | 'loss' | 'draw'>('all');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const filter: GameFilter = { searchQuery, speed: speedFilter, color: colorFilter, result: resultFilter };
    gameRepository.getGames(filter).then((res) => {
      if (mounted) {
        setGames(res);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [searchQuery, speedFilter, colorFilter, resultFilter]);

  const you = (g: Game) => (g.white.username === 'You' ? 'w' : 'b');
  const wins = games.filter((g) => (you(g) === 'w' && g.result === '1-0') || (you(g) === 'b' && g.result === '0-1')).length;
  const accs = games.map((g) => (you(g) === 'w' ? g.accuracy?.white : g.accuracy?.black)).filter((v): v is number => typeof v === 'number');
  const avgAcc = accs.length ? accs.reduce((a, b) => a + b, 0) / accs.length : 0;

  const reset = () => {
    setSearchQuery('');
    setSpeedFilter('all');
    setColorFilter('all');
    setResultFilter('all');
  };

  return (
    <PageContainer wide>
      <PageHeader
        title="Game review"
        subtitle="Pick a game. The coach walks you through every move, finds the turning points and shows you the better line."
        art="/assets/ui/hero_review.webp"
        tint="rgba(90,169,230,0.16)"
        eyebrow={<Pill tone="blue">Your games</Pill>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile label="Games" value={loading ? '–' : games.length} />
        <StatTile label="Wins" value={loading ? '–' : wins} accent="var(--class-best)" />
        <StatTile label="Win rate" value={loading || !games.length ? '–' : `${Math.round((wins / games.length) * 100)}%`} />
        <StatTile label="Avg accuracy" value={loading || !accs.length ? '–' : `${avgAcc.toFixed(1)}%`} accent="#f5a524" />
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="p-3 md:p-4 flex flex-col xl:flex-row xl:items-center gap-3 border-b border-theme-border">
          <div className="relative xl:w-72 flex-shrink-0">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Opponent or opening"
              aria-label="Search games"
              className="w-full h-11 pl-10 pr-3 rounded-[10px] bg-black/[0.04] dark:bg-black/25 border border-theme-border text-[14px] font-semibold text-theme-text placeholder:text-theme-muted/80 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Segmented<'all' | 'rapid' | 'blitz' | 'bullet'>
              size="sm"
              value={speedFilter}
              onChange={setSpeedFilter}
              options={[
                { value: 'all', label: 'All speeds' },
                { value: 'rapid', label: 'Rapid' },
                { value: 'blitz', label: 'Blitz' },
                { value: 'bullet', label: 'Bullet' },
              ]}
            />
            <Segmented<'all' | 'white' | 'black'>
              size="sm"
              value={colorFilter}
              onChange={setColorFilter}
              options={[
                { value: 'all', label: 'Both colours' },
                { value: 'white', label: 'White' },
                { value: 'black', label: 'Black' },
              ]}
            />
            <Segmented<'all' | 'win' | 'loss' | 'draw'>
              size="sm"
              value={resultFilter}
              onChange={setResultFilter}
              options={[
                { value: 'all', label: 'All results' },
                { value: 'win', label: 'Wins' },
                { value: 'loss', label: 'Losses' },
                { value: 'draw', label: 'Draws' },
              ]}
            />
          </div>
        </div>

        {loading && (
          <div className="p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} height={52} />
            ))}
          </div>
        )}

        {!loading && games.length === 0 && (
          <div className="flex flex-col items-center justify-center p-10 text-center gap-4">
            <CoachAvatar expression="thinking" mode="bust" size={88} />
            <div>
              <h3 className="text-lg font-black font-display text-theme-text">No games match</h3>
              <p className="text-sm text-theme-muted mt-1 max-w-sm">Nothing fits these filters. Clear them to see every game again.</p>
            </div>
            <Button variant="secondary" onClick={reset}>
              Clear filters
            </Button>
          </div>
        )}

        {!loading && games.length > 0 && <GameHistoryTable games={games} />}
      </Card>
    </PageContainer>
  );
};

export default GameList;
