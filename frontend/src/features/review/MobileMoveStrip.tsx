import React, { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Move } from '@/data/types';
import { ClassificationBadge } from '@/components/ClassificationBadge';

interface MobileMoveStripProps {
  moves: Move[];
  currentMoveIndex: number;
  onSelectMove: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * One-line move strip under the phone board (as in the Chess.com app): ‹ 5. e3 c4 6. O-O Nf6 ›.
 * The current move is underlined and kept in view; tap any move to jump there.
 */
export const MobileMoveStrip: React.FC<MobileMoveStripProps> = ({ moves, currentMoveIndex, onSelectMove, onPrev, onNext }) => {
  const scroller = useRef<HTMLDivElement>(null);
  const active = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const box = scroller.current;
    const el = active.current;
    if (!box || !el) return;
    const target = el.offsetLeft - box.clientWidth / 2 + el.clientWidth / 2;
    if (typeof box.scrollTo === 'function') box.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
    else box.scrollLeft = Math.max(0, target);
  }, [currentMoveIndex]);

  return (
    <div className="flex items-center h-12 flex-shrink-0" data-testid="mobile-move-strip">
      <button type="button" onClick={onPrev} aria-label="Previous move" className="w-11 h-12 flex items-center justify-center text-theme-muted active:text-theme-text">
        <ChevronLeft size={26} />
      </button>
      <div ref={scroller} className="flex-1 min-w-0 overflow-x-auto no-scrollbar flex items-center gap-1 whitespace-nowrap">
        {moves.map((m, i) => {
          const isWhite = i % 2 === 0;
          const isActive = i === currentMoveIndex;
          const notable = m.classification && m.classification !== 'good' && m.classification !== 'book' && m.classification !== 'best' && m.classification !== 'excellent';
          return (
            <React.Fragment key={i}>
              {isWhite && <span className="text-[15px] text-theme-muted pl-2 pr-0.5">{m.moveNumber}.</span>}
              <button
                ref={isActive ? active : undefined}
                type="button"
                onClick={() => onSelectMove(i)}
                aria-current={isActive ? 'true' : undefined}
                className={`inline-flex items-center gap-1 px-1.5 py-1 text-[17px] font-bold ${isActive ? 'text-theme-text border-b-2 border-theme-text' : 'text-theme-muted'}`}
              >
                {notable && m.classification && <ClassificationBadge classification={m.classification} size="sm" />}
                {m.san}
              </button>
            </React.Fragment>
          );
        })}
      </div>
      <button type="button" onClick={onNext} aria-label="Next move" className="w-11 h-12 flex items-center justify-center text-theme-muted active:text-theme-text">
        <ChevronRight size={26} />
      </button>
    </div>
  );
};
