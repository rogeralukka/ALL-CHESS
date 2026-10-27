import React, { useEffect, useState } from 'react';
import { useMotion } from '@/lib/useMotion';

/** Sprite sheet rendered by scripts/map-art/render_loader.py + pack_loader.py */
const SHEET = '/assets/ui/loader_sheet.webp';
const COLS = 12;
const FRAMES = 96;
const FW = 103;
const FH = 208;
const FPS = 24;

const LINES = ['Setting up the pieces…', 'Polishing the board…', 'Waking up the coach…', 'Counting the squares…'];

/**
 * Game-style loader: a piece hops, backflips and turns into the next piece
 * (pawn → knight → bishop → rook → queen → king). With motion off it shows a still pawn.
 */
export const PieceHopper: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const { isOff } = useMotion();
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (isOff) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      setFrame(Math.floor(((now - start) / 1000) * FPS) % FRAMES);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isOff]);
  const scale = size / FH;
  return (
    <div
      aria-hidden="true"
      style={{
        width: FW * scale,
        height: size,
        backgroundImage: `url(${SHEET})`,
        backgroundSize: `${COLS * FW * scale}px auto`,
        backgroundPosition: `${-(frame % COLS) * FW * scale}px ${-Math.floor(frame / COLS) * FH * scale}px`,
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
};

/** Hopper + label for loading a panel or list inside a page (no full-screen takeover). */
export const InlineLoader: React.FC<{ label?: string; size?: number; className?: string }> = ({ label = 'Loading…', size = 96, className = '' }) => (
  <div className={`flex flex-col items-center justify-center gap-2 py-8 select-none ${className}`} role="status" aria-live="polite" data-testid="inline-loader">
    <PieceHopper size={size} />
    <div className="font-display font-bold text-[14px] text-theme-muted">{label}</div>
  </div>
);

/** Tiny hopper for buttons and toolbars while something is in flight. */
export const MiniHopper: React.FC<{ size?: number }> = ({ size = 30 }) => <PieceHopper size={size} />;

/**
 * Shown while a section's code loads. Waits a moment before appearing so fast loads
 * don't flash it.
 */
export const LoadingScreen: React.FC<{ delayMs?: number; label?: string }> = ({ delayMs = 180, label }) => {
  const [visible, setVisible] = useState(delayMs === 0);
  const [line] = useState(() => LINES[Math.floor(Math.random() * LINES.length)]);
  useEffect(() => {
    if (delayMs === 0) return;
    const t = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);
  if (!visible) return null;
  return (
    <div className="flex-1 min-h-[70vh] flex flex-col items-center justify-center gap-4 select-none" role="status" aria-live="polite" data-testid="loading-screen">
      <div className="relative">
        <PieceHopper size={190} />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-1 w-20 h-3 rounded-full bg-black/30 blur-[3px] -z-10" />
      </div>
      <div className="font-display font-black text-[17px] text-theme-text">{label || line}</div>
      <div className="flex gap-1.5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span key={i} className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
