import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chess, Square, PieceSymbol, Color } from 'chess.js';
import { BoardTheme, PieceSet, Arrow, BoardBadge, MoveClassification } from '@/data/types';
import { ArrowLayer } from './ArrowLayer';
import { BadgeLayer } from './BadgeLayer';
import { PromotionDialog } from './PromotionDialog';

export interface LastMoveInfo {
  from: string;
  to: string;
  classification?: MoveClassification;
}

export interface BoardProps {
  fen: string;
  orientation?: 'white' | 'black';
  lastMove?: LastMoveInfo | null;
  arrows?: Arrow[];
  badges?: BoardBadge[];
  highlights?: string[];
  legalTargets?: string[];
  interactive?: boolean;
  onMove?: (from: string, to: string, promotion?: string) => boolean | void;
  boardTheme: BoardTheme;
  pieceSet: PieceSet;
  animationSpeed?: 'off' | 'fast' | 'medium' | 'slow';
  coordinates?: 'inside' | 'outside';
  autoQueen?: boolean;
  className?: string;
}

export const Board: React.FC<BoardProps> = ({
  fen,
  orientation = 'white',
  lastMove = null,
  arrows = [],
  badges = [],
  highlights = [],
  legalTargets = [],
  interactive = true,
  onMove,
  boardTheme,
  pieceSet,
  animationSpeed = 'medium',
  coordinates = 'inside',
  autoQueen = true,
  className = '',
}) => {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [computedLegalTargets, setComputedLegalTargets] = useState<string[]>([]);
  const [draggedSquare, setDraggedSquare] = useState<string | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: string; to: string; color: 'w' | 'b' } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Parse FEN into board matrix using chess.js
  const chessInstance = useRef(new Chess());
  useEffect(() => {
    try {
      chessInstance.current.load(fen);
    } catch {
      // fallback
    }
  }, [fen]);

  const speedMs = {
    off: 0,
    fast: 100,
    medium: 200,
    slow: 350,
  }[animationSpeed];

  // Helper to get legal moves for a square
  const getMovesForSquare = useCallback((sq: string): string[] => {
    try {
      const moves = chessInstance.current.moves({ square: sq as Square, verbose: true });
      return moves.map((m) => m.to);
    } catch {
      return [];
    }
  }, []);

  // Update legal targets when selected square changes
  useEffect(() => {
    if (!interactive || !selectedSquare) {
      setComputedLegalTargets(legalTargets);
      return;
    }
    const moves = getMovesForSquare(selectedSquare);
    setComputedLegalTargets(Array.from(new Set([...moves, ...legalTargets])));
  }, [selectedSquare, interactive, legalTargets, getMovesForSquare]);

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
  const displayFiles = orientation === 'white' ? files : [...files].reverse();
  const displayRanks = orientation === 'white' ? [...ranks].reverse() : ranks;

  const handleSquareClick = (sq: string) => {
    if (!interactive) return;

    // If already selecting and clicking a target
    if (selectedSquare) {
      if (selectedSquare === sq) {
        setSelectedSquare(null);
        return;
      }

      // Check if move is legal
      const piece = chessInstance.current.get(selectedSquare as Square);
      const isPawnPromotion =
        piece?.type === 'p' &&
        ((piece.color === 'w' && sq.endsWith('8')) || (piece.color === 'b' && sq.endsWith('1')));

      if (computedLegalTargets.includes(sq)) {
        if (isPawnPromotion && !autoQueen) {
          setPendingPromotion({ from: selectedSquare, to: sq, color: piece.color });
          return;
        }

        const success = onMove?.(selectedSquare, sq, isPawnPromotion ? 'q' : undefined);
        setSelectedSquare(null);
        if (success !== false) return;
      }
    }

    // Select piece if matching turn or interactive
    const pieceOnSquare = chessInstance.current.get(sq as Square);
    if (pieceOnSquare) {
      setSelectedSquare(sq);
    } else {
      setSelectedSquare(null);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, sq: string) => {
    if (!interactive) return;
    const piece = chessInstance.current.get(sq as Square);
    if (!piece) return;

    setDraggedSquare(sq);
    setSelectedSquare(sq);
    e.dataTransfer.setData('text/plain', sq);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetSq: string) => {
    e.preventDefault();
    const sourceSq = draggedSquare || e.dataTransfer.getData('text/plain');
    setDraggedSquare(null);

    if (!sourceSq || sourceSq === targetSq || !interactive) return;

    const piece = chessInstance.current.get(sourceSq as Square);
    const isPawnPromotion =
      piece?.type === 'p' &&
      ((piece.color === 'w' && targetSq.endsWith('8')) || (piece.color === 'b' && targetSq.endsWith('1')));

    if (computedLegalTargets.includes(targetSq)) {
      if (isPawnPromotion && !autoQueen) {
        setPendingPromotion({ from: sourceSq, to: targetSq, color: piece.color });
        return;
      }
      onMove?.(sourceSq, targetSq, isPawnPromotion ? 'q' : undefined);
      setSelectedSquare(null);
    }
  };

  // Square tint styles for classification
  const getSquareTint = (sq: string) => {
    if (selectedSquare === sq) {
      return 'bg-amber-400/50 shadow-inner ring-2 ring-amber-400';
    }

    if (lastMove) {
      const isFrom = lastMove.from === sq;
      const isTo = lastMove.to === sq;

      if (isFrom || isTo) {
        if (lastMove.classification === 'blunder') {
          return isFrom ? 'bg-red-400/40' : 'bg-orange-500/50';
        }
        if (lastMove.classification === 'best') {
          return 'bg-emerald-500/40';
        }
        if (lastMove.classification === 'brilliant') {
          return 'bg-cyan-400/40';
        }
        if (lastMove.classification === 'book') {
          return 'bg-amber-600/35';
        }
        // Standard last move yellow highlight at 45% opacity
        return 'bg-yellow-400/45';
      }
    }

    if (highlights.includes(sq)) {
      return 'bg-emerald-400/45 ring-2 ring-emerald-400';
    }

    return '';
  };

  // Keyboard square navigation
  const handleKeyDown = (e: React.KeyboardEvent, sq: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSquareClick(sq);
    }
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Board square container */}
      <div
        ref={boardRef}
        className="relative aspect-square w-full max-w-[min(88vh,720px)] rounded-sm overflow-hidden shadow-2xl border border-black/20"
        style={{
          boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* 8x8 Board Grid */}
        <div className="w-full h-full grid grid-cols-8 grid-rows-8">
          {displayRanks.map((rank, rankIndex) =>
            displayFiles.map((file, fileIndex) => {
              const sq = `${file}${rank}`;
              const isLight = (file.charCodeAt(0) - 97 + parseInt(rank, 10)) % 2 !== 0;
              const bgColor = isLight ? boardTheme.light : boardTheme.dark;
              const coordColor = isLight ? boardTheme.dark : boardTheme.light;
              const tintClass = getSquareTint(sq);
              const isTarget = computedLegalTargets.includes(sq);

              let piece: { type: PieceSymbol; color: Color } | null = null;
              try {
                piece = chessInstance.current.get(sq as Square) || null;
              } catch {
                piece = null;
              }

              const pieceImg = piece ? `${pieceSet.basePath}/${piece.color}${piece.type.toUpperCase()}.svg` : null;

              return (
                <div
                  key={sq}
                  data-square={sq}
                  tabIndex={interactive ? 0 : -1}
                  onClick={() => handleSquareClick(sq)}
                  onKeyDown={(e) => handleKeyDown(e, sq)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, sq)}
                  className={`relative w-full h-full flex items-center justify-center cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500`}
                  style={{ backgroundColor: bgColor }}
                  aria-label={`Square ${sq}${piece ? `, ${piece.color === 'w' ? 'White' : 'Black'} ${piece.type}` : ''}`}
                >
                  {/* Tint overlay */}
                  {tintClass && <div className={`absolute inset-0 pointer-events-none ${tintClass}`} />}

                  {/* Inside Coordinates */}
                  {coordinates === 'inside' && (
                    <>
                      {/* Rank coordinate on first column */}
                      {fileIndex === 0 && (
                        <span
                          className="absolute top-1 left-1.5 text-[11px] md:text-xs font-bold leading-none pointer-events-none select-none opacity-80"
                          style={{ color: coordColor }}
                        >
                          {rank}
                        </span>
                      )}
                      {/* File coordinate on bottom row */}
                      {rankIndex === 7 && (
                        <span
                          className="absolute bottom-1 right-1.5 text-[11px] md:text-xs font-bold leading-none pointer-events-none select-none opacity-80"
                          style={{ color: coordColor }}
                        >
                          {file}
                        </span>
                      )}
                    </>
                  )}

                  {/* Piece */}
                  {pieceImg && (
                    <img
                      src={pieceImg}
                      alt={`${piece?.color}${piece?.type}`}
                      draggable={interactive}
                      onDragStart={(e) => handleDragStart(e, sq)}
                      className="w-full h-full object-contain pointer-events-auto cursor-grab active:cursor-grabbing p-0.5 transform-gpu drop-shadow"
                      style={{
                        transition: speedMs > 0 ? `transform ${speedMs}ms cubic-bezier(0, 0, 0.2, 1)` : 'none',
                      }}
                    />
                  )}

                  {/* Legal move target dot */}
                  {isTarget && (
                    <div
                      className={`absolute pointer-events-none rounded-full ${
                        piece ? 'inset-1 ring-4 ring-emerald-500/60 bg-transparent' : 'w-3.5 h-3.5 bg-emerald-500/60'
                      }`}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Vector Overlays: Arrows & Badges */}
        <ArrowLayer arrows={arrows} orientation={orientation} />
        <BadgeLayer badges={badges} orientation={orientation} />
      </div>

      {/* Promotion Choice Dialog */}
      {pendingPromotion && (
        <PromotionDialog
          isOpen={true}
          color={pendingPromotion.color}
          pieceBasePath={pieceSet.basePath}
          onSelect={(promPiece) => {
            onMove?.(pendingPromotion.from, pendingPromotion.to, promPiece);
            setPendingPromotion(null);
            setSelectedSquare(null);
          }}
          onCancel={() => {
            setPendingPromotion(null);
            setSelectedSquare(null);
          }}
        />
      )}
    </div>
  );
};
