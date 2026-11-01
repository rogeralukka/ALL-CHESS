import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ModeIcon, GameMode } from '@/components/ModeIcon';
import { Segmented } from '@/components/Segmented';
import { InlineLoader } from '@/components/LoadingScreen';
import {
  BrilliantMove,
  EndgamesStats,
  OpeningsStats,
  Overview,
  StatsMode,
  StatsQuery,
  StatsRange,
  StrategyStats,
  TacticsStats,
  fmtNum,
  useAdvancedStats,
} from './advancedStatsApi';
import { AreaChart, EmptyNote, GradeBadge, MetricCard, SectionHeading } from './StatBits';

type TabId = 'overview' | 'openings' | 'tactics' | 'strategy' | 'endgames' | 'brilliant';

const TABS: Array<[TabId, string]> = [
  ['overview', 'Overview'],
  ['openings', 'Openings'],
  ['tactics', 'Tactics'],
  ['strategy', 'Strategy'],
  ['endgames', 'Endgames'],
  ['brilliant', 'Brilliant'],
];
const RANGES: Array<[StatsRange, string]> = [
  ['7d', '7D'],
  ['30d', '30D'],
  ['90d', '90D'],
  ['1y', '1Y'],
  ['all', 'ALL'],
];
const MODES: Array<[StatsMode, string]> = [
  ['all', 'All stats'],
  ['bullet', 'Bullet'],
  ['blitz', 'Blitz'],
  ['rapid', 'Rapid'],
  ['daily', 'Daily'],
];

const asMode = (v: string | null): StatsMode => (MODES.some(([m]) => m === v) ? (v as StatsMode) : 'all');
const asRange = (v: string | null): StatsRange => (RANGES.some(([r]) => r === v) ? (v as StatsRange) : '90d');
const asTab = (v: string | null): TabId => (TABS.some(([t]) => t === v) ? (v as TabId) : 'overview');

const Pending: React.FC<{ loading: boolean; error: string | null; hasData: boolean }> = ({ loading, error, hasData }) => {
  if (hasData) return null;
  if (loading) return <div className="py-10 flex justify-center"><InlineLoader label="Loading stats…" /></div>;
  if (error) return <EmptyNote>{error}</EmptyNote>;
  return null;
};

const OverviewTab: React.FC<{ q: StatsQuery; onOpenTab: (t: TabId) => void }> = ({ q, onOpenTab }) => {
  const { data, loading, error } = useAdvancedStats<Overview>('overview', q);
  if (!data) return <Pending loading={loading} error={error} hasData={false} />;
  const delta = data.ratingDelta ?? 0;
  const areas: Array<[TabId, string, number | null]> = [
    ['openings', 'Openings', data.scores.openings],
    ['tactics', 'Tactics', data.scores.tactics],
    ['strategy', 'Strategy', data.scores.strategy],
    ['endgames', 'Endgames', data.scores.endgames],
  ];
  return (
    <div className="space-y-4" data-testid="stats-overview">
      <div className="flex items-baseline gap-2 px-1">
        <span className="text-[34px] font-display font-extrabold tabular-nums leading-10" data-testid="stats-rating">{data.rating ?? '–'}</span>
        {delta !== 0 && (
          <span className={`text-[15px] font-bold tabular-nums ${delta > 0 ? 'text-[var(--color-win)]' : 'text-[var(--color-loss)]'}`}>
            {delta > 0 ? '▲' : '▼'} {Math.abs(delta)}
          </span>
        )}
      </div>
      <AreaChart points={data.history.map((h) => ({ label: h.date.slice(5), value: h.rating }))} height={160} ariaLabel="Rating over time" />
      <div className="grid grid-cols-2 gap-3">
        {[
          ['Games', data.games, null],
          ['Wins', data.wins, data.winPct],
          ['Draws', data.draws, data.drawPct],
          ['Losses', data.losses, data.lossPct],
        ].map(([label, n, pct]) => (
          <div key={label as string} className="rounded-[8px] bg-black/[0.06] dark:bg-white/[0.06] p-3 text-center">
            <div className="text-[30px] font-display font-extrabold tabular-nums leading-9">{n as number}</div>
            <div className="text-[12px] font-bold text-theme-muted uppercase tracking-wide">
              {label as string}
              {pct !== null && ` ${(pct as number).toFixed(1)}%`}
            </div>
          </div>
        ))}
      </div>
      <SectionHeading>Advanced Stats</SectionHeading>
      <div className="rounded-[8px] bg-black/[0.06] dark:bg-white/[0.06] divide-y divide-white/5" data-testid="stats-areas">
        {areas.map(([tab, label, score]) => (
          <button key={tab} type="button" onClick={() => onOpenTab(tab)} className="w-full flex items-center gap-3 px-4 h-14 text-left active:bg-white/10">
            <span className="flex-1 font-display font-bold text-[17px]">{label}</span>
            <span className="font-display font-extrabold text-[18px] tabular-nums">{score ?? '–'}</span>
            <span className="text-theme-muted">›</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const OpeningsTab: React.FC<{ q: StatsQuery }> = ({ q }) => {
  const [color, setColor] = useState<'white' | 'black'>('white');
  const [showAll, setShowAll] = useState(false);
  const base = useAdvancedStats<OpeningsStats>('openings', { ...q, color: 'all' });
  const byColor = useAdvancedStats<OpeningsStats>('openings', { ...q, color });
  const data = base.data;
  if (!data) return <Pending loading={base.loading} error={base.error} hasData={false} />;
  const est = data.peersEstimated ?? true;
  const list = (byColor.data ?? data).byOpening;
  const shown = showAll ? list : list.slice(0, 5);
  return (
    <div className="space-y-3" data-testid="stats-openings">
      <SectionHeading>Openings Stats</SectionHeading>
      <MetricCard title="Opening Accuracy" hint="Average accuracy score in openings" metric={data.openingAccuracy} peersEstimated={est} />
      <MetricCard title="Avg. Number of Opening Mistakes" hint="Average number of mistakes, misses or blunders played in openings" metric={data.avgOpeningMistakes} kind="num" peersEstimated={est} />
      <MetricCard title="Avg. Number of Book Moves" hint="Average number of book moves played in the opening when leaving book first" metric={data.avgBookMoves} kind="num" peersEstimated={est} />
      <SectionHeading>Performance by Opening</SectionHeading>
      <Segmented<'white' | 'black'> options={[{ value: 'white', label: 'As White' }, { value: 'black', label: 'As Black' }]} value={color} onChange={setColor} />
      {list.length === 0 ? (
        <EmptyNote />
      ) : (
        <div className="space-y-3" data-testid="opening-list">
          {shown.map((o) => (
            <div key={`${o.eco}-${o.name}`} className="rounded-[8px] bg-black/[0.06] dark:bg-white/[0.06] p-3">
              <div className="font-display font-extrabold text-[16px]">{o.name}</div>
              <div className="grid grid-cols-4 gap-2 mt-2 text-[11px] font-bold tracking-wider text-theme-muted">
                <span>GAMES</span><span>WIN %</span><span>ACCURACY</span><span>PEERS{est ? ' (EST.)' : ''}</span>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center text-[20px] font-display font-extrabold tabular-nums">
                <span>{o.games}</span>
                <span>{o.winPct === null ? '–' : `${o.winPct.toFixed(0)}%`}</span>
                <span className="flex items-center gap-1.5"><GradeBadge grade={o.grade} />{fmtNum(o.accuracy)}%</span>
                <span>{o.peers === null ? '–' : `${o.peers.toFixed(1)}%`}</span>
              </div>
            </div>
          ))}
          {list.length > 5 && (
            <button type="button" onClick={() => setShowAll((s) => !s)} className="w-full py-3 text-[14px] font-bold text-theme-muted">
              {showAll ? 'Show Less Openings ⌃' : 'Show All Openings ⌄'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const TacticsTab: React.FC<{ q: StatsQuery }> = ({ q }) => {
  const [side, setSide] = useState<'found' | 'allowed'>('found');
  const { data, loading, error } = useAdvancedStats<TacticsStats>('tactics', { ...q, side });
  return (
    <div className="space-y-3" data-testid="stats-tactics">
      <SectionHeading>Tactics Stats</SectionHeading>
      <Segmented<'found' | 'allowed'> options={[{ value: 'found', label: 'Found' }, { value: 'allowed', label: 'Allowed' }]} value={side} onChange={setSide} />
      {!data ? (
        <Pending loading={loading} error={error} hasData={false} />
      ) : (
        data.categories.map((c) => (
          <MetricCard
            key={c.key}
            title={c.label}
            hint={c.opportunities > 0 ? `${c.opportunities} chance${c.opportunities === 1 ? '' : 's'} in your games` : 'No chances in your games yet'}
            metric={{ value: c.value, peers: c.peers, grade: c.grade }}
            peersEstimated={data.peersEstimated ?? true}
          />
        ))
      )}
    </div>
  );
};

const StrategyTab: React.FC<{ q: StatsQuery }> = ({ q }) => {
  const { data, loading, error } = useAdvancedStats<StrategyStats>('strategy', q);
  if (!data) return <Pending loading={loading} error={error} hasData={false} />;
  const est = data.peersEstimated ?? true;
  const rows: Array<[string, string, keyof StrategyStats]> = [
    ['Overall Strategic Accuracy', 'Your accuracy in middlegame positions', 'overall'],
    ['Pawn Structure Accuracy', 'Accuracy on pawn moves in the middlegame', 'pawnStructure'],
    ['Attacking Accuracy', 'Accuracy when you stand better (+1.0 or more)', 'attacking'],
    ['Defending Accuracy', 'Accuracy when you stand worse (-1.0 or less)', 'defending'],
    ['Active Piece Accuracy', 'Accuracy when moving pieces into the opponent half', 'activePiece'],
    ['Space Advantage Accuracy', 'Accuracy with three or more advanced central pawns', 'spaceAdvantage'],
  ];
  return (
    <div className="space-y-3" data-testid="stats-strategy">
      <SectionHeading>Strategy Stats</SectionHeading>
      {rows.map(([title, hint, key]) => (
        <MetricCard key={key} title={title} hint={hint} metric={data[key] as StrategyStats['overall']} peersEstimated={est} />
      ))}
    </div>
  );
};

const EndgamesTab: React.FC<{ q: StatsQuery }> = ({ q }) => {
  const { data, loading, error } = useAdvancedStats<EndgamesStats>('endgames', q);
  if (!data) return <Pending loading={loading} error={error} hasData={false} />;
  const est = data.peersEstimated ?? true;
  return (
    <div className="space-y-3" data-testid="stats-endgames">
      <SectionHeading>Endgame Win Percentage</SectionHeading>
      <MetricCard title="From Better Position" metric={data.winPct.fromBetter} peersEstimated={est} />
      <MetricCard title="From Equal Position" metric={data.winPct.fromEqual} peersEstimated={est} />
      <MetricCard title="From Worse Position" metric={data.winPct.fromWorse} peersEstimated={est} />
      <SectionHeading>Endgame Accuracy</SectionHeading>
      <MetricCard title="Overall" metric={data.accuracy.overall} peersEstimated={est} />
      <MetricCard title="Rook and Pawn Endgames" metric={data.accuracy.rookAndPawn} peersEstimated={est} />
      <MetricCard title="King and Pawn Endgames" metric={data.accuracy.kingAndPawn} peersEstimated={est} />
      <MetricCard title="Queen Endgames" metric={data.accuracy.queen} peersEstimated={est} />
      <MetricCard title="Other Endgames" metric={data.accuracy.other} peersEstimated={est} />
    </div>
  );
};

const BrilliantTab: React.FC<{ q: StatsQuery }> = ({ q }) => {
  const { data, loading, error } = useAdvancedStats<BrilliantMove[]>('brilliant-moves', q);
  if (!data) return <Pending loading={loading} error={error} hasData={false} />;
  return (
    <div className="space-y-3" data-testid="stats-brilliant">
      <SectionHeading>Brilliant Moves</SectionHeading>
      {data.length === 0 ? (
        <EmptyNote>No brilliant moves in this period yet</EmptyNote>
      ) : (
        data.map((b) => (
          <Link
            key={`${b.gameId}-${b.moveIndex}`}
            to={`/review/${b.gameId}`}
            className="flex items-center gap-3 rounded-[8px] bg-black/[0.06] dark:bg-white/[0.06] p-3 active:bg-white/10"
          >
            <span className="w-8 h-8 rounded-full bg-[#2bc4b0] text-white font-extrabold flex items-center justify-center text-[14px]">!!</span>
            <div className="flex-1 min-w-0">
              <div className="font-display font-extrabold text-[17px]">{b.san}</div>
              <div className="text-[13px] text-theme-muted truncate">
                vs {b.opponent}
                {b.opponentRating ? ` (${b.opponentRating})` : ''} · {b.date.slice(0, 10)}
              </div>
            </div>
            <span className="text-theme-muted">›</span>
          </Link>
        ))
      )}
    </div>
  );
};

/** Chess.com-style Advanced Stats: pick a mode and a time range, then browse Overview / Openings / Tactics / Strategy / Endgames. */
export const AdvancedStats: React.FC = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const mode = asMode(params.get('mode'));
  const range = asRange(params.get('range'));
  const tab = asTab(params.get('tab'));
  const q: StatsQuery = { mode, range };

  const set = (patch: Record<string, string>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => next.set(k, v));
    setParams(next, { replace: true });
  };
  const modeLabel = MODES.find(([m]) => m === mode)?.[1] ?? 'All stats';

  return (
    <div className="flex-1 flex flex-col min-w-0 w-full max-w-[720px] mx-auto pb-24 sm:pb-8" data-testid="advanced-stats">
      <header className="sticky top-0 z-20 bg-theme-page">
        <div className="relative flex items-center justify-center h-[56px] px-3" style={{ background: 'var(--side-header-bg)' }}>
          <button type="button" onClick={() => navigate(-1)} aria-label="Back" className="absolute left-2 w-10 h-10 flex items-center justify-center text-theme-muted">
            <ArrowLeft size={22} />
          </button>
          <h1 className="flex items-center gap-2 font-display font-extrabold text-[24px] leading-none">
            {mode !== 'all' && <ModeIcon mode={mode as GameMode} size={26} />}
            {mode === 'all' ? 'Stats' : modeLabel}
          </h1>
        </div>
        <div className="px-3 pt-2 pb-1 flex items-center gap-2">
          <label className="sr-only" htmlFor="stats-mode">Game mode</label>
          <select
            id="stats-mode"
            value={mode}
            onChange={(e) => set({ mode: e.target.value })}
            className="h-10 flex-1 rounded-[6px] bg-black/[0.08] dark:bg-white/[0.08] px-3 font-bold text-[15px] text-theme-text"
          >
            {MODES.map(([m, label]) => (
              <option key={m} value={m}>{label}</option>
            ))}
          </select>
        </div>
        <div className="flex overflow-x-auto no-scrollbar px-1 border-b border-theme-border/60" role="tablist">
          {TABS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => set({ tab: id })}
              className={`px-4 h-11 text-[15px] font-bold whitespace-nowrap border-b-[3px] -mb-px ${tab === id ? 'border-[var(--color-win)] text-theme-text' : 'border-transparent text-theme-muted'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <div className="px-3 pt-3 space-y-4">
        <div className="flex justify-center gap-1" role="group" aria-label="Time range">
          {RANGES.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => set({ range: id })}
              aria-pressed={range === id}
              className={`h-9 min-w-[52px] px-3 rounded-full text-[14px] font-bold ${range === id ? 'bg-black/25 dark:bg-white/15 text-theme-text' : 'text-theme-muted'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'overview' && <OverviewTab q={q} onOpenTab={(t) => set({ tab: t })} />}
        {tab === 'openings' && <OpeningsTab q={q} />}
        {tab === 'tactics' && <TacticsTab q={q} />}
        {tab === 'strategy' && <StrategyTab q={q} />}
        {tab === 'endgames' && <EndgamesTab q={q} />}
        {tab === 'brilliant' && <BrilliantTab q={q} />}
        <p className="text-[12px] text-theme-muted text-center px-4 pb-2">
          Peer numbers are estimates by rating band, not real player data.
        </p>
      </div>
    </div>
  );
};

export default AdvancedStats;
