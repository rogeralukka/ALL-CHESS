import { bookCommentary } from './phases';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import { Game, Move, CoachExpression, Arrow, BoardBadge, MoveClassification } from '@/data/types';
import { Board } from '@/features/board/Board';
import { EvalBar } from '@/features/board/EvalBar';
import { EvalGraph } from '@/features/board/EvalGraph';
import { MoveList } from '@/features/board/MoveList';
import { PlayerBar } from '@/components/PlayerBar';
import { PlayerAvatar } from '@/components/Bits';
import { useCurrentUser } from '@/lib/useCurrentUser';
import { CoachSpeech } from '@/features/coach/CoachSpeech';
import { BubbleMessage } from '@/features/coach/CoachBubble';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useSettingsStore } from '@/data/settingsStore';
import { BOARD_THEMES, PIECE_SETS } from '@/data/boardThemes';
import { getExpressionForEvent } from '@/features/coach/expressionMap';
import { formatEval } from '@/lib/formatters';
import { sound } from '@/lib/sound';
import { usePhoneLayout, useMediaQuery } from '@/lib/useMediaQuery';
import { createPortal } from 'react-dom';
import { MobileMoveStrip } from './MobileMoveStrip';
import { threatenedSquares } from '@/lib/threats';
import { annotationArrows, annotationSquares, hasAnnotations } from '@/lib/annotations';
import {
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  ArrowLeft,
  SlidersHorizontal,
  Eye,
  ListTree,
  X,
} from 'lucide-react';
import { SidebarPanel, SidebarHeader, HeaderIconButton } from '@/components/SidebarPanel';
import { useNavigate } from 'react-router-dom';
import { LeaveGuard } from '@/components/LeaveGuard';

interface ReviewBoardProps {
  game: Game;
  onBackToSummary: () => void;
}

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const START_PIECE_COUNTS = { p: 8, n: 2, b: 2, r: 2, q: 1 };
const PIECE_VALUES: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const PIECE_FIGURINES: Record<string, string> = { p: '♟', n: '♞', b: '♝', r: '♜', q: '♛' };

function getMoveSquares(fen: string, san: string): { from: string; to: string } | null {
  try {
    const c = new Chess(fen);
    const m = c.move(san);
    if (m) return { from: m.from, to: m.to };
    return null;
  } catch {
    return null;
  }
}

/**
 * Calculates captured pieces and material difference from current FEN
 */
function getMaterialState(fen: string) {
  const [placement] = fen.split(' ');
  const currentCounts: Record<'w' | 'b', Record<string, number>> = {
    w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
    b: { p: 0, n: 0, b: 0, r: 0, q: 0 },
  };

  for (const char of placement) {
    if (char === '/' || (char >= '1' && char <= '8')) continue;
    const isWhite = char === char.toUpperCase();
    const type = char.toLowerCase();
    if (type !== 'k') {
      currentCounts[isWhite ? 'w' : 'b'][type] = (currentCounts[isWhite ? 'w' : 'b'][type] || 0) + 1;
    }
  }

  // Captured pieces:
  // White captured = missing black pieces
  const whiteCaptured: string[] = [];
  let whiteMaterial = 0;
  for (const [piece, max] of Object.entries(START_PIECE_COUNTS)) {
    const remaining = currentCounts.b[piece] || 0;
    const captured = Math.max(0, max - remaining);
    for (let i = 0; i < captured; i++) {
      whiteCaptured.push(piece);
    }
  }

  // Black captured = missing white pieces
  const blackCaptured: string[] = [];
  let blackMaterial = 0;
  for (const [piece, max] of Object.entries(START_PIECE_COUNTS)) {
    const remaining = currentCounts.w[piece] || 0;
    const captured = Math.max(0, max - remaining);
    for (let i = 0; i < captured; i++) {
      blackCaptured.push(piece);
    }
  }

  // Total material value on board
  for (const [piece, count] of Object.entries(currentCounts.w)) {
    whiteMaterial += (PIECE_VALUES[piece] || 0) * count;
  }
  for (const [piece, count] of Object.entries(currentCounts.b)) {
    blackMaterial += (PIECE_VALUES[piece] || 0) * count;
  }

  const diff = whiteMaterial - blackMaterial;

  return {
    whiteCaptured,
    blackCaptured,
    whiteDiff: diff > 0 ? `+${diff}` : null,
    blackDiff: diff < 0 ? `+${Math.abs(diff)}` : null,
  };
}

export const ReviewBoard: React.FC<ReviewBoardProps> = ({ game, onBackToSummary }) => {
  const me = useCurrentUser();
  const navigate = useNavigate();
  const {
    boardThemeId,
    pieceSetId,
    animationSpeed,
    coordinates,
    coachVoiceEnabled,
    soundEnabled,
    updateSettings,
  } = useSettingsStore();

  const currentBoardTheme = BOARD_THEMES.find((t) => t.id === boardThemeId) || BOARD_THEMES[0];
  const currentPieceSet = PIECE_SETS.find((p) => p.id === pieceSetId) || PIECE_SETS[0];

  const isUserWhite = game.isUserWhite ?? (game.white.username === 'You');
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [orientation, setOrientation] = useState<'white' | 'black'>(isUserWhite ? 'white' : 'black');

  useEffect(() => {
    setOrientation(isUserWhite ? 'white' : 'black');
  }, [game.id, isUserWhite]);

  // Mode states
  // "Best" is a mode: once switched on it stays on while you step through the game (until you switch it off)
  const [bestLock, setBestLock] = useState<boolean>(false);
  const [explaining, setExplaining] = useState<boolean>(false);
  const [variationStep, setVariationStep] = useState<number>(0);
  const [retryMode, setRetryMode] = useState<boolean>(false);
  const [retrySuccess, setRetrySuccess] = useState<boolean | null>(null);
  const [retryFen, setRetryFen] = useState<string | null>(null);
  const [topLinesOpen, setTopLinesOpen] = useState<boolean>(false);
  const [showMove, setShowMove] = useState<boolean>(false);
  const [linesSheetOpen, setLinesSheetOpen] = useState<boolean>(false);
  const isPhone = usePhoneLayout();
  const isXs = useMediaQuery('(max-width: 639px)');

  const currentMove: Move | undefined = game.moves[currentMoveIndex];

  // Position BEFORE current move
  const fenBeforeMove = useMemo(() => {
    if (currentMoveIndex === 0) return START_FEN;
    return game.moves[currentMoveIndex - 1]?.fen || START_FEN;
  }, [game.moves, currentMoveIndex]);

  // The line Explain steps through. The review data (annotations.pv) says where it starts: the opponent's
  // refutation from the position AFTER a mistake or blunder, the best line from the position BEFORE the move
  // for every other class. Older data only has an engine line, which was always replayed from after the move.
  const annotatedLine = currentMove?.annotations?.pv;
  const hasAnnotatedLine = !!annotatedLine && annotatedLine.length > 0;
  const lineFromBefore = hasAnnotatedLine && currentMove?.classification !== 'mistake' && currentMove?.classification !== 'blunder';
  const refutationMoves = useMemo(() => {
    const ann = currentMove?.annotations?.pv;
    if (ann && ann.length > 0) return ann;
    return currentMove?.variation || currentMove?.eval?.lines?.[0]?.pv || [];
  }, [currentMove]);

  // What Explain can show: the backend's proven sentences and/or the engine line to step through. Book moves already show their opening text.
  const explainSentences = useMemo(() => (currentMove?.annotations?.explain ?? []).filter(Boolean), [currentMove]);

  // Reset secondary modes when navigating moves
  // (Show and Best are on/off switches that stay as they are from move to move, so they are not reset here)
  const resetModes = useCallback(() => {
    setExplaining(false);
    setVariationStep(0);
    setRetryMode(false);
    setRetrySuccess(null);
    setRetryFen(null);
  }, []);

  const handleNext = useCallback(() => {
    resetModes();
    setCurrentMoveIndex((prev) => {
      const nextIdx = Math.min(game.moves.length - 1, prev + 1);
      if (nextIdx !== prev) {
        const nextMove = game.moves[nextIdx];
        if (nextMove?.san.includes('x')) {
          sound.capture();
        } else if (nextMove?.san.includes('#') || nextMove?.san.includes('+')) {
          sound.check();
        } else if (nextMove?.san.includes('O-O')) {
          sound.castle();
        } else {
          sound.move();
        }
      }
      return nextIdx;
    });
  }, [game.moves, resetModes]);

  const handlePrev = useCallback(() => {
    resetModes();
    sound.move();
    setCurrentMoveIndex((prev) => Math.max(0, prev - 1));
  }, [resetModes]);

  const handleFirst = useCallback(() => {
    resetModes();
    setCurrentMoveIndex(0);
  }, [resetModes]);

  const handleLast = useCallback(() => {
    resetModes();
    setCurrentMoveIndex(game.moves.length - 1);
  }, [game.moves.length, resetModes]);

  // Autoplay loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentMoveIndex((prev) => {
          if (prev >= game.moves.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1600);
    }
    return () => clearInterval(timer);
  }, [isPlaying, game.moves.length]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'Home') handleFirst();
      else if (e.key === 'End') handleLast();
      else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.key.toLowerCase() === 'f') {
        setOrientation((o) => (o === 'white' ? 'black' : 'white'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleFirst, handleLast]);

  // Classification info
  const classification = currentMove?.classification || 'book';
  const isBookMove = classification === 'book';
  const isMistakeOrBlunder = ['inaccuracy', 'mistake', 'miss', 'blunder'].includes(classification);
  // Explain only appears when there is something to show: proven sentences, or an engine line after an error (never for book moves, which already show their opening text)
  const hasExplain = !isBookMove && (explainSentences.length > 0 || (isMistakeOrBlunder && refutationMoves.length > 0));
  const targetBestMove = currentMove?.eval?.bestMove || currentMove?.eval?.lines?.[0]?.move || currentMove?.annotations?.bestMove?.san || '';

  // "Best" is available whenever the engine prefers a different move than the one played (not only after mistakes)
  const stripSan = (m: string) => m.replace(/[+#?!]/g, '');
  const canBest = !isBookMove && !!targetBestMove && !!currentMove && stripSan(targetBestMove) !== stripSan(currentMove.san || '');
  // on the best move itself (or a book move) there is nothing better to show, so the normal view is used there
  const showingBest = bestLock && canBest && !explaining && !retryMode;

  // Determine active board FEN, arrows, badges, and lastMove (memoized)
  const { displayFen, arrows, badges, boardLastMove, threats, targets, orangeTargets } = useMemo(() => {
    let thr: string[] = [];
    let tgt: string[] = [];
    let orTgt: string[] = [];
    let fen = currentMove?.fen || START_FEN;
    let arrs: Arrow[] = [];
    let bdgs: BoardBadge[] = currentMove?.classification
      ? [{ square: currentMove.to, label: currentMove.classification }]
      : [];
    let lastM: { from: string; to: string; classification?: MoveClassification } | null = currentMove
      ? {
          from: currentMove.from,
          to: currentMove.to,
          classification: currentMove.classification,
        }
      : null;

    // 1. SHOW BEST MODE: no piece moves; the better move is only drawn as a green arrow (like Chess.com)
    if (showingBest) {
      if (targetBestMove) {
        const sqs = getMoveSquares(fenBeforeMove, targetBestMove);
        if (sqs) {
          arrs = [{ from: sqs.from, to: sqs.to, color: 'green' }];
          tgt = [sqs.to];
          // if the played move itself changed the piece the arrow starts on, show the position before the move so the arrow starts on a piece
          const pieceAt = (f: string, sq: string) => {
            try {
              const p = new Chess(f).get(sq as never);
              return p ? `${p.color}${p.type}` : '';
            } catch {
              return '';
            }
          };
          if (currentMove && pieceAt(currentMove.fen, sqs.from) !== pieceAt(fenBeforeMove, sqs.from)) {
            fen = fenBeforeMove;
            bdgs = [];
            lastM = null;
          }
        }
      }
    }
    // 2. EXPLAIN VARIATION STEPPER MODE
    else if (explaining) {
      bdgs = [];
      lastM = null;
      try {
        const startFen = lineFromBefore ? fenBeforeMove : currentMove?.fen || START_FEN;
        const c = new Chess(startFen);
        for (let s = 0; s < variationStep; s++) {
          c.move(refutationMoves[s]);
        }
        fen = c.fen();

        if (variationStep < refutationMoves.length) {
          const nextSq = getMoveSquares(fen, refutationMoves[variationStep]);
          if (nextSq) {
            arrs = [{ from: nextSq.from, to: nextSq.to, color: lineFromBefore ? 'green' : 'red' }];
          }
        }
      } catch {
        fen = lineFromBefore ? fenBeforeMove : currentMove?.fen || START_FEN;
      }
    }
    // 3. RETRY MODE
    else if (retryMode) {
      bdgs = [];
      lastM = null;
      fen = retryFen || fenBeforeMove;
      if (retrySuccess && targetBestMove) {
        const sqs = getMoveSquares(fenBeforeMove, targetBestMove);
        if (sqs) arrs = [{ from: sqs.from, to: sqs.to, color: 'green' }];
      }
    }
    // 4. NORMAL VIEW
    else {
      // Chess.com rules: miss = green arrow to the move that was missed; inaccuracy = green better move;
      // mistake / blunder = red arrow for the reply that punishes it, plus the better move's square in green.
      if (hasAnnotations(currentMove)) {
        // the backend decided which arrows belong to this move
        arrs = annotationArrows(currentMove.annotations, classification);
      } else {
        if (['inaccuracy', 'miss'].includes(classification) && targetBestMove) {
          const bestSq = getMoveSquares(fenBeforeMove, targetBestMove);
          if (bestSq) arrs = [{ from: bestSq.from, to: bestSq.to, color: 'green' }];
        }
        if (['mistake', 'blunder'].includes(classification) && currentMove?.variation?.[0]) {
          const refutSq = getMoveSquares(currentMove.fen, currentMove.variation[0]);
          if (refutSq) arrs = [{ from: refutSq.from, to: refutSq.to, color: 'red' }];
        }
      }
      // The played move is drawn in orange only when Show is on (Chess.com draws the move's threats by default); knights bend in an L
      if (currentMove && showMove) {
        arrs = [...arrs, { from: currentMove.from, to: currentMove.to, color: 'orange' }];
      }
    }

    // Red squares: enemy pieces the move attacks (normal view only)
    if (!showingBest && !explaining && !retryMode && currentMove) {
      if (hasAnnotations(currentMove)) {
        const sq = annotationSquares(currentMove.annotations, classification);
        thr = sq.threats;
        tgt = sq.targets;
        orTgt = sq.orangeTargets;
      } else {
        thr = threatenedSquares(currentMove.fen, currentMove.to);
        if ((classification === 'mistake' || classification === 'blunder') && targetBestMove) {
          const b = getMoveSquares(fenBeforeMove, targetBestMove);
          if (b) tgt = [b.to];
        }
      }
    }
    return {
      threats: thr,
      targets: tgt,
      orangeTargets: orTgt,
      displayFen: fen,
      arrows: arrs,
      badges: bdgs,
      boardLastMove: lastM,
    };
  }, [
    currentMove,
    showingBest,
    targetBestMove,
    fenBeforeMove,
    explaining,
    variationStep,
    refutationMoves,
    retryMode,
    retryFen,
    retrySuccess,
    classification,
    showMove,
    lineFromBefore,
  ]);

  // Compute Material Difference and Captured Pieces
  const materialState = useMemo(() => getMaterialState(displayFen), [displayFen]);

  // --- COACH EXPRESSION & DIALOGUE ---
  let coachExpression: CoachExpression = getExpressionForEvent(classification);
  let coachText = currentMove?.coachComment || currentMove?.eval?.why || '';
  let bubbleClassification = classification;
  let bubbleMoveSan = currentMove?.san;
  let bubbleEvalText = formatEval(currentMove?.eval?.eval, currentMove?.eval?.mateIn);
  const bubbleEvalScore = currentMove?.eval?.eval;

  if (showingBest) {
    coachExpression = 'thumbsup';
    bubbleClassification = 'best';
    bubbleMoveSan = targetBestMove;
    bubbleEvalText = formatEval(currentMove?.eval?.lines?.[0]?.eval ?? currentMove?.eval?.eval);
    coachText = `${targetBestMove} was best.${currentMove?.eval?.lines?.[0]?.why ? ` ${currentMove.eval.lines[0].why}` : ''}`;
  } else if (explaining) {
    coachExpression = 'thinking';
    const sentences = explainSentences.join(' ');
    const lineSoFar = refutationMoves.slice(0, variationStep).join(' ');
    const next = refutationMoves[variationStep];
    coachText =
      variationStep === 0
        ? `${sentences}${sentences && next ? ' ' : ''}${next ? `Next in the line: ${next}.` : ''}`.trim() || 'No deeper line to show here.'
        : `${lineSoFar}${next ? `, then ${next}.` : '. End of the line.'}`;
  } else if (retryMode) {
    if (retrySuccess) {
      coachExpression = 'brilliant';
      coachText = `Brilliant! You found ${targetBestMove}! That was the top engine move.`;
    } else if (retrySuccess === false) {
      coachExpression = 'embarrassed';
      coachText = `Not quite the strongest continuation. Look for checks, captures, or undefended squares, or tap Show Answer.`;
    } else {
      coachExpression = 'thinking';
      coachText = `Can you find a better move in this position? Look closely at the board!`;
    }
  } else {
    // Body never repeats the header "<move> is a <label>" and is capped at 90 characters
    const book = bookCommentary(game.moves, currentMoveIndex);
    if (book) {
      coachText = currentMove?.classification === 'book' ? book : `${book} ${coachText}`;
    }
    if (currentMove?.san && currentMove?.classification && !book) {
      const san = currentMove.san.replace(/[+#]/g, '\\$&');
      const label = `(?:slightly\\s+)?(?:${currentMove.classification}|inaccura\\w*)`;
      const prefixRegex = new RegExp(`^${san}\\s+(is\\s+(a\\s+|an\\s+)?${label}[.:!\\s]*)+`, 'i');
      const stripped = coachText.replace(prefixRegex, '').trim();
      // a body that still starts with a move ("f6 ...") keeps its case; sentences start with a capital
      const startsWithMove = /^(?:[a-h][1-8x]|O-O|[KQRBN][a-hx1-8])/.test(stripped);
      coachText = stripped.length > 0 && !startsWithMove ? stripped[0].toUpperCase() + stripped.slice(1) : stripped;
    }
  }

  // Cap body text so the bubble stays readable (about five lines)
  if (coachText.length > 220) {
    const trimmed = coachText.slice(0, 217);
    const lastSpace = trimmed.lastIndexOf(' ');
    coachText = (lastSpace > 150 ? trimmed.slice(0, lastSpace) : trimmed) + '...';
  }

  const bubbleMessages: BubbleMessage[] = useMemo(
    () => [
      {
        id: `move-${currentMoveIndex}-${showingBest ? 'best' : explaining ? `exp-${variationStep}` : retryMode ? `retry-${retrySuccess}` : 'norm'}`,
        text: coachText,
        classification: bubbleClassification,
        moveSan: bubbleMoveSan,
        evalText: bubbleEvalText,
        evalScore: bubbleEvalScore,
      },
    ],
    [
      currentMoveIndex,
      showingBest,
      explaining,
      variationStep,
      retryMode,
      retrySuccess,
      coachText,
      bubbleClassification,
      bubbleMoveSan,
      bubbleEvalText,
      bubbleEvalScore,
    ]
  );

  // Active variation to show in MoveList
  const activeVariation = explaining || showingBest
    ? {
        parentMoveIndex: currentMoveIndex,
        title: showingBest || lineFromBefore ? 'Best Line Variation' : 'Refutation Line',
        moves: showingBest ? currentMove?.eval?.lines?.[0]?.pv || [targetBestMove] : refutationMoves,
      }
    : null;

  // --- RETRY MOVE HANDLER ---
  const handleRetryMove = (from: string, to: string, promotion?: string) => {
    if (!retryMode) return;

    try {
      const sim = new Chess(fenBeforeMove);
      const played = sim.move({ from, to, promotion: promotion || 'q' });
      if (!played) return;

      const altLines = currentMove?.eval?.lines || [];
      const isAccepted =
        played.san === targetBestMove || altLines.some((l) => l.move === played.san);

      if (isAccepted) {
        setRetrySuccess(true);
        setRetryFen(sim.fen());
      } else {
        setRetrySuccess(false);
        setRetryFen(sim.fen());
      }
    } catch {
      // invalid move
    }
  };

  const handleShowAnswer = () => {
    try {
      const sim = new Chess(fenBeforeMove);
      if (targetBestMove) sim.move(targetBestMove);
      setRetryFen(sim.fen());
      setRetrySuccess(true);
    } catch {
      // fallback
    }
  };

  const topPlayer = orientation === 'white' ? game.black : game.white;
  const bottomPlayer = orientation === 'white' ? game.white : game.black;
  const topCaptured = orientation === 'white' ? materialState.blackCaptured : materialState.whiteCaptured;
  const topDiff = orientation === 'white' ? materialState.blackDiff : materialState.whiteDiff;
  const bottomCaptured = orientation === 'white' ? materialState.whiteCaptured : materialState.blackCaptured;
  const bottomDiff = orientation === 'white' ? materialState.whiteDiff : materialState.blackDiff;

  // --- PHONE LAYOUT (as in the Chess.com app): coach above a full-width board, move strip, bottom action bar ---
  if (isPhone) {
    const stepCount = refutationMoves.length;
    const barBtn = (enabled: boolean) =>
      `flex flex-col items-center justify-center gap-0.5 h-14 w-14 flex-shrink-0 rounded-lg text-[13px] font-bold select-none transition-colors ${
        enabled ? 'text-theme-text active:bg-white/10' : 'text-theme-muted/40 pointer-events-none'
      }`;
    const screen = (
      <div
        className={`flex flex-col w-full bg-theme-page overflow-hidden ${isXs ? 'fixed inset-0 z-50' : 'h-full'}`}
        data-testid="review-mobile"
      >
        <SidebarHeader
          title="Game Review"
          left={
            <HeaderIconButton onClick={onBackToSummary} title="Return to Summary" aria-label="Return to Summary">
              <ArrowLeft size={22} />
            </HeaderIconButton>
          }
          right={
            <>
              <HeaderIconButton
                onClick={() => setOrientation((o) => (o === 'white' ? 'black' : 'white'))}
                title="Flip board"
                aria-label="Flip board"
              >
                <RotateCcw size={20} />
              </HeaderIconButton>
              <HeaderIconButton onClick={() => navigate('/settings')} title="Settings" aria-label="Settings">
                <SlidersHorizontal size={20} />
              </HeaderIconButton>
            </>
          }
        />

        {/* Coach + bubble (fixed band so the board never jumps between moves) */}
        <div className="flex-shrink-0 px-2 pt-2 pb-1 h-[172px] flex items-end overflow-hidden">
          <CoachSpeech
            expression={coachExpression}
            messages={bubbleMessages}
            voiceEnabled={coachVoiceEnabled}
            size={72}
            className="w-full !items-end"
          />
        </div>

        {/* Board, full width, no eval bar or player rows */}
        <div className="w-full aspect-square flex-shrink-0" data-testid="review-board-mobile">
          <Board
            fen={displayFen}
            orientation={orientation}
            boardTheme={currentBoardTheme}
            pieceSet={currentPieceSet}
            animationSpeed={animationSpeed}
            coordinates={coordinates}
            lastMove={boardLastMove}
            badges={badges}
            arrows={arrows}
            threats={threats}
            targets={targets}
            orangeTargets={orangeTargets}
            interactive={retryMode}
            onMove={handleRetryMove}
          />
        </div>

        <MobileMoveStrip
          moves={game.moves}
          currentMoveIndex={currentMoveIndex}
          onSelectMove={(idx) => {
            resetModes();
            setCurrentMoveIndex(idx);
          }}
          onPrev={handlePrev}
          onNext={handleNext}
        />

        <div className="flex-1 min-h-0" />

        {/* Bottom action bar */}
        <div
          className="flex-shrink-0 flex items-center gap-2 px-3 pt-2 pb-[max(12px,env(safe-area-inset-bottom))]"
          style={{ background: 'var(--side-panel-bg)' }}
          data-testid="review-actions"
        >
          {retryMode ? (
            <>
              <button type="button" className={barBtn(true)} onClick={() => setRetryFen(null)}>
                <RotateCcw size={22} />
                Again
              </button>
              <button type="button" className={barBtn(true)} onClick={handleShowAnswer}>
                <Sparkles size={22} />
                Answer
              </button>
              <Button variant="primary" size="md" className="!h-14 flex-1 !text-[20px]" onClick={resetModes}>
                Resume
              </Button>
            </>
          ) : explaining ? (
            <>
              <button
                type="button"
                className={barBtn(!isBookMove && variationStep > 0)}
                onClick={() => setVariationStep((n) => Math.max(0, n - 1))}
              >
                <ChevronLeft size={22} />
                Back
              </button>
              <button
                type="button"
                className={barBtn(!isBookMove && variationStep < stepCount - 1)}
                onClick={() => setVariationStep((n) => Math.min(stepCount - 1, n + 1))}
              >
                <ChevronRight size={22} />
                Step
              </button>
              <Button variant="primary" size="md" className="!h-14 flex-1 !text-[20px]" onClick={resetModes}>
                Got it!
              </Button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={`${barBtn(true)} ${showMove ? 'bg-white/10 !text-amber-400' : ''}`}
                aria-pressed={showMove}
                data-testid="mobile-show"
                onClick={() => setShowMove((v) => !v)}
              >
                <Eye size={22} className={showMove ? 'text-amber-400' : ''} />
                Show
              </button>
              <button
                type="button"
                className={barBtn(canBest || bestLock)}
                aria-pressed={bestLock}
                data-testid="mobile-best"
                onClick={() => {
                  setBestLock((v) => !v);
                  setExplaining(false);
                  setRetryMode(false);
                }}
              >
                <Sparkles size={22} className={bestLock ? 'text-amber-400' : ''} />
                {bestLock ? 'Best: on' : 'Best'}
              </button>
              {isMistakeOrBlunder && hasExplain && (
                <button
                  type="button"
                  className={barBtn(true)}
                  data-testid="mobile-explain"
                  onClick={() => {
                    setExplaining(true);
                    setRetryMode(false);
                    setVariationStep(0);
                  }}
                >
                  <HelpCircle size={22} />
                  Explain
                </button>
              )}
              {isMistakeOrBlunder ? (
                <button
                  type="button"
                  className={barBtn(true)}
                  data-testid="mobile-retry"
                  onClick={() => {
                    setRetryMode(true);
                    setExplaining(false);
                    setRetrySuccess(null);
                    setRetryFen(null);
                  }}
                >
                  <RotateCcw size={22} />
                  Retry
                </button>
              ) : (
                <button type="button" className={barBtn(true)} data-testid="mobile-lines" onClick={() => setLinesSheetOpen(true)}>
                  <ListTree size={22} />
                  Lines
                </button>
              )}
              <Button
                variant="primary"
                size="md"
                className="!h-14 flex-1 !text-[20px]"
                onClick={handleNext}
                disabled={currentMoveIndex >= game.moves.length - 1}
                data-testid="mobile-next"
              >
                Next
              </Button>
            </>
          )}
        </div>

        {/* Engine lines sheet */}
        {linesSheetOpen && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/50" onClick={() => setLinesSheetOpen(false)} data-testid="lines-sheet">
            <div
              className="rounded-t-2xl p-4 pb-[max(16px,env(safe-area-inset-bottom))] max-h-[70%] overflow-y-auto space-y-2"
              style={{ background: 'var(--side-panel-bg)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-display font-extrabold text-[20px]">Engine lines</h2>
                <HeaderIconButton onClick={() => setLinesSheetOpen(false)} aria-label="Close">
                  <X size={20} />
                </HeaderIconButton>
              </div>
              {currentMove?.eval?.lines?.length ? (
                currentMove.eval.lines.map((line, lIdx) => (
                  <div key={`ml-${lIdx}`} className="p-3 rounded-lg bg-theme-raised/60 border border-theme-border/40 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[16px]">
                        {lIdx + 1}. {line.move}
                      </span>
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-theme-raised text-amber-500">{formatEval(line.eval)}</span>
                    </div>
                    {line.why && <p className="text-[14px] text-theme-muted">{line.why}</p>}
                  </div>
                ))
              ) : (
                <p className="text-theme-muted text-[14px]">No engine lines for this move.</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
    // On phones the screen covers the bottom nav (a portal escapes the page's stacking context)
    return isXs && typeof document !== 'undefined' ? createPortal(screen, document.body) : screen;
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full w-full overflow-y-auto lg:overflow-hidden lg:items-center lg:justify-center lg:gap-6 lg:px-6 lg:py-4 pb-20 lg:pb-4">
      <LeaveGuard
        when
        title="Leave this review?"
        message="You will go back out of the game review."
        leaveLabel="Leave review"
        stayLabel="Stay"
      />
      {/* --- CENTER ZONE: CHESS BOARD & EVAL BAR (Sticky at top on mobile) --- */}
      <div className="sticky top-0 z-20 w-full flex flex-col items-center justify-center p-2 sm:p-3 md:p-6 bg-theme-page border-b lg:border-b-0 border-theme-border/60 flex-shrink-0 lg:flex-1 min-w-0">
        <div className="w-full max-w-[min(calc(100vh-108px),900px)] flex flex-col gap-2">
          {/* Top Player Row + Material Tally */}
          <PlayerBar
            testId="player-top"
            name={me.label(topPlayer.username)}
            rating={topPlayer.rating}
            avatar={<PlayerAvatar name={topPlayer.username} size={40} className="!rounded-none" />}
            captured={
              <>
                {topCaptured.map((p, i) => (
                  <span key={`tc-${i}`}>{PIECE_FIGURINES[p]}</span>
                ))}
                {topDiff && <span className="ml-1 text-[13px] font-bold">{topDiff}</span>}
              </>
            }
            right={<span className="px-2.5 py-1 rounded-md bg-black/[0.06] dark:bg-black/25 text-[13px] font-bold text-theme-muted capitalize">{game.speed} · {game.timeControl}</span>}
          />

          {/* Board + Eval Bar Container */}
          <div className="flex items-stretch justify-center gap-1.5 sm:gap-2.5 w-full">
            <EvalBar
              evalScore={showingBest ? currentMove?.eval?.lines?.[0]?.eval ?? currentMove?.eval?.eval : currentMove?.eval?.eval}
              orientation={orientation}
              height="auto"
            />
            <div className="flex-1 aspect-square">
              <Board
                fen={displayFen}
                orientation={orientation}
                boardTheme={currentBoardTheme}
                pieceSet={currentPieceSet}
                animationSpeed={animationSpeed}
                coordinates={coordinates}
                lastMove={boardLastMove}
                badges={badges}
                arrows={arrows}
                threats={threats}
            targets={targets}
            orangeTargets={orangeTargets}
                interactive={retryMode}
                onMove={handleRetryMove}
              />
            </div>
          </div>

          {/* Bottom Player Row + Material Tally */}
          <PlayerBar
            testId="player-bottom"
            name={me.label(bottomPlayer.username)}
            rating={bottomPlayer.rating}
            avatar={<PlayerAvatar name={bottomPlayer.username} size={40} className="!rounded-none" />}
            captured={
              <>
                {bottomCaptured.map((p, i) => (
                  <span key={`bc-${i}`}>{PIECE_FIGURINES[p]}</span>
                ))}
                {bottomDiff && <span className="ml-1 text-[13px] font-bold">{bottomDiff}</span>}
              </>
            }
            right={
            <button
              type="button"
              onClick={() => setOrientation((o) => (o === 'white' ? 'black' : 'white'))}
              className="h-9 px-3 rounded-lg btn-secondary text-[13px] inline-flex items-center gap-1.5 font-bold flex-shrink-0"
              title="Flip Board (F)"
            >
              <RotateCcw size={14} />
              <span>Flip</span>
            </button>
            }
          />
        </div>
      </div>

      {/* --- RIGHT ZONE: MODE PANEL (460px to 500px, clamp 380-500) --- */}
      <SidebarPanel className="w-full lg:w-[400px] xl:w-[440px] flex-shrink-0 lg:h-[calc(100vh-32px)] z-20" testId="review-panel">
        <SidebarHeader
          title="Game Review"
          icon={<img src="/assets/ui/icon_review.webp" alt="" className="w-9 h-9 object-contain" />}
          left={
            <HeaderIconButton onClick={onBackToSummary} title="Return to Summary" aria-label="Return to Summary">
              <ArrowLeft size={22} />
            </HeaderIconButton>
          }
          right={
            <>
              <HeaderIconButton
                onClick={() => updateSettings({ soundEnabled: !soundEnabled })}
                title={soundEnabled ? 'Mute review sounds' : 'Enable review sounds'}
                aria-label={soundEnabled ? 'Mute review sounds' : 'Enable review sounds'}
              >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </HeaderIconButton>
              <HeaderIconButton onClick={() => navigate('/settings')} title="Settings" aria-label="Settings">
                <SlidersHorizontal size={20} />
              </HeaderIconButton>
            </>
          }
        />
        {/* Panel Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {/* Coach Portrait + Speech Bubble (Unclipped, bubble fills panel width minus 96px portrait + 12px gap) */}
          <CoachSpeech
            expression={coachExpression}
            messages={bubbleMessages}
            voiceEnabled={coachVoiceEnabled}
            size={80}
            className="flex-shrink-0 pt-0.5"
          />

          {/* --- ACTION ROW: 3 EQUAL-WIDTH BUTTONS IN ONE ROW --- */}
          {retryMode ? (
            <div className="grid grid-cols-3 gap-2 w-full pt-1">
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() => setRetryFen(null)}
              >
                Try Again
              </Button>
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                icon={<Sparkles size={14} />}
                onClick={handleShowAnswer}
              >
                Show Answer
              </Button>
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={resetModes}
              >
                Resume
              </Button>
            </div>
          ) : (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-2 w-full">
                {/* In explain or show-best modes: return actions */}
                {explaining ? (
                  <Button
                    variant="secondary"
                    size="md"
                    className="!h-12 flex-1"
                    onClick={resetModes}
                  >
                    Got it!
                  </Button>
                ) : (
                  <>
                    {/* 1. EXPLAIN BUTTON (Shown for Mistake/Blunder and Book; replaced by Retry on Miss; hidden on Best/Excellent) */}
                    {hasExplain && classification !== 'miss' && (
                      <Button
                        variant="secondary"
                        size="md"
                        className="!h-12 flex-1"
                        icon={<HelpCircle size={18} />}
                        onClick={() => {
                          setExplaining(true);
                          setRetryMode(false);
                          setVariationStep(0);
                        }}
                      >
                        Explain
                      </Button>
                    )}

                    {/* SHOW: draws the move that was played as an arrow (same as the Show button on the phone bar) */}
                    <Button
                      variant={showMove ? 'primary' : 'secondary'}
                      aria-pressed={showMove}
                      title="Draw the move that was played as an arrow, on every move until you switch this off"
                      data-testid="desktop-show"
                      size="md"
                      className="!h-12 flex-1"
                      icon={<Eye size={18} />}
                      onClick={() => setShowMove((v) => !v)}
                    >
                      {showMove ? 'Show: on' : 'Show'}
                    </Button>

                    {/* 2. BEST BUTTON (shown whenever the engine has a different, better move; hidden on the best move and book moves) */}
                    {(canBest || bestLock) && (
                      <Button
                        variant={bestLock ? 'primary' : 'secondary'}
                        aria-pressed={bestLock}
                        title="Show the best move on every move until you switch this off"
                        size="md"
                        className="!h-12 flex-1"
                        icon={<Sparkles size={18} />}
                        onClick={() => {
                          setBestLock((v) => !v);
                          setExplaining(false);
                          setRetryMode(false);
                        }}
                      >
                        {bestLock ? 'Best: on' : 'Best'}
                      </Button>
                    )}

                    {/* 3. RETRY BUTTON (Secondary 48px button in the row for mistakes, or replacing Explain on Miss) */}
                    {isMistakeOrBlunder && (
                      <Button
                        variant="secondary"
                        size="md"
                        className="!h-12 flex-1"
                        icon={<RotateCcw size={18} />}
                        onClick={() => {
                          setRetryMode(true);
                          setExplaining(false);
                          setRetrySuccess(null);
                          setRetryFen(null);
                        }}
                      >
                        Retry
                      </Button>
                    )}
                  </>
                )}

                {/* NEXT BUTTON (PRIMARY - Full width if sole button on Best moves) */}
                <Button
                  variant="primary"
                  size="md"
                  className="!h-12 flex-1"
                  icon={<ArrowRight size={18} />}
                  onClick={handleNext}
                  disabled={currentMoveIndex >= game.moves.length - 1}
                >
                  Next
                </Button>
              </div>

              {/* Variation stepper controls if in explain mode (only for tactical refutations, not book) */}
              {explaining && !isBookMove && refutationMoves.length > 0 && (
                <div className="flex items-center justify-between px-3 py-2 bg-theme-raised/50 rounded border border-theme-border/40 text-xs">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVariationStep((s) => Math.max(0, s - 1))}
                    disabled={variationStep <= 0}
                  >
                    Prev
                  </Button>
                  <span className="font-mono font-bold text-theme-muted">
                    Variation Step {variationStep + 1} / {refutationMoves.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVariationStep((s) => Math.min(refutationMoves.length - 1, s + 1))}
                    disabled={variationStep >= refutationMoves.length - 1}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Top 3 Engine Lines (Collapsible) */}
          <div className="border border-theme-border/60 rounded-lg overflow-hidden bg-theme-raised/30">
            <button
              type="button"
              onClick={() => setTopLinesOpen(!topLinesOpen)}
              className="w-full flex items-center justify-between p-2.5 text-xs font-bold text-theme-muted hover:text-theme-text transition-colors select-none"
            >
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-amber-500" />
                <span>Top Engine Alternatives</span>
              </div>
              {topLinesOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>

            {topLinesOpen && (
              <div className="p-2.5 pt-0 space-y-2 border-t border-theme-border/40 text-xs">
                {currentMove?.eval?.lines?.map((line, lIdx) => (
                  <div
                    key={`line-${lIdx}`}
                    className="p-2 rounded bg-theme-card/80 border border-theme-border/40 flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-theme-text">
                        {lIdx + 1}. {line.move}
                      </span>
                      <span className="font-mono font-bold px-1.5 py-0.2 rounded bg-theme-raised text-amber-500">
                        {formatEval(line.eval)}
                      </span>
                    </div>
                    {line.why && <p className="text-xs text-theme-muted">{line.why}</p>}
                  </div>
                )) || (
                  <div className="text-theme-muted text-xs">Calculating lines...</div>
                )}
              </div>
            )}
          </div>

          {/* Move List Card with Opening Name above it */}
          <Card className="p-3">
            {/* Opening name moved to a line above the move list */}
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-theme-border/40">
              <span className="text-xs font-bold text-theme-text truncate" title={game.opening.name}>
                {game.opening.name}
              </span>
              <span className="text-xs font-mono text-theme-muted px-1.5 py-0.5 rounded bg-theme-raised">
                {game.opening.eco}
              </span>
            </div>

            <MoveList
              moves={game.moves}
              currentMoveIndex={currentMoveIndex}
              onSelectMove={(idx) => {
                resetModes();
                setCurrentMoveIndex(idx);
              }}
              activeVariation={activeVariation}
            />
          </Card>
        </div>

        {/* --- MINI EVAL GRAPH (Thin graph at bottom of panel, above transport controls) --- */}
        <div className="px-3 pt-2 pb-1 border-t border-theme-border/60 bg-theme-raised/20 flex-shrink-0">
          <EvalGraph
            moves={game.moves}
            currentMoveIndex={currentMoveIndex}
            onSeek={(idx) => {
              resetModes();
              setCurrentMoveIndex(idx);
            }}
            height={36}
            mini={true}
          />
        </div>

        {/* Transport Controls Bar: Full-width row, equal flex buttons, 48px tall, secondary style */}
        <div className="p-2 border-t border-theme-border/70 flex items-center gap-1.5 bg-theme-card flex-shrink-0 w-full">
          <Button
            size="md"
            variant="secondary"
            className="!h-12 flex-1 !px-0 flex items-center justify-center min-w-0"
            onClick={handleFirst}
            title="First Move (Home)"
            aria-label="First Move"
          >
            <SkipBack size={18} />
          </Button>
          <Button
            size="md"
            variant="secondary"
            className="!h-12 flex-1 !px-0 flex items-center justify-center min-w-0"
            onClick={handlePrev}
            title="Previous Move (Left Arrow)"
            aria-label="Previous Move"
          >
            <ChevronLeft size={20} />
          </Button>
          <Button
            size="md"
            variant="secondary"
            className="!h-12 flex-1 !px-0 flex items-center justify-center min-w-0"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </Button>
          <Button
            size="md"
            variant="secondary"
            className="!h-12 flex-1 !px-0 flex items-center justify-center min-w-0"
            onClick={handleNext}
            title="Next Move (Right Arrow)"
            aria-label="Next Move"
          >
            <ChevronRight size={20} />
          </Button>
          <Button
            size="md"
            variant="secondary"
            className="!h-12 flex-1 !px-0 flex items-center justify-center min-w-0"
            onClick={handleLast}
            title="Last Move (End)"
            aria-label="Last Move"
          >
            <SkipForward size={18} />
          </Button>
        </div>
      </SidebarPanel>
    </div>
  );
};
