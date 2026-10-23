import React from 'react';
import { motion } from 'framer-motion';
import { Arrow } from '@/data/types';
import { useMotion } from '@/lib/useMotion';

interface ArrowLayerProps {
  arrows: Arrow[];
  orientation: 'white' | 'black';
  /** Arrow being drawn right now (right-drag preview): drawn without the grow-in animation. */
  preview?: Arrow | null;
}

const ARROW_COLORS: Record<NonNullable<Arrow['color']>, string> = {
  green: 'rgba(123, 182, 97, 0.85)',
  red: 'rgba(232, 72, 59, 0.85)',
  blue: 'rgba(82, 152, 220, 0.85)',
  orange: 'rgba(255, 170, 0, 0.8)',
};

// geometry in board units (100 = board width, 12.5 = one square)
const SHAFT = 2.75; // shaft width
const HEAD_W = 6.6; // arrowhead width
const HEAD_L = 5.2; // arrowhead length
const START_OFFSET = 0; // arrows start in the centre of the from-square

const centre = (sq: string, orientation: 'white' | 'black') => {
  const file = sq.charCodeAt(0) - 97;
  const rank = parseInt(sq[1], 10) - 1;
  const col = orientation === 'white' ? file : 7 - file;
  const row = orientation === 'white' ? 7 - rank : rank;
  return { x: col * 12.5 + 6.25, y: row * 12.5 + 6.25 };
};

/**
 * One filled arrow as a single polygon: straight, or bent at a right angle for knight jumps
 * (first along the long leg, then the short one), the way players draw knight moves.
 */
function arrowPolygon(from: string, to: string, orientation: 'white' | 'black'): string {
  const a = centre(from, orientation);
  const b = centre(to, orientation);
  const dxSq = Math.round((b.x - a.x) / 12.5);
  const dySq = Math.round((b.y - a.y) / 12.5);
  const isKnight = (Math.abs(dxSq) === 1 && Math.abs(dySq) === 2) || (Math.abs(dxSq) === 2 && Math.abs(dySq) === 1);
  const pts: Array<{ x: number; y: number }> = isKnight
    ? Math.abs(dySq) === 2
      ? [a, { x: a.x, y: b.y }, b]
      : [a, { x: b.x, y: a.y }, b]
    : [a, b];

  // last segment direction, and the base of the head
  const p = pts[pts.length - 2];
  const q = pts[pts.length - 1];
  const len = Math.hypot(q.x - p.x, q.y - p.y) || 1;
  const ux = (q.x - p.x) / len;
  const uy = (q.y - p.y) / len;
  const base = { x: q.x - ux * HEAD_L, y: q.y - uy * HEAD_L };
  const nx = -uy;
  const ny = ux;
  const hs = SHAFT / 2;
  const hh = HEAD_W / 2;

  // start point, nudged along the first segment
  const f0 = pts[0];
  const f1 = pts[1];
  const fl = Math.hypot(f1.x - f0.x, f1.y - f0.y) || 1;
  const s = { x: f0.x + ((f1.x - f0.x) / fl) * START_OFFSET, y: f0.y + ((f1.y - f0.y) / fl) * START_OFFSET };

  if (pts.length === 2) {
    return [
      [s.x + nx * hs, s.y + ny * hs],
      [base.x + nx * hs, base.y + ny * hs],
      [base.x + nx * hh, base.y + ny * hh],
      [q.x, q.y],
      [base.x - nx * hh, base.y - ny * hh],
      [base.x - nx * hs, base.y - ny * hs],
      [s.x - nx * hs, s.y - ny * hs],
    ]
      .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
      .join(' ');
  }

  // bent arrow: offset both legs by half the shaft width and meet at the corner
  const c = pts[1];
  const u0x = Math.sign(c.x - s.x);
  const u0y = Math.sign(c.y - s.y);
  const n0x = -u0y;
  const n0y = u0x;
  // the legs are perpendicular, so each offset corner is the corner moved by both offsets
  const outer = (side: 1 | -1) => ({
    x: c.x + n0x * hs * side + nx * hs * side,
    y: c.y + n0y * hs * side + ny * hs * side,
  });
  const left = outer(1);
  const right = outer(-1);
  return [
    [s.x + n0x * hs, s.y + n0y * hs],
    [left.x, left.y],
    [base.x + nx * hs, base.y + ny * hs],
    [base.x + nx * hh, base.y + ny * hh],
    [q.x, q.y],
    [base.x - nx * hh, base.y - ny * hh],
    [base.x - nx * hs, base.y - ny * hs],
    [right.x, right.y],
    [s.x - n0x * hs, s.y - n0y * hs],
  ]
    .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(' ');
}

export const ArrowLayer: React.FC<ArrowLayerProps> = ({ arrows, orientation, preview = null }) => {
  const { isFull } = useMotion();
  if ((!arrows || arrows.length === 0) && !preview) return null;

  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none z-20" aria-hidden="true" data-testid="arrow-layer">
      {arrows.map((arr, i) => {
        if (!arr.from || !arr.to || arr.from === arr.to) return null;
        return (
          <motion.polygon
            key={`${arr.from}-${arr.to}-${arr.color || 'green'}-${i}`}
            data-testid={`arrow-${arr.from}-${arr.to}`}
            points={arrowPolygon(arr.from, arr.to, orientation)}
            fill={ARROW_COLORS[arr.color || 'green'] || ARROW_COLORS.green}
            initial={isFull ? { opacity: 0, scale: 0.92 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: isFull ? 0.14 : 0, ease: [0, 0, 0.2, 1] }}
            style={{ transformOrigin: `${centre(arr.from, orientation).x}% ${centre(arr.from, orientation).y}%`, transformBox: 'view-box' }}
          />
        );
      })}
      {preview && preview.from !== preview.to && (
        <polygon points={arrowPolygon(preview.from, preview.to, orientation)} fill={ARROW_COLORS[preview.color || 'orange']} />
      )}
    </svg>
  );
};
