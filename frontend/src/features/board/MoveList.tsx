import React, { useEffect, useRef } from 'react';
import { Move, MoveClassification } from '@/data/types';
import { ClassificationBadge } from '@/components/ClassificationBadge';

interface MoveListProps {
  moves: Move[];
  currentMoveIndex: number;
  onSelectMove: (index: number) => void;
  activeVariation?: {
    parentMoveIndex: number;
    moves: string[];
    title: string;
  } | null;
  className?: string;
}

export const MoveList: React.FC<MoveListProps> = ({
  moves,
  currentMoveIndex,
  onSelectMove,
  activeVariation = null,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeMoveRef = useRef<HTMLButtonElement>(null);

  // Group moves into pairs: [ { moveNum: 1, white?: Move, whiteIdx?: number, black?: Move, blackIdx?: number } ]
  const groupedMoves: Array<{
    moveNum: number;
    white?: Move;
    whiteIdx?: number;
    black?: Move;
    blackIdx?: number;
  }> = [];

  for (let i = 0; i < moves.length; i += 2) {
    const white = moves[i];
    const black = moves[i + 1];
    groupedMoves.push({
      moveNum: white.moveNumber,
      white,
      whiteIdx: i,
      black,
      blackIdx: i + 1 < moves.length ? i + 1 : undefined,
    });
  }

  // Auto-scroll to keep current move visible strictly within container without scrolling window
  useEffect(() => {
    if (activeMoveRef.current && containerRef.current) {
      const container = containerRef.current;
      const target = activeMoveRef.current;
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      const relativeTop = targetRect.top - containerRect.top;
      const relativeBottom = targetRect.bottom - containerRect.top;

      if (relativeTop < 0) {
        container.scrollTop += relativeTop - 8;
      } else if (relativeBottom > container.clientHeight) {
        container.scrollTop += (relativeBottom - container.clientHeight) + 8;
      }
    }
  }, [currentMoveIndex]);

  // Render figurine notation: replace leading N, B, R, Q, K with piece symbol
  const renderFigurine = (san: string, color: 'w' | 'b') => {
    if (!san) return '';
    const pieceChar = san[0];
    const isPiece = ['N', 'B', 'R', 'Q', 'K'].includes(pieceChar);

    if (!isPiece) {
      return <span>{san}</span>;
    }

    const rest = san.slice(1);
    const pieceIcons: Record<string, string> = {
      N: color === 'w' ? '♞' : '♞',
      B: color === 'w' ? '♝' : '♝',
      R: color === 'w' ? '♜' : '♜',
      Q: color === 'w' ? '♛' : '♛',
      K: color === 'w' ? '♚' : '♚',
    };

    return (
      <span className="inline-flex items-center gap-0.5">
        <span className="text-[13px] leading-none opacity-90">{pieceIcons[pieceChar]}</span>
        <span>{rest}</span>
      </span>
    );
  };

  // Color bad moves according to their severity
  const getSanColorStyle = (cls?: MoveClassification) => {
    if (!cls) return undefined;
    if (cls === 'blunder') return { color: '#fa412d' };
    if (cls === 'miss') return { color: '#ef7d6e' };
    if (cls === 'mistake') return { color: '#f59a4b' };
    if (cls === 'inaccuracy') return { color: '#f2c14e' };
    return undefined;
  };

  return (
    <div
      ref={containerRef}
      className={`overflow-y-auto max-h-[340px] pr-1 flex flex-col gap-0.5 text-sm select-none w-full ${className}`}
    >
      {groupedMoves.map((group) => {
        const isWhiteActive = currentMoveIndex === group.whiteIdx;
        const isBlackActive = currentMoveIndex === group.blackIdx;
        const hasVariation =
          activeVariation &&
          (activeVariation.parentMoveIndex === group.whiteIdx ||
            activeVariation.parentMoveIndex === group.blackIdx);

        return (
          <div key={`row-${group.moveNum}`} data-move-row="true" className="flex flex-col w-full">
            <div
              className={`h-[30px] min-h-[30px] flex items-center px-1.5 rounded transition-colors w-full ${
                group.moveNum % 2 === 1
                  ? 'bg-white/[0.02] dark:bg-white/[0.02] bg-black/[0.025]'
                  : 'bg-transparent'
              } hover:bg-theme-raised/40`}
            >
              {/* Move number: 32px fixed column, muted 13px */}
              <span className="w-8 min-w-[32px] font-mono text-[13px] font-bold text-theme-muted flex-shrink-0 text-left">
                {group.moveNum}.
              </span>

              {/* White Move Button */}
              {group.white && group.whiteIdx !== undefined && (
                <button
                  type="button"
                  ref={isWhiteActive ? activeMoveRef : null}
                  onClick={() => onSelectMove(group.whiteIdx!)}
                  className="flex-1 h-[28px] flex items-center gap-1.5 px-1 py-0.5 rounded text-left transition-colors duration-100"
                >
                  {group.white.classification && (
                    <ClassificationBadge classification={group.white.classification} size="xs" showLabel={false} />
                  )}
                  <span
                    className={`px-1.5 py-0.5 rounded-[2px] font-mono text-[13px] font-bold transition-all ${
                      isWhiteActive
                        ? 'bg-white/[0.14] dark:bg-white/[0.14] bg-black/[0.10] text-theme-text border-b-2 border-white/25 dark:border-white/25 border-black/20 shadow-sm'
                        : 'text-theme-text hover:bg-theme-raised/60'
                    }`}
                    style={!isWhiteActive ? getSanColorStyle(group.white.classification) : undefined}
                  >
                    {renderFigurine(group.white.san, 'w')}
                  </span>
                </button>
              )}

              {/* Black Move Button */}
              {group.black && group.blackIdx !== undefined ? (
                <button
                  type="button"
                  ref={isBlackActive ? activeMoveRef : null}
                  onClick={() => onSelectMove(group.blackIdx!)}
                  className="flex-1 h-[28px] flex items-center gap-1.5 px-1 py-0.5 rounded text-left ml-1 transition-colors duration-100"
                >
                  {group.black.classification && (
                    <ClassificationBadge classification={group.black.classification} size="xs" showLabel={false} />
                  )}
                  <span
                    className={`px-1.5 py-0.5 rounded-[2px] font-mono text-[13px] font-bold transition-all ${
                      isBlackActive
                        ? 'bg-white/[0.14] dark:bg-white/[0.14] bg-black/[0.10] text-theme-text border-b-2 border-white/25 dark:border-white/25 border-black/20 shadow-sm'
                        : 'text-theme-text hover:bg-theme-raised/60'
                    }`}
                    style={!isBlackActive ? getSanColorStyle(group.black.classification) : undefined}
                  >
                    {renderFigurine(group.black.san, 'b')}
                  </span>
                </button>
              ) : (
                <div className="flex-1 ml-1" />
              )}
            </div>

            {/* Inline Variation Sub-lines (indented with left border) */}
            {hasVariation && activeVariation && (
              <div className="ml-8 my-1 pl-3 border-l-2 border-amber-500/70 bg-amber-500/10 py-1.5 px-2 rounded-r text-xs">
                <div className="font-bold text-amber-500 mb-0.5">{activeVariation.title}</div>
                <div className="font-mono text-theme-text flex flex-wrap gap-1.5">
                  {activeVariation.moves.map((vm, vIdx) => (
                    <span key={`var-${vIdx}`} className="bg-theme-raised px-1 py-0.5 rounded">
                      {vm}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
