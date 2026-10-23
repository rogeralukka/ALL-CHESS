import React from 'react';
import { Game, CoachExpression } from '@/data/types';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { CoachAvatar } from '@/features/coach/CoachAvatar';
import { CoachBubble } from '@/features/coach/CoachBubble';
import { EvalGraph } from '@/features/board/EvalGraph';
import { MoveQualityTable } from './MoveQualityTable';
import { PhaseGradesCard } from './PhaseGradesCard';
import { Sparkles, Trophy, ArrowLeft } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface GameSummaryProps {
  game: Game;
  onStartReview: () => void;
}

export const GameSummary: React.FC<GameSummaryProps> = ({ game, onStartReview }) => {
  const isWhiteWin = game.result === '1-0';
  const isBlackWin = game.result === '0-1';

  const userIsWhite = game.white.username === 'You';
  const userWon = (userIsWhite && isWhiteWin) || (!userIsWhite && isBlackWin);
  const userLost = (userIsWhite && isBlackWin) || (!userIsWhite && isWhiteWin);

  // Find biggest swing move
  let biggestSwingMove = game.moves[0];
  let maxSwing = 0;
  game.moves.forEach((m, idx) => {
    const prev = idx === 0 ? 0.2 : (game.moves[idx - 1].eval?.eval ?? 0);
    const curr = m.eval?.eval ?? 0;
    const diff = Math.abs(curr - prev);
    if (diff > maxSwing) {
      maxSwing = diff;
      biggestSwingMove = m;
    }
  });

  const coachExp: CoachExpression = userWon ? 'brilliant' : userLost ? 'embarrassed' : 'thumbsup';
  const swingText = biggestSwingMove
    ? `on move ${biggestSwingMove.moveNumber} (${biggestSwingMove.san})`
    : 'in the middlegame';

  const coachText = userLost
    ? `You built a lead, then rushed an attack ${swingText}. Stepping through the review will show the winning continuation.`
    : userWon
    ? `Great game! You took control of the ${game.opening.name} and capitalized decisively ${swingText}.`
    : `A balanced and instructive draw in the ${game.opening.name}. The sharpest moment came ${swingText}.`;

  const fullMoves = Math.ceil(game.moves.length / 2);

  return (
    <div className="flex flex-col h-full max-w-xl mx-auto w-full p-4 space-y-4">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between">
        <NavLink
          to="/review"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-theme-muted hover:text-theme-text transition-colors"
        >
          <ArrowLeft size={16} />
          <span>All Games</span>
        </NavLink>
        <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
          Game Summary
        </span>
      </div>

      {/* Coach Banner */}
      <Card className="flex items-start gap-4 p-4 bg-gradient-to-br from-theme-raised to-theme-card border-amber-500/20">
        <CoachAvatar expression={coachExp} mode="bust" size={72} />
        <div className="flex-1 min-w-0">
          <CoachBubble
            messages={[
              {
                id: 'summary-line',
                text: coachText,
                evalText: isWhiteWin ? '1-0' : isBlackWin ? '0-1' : '½-½',
              },
            ]}
          />
        </div>
      </Card>

      {/* Players Row & Accuracy Chips */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          {/* White Player */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-white text-black font-bold flex items-center justify-center text-xs shadow border">
              W
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm text-theme-text truncate">{game.white.username}</span>
              <span className="text-xs text-theme-muted font-mono">{game.white.rating}</span>
            </div>
          </div>

          {/* Result Badge */}
          <div className="flex flex-col items-center">
            <span className="text-sm font-extrabold font-mono bg-theme-raised px-2.5 py-0.5 rounded border border-theme-border">
              {game.result}
            </span>
            <span className="text-[10px] text-theme-muted mt-0.5">{game.speed}</span>
          </div>

          {/* Black Player */}
          <div className="flex items-center gap-2.5 min-w-0 justify-end">
            <div className="flex flex-col items-end min-w-0">
              <span className="font-bold text-sm text-theme-text truncate">{game.black.username}</span>
              <span className="text-xs text-theme-muted font-mono">{game.black.rating}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-bold flex items-center justify-center text-xs shadow border border-neutral-700">
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
                <span>Est: ~{game.estimatedRating.white} / ~{game.estimatedRating.black}</span>
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

      {/* Mini Eval Graph with Key-Move Dots & Biggest Swing Label */}
      <Card className="p-3">
        <div className="flex justify-between items-center mb-1 text-xs font-bold text-theme-muted">
          <span>Advantage Momentum</span>
          <span>{fullMoves} moves</span>
        </div>
        <EvalGraph
          moves={game.moves}
          currentMoveIndex={-1}
          onSeek={() => {}}
          height={80}
          mini={false}
        />
      </Card>

      {/* Phase Grades */}
      <Card className="p-3">
        <div className="text-xs font-bold text-theme-muted mb-2">Phase Performance Grades</div>
        <PhaseGradesCard grades={game.phaseGrades} />
      </Card>

      {/* Move Quality Table */}
      <Card className="p-3">
        <MoveQualityTable game={game} />
      </Card>

      {/* Pinned Primary Button at Bottom */}
      <div className="sticky bottom-2 pt-2 z-20">
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
  );
};
