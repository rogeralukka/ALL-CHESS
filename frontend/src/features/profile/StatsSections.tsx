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
      {/* Win / Draw / Loss Record Card */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold font-display text-theme-text text-base">Game Record</h3>
            <p className="text-xs text-theme-muted">{totalGames} Games Analyzed (All Time Controls)</p>
          </div>
          <div className="flex gap-4 text-xs font-semibold">
            <span className="text-emerald-500 font-mono tabular-nums">{wins} Wins ({winPct}%)</span>
            <span className="text-neutral-400 font-mono tabular-nums">{draws} Draws ({drawPct}%)</span>
            <span className="text-red-500 font-mono tabular-nums">{losses} Losses ({lossPct}%)</span>
          </div>
        </div>

        {/* Visual Record Segmented Bar */}
        <div className="w-full flex gap-1.5 h-3">
          <div
            style={{ width: `${winPct}%` }}
            className="bg-emerald-500 rounded-l-full transition-all duration-500"
            title={`Wins: ${winPct}%`}
          />
          <div
            style={{ width: `${drawPct}%` }}
            className="bg-neutral-400 transition-all duration-500"
            title={`Draws: ${drawPct}%`}
          />
          <div
            style={{ width: `${lossPct}%` }}
            className="bg-red-500 rounded-r-full transition-all duration-500"
            title={`Losses: ${lossPct}%`}
          />
        </div>

        {/* Labels under each segment */}
        <div className="flex justify-between items-center text-xs pt-1">
          <div className="text-left">
            <span className="block text-xs uppercase font-bold text-theme-muted tracking-wider">Wins</span>
            <span className="font-mono font-bold text-emerald-500 tabular-nums">
              {wins} <span className="text-theme-muted font-normal">({winPct}%)</span>
            </span>
          </div>
          <div className="text-center">
            <span className="block text-xs uppercase font-bold text-theme-muted tracking-wider">Draws</span>
            <span className="font-mono font-bold text-neutral-400 tabular-nums">
              {draws} <span className="text-theme-muted font-normal">({drawPct}%)</span>
            </span>
          </div>
          <div className="text-right">
            <span className="block text-xs uppercase font-bold text-theme-muted tracking-wider">Losses</span>
            <span className="font-mono font-bold text-red-500 tabular-nums">
              {losses} <span className="text-theme-muted font-normal">({lossPct}%)</span>
            </span>
          </div>
        </div>
      </Card>

      {/* Strengths & Areas to Polish Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-500" />
            <h3 className="font-bold font-display text-theme-text text-base">Key Strengths</h3>
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
            <h3 className="font-bold font-display text-theme-text text-base">Areas to Polish</h3>
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
            <h3 className="font-bold font-display text-theme-text text-base">Phase Points Lost per Game</h3>
          </div>
          <span className="text-xs text-theme-muted font-medium">Lower is better</span>
        </div>

        <div className="space-y-3 pt-1">
          {/* Opening */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-theme-text">Opening</span>
              <span className="font-mono text-theme-muted">
                You: <strong className="text-emerald-500">{MOCK_PHASE_POINTS_LOST.opening}</strong> vs Peer: {benchmarks.opening}
              </span>
            </div>
            <div className="w-full bg-theme-raised rounded-full h-2 overflow-hidden flex">
              <div
                style={{ width: `${(MOCK_PHASE_POINTS_LOST.opening / 2) * 100}%` }}
                className="bg-emerald-500 rounded-full"
              />
            </div>
          </div>

          {/* Middlegame */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-theme-text">Middlegame</span>
              <span className="font-mono text-theme-muted">
                You: <strong className="text-red-500">{MOCK_PHASE_POINTS_LOST.middlegame}</strong> vs Peer: {benchmarks.middlegame}
              </span>
            </div>
            <div className="w-full bg-theme-raised rounded-full h-2 overflow-hidden flex">
              <div
                style={{ width: `${(MOCK_PHASE_POINTS_LOST.middlegame / 2) * 100}%` }}
                className="bg-red-500 rounded-full"
              />
            </div>
          </div>

          {/* Endgame */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-theme-text">Endgame</span>
              <span className="font-mono text-theme-muted">
                You: <strong className="text-emerald-500">{MOCK_PHASE_POINTS_LOST.endgame}</strong> vs Peer: {benchmarks.endgame}
              </span>
            </div>
            <div className="w-full bg-theme-raised rounded-full h-2 overflow-hidden flex">
              <div
                style={{ width: `${(MOCK_PHASE_POINTS_LOST.endgame / 2) * 100}%` }}
                className="bg-emerald-500 rounded-full"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Most Played Openings Table */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-amber-500" />
            <h3 className="font-bold font-display text-theme-text text-base">Opening Repertoire Mastery</h3>
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
            <tbody className="divide-y divide-theme-border/40">
              {MOCK_OPENING_STATS.map((o) => (
                <tr key={o.eco} className="hover:bg-theme-raised/50 transition-colors">
                  <td className="py-3 px-3 font-mono text-xs text-amber-500 font-bold">
                    {o.eco}
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
