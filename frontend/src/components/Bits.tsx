import React from 'react';
import { motion } from 'framer-motion';
import { useMotion } from '@/lib/useMotion';

const PALETTES = [
  ['#f6b13a', '#d9730f'],
  ['#7bb661', '#3f8a46'],
  ['#5aa9e6', '#2d6fb3'],
  ['#e8737a', '#b33d4a'],
  ['#a78bfa', '#6d4fd3'],
  ['#2bc4b0', '#13867a'],
];
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7);

/** Round avatar with a per-name gradient and a soft ring, used for opponents and friends. */
export const PlayerAvatar: React.FC<{ name: string; size?: number; className?: string }> = ({ name, size = 44, className = '' }) => {
  const [a, b] = PALETTES[Math.abs(hash(name)) % PALETTES.length];
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-display font-black text-white flex-shrink-0 select-none ${className}`}
      style={{
        width: size,
        height: size,
        // never below 12px; tiny avatars show a single initial
        fontSize: Math.max(12, size * 0.38),
        background: `linear-gradient(145deg, ${a}, ${b})`,
        boxShadow: `inset 0 2px 0 rgba(255,255,255,.28), inset 0 -2px 0 rgba(0,0,0,.18), 0 0 0 2px rgba(255,255,255,.06), 0 4px 10px -4px ${b}`,
        textShadow: '0 1px 1px rgba(0,0,0,.25)',
      }}
      aria-hidden="true"
    >
      {name.replace(/[^A-Za-z0-9]/g, '').slice(0, size < 32 ? 1 : 2).toUpperCase()}
    </span>
  );
};

/** Win / draw / loss split as one rounded bar that fills in from the left. */
export const WDLBar: React.FC<{ win: number; draw: number; loss: number; height?: number; showLabels?: boolean }> = ({ win, draw, loss, height = 8, showLabels }) => {
  const { isOff } = useMotion();
  const total = win + draw + loss || 1;
  const parts = [
    { v: win, c: 'var(--class-best)', l: 'W' },
    { v: draw, c: '#8b8987', l: 'D' },
    { v: loss, c: 'var(--class-blunder)', l: 'L' },
  ];
  return (
    <div className="space-y-1">
      <div className="flex w-full overflow-hidden rounded-full bg-black/[0.06] dark:bg-black/25" style={{ height }}>
        {parts.map((p, i) => (
          <motion.div
            key={p.l}
            className="h-full"
            style={{ background: p.c, boxShadow: 'inset 0 1px 0 rgba(255,255,255,.25)' }}
            initial={isOff ? false : { width: 0 }}
            animate={{ width: `${(p.v / total) * 100}%` }}
            transition={{ duration: isOff ? 0 : 0.7, delay: isOff ? 0 : 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </div>
      {showLabels && (
        <div className="flex justify-between text-[12px] font-bold tabular-nums">
          <span className="text-[var(--class-best)]">{Math.round(win)}% W</span>
          <span className="text-theme-muted">{Math.round(draw)}% D</span>
          <span className="text-[var(--class-blunder)]">{Math.round(loss)}% L</span>
        </div>
      )}
    </div>
  );
};

/** Big-number tile (rating, accuracy, streak). */
export const StatTile: React.FC<{ label: string; value: React.ReactNode; sub?: React.ReactNode; icon?: React.ReactNode; accent?: string }> = ({ label, value, sub, icon, accent }) => (
  <div className="rounded-xl bg-black/[0.04] dark:bg-black/25 border border-theme-border px-4 py-3 flex items-center gap-3 min-w-0">
    {icon && <div className="flex-shrink-0">{icon}</div>}
    <div className="min-w-0">
      <div className="text-[12px] font-bold uppercase tracking-wider text-theme-muted">{label}</div>
      <div className="text-[22px] leading-tight font-black font-display tabular-nums truncate" style={{ color: accent || 'var(--color-text)' }}>
        {value}
      </div>
      {sub && <div className="text-xs text-theme-muted truncate">{sub}</div>}
    </div>
  </div>
);

/** Small rounded pill used for tags (speed, opening, BOT). */
export const Pill: React.FC<{ children: React.ReactNode; tone?: 'neutral' | 'amber' | 'green' | 'red' | 'blue'; className?: string }> = ({ children, tone = 'neutral', className = '' }) => {
  const tones = {
    neutral: 'bg-black/[0.05] dark:bg-white/[0.07] text-theme-text/80 border-theme-border',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    red: 'bg-red-500/15 text-red-400 border-red-500/30',
    blue: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  };
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[12px] font-bold uppercase tracking-wide ${tones[tone]} ${className}`}>{children}</span>;
};

/** Staggered fade-up for lists of cards. */
export const Reveal: React.FC<{ children: React.ReactNode; i?: number; className?: string }> = ({ children, i = 0, className = '' }) => {
  const { isOff, isFull } = useMotion();
  return (
    <motion.div
      className={className}
      initial={isOff ? false : { opacity: 0, y: isFull ? 12 : 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: isOff ? 0 : 0.35, delay: isOff ? 0 : Math.min(i, 10) * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};
