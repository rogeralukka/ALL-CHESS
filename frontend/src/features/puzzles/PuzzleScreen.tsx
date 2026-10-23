import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chess } from 'chess.js';
import { Board } from '@/features/board/Board';
import { CoachAvatar } from '@/features/coach/CoachAvatar';
import { CoachBubble, BubbleMessage } from '@/features/coach/CoachBubble';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { RewardCascade } from './RewardCascade';
import { useSettingsStore } from '@/data/settingsStore';
import { BOARD_THEMES, PIECE_SETS } from '@/data/boardThemes';
import { storage } from '@/lib/storage';
import { formatTime } from '@/lib/formatters';
import { MOCK_PUZZLES } from '@/data/mock/mockPuzzles';
import { BoardBadge, CoachExpression } from '@/data/types';
import { sound } from '@/lib/sound';
import { Flame, Lightbulb, RotateCcw, Sparkles, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';

function animateCountUp(start: number, end: number, duration: number, callback: (v: number) => void) {
  const startTime = performance.now();
  const step = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.round(start + (end - start) * progress);
    callback(current);
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };
  requestAnimationFrame(step);
}

function getSquareCenterStyle(sq: string, orientation: 'white' | 'black') {
  const file = sq.charCodeAt(0) - 97;
  const rank = parseInt(sq[1], 10) - 1;
  const col = orientation === 'white' ? file : 7 - file;
  const row = orientation === 'white' ? 7 - rank : rank;
  return {
    left: `${(col + 0.5) * 12.5}%`,
    top: `${(row + 0.5) * 12.5}%`,
    transform: 'translate(-50%, -50%)',
  };
}

export const PuzzleScreen: React.FC = () => {
  const { boardThemeId, pieceSetId, animationSpeed } = useSettingsStore();
  const currentBoardTheme = BOARD_THEMES.find((t) => t.id === boardThemeId) || BOARD_THEMES[0];
  const currentPieceSet = PIECE_SETS.find((p) => p.id === pieceSetId) || PIECE_SETS[0];

  const [puzzleIndex, setPuzzleIndex] = useState<number>(0);
  const currentPuzzle = MOCK_PUZZLES[puzzleIndex] || MOCK_PUZZLES[0];

  const [chess] = useState(() => new Chess(currentPuzzle.fen));
  const [fen, setFen] = useState<string>(currentPuzzle.fen);
  const [solutionStep, setSolutionStep] = useState<number>(0);
  const [status, setStatus] = useState<'solving' | 'solved' | 'failed'>('solving');
  const [lastSolvedSquare, setLastSolvedSquare] = useState<string | null>(null);
  const [floatingChip, setFloatingChip] = useState<number | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [showRewardCascade, setShowRewardCascade] = useState<boolean>(false);
  const [showLevelMap, setShowLevelMap] = useState<boolean>(false);
  const [avatarHopIndex, setAvatarHopIndex] = useState<number>(0);

  const [puzzleRating, setPuzzleRating] = useState<number>(() =>
    storage.get('all_chess_puzzle_rating', 1200)
  );
  const [displayedRating, setDisplayedRating] = useState<number>(puzzleRating);
  const [progressValue, setProgressValue] = useState<number>(0);

  const [coachExp, setCoachExp] = useState<CoachExpression>('thinking');
  const [bubbleText, setBubbleText] = useState<string>(currentPuzzle.goal);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    chess.load(currentPuzzle.fen);
    setFen(currentPuzzle.fen);
    setSolutionStep(0);
    setStatus('solving');
    setLastSolvedSquare(null);
    setFloatingChip(null);
    setShowLevelMap(false);
    setTimerSeconds(0);
    setShowRewardCascade(false);
    setProgressValue(puzzleIndex);
    setAvatarHopIndex(puzzleIndex % 5);
    setCoachExp('thinking');
    setBubbleText(currentPuzzle.goal);
  }, [currentPuzzle, chess, puzzleIndex]);

  useEffect(() => {
    if (status === 'solving') {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  const handleMove = (_from: string, _to: string, promotion?: string) => {
    if (status !== 'solving') return false;

    try {
      const legalMoves = chess.moves({ verbose: true });
      const expectedMoveSan = currentPuzzle.solution[solutionStep];

      const matchingMove = legalMoves.find(
        (m) =>
          m.from === _from &&
          m.to === _to &&
          (!promotion || m.promotion === promotion)
      );

      if (!matchingMove) return false;

      if (matchingMove.san === expectedMoveSan || currentPuzzle.solution.length === 1) {
        chess.move(matchingMove);
        setFen(chess.fen());

        const nextStep = solutionStep + 1;
        if (nextStep >= currentPuzzle.solution.length) {
          // --- BEAT 1 (0ms): Immediate solve state ---
          setLastSolvedSquare(_to);
          setFloatingChip(15);
          setStatus('solved');
          setCoachExp('brilliant');
          setBubbleText('Solved! Brilliant tactical foresight.');
          sound.puzzleCorrect();

          const targetRating = puzzleRating + 15;
          setPuzzleRating(targetRating);
          storage.set('all_chess_puzzle_rating', targetRating);
          animateCountUp(displayedRating, targetRating, 400, setDisplayedRating);
          setProgressValue(puzzleIndex + 1);

          setTimeout(() => {
            setFloatingChip(null);
          }, 900);

          // --- BEAT 2 (1000ms): Cross-fade to level map ---
          setTimeout(() => {
            setShowLevelMap(true);
            setAvatarHopIndex((puzzleIndex + 1) % 5);
          }, 1000);

          // Only when a level completes (every 5 puzzles)
          if ((puzzleIndex + 1) % 5 === 0) {
            setTimeout(() => {
              setShowRewardCascade(true);
            }, 1800);
          }
        } else {
          setSolutionStep(nextStep);
          setTimeout(() => {
            const oppMove = currentPuzzle.solution[nextStep];
            chess.move(oppMove);
            setFen(chess.fen());
            setSolutionStep(nextStep + 1);
            sound.move();
          }, 400);
        }
        return true;
      } else {
        setStatus('failed');
        setCoachExp('embarrassed');
        setBubbleText("That move leaves tactical counterplay. Let's retry and find the cleaner strike.");
        sound.puzzleWrong();
        return false;
      }
    } catch {
      return false;
    }
  };

  const handleRetry = () => {
    chess.load(currentPuzzle.fen);
    setFen(currentPuzzle.fen);
    setStatus('solving');
    setLastSolvedSquare(null);
    setFloatingChip(null);
    setShowLevelMap(false);
    setSolutionStep(0);
    setCoachExp('thinking');
    setBubbleText(currentPuzzle.goal);
  };

  const handleNext = () => {
    setShowLevelMap(false);
    setShowRewardCascade(false);
    setLastSolvedSquare(null);
    setFloatingChip(null);
    setPuzzleIndex((prev) => (prev + 1) % MOCK_PUZZLES.length);
  };

  const handlePrev = () => {
    setShowLevelMap(false);
    setShowRewardCascade(false);
    setLastSolvedSquare(null);
    setFloatingChip(null);
    setPuzzleIndex((prev) => (prev - 1 + MOCK_PUZZLES.length) % MOCK_PUZZLES.length);
  };

  const isWhiteToMove = currentPuzzle.fen.split(' ')[1] === 'w';

  const bubbleMessages: BubbleMessage[] = useMemo(
    () => [
      {
        id: `puzzle-${puzzleIndex}-${status}-${bubbleText.slice(0, 10)}`,
        text: bubbleText,
        classification: status === 'solved' ? 'best' : status === 'failed' ? 'mistake' : undefined,
        moveSan: status === 'solved' ? 'Solved' : undefined,
        evalText: isWhiteToMove ? '+2.4' : '-2.4',
        evalScore: isWhiteToMove ? 2.4 : -2.4,
      },
    ],
    [puzzleIndex, status, bubbleText, isWhiteToMove]
  );

  const puzzleBadges: BoardBadge[] = useMemo(
    () =>
      status === 'solved' && lastSolvedSquare
        ? [{ square: lastSolvedSquare, label: 'best' }]
        : [],
    [status, lastSolvedSquare]
  );

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-theme-bg select-none">
      {/* Left/Main Zone: Board + Top Status Bar */}
      <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
        <div className="w-full max-w-[min(calc(100vh-120px),800px)] flex flex-col items-center">
          {/* Header Row: Single User Rating + Muted Puzzle Rating */}
          <div className="w-full flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold font-display text-theme-text text-base">
                Rating {displayedRating}
              </span>
              <span className="text-xs text-theme-muted font-mono">
                Puzzle {currentPuzzle.rating}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-theme-muted">{formatTime(timerSeconds)}</span>
              <span className="px-2 py-0.5 rounded-full bg-theme-raised font-mono font-bold text-amber-500 border border-theme-border text-xs">
                Level {Math.floor(puzzleIndex / 5) + 1}
              </span>
            </div>
          </div>

          {/* Board Container */}
          <div className="aspect-square w-full relative">
            <Board
              fen={fen}
              orientation={isWhiteToMove ? 'white' : 'black'}
              boardTheme={currentBoardTheme}
              pieceSet={currentPieceSet}
              animationSpeed={animationSpeed}
              interactive={status === 'solving'}
              badges={puzzleBadges}
              onMove={handleMove}
            />

            {/* Floating Points Chip Over Destination Square (+15) */}
            {floatingChip && lastSolvedSquare && (
              <motion.div
                initial={{ opacity: 1, y: 0, scale: 0.9 }}
                animate={{ opacity: 0, y: -16, scale: 1.15 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="absolute z-40 px-2 py-0.5 rounded bg-emerald-500 text-black font-extrabold text-sm shadow-xl pointer-events-none"
                style={getSquareCenterStyle(lastSolvedSquare, isWhiteToMove ? 'white' : 'black')}
              >
                +{floatingChip}
              </motion.div>
            )}

            {/* Reward Cascade Celebration Overlay (Only on level completion) */}
            <RewardCascade
              isOpen={showRewardCascade}
              levelNumber={Math.floor(puzzleIndex / 5) + 1}
              pointsEarned={15}
              onNextPuzzle={handleNext}
            />
          </div>

          {/* Bottom Bar: Prev/Next & Themes */}
          <div className="flex items-center justify-between text-xs px-2 py-1 text-theme-muted w-full">
            <span className="capitalize">{currentPuzzle.theme.join(' • ')}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrev}
                className="hover:text-theme-text transition-colors p-2 rounded hover:bg-theme-raised min-w-[44px] min-h-[44px] flex items-center justify-center"
                title="Previous puzzle"
                aria-label="Previous puzzle"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="hover:text-theme-text transition-colors p-2 rounded hover:bg-theme-raised min-w-[44px] min-h-[44px] flex items-center justify-center"
                title="Next puzzle"
                aria-label="Next puzzle"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Zone: Mode Panel (460px to 500px, clamp 380-500) */}
      <div className="w-full lg:w-[480px] xl:w-[500px] flex-shrink-0 flex flex-col h-full bg-theme-card border-t lg:border-t-0 lg:border-l border-theme-border shadow-xl z-20">
        {/* Panel Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-theme-border/60">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-display text-theme-text">Tactical Puzzles</span>
            <span className="text-xs font-bold text-amber-500 uppercase px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/30 flex items-center gap-1">
              <Flame size={12} /> Rated
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-theme-muted">
            {puzzleIndex + 1} / {MOCK_PUZZLES.length}
          </span>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence mode="wait">
            {showLevelMap ? (
              <motion.div
                key="level-map"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Level Map Progression Track */}
                <Card className="p-4 bg-theme-raised/50 border border-theme-border/60 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-theme-muted">
                    <span>Level {Math.floor(puzzleIndex / 5) + 1} Map</span>
                    <span className="text-amber-500 font-mono">Tile {avatarHopIndex + 1} of 5</span>
                  </div>

                  {/* Visual Step Track with Hopping Avatar */}
                  <div className="flex items-center justify-between py-6 px-2 relative">
                    <div className="absolute left-6 right-6 h-1 bg-theme-border rounded-full -z-0" />
                    <div
                      className="absolute left-6 h-1 bg-amber-500 rounded-full transition-all duration-500 -z-0"
                      style={{ width: `${Math.min(100, (avatarHopIndex / 4) * 85)}%` }}
                    />

                    {[0, 1, 2, 3, 4].map((tileIdx) => {
                      const isCompleted = tileIdx < avatarHopIndex;
                      const isCurrent = tileIdx === avatarHopIndex;
                      return (
                        <div key={tileIdx} className="relative z-10 flex flex-col items-center">
                          {isCurrent && (
                            <motion.div
                              initial={{ y: -10, scale: 0.8 }}
                              animate={{ y: 0, scale: 1 }}
                              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                              className="absolute -top-8"
                            >
                              <CoachAvatar expression="thumbsup" mode="bust" size={28} />
                            </motion.div>
                          )}
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                              isCompleted
                                ? 'bg-amber-500 border-amber-500 text-black'
                                : isCurrent
                                ? 'bg-amber-500/20 border-amber-500 text-amber-500 ring-4 ring-amber-500/20'
                                : 'bg-theme-card border-theme-border text-theme-muted'
                            }`}
                          >
                            {isCompleted ? '✓' : tileIdx + 1}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Next Puzzle Action (48px tall) */}
                <Button
                  variant="primary"
                  size="md"
                  className="!h-12 w-full"
                  icon={<Sparkles size={18} />}
                  onClick={handleNext}
                >
                  Next Puzzle
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="puzzle-solving"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                {/* Coach Portrait + Speech Bubble */}
                <div className="flex items-start gap-3">
                  <CoachAvatar expression={coachExp} mode="bust" size={68} />
                  <div className="flex-1 min-w-0">
                    <CoachBubble messages={bubbleMessages} />
                  </div>
                </div>

                {/* Feedback Card */}
                {status === 'solved' && (
                  <Card className="p-3 bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-semibold text-sm flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    <span>Solved! +15 Rating Points Earned</span>
                  </Card>
                )}

                {status === 'failed' && (
                  <Card className="p-3 bg-red-500/15 border-red-500/40 text-red-400 font-semibold text-sm flex items-center gap-2">
                    <XCircle size={18} />
                    <span>Incorrect move. Review the position and retry!</span>
                  </Card>
                )}

                {/* Puzzle Progress */}
                <Card className="p-4 space-y-3 bg-theme-raised/30">
                  <div className="flex justify-between items-center text-xs font-bold text-theme-muted">
                    <span>Level Progress</span>
                    <span>Level {Math.floor(puzzleIndex / 5) + 1}</span>
                  </div>
                  <ProgressBar value={progressValue} max={MOCK_PUZZLES.length} height={6} />
                </Card>

                {/* Actions: Retry / Next / Hint (48px tall buttons) */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {status === 'failed' && (
                    <Button
                      variant="secondary"
                      size="md"
                      className="!h-12 flex-1"
                      icon={<RotateCcw size={18} />}
                      onClick={handleRetry}
                    >
                      Retry
                    </Button>
                  )}

                  {status === 'solving' && (
                    <Button
                      variant="highlight"
                      size="md"
                      className="!h-12 w-full"
                      icon={<Lightbulb size={18} />}
                      onClick={() => {
                        const firstSolutionMove = currentPuzzle.solution[solutionStep];
                        setBubbleText(`Hint: Look for a forcing move starting with ${firstSolutionMove[0]}!`);
                      }}
                    >
                      Get Hint
                    </Button>
                  )}

                  {status === 'solved' && (
                    <Button
                      variant="primary"
                      size="md"
                      className="!h-12 w-full"
                      icon={<Sparkles size={18} />}
                      onClick={handleNext}
                    >
                      Next Puzzle
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
export default PuzzleScreen;
