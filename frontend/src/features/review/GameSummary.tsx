import React, { useState } from 'react';
import { Game, Move, CoachExpression, BoardBadge, Arrow } from '@/data/types';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { CoachAvatar } from '@/features/coach/CoachAvatar';
import { CoachBubble } from '@/features/coach/CoachBubble';
import { MoveQualityTable } from './MoveQualityTable';
import { PhaseGradesCard } from './PhaseGradesCard';
import { Board } from '@/features/board/Board';
import { EvalBar } from '@/features/board/EvalBar';
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
  let maxSwing = 0;
  game.moves.forEach((m, idx) => {
    if (idx === game.moves.length - 1 && m.san.includes('#') && game.moves.length > 2) return;
    const prev = idx === 0 ? 0.2 : clamp(game.moves[idx - 1].eval?.eval ?? 0);
    const curr = clamp(m.eval?.eval ?? 0);
    const diff = Math.abs(curr - prev);
    if (diff > maxSwing) {
      maxSwing = diff;
      biggestSwingMove = m;
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

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full w-full overflow-hidden">
      {/* --- LEFT ZONE: CHESS BOARD & EVAL BAR (Sticky at top on mobile, desktop flex-1) --- */}
      <div className="sticky top-0 z-20 w-full flex flex-col items-center justify-center p-2 sm:p-3 md:p-6 bg-theme-page border-b lg:border-b-0 border-theme-border/60 flex-shrink-0 lg:flex-1 min-w-0">
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

      {/* --- RIGHT ZONE: SUMMARY PANEL (~420px, full height scrollable) --- */}
      <div className="w-full lg:w-[420px] flex-shrink-0 flex flex-col h-full bg-theme-card border-t lg:border-t-0 lg:border-l border-theme-border shadow-xl z-20 min-h-0">
        {/* Panel Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-theme-border/60 flex-shrink-0">
          <NavLink
            to="/review"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-theme-muted hover:text-theme-text transition-colors"
          >
            <ArrowLeft size={16} />
            <span>All Games</span>
          </NavLink>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-wider font-display">
            Game Summary
          </span>
        </div>

        {/* Panel Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {/* Coach Banner */}
          <div className="flex items-start gap-3 flex-shrink-0">
            <CoachAvatar expression={coachExp} mode="bust" size={68} />
            <div className="flex-1 min-w-0">
              <CoachBubble
                messages={[
                  {
                    id: 'summary-line',
                    text: coachText,
                    evalText: isWhiteWin ? '1-0' : isBlackWin ? '0-1' : '½-½',
                  },
                ]}
                voiceEnabled={coachVoiceEnabled}
              />
            </div>
          </div>

          {/* Players Row & Accuracy Chips */}
          <Card className="p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              {/* White Player */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-white text-black font-bold flex items-center justify-center text-xs shadow border">
                  W
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-xs text-theme-text truncate">{game.white.username}</span>
                  <span className="text-[11px] text-theme-muted font-mono">{game.white.rating}</span>
                </div>
              </div>

              {/* Result Badge */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-extrabold font-mono bg-theme-raised px-2 py-0.5 rounded border border-theme-border">
                  {game.result}
                </span>
                <span className="text-[10px] text-theme-muted mt-0.5">{game.speed}</span>
              </div>

              {/* Black Player */}
              <div className="flex items-center gap-2 min-w-0 justify-end">
                <div className="flex flex-col items-end min-w-0">
                  <span className="font-bold text-xs text-theme-text truncate">{game.black.username}</span>
                  <span className="text-[11px] text-theme-muted font-mono">{game.black.rating}</span>
                </div>
                <div className="w-7 h-7 rounded-full bg-neutral-900 text-white font-bold flex items-center justify-center text-xs shadow border border-neutral-700">
                  B
                </div>
              </div>
            </div>

            {/* Accuracy and Estimated Game Rating */}
            {game.accuracy && (
              <div className="flex items-center justify-between pt-2 border-t border-theme-border/60 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="text-theme-muted">Accuracy:</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-bold font-mono">
                    {game.accuracy.white}%
                  </span>
                </div>

                {game.estimatedRating && (
                  <div className="flex items-center gap-1 text-[11px] text-theme-muted">
                    <Trophy size={13} className="text-amber-500" />
                    <span className="font-mono">~{game.estimatedRating.white} / ~{game.estimatedRating.black}</span>
                  </div>
                )}

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-500 font-bold font-mono">
                    {game.accuracy.black}%
                  </span>
                  <span className="text-theme-muted">Accuracy</span>
                </div>
              </div>
            )}
          </Card>

          {/* Phase Grades */}
          <Card className="p-3">
            <div className="text-xs font-bold text-theme-muted mb-2 uppercase tracking-wider text-[11px]">
              Phase Performance
            </div>
            <PhaseGradesCard grades={game.phaseGrades} />
          </Card>

          {/* Move Quality Table (Full Width) */}
          <Card className="p-3">
            <MoveQualityTable game={game} />
          </Card>
        </div>

        {/* Pinned Primary Button at Bottom */}
        <div className="p-4 border-t border-theme-border/70 bg-theme-card flex-shrink-0">
          <Button
            variant="primary"
            size="lg"
            fullWidth
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
