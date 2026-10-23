import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { PageContainer, PageHeader, SectionTitle } from '@/components/PageHeader';
import { PlayerAvatar, WDLBar, Pill, Reveal } from '@/components/Bits';
import { MOCK_SCOUT_PROFILES } from '@/data/mock/mockScout';
import { ScoutProfile } from './ScoutProfile';
import { ScoutProfile as ScoutProfileType } from '@/data/types';
import { Search, X, ChevronRight, BookOpen } from 'lucide-react';

const PLATFORMS = ['Chess.com', 'Lichess'] as const;

export const ScoutSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [platform, setPlatform] = useState<(typeof PLATFORMS)[number]>('Chess.com');
  const [selectedOpponent, setSelectedOpponent] = useState<ScoutProfileType | null>(null);

  const allProfiles = Object.values(MOCK_SCOUT_PROFILES);
  const filteredProfiles = allProfiles.filter((p) => p.username.toLowerCase().includes(searchQuery.toLowerCase()));

  if (selectedOpponent) {
    return <ScoutProfile profile={selectedOpponent} onBack={() => setSelectedOpponent(null)} />;
  }

  const exact = allProfiles.find((p) => p.username.toLowerCase() === searchQuery.trim().toLowerCase());

  return (
    <PageContainer>
      <PageHeader
        title="Scout an opponent"
        subtitle="See what they open with, where they win, and where they crack. Then prep a plan before the game."
        art="/assets/ui/hero_scout.webp"
        tint="rgba(255,107,74,0.16)"
        eyebrow={<Pill tone="amber">Opponent prep</Pill>}
      />

      {/* Search */}
      <Card className="!p-4 md:!p-5 space-y-3">
        <form
          className="flex flex-col sm:flex-row gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (exact) setSelectedOpponent(exact);
          }}
        >
          <div className="relative flex-1">
            <Search size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`${platform} username`}
              aria-label="Opponent username"
              className="w-full h-12 pl-11 pr-10 rounded-[10px] bg-black/[0.06] dark:bg-black/25 border border-theme-border text-[15px] font-semibold text-theme-text placeholder:text-theme-muted/80 placeholder:font-medium focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-theme-muted hover:text-theme-text" aria-label="Clear search">
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex p-1 rounded-[10px] bg-black/[0.06] dark:bg-black/25 border border-theme-border" role="radiogroup" aria-label="Platform">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  type="button"
                  role="radio"
                  aria-checked={platform === p}
                  onClick={() => setPlatform(p)}
                  className={`px-3 h-10 rounded-lg text-[13px] font-bold transition ${platform === p ? 'bg-black/[0.05] dark:bg-white/[0.1] text-theme-text shadow-sm' : 'text-theme-muted hover:text-theme-text'}`}
                >
                  {p}
                </button>
              ))}
            </div>
            <Button type="submit" variant="primary" size="lg" icon={<Search size={18} />} disabled={!exact}>
              Scout
            </Button>
          </div>
        </form>
        <div className="flex flex-wrap items-center gap-2 text-[13px]">
          <span className="text-theme-muted font-semibold">Recent:</span>
          {allProfiles.map((p) => (
            <button
              key={p.username}
              type="button"
              onClick={() => setSelectedOpponent(p)}
              className="group flex items-center gap-2 h-9 pl-1 pr-3 rounded-full bg-black/[0.05] dark:bg-white/[0.05] hover:bg-black/[0.05] dark:hover:bg-white/[0.1] border border-theme-border text-theme-text font-semibold transition"
            >
              <PlayerAvatar name={p.username} size={26} />
              {p.username}
              <span className="text-theme-muted tabular-nums">{p.rating}</span>
            </button>
          ))}
        </div>
      </Card>

      <section>
        <SectionTitle right={<span className="text-xs font-semibold text-theme-muted">{filteredProfiles.length} opponents</span>}>Scouted opponents</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProfiles.map((p, i) => {
            const top = p.mostPlayed[0];
            const draw = top?.drawRate ?? 10;
            return (
              <Reveal key={p.username} i={i}>
                <Card interactive className="h-full flex flex-col gap-4" onClick={() => setSelectedOpponent(p)} data-testid={`scout-card-${p.username}`}>
                  <div className="flex items-center gap-3">
                    <PlayerAvatar name={p.username} size={52} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-extrabold text-[17px] text-theme-text truncate">{p.username}</h3>
                        {p.title && <Pill tone="red">{p.title}</Pill>}
                      </div>
                      <div className="text-[13px] text-theme-muted">
                        Rapid <strong className="text-theme-text tabular-nums">{p.rating}</strong> · {p.recentGames.length} games scouted
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-theme-muted" />
                  </div>

                  <div>
                    <div className="flex justify-between text-[12px] font-bold mb-1.5">
                      <span className="text-theme-muted uppercase tracking-wide">Results</span>
                      <span className="text-[var(--class-best)] tabular-nums">{p.winRate}% wins</span>
                    </div>
                    <WDLBar win={p.winRate} draw={draw} loss={Math.max(0, 100 - p.winRate - draw)} />
                  </div>

                  <div className="space-y-1.5 mt-auto">
                    <div className="text-[12px] font-bold uppercase tracking-wide text-theme-muted flex items-center gap-1.5">
                      <BookOpen size={13} /> Favourite openings
                    </div>
                    {p.mostPlayed.slice(0, 2).map((op) => (
                      <div key={op.eco} className="flex items-center gap-2 text-[13px]">
                        <span className="font-mono text-[12px] font-bold text-amber-500 w-8">{op.eco}</span>
                        <span className="flex-1 truncate font-semibold text-theme-text">{op.name}</span>
                        <span className="tabular-nums text-theme-muted">{op.winRate}%</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </Reveal>
            );
          })}

          {filteredProfiles.length === 0 && (
            <Card className="col-span-full flex flex-col items-center text-center py-10 gap-3">
              <img src="/assets/ui/icon_scout.webp" alt="" className="w-20 h-20 object-contain opacity-90" />
              <p className="text-[15px] font-bold text-theme-text">No one called “{searchQuery}” yet</p>
              <p className="text-[13px] text-theme-muted max-w-sm">Try one of the recent names above. Live lookups arrive with the backend.</p>
            </Card>
          )}
        </div>
      </section>
    </PageContainer>
  );
};
export default ScoutSearch;
