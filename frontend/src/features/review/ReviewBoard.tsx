import React, { useState, useEffect, useCallback } from 'react';
import { Game, Move, CoachExpression } from '@/data/types';
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
} from 'lucide-react';

interface ReviewBoardProps {
  game: Game;
  onBackToSummary: () => void;
}

export const ReviewBoard: React.FC<ReviewBoardProps> = ({ game, onBackToSummary }) => {
  const { boardThemeId, pieceSetId, animationSpeed, coordinates, coachVoiceEnabled } = useSettingsStore();
  const currentBoardTheme = BOARD_THEMES.find((t) => t.id === boardThemeId) || BOARD_THEMES[0];
  const currentPieceSet = PIECE_SETS.find((p) => p.id === pieceSetId) || PIECE_SETS[0];

  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');
  const [showingBest, setShowingBest] = useState<boolean>(false);
  const [explaining, setExplaining] = useState<boolean>(false);
  const [retryMode, setRetryMode] = useState<boolean>(false);
  const [retrySuccess, setRetrySuccess] = useState<boolean | null>(null);
  const [topLinesOpen, setTopLinesOpen] = useState<boolean>(false);

  const currentMove: Move | undefined = game.moves[currentMoveIndex];

  // Derive board position: if showingBest, or normal move
  const displayFen = currentMove?.fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  // Navigation handlers
  const handleNext = useCallback(() => {
    setShowingBest(false);
    setExplaining(false);
    setRetryMode(false);
    setRetrySuccess(null);
    setCurrentMoveIndex((prev) => Math.min(game.moves.length - 1, prev + 1));
  }, [game.moves.length]);

  const handlePrev = useCallback(() => {
    setShowingBest(false);
    setExplaining(false);
    setRetryMode(false);
    setRetrySuccess(null);
    setCurrentMoveIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleFirst = useCallback(() => {
    setCurrentMoveIndex(0);
  }, []);

  const handleLast = useCallback(() => {
    setCurrentMoveIndex(game.moves.length - 1);
  }, [game.moves.length]);

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

  // Coach expression & dialogue derivation
  const classification = currentMove?.classification || 'book';
  let coachExpression: CoachExpression = getExpressionForEvent(classification);
  let coachText = currentMove?.coachComment || currentMove?.eval?.why || 'Solid positional continuation.';

  if (showingBest) {
    coachExpression = 'thumbsup';
    coachText = `Here is the engine's highest-rated alternative. It preserves tactical harmony and center control.`;
  } else if (explaining) {
    coachExpression = 'thinking';
    coachText = `Analyzing tactical ramifications: by forcing king movement or exploiting the loose minor piece, advantage shifts.`;
  } else if (retryMode) {
    coachExpression = 'thinking';
    coachText = retrySuccess
      ? `Brilliant! You found the superior engine move! That was the tactical shot missed in the game.`
      : retrySuccess === false
      ? `Not quite the strongest continuation. Look for checks, captures, or undefended squares.`
      : `Can you find a better move in this position? Look closely at the board!`;
  }

  const bubbleMessages: BubbleMessage[] = [
    {
      id: `move-${currentMoveIndex}-${showingBest ? 'best' : explaining ? 'exp' : 'norm'}`,
      text: coachText,
      classification: showingBest ? 'best' : classification,
      moveSan: currentMove ? `${currentMove.moveNumber}. ${currentMove.san}` : undefined,
      evalText: formatEval(currentMove?.eval?.eval),
      evalScore: currentMove?.eval?.eval,
    },
  ];

  // Button rule logic from Section 8
  const isBestMove = classification === 'best';
  const isMistakeOrBlunder = ['inaccuracy', 'mistake', 'miss', 'blunder'].includes(classification);

  // Active variation to show in MoveList
  const activeVariation = explaining || showingBest
    ? {
        parentMoveIndex: currentMoveIndex,
        title: showingBest ? 'Best Line Variation' : 'Refutation Line',
        moves: currentMove?.eval?.lines?.[0]?.pv || ['Nf3', 'Nc6', 'Bc4'],
      }
    : null;

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full w-full overflow-hidden">
      {/* --- CENTER ZONE: CHESS BOARD & EVAL BAR --- */}
      <div className="flex-1 flex flex-col items-center justify-center p-3 md:p-6 bg-theme-page min-w-0">
        <div className="w-full max-w-[min(88vh,680px)] flex flex-col gap-2">
          {/* Top Player Row */}
          <div className="flex items-center justify-between text-xs px-2 py-1 text-theme-muted">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-700 text-white font-bold flex items-center justify-center text-[10px]">
                B
              </span>
              <span className="font-bold text-theme-text">{game.black.username}</span>
              <span className="font-mono">({game.black.rating})</span>
            </div>
            <span className="font-mono font-semibold">{game.speed} • {game.timeControl}</span>
          </div>

          {/* Board + Eval Bar Container */}
          <div className="flex items-center justify-center gap-2.5 w-full">
            <EvalBar
              evalScore={currentMove?.eval?.eval}
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
                lastMove={
                  currentMove
                    ? {
                        from: currentMove.from,
                        to: currentMove.to,
                        classification: currentMove.classification,
                      }
                    : null
                }
                badges={
                  currentMove?.classification
                    ? [{ square: currentMove.to, label: currentMove.classification }]
                    : []
                }
                interactive={retryMode}
                onMove={(_from, _to) => {
                  if (retryMode) {
                    setRetrySuccess(true);
                  }
                }}
              />
            </div>
          </div>

          {/* Bottom Player Row */}
          <div className="flex items-center justify-between text-xs px-2 py-1 text-theme-muted">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white border border-neutral-300 text-black font-bold flex items-center justify-center text-[10px]">
                W
              </span>
              <span className="font-bold text-theme-text">{game.white.username}</span>
              <span className="font-mono">({game.white.rating})</span>
            </div>
            <button
              type="button"
              onClick={() => setOrientation((o) => (o === 'white' ? 'black' : 'white'))}
              className="hover:text-theme-text transition-colors flex items-center gap-1 font-semibold"
              title="Flip Board (F)"
            >
              <RotateCcw size={13} />
              <span>Flip</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- RIGHT ZONE: MODE PANEL (FIXED SKELETON ~420px) --- */}
      <div className="w-full lg:w-[420px] flex-shrink-0 flex flex-col h-full bg-theme-card border-t lg:border-t-0 lg:border-l border-theme-border shadow-xl z-20">
        {/* Panel Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-theme-border/60">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={onBackToSummary}>
              Highlights
            </Button>
            <span className="text-xs text-theme-muted font-bold">|</span>
            <span className="text-xs font-bold text-theme-text truncate max-w-[180px]">
              {game.opening.name}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-theme-muted font-mono font-bold">
            Move {currentMoveIndex + 1} / {game.moves.length}
          </div>
        </div>

        {/* Panel Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Coach Portrait + Speech Bubble */}
          <div className="flex items-start gap-3">
            <CoachAvatar expression={coachExpression} mode="bust" size={68} />
            <div className="flex-1 min-w-0">
              <CoachBubble
                messages={bubbleMessages}
                voiceEnabled={coachVoiceEnabled}
              />
            </div>
          </div>

          {/* Mini Eval Graph with Key Moves */}
          <div className="bg-theme-raised/40 p-2.5 rounded-lg border border-theme-border/60">
            <EvalGraph
              moves={game.moves}
              currentMoveIndex={currentMoveIndex}
              onSeek={setCurrentMoveIndex}
              height={65}
              mini={true}
            />
          </div>

          {/* Action Row: Explain / Best / Next or Retry */}
          <div className="flex flex-wrap gap-2 pt-1">
            {isMistakeOrBlunder && !retryMode && (
              <Button
                variant="secondary"
                size="sm"
                icon={<HelpCircle size={15} />}
                onClick={() => setRetryMode(true)}
              >
                Retry Mistake
              </Button>
            )}

            {!isBestMove && !showingBest && (
              <Button
                variant="secondary"
                size="sm"
                icon={<Sparkles size={15} />}
                onClick={() => {
                  setShowingBest(true);
                  setExplaining(false);
                }}
              >
                Show Best
              </Button>
            )}

            {showingBest && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowingBest(false)}
              >
                Resume Game
              </Button>
            )}

            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setExplaining(!explaining);
                setShowingBest(false);
              }}
            >
              {explaining ? 'Got it!' : 'Explain Move'}
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={<ArrowRight size={15} />}
              onClick={handleNext}
              disabled={currentMoveIndex >= game.moves.length - 1}
            >
              Next Move
            </Button>
          </div>

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

          {/* Move List */}
          <Card className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-theme-muted">Move Notation</span>
              <span className="text-[11px] text-theme-muted">Figurine Notation</span>
            </div>
            <MoveList
              moves={game.moves}
              currentMoveIndex={currentMoveIndex}
              onSelectMove={setCurrentMoveIndex}
              activeVariation={activeVariation}
            />
          </Card>
        </div>

        {/* Transport Controls Bar */}
        <div className="p-3 border-t border-theme-border/70 flex items-center justify-center gap-2 bg-theme-card">
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
