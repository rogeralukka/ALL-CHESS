import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import { Game, Move, CoachExpression, Arrow, BoardBadge, MoveClassification } from '@/data/types';
import { Board } from '@/features/board/Board';
import { EvalBar } from '@/features/board/EvalBar';
import { EvalGraph } from '@/features/board/EvalGraph';
import { MoveList } from '@/features/board/MoveList';
import { CoachAvatar } from '@/features/coach/CoachAvatar';
import { CoachBubble, BubbleMessage } from '@/features/coach/CoachBubble';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useSettingsStore } from '@/data/settingsStore';
import { BOARD_THEMES, PIECE_SETS } from '@/data/boardThemes';
import { getExpressionForEvent } from '@/features/coach/expressionMap';
import { formatEval } from '@/lib/formatters';
import { sound } from '@/lib/sound';
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
} from 'lucide-react';

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

  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');

  // Mode states
  const [showingBest, setShowingBest] = useState<boolean>(false);
  const [explaining, setExplaining] = useState<boolean>(false);
  const [variationStep, setVariationStep] = useState<number>(0);
  const [retryMode, setRetryMode] = useState<boolean>(false);
  const [retrySuccess, setRetrySuccess] = useState<boolean | null>(null);
  const [retryFen, setRetryFen] = useState<string | null>(null);
  const [topLinesOpen, setTopLinesOpen] = useState<boolean>(false);

  const currentMove: Move | undefined = game.moves[currentMoveIndex];

  // Position BEFORE current move
  const fenBeforeMove = useMemo(() => {
    if (currentMoveIndex === 0) return START_FEN;
    return game.moves[currentMoveIndex - 1]?.fen || START_FEN;
  }, [game.moves, currentMoveIndex]);

  // Refutation moves for explain
  const refutationMoves = useMemo(() => {
    return currentMove?.variation || currentMove?.eval?.lines?.[0]?.pv || [];
  }, [currentMove]);

  // Reset secondary modes when navigating moves
  const resetModes = useCallback(() => {
    setShowingBest(false);
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
  const isBestMove = classification === 'best';
  const isBookMove = classification === 'book';
  const isMistakeOrBlunder = ['inaccuracy', 'mistake', 'miss', 'blunder'].includes(classification);
  const targetBestMove = currentMove?.eval?.bestMove || currentMove?.eval?.lines?.[0]?.move || '';

  // Determine active board FEN, arrows, badges, and lastMove (memoized)
  const { displayFen, arrows, badges, boardLastMove } = useMemo(() => {
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

    // 1. SHOW BEST MODE
    if (showingBest) {
      bdgs = [];
      lastM = null;
      if (targetBestMove) {
        try {
          const c = new Chess(fenBeforeMove);
          c.move(targetBestMove);
          fen = c.fen();
          const sqs = getMoveSquares(fenBeforeMove, targetBestMove);
          if (sqs) {
            arrs = [{ from: sqs.from, to: sqs.to, color: 'green' }];
          }
        } catch {
          fen = fenBeforeMove;
        }
      }
    }
    // 2. EXPLAIN VARIATION STEPPER MODE
    else if (explaining) {
      bdgs = [];
      lastM = null;
      try {
        const c = new Chess(currentMove?.fen || START_FEN);
        for (let s = 0; s < variationStep; s++) {
          c.move(refutationMoves[s]);
        }
        fen = c.fen();

        if (variationStep < refutationMoves.length) {
          const nextSq = getMoveSquares(fen, refutationMoves[variationStep]);
          if (nextSq) {
            arrs = [{ from: nextSq.from, to: nextSq.to, color: 'red' }];
          }
        }
      } catch {
        fen = currentMove?.fen || START_FEN;
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
      // Red refutation arrow on mistakes/blunders pointing out opponent's tactical strike
      if (isMistakeOrBlunder && currentMove?.variation?.[0]) {
        const refutSq = getMoveSquares(currentMove.fen, currentMove.variation[0]);
        if (refutSq) {
          arrs = [{ from: refutSq.from, to: refutSq.to, color: 'red' }];
        }
      }
    }

    return {
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
    isMistakeOrBlunder,
  ]);

  // Compute Material Difference and Captured Pieces
  const materialState = useMemo(() => getMaterialState(displayFen), [displayFen]);

  // --- COACH EXPRESSION & DIALOGUE ---
  let coachExpression: CoachExpression = getExpressionForEvent(classification);
  let coachText = currentMove?.coachComment || currentMove?.eval?.why || 'Solid positional continuation.';
  let bubbleClassification = classification;
  let bubbleMoveSan = currentMove?.san;
  let bubbleEvalText = formatEval(currentMove?.eval?.eval);
  const bubbleEvalScore = currentMove?.eval?.eval;

  if (showingBest) {
    coachExpression = 'thumbsup';
    bubbleClassification = 'best';
    bubbleMoveSan = targetBestMove;
    bubbleEvalText = formatEval(currentMove?.eval?.lines?.[0]?.eval ?? currentMove?.eval?.eval);
    coachText = `${targetBestMove} was best. ${currentMove?.eval?.lines?.[0]?.why || 'It maintains tactical harmony and central control.'}`;
  } else if (explaining) {
    coachExpression = 'thinking';
    coachText = `Step ${variationStep + 1} of ${refutationMoves.length}: ${
      refutationMoves[variationStep] ? `Refutation continues with ${refutationMoves[variationStep]}.` : 'End of critical refutation line.'
    }`;
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
        title: showingBest ? 'Best Line Variation' : 'Refutation Line',
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

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full w-full overflow-hidden">
      {/* --- CENTER ZONE: CHESS BOARD & EVAL BAR (Sticky at top on mobile) --- */}
      <div className="sticky top-0 z-20 w-full flex flex-col items-center justify-center p-2 sm:p-3 md:p-6 bg-theme-page border-b lg:border-b-0 border-theme-border/60 flex-shrink-0 lg:flex-1 min-w-0">
        <div className="w-full max-w-[min(88vh,680px)] flex flex-col gap-2">
          {/* Top Player Row (Black) + Material Tally */}
          <div className="flex items-center justify-between text-xs px-2 py-1 text-theme-muted">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-700 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                B
              </span>
              <span className="font-bold text-theme-text truncate">{game.black.username}</span>
              <span className="font-mono">({game.black.rating})</span>

              {/* Material Difference & Captured Pieces for Black */}
              <div className="flex items-center gap-1 ml-1">
                {materialState.blackDiff && (
                  <span className="font-mono font-bold text-[11px] bg-theme-raised px-1 py-0.2 rounded text-amber-500 border border-theme-border/60">
                    {materialState.blackDiff}
                  </span>
                )}
                {materialState.blackCaptured.length > 0 && (
                  <span className="text-[11px] opacity-80 tracking-tighter" title="Captured by Black">
                    {materialState.blackCaptured.map((p, i) => (
                      <span key={`bc-${i}`} className="text-white drop-shadow-sm">
                        {PIECE_FIGURINES[p]}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            </div>

            <span className="font-mono font-semibold flex-shrink-0">{game.speed} • {game.timeControl}</span>
          </div>

          {/* Board + Eval Bar Container */}
          <div className="flex items-center justify-center gap-2.5 w-full">
            <EvalBar
              evalScore={showingBest ? currentMove?.eval?.lines?.[0]?.eval ?? currentMove?.eval?.eval : currentMove?.eval?.eval}
              orientation={orientation}
              height="100%"
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
                interactive={retryMode}
                onMove={handleRetryMove}
              />
            </div>
          </div>

          {/* Bottom Player Row (White) + Material Tally */}
          <div className="flex items-center justify-between text-xs px-2 py-1 text-theme-muted">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-5 h-5 rounded-full bg-white border border-neutral-300 text-black font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                W
              </span>
              <span className="font-bold text-theme-text truncate">{game.white.username}</span>
              <span className="font-mono">({game.white.rating})</span>

              {/* Material Difference & Captured Pieces for White */}
              <div className="flex items-center gap-1 ml-1">
                {materialState.whiteDiff && (
                  <span className="font-mono font-bold text-[11px] bg-theme-raised px-1 py-0.2 rounded text-amber-500 border border-theme-border/60">
                    {materialState.whiteDiff}
                  </span>
                )}
                {materialState.whiteCaptured.length > 0 && (
                  <span className="text-[11px] opacity-80 tracking-tighter" title="Captured by White">
                    {materialState.whiteCaptured.map((p, i) => (
                      <span key={`wc-${i}`} className="text-neutral-900 dark:text-neutral-400">
                        {PIECE_FIGURINES[p]}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOrientation((o) => (o === 'white' ? 'black' : 'white'))}
              className="hover:text-theme-text transition-colors flex items-center gap-1 font-semibold flex-shrink-0"
              title="Flip Board (F)"
            >
              <RotateCcw size={13} />
              <span>Flip</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- RIGHT ZONE: MODE PANEL (FIXED SKELETON ~420px) --- */}
      <div className="w-full lg:w-[420px] flex-shrink-0 flex flex-col h-full bg-theme-card border-t lg:border-t-0 lg:border-l border-theme-border shadow-xl z-20 min-h-0">
        {/* Panel Header: Back arrow, "Game Review", sound toggle, move count */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-theme-border/60 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBackToSummary}
              className="inline-flex items-center gap-1 text-xs font-semibold text-theme-muted hover:text-theme-text transition-colors"
              title="Return to Summary"
            >
              <ArrowLeft size={16} />
              <span>Summary</span>
            </button>
            <span className="text-xs text-theme-muted font-bold">|</span>
            <span className="text-xs font-bold font-display text-theme-text">
              Game Review
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Sound toggle button */}
            <button
              type="button"
              onClick={() => updateSettings({ soundEnabled: !soundEnabled })}
              className="text-theme-muted hover:text-theme-text transition-colors p-1 rounded"
              title={soundEnabled ? 'Mute review sounds' : 'Enable review sounds'}
              aria-label={soundEnabled ? 'Mute review sounds' : 'Enable review sounds'}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            <div className="text-xs text-theme-muted font-mono font-bold">
              {currentMoveIndex + 1} / {game.moves.length}
            </div>
          </div>
        </div>

        {/* Panel Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {/* Coach Portrait + Speech Bubble (Unclipped) */}
          <div className="flex items-start gap-3 flex-shrink-0 pt-0.5">
            <CoachAvatar expression={coachExpression} mode="bust" size={68} />
            <div className="flex-1 min-w-0">
              <CoachBubble
                messages={bubbleMessages}
                voiceEnabled={coachVoiceEnabled}
              />
            </div>
          </div>

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
              <div className="grid grid-cols-3 gap-2 w-full">
                {/* 1. EXPLAIN BUTTON */}
                {explaining ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    onClick={resetModes}
                  >
                    Got it!
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    icon={<HelpCircle size={15} />}
                    onClick={() => {
                      setExplaining(true);
                      setShowingBest(false);
                      setRetryMode(false);
                      setVariationStep(0);
                    }}
                  >
                    Explain
                  </Button>
                )}

                {/* 2. BEST BUTTON */}
                {showingBest ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    onClick={resetModes}
                  >
                    Resume
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    icon={<Sparkles size={15} />}
                    onClick={() => {
                      setShowingBest(true);
                      setExplaining(false);
                      setRetryMode(false);
                    }}
                    disabled={isBestMove || isBookMove}
                  >
                    Best
                  </Button>
                )}

                {/* 3. NEXT BUTTON (PRIMARY) */}
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  icon={<ArrowRight size={15} />}
                  onClick={handleNext}
                  disabled={currentMoveIndex >= game.moves.length - 1}
                >
                  Next
                </Button>
              </div>

              {/* Variation stepper controls if in explain mode */}
              {explaining && refutationMoves.length > 0 && (
                <div className="flex items-center justify-between px-2 py-1 bg-theme-raised/50 rounded border border-theme-border/40 text-xs">
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

              {/* Retry Mistake Link/Prompt if Mistake/Blunder */}
              {isMistakeOrBlunder && !showingBest && !explaining && (
                <div className="text-center pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setRetryMode(true);
                      setShowingBest(false);
                      setExplaining(false);
                      setRetrySuccess(null);
                      setRetryFen(null);
                    }}
                    className="text-xs text-amber-500 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <RotateCcw size={12} />
                    <span>Retry this position yourself</span>
                  </button>
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
                    <p className="text-[11px] text-theme-muted">{line.why}</p>
                  </div>
                )) || (
                  <div className="text-theme-muted text-[11px]">Calculating lines...</div>
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
              <span className="text-[10px] font-mono text-theme-muted px-1.5 py-0.5 rounded bg-theme-raised">
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

        {/* Transport Controls Bar */}
        <div className="p-2.5 border-t border-theme-border/70 flex items-center justify-center gap-2 bg-theme-card flex-shrink-0">
          <Button size="sm" variant="ghost" onClick={handleFirst} title="First Move (Home)">
            <SkipBack size={16} />
          </Button>
          <Button size="sm" variant="ghost" onClick={handlePrev} title="Previous Move (Left Arrow)">
            <ChevronLeft size={18} />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsPlaying(!isPlaying)}
            title="Play / Pause (Space)"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </Button>
          <Button size="sm" variant="ghost" onClick={handleNext} title="Next Move (Right Arrow)">
            <ChevronRight size={18} />
          </Button>
          <Button size="sm" variant="ghost" onClick={handleLast} title="Last Move (End)">
            <SkipForward size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
