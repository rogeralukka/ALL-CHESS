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
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    if (isBookMove) {
      coachText = `Opening: ${game.opening || 'Book Opening'}. Main Idea: Control key central squares, develop minor pieces toward the center, and prepare king safety through early castling.`;
    } else {
      coachText = `Step ${variationStep + 1} of ${refutationMoves.length}: ${
        refutationMoves[variationStep] ? `Refutation continues with ${refutationMoves[variationStep]}.` : 'End of critical refutation line.'
      }`;
    }
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
    if (currentMove?.san && currentMove?.classification) {
      const prefixRegex = new RegExp(`^${currentMove.san}\\s+(is\\s+(a\\s+)?${currentMove.classification}[.:!\\s]*)+`, 'i');
      coachText = coachText.replace(prefixRegex, '').trim();
      if (coachText.length > 0) {
        coachText = coachText[0].toUpperCase() + coachText.slice(1);
      }
    }
  }

  // Cap body text at 90 characters (two lines)
  if (coachText.length > 90) {
    const trimmed = coachText.slice(0, 87);
    const lastSpace = trimmed.lastIndexOf(' ');
    coachText = (lastSpace > 50 ? trimmed.slice(0, lastSpace) : trimmed) + '...';
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

  const topPlayer = orientation === 'white' ? game.black : game.white;
  const bottomPlayer = orientation === 'white' ? game.white : game.black;
  const topCaptured = orientation === 'white' ? materialState.blackCaptured : materialState.whiteCaptured;
  const topDiff = orientation === 'white' ? materialState.blackDiff : materialState.whiteDiff;
  const bottomCaptured = orientation === 'white' ? materialState.whiteCaptured : materialState.blackCaptured;
  const bottomDiff = orientation === 'white' ? materialState.whiteDiff : materialState.blackDiff;

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full w-full overflow-y-auto lg:overflow-hidden lg:items-center lg:justify-center lg:gap-6 lg:px-6 lg:py-4 pb-20 lg:pb-4">
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
      <div className="w-full lg:w-[400px] xl:w-[440px] flex-shrink-0 flex flex-col lg:h-[calc(100vh-32px)] panel !rounded-none lg:!rounded-[14px] z-20 min-h-0">
        {/* Panel Header: 48px bar, title centred with icon, back on left, sound & settings on right. Drop ply counter. */}
        <div className="h-14 min-h-[56px] px-4 border-b border-theme-border/60 flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={onBackToSummary}
            className="p-2 -ml-2 rounded-lg text-theme-muted hover:text-theme-text transition-colors inline-flex items-center gap-1 text-xs font-semibold"
            title="Return to Summary"
            aria-label="Return to Summary"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Summary</span>
          </button>

          <div className="flex items-center gap-2 font-display font-extrabold text-xl text-theme-text">
            <img src="/assets/ui/icon_review.webp" alt="" className="w-7 h-7 object-contain" />
            <span>Game Review</span>
          </div>

          <div className="flex items-center gap-1">
            {/* Sound toggle button */}
            <button
              type="button"
              onClick={() => updateSettings({ soundEnabled: !soundEnabled })}
              className="text-theme-muted hover:text-theme-text transition-colors p-2 rounded-lg min-w-[36px] min-h-[36px] flex items-center justify-center"
              title={soundEnabled ? 'Mute review sounds' : 'Enable review sounds'}
              aria-label={soundEnabled ? 'Mute review sounds' : 'Enable review sounds'}
            >
              {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
            </button>
            {/* Quick settings link */}
            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="text-theme-muted hover:text-theme-text transition-colors p-2 rounded-lg min-w-[36px] min-h-[36px] flex items-center justify-center"
              title="Settings"
              aria-label="Settings"
            >
              <SlidersHorizontal size={17} />
            </button>
          </div>
        </div>

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
                ) : showingBest ? (
                  <Button
                    variant="secondary"
                    size="md"
                    className="!h-12 flex-1"
                    onClick={resetModes}
                  >
                    Resume
                  </Button>
                ) : (
                  <>
                    {/* 1. EXPLAIN BUTTON (Shown for Mistake/Blunder and Book; replaced by Retry on Miss; hidden on Best/Excellent) */}
                    {(isMistakeOrBlunder || isBookMove) && classification !== 'miss' && (
                      <Button
                        variant="secondary"
                        size="md"
                        className="!h-12 flex-1"
                        icon={<HelpCircle size={18} />}
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

                    {/* 2. BEST BUTTON (Shown for Mistake/Blunder/Inaccuracy/Miss; hidden on Best/Excellent/Book) */}
                    {isMistakeOrBlunder && !isBestMove && !isBookMove && (
                      <Button
                        variant="secondary"
                        size="md"
                        className="!h-12 flex-1"
                        icon={<Sparkles size={18} />}
                        onClick={() => {
                          setShowingBest(true);
                          setExplaining(false);
                          setRetryMode(false);
                        }}
                      >
                        Best
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
                          setShowingBest(false);
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
                    <p className="text-xs text-theme-muted">{line.why}</p>
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
      </div>
    </div>
  );
};
