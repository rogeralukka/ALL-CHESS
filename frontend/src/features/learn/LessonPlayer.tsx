import React, { useState, useMemo } from 'react';
import { Chess } from 'chess.js';
import { LessonStage, LessonStep, CoachExpression } from '@/data/types';
import { Board } from '@/features/board/Board';
import { CoachAvatar } from '@/features/coach/CoachAvatar';
import { CoachBubble } from '@/features/coach/CoachBubble';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useSettingsStore } from '@/data/settingsStore';
import { BOARD_THEMES, PIECE_SETS } from '@/data/boardThemes';
import { ArrowLeft, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';

const EMPTY_ARROWS: never[] = [];
const EMPTY_HIGHLIGHTS: never[] = [];

interface LessonPlayerProps {
  stage: LessonStage;
  onComplete: () => void;
  onExit: () => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({ stage, onComplete, onExit }) => {
  const { boardThemeId, pieceSetId, animationSpeed } = useSettingsStore();
  const currentBoardTheme = BOARD_THEMES.find((t) => t.id === boardThemeId) || BOARD_THEMES[0];
  const currentPieceSet = PIECE_SETS.find((p) => p.id === pieceSetId) || PIECE_SETS[0];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepSolved, setStepSolved] = useState(false);
  const [boardFen, setBoardFen] = useState<string | null>(null);
  const [attemptError, setAttemptError] = useState<string | null>(null);
  const [coachExp, setCoachExp] = useState<CoachExpression>('neutral');

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
            arrows: [{ from: 'a1', to: 'a4', color: 'green' as const }],
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

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full w-full overflow-hidden">
      {/* Board Zone */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 bg-theme-page min-w-0">
        <div className="w-full max-w-[min(88vh,640px)] flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-semibold text-theme-muted">
            <button
              type="button"
              onClick={onExit}
              className="flex items-center gap-1.5 hover:text-theme-text transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Exit Lesson</span>
            </button>
            <span className="font-bold text-amber-500 uppercase">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>

          <div className="aspect-square w-full">
            <Board
              fen={currentFen}
              boardTheme={currentBoardTheme}
              pieceSet={currentPieceSet}
              animationSpeed={animationSpeed}
              arrows={currentStep.arrows || EMPTY_ARROWS}
              highlights={currentStep.highlightSquares || EMPTY_HIGHLIGHTS}
              interactive={isInteractive && !stepSolved}
              onMove={handleMove}
            />
          </div>
        </div>
      </div>

      {/* Mode Panel */}
      <div className="w-full lg:w-[420px] flex-shrink-0 flex flex-col h-full bg-theme-card border-t lg:border-t-0 lg:border-l border-theme-border shadow-xl p-5 justify-between">
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <CoachAvatar
              expression={stepSolved ? 'brilliant' : coachExp !== 'neutral' ? coachExp : 'thinking'}
              mode="bust"
              size={68}
            />
            <div className="flex-1 min-w-0">
              <CoachBubble
                messages={lessonMessages}
              />
            </div>
          </div>

          <Card className="p-4 space-y-2 bg-theme-raised/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-wide">
                {stage.category} Mastery
              </span>
              <span className="text-xs font-mono font-bold text-theme-muted">
                {isInteractive ? 'Interactive Step' : 'Demonstration'}
              </span>
            </div>
            <h3 className="font-bold text-lg text-theme-text font-display">
              {currentStep.title}
            </h3>
            <p className="text-sm text-theme-muted leading-relaxed">
              {currentStep.instruction}
            </p>
          </Card>

          {stepSolved && (
            <div className="flex items-center gap-2 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-emerald-500 font-semibold text-sm animate-in fade-in">
              <CheckCircle2 size={18} />
              <span>Step objective solved!</span>
            </div>
          )}

          {attemptError && !stepSolved && (
            <div className="flex items-center gap-2 p-3 bg-rose-500/15 border border-rose-500/30 rounded-lg text-rose-400 font-semibold text-xs animate-in fade-in">
              <AlertCircle size={16} />
              <span>{attemptError}</span>
            </div>
          )}
        </div>

        {/* Primary Bottom Button */}
        <div className="pt-4">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={!isAdvanceAllowed}
            icon={<ArrowRight size={18} />}
            onClick={handleNextStep}
          >
            {!isAdvanceAllowed
              ? 'Make move on board to continue'
              : currentStepIndex < steps.length - 1
              ? currentStep.buttonText || 'Next Step'
              : 'Complete Lesson (+XP)'}
          </Button>
        </div>
      </div>
    </div>
  );
};
