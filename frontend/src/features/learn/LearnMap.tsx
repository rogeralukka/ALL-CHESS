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
const PIECE_H: Record<string, number> = { pawn: 15.5, rook: 19, bishop: 21.5, knight: 20, queen: 22.5, king: 23.5 };

const cq = (n: number) => `${n}cqw`;

/** A glossy 3D piece (rendered offline into /assets/learn), standing in an empty diamond with a soft contact shadow. */
const GlossyPiece: React.FC<{ piece: string }> = ({ piece }) => (
  <div className="relative flex flex-col items-center" aria-hidden="true">
    <img src={`/assets/learn/piece_${piece}.webp`} alt="" draggable={false} style={{ height: cq(PIECE_H[piece] ?? 20), width: 'auto', position: 'relative', zIndex: 1 }} />
    <span className="rounded-[50%]" style={{ width: cq(13), height: cq(3.6), marginTop: cq(-2.4), background: 'radial-gradient(closest-side, rgba(0,0,0,0.55), rgba(0,0,0,0))' }} />
  </div>
);

/** Graduation-cap medallion that closes a section: a disc in the section colour with a rendered cap on it. */
const CapMedal: React.FC<{ top: string; side: string }> = ({ top, side }) => (
  <div className="relative w-full h-full" aria-hidden="true">
    <svg viewBox="0 0 100 90" width="100%" height="100%" className="absolute inset-0">
      <ellipse cx="50" cy="50" rx="45" ry="36" fill={side} />
      <ellipse cx="50" cy="43" rx="45" ry="36" fill={top} />
      <ellipse cx="50" cy="43" rx="45" ry="36" fill="url(#medal-sheen)" />
      <defs>
        <linearGradient id="medal-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
    <img src="/assets/learn/cap.webp" alt="" draggable={false} className="absolute left-1/2 -translate-x-1/2" style={{ width: '74%', top: '16%' }} />
  </div>
);

/** One lesson: a thin bevelled slab whose face has the same proportions as the grid diamonds. */
const Slab: React.FC<{ top: string; side: string; outline?: boolean; sheen?: number }> = ({ top, side, outline, sheen = 0.14 }) => (
  <svg viewBox="0 0 100 90" width="100%" height="100%" aria-hidden="true" className="absolute inset-0">
    <defs>
      <linearGradient id="slab-sheen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity={sheen} />
        <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
    <polygon points="50,11 95,47 50,83 5,47" fill={side} stroke={side} strokeWidth="9" strokeLinejoin="round" />
    <polygon points="50,5 95,41 50,77 5,41" fill={top} stroke={top} strokeWidth="9" strokeLinejoin="round" />
    <polygon points="50,5 95,41 50,77 5,41" fill="url(#slab-sheen)" stroke="none" />
    {outline && <polygon points="50,5 95,41 50,77 5,41" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.6" strokeLinejoin="round" />}
  </svg>
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
    if (r % 2 === 0) [-65, -19, 27, 73, 119, 165].forEach((x, i) => cells.push({ row: r, x, col: i }));
    else [-88, -42, 4, 50, 96, 142, 188].forEach((x, i) => cells.push({ row: r, x, col: i }));
  }

  return (
    <div className="relative h-full w-full isolate" data-testid="learn-map">
      <div ref={scroller} onScroll={measure} className="absolute inset-0 overflow-y-auto overflow-x-hidden no-scrollbar" style={{ background: '#242320' }}>
        <div className={`mx-auto w-full ${compact ? 'max-w-[300px]' : 'max-w-[560px]'}`} style={{ containerType: 'inline-size' }}>
          <div className="relative w-full" style={{ height: cq(totalCqw) }}>
            {cells.map((c) => {
              const sec = layout.rowSection[Math.max(0, Math.min(layout.rows - 1, c.row))] ?? 'openings';
              const rgb = SECTION_THEMES[sec].cell;
              const alpha = (c.row + c.col) % 2 === 0 ? 0.17 : 0.11;
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
              return (
                <div key={`d-${it.stage.id}`} className="absolute flex items-end justify-center pointer-events-none" style={{ left: `calc(${x}% - ${cq(10)})`, width: cq(20), bottom: `calc(100% - ${cq(rowCenter(it.row) + 5.5)})` }}>
                  <GlossyPiece piece={piece} />
                </div>
              );
            })}

            {layout.items.map((it) => {
              if (it.kind === 'medal') {
                const th = SECTION_THEMES[it.section];
                return (
                  <div key={`m-${it.row}`} className="absolute pointer-events-none" style={{ left: `calc(50% - ${cq(13)})`, width: cq(26), top: cq(rowCenter(it.row) - 11.7), height: cq(23.4) }}>
                    <CapMedal top={th.tileTop} side={th.tileSide} />
                  </div>
                );
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
              const top = hot ? th.hotTop : done ? th.doneTop : th.tileTop;
              const side = hot ? th.hotSide : done ? th.doneSide : th.tileSide;
              const x = SLOT_X[it.slot];
              const Icon = hot ? Target : iconForStage(s);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelect(s)}
                  aria-label={`${s.title}${done ? ', completed' : locked ? ', locked' : ''}`}
                  aria-current={sel ? 'true' : undefined}
                  data-testid={`learn-tile-${s.id}`}
                  className="absolute block group focus:outline-none"
                  style={{ left: `calc(${x}% - ${cq(15.5)})`, width: cq(31), height: cq(27.9), top: cq(rowCenter(it.row) - 13.2), zIndex: hot ? 3 : 2 }}
                >
                  {hot && <span aria-hidden="true" className="absolute inset-[8%] rounded-[50%] blur-[3cqw]" style={{ background: th.glow }} />}
                  <span className="absolute inset-0 transition-transform duration-150 group-hover:-translate-y-[0.5cqw] group-active:translate-y-[0.6cqw]">
                    <Slab top={top} side={side} outline={sel && !hot} sheen={hot ? 0.28 : 0.1} />
                    <span className="absolute flex items-center justify-center" style={{ left: '50%', top: '45.5%', transform: 'translate(-50%,-50%) scaleY(0.92)' }}>
                      <Icon
                        style={{ width: cq(hot ? 9 : 8), height: cq(hot ? 9 : 8), color: hot || done ? '#ffffff' : th.icon, opacity: done ? 0.92 : 1 }}
                        strokeWidth={hot ? 2.6 : 2.2}
                      />
                    </span>
                  </span>
                  {hot && (
                    <span
                      className="absolute left-1/2 -translate-x-1/2 bg-white text-[#2b2926] font-display font-extrabold rounded-[1.2cqw] pointer-events-none whitespace-nowrap"
                      style={{ top: cq(-7.2), padding: `${cq(1)} ${cq(3.2)}`, fontSize: cq(4.8), boxShadow: `0 0 0 ${cq(0.5)} rgba(255,255,255,.25), 0 ${cq(1)} ${cq(3)} rgba(0,0,0,.35)` }}
                    >
                      Next
                      <span className="absolute left-1/2 -translate-x-1/2 bg-white rotate-45" style={{ bottom: cq(-1), width: cq(2.4), height: cq(2.4) }} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* the section you are looking at, over a fade in its colour */}
      <div className="absolute inset-x-0 bottom-0 z-[5] pointer-events-none" style={{ height: '17%', background: `linear-gradient(to bottom, transparent, ${theme.fade})` }}>
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
          className="absolute z-[6] right-4 bottom-4 w-14 h-14 rounded-[10px] flex items-center justify-center text-white shadow-lg active:opacity-80"
          style={{ background: 'rgba(0,0,0,0.45)' }}
        >
          {currentVisible === 'above' ? <ArrowUp size={30} strokeWidth={2.6} /> : <ArrowDown size={30} strokeWidth={2.6} />}
        </button>
      )}
    </div>
  );
};

export default LearnMap;
