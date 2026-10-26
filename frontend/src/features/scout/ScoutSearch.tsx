import React, { useEffect, useState } from 'react';
import { Search, ChevronRight, Swords, BookOpen, Percent } from 'lucide-react';
import { PageContainer } from '@/components/PageHeader';
import { PageTitle, SectionCard, StatTile } from '@/components/ListUI';
import { PlayerAvatar, WDLBar } from '@/components/Bits';
import { scoutRepository } from '@/data/repositories';
import { ScoutProfile as ScoutProfileType } from '@/data/types';
import { ScoutProfile } from './ScoutProfile';

const PLATFORMS = ['Chess.com', 'Lichess'] as const;

const TitleBadge: React.FC<{ title: string }> = ({ title }) => (
  <span className="px-1.5 py-[1px] rounded-[3px] text-[12px] font-extrabold leading-4 text-white" style={{ background: title === 'BOT' ? '#6e6b68' : '#7d2e2e' }}>
    {title}
  </span>
);

export const ScoutSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [platform, setPlatform] = useState<(typeof PLATFORMS)[number]>('Chess.com');
  const [profiles, setProfiles] = useState<ScoutProfileType[]>([]);
  const [selected, setSelected] = useState<ScoutProfileType | null>(null);

  useEffect(() => {
    let alive = true;
    scoutRepository.searchProfiles(query.trim()).then((p) => alive && setProfiles(p));
    return () => {
      alive = false;
    };
  }, [query]);

  if (selected) return <ScoutProfile profile={selected} onBack={() => setSelected(null)} />;

  const exact = profiles.find((p) => p.username.toLowerCase() === query.trim().toLowerCase());
  const games = profiles.reduce((n, p) => n + p.mostPlayed.reduce((m, o) => m + o.games, 0), 0);
  const avgWin = profiles.length ? Math.round(profiles.reduce((n, p) => n + p.winRate, 0) / profiles.length) : 0;

  return (
    <PageContainer className="!max-w-[980px]">
      <PageTitle
        icon="/assets/ui/icon_scout.webp"
        title="Scout"
        subtitle="See what an opponent plays, where they win and where they crack, then prep before the game."
      />

      <form
        className="cc-card p-3 flex flex-col sm:flex-row gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (exact) setSelected(exact);
        }}
      >
        <div className="relative flex-1">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search by ${platform} username`}
            aria-label="Opponent username"
            className="w-full h-12 pl-12 pr-4 rounded-[5px] text-[16px] text-theme-text placeholder:text-theme-muted focus:outline-none focus-visible:!outline-none border border-transparent focus:border-[#81b64c] transition-colors"
            style={{ background: 'var(--input-bg)' }}
          />
        </div>
        <div className="flex gap-3">
          <div className="flex rounded-[5px] p-1" style={{ background: 'var(--input-bg)' }} role="radiogroup" aria-label="Platform">
            {PLATFORMS.map((p) => (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={platform === p}
                onClick={() => setPlatform(p)}
                className={`px-3.5 h-10 rounded-[4px] text-[14px] font-bold transition-colors ${platform === p ? 'bg-white/[0.12] text-theme-text' : 'text-theme-muted hover:text-theme-text'}`}
              >
                {p}
              </button>
            ))}
          </div>
          <button type="submit" disabled={!exact} className="btn-primary h-12 px-6 rounded-[5px] text-[17px] font-extrabold font-display inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
            Scout
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatTile icon={<Swords size={24} className="text-[#81b64c]" />} value={profiles.length} label="Opponents" />
        <StatTile icon={<BookOpen size={24} className="text-[#f7c631]" />} value={games} label="Games studied" />
        <StatTile icon={<Percent size={24} className="text-[#5ec1e6]" />} value={profiles.length ? `${avgWin}%` : '–'} label="Average win rate" />
      </div>

      <SectionCard
        title={
          <>
            Scouted Opponents <span className="ml-1.5 inline-flex items-center justify-center min-w-[26px] h-[22px] px-2 rounded-full bg-white/10 text-[13px] font-bold text-theme-muted align-middle">{profiles.length}</span>
          </>
        }
        testId="scout-list"
      >
        {profiles.length === 0 ? (
          <div className="flex flex-col items-center text-center py-12 px-6 gap-3">
            <img src="/assets/ui/icon_scout.webp" alt="" className="w-20 h-20 object-contain opacity-90" />
            <p className="text-[16px] font-bold text-theme-text">{query ? `No one called “${query}” yet` : 'No opponents scouted yet'}</p>
            <p className="text-[14px] text-theme-muted max-w-sm">Search for a Chess.com or Lichess username to see their openings and results.</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/[0.06]">
            {profiles.map((p) => {
              const draw = p.mostPlayed[0]?.drawRate ?? 10;
              return (
                <li key={p.username}>
                  <button
                    type="button"
                    onClick={() => setSelected(p)}
                    className="group w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/[0.03] transition-colors"
                    data-testid={`scout-card-${p.username}`}
                  >
                    <PlayerAvatar name={p.username} size={72} square />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        {p.title && <TitleBadge title={p.title} />}
                        <span className="text-[17px] font-bold text-theme-text truncate">{p.username}</span>
                      </div>
                      <div className="text-[14px] text-theme-muted">
                        Rapid <b className="text-theme-text tabular-nums">{p.rating}</b> · {p.recentGames.length} games scouted
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {p.mostPlayed.slice(0, 2).map((op) => (
                          <span key={op.eco} className="inline-flex items-center gap-1.5 h-6 px-2 rounded-[4px] bg-white/[0.07] text-[12px] font-semibold text-theme-text">
                            <span className="text-[#f7a531] font-extrabold">{op.eco}</span>
                            <span className="truncate max-w-[150px]">{op.name}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="hidden sm:block w-[232px] flex-shrink-0">
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-[12px] font-bold uppercase tracking-wide text-theme-muted">Results</span>
                        <span className="text-[18px] leading-5 font-display font-extrabold text-theme-text tabular-nums">
                          {p.winRate}%<span className="ml-1 text-[12px] font-semibold text-theme-muted">wins</span>
                        </span>
                      </div>
                      <WDLBar win={p.winRate} draw={draw} loss={Math.max(0, 100 - p.winRate - draw)} height={10} showLabels />
                    </div>
                    <ChevronRight size={22} className="text-theme-muted group-hover:text-theme-text flex-shrink-0" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>
    </PageContainer>
  );
};
export default ScoutSearch;
