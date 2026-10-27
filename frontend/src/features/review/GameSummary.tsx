import React, { useState, useMemo, useEffect } from 'react';
import { Game, Move, CoachExpression, BoardBadge, Arrow } from '@/data/types';
import { Button } from '@/components/Button';
import { PlayerBar } from '@/components/PlayerBar';
import { PlayerAvatar } from '@/components/Bits';
import { CoachSpeech } from '@/features/coach/CoachSpeech';
import { ReviewTable } from './ReviewTable';
import { phaseRows } from './phases';
import { AnalysisDepth } from './AnalysisDepth';
import { AnalysisLevel, DEFAULT_LEVEL } from './analysisLevels';
import { SidebarPanel, SidebarHeader } from '@/components/SidebarPanel';
import { useCurrentUser } from '@/lib/useCurrentUser';
import { Board } from '@/features/board/Board';
import { EvalBar } from '@/features/board/EvalBar';
import { EvalGraph } from '@/features/board/EvalGraph';
import { useSettingsStore } from '@/data/settingsStore';
import { BOARD_THEMES, PIECE_SETS } from '@/data/boardThemes';
import { Sparkles, ArrowLeft, RotateCcw } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface GameSummaryProps {
  game: Game;
  onStartReview: () => void;
  level?: AnalysisLevel['id'];
  onLevelChange?: (id: AnalysisLevel['id']) => void;
  onReanalyze?: (id: AnalysisLevel['id']) => void;
}

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const clamp = (val: number) => Math.min(6.0, Math.max(-6.0, val));

function generateCoachSummary(game: Game): { text: string; expression: CoachExpression } {
  const isWhiteWin = game.result === '1-0';
  const isBlackWin = game.result === '0-1';
  const userIsWhite = game.white.username === 'You';
  const userWon = (userIsWhite && isWhiteWin) || (!userIsWhite && isBlackWin);
  const userLost = (userIsWhite && isBlackWin) || (!userIsWhite && isWhiteWin);

  // Very short games (a quick resignation) have no story to tell yet.
  if (game.moves.length < 8) {
    const how = game.termination ? game.termination.toLowerCase() : 'a very short game';
    return {
      text: `That was over after only ${Math.ceil(game.moves.length / 2)} move${game.moves.length <= 2 ? '' : 's'} (${how}). Play a longer game and I will have more to say.`,
      expression: 'neutral',
    };
  }

  // Not analysed yet: don't invent a story from empty evaluations.
  if (game.moves.every((m) => !m.eval)) {
    return {
      text: userWon
        ? 'You won this one! Start the review and I will check every move and show where it was decided.'
        : userLost
        ? 'Start the review and I will check every move and show you where this game turned.'
        : 'Start the review and I will check every move and show you the key moments.',
      expression: userWon ? 'brilliant' : 'neutral',
    };
  }

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

  const userIsWhiteSide = game.isUserWhite ?? game.white.username === 'You';
  const phaseList = phaseRows(game);
  const mine = (id: 'opening' | 'middlegame') => {
    const row = phaseList.find((r) => r.phase === id);
    const g = row ? (userIsWhiteSide ? row.white.grade : row.black.grade) : 'N/A';
    return g === 'N/A' ? 'B' : g;
  };
  const openingGrade = mine('opening');
  const middleGrade = mine('middlegame');

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

export const GameSummary: React.FC<GameSummaryProps> = ({ game, onStartReview, level = DEFAULT_LEVEL, onLevelChange, onReanalyze }) => {
  const me = useCurrentUser();
  const { boardThemeId, pieceSetId, animationSpeed, coordinates, coachVoiceEnabled } = useSettingsStore();
  const currentBoardTheme = BOARD_THEMES.find((t) => t.id === boardThemeId) || BOARD_THEMES[0];
  const currentPieceSet = PIECE_SETS.find((p) => p.id === pieceSetId) || PIECE_SETS[0];

  const userIsWhite = game.isUserWhite ?? (game.white.username === 'You');
  const [orientation, setOrientation] = useState<'white' | 'black'>(userIsWhite ? 'white' : 'black');

  useEffect(() => {
    setOrientation(userIsWhite ? 'white' : 'black');
  }, [game.id, userIsWhite]);

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

  const topPlayer = orientation === 'white' ? game.black : game.white;
  const bottomPlayer = orientation === 'white' ? game.white : game.black;

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full w-full overflow-y-auto lg:overflow-hidden lg:items-center lg:justify-center lg:gap-6 lg:px-6 lg:py-4 pb-20 lg:pb-4">
      {/* --- LEFT ZONE: CHESS BOARD & EVAL BAR (Sticky at top on mobile, desktop flex-1) --- */}
      <div className="sticky top-0 z-20 w-full flex flex-col items-center justify-center p-2 sm:p-3 md:p-6 bg-theme-page border-b lg:border-b-0 border-theme-border/60 flex-shrink-0 lg:flex-1 min-w-0">
        <div className="w-full max-w-[min(calc(100vh-108px),900px)] flex flex-col gap-2">
          {/* Top Player Row */}
          <PlayerBar
            testId="player-top"
            name={me.label(topPlayer.username)}
            rating={topPlayer.rating}
            avatar={<PlayerAvatar name={topPlayer.username} size={40} className="!rounded-none" />}
            right={<span className="px-2.5 py-1 rounded-md bg-black/[0.06] dark:bg-black/25 text-[13px] font-bold text-theme-muted capitalize">{game.speed} · {game.timeControl}</span>}
          />

          {/* Board + Eval Bar Container */}
          <div className="flex items-stretch justify-center gap-2.5 w-full">
            <EvalBar
              evalScore={showcaseEval}
              orientation={orientation}
              height="auto"
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
          <PlayerBar
            testId="player-bottom"
            name={me.label(bottomPlayer.username)}
            rating={bottomPlayer.rating}
            avatar={<PlayerAvatar name={bottomPlayer.username} size={40} className="!rounded-none" />}
            right={
              <button
                type="button"
                onClick={() => setOrientation((o) => (o === 'white' ? 'black' : 'white'))}
                className="h-9 px-3 rounded-lg btn-secondary text-[13px] inline-flex items-center gap-1.5 font-bold flex-shrink-0"
                title="Flip Board (F)"
              >
                <RotateCcw size={14} />
                <span>Flip</span>
              </button>
            }
          />
        </div>
      </div>

      {/* --- RIGHT ZONE: one flat panel, as on the reference --- */}
      <SidebarPanel className="w-full lg:w-[400px] xl:w-[440px] flex-shrink-0 lg:h-[calc(100vh-32px)] z-20" testId="summary-panel">
        <SidebarHeader
          title="Game Review"
          icon={<img src="/assets/ui/icon_review.webp" alt="" className="w-9 h-9 object-contain" />}
          left={
            <NavLink to="/review" aria-label="All games" title="All games" className="w-9 h-9 flex items-center justify-center rounded-[4px] text-theme-muted hover:text-theme-text hover:bg-white/[0.06]">
              <ArrowLeft size={20} />
            </NavLink>
          }
        />

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-4 pb-3">
            <CoachSpeech expression={coachExp} messages={summaryMessages} voiceEnabled={coachVoiceEnabled} size={80} className="flex-shrink-0" />
          </div>

          <div className="px-4 pb-1">
            <EvalGraph moves={game.moves} currentMoveIndex={biggestSwingIdx >= 0 ? biggestSwingIdx : 0} height={92} />
          </div>

          <ReviewTable game={game} />
          {onLevelChange && onReanalyze && (
            <AnalysisDepth game={game} level={level} onLevelChange={onLevelChange} onReanalyze={onReanalyze} />
          )}
        </div>

        <div className="p-4 flex-shrink-0" style={{ background: 'var(--side-header-bg)' }}>
          <Button variant="primary" size="lg" className="!h-14 w-full !text-[22px] !font-extrabold font-display" icon={<Sparkles size={22} />} onClick={onStartReview} data-testid="start-review">
            Start Review
          </Button>
        </div>
      </SidebarPanel>
    </div>
  );
};
