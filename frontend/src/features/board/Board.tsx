import React, { useState, useEffect, useCallback, useRef, useId, useMemo } from 'react';
import { Chess, Square, PieceSymbol, Color } from 'chess.js';
import { BoardTheme, PieceSet, Arrow, BoardBadge, MoveClassification } from '@/data/types';
import { ArrowLayer } from './ArrowLayer';
import { BadgeLayer } from './BadgeLayer';
import { MateBadges } from './MateBadges';
import { PromotionDialog } from './PromotionDialog';
import { motion } from 'framer-motion';
import { useMotion } from '@/lib/useMotion';
import { useSettingsStore } from '@/data/settingsStore';
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
  successSquares?: string[];
  legalTargets?: string[];
  interactive?: boolean;
  onMove?: (from: string, to: string, promotion?: string) => boolean | void;
  onIllegalMove?: (from: string, attemptedTo: string) => void;
  boardTheme: BoardTheme;
  pieceSet: PieceSet;
  animationSpeed?: 'off' | 'fast' | 'medium' | 'slow';
  coordinates?: 'inside' | 'outside' | 'none';
  /** Width cap for the board square. Pages that size the board themselves pass 'max-w-none'. */
  maxWidthClass?: string;
  autoQueen?: boolean;
  tippingPieceSquare?: string | null;
  /** Show the built-in checkmate sequence (king tips over, # and crown badges). Play Coach turns this off and runs its own. */
  autoMateEffects?: boolean;
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
  successSquares = EMPTY_ARRAY,
  legalTargets = EMPTY_ARRAY,
  interactive = true,
  onMove,
  onIllegalMove,
  boardTheme,
  pieceSet,
  animationSpeed = 'medium',
  coordinates = 'inside',
  maxWidthClass = 'max-w-[min(calc(100vh-120px),900px)]',
  autoQueen = true,
  tippingPieceSquare = null,
  autoMateEffects = true,
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
  const deselectOnUpRef = useRef<boolean>(false);

  // Right-click annotations: right-click a square to mark it, right-drag to draw an arrow.
  // Shift = green, Ctrl/Cmd = red arrow / orange mark, Alt = blue. A left click clears them.
  const [userMarks, setUserMarks] = useState<Array<{ sq: string; color: string }>>([]);
  const [userArrows, setUserArrows] = useState<Arrow[]>([]);
  const [drawing, setDrawing] = useState<{ from: string; to: string; mod: 'none' | 'shift' | 'ctrl' | 'alt' } | null>(null);

  const { pieceMs, isFull, isOff } = useMotion();
  const appTheme = useSettingsStore((s) => s.appTheme);

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
  const [inCheckSquare, setInCheckSquare] = useState<string | null>(null);
  const [pulseCheckSquare, setPulseCheckSquare] = useState<string | null>(null);
  const [wigglingKingSquare, setWigglingKingSquare] = useState<string | null>(null);
  // Checkmate sequence state: which king fell, which king won, and whether to animate
  const [mateInfo, setMateInfo] = useState<{ loser: string; winner: string; animate: boolean } | null>(null);
  const mateMountRef = useRef(true);
  useEffect(() => {
    const firstRender = mateMountRef.current;
    mateMountRef.current = false;
    if (!autoMateEffects) {
      setMateInfo(null);
      return;
    }
    let c: Chess;
    try {
      c = new Chess(fen);
    } catch {
      setMateInfo(null);
      return;
    }
    if (!c.isCheckmate()) {
      setMateInfo(null);
      return;
    }
    const loserColor = c.turn();
    let loser = '';
    let winner = '';
    c.board().forEach((row, r) =>
      row.forEach((pc, f) => {
        if (pc && pc.type === 'k') {
          const sq = `${BOARD_FILES[f]}${8 - r}`;
          if (pc.color === loserColor) loser = sq;
          else winner = sq;
        }
      })
    );
    // On first render (e.g. opening a finished game) show the end state without animating or sound
    const animate = !firstRender;
    setMateInfo({ loser, winner, animate });
    if (animate) {
      setTimeout(() => sound.gameEnd(), 450);
    }
  }, [fen, autoMateEffects]);

  const lastFrom = lastMove?.from;
  const lastTo = lastMove?.to;

  // Pulse & overlay attacked king when in check (skip initial mount to avoid unprompted audio)
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
          setInCheckSquare(king.square);
          sound.check(king.square);
          if (isFull) {
            setPulseCheckSquare(king.square);
            setWigglingKingSquare(king.square);
            setTimeout(() => setPulseCheckSquare(null), 300);
            setTimeout(() => setWigglingKingSquare(null), 350);
          }
        }
      } else {
        setInCheckSquare(null);
        setPulseCheckSquare(null);
        setWigglingKingSquare(null);
      }
    } catch {
      // ignore
    }
  }, [fen, boardPieces, isFull]);

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
          setTimeout(() => setFadingPieces([]), 400);
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


  // ----- right-click annotations -----
  const squareFromPoint = (clientX: number, clientY: number): string | null => {
    const el = boardRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const col = Math.floor(((clientX - r.left) / r.width) * 8);
    const row = Math.floor(((clientY - r.top) / r.height) * 8);
    if (col < 0 || col > 7 || row < 0 || row > 7) return null;
    const file = orientation === 'white' ? col : 7 - col;
    const rank = orientation === 'white' ? 7 - row : row;
    return `${BOARD_FILES[file]}${rank + 1}`;
  };
  const modOf = (e: React.PointerEvent): 'none' | 'shift' | 'ctrl' | 'alt' =>
    e.shiftKey ? 'shift' : e.ctrlKey || e.metaKey ? 'ctrl' : e.altKey ? 'alt' : 'none';
  const ARROW_COLOR_FOR: Record<string, Arrow['color']> = { none: 'orange', shift: 'green', ctrl: 'red', alt: 'blue' };
  const MARK_COLOR_FOR: Record<string, string> = {
    none: 'rgba(235, 97, 80, 0.8)',
    shift: 'rgba(172, 206, 89, 0.8)',
    ctrl: 'rgba(255, 170, 0, 0.8)',
    alt: 'rgba(82, 176, 220, 0.8)',
  };

  const handleBoardPointerDownCapture = (e: React.PointerEvent) => {
    if (e.button === 2) {
      e.preventDefault();
      e.stopPropagation();
      const sq = squareFromPoint(e.clientX, e.clientY);
      if (!sq) return;
      setSelectedSquare(null);
      setDrawing({ from: sq, to: sq, mod: modOf(e) });
      try {
        boardRef.current?.setPointerCapture?.(e.pointerId);
      } catch {
        /* not supported */
      }
      return;
    }
    if (e.button === 0 && (userMarks.length || userArrows.length)) {
      setUserMarks([]);
      setUserArrows([]);
    }
  };
  const handleBoardPointerMove = (e: React.PointerEvent) => {
    if (!drawing) return;
    const sq = squareFromPoint(e.clientX, e.clientY);
    if (sq && sq !== drawing.to) setDrawing({ ...drawing, to: sq });
  };
  const handleBoardPointerUp = (e: React.PointerEvent) => {
    if (!drawing || e.button !== 2) return;
    const to = squareFromPoint(e.clientX, e.clientY) || drawing.to;
    if (to === drawing.from) {
      const color = MARK_COLOR_FOR[drawing.mod];
      setUserMarks((prev) =>
        prev.some((m) => m.sq === to && m.color === color)
          ? prev.filter((m) => m.sq !== to)
          : [...prev.filter((m) => m.sq !== to), { sq: to, color }]
      );
    } else {
      const color = ARROW_COLOR_FOR[drawing.mod];
      setUserArrows((prev) =>
        prev.some((a) => a.from === drawing.from && a.to === to && a.color === color)
          ? prev.filter((a) => !(a.from === drawing.from && a.to === to))
          : [...prev.filter((a) => !(a.from === drawing.from && a.to === to)), { from: drawing.from, to, color }]
      );
    }
    setDrawing(null);
  };

  // annotations belong to a position: a new position clears them
  useEffect(() => {
    setUserMarks([]);
    setUserArrows([]);
    setDrawing(null);
  }, [fen]);

  const allArrows = useMemo(() => (userArrows.length ? [...arrows, ...userArrows] : arrows), [arrows, userArrows]);

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

      // Clicking anywhere else just drops the selection, like the reference
      setSelectedSquare(null);
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

    // Click-to-move onto an occupied square: if a piece is already selected and this square is
    // one of its legal targets (a capture), make the move instead of selecting the clicked piece.
    // Previously this always selected the clicked piece, so captures could only be made by dragging.
    const sideToMove = chessInstance.current.turn();
    if (selectedSquare && selectedSquare !== sq) {
      if (computedLegalTargets.includes(sq)) {
        e.preventDefault();
        executeMoveAttempt(selectedSquare, sq);
        return;
      }
      if (piece.color !== sideToMove) {
        // clicking an enemy piece that can't be captured just drops the selection (no shake);
        // the illegal-move feedback is kept for drag-and-drop attempts
        e.preventDefault();
        setSelectedSquare(null);
        return;
      }
    }
    // Only the side to move can pick up pieces (as on the reference site)
    if (piece.color !== sideToMove) return;

    // Clicking the already-selected piece again deselects it (on pointer up, if it wasn't dragged)
    deselectOnUpRef.current = selectedSquare === sq;

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

    if (!draggedPiece.isDragging && deselectOnUpRef.current) {
      setSelectedSquare(null);
    }
    deselectOnUpRef.current = false;

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
      return '';
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
          return 'bg-red-400/35 ring-1 ring-red-500/50';
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
        const isDusk = appTheme === 'dusk';
        return isDusk ? 'bg-[rgba(255,214,79,0.42)]' : 'bg-[rgba(255,214,79,0.38)]';
      }
    }

    if (successSquares.includes(sq)) {
      return 'bg-emerald-500/40 ring-2 ring-emerald-500';
    }
    if (highlights.includes(sq)) {
      return 'bg-amber-400/35 ring-2 ring-amber-400/60';
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
        className={`relative aspect-square w-full ${maxWidthClass} rounded-sm shadow-2xl border border-black/20 touch-none ${
          isShaking ? 'animate-shake' : ''
        }`}
        style={{
          boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
          // lets coordinates use cqw units so they scale with the board (2.8% of its width)
          containerType: 'inline-size',
        }}
        onContextMenu={(e) => e.preventDefault()}
        onPointerDownCapture={handleBoardPointerDownCapture}
        onPointerMove={drawing ? handleBoardPointerMove : undefined}
        onPointerUp={drawing ? handleBoardPointerUp : undefined}
      >
        {/* 8x8 Board Grid (Squares, Tints, Coordinates, Legal Targets) */}
        <div className="w-full h-full grid grid-cols-8 grid-rows-8 rounded-sm overflow-hidden">
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
                  className="relative w-full h-full flex items-center justify-center cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  style={{
                    backgroundColor: bgColor,
                    animation: pulseCheckSquare === sq && isFull ? 'kingCheckPulse 300ms cubic-bezier(.16, 1, .3, 1) 1' : undefined,
                  }}
                  aria-label={`Square ${sq}${piece ? `, ${piece.color === 'w' ? 'White' : 'Black'} ${piece.type}` : ''}`}
                >
                  {/* Tint overlay */}
                  {tintClass && <div className={`absolute inset-0 pointer-events-none ${tintClass}`} />}

                  {/* Right-click mark */}
                  {userMarks.some((m) => m.sq === sq) && (
                    <div
                      data-testid={`mark-${sq}`}
                      className="absolute inset-0 pointer-events-none z-5"
                      style={{ backgroundColor: userMarks.find((m) => m.sq === sq)!.color }}
                    />
                  )}

                  {/* Selected square: same yellow tint as the last move, grows in over 100ms */}
                  {selectedSquare === sq && (
                    <div
                      data-testid="selected-square"
                      className="absolute inset-0 pointer-events-none z-5"
                      style={{
                        backgroundColor: 'rgba(255, 214, 79, 0.5)',
                        animation: isOff ? 'none' : 'selectGrowIn 100ms cubic-bezier(0, 0, 0.2, 1) forwards',
                      }}
                    />
                  )}

                  {/* Drag hover: 3px inner outline, white 65% */}
                  {isHoveredTarget && (
                    <div
                      className="absolute inset-0 pointer-events-none z-10"
                      style={{
                        boxShadow: 'inset 0 0 0 3px rgba(255, 255, 255, 0.65)',
                      }}
                    />
                  )}

                  {/* Check: pulsing red radial overlay while in check */}
                  {inCheckSquare === sq && (
                    <div
                      className="absolute inset-0 pointer-events-none z-10"
                      style={{
                        background:
                          'radial-gradient(circle, rgba(239, 68, 68, 0.45) 0%, rgba(220, 38, 38, 0.25) 55%, transparent 85%)',
                        animation: 'redRadialPulse 2s ease-in-out infinite',
                      }}
                    />
                  )}

                  {/* Inside coordinates: 2.8% of the board, semibold, in the opposite square colour */}
                  {coordinates === 'inside' && (
                    <>
                      {fileIndex === 0 && (
                        <span
                          className="absolute leading-none pointer-events-none select-none font-semibold"
                          style={{ color: coordColor, fontSize: '2.8cqw', left: '0.6cqw', top: '0.5cqw' }}
                        >
                          {rank}
                        </span>
                      )}
                      {rankIndex === 7 && (
                        <span
                          className="absolute leading-none pointer-events-none select-none font-semibold"
                          style={{ color: coordColor, fontSize: '2.8cqw', right: '0.6cqw', bottom: '0.45cqw' }}
                        >
                          {file}
                        </span>
                      )}
                    </>
                  )}

                  {/* Legal move hints: a soft dark dot (33% of the square) on empty squares,
                      a ring around the edge of an occupied square */}
                  {isTarget && (
                    <div
                      data-testid="legal-hint"
                      className="absolute pointer-events-none z-10 rounded-full"
                      style={
                        piece
                          ? // capture: a ring that fills the square's inscribed circle, thick enough to show around the piece
                            { inset: 0, boxShadow: 'inset 0 0 0 1.35cqw rgba(0, 0, 0, 0.16)' }
                          : { width: '33%', height: '33%', background: 'rgba(0, 0, 0, 0.14)' }
                      }
                    />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* --- DEDICATED ABSOLUTE PIECE LAYER (Sliding Transform Animations) --- */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-15">
          {/* Captured pieces scale-up fade over 400ms + particles (Full motion only) */}
          {fadingPieces.map((p) => (
            <div
              key={p.id}
              className="absolute w-[12.5%] h-[12.5%] top-0 left-0 pointer-events-none p-0.5 z-20"
              style={{
                transform: `translate3d(${p.col * 100}%, ${p.row * 100}%, 0)`,
              }}
            >
              <motion.div
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 0, scale: isFull ? 1.8 : 1 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="w-full h-full relative"
              >
                <img
                  src={`${pieceSet.basePath}/${p.color}${p.type.toUpperCase()}.svg`}
                  alt="captured"
                  className="w-full h-full object-contain pointer-events-none select-none drop-shadow"
                />
                {isFull && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {[0, 1, 2, 3, 4, 5].map((i) => {
                      const angle = (i * Math.PI) / 3;
                      const dist = 24;
                      const dx = Math.cos(angle) * dist;
                      const dy = Math.sin(angle) * dist;
                      return (
                        <div
                          key={i}
                          className="absolute w-1.5 h-1.5 rounded-full bg-amber-300 shadow-sm"
                          style={{
                            ['--p-dx' as string]: `${dx}px`,
                            ['--p-dy' as string]: `${dy}px`,
                            animation: 'captureParticle 400ms ease-out forwards',
                          }}
                        />
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </div>
          ))}

          {boardPieces.map((p) => {
            const isBeingDragged = draggedPiece?.sq === p.square && draggedPiece.isDragging;
            const pieceImg = `${pieceSet.basePath}/${p.color}${p.type.toUpperCase()}.svg`;
            const isWiggling = wigglingKingSquare === p.square && isFull;
            const isTipping = tippingPieceSquare === p.square && isFull;
            const isMatedKing = !!mateInfo && mateInfo.loser === p.square && p.type === 'k';

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
                  style={{
                    animation: isWiggling
                      ? 'kingWiggle 350ms ease-in-out 1'
                      : isTipping
                      ? 'kingFallOver 450ms cubic-bezier(.34, 1.3, .64, 1) forwards'
                      : isMatedKing && mateInfo?.animate && !isOff
                      ? 'kingFallOver 520ms cubic-bezier(.34, 1.3, .64, 1) 450ms forwards'
                      : undefined,
                    transform: isMatedKing && (!mateInfo?.animate || isOff) ? 'translateY(10%) rotate(90deg)' : undefined,
                    transformOrigin: isTipping || isMatedKing ? '50% 50%' : undefined,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Vector Overlays: Arrows & Badges */}
        <ArrowLayer
          arrows={allArrows}
          orientation={orientation}
          preview={drawing && drawing.from !== drawing.to ? { from: drawing.from, to: drawing.to, color: ARROW_COLOR_FOR[drawing.mod] } : null}
        />
        <BadgeLayer badges={badges} orientation={orientation} />
        {mateInfo && (
          <MateBadges loser={mateInfo.loser} winner={mateInfo.winner} orientation={orientation} animate={mateInfo.animate && !isOff} />
        )}

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
