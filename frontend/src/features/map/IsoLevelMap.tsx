import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Lock } from 'lucide-react';
import { useMotion } from '@/lib/useMotion';
import spriteData from '@/data/mapSprites.json';

/**
 * Isometric level map: a winding path of numbered wooden tiles through a little park.
 *
 * All art is pre-rendered (scripts/map-art) from our own procedural models; this component only
 * lays sprites out on a 2:1 isometric grid, sorts them back-to-front and adds the interactive bits:
 * numbers, the coach standing on the current tile, the hop to the next tile, hover and focus.
 */

type SpriteName = keyof typeof spriteData.sprites;
interface SpriteInfo {
  w: number;
  h: number;
  ax: number;
  ay: number;
  tx: number;
  ty: number;
}
const SPRITES = spriteData.sprites as Record<string, SpriteInfo>;
const SPRITE_TILE_W = spriteData.tileWidthPx;
const SPRITE_BASE = '/assets/map/';

export interface IsoLevelMapProps {
  levelCount: number;
  /** 0-based index of the level the player is on. Lower indices are done. */
  currentIndex: number;
  /** When set, the coach hops from this tile to currentIndex once the map is on screen. */
  hopFrom?: number | null;
  onSelect?: (index: number) => void;
  /** Optional names (Learn path); shown next to the current tile and on hover. */
  labels?: string[];
  /** Index of a tile to mark as selected (Learn path). */
  selectedIndex?: number | null;
  /** Tiles after this index cannot be clicked (default: the current tile). */
  unlockedUpTo?: number;
  /** Show a lock instead of the number on tiles that cannot be clicked yet. */
  showLockIcons?: boolean;
  /** On-screen width of one tile in px. */
  tileWidth?: number;
  /** Changes the scenery layout. */
  seed?: number;
  className?: string;
}

// ------------------------------------------------------------------ layout helpers
/**
 * Path in screen units of one tile width: runs of four tiles alternating up-left and up-right,
 * each step climbing 0.62 of a tile so the tiles read as stepping stones with grass between them.
 */
const STEP_X = 0.5;
const STEP_Y = 0.62;
function pathPoints(n: number, T: number) {
  const pts: Array<{ x: number; y: number; dir: 1 | -1 }> = [];
  let x = 0;
  let y = 0;
  for (let i = 0; i < n; i++) {
    const dir: 1 | -1 = Math.floor((i + 2) / 4) % 2 === 0 ? -1 : 1;
    pts.push({ x, y, dir });
    x += dir * STEP_X * T;
    y -= STEP_Y * T;
  }
  return pts;
}

function hash(a: number, b: number, seed: number) {
  let h = (a * 374761393 + b * 668265263 + seed * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

interface Placed {
  key: string;
  sprite: string;
  sx: number; // screen x of the ground anchor (map coords)
  sy: number;
  scale?: number;
  flip?: boolean;
}

const LANDMARKS: Array<{ at: number; sprite: string; side: 1 | -1; dist: number; big?: boolean }> = [
  { at: 2, sprite: 'cabin', side: 1, dist: 2.2, big: true },
  { at: 5, sprite: 'bench_board', side: -1, dist: 1.7 },
  { at: 9, sprite: 'pond', side: 1, dist: 2.3, big: true },
  { at: 13, sprite: 'rook_statue', side: -1, dist: 1.8 },
  { at: 16, sprite: 'lamp', side: 1, dist: 1.4 },
  { at: 18, sprite: 'chest', side: -1, dist: 1.5 },
];
const TREES = ['tree_round_a', 'tree_round_b', 'tree_round_c', 'tree_round_a', 'tree_round_b', 'tree_pine_a', 'tree_pine_b'];
const SMALL = ['bush_a', 'bush_b', 'flowers', 'rocks', 'stump', 'tufts', 'tufts', 'flowers'];

export const IsoLevelMap: React.FC<IsoLevelMapProps> = ({
  levelCount,
  currentIndex,
  hopFrom = null,
  onSelect,
  labels,
  selectedIndex = null,
  unlockedUpTo,
  showLockIcons = false,
  tileWidth = 82,
  seed = 7,
  className = '',
}) => {
  const { isFull, isOff } = useMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(400);
  const [hovered, setHovered] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth || 400);
    update();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const T = tileWidth;
  const H = T / 2;
  const k = T / SPRITE_TILE_W; // sprite px -> screen px

  const layout = useMemo(() => {
    const pts = pathPoints(levelCount, T);
    const minY = Math.min(...pts.map((t) => t.y));
    const maxY = Math.max(...pts.map((t) => t.y));
    const padTop = T * 1.5;
    const padBottom = T * 1.3;
    const height = maxY - minY + padTop + padBottom;
    const ox = width / 2; // path is centred horizontally
    const oy = -minY + padTop;
    const tiles = pts.map((p, i) => ({ i, x: p.x + ox, y: p.y + oy, dir: p.dir }));

    // scenery keeps clear of the path: an elliptical lane around every tile
    const blocked: Array<{ x: number; y: number; rx: number; ry: number }> = tiles.map((t) => ({ x: t.x, y: t.y, rx: T * 0.95, ry: T * 0.62 }));
    const isFree = (x: number, y: number) => blocked.every((b) => ((x - b.x) / b.rx) ** 2 + ((y - b.y) / b.ry) ** 2 > 1);

    const props: Placed[] = [];
    const place = (key: string, sprite: string, x: number, y: number, scale = 1, flip = false, footprint = 0.55) => {
      blocked.push({ x, y, rx: T * footprint, ry: T * footprint * 0.55 });
      props.push({ key, sprite, sx: x, sy: y, scale, flip });
    };

    // landmarks beside specific tiles, on the outside of the bend
    LANDMARKS.forEach((lm, n) => {
      if (lm.at >= levelCount) return;
      const t = tiles[lm.at];
      const x = t.x + lm.side * lm.dist * T;
      if (x < T * 0.6 || x > width - T * 0.6) return;
      place(`lm${n}`, lm.sprite, x, t.y + T * 0.1, 1, false, lm.big ? 1.25 : 0.75);
    });

    // scatter trees and small things on an isometric grid over the rest of the grass
    const H = T / 2;
    const cols = Math.ceil(width / T) + 2;
    const rows = Math.ceil(height / H) + 2;
    for (let r = 0; r < rows; r++) {
      for (let c = -1; c < cols; c++) {
        const x = c * T + (r % 2 ? T / 2 : 0);
        const y = r * H;
        if (y < T * 0.35 || y > height - T * 0.15) continue;
        // jitter so the grid never shows
        const jx = (hash(c, r, seed + 11) - 0.5) * T * 0.35;
        const jy = (hash(r, c, seed + 12) - 0.5) * H * 0.35;
        const px = x + jx;
        const py = y + jy;
        if (!isFree(px, py)) continue;
        const roll = hash(c, r, seed);
        const edge = Math.min(px, width - px) < width * 0.2;
        if (roll < (edge ? 0.42 : 0.2)) {
          const tree = TREES[Math.floor(hash(r, c, seed + 1) * TREES.length)];
          place(`t${c},${r}`, tree, px, py, 0.95 + hash(c, r, seed + 2) * 0.3, hash(c, r, seed + 3) > 0.5, 0.48);
        } else if (roll < (edge ? 0.52 : 0.34)) {
          const sm = SMALL[Math.floor(hash(r, c, seed + 4) * SMALL.length)];
          place(`s${c},${r}`, sm, px, py, 0.9 + hash(c, r, seed + 5) * 0.2, hash(c, r, seed + 6) > 0.5, 0.3);
        }
      }
    }

    return { height, tiles, props };
  }, [levelCount, width, T, seed]);

  // keep the current tile in view (centred) when the map opens or the level changes
  useEffect(() => {
    const el = scrollRef.current;
    const t = layout.tiles[Math.min(currentIndex, layout.tiles.length - 1)];
    if (!el || !t) return;
    el.scrollTop = Math.max(0, t.y - el.clientHeight * 0.55);
  }, [layout, currentIndex]);

  // coach hop: start on hopFrom, jump to current after the map has faded in
  const [coachAt, setCoachAt] = useState<number>(hopFrom ?? currentIndex);
  const [hopping, setHopping] = useState(false);
  useEffect(() => {
    if (hopFrom === null || hopFrom === undefined || hopFrom === currentIndex || isOff) {
      setCoachAt(currentIndex);
      return;
    }
    setCoachAt(hopFrom);
    const t1 = window.setTimeout(() => {
      setHopping(true);
      setCoachAt(currentIndex);
    }, 650);
    const t2 = window.setTimeout(() => setHopping(false), 650 + 620);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [hopFrom, currentIndex, isOff]);

  const tileSprite = (i: number) => {
    if (i < currentIndex) return 'tile_done';
    if (i === currentIndex) return 'tile_current';
    return i % 2 === 0 ? 'tile_oak' : 'tile_walnut';
  };

  // draw list, back to front
  type Item = { kind: 'prop'; p: Placed } | { kind: 'tile'; i: number; x: number; y: number };
  const items: Item[] = [
    ...layout.props.map((p) => ({ kind: 'prop' as const, p })),
    ...layout.tiles.map((t) => ({ kind: 'tile' as const, i: t.i, x: t.x, y: t.y })),
  ].sort((a, b) => (a.kind === 'prop' ? a.p.sy : a.y) - (b.kind === 'prop' ? b.p.sy : b.y));

  const coachTile = layout.tiles[Math.min(coachAt, layout.tiles.length - 1)];
  const coachSprite = SPRITES['tile_current'];
  const coachH = T * 1.12;
  const coachW = coachH * (768 / 1152);

  return (
    <div
      ref={scrollRef}
      // no `relative` here: callers position the map (e.g. `absolute inset-0`), and Tailwind's
      // `relative` would override their `absolute`, letting the map grow instead of scrolling
      className={`overflow-y-auto overflow-x-hidden select-none ${className}`}
      style={{ scrollbarWidth: 'thin' }}
      data-testid="level-map"
    >
      <div
        className="relative w-full"
        style={{
          height: layout.height,
          // grass: a 2:1 isometric checker in two greens, with a soft light falling from the top
          backgroundColor: '#5f9f45',
          backgroundImage: `radial-gradient(120% 60% at 50% 0%, rgba(255,255,230,0.14), transparent 60%), url("data:image/svg+xml;utf8,${encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='${T}' height='${H}' viewBox='0 0 ${T} ${H}'><rect width='${T}' height='${H}' fill='#5f9f45'/><path d='M${T / 2} 0 L${T} ${H / 2} L${T / 2} ${H} L0 ${H / 2} Z' fill='#66a84b'/></svg>`
          )}")`,
          backgroundSize: `100% 100%, ${T}px ${H}px`,
          backgroundPosition: `0 0, ${width / 2 - T / 2}px 0px`,
        }}
      >
        {items.map((it) => {
          if (it.kind === 'prop') {
            const s = SPRITES[it.p.sprite];
            if (!s) return null;
            const sc = k * (it.p.scale || 1);
            return (
              <img
                key={it.p.key}
                src={`${SPRITE_BASE}${it.p.sprite}.webp`}
                alt=""
                draggable={false}
                className="absolute pointer-events-none"
                style={{
                  left: it.p.sx - (it.p.flip ? s.w - s.ax : s.ax) * sc,
                  top: it.p.sy - s.ay * sc,
                  width: s.w * sc,
                  height: s.h * sc,
                  transform: it.p.flip ? 'scaleX(-1)' : undefined,
                }}
              />
            );
          }
          const i = it.i;
          const name = tileSprite(i);
          const s = SPRITES[name];
          if (!s) return null;
          const done = i < currentIndex;
          const current = i === currentIndex;
          const locked = i > (unlockedUpTo ?? currentIndex);
          const clickable = !!onSelect && !locked;
          const lifted = (hovered === i && clickable) || selectedIndex === i;
          const label = labels?.[i];
          const darkNumber = name === 'tile_oak' || name === 'tile_current';
          return (
            <div
              key={`tile-${i}`}
              className="absolute"
              style={{ left: it.x - s.ax * k, top: it.y - s.ay * k, width: s.w * k, height: s.h * k }}
            >
              <motion.button
                type="button"
                data-testid={`map-tile-${i}`}
                data-state={done ? 'done' : current ? 'current' : locked ? 'locked' : 'open'}
                aria-label={`${label ? label + ', ' : ''}level ${i + 1}${done ? ', completed' : current ? ', current' : ', locked'}`}
                disabled={!clickable}
                onClick={() => onSelect?.(i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered((h) => (h === i ? null : h))}
                className={`relative block w-full h-full focus:outline-none ${clickable ? 'cursor-pointer' : 'cursor-default'}`}
                animate={{ y: lifted && !isOff ? -4 : 0 }}
                transition={{ duration: 0.15, ease: [0, 0, 0.2, 1] }}
              >
                {current && (
                  <span
                    aria-hidden="true"
                    className="absolute pointer-events-none rounded-[50%]"
                    style={{
                      left: s.tx * k - T * 0.62,
                      top: s.ty * k - H * 0.62,
                      width: T * 1.24,
                      height: H * 1.24,
                      background: 'radial-gradient(closest-side, rgba(255,220,110,0.75), rgba(255,200,80,0.25) 60%, transparent)',
                      animation: isFull ? 'mapGlow 1.8s ease-in-out infinite' : undefined,
                    }}
                  />
                )}
                <img
                  src={`${SPRITE_BASE}${name}.webp`}
                  alt=""
                  draggable={false}
                  className="relative w-full h-full pointer-events-none"
                  style={{ filter: selectedIndex === i ? 'drop-shadow(0 0 4px rgba(255,255,255,0.9))' : undefined }}
                />
                <span
                  className="absolute flex items-center justify-center font-display font-black leading-none pointer-events-none"
                  style={{
                    left: s.tx * k,
                    top: s.ty * k,
                    transform: 'translate(-50%, -54%)',
                    fontSize: T * 0.27,
                    color: darkNumber ? '#5b3613' : '#ffffff',
                    textShadow: darkNumber ? '0 1px 0 rgba(255,240,200,0.7)' : '0 1.5px 0 rgba(0,0,0,0.45)',
                  }}
                >
                  {done ? (
                    <Check size={T * 0.32} strokeWidth={4} color="#ffffff" style={{ filter: 'drop-shadow(0 1.5px 0 rgba(0,0,0,0.35))' }} />
                  ) : locked && showLockIcons ? (
                    <Lock size={T * 0.2} strokeWidth={3} color={darkNumber ? '#5b3613' : '#ffffff'} />
                  ) : (
                    i + 1
                  )}
                </span>
              </motion.button>

              {label && (hovered === i || (current && hovered === null) || selectedIndex === i) && (() => {
                // put the label on whichever side of the tile has more room, wrapping if needed
                const right = it.x <= width / 2;
                const room = right ? width - (it.x + T * 0.62) - 8 : it.x - T * 0.62 - 8;
                return (
                  <div
                    className="absolute z-10 pointer-events-none px-2.5 py-1 rounded-md bg-black/75 text-white text-xs font-bold shadow-lg w-max leading-snug"
                    style={{
                      left: s.tx * k + (right ? T * 0.62 : -T * 0.62),
                      top: s.ty * k,
                      maxWidth: Math.max(90, room),
                      transform: right ? 'translateY(-50%)' : 'translate(-100%, -50%)',
                    }}
                  >
                    {label}
                  </div>
                );
              })()}
            </div>
          );
        })}

        {/* The coach stands on the current tile and hops forward when a level is finished */}
        {coachTile && coachSprite && (
          <motion.div
            className="absolute pointer-events-none z-20"
            data-testid="map-coach"
            data-at={coachAt}
            style={{ width: coachW, height: coachH }}
            initial={false}
            animate={{
              // feet (97% down the image, body slightly right of centre because of the waving arm)
              // on the centre of the tile's top face
              left: coachTile.x - coachW * 0.56,
              top: coachTile.y - (coachSprite.ay - coachSprite.ty) * k - coachH * 0.95,
              y: hopping && isFull ? [0, -T * 0.55, 0] : 0,
              scaleY: hopping && isFull ? [1, 1.04, 0.92, 1] : 1,
            }}
            transition={{
              left: { duration: isOff ? 0 : 0.55, ease: [0.4, 0, 0.6, 1] },
              top: { duration: isOff ? 0 : 0.55, ease: [0.4, 0, 0.6, 1] },
              y: { duration: 0.55, times: [0, 0.45, 1], ease: ['easeOut', 'easeIn'] },
              scaleY: { duration: 0.62, times: [0, 0.4, 0.88, 1] },
            }}
          >
            <span
              aria-hidden="true"
              className="absolute left-1/2 -translate-x-1/2 rounded-[50%] bg-black/30 blur-[2px]"
              style={{ bottom: coachH * 0.02, width: coachW * 0.55, height: coachW * 0.16 }}
            />
            <motion.img
              src="/assets/coach/coach_wave_full.webp"
              alt="Your coach"
              draggable={false}
              className="relative w-full h-full object-contain"
              style={{ transformOrigin: '50% 100%', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))' }}
              animate={isFull && !hopping ? { y: [0, -2, 0] } : { y: 0 }}
              transition={isFull && !hopping ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.1 }}
            />
          </motion.div>
        )}
      </div>

      {/* soft fade at the top and bottom edges of the scroll area */}
      <div className="pointer-events-none sticky bottom-0 left-0 right-0 h-10 -mt-10 bg-gradient-to-t from-black/25 to-transparent" />
    </div>
  );
};

export type { SpriteName };
export default IsoLevelMap;
