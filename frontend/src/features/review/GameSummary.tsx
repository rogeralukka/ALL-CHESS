import React, { useState, useMemo } from 'react';
import { Game, Move, CoachExpression, BoardBadge, Arrow } from '@/data/types';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { CoachSpeech } from '@/features/coach/CoachSpeech';
import { MoveQualityTable } from './MoveQualityTable';
import { PhaseGradesCard } from './PhaseGradesCard';
import { Board } from '@/features/board/Board';
import { EvalBar } from '@/features/board/EvalBar';
import { EvalGraph } from '@/features/board/EvalGraph';
import { useSettingsStore } from '@/data/settingsStore';
import { BOARD_THEMES, PIECE_SETS } from '@/data/boardThemes';
import { Sparkles, Trophy, ArrowLeft, RotateCcw } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface GameSummaryProps {
  game: Game;
  onStartReview: () => void;
}

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const clamp = (val: number) => Math.min(6.0, Math.max(-6.0, val));

function generateCoachSummary(game: Game): { text: string; expression: CoachExpression } {
  const isWhiteWin = game.result === '1-0';
  const isBlackWin = game.result === '0-1';
  const userIsWhite = game.white.username === 'You';
  const userWon = (userIsWhite && isWhiteWin) || (!userIsWhite && isBlackWin);
  const userLost = (userIsWhite && isBlackWin) || (!userIsWhite && isWhiteWin);

  // Find biggest swing move (ignoring final checkmate move, clamping to graph momentum scale)
  const clamp = (val: number) => Math.min(6.0, Math.max(-6.0, val));
  let biggestSwingMove: Move | null = null;
  let maxSwing = 0;
  for (let idx = 0; idx < game.moves.length; idx++) {
    const m = game.moves[idx];
    if (idx === game.moves.length - 1 && m.san.includes('#') && game.moves.length > 2) {
      continue;
    }
    const prev = idx === 0 ? 0.2 : clamp(game.moves[idx - 1].eval?.eval ?? 0);
    const curr = clamp(m.eval?.eval ?? 0);
    const diff = Math.abs(curr - prev);
    if (diff > maxSwing) {
      maxSwing = diff;
      biggestSwingMove = m;
    }
  }

  const swingText = biggestSwingMove
    ? `on move ${biggestSwingMove.moveNumber} (${biggestSwingMove.san}${biggestSwingMove.classification ? `, ${biggestSwingMove.classification}` : ''})`
    : 'in the middlegame';

  const openingGrade = game.phaseGrades?.opening || 'B';
  const middleGrade = game.phaseGrades?.middlegame || 'C';

  let text = '';
  let expression: CoachExpression = 'neutral';

  if (userLost) {
    expression = 'embarrassed';
    text = `You navigated the opening cleanly (Grade ${openingGrade}), but the decisive turning point arrived ${swingText}. Stepping through the review reveals the winning counter-strategy.`;
  } else if (userWon) {
    expression = 'brilliant';
    text = `Terrific performance! After a solid opening (Grade ${openingGrade}), you seized command ${swingText} and navigated the middlegame (Grade ${middleGrade}) to victory.`;
  } else {
    expression = 'thumbsup';
    text = `A hard-fought draw. You held balance in the ${game.opening.name} (Grade ${openingGrade}), with the sharpest tactical test coming ${swingText}.`;
  }

  return { text, expression };
}

export const GameSummary: React.FC<GameSummaryProps> = ({ game, onStartReview }) => {
  const { boardThemeId, pieceSetId, animationSpeed, coordinates, coachVoiceEnabled } = useSettingsStore();
  const currentBoardTheme = BOARD_THEMES.find((t) => t.id === boardThemeId) || BOARD_THEMES[0];
  const currentPieceSet = PIECE_SETS.find((p) => p.id === pieceSetId) || PIECE_SETS[0];

  const [orientation, setOrientation] = useState<'white' | 'black'>('white');

  // Find biggest swing moment to showcase on summary board
  let biggestSwingMove = game.moves[0];
  let biggestSwingIdx = 0;
  let maxSwing = 0;
  game.moves.forEach((m, idx) => {
    if (idx === game.moves.length - 1 && m.san.includes('#') && game.moves.length > 2) return;
    const prev = idx === 0 ? 0.2 : clamp(game.moves[idx - 1].eval?.eval ?? 0);
    const curr = clamp(m.eval?.eval ?? 0);
    const diff = Math.abs(curr - prev);
    if (diff > maxSwing) {
      maxSwing = diff;
      biggestSwingMove = m;
      biggestSwingIdx = idx;
    }
  });

  const showcaseFen = biggestSwingMove?.fen || START_FEN;
  const showcaseEval = biggestSwingMove?.eval?.eval ?? 0.2;
  const showcaseBadges: BoardBadge[] = biggestSwingMove?.classification
    ? [{ square: biggestSwingMove.to, label: biggestSwingMove.classification }]
    : [];
  const showcaseArrows: Arrow[] = biggestSwingMove?.variation?.[0]
    ? [{ from: 'e8', to: biggestSwingMove.to, color: 'red' }]
    : [];

  const { text: coachText, expression: coachExp } = generateCoachSummary(game);
  const isWhiteWin = game.result === '1-0';
  const isBlackWin = game.result === '0-1';

  const summaryMessages = useMemo(
    () => [
      {
        id: 'summary-line',
        text: coachText,
        evalText: isWhiteWin ? '1-0' : isBlackWin ? '0-1' : '½-½',
      },
    ],
    [coachText, isWhiteWin, isBlackWin]
  );

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full w-full overflow-hidden">
      {/* --- LEFT ZONE: CHESS BOARD & EVAL BAR (Sticky at top on mobile, desktop flex-1) --- */}
      <div className="sticky top-0 z-20 w-full flex flex-col items-center justify-center p-2 sm:p-3 md:p-6 bg-theme-page border-b lg:border-b-0 border-theme-border/60 flex-shrink-0 lg:flex-1 min-w-0">
        <div className="w-full max-w-[min(calc(100vh-120px),800px)] flex flex-col gap-2">
          {/* Top Player Row */}
          <div className="flex items-center justify-between text-xs px-2 py-1 text-theme-muted">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-700 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                B
              </span>
              <span className="font-bold text-theme-text truncate">{game.black.username}</span>
              <span className="font-mono">({game.black.rating})</span>
            </div>
            <span className="font-mono font-semibold flex-shrink-0">{game.speed} • {game.timeControl}</span>
          </div>

          {/* Board + Eval Bar Container */}
          <div className="flex items-center justify-center gap-2.5 w-full">
            <EvalBar
              evalScore={showcaseEval}
              orientation={orientation}
              height="100%"
            />
            <div className="flex-1 aspect-square">
              <Board
                fen={showcaseFen}
                orientation={orientation}
                boardTheme={currentBoardTheme}
                pieceSet={currentPieceSet}
                animationSpeed={animationSpeed}
                coordinates={coordinates}
                lastMove={
                  biggestSwingMove
                    ? {
                        from: biggestSwingMove.from,
                        to: biggestSwingMove.to,
                        classification: biggestSwingMove.classification,
                      }
                    : null
                }
                badges={showcaseBadges}
                arrows={showcaseArrows}
                interactive={false}
              />
            </div>
          </div>

          {/* Bottom Player Row */}
          <div className="flex items-center justify-between text-xs px-2 py-1 text-theme-muted">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-5 h-5 rounded-full bg-white border border-neutral-300 text-black font-bold flex items-center justify-center text-xs flex-shrink-0">
                W
              </span>
              <span className="font-bold text-theme-text truncate">{game.white.username}</span>
              <span className="font-mono">({game.white.rating})</span>
            </div>
            <button
              type="button"
              onClick={() => setOrientation((o) => (o === 'white' ? 'black' : 'white'))}
              className="min-h-[44px] md:min-h-[32px] hover:text-theme-text transition-colors inline-flex items-center gap-1 font-semibold flex-shrink-0"
              title="Flip Board (F)"
            >
              <RotateCcw size={14} />
              <span>Flip</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- RIGHT ZONE: SUMMARY PANEL (460px to 500px, matches Chess.com exact order) --- */}
      <div className="w-full lg:w-[480px] xl:w-[500px] flex-shrink-0 flex flex-col h-full bg-theme-card border-t lg:border-t-0 lg:border-l border-theme-border shadow-xl z-20 min-h-0">
        {/* Panel Header: 48px bar */}
        <div className="h-12 min-h-[48px] px-4 border-b border-theme-border/60 flex items-center justify-between flex-shrink-0">
          <NavLink
            to="/review"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-theme-muted hover:text-theme-text transition-colors min-h-[44px] md:min-h-[32px]"
          >
            <ArrowLeft size={16} />
            <span>All Games</span>
          </NavLink>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-wider font-display">
            Game Summary
          </span>
        </div>

        {/* Panel Content (Scrollable, in exact Chess.com order) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {/* 1. Coach Line */}
          <CoachSpeech
            expression={coachExp}
            messages={summaryMessages}
            voiceEnabled={coachVoiceEnabled}
            size={80}
            className="flex-shrink-0"
          />

          {/* 2. Evaluation Graph */}
          <Card className="p-3">
            <div className="text-xs font-bold text-theme-muted mb-1.5 uppercase tracking-wider">
              Evaluation Graph
            </div>
            <EvalGraph
              moves={game.moves}
              currentMoveIndex={biggestSwingIdx >= 0 ? biggestSwingIdx : 0}
              height={90}
            />
          </Card>

          {/* 3 & 4. Players row with avatars & Accuracy chips (white chip for White, dark chip for Black) */}
          <Card className="p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              {/* White Player */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-white text-neutral-900 border border-neutral-300 font-bold flex items-center justify-center text-xs shadow-sm flex-shrink-0">
                  W
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-xs text-theme-text truncate">{game.white.username}</span>
                  <span className="text-xs text-theme-muted font-mono">{game.white.rating}</span>
                </div>
              </div>

              {/* Result Badge */}
              <div className="flex flex-col items-center flex-shrink-0 px-2">
                <span className="text-xs font-extrabold font-mono bg-theme-raised px-2.5 py-0.5 rounded border border-theme-border">
                  {game.result}
                </span>
                <span className="text-xs text-theme-muted mt-0.5">{game.speed}</span>
              </div>

              {/* Black Player */}
              <div className="flex items-center gap-2 min-w-0 justify-end">
                <div className="flex flex-col items-end min-w-0">
                  <span className="font-bold text-xs text-theme-text truncate">{game.black.username}</span>
                  <span className="text-xs text-theme-muted font-mono">{game.black.rating}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-neutral-900 text-white border border-neutral-700 font-bold flex items-center justify-center text-xs shadow-sm flex-shrink-0">
                  B
                </div>
              </div>
            </div>

            {/* Accuracy chips: white chip for White, dark chip for Black */}
            {game.accuracy && (
              <div className="flex items-center justify-between pt-2.5 border-t border-theme-border/60 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-white text-neutral-900 border border-neutral-300 font-bold font-mono shadow-sm">
                    {game.accuracy.white}%
                  </span>
                  <span className="text-theme-muted font-medium">White Accuracy</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-theme-muted font-medium">Black Accuracy</span>
                  <span className="px-2.5 py-1 rounded-full bg-neutral-900 text-white border border-neutral-700 font-bold font-mono shadow-sm">
                    {game.accuracy.black}%
                  </span>
                </div>
              </div>
            )}
          </Card>

          {/* 5. Classification table (label left, counts centred under each avatar) */}
          <Card className="p-3">
            <MoveQualityTable game={game} />
          </Card>

          {/* 6. Game Rating */}
          {game.estimatedRating && (
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy size={16} className="text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-theme-muted">
                    Estimated Game Performance
                  </span>
                </div>
                <div className="font-mono font-bold text-sm text-theme-text">
                  <span className="text-amber-500 font-mono">~{game.estimatedRating.white}</span>
                  <span className="text-theme-muted mx-1">/</span>
                  <span className="text-neutral-400 font-mono">~{game.estimatedRating.black}</span>
                </div>
              </div>
            </Card>
          )}

          {/* 7. Phase grades */}
          <Card className="p-3">
            <div className="text-xs font-bold text-theme-muted mb-2 uppercase tracking-wider">
              Phase Performance
            </div>
            <PhaseGradesCard grades={game.phaseGrades} />
          </Card>
        </div>

        {/* 8. Pinned 48px Start Review button */}
        <div className="p-4 border-t border-theme-border/70 bg-theme-card flex-shrink-0">
          <Button
            variant="primary"
            size="lg"
            className="!h-12 w-full"
            icon={<Sparkles size={18} />}
            onClick={onStartReview}
          >
            Start Review
          </Button>
        </div>
      </div>
    </div>
  );
};
