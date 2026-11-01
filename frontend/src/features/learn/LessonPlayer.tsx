import React, { useState, useMemo } from 'react';
import { Chess } from 'chess.js';
import { LessonStage, LessonStep, CoachExpression } from '@/data/types';
import { Board } from '@/features/board/Board';
import { CoachSpeech } from '@/features/coach/CoachSpeech';
import { Button } from '@/components/Button';
import { useSettingsStore } from '@/data/settingsStore';
import { BOARD_THEMES, PIECE_SETS } from '@/data/boardThemes';
import { ChevronLeft } from 'lucide-react';
import { usePhoneLayout } from '@/lib/useMediaQuery';
import { SECTION_THEMES } from './learnLayout';

const EMPTY_ARROWS: never[] = [];
const EMPTY_HIGHLIGHTS: never[] = [];

interface LessonPlayerProps {
  stage: LessonStage;
  onComplete: () => void;
  onExit: () => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({ stage, onComplete, onExit }) => {
  const phone = usePhoneLayout();
  const { boardThemeId, pieceSetId, animationSpeed, coordinates } = useSettingsStore();
  const theme = SECTION_THEMES[stage.category];
  const currentBoardTheme = BOARD_THEMES.find((t) => t.id === boardThemeId) || BOARD_THEMES[0];
  const currentPieceSet = PIECE_SETS.find((p) => p.id === pieceSetId) || PIECE_SETS[0];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepSolved, setStepSolved] = useState(false);
  const [boardFen, setBoardFen] = useState<string | null>(null);
  const [attemptError, setAttemptError] = useState<string | null>(null);
  const [coachExp, setCoachExp] = useState<CoachExpression>('neutral');
  const [solvedSquare, setSolvedSquare] = useState<string | null>(null);

  const steps =
    stage.steps.length > 0
      ? stage.steps
      : [
          {
            id: 'default-step-1',
            title: stage.title,
            instruction: stage.description,
            buttonText: "Let's Start!",
            fen: '8/8/8/4k3/8/8/4K3/R7 w - - 0 1',
            requiredMove: 'Ra4',
            arrows: [{ from: 'a1', to: 'a4', color: 'orange' as const }],
            highlightSquares: ['a4'],
            isInteractive: true,
            explanation: 'The rook creates an impassable horizontal fence across the board.',
          },
        ];

  const currentStep: LessonStep = steps[currentStepIndex] || steps[0];
  const currentFen = boardFen || currentStep.fen;
  const isInteractive = Boolean(currentStep.isInteractive);

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setStepSolved(false);
      setSolvedSquare(null);
      setBoardFen(null);
      setAttemptError(null);
      setCoachExp('neutral');
    } else {
      onComplete();
    }
  };

  const handleMove = (from: string, to: string) => {
    if (stepSolved) return;
    try {
      const chess = new Chess(currentStep.fen);
      const res = chess.move({ from, to, promotion: 'q' });
      if (!res) {
        setAttemptError('Illegal chess move. Please try again.');
        setCoachExp('thinking');
        return;
      }

      const playedSan = res.san;
      const targetSan = currentStep.requiredMove || '';
      const isMatch =
        targetSan === ''
          ? currentStep.highlightSquares?.includes(to)
          : playedSan === targetSan ||
            playedSan.replace(/[+#]/g, '') === targetSan.replace(/[+#]/g, '') ||
            (from === targetSan.slice(0, 2) && to === targetSan.slice(2, 4));

      if (isMatch) {
        setBoardFen(chess.fen());
        setSolvedSquare(to);
        setStepSolved(true);
        setAttemptError(null);
        setCoachExp('brilliant');
      } else {
        setAttemptError(`Move ${playedSan} is not what the lesson asks for. Try again!`);
        setCoachExp('embarrassed');
      }
    } catch {
      setAttemptError('Invalid move. Try again!');
      setCoachExp('thinking');
    }
  };

  const isAdvanceAllowed = !isInteractive || stepSolved;

  const lessonMessages = useMemo(
    () => [
      {
        id: `lesson-${currentStep.id}-${stepSolved ? 'solved' : attemptError ? 'err' : 'inst'}`,
        text: stepSolved
          ? currentStep.explanation || 'Great job! Moving forward.'
          : attemptError
          ? attemptError
          : currentStep.instruction,
      },
    ],
    [currentStep.id, currentStep.explanation, currentStep.instruction, stepSolved, attemptError]
  );

  const board = (
    <div className="aspect-square w-full" data-testid="lesson-board">
      <Board
        fen={currentFen}
        boardTheme={currentBoardTheme}
        pieceSet={currentPieceSet}
        animationSpeed={animationSpeed}
        coordinates={coordinates}
        arrows={currentStep.arrows || EMPTY_ARROWS}
        highlights={stepSolved ? EMPTY_HIGHLIGHTS : currentStep.highlightSquares || EMPTY_HIGHLIGHTS}
        successSquares={solvedSquare ? [solvedSquare] : EMPTY_HIGHLIGHTS}
        interactive={isInteractive && !stepSolved}
        onMove={handleMove}
      />
    </div>
  );

  const header = (
    <div className="relative flex items-center justify-center h-[60px] lg:h-[72px] px-3 flex-shrink-0" style={{ background: 'var(--side-header-bg)' }}>
      <button type="button" onClick={onExit} aria-label="Back to lessons" data-testid="lesson-exit" className="absolute left-2 w-10 h-10 flex items-center justify-center rounded-[4px] text-theme-muted hover:text-theme-text hover:bg-white/[0.06]">
        <ChevronLeft size={28} />
      </button>
      <h1 className="font-display font-extrabold text-[22px] lg:text-[26px] leading-none truncate max-w-[70%]" style={{ color: 'var(--color-text-strong)' }}>
        {stage.title}
      </h1>
    </div>
  );

  // one pip per step, filled as you go (like the lesson progress on Chess.com)
  const pips = (
    <div className="flex gap-1.5 px-4 pt-3" role="progressbar" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={currentStepIndex + 1} aria-label={`Step ${currentStepIndex + 1} of ${steps.length}`}>
      {steps.map((st, i) => (
        <span key={st.id} className="flex-1 h-2 rounded-full" style={{ background: i < currentStepIndex || (i === currentStepIndex && stepSolved) ? '#81b64c' : i === currentStepIndex ? theme.hotTop : 'rgba(255,255,255,0.14)' }} />
      ))}
    </div>
  );

  const coach = (
    <div className="px-3 pt-3">
      <CoachSpeech expression={stepSolved ? 'brilliant' : coachExp !== 'neutral' ? coachExp : 'thinking'} messages={lessonMessages} size={phone ? 64 : 80} />
    </div>
  );

  const cta = (
    <div className="flex-shrink-0 p-3 lg:p-4" style={{ background: 'var(--side-header-bg)' }}>
      <Button variant="primary" size="lg" className="!h-14 w-full !text-[22px] !font-extrabold font-display" disabled={!isAdvanceAllowed} onClick={handleNextStep} data-testid="lesson-cta">
        {!isAdvanceAllowed ? 'Make your move' : currentStepIndex < steps.length - 1 ? currentStep.buttonText || 'Continue' : 'Finish Lesson'}
      </Button>
    </div>
  );

  if (phone) {
    return (
      <div className="flex flex-col h-full w-full overflow-hidden" data-testid="lesson-mobile" style={{ background: 'var(--side-panel-bg)' }}>
        {header}
        {pips}
        {coach}
        <div className="flex-1 min-h-0 flex items-center px-0 py-2">{board}</div>
        {cta}
      </div>
    );
  }

  return (
    <div className="flex h-full w-full overflow-hidden items-center justify-center gap-6 px-6 py-4">
      <div className="flex-1 min-w-0 max-w-[calc(100vh-32px)]">{board}</div>
      <aside className="w-[420px] xl:w-[450px] flex-shrink-0 h-[calc(100vh-32px)] rounded-[5px] overflow-hidden flex flex-col" style={{ background: 'var(--side-panel-bg)' }} data-testid="lesson-panel">
        {header}
        {pips}
        {coach}
        <div className="flex-1" />
        {cta}
      </aside>
    </div>
  );
};
