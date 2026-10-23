import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { isCorrectPuzzleMove } from '@/lib/puzzleCheck';
import { motion, AnimatePresence } from 'framer-motion';
import { Chess } from 'chess.js';
import { Board } from '@/features/board/Board';
import { CoachSpeech } from '@/features/coach/CoachSpeech';
import { BubbleMessage } from '@/features/coach/CoachBubble';
import { Button } from '@/components/Button';
import { RewardCascade } from './RewardCascade';
import { IsoLevelMap } from '@/features/map/IsoLevelMap';
import { LevelBadge } from '@/features/map/LevelBadge';
import { useSettingsStore } from '@/data/settingsStore';
import { BOARD_THEMES, PIECE_SETS } from '@/data/boardThemes';
import { storage } from '@/lib/storage';
import { formatTime } from '@/lib/formatters';
import { MOCK_PUZZLES } from '@/data/mock/mockPuzzles';
import { BoardBadge, CoachExpression } from '@/data/types';
import { sound } from '@/lib/sound';
import { useMotion } from '@/lib/useMotion';
import {
  Flame,
  Lightbulb,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronRight as NextIcon,
  Clock3,
  Puzzle as PuzzleIcon,
  Volume2,
  VolumeX,
  Settings as SettingsIcon,
  X,
  Eye,
} from 'lucide-react';

const PUZZLES_PER_LEVEL = 5;
const MAP_LEVELS = 20;

function animateCountUp(start: number, end: number, duration: number, callback: (v: number) => void) {
  const startTime = performance.now();
  const step = (now: number) => {
    const progress = Math.min((now - startTime) / duration, 1);
    // ease-out so the number settles rather than stopping dead
    const eased = 1 - Math.pow(1 - progress, 3);
    callback(Math.round(start + (end - start) * eased));
    if (progress < 1) requestAnimationFrame(step);
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

/** "White to move — Deliver mate!" → "Deliver mate!" (the bubble header already says whose move it is). */
const stripSideToMove = (goal: string) => goal.replace(/^(White|Black) to move\s*[—–-]\s*/i, '');

const THEME_LABELS: Record<string, string> = {
  mateIn1: 'Mate in 1',
  mateIn2: 'Mate in 2',
  mateIn3: 'Mate in 3',
  backRank: 'Back rank',
};
const themeLabel = (t: string) =>
  THEME_LABELS[t] || t.replace(/([a-z])([A-Z0-9])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());

export const PuzzleScreen: React.FC = () => {
  const navigate = useNavigate();
  const { boardThemeId, pieceSetId, animationSpeed, soundEnabled, updateSettings } = useSettingsStore();
  const currentBoardTheme = BOARD_THEMES.find((t) => t.id === boardThemeId) || BOARD_THEMES[0];
  const currentPieceSet = PIECE_SETS.find((p) => p.id === pieceSetId) || PIECE_SETS[0];
  const { isFull, isOff } = useMotion();

  const [puzzleIndex, setPuzzleIndex] = useState<number>(() => storage.get('all_chess_puzzle_index', 0) % MOCK_PUZZLES.length);
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
  const [mapHopFrom, setMapHopFrom] = useState<number | null>(null);
  const [hintSquare, setHintSquare] = useState<string | null>(null);
  const [hintArrow, setHintArrow] = useState<{ from: string; to: string } | null>(null);
  // The panel opens on the level map with a "Solve puzzles" button, like the reference's puzzle home.
  // Making a move on the board also starts.
  const [started, setStarted] = useState<boolean>(false);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  const [puzzleRating, setPuzzleRating] = useState<number>(() => storage.get('all_chess_puzzle_rating', 1200));
  const [displayedRating, setDisplayedRating] = useState<number>(puzzleRating);
  const [ratingDelta, setRatingDelta] = useState<number | null>(null);
  const [streak, setStreak] = useState<number>(() => storage.get('all_chess_puzzle_streak', 0));
  const [solvedInLevel, setSolvedInLevel] = useState<number>(puzzleIndex % PUZZLES_PER_LEVEL);

  const [coachExp, setCoachExp] = useState<CoachExpression>('thinking');
  const [bubbleText, setBubbleText] = useState<string>(stripSideToMove(currentPuzzle.goal));

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => {
    timeoutsRef.current.push(window.setTimeout(fn, ms));
  };
  useEffect(() => () => timeoutsRef.current.forEach((t) => window.clearTimeout(t)), []);

  const level = Math.floor(puzzleIndex / PUZZLES_PER_LEVEL) + 1;

  useEffect(() => {
    timeoutsRef.current.forEach((t) => window.clearTimeout(t));
    timeoutsRef.current = [];
    chess.load(currentPuzzle.fen);
    setFen(currentPuzzle.fen);
    setSolutionStep(0);
    setStatus('solving');
    setLastSolvedSquare(null);
    setFloatingChip(null);
    setTimerSeconds(0);
    setShowRewardCascade(false);
    setHintSquare(null);
    setHintArrow(null);
    setLastMove(null);
    setRatingDelta(null);
    setSolvedInLevel(puzzleIndex % PUZZLES_PER_LEVEL);
    setCoachExp('thinking');
    setBubbleText(stripSideToMove(currentPuzzle.goal));
    storage.set('all_chess_puzzle_index', puzzleIndex);
  }, [currentPuzzle, chess, puzzleIndex]);

  useEffect(() => {
    if (status === 'solving' && started) {
      timerRef.current = setInterval(() => setTimerSeconds((prev) => prev + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, started]);

  const [wrongSquare, setWrongSquare] = useState<string | null>(null);
  const [penalisedPuzzleId, setPenalisedPuzzleId] = useState<string | null>(null);

  const changeRating = (delta: number) => {
    const target = Math.max(100, puzzleRating + delta);
    setPuzzleRating(target);
    storage.set('all_chess_puzzle_rating', target);
    setRatingDelta(target - puzzleRating);
    animateCountUp(displayedRating, target, isOff ? 0 : 700, setDisplayedRating);
  };

  const handleMove = (_from: string, _to: string, promotion?: string) => {
    if (status !== 'solving') return false;
    if (!started) setStarted(true);

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
      setHintSquare(null);
    setHintArrow(null);
      setLastMove({ from: matchingMove.from, to: matchingMove.to });

      if (correct) {
        setFen(chess.fen());

        const nextStep = solutionStep + 1;
        if (nextStep >= currentPuzzle.solution.length || givesMate) {
          // Beat 1 (0ms): board marks the move, coach reacts, bubble switches to "Solved"
          setLastSolvedSquare(_to);
          setStatus('solved');
          setCoachExp('brilliant');
          const nextStreak = streak + 1;
          setStreak(nextStreak);
          storage.set('all_chess_puzzle_streak', nextStreak);
          setBubbleText(
            nextStreak >= 3
              ? `${nextStreak} in a row! Keep that rhythm going.`
              : givesMate
              ? 'Checkmate. Clean and precise.'
              : 'Nicely spotted. That was the move.'
          );
          sound.puzzleCorrect();

          // Beat 2 (~450ms, after the mate effects start): points chip, rating counts up, bar fills
          const alreadyFailed = penalisedPuzzleId === currentPuzzle.id;
          later(() => {
            if (!alreadyFailed) {
              setFloatingChip(15);
              changeRating(15);
            }
            setSolvedInLevel((n) => Math.min(PUZZLES_PER_LEVEL, n + 1));
          }, isOff ? 0 : 450);
          later(() => setFloatingChip(null), 1600);

          // Beat 3: a finished level opens the map and the coach hops to the next tile
          if ((puzzleIndex + 1) % PUZZLES_PER_LEVEL === 0) {
            later(() => {
              setMapHopFrom(level - 1);
              setShowLevelMap(true);
            }, isOff ? 300 : 1400);
            later(() => setShowRewardCascade(true), isOff ? 600 : 2600);
          }
        } else {
          setSolutionStep(nextStep);
          setCoachExp('thumbsup');
          setBubbleText('Good. Keep going, there is more.');
          later(() => {
            const oppMove = currentPuzzle.solution[nextStep];
            const played = chess.move(oppMove);
            setLastMove({ from: played.from, to: played.to });
            setFen(chess.fen());
            setSolutionStep(nextStep + 1);
            sound.move();
          }, 450);
        }
        return true;
      }

      // Wrong move: show it, mark it, then take it back
      setFen(chess.fen());
      setWrongSquare(_to);
      setStatus('failed');
      setCoachExp('embarrassed');
      setStreak(0);
      storage.set('all_chess_puzzle_streak', 0);
      setBubbleText(
        givesMate
          ? 'That mates too, but not the way this puzzle is built. Try the main line.'
          : chess.inCheck()
          ? 'A check, but it lets the king escape. Look for something more forcing.'
          : 'Not quite. That gives the opponent time. Look for checks, captures and threats first.'
      );
      sound.puzzleWrong();
      if (penalisedPuzzleId !== currentPuzzle.id) {
        changeRating(-10);
        setPenalisedPuzzleId(currentPuzzle.id);
      }
      later(() => {
        chess.load(beforeFen);
        setFen(beforeFen);
        setWrongSquare(null);
        setLastMove(null);
      }, 700);
      return true;
    } catch {
      return false;
    }
  };

  const handleRetry = () => {
    timeoutsRef.current.forEach((t) => window.clearTimeout(t));
    timeoutsRef.current = [];
    setWrongSquare(null);
    chess.load(currentPuzzle.fen);
    setFen(currentPuzzle.fen);
    setStatus('solving');
    setLastSolvedSquare(null);
    setFloatingChip(null);
    setSolutionStep(0);
    setHintSquare(null);
    setHintArrow(null);
    setLastMove(null);
    setCoachExp('thinking');
    setBubbleText(stripSideToMove(currentPuzzle.goal));
  };

  // Hint, first press: light up the piece to move. Second press: draw the move.
  const handleHint = () => {
    const san = currentPuzzle.solution[solutionStep];
    const probe = new Chess(chess.fen());
    const mv = probe.moves({ verbose: true }).find((m) => m.san === san || m.san.replace(/[+#]/g, '') === san.replace(/[+#]/g, ''));
    setCoachExp('thinking');
    if (!mv) {
      setBubbleText('Look for checks first.');
      return;
    }
    if (!hintSquare) {
      setHintSquare(mv.from);
      setBubbleText('Look at the highlighted piece. What is its most forcing move?');
    } else {
      setHintArrow({ from: mv.from, to: mv.to });
      setBubbleText('There it is. Play the move on the board.');
    }
    // a hint means this solve no longer earns rating
    setPenalisedPuzzleId(currentPuzzle.id);
  };

  const handleShowSolution = () => {
    const san = currentPuzzle.solution[solutionStep];
    const probe = new Chess(chess.fen());
    const mv = probe.moves({ verbose: true }).find((m) => m.san.replace(/[+#]/g, '') === san.replace(/[+#]/g, ''));
    if (!mv) return;
    handleRetry();
    setHintSquare(mv.from);
    setBubbleText(`The move is ${san}. Play it on the board.`);
  };

  const goTo = (index: number) => {
    setShowLevelMap(false);
    setShowRewardCascade(false);
    setMapHopFrom(null);
    setPuzzleIndex(((index % MOCK_PUZZLES.length) + MOCK_PUZZLES.length) % MOCK_PUZZLES.length);
  };
  const handleNext = () => goTo(puzzleIndex + 1);
  const handlePrev = () => goTo(puzzleIndex - 1);

  const isWhiteToMove = currentPuzzle.fen.split(' ')[1] === 'w';
  const orientation = isWhiteToMove ? 'white' : 'black';

  const bubbleMessages: BubbleMessage[] = useMemo(
    () => [
      {
        id: `puzzle-${puzzleIndex}-${status}-${bubbleText.slice(0, 16)}`,
        text: bubbleText,
        icon: status === 'solved' ? 'solved' : status === 'failed' ? 'incorrect' : isWhiteToMove ? 'white-to-move' : 'black-to-move',
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

  const progressPct = (solvedInLevel / PUZZLES_PER_LEVEL) * 100;

  // rating, change, streak and level progress (also drawn over the map on the puzzle home)
  const ratingBlock = (onDark: boolean) => (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2.5">
        <span className={`text-[28px] leading-none font-extrabold font-display tabular-nums ${onDark ? 'text-white drop-shadow' : 'text-theme-text'}`} data-testid="puzzle-rating">
          {displayedRating}
        </span>
        <AnimatePresence>
          {ratingDelta !== null && ratingDelta !== 0 && (
            <motion.span
              key={`d-${ratingDelta}-${puzzleIndex}`}
              initial={isOff ? false : { opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={`text-[15px] font-bold tabular-nums ${ratingDelta > 0 ? 'text-[var(--class-best)]' : 'text-[var(--class-blunder)]'}`}
            >
              {ratingDelta > 0 ? `+${ratingDelta}` : ratingDelta}
            </motion.span>
          )}
        </AnimatePresence>
        <span className="flex items-center gap-0.5 text-[15px] font-bold text-amber-400" title="Solved in a row" data-testid="puzzle-streak">
          <Flame size={16} className="fill-amber-400/30" />
          <motion.span key={streak} initial={isFull ? { scale: 1.5 } : false} animate={{ scale: 1 }} transition={{ duration: 0.25 }}>
            {streak}
          </motion.span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className={`relative flex-1 h-3 rounded-full overflow-hidden ${onDark ? 'bg-black/45' : 'bg-black/10 dark:bg-black/35'}`} role="progressbar" aria-valuenow={solvedInLevel} aria-valuemax={PUZZLES_PER_LEVEL} aria-label={`Level ${level} progress`}>
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: 'linear-gradient(180deg, #ffd35a 0%, #f0a422 100%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.45)' }}
            initial={false}
            animate={{ width: `${Math.max(progressPct, 2.5)}%` }}
            transition={{ duration: isOff ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setMapHopFrom(null);
            setShowLevelMap(true);
          }}
          className="flex-shrink-0 rounded-md hover:brightness-110 active:translate-y-px transition"
          aria-label={`Level ${level}: open the level map`}
          title="Level map"
          data-testid="level-badge"
        >
          <LevelBadge level={level} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-theme-bg select-none overflow-y-auto lg:overflow-hidden lg:items-center lg:justify-center lg:gap-6 lg:px-6 lg:py-4 pb-20 lg:pb-4">
      {/* Board: as large as the viewport allows, like the reference (about 96% of the height) */}
      <div className="flex-none lg:h-full flex items-center justify-center p-2 sm:p-4 lg:p-0 min-w-0 lg:flex-1 lg:max-w-[calc(100vh-32px)]">
        <div className="relative w-full aspect-square" style={{ maxWidth: 'calc(100vh - 32px)' }}>
          <Board
            fen={fen}
            orientation={orientation}
            boardTheme={currentBoardTheme}
            pieceSet={currentPieceSet}
            animationSpeed={animationSpeed}
            interactive={status === 'solving'}
            badges={puzzleBadges}
            highlights={hintSquare ? [hintSquare] : []}
            arrows={hintArrow ? [{ ...hintArrow, color: 'green' }] : []}
            lastMove={lastMove}
            onMove={handleMove}
            maxWidthClass="max-w-none"
          />

          {/* Floating points chip over the destination square (+15) */}
          {floatingChip && lastSolvedSquare && (
            <div className="absolute z-40 pointer-events-none" style={getChipStyle(lastSolvedSquare, orientation)}>
              <motion.div
                initial={isOff ? false : { opacity: 0, y: 8, scale: 0.6 }}
                animate={isOff ? { opacity: 1 } : { opacity: [0, 1, 1, 0], y: [8, 0, -6, -16], scale: [0.6, 1.12, 1, 1] }}
                transition={{ duration: 1.1, times: [0, 0.22, 0.75, 1], ease: 'easeOut' }}
                className="px-2.5 py-1 rounded-full bg-[var(--class-best)] text-white font-extrabold text-[15px] leading-none shadow-lg tabular-nums"
                data-testid="points-chip"
              >
                +{floatingChip}
              </motion.div>
            </div>
          )}

          <RewardCascade isOpen={showRewardCascade} levelNumber={level} pointsEarned={15} onNextPuzzle={handleNext} />
        </div>
      </div>

      {/* Side panel: a rounded card the height of the board */}
      <aside
        className="w-full lg:w-[400px] xl:w-[420px] flex-shrink-0 flex flex-col lg:h-[calc(100vh-32px)] lg:max-h-[calc(100vh-32px)] bg-theme-card lg:rounded-lg border-t lg:border border-theme-border shadow-xl overflow-hidden"
        data-testid="puzzle-panel"
      >
        {/* Header */}
        <div className="relative flex items-center justify-center h-14 px-3 flex-shrink-0 border-b border-theme-border/60">
          {showLevelMap && (
            <button
              type="button"
              onClick={() => setShowLevelMap(false)}
              className="absolute left-2 p-2 rounded-md text-theme-muted hover:text-theme-text hover:bg-theme-raised"
              aria-label="Back to the puzzle"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div className="flex items-center gap-2">
            <PuzzleIcon size={22} className="text-amber-500" />
            <h1 className="text-xl font-extrabold font-display text-theme-text">Puzzles</h1>
          </div>
          <div className="absolute right-2 flex items-center">
            <button
              type="button"
              onClick={() => updateSettings({ soundEnabled: !soundEnabled })}
              className="p-2 rounded-md text-theme-muted hover:text-theme-text hover:bg-theme-raised"
              aria-label={soundEnabled ? 'Mute sounds' : 'Turn sounds on'}
              title={soundEnabled ? 'Mute sounds' : 'Turn sounds on'}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            {showLevelMap && (
              <button
                type="button"
                onClick={() => setShowLevelMap(false)}
                className="p-2 rounded-md text-theme-muted hover:text-theme-text hover:bg-theme-raised"
                aria-label="Close the level map"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {!showLevelMap && !started ? (
            <motion.div
              key="home"
              initial={isOff ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: isOff ? 0 : 0.2 }}
              className="flex-1 min-h-[560px] lg:min-h-0 relative overflow-hidden"
              data-testid="puzzle-home"
            >
              <IsoLevelMap
                levelCount={MAP_LEVELS}
                currentIndex={Math.min(MAP_LEVELS - 1, level - 1)}
                onSelect={(i) => {
                  if (i <= level - 1) {
                    goTo(i * PUZZLES_PER_LEVEL);
                    setStarted(true);
                  }
                }}
                className="absolute inset-0"
              />
              <div className="absolute top-0 inset-x-0 px-4 pt-4 pb-12 bg-gradient-to-b from-black/55 via-black/25 to-transparent pointer-events-none">
                <div className="pointer-events-auto">
                  <CoachSpeech
                    expression="wave"
                    size={80}
                    text={
                      level === 1 && solvedInLevel === 0
                        ? 'Puzzles train the patterns you will meet in your own games. Ready when you are!'
                        : `Welcome back! Level ${level}, puzzle ${solvedInLevel + 1} of ${PUZZLES_PER_LEVEL}. Let's keep climbing.`
                    }
                  />
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 px-4 pb-4 pt-16 bg-gradient-to-t from-black/75 via-black/45 to-transparent space-y-3">
                {ratingBlock(true)}
                <Button variant="primary" size="lg" fullWidth onClick={() => setStarted(true)} data-testid="solve-puzzles">
                  Solve puzzles
                </Button>
              </div>
            </motion.div>
          ) : showLevelMap ? (
            <motion.div
              key="map"
              initial={isOff ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={isOff ? { opacity: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: isOff ? 0 : 0.22, ease: [0, 0, 0.2, 1] }}
              className="flex-1 min-h-[420px] lg:min-h-0 relative"
            >
              <IsoLevelMap
                levelCount={MAP_LEVELS}
                currentIndex={Math.min(MAP_LEVELS - 1, mapHopFrom !== null ? level : level - 1)}
                hopFrom={mapHopFrom}
                onSelect={(i) => {
                  if (i <= level - 1) goTo(i * PUZZLES_PER_LEVEL);
                }}
                className="absolute inset-0"
              />
            </motion.div>
          ) : (
            <motion.div
              key="puzzle"
              initial={isOff ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: isOff ? 0 : 0.15 }}
              className="flex-1 min-h-0 flex flex-col"
            >
              <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-5 pb-4 space-y-5">
                <CoachSpeech expression={coachExp} messages={bubbleMessages} size={80} />

                {ratingBlock(false)}

                {status === 'solved' && (
                  <motion.div
                    initial={isOff ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: isOff ? 0 : 0.5 }}
                    className="flex flex-wrap gap-1.5"
                  >
                    {currentPuzzle.theme.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-theme-raised text-xs font-semibold text-theme-muted">
                        {themeLabel(t)}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 rounded bg-theme-raised text-xs font-semibold text-theme-muted">Puzzle {currentPuzzle.rating}</span>
                  </motion.div>
                )}
              </div>

              {/* Timer */}
              <div className="px-4 pb-3 flex items-center gap-1.5 text-sm text-theme-muted tabular-nums">
                <Clock3 size={15} />
                {formatTime(timerSeconds)}
              </div>

              {/* Action bar */}
              <div className="flex-shrink-0 px-4 py-3 bg-black/[0.03] dark:bg-black/15 border-t border-theme-border/60 space-y-2">
                {status === 'solving' && (
                  <Button variant="secondary" size="lg" fullWidth icon={<Lightbulb size={18} />} onClick={handleHint} disabled={!!hintArrow} data-testid="hint-button">
                    {hintSquare ? 'Show move' : 'Hint'}
                  </Button>
                )}
                {status === 'failed' && (
                  <div className="flex gap-2">
                    <Button variant="secondary" size="lg" className="flex-1" icon={<RotateCcw size={18} />} onClick={handleRetry}>
                      Retry
                    </Button>
                    <Button variant="secondary" size="lg" className="!px-4" icon={<Eye size={18} />} onClick={handleShowSolution} aria-label="Show the solution" title="Show the solution" />
                    <Button variant="primary" size="lg" className="!px-5" icon={<NextIcon size={20} />} onClick={handleNext} aria-label="Next puzzle" title="Next puzzle" />
                  </div>
                )}
                {status === 'solved' && (
                  <div className="flex gap-2">
                    <Button variant="secondary" size="lg" className="!px-4" icon={<RotateCcw size={18} />} onClick={handleRetry} aria-label="Try this puzzle again" title="Try again" />
                    <Button variant="primary" size="lg" className="flex-1" onClick={handleNext} data-testid="next-puzzle">
                      Next puzzle <NextIcon size={20} />
                    </Button>
                  </div>
                )}
                <div className="flex items-center justify-between text-theme-muted">
                  <button
                    type="button"
                    onClick={() => navigate('/settings')}
                    className="p-2 -ml-2 rounded hover:text-theme-text hover:bg-theme-raised"
                    aria-label="Board settings"
                    title="Board settings"
                  >
                    <SettingsIcon size={16} />
                  </button>
                  <div className="flex items-center">
                    <button type="button" onClick={handlePrev} className="p-2 rounded hover:text-theme-text hover:bg-theme-raised" title="Previous puzzle" aria-label="Previous puzzle">
                      <ChevronLeft size={18} />
                    </button>
                    <span className="text-xs font-semibold tabular-nums px-1">
                      {puzzleIndex + 1} / {MOCK_PUZZLES.length}
                    </span>
                    <button type="button" onClick={handleNext} className="p-2 -mr-2 rounded hover:text-theme-text hover:bg-theme-raised" title="Next puzzle" aria-label="Next puzzle">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </div>
  );
};
export default PuzzleScreen;
