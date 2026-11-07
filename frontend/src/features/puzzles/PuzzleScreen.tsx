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
import { usePhoneLayout } from '@/lib/useMediaQuery';
import { useSettingsStore } from '@/data/settingsStore';
import { BOARD_THEMES, PIECE_SETS } from '@/data/boardThemes';
import { storage } from '@/lib/storage';
import { formatTime } from '@/lib/formatters';
import { MOCK_PUZZLES } from '@/data/mock/mockPuzzles';
import { SidebarHeader, HeaderIconButton } from '@/components/SidebarPanel';
import { PuzzlePieceBadge } from './PuzzlePieceBadge';
import { BoardBadge, CoachExpression, Puzzle } from '@/data/types';
import { puzzleRepository, PuzzleThemeCount, PuzzleAttemptResult } from '@/data/repositories';
import { levelForRating, levelBand, levelProgress, PUZZLE_LEVELS, PUZZLE_MIN_RATING } from '@/lib/puzzleLevel';
import { sound } from '@/lib/sound';
import { useMotion } from '@/lib/useMotion';
import { LeaveGuard } from '@/components/LeaveGuard';
import {
  Flame,
  Lightbulb,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronRight as NextIcon,
  Clock3,
  Volume2,
  VolumeX,
  Settings as SettingsIcon,
  X,
  Eye,
} from 'lucide-react';

const MAP_LEVELS = PUZZLE_LEVELS;
const THEME_STORAGE_KEY = 'all_chess_puzzle_theme';

/** "e2e4" -> { from: 'e2', to: 'e4' } */
const uciToMove = (uci?: string | null) => (uci && uci.length >= 4 ? { from: uci.slice(0, 2), to: uci.slice(2, 4) } : null);

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
  mateIn4: 'Mate in 4',
  mateIn5: 'Mate in 5',
  backRank: 'Back rank',
  backRankMate: 'Back rank mate',
  oneMove: 'One move',
  veryLong: 'Very long',
  masterVsMaster: 'Master vs master',
  superGM: 'Super GM games',
  attackingF2F7: 'Attacking f2/f7',
  xRayAttack: 'X-ray attack',
  enPassant: 'En passant',
};
const themeLabel = (t: string) =>
  THEME_LABELS[t] || t.replace(/([a-z])([A-Z0-9])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());

export const PuzzleScreen: React.FC = () => {
  const navigate = useNavigate();
  const { boardThemeId, pieceSetId, animationSpeed, soundEnabled, updateSettings } = useSettingsStore();
  const currentBoardTheme = BOARD_THEMES.find((t) => t.id === boardThemeId) || BOARD_THEMES[0];
  const currentPieceSet = PIECE_SETS.find((p) => p.id === pieceSetId) || PIECE_SETS[0];
  const { isFull, isOff } = useMotion();

  // Puzzles come from the server (the Lichess puzzle set). If it cannot be reached, the built-in set keeps the screen working.
  const [localIndex, setLocalIndex] = useState<number>(() => storage.get('all_chess_puzzle_index', 0) % MOCK_PUZZLES.length);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>(() => MOCK_PUZZLES[storage.get('all_chess_puzzle_index', 0) % MOCK_PUZZLES.length] || MOCK_PUZZLES[0]);
  const [source, setSource] = useState<'local' | 'server'>('local');
  const [sessionCount, setSessionCount] = useState<number>(1);
  const [loadingNext, setLoadingNext] = useState<boolean>(false);
  const [themes, setThemes] = useState<PuzzleThemeCount[]>([]);
  const [theme, setTheme] = useState<string>(() => storage.get<string>(THEME_STORAGE_KEY, ''));
  const historyRef = useRef<Puzzle[]>([]);
  const [historyLen, setHistoryLen] = useState<number>(0);
  const requestIdRef = useRef(0);
  const hintUsedIdRef = useRef<string | null>(null);
  const failReportedIdRef = useRef<string | null>(null);

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
  const startedRef = useRef(false);
  useEffect(() => {
    startedRef.current = started;
  }, [started]);
  const isPhone = usePhoneLayout();
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  const [puzzleRating, setPuzzleRating] = useState<number>(() => storage.get('all_chess_puzzle_rating', 1200));
  const [displayedRating, setDisplayedRating] = useState<number>(puzzleRating);
  const ratingRef = useRef(puzzleRating);
  const displayedRef = useRef(puzzleRating);
  const [ratingDelta, setRatingDelta] = useState<number | null>(null);
  const [streak, setStreak] = useState<number>(() => storage.get('all_chess_puzzle_streak', 0));

  const [coachExp, setCoachExp] = useState<CoachExpression>('thinking');
  const [bubbleText, setBubbleText] = useState<string>(stripSideToMove(currentPuzzle.goal));

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => {
    timeoutsRef.current.push(window.setTimeout(fn, ms));
  };
  useEffect(() => () => timeoutsRef.current.forEach((t) => window.clearTimeout(t)), []);

  // Levels follow the puzzle rating: one level per 100 points (400 to 2800).
  const level = levelForRating(puzzleRating);

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
    // the opponent's move that led to this position, so the player sees what just happened
    setLastMove(uciToMove(currentPuzzle.setupMoveUci));
    setRatingDelta(null);
    setCoachExp('thinking');
    setBubbleText(stripSideToMove(currentPuzzle.goal));
  }, [currentPuzzle, chess]);

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

  /** Moves the rating to `target` (count-up animation, saved copy for Home/Profile) and, on a level-up, opens the map. */
  const setRatingTo = (target: number, opts: { animate?: boolean; celebrate?: boolean } = {}) => {
    const prev = ratingRef.current;
    const next = Math.max(PUZZLE_MIN_RATING, Math.round(target));
    ratingRef.current = next;
    setPuzzleRating(next);
    storage.set('all_chess_puzzle_rating', next);
    if (opts.animate === false) {
      displayedRef.current = next;
      setDisplayedRating(next);
    } else {
      setRatingDelta(next - prev);
      animateCountUp(displayedRef.current, next, isOff ? 0 : 700, (v) => {
        displayedRef.current = v;
        setDisplayedRating(v);
      });
    }
    const prevLevel = levelForRating(prev);
    if (opts.celebrate && levelForRating(next) > prevLevel) {
      // a new level: open the map and let the coach hop to the next tile
      later(() => {
        setMapHopFrom(prevLevel - 1);
        setShowLevelMap(true);
      }, isOff ? 300 : 1400);
      later(() => setShowRewardCascade(true), isOff ? 600 : 2600);
    }
  };

  /** Applies the server's answer to an attempt: rating, streak, the +N chip. */
  const applyAttemptResult = (res: PuzzleAttemptResult) => {
    setStreak(res.streak);
    storage.set('all_chess_puzzle_streak', res.streak);
    const delay = isOff ? 0 : 450;
    later(() => {
      if (res.ratingDelta > 0) setFloatingChip(res.ratingDelta);
      setRatingTo(res.rating, { celebrate: res.ratingDelta > 0 });
    }, delay);
    later(() => setFloatingChip(null), delay + 1200);
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
      const playedUci = `${matchingMove.from}${matchingMove.to}${matchingMove.promotion || ''}`;
      const expectedUci = currentPuzzle.solutionUci?.[solutionStep];
      const correct = (!!expectedUci && playedUci === expectedUci) || isCorrectPuzzleMove(matchingMove.san, expectedMoveSan, givesMate);
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
          // a hint means no rating and no streak for this solve (the streak is not broken either)
          const hintUsed = hintUsedIdRef.current === currentPuzzle.id;
          const nextStreak = hintUsed ? streak : streak + 1;
          if (!hintUsed) {
            setStreak(nextStreak);
            storage.set('all_chess_puzzle_streak', nextStreak);
          }
          setBubbleText(
            nextStreak >= 3 && !hintUsed
              ? `${nextStreak} in a row! Keep that rhythm going.`
              : givesMate
              ? 'Checkmate. Clean and precise.'
              : 'Nicely spotted. That was the move.'
          );
          sound.puzzleCorrect();

          // Beat 2 (~450ms): points chip, rating counts up, bar fills (rating is decided by the server for served puzzles)
          if (source === 'server') {
            void puzzleRepository
              .submitAttempt(currentPuzzle.id, { solved: true, timeSeconds: timerSeconds, usedHint: hintUsed })
              .then((res) => {
                if (res) applyAttemptResult(res);
              });
          } else {
            const alreadyFailed = penalisedPuzzleId === currentPuzzle.id;
            later(() => {
              if (!alreadyFailed) {
                setFloatingChip(15);
                setRatingTo(ratingRef.current + 15, { celebrate: true });
              }
            }, isOff ? 0 : 450);
            later(() => setFloatingChip(null), 1600);
          }
        } else {
          setSolutionStep(nextStep);
          setCoachExp('thumbsup');
          setBubbleText('Good. Keep going, there is more.');
          later(() => {
            const oppUci = currentPuzzle.solutionUci?.[nextStep];
            const played = oppUci
              ? chess.move({ from: oppUci.slice(0, 2), to: oppUci.slice(2, 4), promotion: oppUci.slice(4) || undefined })
              : chess.move(currentPuzzle.solution[nextStep]);
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
      setBubbleText(
        givesMate
          ? 'That mates too, but not the way this puzzle is built. Try the main line.'
          : chess.inCheck()
          ? 'A check, but it lets the king escape. Look for something more forcing.'
          : 'Not quite. That gives the opponent time. Look for checks, captures and threats first.'
      );
      sound.puzzleWrong();
      if (source === 'server') {
        // the server counts the first attempt only; report it once per puzzle
        if (failReportedIdRef.current !== currentPuzzle.id) {
          failReportedIdRef.current = currentPuzzle.id;
          void puzzleRepository
            .submitAttempt(currentPuzzle.id, { solved: false, timeSeconds: timerSeconds, usedHint: hintUsedIdRef.current === currentPuzzle.id })
            .then((res) => {
              if (res) applyAttemptResult(res);
            });
        }
        setPenalisedPuzzleId(currentPuzzle.id);
      } else {
        setStreak(0);
        storage.set('all_chess_puzzle_streak', 0);
        if (penalisedPuzzleId !== currentPuzzle.id) {
          setRatingTo(ratingRef.current - 10);
          setPenalisedPuzzleId(currentPuzzle.id);
        }
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
    setLastMove(uciToMove(currentPuzzle.setupMoveUci));
    setCoachExp('thinking');
    setBubbleText(stripSideToMove(currentPuzzle.goal));
  };

  /** The move the puzzle expects next, as a legal move in the given position (UCI when we have it, else SAN). */
  const findExpectedMove = (fenNow: string) => {
    const moves = new Chess(fenNow).moves({ verbose: true });
    const uci = currentPuzzle.solutionUci?.[solutionStep];
    if (uci) {
      const byUci = moves.find((m) => m.from === uci.slice(0, 2) && m.to === uci.slice(2, 4) && (m.promotion || '') === uci.slice(4));
      if (byUci) return byUci;
    }
    const san = currentPuzzle.solution[solutionStep];
    return moves.find((m) => m.san === san || m.san.replace(/[+#]/g, '') === san.replace(/[+#]/g, ''));
  };

  // Hint, first press: light up the piece to move. Second press: draw the move.
  const handleHint = () => {
    const mv = findExpectedMove(chess.fen());
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
    // a hint means this solve no longer earns rating (or streak)
    hintUsedIdRef.current = currentPuzzle.id;
    setPenalisedPuzzleId(currentPuzzle.id);
  };

  const handleShowSolution = () => {
    const san = currentPuzzle.solution[solutionStep];
    const mv = findExpectedMove(chess.fen());
    if (!mv) return;
    handleRetry();
    setHintSquare(mv.from);
    hintUsedIdRef.current = currentPuzzle.id;
    setBubbleText(`The move is ${san}. Play it on the board.`);
  };

  // ---- getting puzzles: server first, built-in set only as a fallback ----
  const closeOverlays = () => {
    setShowLevelMap(false);
    setShowRewardCascade(false);
    setMapHopFrom(null);
  };

  const showPuzzle = (p: Puzzle, from: 'server' | 'local') => {
    if (from === 'server' && source === 'server') {
      historyRef.current.push(currentPuzzle);
      if (historyRef.current.length > 30) historyRef.current.shift();
      setHistoryLen(historyRef.current.length);
    }
    closeOverlays();
    setSource(from);
    setCurrentPuzzle(p);
    // only puzzles the player is actually working through are counted, not the one preloaded behind the map
    if (startedRef.current) setSessionCount((n) => n + 1);
  };

  const goToLocal = (index: number) => {
    const i = ((index % MOCK_PUZZLES.length) + MOCK_PUZZLES.length) % MOCK_PUZZLES.length;
    setLocalIndex(i);
    storage.set('all_chess_puzzle_index', i);
    showPuzzle(MOCK_PUZZLES[i], 'local');
  };

  const fetchNext = async (themeId: string): Promise<'ok' | 'stale' | 'fail'> => {
    const myId = ++requestIdRef.current;
    setLoadingNext(true);
    const p = await puzzleRepository.getNextPuzzle(themeId || undefined);
    if (myId !== requestIdRef.current) return 'stale';
    setLoadingNext(false);
    if (!p) return 'fail';
    showPuzzle(p, 'server');
    return 'ok';
  };

  // On open: load the saved rating/streak and the theme list, then a first puzzle near that rating.
  useEffect(() => {
    let alive = true;
    (async () => {
      const [state, list] = await Promise.all([puzzleRepository.getRating(), puzzleRepository.getThemes()]);
      if (!alive) return;
      if (state) {
        setRatingTo(state.rating, { animate: false });
        setStreak(state.streak);
        storage.set('all_chess_puzzle_streak', state.streak);
      }
      setThemes(list);
      if (!startedRef.current) await fetchNext(theme);
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = async () => {
    if (loadingNext) return;
    const result = await fetchNext(theme);
    if (result === 'ok' || result === 'stale') return;
    if (source === 'server') {
      closeOverlays();
      setCoachExp('thinking');
      setBubbleText('I could not load the next puzzle. Check your connection and try again.');
      return;
    }
    goToLocal(localIndex + 1);
  };

  const handlePrev = () => {
    if (source === 'server') {
      const prev = historyRef.current.pop();
      setHistoryLen(historyRef.current.length);
      if (prev) {
        closeOverlays();
        setCurrentPuzzle(prev);
        setSessionCount((n) => Math.max(1, n - 1));
      }
      return;
    }
    goToLocal(localIndex - 1);
  };

  // A tile on the level map: a puzzle from that level's rating band
  const handleSelectLevel = async (index: number) => {
    const band = levelBand(index + 1);
    setStarted(true);
    const myId = ++requestIdRef.current;
    setLoadingNext(true);
    const p = await puzzleRepository.getPuzzleInRange(band.min, band.max, theme || undefined);
    if (myId !== requestIdRef.current) return;
    setLoadingNext(false);
    if (p) {
      showPuzzle(p, 'server');
      return;
    }
    if (source === 'local') {
      goToLocal(index);
      return;
    }
    closeOverlays();
    setBubbleText('No new puzzles for that level right now. Try another level or theme.');
  };

  const handleThemeChange = (value: string) => {
    setTheme(value);
    storage.set(THEME_STORAGE_KEY, value);
    void fetchNext(value);
  };

  const themeOptions = useMemo(
    () => [...themes].sort((a, b) => themeLabel(a.theme).localeCompare(themeLabel(b.theme))),
    [themes]
  );
  const themePicker = (onDark: boolean) =>
    themes.length === 0 ? null : (
      <label className={`flex items-center gap-2 text-[13px] font-semibold ${onDark ? 'text-white/90' : 'text-theme-muted'}`}>
        <span className="flex-shrink-0">Theme</span>
        <select
          value={theme}
          onChange={(e) => handleThemeChange(e.target.value)}
          className={`flex-1 min-w-0 rounded-md px-2 py-1.5 text-[14px] font-semibold border ${
            onDark ? 'bg-black/50 text-white border-white/25' : 'bg-theme-raised text-theme-text border-theme-border'
          }`}
          style={{ colorScheme: 'dark' }}
          aria-label="Puzzle theme"
          data-testid="theme-select"
        >
          <option value="">Any theme</option>
          {themeOptions.map((t) => (
            <option key={t.theme} value={t.theme}>
              {themeLabel(t.theme)} ({t.count.toLocaleString()})
            </option>
          ))}
        </select>
      </label>
    );

  const isWhiteToMove = currentPuzzle.fen.split(' ')[1] === 'w';
  const orientation = isWhiteToMove ? 'white' : 'black';

  const bubbleMessages: BubbleMessage[] = useMemo(
    () => [
      {
        id: `puzzle-${currentPuzzle.id}-${status}-${bubbleText.slice(0, 16)}`,
        text: bubbleText,
        icon: status === 'solved' ? 'solved' : status === 'failed' ? 'incorrect' : isWhiteToMove ? 'white-to-move' : 'black-to-move',
        title: status === 'solved' ? 'Solved' : status === 'failed' ? 'Incorrect' : `${isWhiteToMove ? 'White' : 'Black'} to move`,
      },
    ],
    [currentPuzzle.id, status, bubbleText, isWhiteToMove]
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

  const progressPct = levelProgress(puzzleRating) * 100;

  // rating, change, streak and level progress (also drawn over the map on the puzzle home)
  const ratingBlock = (onDark: boolean) => (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2.5">
        <span className={`text-[38px] leading-none font-extrabold font-display tabular-nums ${onDark ? 'text-white drop-shadow' : 'text-theme-text'}`} data-testid="puzzle-rating">
          {displayedRating}
        </span>
        <AnimatePresence>
          {ratingDelta !== null && ratingDelta !== 0 && (
            <motion.span
              key={`d-${ratingDelta}-${currentPuzzle.id}`}
              initial={isOff ? false : { opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={`text-[15px] font-bold tabular-nums ${ratingDelta > 0 ? 'text-[var(--class-best)]' : 'text-[var(--class-blunder)]'}`}
            >
              {ratingDelta > 0 ? `+${ratingDelta}` : ratingDelta}
            </motion.span>
          )}
        </AnimatePresence>
        <span className="flex items-center gap-0.5 text-[17px] font-bold text-[var(--color-orange)]" title="Solved in a row" data-testid="puzzle-streak">
          <Flame size={17} className="fill-[var(--color-orange)]" />
          <motion.span key={streak} initial={isFull ? { scale: 1.5 } : false} animate={{ scale: 1 }} transition={{ duration: 0.25 }}>
            {streak}
          </motion.span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className={`relative flex-1 h-[14px] rounded-full overflow-hidden ${onDark ? 'bg-black/45' : 'bg-white/[0.14] dark:bg-white/[0.14]'}`} role="progressbar" aria-valuenow={Math.round(progressPct)} aria-valuemax={100} aria-label={`Level ${level} progress`}>
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: 'var(--color-orange)' }}
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
          <PuzzlePieceBadge n={level + 1} size={44} />
        </button>
      </div>
    </div>
  );

  const actionBar = (
              <div className="flex-shrink-0 px-4 py-3 bg-black/[0.03] dark:bg-black/15 border-t border-theme-border/60 space-y-2">
                {status === 'solving' && (
                  <Button variant="secondary" size="lg" fullWidth className="!h-14 !text-[20px] !font-extrabold font-display" icon={<Lightbulb size={22} className="text-amber-400 fill-amber-400/30" />} onClick={handleHint} disabled={!!hintArrow} data-testid="hint-button">
                    {hintSquare ? 'Show move' : 'Hint'}
                  </Button>
                )}
                {status === 'failed' && (
                  <div className="flex gap-2">
                    <Button variant="secondary" size="lg" className="flex-1" icon={<RotateCcw size={18} />} onClick={handleRetry}>
                      Retry
                    </Button>
                    <Button variant="secondary" size="lg" className="!px-4" icon={<Eye size={18} />} onClick={handleShowSolution} aria-label="Show the solution" title="Show the solution" />
                    <Button variant="primary" size="lg" className="!px-5" icon={<NextIcon size={20} />} onClick={handleNext} disabled={loadingNext} aria-label="Next puzzle" title="Next puzzle" />
                  </div>
                )}
                {status === 'solved' && (
                  <div className="flex gap-2">
                    <Button variant="secondary" size="lg" className="!px-4" icon={<RotateCcw size={18} />} onClick={handleRetry} aria-label="Try this puzzle again" title="Try again" />
                    <Button variant="primary" size="lg" className="flex-1" onClick={handleNext} disabled={loadingNext} data-testid="next-puzzle">
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
                    <button type="button" onClick={handlePrev} disabled={source === 'server' && historyLen === 0} className="p-2 rounded hover:text-theme-text hover:bg-theme-raised disabled:opacity-30 disabled:hover:bg-transparent" title="Previous puzzle" aria-label="Previous puzzle">
                      <ChevronLeft size={18} />
                    </button>
                    <span className="text-xs font-semibold tabular-nums px-1">
                      {source === 'server' ? `Puzzle ${sessionCount}` : `${localIndex + 1} / ${MOCK_PUZZLES.length}`}
                    </span>
                    <button type="button" onClick={handleNext} className="p-2 -mr-2 rounded hover:text-theme-text hover:bg-theme-raised" title="Next puzzle" aria-label="Next puzzle">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
  );

  const headerEl = (
        <SidebarHeader
          title="Puzzles"
          icon={<PuzzlePieceBadge n={level} size={46} />}
          left={
            showLevelMap ? (
              <HeaderIconButton onClick={() => setShowLevelMap(false)} aria-label="Back to the puzzle">
                <ChevronLeft size={22} />
              </HeaderIconButton>
            ) : undefined
          }
          right={
            <>
              <HeaderIconButton
                onClick={() => updateSettings({ soundEnabled: !soundEnabled })}
                aria-label={soundEnabled ? 'Mute sounds' : 'Turn sounds on'}
                title={soundEnabled ? 'Mute sounds' : 'Turn sounds on'}
              >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </HeaderIconButton>
              {showLevelMap && (
                <HeaderIconButton onClick={() => setShowLevelMap(false)} aria-label="Close the level map">
                  <X size={20} />
                </HeaderIconButton>
              )}
            </>
          }
        />
  );

  const boardEl = (
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

          <RewardCascade isOpen={showRewardCascade} levelNumber={Math.max(1, level - 1)} pointsEarned={ratingDelta && ratingDelta > 0 ? ratingDelta : 15} onNextPuzzle={handleNext} />
        </div>
  );

  const panel = (
      <aside
        className="w-full flex-1 min-h-0 lg:flex-none lg:w-[400px] xl:w-[420px] flex-shrink-0 flex flex-col lg:h-[calc(100vh-32px)] lg:max-h-[calc(100vh-32px)] rounded-none lg:rounded-[5px] overflow-hidden"
        style={{ background: 'var(--side-panel-bg)' }}
        data-testid="puzzle-panel"
      >
        {headerEl}

        <AnimatePresence mode="wait" initial={false}>
          {!showLevelMap && !started ? (
            <motion.div
              key="home"
              initial={isOff ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: isOff ? 0 : 0.2 }}
              className="flex-1 min-h-0 relative overflow-hidden"
              data-testid="puzzle-home"
            >
              <IsoLevelMap
                levelCount={MAP_LEVELS}
                currentIndex={Math.min(MAP_LEVELS - 1, level - 1)}
                onSelect={(i) => {
                  if (i <= level - 1) void handleSelectLevel(i);
                }}
                className="absolute inset-0"
              />
              <div className="absolute top-0 inset-x-0 px-4 pt-4 pb-12 bg-gradient-to-b from-black/55 via-black/25 to-transparent pointer-events-none">
                <div className="pointer-events-auto">
                  <CoachSpeech
                    expression="wave"
                    size={80}
                    text={
                      puzzleRating === 1200 && streak === 0
                        ? 'Puzzles train the patterns you will meet in your own games. Ready when you are!'
                        : `Welcome back! You are on level ${level}. Solve puzzles to raise your rating and climb.`
                    }
                  />
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 px-4 pb-4 pt-16 bg-gradient-to-t from-black/75 via-black/45 to-transparent space-y-3">
                {ratingBlock(true)}
                {themePicker(true)}
                <Button variant="primary" size="lg" fullWidth className="!h-14 !text-[22px] !font-extrabold font-display" onClick={() => setStarted(true)} data-testid="solve-puzzles">
                  Solve puzzles
                </Button>
                {source === 'server' && (
                  <p className="text-[11px] text-white/70 text-center">
                    Puzzles from the{' '}
                    <a href="https://database.lichess.org/#puzzles" target="_blank" rel="noopener noreferrer" className="underline">
                      Lichess puzzle database
                    </a>
                  </p>
                )}
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
                currentIndex={Math.min(MAP_LEVELS - 1, mapHopFrom !== null ? mapHopFrom + 1 : level - 1)}
                hopFrom={mapHopFrom}
                onSelect={(i) => {
                  if (i <= level - 1) void handleSelectLevel(i);
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
                {themePicker(false)}

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
              <div className="px-4 pb-3 flex items-center gap-2 text-[18px] text-theme-muted tabular-nums">
                <Clock3 size={18} />
                {formatTime(timerSeconds)}
              </div>

              {actionBar}
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
  );

  // Back in the middle of a puzzle asks first instead of throwing the attempt away
  const leaveGuard = (
    <LeaveGuard
      when={started && status === 'solving'}
      title="Leave this puzzle?"
      message="You are in the middle of a puzzle. If you leave now, this attempt is lost."
      leaveLabel="Leave puzzle"
      stayLabel="Keep solving"
    />
  );

  // --- PHONE: the puzzle home is just the map panel; solving is coach above a full-width board, as in the app ---
  if (isPhone) {
    if (started && !showLevelMap) {
      return (
        <div className="flex flex-col h-full w-full bg-theme-bg select-none overflow-hidden" data-testid="puzzle-mobile">
          {leaveGuard}
          {headerEl}
          <div className="flex-shrink-0 px-2 pt-2 pb-1 h-[150px] flex items-end overflow-hidden">
            <CoachSpeech expression={coachExp} messages={bubbleMessages} size={72} className="w-full !items-end" />
          </div>
          <div className="w-full flex-shrink-0">{boardEl}</div>
          <div className="px-4 pt-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">{ratingBlock(false)}</div>
            <span className="flex items-center gap-1 text-[16px] text-theme-muted tabular-nums"><Clock3 size={16} />{formatTime(timerSeconds)}</span>
          </div>
          <div className="flex-1 min-h-0" />
          {actionBar}
        </div>
      );
    }
    return (
      <div className="flex flex-col h-full w-full bg-theme-bg select-none overflow-hidden" data-testid="puzzle-mobile-home">
        {panel}
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-theme-bg select-none overflow-y-auto lg:overflow-hidden lg:items-center lg:justify-center lg:gap-6 lg:px-6 lg:py-4 pb-20 lg:pb-4">
      {/* Board: as large as the viewport allows, like the reference (about 96% of the height) */}
      {leaveGuard}
      <div className="flex-none lg:h-full flex items-center justify-center p-2 sm:p-4 lg:p-0 min-w-0 lg:flex-1 lg:max-w-[calc(100vh-32px)]">
        {boardEl}
      </div>

      {panel}
    </div>
  );
};
export default PuzzleScreen;
