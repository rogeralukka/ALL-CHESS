import React, { useState, useEffect } from 'react';
import { Game } from '@/data/types';
import { gameRepository, GameFilter } from '@/data/repositories';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Skeleton } from '@/components/Skeleton';
import { Segmented } from '@/components/Segmented';
import { CoachAvatar } from '@/features/coach/CoachAvatar';
import { Search, Filter, Calendar, ChevronRight } from 'lucide-react';
import { formatDate } from '@/lib/formatters';

interface GameListProps {
  onSelectGame: (gameId: string) => void;
}

export const GameList: React.FC<GameListProps> = ({ onSelectGame }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [speedFilter, setSpeedFilter] = useState<'all' | 'rapid' | 'blitz' | 'bullet'>('all');
  const [colorFilter, setColorFilter] = useState<'all' | 'white' | 'black'>('all');
  const [resultFilter, setResultFilter] = useState<'all' | 'win' | 'loss' | 'draw'>('all');

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const filter: GameFilter = {
      searchQuery,
      speed: speedFilter,
      color: colorFilter,
      result: resultFilter,
    };

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

  return (
    <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-theme-text">
            Game History &amp; Review
          </h1>
          <p className="text-sm text-theme-muted mt-1">
            Choose a game to inspect move classifications, engine evaluations, and coach insights.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search opponent or opening..."
            className="w-full pl-9 pr-4 py-2 bg-theme-card border border-theme-border rounded-md text-sm text-theme-text placeholder:text-theme-muted focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-theme-card/60 p-3 rounded-lg border border-theme-border/60">
        <div className="flex items-center gap-1.5 text-xs font-bold text-theme-muted mr-1">
          <Filter size={14} />
          <span>Filters:</span>
        </div>

        {/* Speed / Time Control */}
        <Segmented<'all' | 'rapid' | 'blitz' | 'bullet'>
          size="sm"
          value={speedFilter}
          onChange={(v) => setSpeedFilter(v)}
          options={[
            { value: 'all', label: 'All Speed' },
            { value: 'rapid', label: 'Rapid' },
            { value: 'blitz', label: 'Blitz' },
            { value: 'bullet', label: 'Bullet' },
          ]}
        />

        {/* Color */}
        <Segmented<'all' | 'white' | 'black'>
          size="sm"
          value={colorFilter}
          onChange={(v) => setColorFilter(v)}
          options={[
            { value: 'all', label: 'All Colors' },
            { value: 'white', label: 'White' },
            { value: 'black', label: 'Black' },
          ]}
        />

        {/* Result */}
        <Segmented<'all' | 'win' | 'loss' | 'draw'>
          size="sm"
          value={resultFilter}
          onChange={(v) => setResultFilter(v)}
          options={[
            { value: 'all', label: 'All Results' },
            { value: 'win', label: 'Wins' },
            { value: 'loss', label: 'Losses' },
            { value: 'draw', label: 'Draws' },
          ]}
        />
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={`skel-${i}`} className="space-y-3">
              <div className="flex justify-between">
                <Skeleton width={80} height={18} />
                <Skeleton width={40} height={18} />
              </div>
              <Skeleton width="70%" height={24} />
              <Skeleton width="50%" height={16} />
              <Skeleton width="100%" height={28} />
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && games.length === 0 && (
        <Card className="flex flex-col items-center justify-center p-10 text-center space-y-4">
          <CoachAvatar expression="thinking" mode="bust" size={80} />
          <div>
            <h3 className="text-lg font-bold font-display text-theme-text">No Matching Games Found</h3>
            <p className="text-sm text-theme-muted mt-1 max-w-sm">
              We couldn't find any games matching your current filters. Try resetting your search or filter tags.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              setSearchQuery('');
              setSpeedFilter('all');
              setColorFilter('all');
              setResultFilter('all');
            }}
          >
            Reset All Filters
          </Button>
        </Card>
      )}

      {/* Games Grid */}
      {!loading && games.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((g) => {
            const isWhite = g.white.username === 'You';
            const userWon = (isWhite && g.result === '1-0') || (!isWhite && g.result === '0-1');
            const userLost = (isWhite && g.result === '0-1') || (!isWhite && g.result === '1-0');

            const resultBadgeColor = userWon
              ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
              : userLost
              ? 'bg-red-500/15 text-red-500 border-red-500/30'
              : 'bg-theme-raised text-theme-muted border-theme-border';

            const resultText = userWon ? 'Win' : userLost ? 'Loss' : 'Draw';

            return (
              <div
                key={g.id}
                onClick={() => onSelectGame(g.id)}
                className="group cursor-pointer"
              >
                <Card className="hover:border-amber-500/60 hover:bg-theme-raised/60 transition-colors duration-100 hover:shadow-lg space-y-3 relative overflow-hidden">
                  {/* Top Bar: Speed & Result */}
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="font-bold text-amber-500 uppercase tracking-wide">
                      {g.speed} • {g.timeControl}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${resultBadgeColor}`}>
                        {resultText}
                      </span>
                      <span className="font-mono text-theme-muted font-bold">{g.result}</span>
                    </div>
                  </div>

                  {/* Players Row */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isWhite ? 'font-black text-theme-text' : 'font-medium text-theme-muted'}`}>
                        ⚪ {g.white.username} ({g.white.rating})
                      </span>
                      {g.accuracy && (
                        <span className="text-xs font-mono font-bold text-emerald-500">
                          {g.accuracy.white}%
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${!isWhite ? 'font-black text-theme-text' : 'font-medium text-theme-muted'}`}>
                        ⚫ {g.black.username} ({g.black.rating})
                      </span>
                      {g.accuracy && (
                        <span className="text-xs font-mono font-bold text-sky-500">
                          {g.accuracy.black}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Opening and Date */}
                  <div className="pt-2 border-t border-theme-border/50 flex items-center justify-between text-xs text-theme-muted">
                    <span className="truncate max-w-[200px]" title={g.opening.name}>
                      {g.opening.name}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Calendar size={12} />
                      {formatDate(g.date)}
                    </span>
                  </div>

                  {/* Hover indicator */}
                  <div className="flex items-center justify-end text-xs font-bold text-amber-500 pt-1 group-hover:translate-x-1 transition-transform">
                    <span>Review Game</span>
                    <ChevronRight size={14} />
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
