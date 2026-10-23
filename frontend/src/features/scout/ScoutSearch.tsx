import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { MOCK_SCOUT_PROFILES } from '@/data/mock/mockScout';
import { ScoutProfile } from './ScoutProfile';
import { ScoutProfile as ScoutProfileType } from '@/data/types';
import { Search, UserCheck, Shield, Sparkles, X } from 'lucide-react';

export const ScoutSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOpponent, setSelectedOpponent] = useState<ScoutProfileType | null>(null);

  const allProfiles = Object.values(MOCK_SCOUT_PROFILES);

  const filteredProfiles = allProfiles.filter((p) =>
    p.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedOpponent) {
    return <ScoutProfile profile={selectedOpponent} onBack={() => setSelectedOpponent(null)} />;
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black font-display text-theme-text">Opponent Scout &amp; Prep</h1>
        <p className="text-sm text-theme-muted mt-1">
          Explore opening repertoires, tactical tendencies, and win rates without needing authentication.
        </p>
      </div>

      {/* Search Bar & Quick Pick Chips */}
      <Card className="p-5 space-y-4">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search opponent username (e.g. PawnStorm22, GM_Example)..."
            className="w-full pl-10 pr-10 py-3 bg-theme-raised border border-theme-border rounded-lg text-theme-text placeholder:text-theme-muted focus:outline-none focus:border-amber-500 transition-colors text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-text"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Quick Picks */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-theme-muted font-medium">Quick scout:</span>
          {allProfiles.map((p) => (
            <button
              key={p.username}
              type="button"
              onClick={() => setSelectedOpponent(p)}
              className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-full bg-theme-raised hover:bg-theme-card border border-theme-border text-theme-text font-medium flex items-center gap-1.5 transition-colors"
            >
              <UserCheck size={14} className="text-amber-500" />
              <span>{p.username}</span>
              <span className="text-xs text-theme-muted font-mono">({p.rating})</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Scout Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredProfiles.map((p) => (
          <Card key={p.username} className="p-5 space-y-4 hover:border-amber-500/50 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-theme-raised border border-theme-border flex items-center justify-center font-bold text-amber-500 font-display">
                  {p.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase font-bold text-theme-muted">Rating</div>
                  <div className="text-base font-black font-mono text-amber-500">{p.rating}</div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-base text-theme-text flex items-center gap-1.5">
                  {p.username}
                  {p.title && (
                    <span className="text-xs bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded font-black">
                      {p.title}
                    </span>
                  )}
                </h3>
                <div className="text-xs text-theme-muted mt-1 flex items-center gap-2">
                  <span>Win Rate: <strong className="text-emerald-500">{p.winRate}%</strong></span>
                  <span>•</span>
                  <span>{p.recentGames.length} Recent Games</span>
                </div>
              </div>

              {/* Top opening preview */}
              <div className="p-2.5 rounded bg-theme-raised border border-theme-border/60 text-xs">
                <div className="text-theme-muted font-medium">Favorite Opening:</div>
                <div className="font-semibold text-theme-text truncate mt-0.5">
                  {p.mostPlayed[0]?.name || 'Italian Game'} ({p.mostPlayed[0]?.winRate}% win)
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              fullWidth
              icon={<Sparkles size={16} />}
              onClick={() => setSelectedOpponent(p)}
            >
              Inspect Scout Profile
            </Button>
          </Card>
        ))}

        {filteredProfiles.length === 0 && (
          <div className="col-span-full py-12 text-center text-theme-muted">
            <Shield size={32} className="mx-auto mb-2 opacity-50 text-amber-500" />
            <p className="text-sm font-semibold">No opponents matched "{searchQuery}"</p>
            <p className="text-xs mt-1">Try searching for fictional opponents like "PawnStorm22" or "GM_Example".</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default ScoutSearch;
