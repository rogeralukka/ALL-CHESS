import React, { useState, useEffect, useCallback, useRef, useId, useMemo } from 'react';
import { Chess, Square, PieceSymbol, Color } from 'chess.js';
import { BoardTheme, PieceSet, Arrow, BoardBadge, MoveClassification } from '@/data/types';
import { ArrowLayer } from './ArrowLayer';
import { BadgeLayer } from './BadgeLayer';
import { PromotionDialog } from './PromotionDialog';
import { useMotion } from '@/lib/useMotion';
import { sound } from '@/lib/sound';

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
  onIllegalMove?: (from: string, attemptedTo: string) => void;
  boardTheme: BoardTheme;
  pieceSet: PieceSet;
  animationSpeed?: 'off' | 'fast' | 'medium' | 'slow';
  coordinates?: 'inside' | 'outside' | 'none';
  autoQueen?: boolean;
  className?: string;
}

interface PieceOnBoard {
  id: string;
  square: string;
  type: PieceSymbol;
  color: Color;
  col: number;
  row: number;
}

interface DraggedPieceState {
  sq: string;
  piece: { type: PieceSymbol; color: Color };
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isDragging: boolean;
}

const BOARD_FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const BOARD_RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];

const EMPTY_ARRAY: never[] = [];

function areArraysEqual<T>(a: readonly T[], b: readonly T[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function arePiecesEqual(a: readonly PieceOnBoard[], b: readonly PieceOnBoard[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const pa = a[i];
    const pb = b[i];
    if (
      pa.id !== pb.id ||
      pa.square !== pb.square ||
      pa.type !== pb.type ||
      pa.color !== pb.color ||
      pa.col !== pb.col ||
      pa.row !== pb.row
    ) {
      return false;
    }
  }
  return true;
}

export const Board: React.FC<BoardProps> = ({
  fen,
  orientation = 'white',
  lastMove = null,
  arrows = EMPTY_ARRAY,
  badges = EMPTY_ARRAY,
  highlights = EMPTY_ARRAY,
  legalTargets = EMPTY_ARRAY,
  interactive = true,
  onMove,
  onIllegalMove,
  boardTheme,
  pieceSet,
  animationSpeed = 'medium',
  coordinates = 'inside',
  autoQueen = true,
  className = '',
}) => {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [computedLegalTargets, setComputedLegalTargets] = useState<string[]>([]);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: string; to: string; color: 'w' | 'b' } | null>(null);
  const [draggedPiece, setDraggedPiece] = useState<DraggedPieceState | null>(null);
  const [hoveredSquare, setHoveredSquare] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const idPrefix = useId();
  const counterRef = useRef<number>(1);

  const { pieceMs, isFull, isOff } = useMotion();

  // Parse FEN into chess instance for legal move computations
  const chessInstance = useRef(new Chess());
  useEffect(() => {
    try {
      chessInstance.current.load(fen);
    } catch {
      // fallback
    }
  }, [fen]);

  const speedMs = isOff
    ? 0
    : animationSpeed === 'off'
    ? 0
    : animationSpeed === 'fast'
    ? Math.min(pieceMs, 100)
    : animationSpeed === 'slow'
    ? Math.round(pieceMs * 1.5)
    : pieceMs;

  const displayFiles = useMemo(
    () => (orientation === 'white' ? BOARD_FILES : [...BOARD_FILES].reverse()),
    [orientation]
  );
  const displayRanks = useMemo(
    () => (orientation === 'white' ? [...BOARD_RANKS].reverse() : BOARD_RANKS),
    [orientation]
  );

  // --- STABLE PIECE POSITION TRACKING FOR ANIMATIONS ---
  const [boardPieces, setBoardPieces] = useState<PieceOnBoard[]>([]);
  const [fadingPieces, setFadingPieces] = useState<
    Array<{ id: string; col: number; row: number; color: Color; type: PieceSymbol }>
  >([]);
  const [checkFlashSquare, setCheckFlashSquare] = useState<string | null>(null);
  const lastFrom = lastMove?.from;
  const lastTo = lastMove?.to;

  // Flash attacked king for 400ms when in check (skip initial mount to avoid unprompted audio)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    try {
      if (chessInstance.current.inCheck()) {
        const turn = chessInstance.current.turn();
        const king = boardPieces.find((p) => p.type === 'k' && p.color === turn);
        if (king) {
          setCheckFlashSquare(king.square);
          sound.check(king.square);
          const t = setTimeout(() => setCheckFlashSquare(null), 400);
          return () => clearTimeout(t);
        }
      } else {
        setCheckFlashSquare(null);
      }
    } catch {
      // ignore
    }
  }, [fen, boardPieces]);

  useEffect(() => {
    let chess: Chess;
    try {
      chess = new Chess(fen);
    } catch {
      chess = new Chess();
    }
    const board = chess.board();

    // Collect all raw pieces in new position
    const newItems: Array<{ square: string; type: PieceSymbol; color: Color; col: number; row: number; matched: boolean }> = [];
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const p = board[r][f];
        if (p) {
          const sq = BOARD_FILES[f] + (8 - r);
          const col = displayFiles.indexOf(BOARD_FILES[f]);
          const row = displayRanks.indexOf(String(8 - r));
          newItems.push({ square: sq, type: p.type, color: p.color, col, row, matched: false });
        }
      }
    }

    setBoardPieces((prev) => {
      // Build a fresh clone of items inside the updater so it is 100% pure under React StrictMode (dev)
      const items = newItems.map((item) => ({ ...item, matched: false }));
      const result: PieceOnBoard[] = [];
      const usedPrevIds = new Set<string>();

      // 1. If lastMove, match the piece that moved
      if (lastFrom && lastTo) {
        const movedPrev = prev.find((p) => p.square === lastFrom && !usedPrevIds.has(p.id));
        const targetItem = items.find((p) => p.square === lastTo && !p.matched);
        if (movedPrev && targetItem) {
          targetItem.matched = true;
          usedPrevIds.add(movedPrev.id);
          result.push({ ...targetItem, id: movedPrev.id });
        }

        // Capture check: piece on destination square in prev fades out over 100ms
        const capturedPiece = prev.find((p) => p.square === lastTo && p.id !== movedPrev?.id);
        if (capturedPiece) {
          setFadingPieces([
            {
              id: `cap-${capturedPiece.id}-${Date.now()}`,
              col: capturedPiece.col,
              row: capturedPiece.row,
              color: capturedPiece.color,
              type: capturedPiece.type,
            },
          ]);
          setTimeout(() => setFadingPieces([]), 100);
        }

        // Check castling rook
        if (movedPrev && movedPrev.type === 'k') {
          let rookFrom: string | null = null;
          let rookTo: string | null = null;
          if (lastFrom === 'e1' && lastTo === 'g1') { rookFrom = 'h1'; rookTo = 'f1'; }
          else if (lastFrom === 'e1' && lastTo === 'c1') { rookFrom = 'a1'; rookTo = 'd1'; }
          else if (lastFrom === 'e8' && lastTo === 'g8') { rookFrom = 'h8'; rookTo = 'f8'; }
          else if (lastFrom === 'e8' && lastTo === 'c8') { rookFrom = 'a8'; rookTo = 'd8'; }

          if (rookFrom && rookTo) {
            const rookPrev = prev.find((p) => p.square === rookFrom && !usedPrevIds.has(p.id));
            const rookTarget = items.find((p) => p.square === rookTo && !p.matched);
            if (rookPrev && rookTarget) {
              rookTarget.matched = true;
              usedPrevIds.add(rookPrev.id);
              result.push({ ...rookTarget, id: rookPrev.id });
            }
          }
        }
      }

      // 2. Match unmoved pieces on same square
      for (const item of items) {
        if (item.matched) continue;
        const sameSq = prev.find(
          (p) => p.square === item.square && p.type === item.type && p.color === item.color && !usedPrevIds.has(p.id)
        );
        if (sameSq) {
          item.matched = true;
          usedPrevIds.add(sameSq.id);
          result.push({ ...item, id: sameSq.id });
        }
      }

      // 3. Match any piece of same type and color or assign new ID
      for (const item of items) {
        if (item.matched) continue;
        const sameType = prev.find(
          (p) => p.type === item.type && p.color === item.color && !usedPrevIds.has(p.id)
        );
        if (sameType) {
          item.matched = true;
          usedPrevIds.add(sameType.id);
          result.push({ ...item, id: sameType.id });
        } else {
          const newId = `${idPrefix}-${item.color}-${item.type}-${item.square}-${counterRef.current++}`;
          item.matched = true;
          result.push({ ...item, id: newId });
        }
      }

      return arePiecesEqual(prev, result) ? prev : result;
    });
  }, [fen, orientation, lastFrom, lastTo, idPrefix, displayFiles, displayRanks]);

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
      setComputedLegalTargets((prev) => (areArraysEqual(prev, legalTargets) ? prev : legalTargets));
      return;
    }
    const moves = getMovesForSquare(selectedSquare);
    const combined = Array.from(new Set([...moves, ...legalTargets]));
    setComputedLegalTargets((prev) => (areArraysEqual(prev, combined) ? prev : combined));
  }, [selectedSquare, interactive, legalTargets, getMovesForSquare]);

  const executeMoveAttempt = (from: string, to: string) => {
    if (!interactive || from === to) return false;

    const piece = chessInstance.current.get(from as Square);
    if (!piece) return false;

    const isPawnPromotion =
      piece.type === 'p' &&
      ((piece.color === 'w' && to.endsWith('8')) || (piece.color === 'b' && to.endsWith('1')));

    if (computedLegalTargets.includes(to)) {
      if (isPawnPromotion && !autoQueen) {
        setPendingPromotion({ from, to, color: piece.color });
        return true;
      }

      const destPiece = chessInstance.current.get(to as Square);
      const isCapture = !!destPiece;
      const isCastle = piece.type === 'k' && Math.abs(from.charCodeAt(0) - to.charCodeAt(0)) === 2;

      const success = onMove?.(from, to, isPawnPromotion ? 'q' : undefined);
      if (success !== false) {
        if (isPawnPromotion) {
          sound.promote(to);
        } else if (isCastle) {
          sound.castle();
        } else if (isCapture) {
          sound.capture(to);
        } else {
          sound.move(to);
        }
      }
      setSelectedSquare(null);
      return success !== false;
    } else {
      sound.illegal();
      if (isFull) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 300);
      }
      onIllegalMove?.(from, to);
    }
    return false;
  };

  const handleSquareClick = (sq: string) => {
    if (!interactive) return;

    if (selectedSquare) {
      if (selectedSquare === sq) {
        setSelectedSquare(null);
        return;
      }

      if (computedLegalTargets.includes(sq)) {
        executeMoveAttempt(selectedSquare, sq);
        return;
      }

      // Check if clicking another piece of the player's own color (to change selection)
      const currentPiece = chessInstance.current.get(selectedSquare as Square);
      const clickedPiece = chessInstance.current.get(sq as Square);
      if (currentPiece && clickedPiece && currentPiece.color === clickedPiece.color) {
        setSelectedSquare(sq);
        return;
      }

      // User clicked an illegal destination (empty square or opponent piece that cannot be captured):
      // Execute the illegal move path: shake, sound, onIllegalMove callback, and keep piece selected with legal dots
      executeMoveAttempt(selectedSquare, sq);
      return;
    }

    const pieceOnSquare = chessInstance.current.get(sq as Square);
    if (pieceOnSquare) {
      setSelectedSquare(sq);
    } else {
      setSelectedSquare(null);
    }
  };

  // --- POINTER EVENTS FOR DRAG AND DROP (TOUCH, MOUSE, PEN) ---
  const handlePiecePointerDown = (e: React.PointerEvent, sq: string) => {
    if (!interactive) return;

    const piece = chessInstance.current.get(sq as Square);
    if (!piece) return;

    setSelectedSquare(sq);

    const targetElement = e.currentTarget as HTMLElement;
    targetElement.setPointerCapture(e.pointerId);

    setDraggedPiece({
      sq,
      piece,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      isDragging: false,
    });
  };

  const handlePiecePointerMove = (e: React.PointerEvent) => {
    if (!draggedPiece) return;

    const dx = e.clientX - draggedPiece.startX;
    const dy = e.clientY - draggedPiece.startY;
    const distance = Math.hypot(dx, dy);

    // Only initiate full drag if moved more than 4px (preserves clean clicks)
    const isDragging = distance > 4 || draggedPiece.isDragging;

    let hovered: string | null = null;
    if (boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        const col = Math.floor((x / rect.width) * 8);
        const row = Math.floor((y / rect.height) * 8);
        if (col >= 0 && col < 8 && row >= 0 && row < 8) {
          hovered = `${displayFiles[col]}${displayRanks[row]}`;
        }
      }
    }
    setHoveredSquare(hovered);

    setDraggedPiece({
      ...draggedPiece,
      currentX: e.clientX,
      currentY: e.clientY,
      isDragging,
    });
  };

  const handlePiecePointerUp = (e: React.PointerEvent) => {
    if (!draggedPiece) return;

    const targetElement = e.currentTarget as HTMLElement;
    try {
      targetElement.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    if (draggedPiece.isDragging && boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        const col = Math.floor((x / rect.width) * 8);
        const row = Math.floor((y / rect.height) * 8);
        const targetSq = `${displayFiles[col]}${displayRanks[row]}`;

        if (targetSq !== draggedPiece.sq) {
          executeMoveAttempt(draggedPiece.sq, targetSq);
        }
      }
    }

    setHoveredSquare(null);
    setDraggedPiece(null);
  };

  const handlePiecePointerCancel = () => {
    setHoveredSquare(null);
    setDraggedPiece(null);
  };

  // Square tint styles for classification and selection
  const getSquareTint = (sq: string) => {
    if (selectedSquare === sq) {
      return 'bg-amber-400/50 shadow-inner ring-2 ring-amber-400';
    }

    // Red tint on the attacked king when in check
    try {
      if (chessInstance.current.inCheck()) {
        const turnColor = chessInstance.current.turn();
        const kingPiece = boardPieces.find((p) => p.type === 'k' && p.color === turnColor);
        if (kingPiece && kingPiece.square === sq) {
          return 'bg-red-600/50 ring-2 ring-red-500 shadow-inner';
        }
      }
    } catch {
      // ignore
    }

    if (lastMove) {
      const isFrom = lastMove.from === sq;
      const isTo = lastMove.to === sq;

      if (isFrom || isTo) {
        if (lastMove.classification === 'blunder') {
          return isFrom ? 'bg-red-400/35' : 'bg-amber-500/60 ring-1 ring-amber-500/80';
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
        return 'bg-yellow-400/45';
      }
    }

    if (highlights.includes(sq)) {
      return 'bg-emerald-400/45 ring-2 ring-emerald-400';
    }

    return '';
  };

  // Keyboard navigation
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
        data-board="true"
        className={`relative aspect-square w-full max-w-[min(88vh,720px)] rounded-sm overflow-hidden shadow-2xl border border-black/20 touch-none ${
          isShaking ? 'animate-shake' : ''
        }`}
        style={{
          boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* 8x8 Board Grid (Squares, Tints, Coordinates, Legal Targets) */}
        <div className="w-full h-full grid grid-cols-8 grid-rows-8">
          {displayRanks.map((rank: string, rankIndex: number) =>
            displayFiles.map((file: string, fileIndex: number) => {
              const sq = `${file}${rank}`;
              const isLight = (file.charCodeAt(0) - 97 + parseInt(rank, 10)) % 2 !== 0;
              const bgColor = isLight ? boardTheme.light : boardTheme.dark;
              const coordColor = isLight ? boardTheme.dark : boardTheme.light;
              const tintClass = getSquareTint(sq);
              const isTarget = computedLegalTargets.includes(sq);
              const isHoveredTarget = draggedPiece?.isDragging && hoveredSquare === sq;

              let piece: { type: PieceSymbol; color: Color } | null = null;
              try {
                piece = chessInstance.current.get(sq as Square) || null;
              } catch {
                piece = null;
              }

              return (
                <div
                  key={sq}
                  data-square={sq}
                  tabIndex={interactive ? 0 : -1}
                  onClick={() => handleSquareClick(sq)}
                  onKeyDown={(e) => handleKeyDown(e, sq)}
                  className={`relative w-full h-full flex items-center justify-center cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                    isHoveredTarget ? 'ring-2 ring-amber-400/80 ring-inset shadow-inner' : ''
                  }`}
                  style={{ backgroundColor: bgColor }}
                  aria-label={`Square ${sq}${piece ? `, ${piece.color === 'w' ? 'White' : 'Black'} ${piece.type}` : ''}`}
                >
                  {/* Tint overlay */}
                  {tintClass && <div className={`absolute inset-0 pointer-events-none ${tintClass}`} />}

                  {/* 400ms Red radial check flash */}
                  {checkFlashSquare === sq && (
                    <div
                      className="absolute inset-0 pointer-events-none z-10 animate-fade-out"
                      style={{
                        background:
                          'radial-gradient(circle, rgba(239, 68, 68, 0.85) 0%, rgba(220, 38, 38, 0.45) 55%, transparent 85%)',
                        animationDuration: '400ms',
                      }}
                    />
                  )}

                  {/* Inside Coordinates */}
                  {coordinates === 'inside' && (
                    <>
                      {fileIndex === 0 && (
                        <span
                          className="absolute top-1 left-1.5 text-[11px] md:text-xs font-bold leading-none pointer-events-none select-none opacity-80"
                          style={{ color: coordColor }}
                        >
                          {rank}
                        </span>
                      )}
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

                  {/* Legal move target dot */}
                  {isTarget && (
                    <div
                      className={`absolute pointer-events-none rounded-full z-10 transition-opacity duration-150 ${
                        piece ? 'inset-1 ring-4 ring-emerald-500/60 bg-transparent' : 'w-3.5 h-3.5 bg-emerald-500/60'
                      }`}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* --- DEDICATED ABSOLUTE PIECE LAYER (Sliding Transform Animations) --- */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-15">
          {/* Captured pieces fading out over 100ms */}
          {fadingPieces.map((p) => (
            <div
              key={p.id}
              className="absolute w-[12.5%] h-[12.5%] top-0 left-0 pointer-events-none p-0.5 opacity-0 transition-opacity duration-100 ease-out z-10"
              style={{
                transform: `translate3d(${p.col * 100}%, ${p.row * 100}%, 0)`,
              }}
            >
              <img
                src={`${pieceSet.basePath}/${p.color}${p.type.toUpperCase()}.svg`}
                alt="captured"
                className="w-full h-full object-contain pointer-events-none select-none drop-shadow"
              />
            </div>
          ))}

          {boardPieces.map((p) => {
            const isBeingDragged = draggedPiece?.sq === p.square && draggedPiece.isDragging;
            const pieceImg = `${pieceSet.basePath}/${p.color}${p.type.toUpperCase()}.svg`;

            return (
              <div
                key={p.id}
                data-piece="true"
                data-piece-id={p.id}
                data-piece-color={p.color}
                data-square={p.square}
                onPointerDown={(e) => handlePiecePointerDown(e, p.square)}
                onPointerMove={handlePiecePointerMove}
                onPointerUp={handlePiecePointerUp}
                onPointerCancel={handlePiecePointerCancel}
                className="group absolute w-[12.5%] h-[12.5%] top-0 left-0 pointer-events-auto cursor-grab active:cursor-grabbing p-0.5 will-change-transform"
                style={{
                  transform: `translate3d(${p.col * 100}%, ${p.row * 100}%, 0)`,
                  transition:
                    speedMs > 0 && !isBeingDragged
                      ? `transform ${speedMs}ms cubic-bezier(0, 0, 0.2, 1)`
                      : 'none',
                  opacity: isBeingDragged ? 0.25 : 1,
                  zIndex: isBeingDragged ? 40 : 15,
                }}
              >
                <img
                  src={pieceImg}
                  alt={`${p.color}${p.type}`}
                  draggable={false}
                  className="w-full h-full object-contain pointer-events-none select-none drop-shadow transition-transform duration-100 group-hover:scale-[1.04]"
                />
              </div>
            );
          })}
        </div>

        {/* Vector Overlays: Arrows & Badges */}
        <ArrowLayer arrows={arrows} orientation={orientation} />
        <BadgeLayer badges={badges} orientation={orientation} />

        {/* Promotion Choice Dialog: Vertical strip positioned directly over the promotion square */}
        {pendingPromotion && (
          <PromotionDialog
            isOpen={true}
            color={pendingPromotion.color}
            square={pendingPromotion.to}
            orientation={orientation}
            displayFiles={displayFiles}
            displayRanks={displayRanks}
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

      {/* Floating Ghost Piece Following Pointer During Drag */}
      {draggedPiece && draggedPiece.isDragging && (
        <div
          className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 scale-110 drop-shadow-2xl"
          style={{
            left: draggedPiece.currentX,
            top: draggedPiece.currentY,
            width: boardRef.current ? boardRef.current.offsetWidth / 8 : 45,
            height: boardRef.current ? boardRef.current.offsetHeight / 8 : 45,
          }}
        >
          <img
            src={`${pieceSet.basePath}/${draggedPiece.piece.color}${draggedPiece.piece.type.toUpperCase()}.svg`}
            alt="dragged piece"
            className="w-full h-full object-contain select-none"
            draggable={false}
          />
        </div>
      )}
    </div>
  );
};
