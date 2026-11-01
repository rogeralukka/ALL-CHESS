import React, { useId } from 'react';
import { Grade, Metric } from './advancedStatsApi';

export const GRADE_COLOR: Record<Grade, string> = { A: '#81b64c', B: '#9fbf86', C: '#f2c14e', D: '#f59a4b', E: '#e8483b' };

export const GradeBadge: React.FC<{ grade: Grade | null }> = ({ grade }) =>
  grade ? (
    <span
      className="inline-flex items-center justify-center w-[22px] h-[22px] rounded-full text-[12px] font-extrabold text-[#1f1d1b]"
      style={{ background: GRADE_COLOR[grade] }}
      aria-label={`Grade ${grade}`}
    >
      {grade}
    </span>
  ) : (
    <span className="text-theme-muted">–</span>
  );

interface AreaChartProps {
  points: Array<{ label: string; value: number }>;
  height?: number;
  ariaLabel: string;
  decimals?: number;
}

/** Filled line chart with min/max labels and first/middle/last dates, in the app's blue-green. */
export const AreaChart: React.FC<AreaChartProps> = ({ points, height = 150, ariaLabel, decimals = 0 }) => {
  const gid = useId().replace(/:/g, '');
  if (points.length === 0) {
    return (
      <div className="flex items-center justify-center text-[14px] text-theme-muted" style={{ height }} data-testid="chart-empty">
        No games played during this time period
      </div>
    );
  }
  const W = 320;
  const H = 100;
  const vals = points.map((p) => p.value);
  let lo = Math.min(...vals);
  let hi = Math.max(...vals);
  if (hi - lo < 1e-9) {
    lo -= 1;
    hi += 1;
  }
  const pad = (hi - lo) * 0.12;
  lo -= pad;
  hi += pad;
  const x = (i: number) => (points.length === 1 ? W / 2 : (i / (points.length - 1)) * W);
  const y = (v: number) => H - ((v - lo) / (hi - lo)) * H;
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const area = `${line} L${x(points.length - 1).toFixed(1)},${H} L${x(0).toFixed(1)},${H} Z`;
  const mid = points[Math.floor(points.length / 2)];
  return (
    <div className="relative" style={{ height }} role="img" aria-label={ariaLabel} data-testid="area-chart">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-x-0 top-0 w-full" style={{ height: height - 22 }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5ea8d8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#5ea8d8" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gid})`} />
        <path d={line} fill="none" stroke="#7cc4ee" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="absolute left-1 top-0 text-[11px] text-theme-muted tabular-nums">{(hi - pad).toFixed(decimals)}</span>
      <span className="absolute left-1 text-[11px] text-theme-muted tabular-nums" style={{ top: height - 40 }}>{(lo + pad).toFixed(decimals)}</span>
      <div className="absolute inset-x-0 bottom-0 flex justify-between text-[11px] text-theme-muted">
        <span>{points[0].label}</span>
        <span>{mid.label}</span>
        <span>{points[points.length - 1].label}</span>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  hint?: string;
  metric: Metric | undefined;
  /** how the value is written: percent (default), plain number */
  kind?: 'pct' | 'num';
  peersEstimated?: boolean;
  testId?: string;
}

/** One Chess.com-style stat card: title, grade, member value and peers (value coloured by grade), optional history. */
export const MetricCard: React.FC<MetricCardProps> = ({ title, hint, metric, kind = 'pct', peersEstimated = true, testId }) => {
  const [open, setOpen] = React.useState(false);
  const fmt = (v: number | null | undefined) => (v === null || v === undefined ? '–' : kind === 'pct' ? `${v.toFixed(1)}%` : v.toFixed(1));
  const color = metric?.grade ? GRADE_COLOR[metric.grade] : undefined;
  const series = metric?.series ?? [];
  return (
    <div className="rounded-[8px] bg-black/[0.06] dark:bg-white/[0.06] p-3" data-testid={testId}>
      <div className="font-display font-extrabold text-[16px] text-theme-text">{title}</div>
      {hint && <div className="text-[13px] text-theme-muted leading-snug mt-0.5">{hint}</div>}
      <div className="flex items-end gap-5 mt-3">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-theme-muted">GRADE</div>
          <div className="h-8 flex items-center"><GradeBadge grade={metric?.grade ?? null} /></div>
        </div>
        <div>
          <div className="text-[11px] font-bold tracking-wider text-theme-muted">MEMBER</div>
          <div className="text-[24px] font-display font-extrabold leading-8 tabular-nums" style={{ color }}>{fmt(metric?.value)}</div>
        </div>
        <div>
          <div className="text-[11px] font-bold tracking-wider text-theme-muted">PEERS{peersEstimated ? ' (EST.)' : ''}</div>
          <div className="text-[24px] font-display font-extrabold leading-8 tabular-nums text-theme-text">{fmt(metric?.peers)}</div>
        </div>
        {series.length > 1 && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? 'Hide history' : 'Show history'}
            className="ml-auto self-center text-theme-muted w-8 h-8 flex items-center justify-center"
          >
            <span className={`inline-block transition-transform ${open ? 'rotate-180' : ''}`}>⌄</span>
          </button>
        )}
      </div>
      {open && series.length > 1 && (
        <div className="mt-3">
          <AreaChart points={series.map((s) => ({ label: s.date.slice(5), value: s.value }))} height={120} decimals={1} ariaLabel={`${title} over time`} />
        </div>
      )}
    </div>
  );
};

export const SectionHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="font-display font-extrabold text-[20px] text-theme-text px-1 pt-2">{children}</h2>
);

export const EmptyNote: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="py-8 text-center text-[14px] text-theme-muted">{children ?? 'No games played during this time period'}</div>
);
