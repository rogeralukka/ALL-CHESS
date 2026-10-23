import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
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
import { EngineService } from '@/services/engineService';
import { OpeningService, OpeningMatch } from '@/services/openingService';
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
  const movesRef = useRef<Move[]>([]);
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [currentOpening, setCurrentOpening] = useState<OpeningMatch | null>(null);
  const [showResignPopover, setShowResignPopover] = useState(false);
  const resignPopoverRef = useRef<HTMLDivElement>(null);
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

  const updateMoves = useCallback((updater: (prev: Move[]) => Move[]) => {
    setMoves((prev) => {
      const next = updater(prev);
      movesRef.current = next;
      return next;
    });
  }, []);

  // Close resign popover on Escape and click outside
  useEffect(() => {
    if (!showResignPopover) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowResignPopover(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (resignPopoverRef.current && !resignPopoverRef.current.contains(e.target as Node)) {
        setShowResignPopover(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showResignPopover]);

  // Setup game when config is provided
  const handleStartGame = (cfg: PlayConfig) => {
    chess.reset();
    setFen(chess.fen());
    updateMoves(() => []);
    setArrows([]);
    setCurrentOpening(null);
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
      setTimeout(() => {
        makeCoachMove();
      }, 300);
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
      const closingMsg: BubbleMessage = {
        id: `gameover-${Date.now()}`,
        text: userWon
          ? "Outstanding performance! You delivered a decisive checkmate. Great tactical vision!"
          : "Checkmate! Well played. Review the game to analyze where the initiative slipped.",
        classification: userWon ? 'brilliant' : 'mistake',
      };
      setStackedMessages((prev) => [...prev.slice(-2), closingMsg]);
    } else if (chess.isDraw()) {
      sound.gameEnd();
      setGameOver({
        winner: 'draw',
        reason: 'by draw / stalemate',
      });
      setCoachExpression('neutral');
      const closingMsg: BubbleMessage = {
        id: `gameover-${Date.now()}`,
        text: "It's a draw! Both sides defended solidly. A very balanced game.",
      };
      setStackedMessages((prev) => [...prev.slice(-2), closingMsg]);
    }
  }, [chess, orientation]);

  // Coach Move Execution via search engine
  const makeCoachMove = useCallback(async () => {
    if (chess.isGameOver()) return;
    coachThinking.current = true;
    setCoachExpression('thinking');

    const searchResult = await EngineService.searchBestMove(chess.fen(), {
      levelRating: activeConfig?.levelRating || 800,
      timeDelayMin: 400,
      timeDelayMax: 750,
    });

    if (!searchResult) {
      coachThinking.current = false;
      return;
    }

    const { move: bestMove, evalScore, isNotable, notableReason } = searchResult;
    const result = chess.move({
      from: bestMove.from as Square,
      to: bestMove.to as Square,
      promotion: bestMove.promotion || 'q',
    });

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

      const currentHistory = movesRef.current;
      const newMoveObj: Move = {
        san: result.san,
        from: result.from,
        to: result.to,
        color: result.color,
        fen: newFen,
        moveNumber: Math.floor(currentHistory.length / 2) + 1,
        classification: 'good',
        eval: { eval: evalScore },
      };

      const updatedMoves = [...currentHistory, newMoveObj];
      updateMoves(() => updatedMoves);

      // Check opening name
      const opening = OpeningService.identifyOpening(updatedMoves.map((m) => m.san));
      if (opening && (!currentOpening || currentOpening.name !== opening.name)) {
        setCurrentOpening(opening);
        if (activeConfig?.coachComments) {
          const msg: BubbleMessage = {
            id: `coach-op-${Date.now()}`,
            text: `We are playing the ${opening.name}. ${opening.idea}`,
            moveSan: `${newMoveObj.moveNumber}. ${result.san}`,
            evalText: evalScore >= 0 ? `+${evalScore}` : `${evalScore}`,
            evalScore,
          };
          setStackedMessages((prev) => [...prev.slice(-2), msg]);
          setCoachExpression('thumbsup');
        }
      } else if (isNotable && activeConfig?.coachComments) {
        let noteText = `I play ${result.san}.`;
        if (notableReason === 'capture') {
          noteText = `I capture on ${result.to} to contest the position.`;
        } else if (notableReason === 'check') {
          noteText = `Check! Forcing your king to respond immediately.`;
        } else if (notableReason === 'castle') {
          noteText = `I castle to tuck my king safely away and connect my rooks.`;
        } else if (notableReason === 'development') {
          noteText = `Developing my ${result.san[0] === 'N' ? 'knight' : 'bishop'} toward active central diagonals.`;
        }

        const msg: BubbleMessage = {
          id: `coach-${Date.now()}`,
          text: noteText,
          moveSan: `${newMoveObj.moveNumber}. ${result.san}`,
          evalText: evalScore >= 0 ? `+${evalScore}` : `${evalScore}`,
          evalScore,
        };
        setStackedMessages((prev) => [...prev.slice(-2), msg]);
        setCoachExpression('thumbsup');
      }
      // On non-notable moves, coach remains silent
    }

    coachThinking.current = false;
    checkGameStatus();
  }, [chess, activeConfig, currentOpening, checkGameStatus, updateMoves]);

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

      const currentHistory = movesRef.current;
      const newMoveObj: Move = {
        san: result.san,
        from: result.from,
        to: result.to,
        color: result.color,
        fen: newFen,
        moveNumber: Math.floor(currentHistory.length / 2) + 1,
        classification: 'best',
        eval: { eval: 0.2 },
      };

      updateMoves((prev) => [...prev, newMoveObj]);

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
        setTimeout(() => {
          makeCoachMove();
        }, 100);
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
    updateMoves((prev) => prev.slice(0, -2));
    setArrows([]);

    const tbMsg: BubbleMessage = {
      id: `tb-${Date.now()}`,
      text: 'Takeback allowed! Take your time to re-evaluate the position.',
    };
    setStackedMessages((prev) => [...prev.slice(-2), tbMsg]);
    setCoachExpression('wave');
  };

  // Download PGN
  const handleResign = () => {
    setShowResignPopover(false);
    setGameOver({ winner: 'coach', reason: 'by resignation' });
    sound.gameEnd();
    setCoachExpression('thumbsup');
    const resignMsg: BubbleMessage = {
      id: `resign-${Date.now()}`,
      text: "Game concluded by resignation. Good game! Analyzing this match will help you spot key tactical resources.",
    };
    setStackedMessages((prev) => [...prev.slice(-2), resignMsg]);
  };

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

              {/* Live Action Controls: Resign, Hint, Takeback, PGN - 48px tall */}
              <div className="flex items-center gap-2 pt-1 w-full">
                {/* Resign with Confirmation Popover */}
                <div className="relative">
                  <Button
                    variant="danger"
                    size="md"
                    className="!h-12 px-4"
                    icon={<Flag size={18} />}
                    onClick={() => setShowResignPopover((v) => !v)}
                    disabled={Boolean(gameOver)}
                  >
                    Resign
                  </Button>

                  {showResignPopover && (
                    <div
                      ref={resignPopoverRef}
                      className="absolute left-0 bottom-full mb-3 w-56 p-3 rounded-lg bg-theme-raised border border-theme-border shadow-2xl z-40 flex flex-col gap-2 after:content-[''] after:absolute after:top-full after:left-8 after:border-[6px] after:border-transparent after:border-t-theme-border after:-mb-1.5"
                    >
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
                          onClick={handleResign}
                        >
                          Resign
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {activeConfig.showHints && (
                  <Button
                    variant="highlight"
                    size="md"
                    className="!h-12 flex-1"
                    icon={<Lightbulb size={18} />}
                    onClick={handleHint}
                    disabled={Boolean(gameOver)}
                  >
                    Hint
                  </Button>
                )}

                {activeConfig.allowTakebacks && (
                  <Button
                    variant="secondary"
                    size="md"
                    className="!h-12"
                    icon={<RotateCcw size={18} />}
                    onClick={handleTakeback}
                    disabled={moves.length < 2 || Boolean(gameOver)}
                    title="Take Back Move"
                  >
                    Takeback
                  </Button>
                )}

                <Button
                  variant="secondary"
                  size="md"
                  className="!h-12 px-3"
                  icon={<Download size={18} />}
                  onClick={handleDownloadPgn}
                  title="Download PGN"
                >
                  PGN
                </Button>
              </div>

              {/* Live Move List */}
              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-theme-text">Game Notation</span>
                    {currentOpening && (
                      <span className="text-[11px] font-semibold text-amber-500">
                        {currentOpening.eco}: {currentOpening.name}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-theme-muted font-mono">{moves.length} plies</span>
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
