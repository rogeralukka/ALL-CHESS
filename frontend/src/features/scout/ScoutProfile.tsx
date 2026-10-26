import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Swords, ChevronRight, Trophy, ShieldAlert, Crown, BookOpen, Target } from 'lucide-react';
import { PageContainer } from '@/components/PageHeader';
import { SectionCard, StatTile } from '@/components/ListUI';
import { PlayerAvatar, WDLBar } from '@/components/Bits';
import { CoachSpeech } from '@/features/coach/CoachSpeech';
import { ScoutProfile as ScoutProfileType } from '@/data/types';
import { useCurrentUser } from '@/lib/useCurrentUser';

interface ScoutProfileProps {
  profile: ScoutProfileType;
  onBack: () => void;
}

export const ScoutProfile: React.FC<ScoutProfileProps> = ({ profile, onBack }) => {
  const navigate = useNavigate();
  const me = useCurrentUser();

  const games = profile.mostPlayed.reduce((n, o) => n + o.games, 0);
  const acc = profile.mostPlayed.length ? profile.mostPlayed.reduce((n, o) => n + o.avgAccuracy * o.games, 0) / Math.max(1, games) : 0;
  const draw = profile.mostPlayed[0]?.drawRate ?? 10;

  // strongest and weakest opening, from their own results (only openings with at least 5 games)
  const sample = profile.mostPlayed.filter((o) => o.games >= 5);
  const best = sample.length ? sample.reduce((a, b) => (b.winRate > a.winRate ? b : a)) : null;
  const worst = sample.length > 1 ? sample.reduce((a, b) => (b.winRate < a.winRate ? b : a)) : null;

  const plan = best
    ? `${profile.username} scores best in the ${best.name} (${best.winRate}% wins). ${worst && worst.eco !== best.eco ? `Steer towards the ${worst.name}, where they win only ${worst.winRate}%.` : 'Avoid it and pick a line you know well.'}`
    : `Not enough games yet to see a pattern for ${profile.username}.`;

  return (
    <PageContainer className="!max-w-[980px]">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-theme-muted hover:text-theme-text w-fit">
        <ArrowLeft size={16} /> All opponents
      </button>

      <section className="cc-card p-5 flex flex-col sm:flex-row gap-5" data-testid="scout-header">
        <PlayerAvatar name={profile.username} size={120} square />
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            {profile.title && (
              <span className="px-1.5 py-[1px] rounded-[3px] text-[13px] font-extrabold text-white" style={{ background: profile.title === 'BOT' ? '#6e6b68' : '#7d2e2e' }}>
                {profile.title}
              </span>
            )}
            <h1 className="cc-title text-[28px] leading-9 truncate">{profile.username}</h1>
          </div>
          <div className="max-w-sm">
            <WDLBar win={profile.winRate} draw={draw} loss={Math.max(0, 100 - profile.winRate - draw)} height={10} showLabels />
          </div>
          <div className="mt-auto">
            <button type="button" onClick={() => navigate('/play')} className="btn-primary h-12 px-5 rounded-[5px] text-[17px] font-extrabold font-display inline-flex items-center gap-2">
              <Swords size={19} /> Practise against this style
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile icon={<Crown size={22} className="text-[#f7c631]" />} value={profile.rating} label="Rapid rating" />
        <StatTile icon={<Trophy size={22} className="text-[#81b64c]" />} value={`${profile.winRate}%`} label="Win rate" />
        <StatTile icon={<BookOpen size={22} className="text-[#5ec1e6]" />} value={games} label="Games studied" />
        <StatTile icon={<Target size={22} className="text-[#f7a531]" />} value={`${acc.toFixed(1)}%`} label="Avg accuracy" />
      </div>

      <SectionCard title="Coach's game plan" bodyClassName="p-5">
        <CoachSpeech expression="thinking" size={80} text={plan} />
      </SectionCard>

      <SectionCard title="Opening repertoire">
        <ul className="divide-y divide-white/[0.06]">
          {profile.mostPlayed.map((op) => (
            <li key={op.eco} className="grid grid-cols-[52px_1fr] sm:grid-cols-[56px_1fr_220px_70px] items-center gap-4 px-5 py-3.5">
              <span className="text-center text-[13px] font-extrabold text-[#f7a531] rounded-[4px] bg-[#f7a531]/10 py-1">{op.eco}</span>
              <div className="min-w-0">
                <div className="font-bold text-[15px] text-theme-text truncate">{op.name}</div>
                <div className="text-[13px] text-theme-muted">{op.games} games</div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <WDLBar win={op.winRate} draw={op.drawRate} loss={op.lossRate} height={8} />
              </div>
              <div className="hidden sm:block text-right">
                <div className="text-[15px] font-extrabold tabular-nums text-theme-text">{op.avgAccuracy}%</div>
                <div className="text-[12px] text-theme-muted">accuracy</div>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      {(best || worst) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {best && (
            <SectionCard title="Where they're strong" bodyClassName="p-5 flex items-start gap-3">
              <Trophy size={22} className="text-[#81b64c] flex-shrink-0 mt-0.5" />
              <p className="text-[14px] text-theme-text/85">
                <b>{best.name}</b>: {best.winRate}% wins over {best.games} games, {best.avgAccuracy}% accuracy.
              </p>
            </SectionCard>
          )}
          {worst && (
            <SectionCard title="Where they crack" bodyClassName="p-5 flex items-start gap-3">
              <ShieldAlert size={22} className="text-[#fa412d] flex-shrink-0 mt-0.5" />
              <p className="text-[14px] text-theme-text/85">
                <b>{worst.name}</b>: only {worst.winRate}% wins over {worst.games} games, {worst.avgAccuracy}% accuracy.
              </p>
            </SectionCard>
          )}
        </div>
      )}

      <SectionCard title="Recent games">
        <ul className="divide-y divide-white/[0.06]">
          {profile.recentGames.map((g) => (
            <li key={g.id}>
              <button type="button" onClick={() => navigate(`/review/${g.id}`)} className="group w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-white/[0.03]">
                <span className="px-2 py-0.5 rounded-[4px] bg-white/10 text-[12px] font-bold text-theme-muted capitalize">{g.speed}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold text-theme-text truncate">
                    {me.label(g.white.username)} <span className="text-theme-muted font-medium">({g.white.rating})</span> vs {me.label(g.black.username)} <span className="text-theme-muted font-medium">({g.black.rating})</span>
                  </div>
                  <div className="text-[13px] text-theme-muted truncate">{g.opening.name}</div>
                </div>
                <span className="text-[14px] font-extrabold text-theme-text tabular-nums">{g.result}</span>
                <ChevronRight size={18} className="text-theme-muted group-hover:text-theme-text" />
              </button>
            </li>
          ))}
        </ul>
      </SectionCard>
    </PageContainer>
  );
};
export default ScoutProfile;
