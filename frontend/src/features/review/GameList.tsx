import React, { useState, useEffect } from 'react';
import { Game } from '@/data/types';
import { gameRepository, GameFilter } from '@/data/repositories';
import { Button } from '@/components/Button';
import { InlineLoader } from '@/components/LoadingScreen';
import { Segmented } from '@/components/Segmented';
import { PageContainer } from '@/components/PageHeader';
import { PageTitle, StatTile } from '@/components/ListUI';
import { GameHistoryTable } from '@/components/GameHistoryTable';
import { CoachAvatar } from '@/features/coach/CoachAvatar';
import { Search, Swords, Trophy, Percent, Target } from 'lucide-react';

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
      <PageTitle
        icon="/assets/ui/icon_review.webp"
        title="Game Review"
        subtitle="Pick a game and the coach walks you through every move and shows you the better line."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile icon={<Swords size={22} className="text-[#5ec1e6]" />} value={loading ? '–' : games.length} label="Games" />
        <StatTile icon={<Trophy size={22} className="text-[#81b64c]" />} value={loading ? '–' : wins} label="Wins" />
        <StatTile icon={<Percent size={22} className="text-[#f7c631]" />} value={loading || !games.length ? '–' : `${Math.round((wins / games.length) * 100)}%`} label="Win rate" />
        <StatTile icon={<Target size={22} className="text-[#f7a531]" />} value={loading || !accs.length ? '–' : `${avgAcc.toFixed(1)}%`} label="Avg accuracy" />
      </div>

      <section className="cc-card overflow-hidden">
        <div className="p-3 md:p-4 flex flex-col xl:flex-row xl:items-center gap-3 border-b border-theme-border">
          <div className="relative xl:w-72 flex-shrink-0">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Opponent or opening"
              aria-label="Search games"
              className="w-full h-11 pl-10 pr-3 rounded-[5px] bg-[var(--input-bg)] border border-transparent text-[14px] font-semibold text-theme-text placeholder:text-theme-muted focus:outline-none focus-visible:!outline-none focus:border-[#81b64c] transition-colors"
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
          <InlineLoader label="Loading your games…" size={110} className="py-12" />
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
      </section>
    </PageContainer>
  );
};

export default GameList;
