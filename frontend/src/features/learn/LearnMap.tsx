import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Check, Lock, Target } from 'lucide-react';
import { LessonStage } from '@/data/types';
import { useSettingsStore } from '@/data/settingsStore';
import { PIECE_SETS } from '@/data/boardThemes';
import { ROW_CQW, SECTION_THEMES, SLOT_X, SectionId, buildLayout, pieceForTitle } from './learnLayout';

interface LearnMapProps {
  stages: LessonStage[];
  selectedId?: string | null;
  onSelect: (stage: LessonStage) => void;
  /** Reports the section at the bottom of the viewport, so the screen can tint its bottom bar */
  onSectionChange?: (section: SectionId) => void;
  /** Id of the "next" lesson, which glows and gets the Next tooltip */
  currentId?: string | null;
}

const DECOR = ['B', 'R', 'N', 'P', 'R', 'B', 'P', 'N', 'Q', 'K'] as const;

const cq = (n: number) => `${n}cqw`;

/** Silver chess piece, drawn from the player's own piece set so the shapes match the board. */
const SilverPiece: React.FC<{ piece: string; base: string; height: number }> = ({ piece, base, height }) => (
  <img
    src={`${base}/w${piece}.svg`}
    alt=""
    draggable={false}
    style={{
      height: cq(height),
      width: 'auto',
      filter: 'grayscale(1) brightness(1.5) contrast(0.92) drop-shadow(0 1.6cqw 1.2cqw rgba(0,0,0,0.5))',
    }}
  />
);

const CapMedal: React.FC<{ disc: string }> = ({ disc }) => (
  <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
    <ellipse cx="50" cy="56" rx="46" ry="38" fill="rgba(0,0,0,0.35)" />
    <ellipse cx="50" cy="50" rx="46" ry="38" fill={disc} />
    <path d="M30 52 v14 c0 6 40 6 40 0 v-14 l-20 8z" fill="#1c5f86" />
    <path d="M50 24 L84 40 L50 56 L16 40 Z" fill="#2f86bd" />
    <path d="M50 24 L84 40 L50 40 Z" fill="#46a0d6" opacity="0.7" />
    <path d="M80 42 v18" stroke="#c99a2a" strokeWidth="3" strokeLinecap="round" />
    <circle cx="80" cy="62" r="3.2" fill="#e0b23c" />
  </svg>
);

export const LearnMap: React.FC<LearnMapProps> = ({ stages, selectedId, onSelect, onSectionChange, currentId }) => {
  const { pieceSetId } = useSettingsStore();
  const pieceBase = (PIECE_SETS.find((p) => p.id === pieceSetId) || PIECE_SETS[0]).basePath;
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
    else [4, 50, 96].forEach((x, i) => cells.push({ row: r, x, col: i }));
  }

  return (
    <div className="relative h-full w-full isolate" data-testid="learn-map">
      <div ref={scroller} onScroll={measure} className="absolute inset-0 overflow-y-auto overflow-x-hidden no-scrollbar" style={{ background: '#242320' }}>
        <div className="mx-auto w-full max-w-[560px]" style={{ containerType: 'inline-size' }}>
          <div className="relative w-full overflow-hidden" style={{ height: cq(totalCqw) }}>
            {cells.map((c) => {
              const sec = layout.rowSection[Math.max(0, Math.min(layout.rows - 1, c.row))] ?? 'openings';
              const rgb = SECTION_THEMES[sec].cell;
              const alpha = (c.row + c.col) % 2 === 0 ? 0.2 : 0.12;
              return (
                <div
                  key={`${c.row}-${c.x}`}
                  aria-hidden="true"
                  className="absolute"
                  style={{
                    left: `calc(${c.x}% - ${cq(22.7)})`,
                    top: cq(rowTop(c.row) + ROW_CQW / 2 - 18.1),
                    width: cq(45.4),
                    height: cq(36.2),
                    background: `rgba(${rgb},${alpha})`,
                    clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
                  }}
                />
              );
            })}

            {/* glossy chess pieces standing in the empty diamonds */}
            {layout.items.map((it, idx) => {
              if (it.kind !== 'node' || it.slot === 'c') return null;
              const x = it.slot === 'l' ? SLOT_X.r : SLOT_X.l;
              const piece = DECOR[(idx * 3 + it.row) % DECOR.length];
              return (
                <div key={`d-${it.stage.id}`} aria-hidden="true" className="absolute flex items-end justify-center" style={{ left: `calc(${x}% - ${cq(9)})`, width: cq(18), top: cq(rowCenter(it.row) - 13), height: cq(24) }}>
                  <SilverPiece piece={piece} base={pieceBase} height={piece === 'P' ? 17 : 23} />
                </div>
              );
            })}

            {layout.items.map((it) => {
              if (it.kind === 'medal') {
                const th = SECTION_THEMES[it.section];
                return (
                  <div key={`m-${it.row}`} aria-hidden="true" className="absolute" style={{ left: `calc(50% - ${cq(12.4)})`, width: cq(24.8), top: cq(rowCenter(it.row) - 12.4), height: cq(24.8) }}>
                    <CapMedal disc={th.medal} />
                  </div>
                );
              }
              if (it.kind === 'label') {
                const th = SECTION_THEMES[it.section];
                return (
                  <div key={`l-${it.row}`} data-testid="next-section" className="absolute inset-x-0 flex flex-col items-center justify-center text-center" style={{ top: cq(rowTop(it.row)), height: cq(ROW_CQW) }}>
                    <span className="uppercase font-semibold tracking-wide text-white/80" style={{ fontSize: cq(4) }}>Next section</span>
                    <span className="font-display font-extrabold text-white leading-none" style={{ fontSize: cq(8.6) }}>{th.name}</span>
                  </div>
                );
              }

              const s = it.stage;
              const th = SECTION_THEMES[it.section];
              const hot = s.id === currentId;
              const sel = s.id === selectedId;
              const top = hot ? th.hotTop : th.tileTop;
              const side = hot ? th.hotSide : th.tileSide;
              const done = s.status === 'done';
              const locked = s.status === 'locked';
              const x = SLOT_X[it.slot];
              const piece = pieceForTitle(s.title);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelect(s)}
                  aria-label={`${s.title}${done ? ', completed' : locked ? ', locked' : ''}`}
                  aria-current={sel ? 'true' : undefined}
                  data-testid={`learn-tile-${s.id}`}
                  className="absolute block active:translate-y-[0.6cqw] transition-transform"
                  style={{
                    left: `calc(${x}% - ${cq(16.5)})`,
                    width: cq(33),
                    height: cq(25),
                    top: cq(rowCenter(it.row) - 12.5),
                    filter: hot ? `drop-shadow(0 0 ${cq(4)} ${th.glow})` : sel ? 'brightness(1.35)' : undefined,
                    zIndex: hot ? 3 : 2,
                  }}
                >
                  <svg viewBox="0 0 100 76" width="100%" height="100%" aria-hidden="true">
                    <polygon points="50,19 94,45 50,70 6,45" fill={side} stroke={side} strokeWidth="12" strokeLinejoin="round" />
                    <polygon points="50,10 94,35 50,60 6,35" fill={top} stroke={top} strokeWidth="12" strokeLinejoin="round" />
                    {sel && !hot && <polygon points="50,10 94,35 50,60 6,35" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinejoin="round" />}
                  </svg>
                  <span className="absolute flex items-center justify-center" style={{ left: '50%', top: '46%', transform: 'translate(-50%,-50%)', width: cq(10), height: cq(10) }}>
                    {hot ? (
                      <Target style={{ width: cq(9), height: cq(9) }} className="text-white" strokeWidth={2.4} />
                    ) : locked ? (
                      <Lock style={{ width: cq(6.5), height: cq(6.5) }} className="text-white/35" />
                    ) : (
                      <img
                        src={`${pieceBase}/w${piece}.svg`}
                        alt=""
                        draggable={false}
                        style={{ height: cq(9), width: 'auto', filter: 'brightness(0) invert(1)', opacity: done ? 0.5 : 0.3 }}
                      />
                    )}
                  </span>
                  {done && (
                    <span className="absolute flex items-center justify-center rounded-full bg-[#81b64c] text-white" style={{ right: cq(5), top: cq(2.5), width: cq(7), height: cq(7) }}>
                      <Check style={{ width: cq(4.4), height: cq(4.4) }} strokeWidth={3.5} />
                    </span>
                  )}
                  {hot && (
                    <span
                      className="absolute left-1/2 -translate-x-1/2 bg-white text-[#262522] font-display font-extrabold rounded-[1.4cqw] shadow-lg pointer-events-none"
                      style={{ top: cq(-5.5), padding: `${cq(1.1)} ${cq(3.6)}`, fontSize: cq(5.4) }}
                    >
                      Next
                      <span className="absolute left-1/2 -translate-x-1/2 bg-white rotate-45" style={{ bottom: cq(-1.2), width: cq(2.6), height: cq(2.6) }} />
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
