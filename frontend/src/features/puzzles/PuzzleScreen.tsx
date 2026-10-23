import React, { useState, useEffect, useMemo, useRef } from 'react';
import { isCorrectPuzzleMove } from '@/lib/puzzleCheck';
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
import { useMotion } from '@/lib/useMotion';
import { Flame, Lightbulb, RotateCcw, Sparkles, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Play, Lock, Crown } from 'lucide-react';

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

function getChipStyle(sq: string, orientation: 'white' | 'black'): React.CSSProperties {
  const file = sq.charCodeAt(0) - 97;
  const rank = parseInt(sq[1], 10) - 1;
  const col = orientation === 'white' ? file : 7 - file;
  const row = orientation === 'white' ? 7 - rank : rank;
  // just above the badge (which sits at the square's top-right corner)
  return { left: `${(col + 0.94) * 12.5}%`, top: `${(row - 0.12) * 12.5}%`, transform: 'translate(-50%, -100%)' };
}

export const PuzzleScreen: React.FC = () => {
  const { boardThemeId, pieceSetId, animationSpeed } = useSettingsStore();
  const currentBoardTheme = BOARD_THEMES.find((t) => t.id === boardThemeId) || BOARD_THEMES[0];
  const currentPieceSet = PIECE_SETS.find((p) => p.id === pieceSetId) || PIECE_SETS[0];

  const [puzzleIndex, setPuzzleIndex] = useState<number>(0);
  const currentPuzzle = MOCK_PUZZLES[puzzleIndex] || MOCK_PUZZLES[0];
  const { isFull } = useMotion();

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

  const [wrongSquare, setWrongSquare] = useState<string | null>(null);
  const [penalisedPuzzleId, setPenalisedPuzzleId] = useState<string | null>(null);

  const handleMove = (_from: string, _to: string, promotion?: string) => {
    if (status !== 'solving') return false;

    try {
      const expectedMoveSan = currentPuzzle.solution[solutionStep];
      const legalMoves = chess.moves({ verbose: true });
      const matchingMove = legalMoves.find(
        (m) => m.from === _from && m.to === _to && (!promotion || m.promotion === promotion)
      );
      if (!matchingMove) return false;

      const beforeFen = chess.fen();
      chess.move(matchingMove);
      const givesMate = chess.isCheckmate();
      const correct = isCorrectPuzzleMove(matchingMove.san, expectedMoveSan, givesMate);

      if (correct) {
        setFen(chess.fen());

        const nextStep = solutionStep + 1;
        if (nextStep >= currentPuzzle.solution.length || givesMate) {
          // --- BEAT 1 (0ms): Immediate solve state ---
          setLastSolvedSquare(_to);
          setFloatingChip(15);
          setStatus('solved');
          setCoachExp('brilliant');
          setBubbleText('Solved! Nicely spotted.');
          sound.puzzleCorrect();

          const alreadyFailed = penalisedPuzzleId === currentPuzzle.id;
          const delta = alreadyFailed ? 0 : 15;
          const targetRating = puzzleRating + delta;
          setPuzzleRating(targetRating);
          storage.set('all_chess_puzzle_rating', targetRating);
          animateCountUp(displayedRating, targetRating, 400, setDisplayedRating);
          setProgressValue(puzzleIndex + 1);

          setTimeout(() => setFloatingChip(null), 900);

          // --- BEAT 2 (1000ms): Cross-fade to level map ---
          setTimeout(() => {
            setShowLevelMap(true);
            setAvatarHopIndex((puzzleIndex + 1) % 5);
          }, 1000);

          // Only when a level completes (every 5 puzzles)
          if ((puzzleIndex + 1) % 5 === 0) {
            setTimeout(() => setShowRewardCascade(true), 1800);
          }
        } else {
          setSolutionStep(nextStep);
          setCoachExp('thumbsup');
          setBubbleText('Good. Keep going.');
          setTimeout(() => {
            const oppMove = currentPuzzle.solution[nextStep];
            chess.move(oppMove);
            setFen(chess.fen());
            setSolutionStep(nextStep + 1);
            sound.move();
          }, 450);
        }
        return true;
      }

      // --- Wrong move: show it, mark it, then take it back (like the reference) ---
      setFen(chess.fen());
      setWrongSquare(_to);
      setStatus('failed');
      setCoachExp('embarrassed');
      setBubbleText(
        givesMate
          ? 'That mates too, but not the way this puzzle is built. Try the main line.'
          : chess.inCheck()
          ? 'A check, but it lets the king escape. Look for something more forcing.'
          : "Not quite. That gives the opponent time. Look for checks, captures and threats first."
      );
      sound.puzzleWrong();
      if (penalisedPuzzleId !== currentPuzzle.id) {
        const targetRating = Math.max(100, puzzleRating - 10);
        setPuzzleRating(targetRating);
        storage.set('all_chess_puzzle_rating', targetRating);
        animateCountUp(displayedRating, targetRating, 400, setDisplayedRating);
        setPenalisedPuzzleId(currentPuzzle.id);
      }
      setTimeout(() => {
        chess.load(beforeFen);
        setFen(beforeFen);
        setWrongSquare(null);
      }, 700);
      return true;
    } catch {
      return false;
    }
  };

  const handleRetry = () => {
    setWrongSquare(null);
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
        // Puzzle bubbles: plain title, no eval chip (the reference never shows an eval here)
        classification: status === 'solved' ? 'best' : status === 'failed' ? 'mistake' : undefined,
        title: status === 'solved' ? 'Solved' : status === 'failed' ? 'Incorrect' : `${isWhiteToMove ? 'White' : 'Black'} to move`,
      },
    ],
    [puzzleIndex, status, bubbleText, isWhiteToMove]
  );

  const puzzleBadges: BoardBadge[] = useMemo(
    () =>
      status === 'solved' && lastSolvedSquare
        ? [{ square: lastSolvedSquare, label: 'best' }]
        : wrongSquare
        ? [{ square: wrongSquare, label: 'mistake' }]
        : [],
    [status, lastSolvedSquare, wrongSquare]
  );

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-theme-bg select-none overflow-y-auto lg:overflow-hidden">
      {/* Left/Main Zone: Board + Top Status Bar */}
      <div className="flex-none lg:flex-1 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 lg:overflow-y-auto min-w-0">
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
            {floatingChip && lastSolvedSquare && penalisedPuzzleId !== currentPuzzle.id && (
              <div className="absolute z-40 pointer-events-none" style={getChipStyle(lastSolvedSquare, isWhiteToMove ? 'white' : 'black')}>
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.8 }}
                  animate={{ opacity: [0, 1, 1, 0], y: [6, 0, -10, -18], scale: [0.8, 1.05, 1, 1] }}
                  transition={{ duration: 1.1, times: [0, 0.18, 0.7, 1], ease: 'easeOut' }}
                  className="px-2.5 py-1 rounded-full bg-[#7bb661] text-white font-extrabold text-[15px] leading-none shadow-lg tabular-nums"
                >
                  +{floatingChip}
                </motion.div>
              </div>
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
      <div className="w-full lg:w-[480px] xl:w-[500px] flex-shrink-0 flex flex-col lg:h-full bg-theme-card border-t lg:border-t-0 lg:border-l border-theme-border shadow-xl z-20">
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
        <div className="lg:flex-1 lg:overflow-y-auto p-4 space-y-4">
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

                  {/* Illustrated Winding Path (Reusing Learn path styling) */}
                  <div className="relative w-full h-44 rounded-xl overflow-hidden bg-theme-page/60 border border-theme-border/40 p-2">
                    {/* SVG S-Curve Track */}
                    <svg
                      viewBox="0 0 340 160"
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M 40 115 C 65 115, 75 45, 102 45 C 135 45, 140 115, 170 115 C 200 115, 205 45, 238 45 C 265 45, 275 104, 300 104"
                        fill="none"
                        stroke="currentColor"
                        className="text-theme-border/80"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 40 115 C 65 115, 75 45, 102 45 C 135 45, 140 115, 170 115 C 200 115, 205 45, 238 45 C 265 45, 275 104, 300 104"
                        fill="none"
                        stroke="rgba(245, 158, 11, 0.65)"
                        strokeWidth="4"
                        strokeDasharray="6 6"
                        strokeLinecap="round"
                      />
                    </svg>

                    {/* 5 Winding Illustrated Tiles with Hopping Avatar */}
                    {[
                      { idx: 0, x: 12, y: 72 },
                      { idx: 1, x: 30, y: 28 },
                      { idx: 2, x: 50, y: 72 },
                      { idx: 3, x: 70, y: 28 },
                      { idx: 4, x: 88, y: 65 },
                    ].map((tile) => {
                      const isCompleted = tile.idx < avatarHopIndex;
                      const isCurrent = tile.idx === avatarHopIndex;
                      const isGoal = tile.idx === 4;

                      return (
                        <div
                          key={tile.idx}
                          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
                          style={{ left: `${tile.x}%`, top: `${tile.y}%` }}
                        >
                          {/* Hopping Coach Avatar above Current Tile */}
                          {isCurrent && (
                            <motion.div
                              initial={isFull ? { y: -20, scale: 0.7 } : false}
                              animate={{ y: 0, scale: 1 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                              className="absolute -top-10 z-20"
                            >
                              <CoachAvatar expression="thumbsup" mode="bust" size={32} />
                            </motion.div>
                          )}

                          {/* Node Button / Tile */}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-transform ${
                              isCompleted
                                ? 'bg-amber-500 border-2 border-amber-400 text-black'
                                : isCurrent
                                ? 'bg-amber-500 text-black ring-4 ring-amber-500/30 scale-105'
                                : 'bg-theme-card border-2 border-theme-border text-theme-muted'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 size={20} />
                            ) : isCurrent ? (
                              <Play size={18} className="fill-black ml-0.5" />
                            ) : isGoal ? (
                              <Crown size={18} className="text-amber-500/70" />
                            ) : (
                              <Lock size={16} />
                            )}
                          </div>
                          <span className="text-xs font-bold text-theme-muted mt-1 whitespace-nowrap">
                            Tile {tile.idx + 1}
                          </span>
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
                    <span>{penalisedPuzzleId === currentPuzzle.id ? 'Solved on retry. No rating change.' : 'Solved! +15 rating'}</span>
                  </Card>
                )}

                {status === 'failed' && (
                  <Card className="p-3 bg-red-500/15 border-red-500/40 text-red-400 font-semibold text-sm flex items-center gap-2">
                    <XCircle size={18} />
                    <span>Incorrect. -10 rating. Try again.</span>
                  </Card>
                )}

                {/* Puzzle Progress */}
                <Card className="p-4 space-y-3 bg-theme-raised/30">
                  <div className="flex justify-between items-center text-xs font-bold text-theme-muted">
                    <span>Level Progress</span>
                    <span>Level {Math.floor(puzzleIndex / 5) + 1}</span>
                  </div>
                  <ProgressBar value={progressValue % 5 === 0 && progressValue > 0 && status === 'solved' ? 5 : progressValue % 5} max={5} height={6} />
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
