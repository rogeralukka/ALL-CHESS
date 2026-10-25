import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { PageContainer, SectionTitle } from '@/components/PageHeader';
import { PlayerAvatar, WDLBar, Pill, StatTile, Reveal } from '@/components/Bits';
import { CoachSpeech } from '@/features/coach/CoachSpeech';
import { ScoutProfile as ScoutProfileType } from '@/data/types';
import { ArrowLeft, Swords, ShieldAlert, BookOpen, History, Trophy, Target, ChevronRight } from 'lucide-react';

interface ScoutProfileProps {
  profile: ScoutProfileType;
  onBack: () => void;
}

export const ScoutProfile: React.FC<ScoutProfileProps> = ({ profile, onBack }) => {
  const navigate = useNavigate();

  const coachNotes =
    profile.winRate > 60
      ? `${profile.username} is well prepared (${profile.winRate}% wins). Leave the main lines early and make them think for themselves.`
      : `${profile.username} wins ${profile.winRate}% of games with a predictable repertoire. Aim for the middlegame, where their accuracy drops.`;

  const games = profile.mostPlayed.reduce((n, o) => n + o.games, 0);
  const acc = profile.mostPlayed.length ? profile.mostPlayed.reduce((n, o) => n + o.avgAccuracy * o.games, 0) / Math.max(1, games) : 0;

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" icon={<ArrowLeft size={16} />} onClick={onBack}>
          All opponents
        </Button>
        <Pill tone="amber">Scout report</Pill>
      </div>

      {/* Header */}
      <section className="panel relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(480px 240px at 90% 50%, rgba(255,107,74,0.16), transparent 70%)' }}
        />
        <img
          src="/assets/ui/hero_scout.webp"
          alt=""
          aria-hidden="true"
          className="hidden md:block absolute right-5 top-4 h-[calc(100%-32px)] w-auto max-w-[34%] object-contain object-right pointer-events-none"
          style={{ filter: 'drop-shadow(0 18px 24px rgba(0,0,0,.45))' }}
        />
        <div className="relative p-5 md:p-7 flex flex-col sm:flex-row sm:items-center gap-5 md:max-w-[64%]">
          <PlayerAvatar name={profile.username} size={84} />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-[28px] font-black font-display text-theme-text truncate">{profile.username}</h1>
              {profile.title && <Pill tone="red">{profile.title}</Pill>}
            </div>
            <div className="max-w-sm">
              <WDLBar win={profile.winRate} draw={profile.mostPlayed[0]?.drawRate ?? 10} loss={Math.max(0, 100 - profile.winRate - (profile.mostPlayed[0]?.drawRate ?? 10))} height={10} showLabels />
            </div>
            <div className="pt-1">
              <Button variant="primary" size="lg" icon={<Swords size={18} />} onClick={() => navigate('/play')}>
                Practise against this style
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile label="Rapid rating" value={profile.rating} accent="#f5a524" />
        <StatTile label="Win rate" value={`${profile.winRate}%`} accent="var(--class-best)" />
        <StatTile label="Games studied" value={games} />
        <StatTile label="Avg accuracy" value={`${acc.toFixed(1)}%`} />
      </div>

      <Card>
        <SectionTitle icon={<Target size={18} className="text-amber-500" />}>Coach's game plan</SectionTitle>
        <CoachSpeech expression="thinking" size={80} text={coachNotes} />
      </Card>

      <Card>
        <SectionTitle icon={<BookOpen size={18} className="text-amber-500" />}>Opening repertoire</SectionTitle>
        <div className="space-y-2">
          {profile.mostPlayed.map((op, i) => (
            <Reveal key={op.eco} i={i}>
              <div className="grid grid-cols-[48px_1fr] sm:grid-cols-[56px_1fr_220px_70px] items-center gap-3 p-3 rounded-xl bg-black/[0.04] dark:bg-black/20 border border-theme-border hover:border-amber-500/40 transition-colors">
                <span className="font-mono text-[12px] font-black text-amber-500 text-center rounded-md bg-amber-500/10 py-1">{op.eco}</span>
                <div className="min-w-0">
                  <div className="font-bold text-[15px] text-theme-text truncate">{op.name}</div>
                  <div className="text-xs text-theme-muted">{op.games} games</div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <WDLBar win={op.winRate} draw={op.drawRate} loss={op.lossRate} />
                </div>
                <div className="hidden sm:block text-right">
                  <div className="text-[15px] font-black tabular-nums text-theme-text">{op.avgAccuracy}%</div>
                  <div className="text-[12px] text-theme-muted">accuracy</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="space-y-3 border-l-4 !border-l-[var(--class-best)]">
          <SectionTitle icon={<Trophy size={18} className="text-[var(--class-best)]" />}>Where they're strong</SectionTitle>
          <ul className="space-y-2 text-[14px] text-theme-text/85">
            <li>Plays known book lines deep and fast.</li>
            <li>Sharp in open positions around an exposed king.</li>
            <li>Keeps a tidy pawn structure out of the opening.</li>
          </ul>
        </Card>
        <Card className="space-y-3 border-l-4 !border-l-[var(--class-blunder)]">
          <SectionTitle icon={<ShieldAlert size={18} className="text-[var(--class-blunder)]" />}>Where they crack</SectionTitle>
          <ul className="space-y-2 text-[14px] text-theme-text/85">
            <li>Scores worse against closed centres and slow manoeuvring.</li>
            <li>Gets into time trouble in minor-piece endgames.</li>
            <li>Misses back-rank threats when defending.</li>
          </ul>
        </Card>
      </div>

      <Card>
        <SectionTitle icon={<History size={18} className="text-amber-500" />}>Recent games</SectionTitle>
        <div className="divide-y divide-theme-border">
          {profile.recentGames.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => navigate(`/review/${g.id}`)}
              className="group w-full flex items-center gap-3 py-3 px-2 -mx-2 rounded-lg text-left hover:bg-black/[0.05] dark:hover:bg-white/[0.04] transition-colors"
            >
              <Pill>{g.speed}</Pill>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-bold text-theme-text truncate">
                  {g.white.username} <span className="text-theme-muted font-medium">({g.white.rating})</span> vs {g.black.username}{' '}
                  <span className="text-theme-muted font-medium">({g.black.rating})</span>
                </div>
                <div className="text-xs text-theme-muted truncate">{g.opening.name}</div>
              </div>
              <span className="font-mono text-[13px] font-black text-theme-text">{g.result}</span>
              <span className="hidden sm:inline text-[13px] font-bold text-amber-500 group-hover:underline">Review</span>
              <ChevronRight size={18} className="text-theme-muted" />
            </button>
          ))}
        </div>
      </Card>
    </PageContainer>
  );
};
