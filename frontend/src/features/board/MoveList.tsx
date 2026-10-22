import React, { useEffect, useRef } from 'react';
import { Move } from '@/data/types';
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

  // Auto-scroll to keep current move visible
  useEffect(() => {
    if (activeMoveRef.current && containerRef.current) {
      activeMoveRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
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

  return (
    <div
      ref={containerRef}
      className={`overflow-y-auto max-h-[340px] pr-1.5 flex flex-col gap-1 text-sm select-none ${className}`}
    >
      {groupedMoves.map((group) => {
        const isWhiteActive = currentMoveIndex === group.whiteIdx;
        const isBlackActive = currentMoveIndex === group.blackIdx;
        const hasVariation =
          activeVariation &&
          (activeVariation.parentMoveIndex === group.whiteIdx ||
            activeVariation.parentMoveIndex === group.blackIdx);

        return (
          <div key={`row-${group.moveNum}`} className="flex flex-col">
            <div className="flex items-center py-1 px-2 rounded hover:bg-theme-raised/40 transition-colors">
              {/* Move number */}
              <span className="w-9 font-mono text-xs font-semibold text-theme-muted flex-shrink-0">
                {group.moveNum}.
              </span>

              {/* White Move Button */}
              {group.white && group.whiteIdx !== undefined && (
                <button
                  type="button"
                  ref={isWhiteActive ? activeMoveRef : null}
                  onClick={() => onSelectMove(group.whiteIdx!)}
                  className={`flex-1 flex items-center justify-between px-2 py-1 rounded text-left font-semibold transition-all ${
                    isWhiteActive
                      ? 'bg-amber-500/20 text-amber-500 ring-1 ring-amber-500/50 font-bold'
                      : 'text-theme-text hover:bg-theme-raised'
                  }`}
                >
                  <span className="font-mono">{renderFigurine(group.white.san, 'w')}</span>
                  {group.white.classification && (
                    <ClassificationBadge classification={group.white.classification} size="sm" />
                  )}
                </button>
              )}

              {/* Black Move Button */}
              {group.black && group.blackIdx !== undefined ? (
                <button
                  type="button"
                  ref={isBlackActive ? activeMoveRef : null}
                  onClick={() => onSelectMove(group.blackIdx!)}
                  className={`flex-1 flex items-center justify-between px-2 py-1 rounded text-left font-semibold ml-1.5 transition-all ${
                    isBlackActive
                      ? 'bg-amber-500/20 text-amber-500 ring-1 ring-amber-500/50 font-bold'
                      : 'text-theme-text hover:bg-theme-raised'
                  }`}
                >
                  <span className="font-mono">{renderFigurine(group.black.san, 'b')}</span>
                  {group.black.classification && (
                    <ClassificationBadge classification={group.black.classification} size="sm" />
                  )}
                </button>
              ) : (
                <div className="flex-1 ml-1.5" />
              )}
            </div>

            {/* Inline Variation Sub-lines (indented with left border) */}
            {hasVariation && activeVariation && (
              <div className="ml-9 my-1 pl-3 border-l-2 border-amber-500/70 bg-amber-500/10 py-1.5 px-2 rounded-r text-xs">
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
