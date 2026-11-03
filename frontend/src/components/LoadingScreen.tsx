import React, { useEffect, useState } from 'react';
import { useMotion } from '@/lib/useMotion';
import { LOADER_SHEET as L } from './loaderSheet';

/** Sprite sheet rendered by scripts/map-art/render_loader.py + pack_loader.py (geometry in loaderSheet.ts) */
const SHEET = '/assets/ui/loader_sheet.webp';
const FPS = 24;
/** frames per hop, as in render_loader.py */
const SEG = 16;

const LINES = ['Setting up the pieces…', 'Polishing the board…', 'Waking up the coach…', 'Counting the squares…'];

/**
 * How high the piece is (0 on the floor, 1 at the top of the jump) and how much it is squashed
 * sideways, for one frame. Same curve the frames were rendered with, so the shadow matches the piece.
 */
function hopAt(frame: number): { lift: number; squash: number } {
  const t = (frame % SEG) / SEG;
  if (t < 0.2) return { lift: 0, squash: 1 + 0.12 * Math.sin((t / 0.2) * (Math.PI / 2)) };
  if (t < 0.85) {
    const k = (t - 0.2) / 0.65;
    return { lift: 4 * k * (1 - k), squash: 1 };
  }
  return { lift: 0, squash: 1 + 0.1 * Math.sin(((t - 0.85) / 0.15) * Math.PI) };
}

/**
 * Game-style loader: a piece hops, backflips and turns into the next piece
 * (pawn → knight → bishop → rook → queen → king). Its shadow is drawn here, under the piece:
 * it narrows and fades as the piece jumps, and widens as it lands. With motion off it shows a still pawn.
 */
export const PieceHopper: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const { isOff } = useMotion();
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (isOff) return;
    let raf = 0;
    const start = performance.now();
    let shown = -1;
    const tick = (now: number) => {
      // the sprite changes 24 times a second, so only touch React when the frame really changes
      const f = Math.floor(((now - start) / 1000) * FPS) % L.frames;
      if (f !== shown) {
        shown = f;
        setFrame(f);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isOff]);
  const scale = size / L.fh;
  const { lift, squash } = hopAt(frame);
  const shadowW = L.baseW * scale * 1.25 * (1 - 0.5 * lift) * squash;
  return (
    <div aria-hidden="true" className="relative" style={{ width: L.fw * scale, height: size }}>
      <div
        className="absolute rounded-[50%] pointer-events-none"
        style={{
          left: L.groundX * scale,
          top: L.groundY * scale,
          width: shadowW,
          height: Math.max(2, shadowW * 0.24),
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(closest-side, rgba(0,0,0,0.5), rgba(0,0,0,0.28) 55%, rgba(0,0,0,0) 100%)',
          opacity: 1 - 0.6 * lift,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${SHEET})`,
          backgroundSize: `${L.sheetW * scale}px ${L.sheetH * scale}px`,
          backgroundPosition: `${-(frame % L.cols) * (L.fw + L.gap) * scale}px ${-Math.floor(frame / L.cols) * (L.fh + L.gap) * scale}px`,
          backgroundRepeat: 'no-repeat',
        }}
      />
    </div>
  );
};

/**
 * Hopper + label for loading a panel or list inside a page (no full-screen takeover).
 * `page` makes it fill the page and sit in the middle, bigger: use it when it is the only thing on screen.
 */
export const InlineLoader: React.FC<{ label?: string; size?: number; className?: string; page?: boolean }> = ({ label = 'Loading…', size, className = '', page = false }) => (
  <div
    className={`flex flex-col items-center justify-center gap-2 select-none ${page ? 'flex-1 min-h-[calc(100dvh-150px)] py-8' : 'py-8'} ${className}`}
    role="status"
    aria-live="polite"
    data-testid="inline-loader"
  >
    <PieceHopper size={size ?? (page ? 260 : 96)} />
    <div className={`font-display font-bold text-theme-muted ${page ? 'text-[17px]' : 'text-[14px]'}`}>{label}</div>
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
      <PieceHopper size={190} />
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
