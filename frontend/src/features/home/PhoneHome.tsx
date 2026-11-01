import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Flame, RefreshCw, Settings as SettingsIcon } from 'lucide-react';
import { ModeIcon, GameMode } from '@/components/ModeIcon';
import { PlayerAvatar } from '@/components/Bits';
import { PhoneDock } from '@/components/PhoneDock';
import { PhoneGameRows, youAreWhite, ago } from '@/components/PhoneGameRows';
import { CoachAvatar } from '@/features/coach/CoachAvatar';
import { LevelBadge } from '@/features/map/LevelBadge';
import { RatingSummary } from '@/data/repositories';
import { Friend, Game, LessonStage } from '@/data/types';

type Props = {
  username: string;
  streak: number;
  recentGames: Game[];
  ratings: RatingSummary[];
  friends: Friend[];
  currentStage: LessonStage | null;
  stageNo: number;
  puzzle: { rating: number; streak: number; level: number; solvedInLevel: number; perLevel: number };
};

const SectionHead: React.FC<{ title: string; onAll?: () => void }> = ({ title, onAll }) => (
  <div className="flex items-center justify-between px-4 mb-2.5">
    <h2 className="font-display font-extrabold text-[19px] text-theme-text">{title}</h2>
    {onAll && (
      <button type="button" onClick={onAll} className="font-display font-bold text-[15px] text-theme-text/80 active:text-theme-text">
        View All
      </button>
    )}
  </div>
);

/** Big art cards that scroll sideways, like the top of the Chess.com app's home screen. */
const HeroCard: React.FC<{
  art: string;
  onClick: () => void;
  testId: string;
  children: React.ReactNode;
  action: string;
  tint: string;
}> = ({ art, onClick, testId, children, action, tint }) => (
  <button
    type="button"
    onClick={onClick}
    data-testid={testId}
    className="relative snap-start flex-shrink-0 w-[82%] h-[184px] rounded-xl overflow-hidden text-left active:scale-[0.99] transition-transform"
    style={{ background: tint }}
  >
    <img src={art} alt="" aria-hidden="true" className="absolute right-0 top-0 h-full w-[74%] object-cover object-left" loading="eager" decoding="async" />
    <div aria-hidden="true" className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${tint} 0%, ${tint} 30%, color-mix(in srgb, ${tint} 55%, transparent) 50%, transparent 72%)` }} />
    <div className="relative h-full flex flex-col p-4">
      {children}
      <span className="mt-auto self-end inline-flex items-center h-10 px-5 rounded-lg font-display font-extrabold text-[17px] text-white shadow-md" style={{ background: 'var(--btn-primary-bg)', boxShadow: 'var(--btn-primary-shadow)' }}>
        {action}
      </span>
    </div>
  </button>
);

export const PhoneHome: React.FC<Props> = ({ username, streak, recentGames, ratings, friends, currentStage, stageNo, puzzle }) => {
  const navigate = useNavigate();
  const last = recentGames[0];
  const tiles: Array<{ key: string; mode: GameMode; rating: number | string; label: string; to: string }> = [
    ...ratings.map((r) => ({ key: r.mode, mode: r.mode.toLowerCase() as GameMode, rating: r.rating > 0 ? r.rating : '–', label: r.mode, to: '/profile' })),
    { key: 'puzzles', mode: 'puzzles', rating: puzzle.rating, label: 'Puzzles', to: '/puzzles' },
  ];

  return (
    <div className="pb-2" data-testid="phone-home">
      {/* top bar: you, your streak, quick actions */}
      <div className="flex items-center justify-between px-4 pt-3 pb-3">
        <button type="button" onClick={() => navigate('/profile')} className="flex items-center gap-2.5 min-w-0" aria-label="Your profile">
          <PlayerAvatar name={username} size={40} square />
          <span className="flex items-center gap-1" data-testid="streak">
            <Flame size={24} className="text-orange-500 fill-orange-500/80" />
            <span className="font-display font-black text-[20px] text-theme-text tabular-nums">{streak}</span>
          </span>
        </button>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('trigger-chess-sync'))} className="w-10 h-10 flex items-center justify-center rounded-lg text-theme-text/80 active:bg-white/10" aria-label="Sync games">
            <RefreshCw size={21} />
          </button>
          <button type="button" onClick={() => navigate('/settings')} className="w-10 h-10 flex items-center justify-center rounded-lg text-theme-text/80 active:bg-white/10" aria-label="Settings">
            <SettingsIcon size={21} />
          </button>
        </div>
      </div>

      {/* hero cards */}
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 scroll-px-4 pb-1" data-testid="home-heroes">
        <HeroCard art="/assets/ui/hero_puzzles.webp" tint="#3d6e2b" onClick={() => navigate('/puzzles')} testId="launch-puzzles" action="Solve!">
          <div className="flex items-center gap-2">
            <LevelBadge level={puzzle.level} width={34} />
            <span className="font-display font-black text-[26px] text-white drop-shadow">Puzzles</span>
          </div>
          <div className="mt-auto">
            <div className="flex items-center gap-1.5 font-display font-black text-[20px] text-white drop-shadow tabular-nums">
              {puzzle.rating}
              <Flame size={17} className="text-orange-400 fill-orange-400/80" />
              <span className="text-[17px]">{puzzle.streak}</span>
            </div>
            <div className="mt-1.5 h-3 w-[46%] rounded-full bg-black/40 overflow-hidden">
              <div className="h-full rounded-full bg-orange-500" style={{ width: `${Math.max(8, (puzzle.solvedInLevel / puzzle.perLevel) * 100)}%` }} />
            </div>
          </div>
        </HeroCard>

        <HeroCard art="/assets/ui/hero_learn.webp" tint="#2b2926" onClick={() => navigate('/learn')} testId="launch-learn" action="Continue">
          <span className="font-display font-black text-[26px] text-white drop-shadow">Learn</span>
          <span className="mt-1 text-[15px] font-bold text-white/90 drop-shadow line-clamp-2 max-w-[62%]">{currentStage?.title || 'Your next lesson'}</span>
          <span className="text-[13px] font-semibold text-white/70 capitalize">Stage {stageNo} · {currentStage?.category || 'endgame'}</span>
        </HeroCard>

        <HeroCard art="/assets/ui/hero_review.webp" tint="#3a352f" onClick={() => navigate(last ? `/review/${last.id}` : '/review')} testId="launch-review" action="Review">
          <span className="font-display font-black text-[26px] text-white drop-shadow">Game Review</span>
          <span className="mt-1 text-[15px] font-bold text-white/90 drop-shadow max-w-[62%] truncate">
            {last ? `vs ${youAreWhite(last) ? last.black.username : last.white.username}` : 'No games yet'}
          </span>
          {last && <span className="text-[13px] font-semibold text-white/70">{ago(last.date)}</span>}
        </HeroCard>
      </div>

      {/* play the coach, the app's "recommended match" */}
      <div className="px-4 mt-5">
        <button type="button" onClick={() => navigate('/play')} className="w-full flex items-center gap-3 rounded-xl p-3 text-left active:brightness-110" style={{ background: 'var(--color-card)' }} data-testid="launch-play">
          <span className="rounded-lg overflow-hidden flex-shrink-0" style={{ background: '#e9edcc' }}>
            <CoachAvatar expression="brilliant" size={64} />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block font-display font-extrabold text-[17px] text-theme-text">Play the Coach</span>
            <span className="block text-[13px] text-theme-muted">Live hints, any level from 400 to 2200</span>
          </span>
          <ChevronRight size={22} className="text-theme-muted flex-shrink-0" />
        </button>
      </div>

      {/* ratings */}
      <section className="mt-6">
        <SectionHead title="Ratings" onAll={() => navigate('/profile')} />
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar px-4 snap-x scroll-px-4">
          {tiles.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => navigate(t.to)}
              className="snap-start flex-shrink-0 w-[118px] h-[118px] rounded-xl flex flex-col items-center justify-center gap-1 active:brightness-110"
              style={{ background: 'var(--color-card)' }}
            >
              <ModeIcon mode={t.mode} size={38} />
              <span className="font-display font-black text-[22px] text-theme-text tabular-nums leading-tight">{t.rating}</span>
              <span className="text-[13px] font-semibold text-theme-muted">{t.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* recent games */}
      <section className="mt-6">
        <SectionHead title="Recent Games" onAll={() => navigate('/review')} />
        <PhoneGameRows games={recentGames} className="mx-4" />
      </section>

      {/* friends */}
      {friends.length > 0 && (
        <section className="mt-6">
          <SectionHead title={`Friends ${friends.length}`} onAll={() => navigate('/leaderboard')} />
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar px-4">
            {friends.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => navigate('/leaderboard')}
                className="flex-shrink-0 w-[112px] rounded-xl p-2.5 flex flex-col items-center gap-1.5 active:brightness-110"
                style={{ background: 'var(--color-card)' }}
              >
                <span className="relative">
                  <PlayerAvatar name={f.username} size={64} square />
                  <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[var(--color-card)] ${f.online ? 'bg-emerald-500' : 'bg-neutral-500'}`} />
                </span>
                <span className="w-full text-center text-[13px] font-bold text-theme-text truncate">{f.username}</span>
                <span className="text-[12px] font-semibold text-theme-muted tabular-nums">{f.rating}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <PhoneDock testId="home-play">
        <button
          type="button"
          onClick={() => navigate('/play')}
          className="w-full h-14 rounded-xl font-display font-extrabold text-[24px] text-white active:translate-y-px"
          style={{ background: 'var(--btn-primary-bg)', boxShadow: 'var(--btn-primary-shadow)' }}
        >
          Play
        </button>
      </PhoneDock>
    </div>
  );
};

export default PhoneHome;
