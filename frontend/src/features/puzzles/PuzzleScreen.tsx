import React, { useState, useEffect, useMemo } from 'react';
import { Chess } from 'chess.js';
import { MOCK_PUZZLES } from '@/data/mock/mockPuzzles';
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
import { CoachExpression, BoardBadge } from '@/data/types';
import { sound } from '@/lib/sound';
import {
  Lightbulb,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const PuzzleScreen: React.FC = () => {
  const { boardThemeId, pieceSetId, animationSpeed } = useSettingsStore();
  const currentBoardTheme = BOARD_THEMES.find((t) => t.id === boardThemeId) || BOARD_THEMES[0];
  const currentPieceSet = PIECE_SETS.find((p) => p.id === pieceSetId) || PIECE_SETS[0];

  const [puzzleIndex, setPuzzleIndex] = useState<number>(0);
  const currentPuzzle = MOCK_PUZZLES[puzzleIndex] || MOCK_PUZZLES[0];

  const [chess] = useState(() => new Chess());
  const [fen, setFen] = useState<string>(currentPuzzle.fen);
  const [status, setStatus] = useState<'solving' | 'solved' | 'failed'>('solving');
  const [solutionStep, setSolutionStep] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [showRewardCascade, setShowRewardCascade] = useState<boolean>(false);
  const [puzzleRating, setPuzzleRating] = useState<number>(() =>
    storage.get('all_chess_puzzle_rating', 1200)
  );
  const [lastSolvedSquare, setLastSolvedSquare] = useState<string | null>(null);

  const [coachExp, setCoachExp] = useState<CoachExpression>('thinking');
  const [bubbleText, setBubbleText] = useState<string>(currentPuzzle.goal);

  // Timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'solving') {
      interval = setInterval(() => setTimerSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  // Load new puzzle
  useEffect(() => {
    chess.load(currentPuzzle.fen);
    setFen(currentPuzzle.fen);
    setStatus('solving');
    setSolutionStep(0);
    setTimerSeconds(0);
    setShowRewardCascade(false);
    setCoachExp('thinking');
    setBubbleText(currentPuzzle.goal);
  }, [currentPuzzle, chess]);

  // Handle Move
  const handleMove = (_from: string, _to: string, promotion?: string) => {
    if (status !== 'solving') return false;

    try {
      const legalMoves = chess.moves({ verbose: true });
      const expectedMoveSan = currentPuzzle.solution[solutionStep];

      // Find matching move
      const matchingMove = legalMoves.find(
        (m) =>
          m.from === _from &&
          m.to === _to &&
          (!promotion || m.promotion === promotion)
      );

      if (!matchingMove) return false;

      // Check if move matches solution SAN
      if (matchingMove.san === expectedMoveSan || currentPuzzle.solution.length === 1) {
        chess.move(matchingMove);
        setFen(chess.fen());

        const nextStep = solutionStep + 1;
        if (nextStep >= currentPuzzle.solution.length) {
          // --- BEAT 1: Immediate solve state ---
          setLastSolvedSquare(_to);
          setStatus('solved');
          setCoachExp('brilliant');
          setBubbleText('Bingo! You got it. Outstanding tactical foresight!');
          sound.puzzleCorrect();
          const newRating = puzzleRating + 15;
          setPuzzleRating(newRating);
          storage.set('all_chess_puzzle_rating', newRating);

          // --- BEAT 3: Trigger celebration cascade after 2.5s ---
          setTimeout(() => {
            setShowRewardCascade(true);
          }, 2500);
        } else {
          setSolutionStep(nextStep);
          // Play opponent auto-reply
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
        // Mistake / Fail
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
    setSolutionStep(0);
    setCoachExp('thinking');
    setBubbleText(currentPuzzle.goal);
  };

  const handleNext = () => {
    setShowRewardCascade(false);
    setLastSolvedSquare(null);
    setPuzzleIndex((prev) => (prev + 1) % MOCK_PUZZLES.length);
  };

  const handlePrev = () => {
    setShowRewardCascade(false);
    setLastSolvedSquare(null);
    setPuzzleIndex((prev) => (prev - 1 + MOCK_PUZZLES.length) % MOCK_PUZZLES.length);
  };

  const isWhiteToMove = currentPuzzle.fen.includes(' w ');

  const bubbleMessages: BubbleMessage[] = useMemo(
    () => [
      {
        id: `puz-msg-${puzzleIndex}-${status}`,
        text: bubbleText,
        evalText: `${isWhiteToMove ? 'White' : 'Black'} to move`,
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
    <div className="flex-1 flex flex-col lg:flex-row h-full w-full overflow-hidden relative">
      {/* Center Zone: Board */}
      <div className="flex-1 flex flex-col items-center justify-center p-3 md:p-6 bg-theme-page min-w-0 relative">
        <div className="w-full max-w-[min(88vh,680px)] flex flex-col gap-2">
          {/* Header Row: Puzzle Level, Timer, Rating */}
          <div className="flex items-center justify-between text-xs px-2 py-1 text-theme-muted font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 font-bold flex items-center justify-center text-[10px] border border-amber-500/40">
                🧩
              </span>
              <span className="font-bold text-theme-text">Puzzle #{puzzleIndex + 1}</span>
              <span className="font-mono">({currentPuzzle.rating})</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono">{formatTime(timerSeconds)}</span>
              <span className="px-2 py-0.5 rounded-full bg-theme-raised font-mono font-bold text-amber-500 border border-theme-border">
                Rating {puzzleRating}
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

            {/* Reward Cascade Celebration Overlay */}
            <RewardCascade
              isOpen={showRewardCascade}
              levelNumber={puzzleIndex + 1}
              pointsEarned={15}
              onNextPuzzle={handleNext}
            />
          </div>

          {/* Bottom Bar: Prev/Next & Themes */}
          <div className="flex items-center justify-between text-xs px-2 py-1 text-theme-muted">
            <span className="capitalize">{currentPuzzle.theme.join(' • ')}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrev}
                className="hover:text-theme-text transition-colors p-1"
                title="Previous puzzle"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="hover:text-theme-text transition-colors p-1"
                title="Next puzzle"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Zone: Mode Panel (~420px) */}
      <div className="w-full lg:w-[420px] flex-shrink-0 flex flex-col h-full bg-theme-card border-t lg:border-t-0 lg:border-l border-theme-border shadow-xl z-20">
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
              <span>Level {puzzleIndex + 1}</span>
            </div>
            <ProgressBar value={puzzleIndex + 1} max={MOCK_PUZZLES.length} height={6} />
          </Card>

          {/* Actions: Retry / Next / Hint */}
          <div className="flex flex-wrap gap-2 pt-2">
            {status === 'failed' && (
              <Button
                variant="secondary"
                size="md"
                icon={<RotateCcw size={16} />}
                onClick={handleRetry}
              >
                Retry
              </Button>
            )}

            {status === 'solving' && (
              <Button
                variant="highlight"
                size="md"
                icon={<Lightbulb size={16} />}
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
                fullWidth
                icon={<Sparkles size={16} />}
                onClick={handleNext}
              >
                Next Puzzle
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PuzzleScreen;
