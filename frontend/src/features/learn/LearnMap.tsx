import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Target } from 'lucide-react';
import { LessonStage } from '@/data/types';
import { iconForStage } from './learnIcons';
import { ROW_CQW, SECTION_THEMES, SLOT_X, SectionId, buildLayout } from './learnLayout';

interface LearnMapProps {
  stages: LessonStage[];
  selectedId?: string | null;
  onSelect: (stage: LessonStage) => void;
  /** Reports the section at the bottom of the viewport, so the screen can tint its bottom bar */
  onSectionChange?: (section: SectionId) => void;
  /** Id of the "next" lesson, which glows and gets the Next tooltip */
  currentId?: string | null;
  /** Smaller path for the narrow desktop panel, as on chess.com/learn */
  compact?: boolean;
}

const DECOR = ['bishop', 'rook', 'knight', 'pawn', 'queen', 'bishop', 'king', 'pawn', 'rook', 'knight'] as const;

const cq = (n: number) => `${n}cqw`;

/*
 * Every 3D asset in /assets/learn (slabs, medallions, pieces) is rendered by scripts/learn-assets with one
 * orthographic camera, looking down the grid diagonal. A 1x1 floor square projects to exactly the diamond
 * the CSS grid draws, and the floor point under each asset sits at 50% across / 80% down its image.
 * So an asset is placed by putting that anchor on its cell's centre, at a width of cell / 0.7071.
 */
const CELL_W = 44.4;
const SPRITE_W = CELL_W / 0.7071; // 62.8cqw
const SPRITE_H = SPRITE_W * 1.25;
/** how far the top face of a slab sits above the floor, on screen */
const SLAB_LIFT = 2.6;

const Sprite: React.FC<{ src: string; x: number; cy: number; z: number; className?: string; style?: React.CSSProperties }> = ({ src, x, cy, z, className = '', style }) => (
  <img
    src={src}
    alt=""
    aria-hidden="true"
    draggable={false}
    className={`absolute pointer-events-none select-none ${className}`}
    style={{ left: `calc(${x}% - ${cq(SPRITE_W / 2)})`, top: cq(cy - SPRITE_H * 0.8), width: cq(SPRITE_W), height: cq(SPRITE_H), zIndex: z, ...style }}
  />
);

export const LearnMap: React.FC<LearnMapProps> = ({ stages, selectedId, onSelect, onSectionChange, currentId, compact }) => {
  const layout = useMemo(() => buildLayout(stages), [stages]);
  const scroller = useRef<HTMLDivElement>(null);
  const [visibleSection, setVisibleSection] = useState<SectionId>(layout.rowSection[0] ?? 'openings');
  const [hideName, setHideName] = useState(false);
  const [currentVisible, setCurrentVisible] = useState<'above' | 'below' | 'in'>('in');

  const totalCqw = layout.rows * ROW_CQW;
  const rowTop = (row: number) => (layout.rows - 1 - row) * ROW_CQW;
  const rowCenter = (row: number) => rowTop(row) + ROW_CQW / 2;
  const currentRow = layout.items.find((i) => i.kind === 'node' && i.stage.id === currentId)?.row ?? 0;

  const measure = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const pitch = (el.clientWidth * ROW_CQW) / 100;
    const fromBottom = el.scrollHeight - (el.scrollTop + el.clientHeight);
    const bottomRow = Math.max(0, Math.min(layout.rows - 1, Math.round(fromBottom / pitch)));
    const sec = layout.rowSection[bottomRow] ?? 'openings';
    setVisibleSection(sec);
    onSectionChange?.(sec);
    // the big section name at the bottom would sit on top of a "Next section" label that is close to it
    const px = el.clientWidth / 100;
    const viewBottom = el.scrollTop + el.clientHeight;
    setHideName(layout.items.some((i) => i.kind === 'label' && viewBottom - rowCenter(i.row) * px < el.clientHeight * 0.3 && viewBottom - rowCenter(i.row) * px > -ROW_CQW * px));
    const curCenterY = rowCenter(currentRow) * (el.clientWidth / 100);
    if (curCenterY < el.scrollTop) setCurrentVisible('above');
    else if (curCenterY > el.scrollTop + el.clientHeight) setCurrentVisible('below');
    else setCurrentVisible('in');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout, currentRow, onSectionChange]);

  const scrollToCurrent = useCallback(
    (smooth: boolean) => {
      const el = scroller.current;
      if (!el) return;
      const y = rowCenter(currentRow) * (el.clientWidth / 100);
      const target = Math.max(0, y - el.clientHeight * 0.62);
      if (typeof el.scrollTo === 'function') el.scrollTo({ top: target, behavior: smooth ? 'smooth' : 'auto' });
      else el.scrollTop = target;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentRow, layout],
  );

  useEffect(() => {
    scrollToCurrent(false);
    measure();
  }, [scrollToCurrent, measure]);

  const theme = SECTION_THEMES[visibleSection];

  // background diamonds: even rows at 27% and 73%, odd rows at 4%, 50% and 96%
  const cells: { row: number; x: number; col: number }[] = [];
  for (let r = -1; r <= layout.rows; r++) {
    if (r % 2 === 0) [27, 73].forEach((x, i) => cells.push({ row: r, x, col: i }));
    else [50].forEach((x, i) => cells.push({ row: r, x, col: i }));
  }

  return (
    <div className="relative h-full w-full isolate" data-testid="learn-map">
      <div ref={scroller} onScroll={measure} className="absolute inset-0 overflow-y-auto overflow-x-hidden no-scrollbar" style={{ background: '#242320' }}>
        <div className={`mx-auto w-full ${compact ? 'max-w-[300px]' : 'max-w-[560px]'}`} style={{ containerType: 'inline-size' }}>
          <div className="relative w-full" style={{ height: cq(totalCqw) }}>
            {cells.map((c) => {
              const sec = layout.rowSection[Math.max(0, Math.min(layout.rows - 1, c.row))] ?? 'openings';
              const rgb = SECTION_THEMES[sec].cell;
              const alpha = 0.16;
              return (
                <div
                  key={`${c.row}-${c.x}`}
                  aria-hidden="true"
                  className="absolute"
                  style={{
                    left: `calc(${c.x}% - ${cq(22.2)})`,
                    top: cq(rowTop(c.row) + ROW_CQW / 2 - 17.7),
                    width: cq(44.4),
                    height: cq(35.4),
                    background: `rgba(${rgb},${alpha})`,
                    clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
                  }}
                />
              );
            })}

            {/* glossy chess pieces standing in the empty diamonds beside the path */}
            {layout.items.map((it, idx) => {
              if (it.kind !== 'node' || it.slot === 'c') return null;
              const x = it.slot === 'l' ? SLOT_X.r : SLOT_X.l;
              const piece = DECOR[(idx * 3 + it.row) % DECOR.length];
              return <Sprite key={`d-${it.stage.id}`} src={`/assets/learn/piece_${piece}.webp`} x={x} cy={rowCenter(it.row)} z={500 - it.row * 2} />;
            })}

            {layout.items.map((it) => {
              if (it.kind === 'medal') {
                return <Sprite key={`m-${it.row}`} src={`/assets/learn/medal_${it.section}.webp`} x={50} cy={rowCenter(it.row)} z={500 - it.row * 2} />;
              }
              if (it.kind === 'label') {
                const th = SECTION_THEMES[it.section];
                return (
                  <div key={`l-${it.row}`} data-testid="next-section" className="absolute inset-x-0 flex flex-col items-center justify-center text-center pointer-events-none" style={{ top: cq(rowTop(it.row)), height: cq(ROW_CQW) }}>
                    <span className="uppercase font-bold tracking-[0.08em] text-white/70" style={{ fontSize: cq(3.6) }}>Next section</span>
                    <span className="font-display font-extrabold text-white leading-[1.05]" style={{ fontSize: cq(8.4), textShadow: '0 2px 12px rgba(0,0,0,.45)' }}>{th.name}</span>
                  </div>
                );
              }

              const s = it.stage;
              const th = SECTION_THEMES[it.section];
              const hot = s.id === currentId;
              const sel = s.id === selectedId;
              const done = s.status === 'done';
              const locked = s.status === 'locked';
              const state = hot ? 'hot' : done ? 'done' : 'dim';
              const x = SLOT_X[it.slot];
              const cy = rowCenter(it.row);
              const z = 500 - it.row * 2;
              const Icon = hot ? Target : iconForStage(s);
              return (
                <React.Fragment key={s.id}>
                  {hot && <span aria-hidden="true" className="absolute rounded-[50%] pointer-events-none" style={{ left: `calc(${x}% - ${cq(19)})`, top: cq(cy - 13), width: cq(38), height: cq(26), background: th.glow, filter: 'blur(4cqw)', zIndex: z - 1 }} />}
                  <button
                    type="button"
                    onClick={() => onSelect(s)}
                    aria-label={`${s.title}${done ? ', completed' : locked ? ', locked' : ''}`}
                    aria-current={sel ? 'true' : undefined}
                    data-testid={`learn-tile-${s.id}`}
                    className="absolute group focus:outline-none"
                    style={{ left: `calc(${x}% - ${cq(CELL_W * 0.4)})`, top: cq(cy - CELL_W * 0.32 - SLAB_LIFT), width: cq(CELL_W * 0.8), height: cq(CELL_W * 0.64), zIndex: z, clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)' }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute pointer-events-none transition-transform duration-150"
                    style={{ left: 0, top: 0, width: '100%', height: '100%', zIndex: z, filter: sel && !hot ? `drop-shadow(0 0 ${cq(0.5)} #fff) drop-shadow(0 0 ${cq(0.5)} #fff)` : undefined }}
                  >
                    <Sprite src={`/assets/learn/tile_${it.section}_${state}.webp`} x={x} cy={cy} z={z} />
                    <span className="absolute flex items-center justify-center" style={{ left: `${x}%`, top: cq(cy - SLAB_LIFT), transform: 'translate(-50%,-50%) scaleY(0.86)', zIndex: z }}>
                      <Icon style={{ width: cq(hot ? 11 : 10), height: cq(hot ? 11 : 10), color: hot || done ? '#ffffff' : th.icon }} strokeWidth={hot ? 2.6 : 2.2} />
                    </span>
                  </span>
                  {hot && (
                    <span
                      className="absolute -translate-x-1/2 bg-white text-[#2b2926] font-display font-extrabold rounded-[1.2cqw] pointer-events-none whitespace-nowrap"
                      style={{ left: `${x}%`, top: cq(cy - 24), padding: `${cq(1)} ${cq(3.2)}`, fontSize: cq(4.8), zIndex: 900, boxShadow: `0 0 0 ${cq(0.5)} rgba(255,255,255,.25), 0 ${cq(1)} ${cq(3)} rgba(0,0,0,.35)` }}
                    >
                      Next
                      <span className="absolute left-1/2 -translate-x-1/2 bg-white rotate-45" style={{ bottom: cq(-1), width: cq(2.4), height: cq(2.4) }} />
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* the section you are looking at, over a fade in its colour */}
      <div className="absolute inset-x-0 bottom-0 z-[950] pointer-events-none" style={{ height: '17%', background: `linear-gradient(to bottom, transparent, ${theme.fade})` }}>
        <span data-testid="learn-section-name" style={{ opacity: hideName ? 0 : 1, transition: 'opacity .2s' }} className="absolute left-4 bottom-3 font-display font-extrabold text-white text-[34px] leading-none drop-shadow">
          {theme.name}
        </span>
      </div>

      {currentVisible !== 'in' && (
        <button
          type="button"
          onClick={() => scrollToCurrent(true)}
          aria-label="Go to your next lesson"
          data-testid="learn-jump"
          className="absolute z-[951] right-4 bottom-4 w-14 h-14 rounded-[10px] flex items-center justify-center text-white shadow-lg active:opacity-80"
          style={{ background: 'rgba(0,0,0,0.45)' }}
        >
          {currentVisible === 'above' ? <ArrowUp size={30} strokeWidth={2.6} /> : <ArrowDown size={30} strokeWidth={2.6} />}
        </button>
      )}
    </div>
  );
};

export default LearnMap;
