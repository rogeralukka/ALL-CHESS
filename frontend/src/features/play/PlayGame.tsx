import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Chess, Square } from 'chess.js';
import { Board } from '@/features/board/Board';
import { EvalBar } from '@/features/board/EvalBar';
import { MoveList } from '@/features/board/MoveList';
import { CoachAvatar } from '@/features/coach/CoachAvatar';
import { CoachBubble, BubbleMessage } from '@/features/coach/CoachBubble';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { GameOverModal } from './GameOverModal';
import { PlayConfig, PlayLobby } from './PlayLobby';
import { useSettingsStore } from '@/data/settingsStore';
import { BOARD_THEMES, PIECE_SETS } from '@/data/boardThemes';
import { Move, CoachExpression, Arrow } from '@/data/types';
import { getExpressionForEvent } from '@/features/coach/expressionMap';
import { ILLEGAL_MOVE_TEACHING_LINES } from '@/features/coach/coachLines';
import { sound } from '@/lib/sound';
import { Lightbulb, RotateCcw, Flag, Download, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PlayGame: React.FC = () => {
  const navigate = useNavigate();
  const { boardThemeId, pieceSetId, animationSpeed, coordinates, coachVoiceEnabled } = useSettingsStore();
  const currentBoardTheme = BOARD_THEMES.find((t) => t.id === boardThemeId) || BOARD_THEMES[0];
  const currentPieceSet = PIECE_SETS.find((p) => p.id === pieceSetId) || PIECE_SETS[0];

  const [activeConfig, setActiveConfig] = useState<PlayConfig | null>(null);
  const [chess] = useState(() => new Chess());
  const [fen, setFen] = useState<string>(chess.fen());
  const [moves, setMoves] = useState<Move[]>([]);
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [showResignPopover, setShowResignPopover] = useState(false);
  const [gameOver, setGameOver] = useState<{
    winner: 'user' | 'coach' | 'draw';
    reason: string;
  } | null>(null);

  const [coachExpression, setCoachExpression] = useState<CoachExpression>('wave');
  const [stackedMessages, setStackedMessages] = useState<BubbleMessage[]>([
    {
      id: 'init-msg',
      text: "Good luck! I'll be watching your piece development and tactical opportunities.",
    },
  ]);

  const coachThinking = useRef(false);

  // Setup game when config is provided
  const handleStartGame = (cfg: PlayConfig) => {
    chess.reset();
    setFen(chess.fen());
    setMoves([]);
    setArrows([]);
    setGameOver(null);
    setShowResignPopover(false);

    let chosenColor: 'white' | 'black' = 'white';
    if (cfg.userColor === 'random') {
      chosenColor = Math.random() > 0.5 ? 'white' : 'black';
    } else {
      chosenColor = cfg.userColor;
    }
    setOrientation(chosenColor);
    setActiveConfig(cfg);

    // If user is Black, coach (White) plays first move
    if (chosenColor === 'black') {
      setTimeout(() => makeCoachMove(), 600);
    }
  };

  const checkGameStatus = useCallback(() => {
    if (chess.isCheckmate()) {
      sound.gameEnd();
      const turn = chess.turn();
      const userWon = (orientation === 'white' && turn === 'b') || (orientation === 'black' && turn === 'w');
      setGameOver({
        winner: userWon ? 'user' : 'coach',
        reason: 'by checkmate',
      });
      setCoachExpression(userWon ? 'brilliant' : 'embarrassed');
    } else if (chess.isDraw()) {
      sound.gameEnd();
      setGameOver({
        winner: 'draw',
        reason: 'by draw / stalemate',
      });
      setCoachExpression('neutral');
    }
  }, [chess, orientation]);

  // Coach Move Execution via mock engine
  const makeCoachMove = useCallback(() => {
    if (chess.isGameOver()) return;
    coachThinking.current = true;
    setCoachExpression('thinking');

    setTimeout(() => {
      const legalMoves = chess.moves({ verbose: true });
      if (legalMoves.length === 0) return;

      // Choose a sensible move (prefer center e4/d4/Nf3 or random)
      const move = legalMoves[Math.floor(Math.random() * Math.min(legalMoves.length, 4))];
      const result = chess.move(move);

      if (result) {
        if (result.captured) {
          sound.capture();
        } else if (chess.isCheck()) {
          sound.check();
        } else if (result.san.includes('O-O')) {
          sound.castle();
        } else {
          sound.move();
        }

        const newFen = chess.fen();
        setFen(newFen);

        const newMoveObj: Move = {
          san: result.san,
          from: result.from,
          to: result.to,
          color: result.color,
          fen: newFen,
          moveNumber: Math.floor(moves.length / 2) + 1,
          classification: 'good',
          eval: { eval: 0.1 },
        };

        setMoves((prev) => [...prev, newMoveObj]);

        // Coach feedback on its own move
        const msg: BubbleMessage = {
          id: `coach-${Date.now()}`,
          text: `I play ${result.san}. Watch how this coordinates with the center.`,
          moveSan: `${newMoveObj.moveNumber}. ${result.san}`,
          evalText: '+0.1',
          evalScore: 0.1,
        };
        setStackedMessages((prev) => [...prev.slice(-2), msg]);
        setCoachExpression('thumbsup');
      }

      coachThinking.current = false;
      checkGameStatus();
    }, 500);
  }, [chess, moves.length, checkGameStatus]);

  // User Move Handler
  const handleUserMove = (from: string, to: string, promotion?: string) => {
    if (chess.isGameOver() || coachThinking.current) return false;

    // Check turn
    const turn = chess.turn();
    const isUserTurn = (orientation === 'white' && turn === 'w') || (orientation === 'black' && turn === 'b');
    if (!isUserTurn) return false;

    try {
      const result = chess.move({
        from: from as Square,
        to: to as Square,
        promotion: promotion || 'q',
      });

      if (!result) return false;

      const newFen = chess.fen();
      setFen(newFen);
      setArrows([]); // clear hint arrows on move
      setHighlights([]); // clear illegal highlights on legal move

      const newMoveObj: Move = {
        san: result.san,
        from: result.from,
        to: result.to,
        color: result.color,
        fen: newFen,
        moveNumber: Math.floor(moves.length / 2) + 1,
        classification: 'best',
        eval: { eval: 0.2 },
      };

      setMoves((prev) => [...prev, newMoveObj]);

      // Reaction
      const exp = getExpressionForEvent('best');
      setCoachExpression(exp);
      const userMsg: BubbleMessage = {
        id: `user-${Date.now()}`,
        text: `Solid move with ${result.san}! You're maintaining active piece play.`,
        moveSan: `${newMoveObj.moveNumber}. ${result.san}`,
        evalText: '+0.2',
        evalScore: 0.2,
      };
      setStackedMessages((prev) => [...prev.slice(-2), userMsg]);

      // Trigger coach reply if game isn't over
      if (!chess.isGameOver()) {
        setTimeout(() => makeCoachMove(), 150);
      } else {
        checkGameStatus();
      }

      return true;
    } catch {
      return false;
    }
  };

  // Illegal Move Handler (Item 8)
  const handleIllegalMove = (from: string, _attemptedTo: string) => {
    try {
      const legalMoves = chess.moves({ square: from as Square, verbose: true });
      const targetSquares = legalMoves.map((m) => m.to);
      setHighlights([from, ...targetSquares]);
    } catch {
      setHighlights([from]);
    }

    setCoachExpression('thinking');

    const line =
      ILLEGAL_MOVE_TEACHING_LINES[Math.floor(Math.random() * ILLEGAL_MOVE_TEACHING_LINES.length)];

    const illegalMsg: BubbleMessage = {
      id: `illegal-${Date.now()}`,
      text: line,
      classification: 'mistake',
      moveSan: 'Illegal Move',
    };
    setStackedMessages((prev) => [...prev.slice(-2), illegalMsg]);

    setTimeout(() => {
      setHighlights([]);
    }, 3500);
  };

  // Provide Hint
  const handleHint = () => {
    const legalMoves = chess.moves({ verbose: true });
    if (legalMoves.length === 0) return;
    const bestCandidate = legalMoves[0];
    setArrows([{ from: bestCandidate.from, to: bestCandidate.to, color: 'orange' }]);

    const hintMsg: BubbleMessage = {
      id: `hint-${Date.now()}`,
      text: `Hint: Consider moving from ${bestCandidate.from} to ${bestCandidate.to} to maximize piece activity.`,
    };
    setStackedMessages((prev) => [...prev.slice(-2), hintMsg]);
    setCoachExpression('thinking');
  };

  // Takeback Handler
  const handleTakeback = () => {
    if (moves.length < 2) return;
    chess.undo(); // undo coach move
    chess.undo(); // undo user move
    setFen(chess.fen());
    setMoves((prev) => prev.slice(0, -2));
    setArrows([]);

    const tbMsg: BubbleMessage = {
      id: `tb-${Date.now()}`,
      text: 'Takeback allowed! Take your time to re-evaluate the position.',
    };
    setStackedMessages((prev) => [...prev.slice(-2), tbMsg]);
    setCoachExpression('wave');
  };

  // Download PGN
  const handleDownloadPgn = () => {
    const pgnData = chess.pgn();
    const blob = new Blob([pgnData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all-chess-game-${Date.now()}.pgn`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [lobbyLevel, setLobbyLevel] = useState<number>(800);

  const lastMoveObj = moves[moves.length - 1];
  const lastMoveFrom = lastMoveObj?.from;
  const lastMoveTo = lastMoveObj?.to;
  const boardLastMove = useMemo(() => {
    return lastMoveFrom && lastMoveTo ? { from: lastMoveFrom, to: lastMoveTo } : null;
  }, [lastMoveFrom, lastMoveTo]);

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full w-full overflow-hidden">
      {/* Center Zone: Board & Eval Bar (Visible both in Lobby and in Game, matching Chess.com) */}
      <div className="flex-1 flex flex-col items-center justify-center p-3 md:p-6 bg-theme-page min-w-0 relative">
        <div className="w-full max-w-[min(88vh,680px)] flex flex-col gap-2">
          {/* Top Player (Coach) */}
          <div className="flex items-center justify-between text-xs px-2 py-1 text-theme-muted">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 font-bold flex items-center justify-center text-[10px] border border-amber-500/40">
                🤖
              </span>
              <span className="font-bold text-theme-text">Coach All-Chess</span>
              <span className="font-mono tabular-nums">
                ({activeConfig ? activeConfig.levelRating : lobbyLevel})
              </span>
            </div>
            <span className="font-mono font-semibold">
              {activeConfig ? activeConfig.levelName : `Rated ${lobbyLevel}`}
            </span>
          </div>

          {/* Board + Eval Bar */}
          <div className="flex items-center justify-center gap-2.5 w-full">
            {activeConfig?.evalBar && (
              <EvalBar
                evalScore={lastMoveObj?.eval?.eval || 0}
                orientation={orientation}
                height="100%"
              />
            )}
            <div className="flex-1 aspect-square relative">
              <Board
                fen={fen}
                orientation={orientation}
                boardTheme={currentBoardTheme}
                pieceSet={currentPieceSet}
                animationSpeed={animationSpeed}
                coordinates={coordinates}
                arrows={arrows}
                highlights={highlights}
                lastMove={boardLastMove}
                interactive={Boolean(activeConfig && !gameOver)}
                onMove={handleUserMove}
                onIllegalMove={handleIllegalMove}
              />

              {/* Game Over Modal Over Board */}
              {gameOver && (
                <GameOverModal
                  isOpen={true}
                  winner={gameOver.winner}
                  reason={gameOver.reason}
                  onNewGame={() => {
                    setActiveConfig(null);
                    chess.reset();
                    setFen(chess.fen());
                    setMoves([]);
                    setArrows([]);
                    setHighlights([]);
                    setGameOver(null);
                  }}
                  onGameReview={() => navigate('/review/game-01')}
                />
              )}
            </div>
          </div>

          {/* Bottom Player (User) */}
          <div className="flex items-center justify-between text-xs px-2 py-1 text-theme-muted">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-theme-raised text-theme-text font-bold flex items-center justify-center text-[10px] border border-theme-border">
                You
              </span>
              <span className="font-bold text-theme-text">You</span>
              <span className="font-mono tabular-nums">(905)</span>
            </div>
            {activeConfig && (
              <button
                type="button"
                onClick={() => {
                  setActiveConfig(null);
                  chess.reset();
                  setFen(chess.fen());
                  setMoves([]);
                  setArrows([]);
                  setHighlights([]);
                  setGameOver(null);
                }}
                className="text-xs font-semibold text-theme-muted hover:text-theme-text flex items-center gap-1 transition-colors"
              >
                <ArrowLeft size={13} />
                <span>Exit to Lobby</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Zone: Lobby or In-Game Panel (~420px fixed width on desktop) */}
      <div className="w-full lg:w-[420px] flex-shrink-0 flex flex-col h-full bg-theme-card border-t lg:border-t-0 lg:border-l border-theme-border shadow-xl z-20 overflow-hidden">
        {/* Panel Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-theme-border/60">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-display text-theme-text">Play Coach</span>
            <span
              className={`text-xs font-bold uppercase px-1.5 py-0.2 rounded border ${
                activeConfig
                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                  : 'bg-theme-raised text-theme-muted border-theme-border'
              }`}
            >
              {activeConfig ? 'Live Game' : 'Match Setup'}
            </span>
          </div>
          {activeConfig && (
            <span className="text-xs font-mono tabular-nums font-bold text-theme-muted">
              Moves: {Math.floor(moves.length / 2)}
            </span>
          )}
        </div>

        {/* Panel Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!activeConfig ? (
            <PlayLobby
              onStartGame={handleStartGame}
              selectedLevel={lobbyLevel}
              onLevelChange={setLobbyLevel}
            />
          ) : (
            <>
              {/* Coach Portrait + Stacked Speech Bubbles */}
              <div className="flex items-start gap-3">
                <CoachAvatar expression={coachExpression} mode="bust" size={68} />
                <div className="flex-1 min-w-0">
                  <CoachBubble
                    messages={stackedMessages}
                    voiceEnabled={coachVoiceEnabled}
                  />
                </div>
              </div>

              {/* Live Action Controls: Hint, Takeback, Resign, PGN */}
              <div className="flex flex-wrap gap-2 pt-1">
                {activeConfig.showHints && (
                  <Button
                    variant="highlight"
                    size="sm"
                    icon={<Lightbulb size={15} />}
                    onClick={handleHint}
                    disabled={Boolean(gameOver)}
                  >
                    Hint
                  </Button>
                )}

                {activeConfig.allowTakebacks && (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<RotateCcw size={15} />}
                    onClick={handleTakeback}
                    disabled={moves.length < 2 || Boolean(gameOver)}
                  >
                    Take Back
                  </Button>
                )}

                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Download size={15} />}
                  onClick={handleDownloadPgn}
                >
                  PGN
                </Button>

                {/* Resign with Confirmation Popover */}
                <div className="relative">
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<Flag size={15} />}
                    onClick={() => setShowResignPopover(true)}
                    disabled={Boolean(gameOver)}
                  >
                    Resign
                  </Button>

                  {showResignPopover && (
                    <div className="absolute right-0 bottom-full mb-2 w-48 p-3 rounded-lg bg-theme-raised border border-theme-border shadow-2xl z-30 flex flex-col gap-2">
                      <span className="text-xs font-bold text-theme-text text-center">Confirm Resignation?</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          fullWidth
                          onClick={() => setShowResignPopover(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          fullWidth
                          onClick={() => {
                            setShowResignPopover(false);
                            setGameOver({ winner: 'coach', reason: 'by resignation' });
                          }}
                        >
                          Resign
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Live Move List */}
              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-theme-muted">Game Notation</span>
                  <span className="text-[11px] text-theme-muted">Live Tracking</span>
                </div>
                <MoveList
                  moves={moves}
                  currentMoveIndex={moves.length - 1}
                  onSelectMove={() => {}}
                />
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default PlayGame;
