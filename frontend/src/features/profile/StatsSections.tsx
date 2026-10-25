import React from 'react';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import {
  MOCK_OPENING_STATS,
  MOCK_PHASE_POINTS_LOST,
  MOCK_STRENGTHS,
  MOCK_WEAKNESSES,
} from '@/data/mock/mockStats';
import { ShieldCheck, AlertTriangle, BookOpen, Layers } from 'lucide-react';
import { Meter, StatTile, WDLBar } from '@/components/Bits';

export const StatsSections: React.FC = () => {
  // Aggregate record
  const totalGames = 105;
  const wins = 59;
  const draws = 11;
  const losses = 35;
  const winPct = ((wins / totalGames) * 100).toFixed(1);
  const drawPct = ((draws / totalGames) * 100).toFixed(1);
  const lossPct = ((losses / totalGames) * 100).toFixed(1);

  // Benchmarks for Phase points lost
  const benchmarks = {
    opening: 0.4,
    middlegame: 1.4,
    endgame: 1.1,
  };

  return (
    <div className="space-y-4">
      {/* Win / Draw / Loss record as three game badges over a chunky bar */}
      <Card className="p-4 md:p-5 space-y-4">
        <div>
          <h3 className="font-black font-display text-theme-text text-[18px]">Game record</h3>
          <p className="text-[13px] text-theme-muted">{totalGames} games analysed, all time controls</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <StatTile label="Wins" value={wins} sub={`${winPct}%`} accent="#34d399" />
          <StatTile label="Draws" value={draws} sub={`${drawPct}%`} accent="#a8a29e" />
          <StatTile label="Losses" value={losses} sub={`${lossPct}%`} accent="#f87171" />
        </div>
        <WDLBar win={wins} draw={draws} loss={losses} height={14} />
      </Card>

      {/* Strengths & Areas to Polish Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-500" />
            <h3 className="font-black font-display text-theme-text text-[17px]">Key Strengths</h3>
          </div>
          <p className="text-xs text-theme-muted">Consistent positive tactical impact across your matches</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {MOCK_STRENGTHS.map((s) => (
              <Chip key={s.label} variant="success">
                <span>{s.label}</span>
                <span className="font-mono tabular-nums inline-block w-12 text-right font-bold ml-1.5">{s.delta}</span>
              </Chip>
            ))}
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            <h3 className="font-black font-display text-theme-text text-[17px]">Areas to Polish</h3>
          </div>
          <p className="text-xs text-theme-muted">Frequent sources of lost advantage identified by coach</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {MOCK_WEAKNESSES.map((w) => (
              <Chip key={w.label} variant="danger">
                <span>{w.label}</span>
                <span className="font-mono tabular-nums inline-block w-12 text-right font-bold ml-1.5">{w.delta}</span>
              </Chip>
            ))}
          </div>
        </Card>
      </div>

      {/* Phase Points Lost Comparison */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-amber-500" />
            <h3 className="font-black font-display text-theme-text text-[17px]">Phase Points Lost per Game</h3>
          </div>
          <span className="text-xs text-theme-muted font-medium">Lower is better</span>
        </div>

        <div className="space-y-4 pt-1">
          {(['opening', 'middlegame', 'endgame'] as const).map((ph) => {
            const you = MOCK_PHASE_POINTS_LOST[ph];
            const good = you <= benchmarks[ph];
            return (
              <div key={ph} className="space-y-1.5">
                <div className="flex justify-between text-[13px]">
                  <span className="font-display font-black text-theme-text capitalize">{ph}</span>
                  <span className="text-theme-muted font-semibold">
                    You <strong className={`font-display font-black ${good ? 'text-emerald-400' : 'text-red-400'}`}>{you}</strong> · peers {benchmarks[ph]}
                  </span>
                </div>
                <Meter value={you / 2} color={good ? '#34d399' : '#f87171'} height={12} label={`${ph} points lost`} />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Most Played Openings Table */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-amber-500" />
            <h3 className="font-black font-display text-theme-text text-[17px]">Opening Repertoire Mastery</h3>
          </div>
          <span className="text-xs text-theme-muted font-medium">Ranked by frequency</span>
        </div>

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
              {MOCK_OPENING_STATS.map((o) => (
                <tr key={o.eco} className="hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors border-t-2 border-theme-border/60">
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center justify-center min-w-[44px] h-7 px-2 rounded-[8px] bg-amber-500/15 border-2 border-amber-500/30 text-amber-400 font-display font-black text-[12px]">{o.eco}</span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-theme-text">
                    {o.name}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-theme-muted">
                    {o.games}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-emerald-500">
                    {o.winRate}%
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-theme-text">
                    {o.avgAccuracy}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
