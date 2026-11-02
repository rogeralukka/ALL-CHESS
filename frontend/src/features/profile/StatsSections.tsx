import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { ShieldCheck, AlertTriangle, BookOpen, Layers } from 'lucide-react';
import { Meter } from '@/components/Bits';
import { InlineLoader } from '@/components/LoadingScreen';
import { statsRepository } from '@/data/repositories';
import type { Insights, OpeningStat, PhasePointsLost } from '@/data/types';

const NoData: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[13px] text-theme-muted">{children}</p>
);

const reviewMore = (
  <>
    Review a few games to see this: open <Link to="/review" className="font-semibold text-theme-text underline underline-offset-2">Review</Link> and run one.
  </>
);

export const StatsSections: React.FC = () => {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [phases, setPhases] = useState<PhasePointsLost | null>(null);
  const [openings, setOpenings] = useState<OpeningStat[] | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = () => {
      Promise.all([
        statsRepository.getStrengthsAndWeaknesses(),
        statsRepository.getPhasePointsLost(),
        statsRepository.getOpeningStats(),
      ])
        .then(([i, p, o]) => {
          if (!alive) return;
          setInsights(i);
          setPhases(p);
          setOpenings(o);
        })
        .finally(() => alive && setLoaded(true));
    };
    load();
    window.addEventListener('chess-data-refresh', load);
    return () => {
      alive = false;
      window.removeEventListener('chess-data-refresh', load);
    };
  }, []);

  if (!loaded) return <InlineLoader label="Working out your stats…" />;

  const analyzed = insights?.totalAnalyzed ?? 0;
  const strengths = insights?.strengths ?? [];
  const weaknesses = insights?.weaknesses ?? [];
  const phaseGames = phases?.totalAnalyzed ?? 0;

  return (
    <div className="space-y-4" data-testid="stats-sections">
      {/* Strengths & Areas to Polish, measured over the games that have been reviewed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-500" />
            <h3 className="font-bold font-display text-theme-text text-[17px]">Key Strengths</h3>
          </div>
          <p className="text-xs text-theme-muted">
            {analyzed > 0 ? `Your best areas across ${analyzed} reviewed ${analyzed === 1 ? 'game' : 'games'}, from your own games` : 'Your best areas, measured from your own games'}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {strengths.length === 0 ? (
              <NoData>{analyzed > 0 ? 'Not enough reviewed games to pick one out yet.' : reviewMore}</NoData>
            ) : (
              strengths.map((s) => (
                <Chip key={s.label} variant="success">
                  <span>{s.label}</span>
                  <span className="font-mono tabular-nums inline-block w-[74px] text-right font-bold ml-1.5">{s.delta}</span>
                </Chip>
              ))
            )}
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            <h3 className="font-bold font-display text-theme-text text-[17px]">Areas to Polish</h3>
          </div>
          <p className="text-xs text-theme-muted">
            {analyzed > 0 ? 'Where you lose the most, measured from the same games' : 'Where you lose the most, measured from your own games'}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {weaknesses.length === 0 ? (
              <NoData>{analyzed > 0 ? 'Nothing stands out as a weak spot. Nice.' : reviewMore}</NoData>
            ) : (
              weaknesses.map((w) => (
                <Chip key={w.label} variant="danger">
                  <span>{w.label}</span>
                  <span className="font-mono tabular-nums inline-block w-[74px] text-right font-bold ml-1.5">{w.delta}</span>
                </Chip>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Phase Points Lost */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-amber-500" />
            <h3 className="font-bold font-display text-theme-text text-[17px]">Phase Points Lost per Game</h3>
          </div>
          <span className="text-xs text-theme-muted font-medium">Lower is better</span>
        </div>

        {phaseGames === 0 ? (
          <NoData>{reviewMore}</NoData>
        ) : (
          <div className="space-y-4 pt-1">
            <p className="text-xs text-theme-muted">
              Measured over {phaseGames} reviewed {phaseGames === 1 ? 'game' : 'games'}; the bars compare your own phases.
            </p>
            {(['opening', 'middlegame', 'endgame'] as const).map((ph) => {
              const you = phases?.[ph] ?? 0;
              const worst = Math.max(phases?.opening ?? 0, phases?.middlegame ?? 0, phases?.endgame ?? 0, 0.01);
              const best = you === Math.min(phases?.opening ?? 0, phases?.middlegame ?? 0, phases?.endgame ?? 0);
              return (
                <div key={ph} className="space-y-1.5">
                  <div className="flex justify-between text-[13px]">
                    <span className="font-display font-black text-theme-text capitalize">{ph}</span>
                    <span className="text-theme-muted font-semibold">
                      <strong className={`font-display font-black ${best ? 'text-emerald-400' : 'text-theme-text'}`}>{you.toFixed(2)}</strong> per game
                    </span>
                  </div>
                  <Meter value={Math.min(1, you / worst)} color={best ? '#34d399' : '#f87171'} height={12} label={`${ph} points lost`} />
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Most Played Openings */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-amber-500" />
            <h3 className="font-bold font-display text-theme-text text-[17px]">Opening Repertoire Mastery</h3>
          </div>
          <span className="text-xs text-theme-muted font-medium">Ranked by frequency</span>
        </div>

        {!openings || openings.length === 0 ? (
          <NoData>No openings yet. They appear once you have games here.</NoData>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-theme-border text-xs text-theme-muted uppercase tracking-wider">
                  <th className="py-2.5 px-3">ECO</th>
                  <th className="py-2.5 px-3">Opening</th>
                  <th className="py-2.5 px-3 text-right">Games</th>
                  <th className="py-2.5 px-3 text-right">Win Rate</th>
                  <th className="py-2.5 px-3 text-right">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {openings.map((o) => (
                  <tr key={`${o.eco}-${o.name}`} className="hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors border-t-2 border-theme-border/60">
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center justify-center min-w-[44px] h-7 px-2 rounded-[8px] bg-amber-500/15 border-2 border-amber-500/30 text-amber-400 font-display font-black text-[12px]">{o.eco}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-theme-text">{o.name}</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-theme-muted">{o.games}</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-emerald-500">{Math.round(o.winRate)}%</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-theme-text">
                      {o.avgAccuracy == null ? '–' : `${Math.round(o.avgAccuracy)}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
