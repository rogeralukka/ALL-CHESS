import React, { useId } from 'react';

/** Tiny rating trend for stat tiles: light-blue line over a dark teal fill (reference style). */
export const Sparkline: React.FC<{ values: number[]; height?: number; className?: string }> = ({ values, height = 44, className = '' }) => {
  const id = useId().replace(/:/g, '');
  const w = 200;
  const h = height;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => [(i / Math.max(1, values.length - 1)) * w, h - 6 - ((v - min) / span) * (h - 14)] as const);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={`w-full block ${className}`} style={{ height }} aria-hidden="true">
      <defs>
        <linearGradient id={`sp-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-chart)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--color-chart)" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <path d={`${line} L ${w} ${h} L 0 ${h} Z`} fill={`url(#sp-${id})`} />
      <path d={line} fill="none" stroke="var(--color-chart)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

/** Gold / silver / bronze square with the rank number; plain "#n" after third place. */
export const RankNumber: React.FC<{ rank: number; size?: number }> = ({ rank, size = 34 }) => {
  if (rank > 3) return <span className="inline-block text-center font-display font-bold text-[16px] text-theme-text" style={{ width: size }}>#{rank}</span>;
  const c = rank === 1 ? ['#f7c631', '#d9a41a'] : rank === 2 ? ['#c9c8c5', '#9b9a97'] : ['#cd8a3a', '#a2652a'];
  return (
    <span
      className="inline-flex items-center justify-center rounded-[3px] font-display font-black text-white"
      style={{ width: size, height: size + 4, fontSize: size * 0.62, background: `linear-gradient(180deg, ${c[0]}, ${c[1]})`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,.35), inset 0 -2px 0 rgba(0,0,0,.18)', textShadow: '0 1px 0 rgba(0,0,0,.25)' }}
      aria-label={`Rank ${rank}`}
    >
      {rank}
    </span>
  );
};

/** "Where you stand": a rating distribution curve with a marker at your rating. */
export const DistributionCurve: React.FC<{ rating: number; mean?: number; spread?: number; min?: number; max?: number; height?: number }> = ({ rating, mean = 650, spread = 420, min = 100, max = 3200, height = 120 }) => {
  const w = 300;
  const h = height;
  // log-normal-ish skewed curve: most players low, long tail to the right
  const f = (x: number) => {
    const t = Math.log(Math.max(1, x - min + 60)) - Math.log(mean - min + 60);
    return Math.exp(-(t * t) / (2 * (spread / 1000) ** 2 * 2.2));
  };
  const xs = Array.from({ length: 80 }, (_, i) => min + (i / 79) * (max - min));
  const ys = xs.map(f);
  const top = Math.max(...ys);
  const X = (v: number) => ((v - min) / (max - min)) * w;
  const Y = (v: number) => h - 14 - (v / top) * (h - 24);
  const line = xs.map((x, i) => `${i ? 'L' : 'M'} ${X(x).toFixed(1)} ${Y(ys[i]).toFixed(1)}`).join(' ');
  const rx = X(Math.min(max, Math.max(min, rating)));
  const ticks = [500, 1000, 1500, 2000, 2500, 3000];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }} role="img" aria-label={`Rating distribution, you are at ${rating}`}>
      {ticks.map((t) => (
        <line key={t} x1={X(t)} x2={X(t)} y1={6} y2={h - 14} stroke="rgba(255,255,255,.08)" strokeDasharray="3 3" />
      ))}
      <path d={`${line} L ${w} ${h - 14} L 0 ${h - 14} Z`} fill="var(--color-chart)" opacity={0.12} />
      <path d={line} fill="none" stroke="var(--color-chart)" strokeWidth={2.2} />
      <line x1={rx} x2={rx} y1={4} y2={h - 14} stroke="var(--color-win)" strokeWidth={2} />
      <circle cx={rx} cy={Y(f(rating))} r={4} fill="var(--color-win)" />
      {ticks.map((t) => (
        <text key={t} x={X(t)} y={h - 2} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.5}>
          {t}
        </text>
      ))}
    </svg>
  );
};
