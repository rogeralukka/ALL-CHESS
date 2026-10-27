import React, { useState } from "react";
import { useAuthStore } from "@/data/authStore";
import { motion } from "framer-motion";
import { useMotion } from "@/lib/useMotion";

/**
 * Player avatar. Uses the account's own picture when we have one (the signed-in user's Chess.com /
 * Lichess photo), otherwise the neutral grey pawn tile that Chess.com shows for players without a photo.
 */
export const PlayerAvatar: React.FC<{
  name: string;
  size?: number;
  className?: string;
  square?: boolean;
  /** explicit picture URL (e.g. a friend's Chess.com avatar) */
  src?: string | null;
}> = ({ name, size = 44, className = "", square, src }) => {
  const me = useAuthStore((s) => s.user);
  const [broken, setBroken] = useState(false);
  const isMe = name === "You" || (!!me && name === me.username);
  const url = !broken ? (src ?? (isMe ? me?.avatarUrl : null)) : null;
  const radius = square ? (size >= 40 ? 4 : 3) : 999;
  if (url) {
    return (
      <span className={`inline-block overflow-hidden flex-shrink-0 bg-[#3a3835] ${className}`} style={{ width: size, height: size, borderRadius: radius }} aria-hidden="true">
        <img src={url} alt="" className="w-full h-full object-cover" onError={() => setBroken(true)} referrerPolicy="no-referrer" />
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-end justify-center overflow-hidden flex-shrink-0 select-none ${className}`}
      style={{ width: size, height: size, borderRadius: radius, background: "linear-gradient(180deg, #e2e2df 0%, #cfcfcb 100%)" }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 40 40" width={size * 0.86} height={size * 0.86}>
        <circle cx="20" cy="12" r="6.4" fill="#9d9c99" />
        <path d="M14.5 19.5 H25.5 L24 22.5 C25.8 25.5 27 29 27.5 32 H12.5 C13 29 14.2 25.5 16 22.5 Z" fill="#9d9c99" />
        <rect x="9.5" y="32.5" width="21" height="5" rx="2" fill="#9d9c99" />
        <circle cx="18" cy="10.5" r="2.2" fill="#fff" fillOpacity=".45" />
      </svg>
    </span>
  );
};

/** Win / draw / loss split as one rounded bar that fills in from the left. */
export const WDLBar: React.FC<{
  win: number;
  draw: number;
  loss: number;
  height?: number;
  showLabels?: boolean;
}> = ({ win, draw, loss, height = 10, showLabels }) => {
  const { isOff } = useMotion();
  const total = win + draw + loss || 1;
  // flat segments with thin gaps, like the reference results bars: green, light grey, red
  const parts = [
    { v: win, c: "#81b64c", l: "W", name: "Wins" },
    { v: draw, c: "#a7a6a2", l: "D", name: "Draws" },
    { v: loss, c: "#e0523f", l: "L", name: "Losses" },
  ];
  return (
    <div className="space-y-1.5">
      <div
        className="flex w-full gap-[2px]"
        style={{ height }}
        role="img"
        aria-label={`${Math.round(win)}% wins, ${Math.round(draw)}% draws, ${Math.round(loss)}% losses`}
      >
        {parts.map((p, i) =>
          p.v > 0 ? (
            <motion.div
              key={p.l}
              className="h-full"
              style={{
                background: p.c,
                borderRadius: 2,
                borderTopLeftRadius: i === 0 ? 4 : 2,
                borderBottomLeftRadius: i === 0 ? 4 : 2,
                borderTopRightRadius: i === 2 || (i === 1 && loss <= 0) ? 4 : 2,
                borderBottomRightRadius: i === 2 || (i === 1 && loss <= 0) ? 4 : 2,
                boxShadow: "inset 0 -2px 0 rgba(0,0,0,.2)",
              }}
              initial={isOff ? false : { width: 0 }}
              animate={{ width: `${(p.v / total) * 100}%` }}
              transition={{
                duration: isOff ? 0 : 0.6,
                delay: isOff ? 0 : 0.05 + i * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          ) : null
        )}
      </div>
      {showLabels && (
        <div className="flex items-center gap-3.5 text-[12px] font-semibold tabular-nums text-theme-muted">
          {parts.map((p) => (
            <span key={p.l} className="inline-flex items-center gap-1.5" title={p.name}>
              <span className="w-2 h-2 rounded-[2px]" style={{ background: p.c }} />
              <b className="text-theme-text">{Math.round(p.v)}%</b> {p.l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

/** Big-number tile (rating, accuracy, streak), drawn as a chunky game badge tinted by its accent. */
export const StatTile: React.FC<{
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon?: React.ReactNode;
  accent?: string;
}> = ({ label, value, sub, icon, accent }) => (
  // flat stat block (reference style): small muted label over a big bold number
  <div className="panel px-4 py-3 flex items-center gap-3 min-w-0">
    {icon && <div className="flex-shrink-0">{icon}</div>}
    <div className="min-w-0">
      <div className="text-[12px] font-semibold text-theme-muted leading-4">{label}</div>
      <div className="text-[22px] leading-7 font-bold font-display tabular-nums truncate" style={{ color: accent || "var(--color-text)" }}>
        {value}
      </div>
      {sub && <div className="text-[12px] text-theme-muted truncate">{sub}</div>}
    </div>
  </div>
);

/** Slim progress bar (puzzle / XP style). */
export const Meter: React.FC<{
  value: number;
  color: string;
  height?: number;
  className?: string;
  label?: string;
}> = ({ value, color, height = 14, className = "", label }) => {
  const { isOff } = useMotion();
  return (
    <div
      className={`rounded-full bg-black/[0.08] dark:bg-white/[0.1] ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(value * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className="relative w-full overflow-hidden rounded-full"
        style={{ height }}
      >
        <motion.div
          className="absolute left-0 top-0 bottom-0 rounded-full"
          style={{
            background: color,
          }}
          initial={isOff ? false : { width: 0 }}
          animate={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }}
          transition={{ duration: isOff ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
};

/** Small rounded pill used for tags (speed, opening, BOT). */
export const Pill: React.FC<{
  children: React.ReactNode;
  tone?: "neutral" | "amber" | "green" | "red" | "blue";
  className?: string;
}> = ({ children, tone = "neutral", className = "" }) => {
  const tones = {
    neutral:
      "bg-black/[0.05] dark:bg-white/[0.07] text-theme-text/80 border-theme-border",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    green: "bg-[#81b64c]/15 text-[#81b64c] border-transparent",
    red: "bg-red-500/15 text-red-400 border-red-500/30",
    blue: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[3px] text-[12px] font-bold uppercase tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
};

/** Staggered fade-up for lists of cards. */
export const Reveal: React.FC<{
  children: React.ReactNode;
  i?: number;
  className?: string;
}> = ({ children, i = 0, className = "" }) => {
  const { isOff, isFull } = useMotion();
  return (
    <motion.div
      className={className}
      initial={isOff ? false : { opacity: 0, y: isFull ? 12 : 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: isOff ? 0 : 0.35,
        delay: isOff ? 0 : Math.min(i, 10) * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
};
