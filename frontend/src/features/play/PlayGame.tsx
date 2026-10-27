import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Chess, Square } from 'chess.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Board } from '@/features/board/Board';
import { EvalBar } from '@/features/board/EvalBar';
import { MoveList } from '@/features/board/MoveList';
import { PlayerBar } from '@/components/PlayerBar';
import { PlayerAvatar } from '@/components/Bits';
import { CoachSpeech } from '@/features/coach/CoachSpeech';
import { BubbleMessage } from '@/features/coach/CoachBubble';
import { badgeBox } from '@/features/board/BadgeLayer';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import confetti from 'canvas-confetti';
import { useMotion } from '@/lib/useMotion';
import { GameOverModal } from './GameOverModal';
import { PlayConfig, PlayLobby } from './PlayLobby';
import { useSettingsStore } from '@/data/settingsStore';
import { BOARD_THEMES, PIECE_SETS } from '@/data/boardThemes';
import { Move, CoachExpression, Arrow, MoveClassification } from '@/data/types';
import { ILLEGAL_MOVE_TEACHING_LINES } from '@/features/coach/coachLines';
import { sound } from '@/lib/sound';
import { EngineService } from '@/services/engineService';
import { OpeningService, OpeningMatch } from '@/services/openingService';
import { Lightbulb, RotateCcw, Flag, Download, ArrowLeft, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '@/lib/useCurrentUser';
import { SidebarPanel, SidebarHeader } from '@/components/SidebarPanel';

const PIECE_FIGURINES: Record<string, string> = {
  p: '♟',
  n: '♞',
  b: '♝',
  r: '♜',
  q: '♛',
};

function calculateMaterialTally(chess: Chess) {
  const board = chess.board();
  const counts: Record<string, { w: number; b: number }> = {
    p: { w: 0, b: 0 },
    n: { w: 0, b: 0 },
    b: { w: 0, b: 0 },
    r: { w: 0, b: 0 },
    q: { w: 0, b: 0 },
  };
  const starting: Record<string, number> = { p: 8, n: 2, b: 2, r: 2, q: 1 };
  const values: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9 };

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.type !== 'k') {
        counts[p.type][p.color]++;
      }
    }
  }

  const capturedByWhite: string[] = [];
  const capturedByBlack: string[] = [];
  let whiteScore = 0;
  let blackScore = 0;

  for (const t of ['p', 'n', 'b', 'r', 'q']) {
    const missingBlack = starting[t] - counts[t].b;
    for (let i = 0; i < missingBlack; i++) capturedByWhite.push(t);

    const missingWhite = starting[t] - counts[t].w;
    for (let i = 0; i < missingWhite; i++) capturedByBlack.push(t);

    whiteScore += counts[t].w * values[t];
    blackScore += counts[t].b * values[t];
  }

  return {
    whiteAdvantage: Math.max(0, whiteScore - blackScore),
    blackAdvantage: Math.max(0, blackScore - whiteScore),
    capturedByWhite,
    capturedByBlack,
  };
}

function findKingSquares(chess: Chess) {
  const b = chess.board();
  let whiteKing = 'e1';
  let blackKing = 'e8';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = b[r][c];
      if (p && p.type === 'k') {
        const sq = `${String.fromCharCode(97 + c)}${8 - r}`;
        if (p.color === 'w') whiteKing = sq;
        else blackKing = sq;
      }
    }
  }
  return { whiteKing, blackKing };
}

export const PlayGame: React.FC = () => {
  const navigate = useNavigate();
  const me = useCurrentUser();
  const { boardThemeId, pieceSetId, animationSpeed, coordinates, coachVoiceEnabled } = useSettingsStore();
  const currentBoardTheme = BOARD_THEMES.find((t) => t.id === boardThemeId) || BOARD_THEMES[0];
  const currentPieceSet = PIECE_SETS.find((p) => p.id === pieceSetId) || PIECE_SETS[0];

  const [activeConfig, setActiveConfig] = useState<PlayConfig | null>(null);
  const [chess] = useState(() => new Chess());
  const [fen, setFen] = useState<string>(chess.fen());
  const [moves, setMoves] = useState<Move[]>([]);
  const movesRef = useRef<Move[]>([]);
  const [userColor, setUserColor] = useState<'white' | 'black'>('white');
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
  const [kingBadges, setKingBadges] = useState<Array<{ square: string; type: 'crown' | 'flag' | 'draw' }>>([]);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [tippingSquare, setTippingSquare] = useState<string | null>(null);
  const { isFull } = useMotion();

  const [coachExpression, setCoachExpression] = useState<CoachExpression>('wave');
  const [stackedMessages, setStackedMessages] = useState<BubbleMessage[]>([
    {
      id: 'init-msg',
      text: "Good luck! I'll be watching your piece development and tactical opportunities.",
    },
  ]);

  const recentLinesRef = useRef<string[]>([]);
  const pickCoachLine = useCallback((candidates: string[]): string => {
    const available = candidates.filter((c) => !recentLinesRef.current.includes(c));
    const pool = available.length > 0 ? available : candidates;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    recentLinesRef.current = [...recentLinesRef.current.slice(-9), chosen];
    return chosen;
  }, []);

  const pushCoachMessage = useCallback((text: string) => {
    const msg: BubbleMessage = {
      id: `coach-${Date.now()}-${Math.random()}`,
      text,
    };
    // Max 2 bubbles visible; newest next to portrait, older faded
    setStackedMessages((prev) => [...prev.slice(-1), msg]);
  }, []);

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
    setHighlights([]);
    setCurrentOpening(null);
    setGameOver(null);
    setTippingSquare(null);
    setKingBadges([]);
    setShowGameOverModal(false);
    setShowResignPopover(false);
    recentLinesRef.current = [];

    let chosenColor: 'white' | 'black' = 'white';
    if (cfg.userColor === 'random') {
      chosenColor = Math.random() > 0.5 ? 'white' : 'black';
    } else {
      chosenColor = cfg.userColor;
    }

    setUserColor(chosenColor);
    setOrientation(chosenColor);
    setActiveConfig(cfg);
    setCoachExpression('wave');
    setStackedMessages([
      {
        id: 'start-msg',
        text: "Game started! Focus on central control, piece harmony, and king safety.",
      },
    ]);

    // If user is Black, coach (White) plays first move
    if (chosenColor === 'black') {
      setTimeout(() => {
        makeCoachMove();
      }, 300);
    }
  };

  // Flip board on 'F' key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key.toLowerCase() === 'f') {
        setOrientation((o) => (o === 'white' ? 'black' : 'white'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerGameOver = useCallback((winner: 'user' | 'coach' | 'draw', reason: string) => {
    sound.gameEnd();
    setGameOver({ winner, reason });

    const { whiteKing, blackKing } = findKingSquares(chess);
    const userIsWhite = userColor === 'white';

    if (winner === 'draw') {
      setTippingSquare(null);
      setKingBadges([
        { square: whiteKing, type: 'draw' },
        { square: blackKing, type: 'draw' },
      ]);
      setCoachExpression('neutral');
      pushCoachMessage("It's a draw! Both sides defended solidly. A very balanced game.");
    } else if (winner === 'user') {
      const winnerKing = userIsWhite ? whiteKing : blackKing;
      const loserKing = userIsWhite ? blackKing : whiteKing;
      setTippingSquare(loserKing);
      setKingBadges([
        { square: winnerKing, type: 'crown' },
        { square: loserKing, type: 'flag' },
      ]);
      setCoachExpression('brilliant');
      pushCoachMessage("Outstanding victory! Decisive tactical execution.");
      if (isFull) {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.6 },
          disableForReducedMotion: true,
        });
      }
    } else {
      const winnerKing = userIsWhite ? blackKing : whiteKing;
      const loserKing = userIsWhite ? whiteKing : blackKing;
      setTippingSquare(loserKing);
      setKingBadges([
        { square: winnerKing, type: 'crown' },
        { square: loserKing, type: 'flag' },
      ]);
      setCoachExpression('thumbsup');
      pushCoachMessage("Well played! A great game for both of us. Review the match to uncover key moments.");
    }

    // 300ms pop of the king badges before showing modal
    setTimeout(() => {
      setShowGameOverModal(true);
    }, 300);
  }, [chess, userColor, pushCoachMessage, isFull]);

  const checkGameStatus = useCallback(() => {
    if (chess.isCheckmate()) {
      const turn = chess.turn();
      const userIsWhite = userColor === 'white';
      const userWon = (userIsWhite && turn === 'b') || (!userIsWhite && turn === 'w');
      triggerGameOver(userWon ? 'user' : 'coach', 'by checkmate');
    } else if (chess.isDraw()) {
      triggerGameOver('draw', 'by draw / stalemate');
    }
  }, [chess, userColor, triggerGameOver]);

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
      const coachBadge = Boolean(
        activeConfig?.moveFeedback &&
        isNotable &&
        (notableReason === 'check' || notableReason === 'capture')
      );

      const newMoveObj: Move = {
        san: result.san,
        from: result.from,
        to: result.to,
        color: result.color,
        fen: newFen,
        moveNumber: Math.floor(currentHistory.length / 2) + 1,
        classification: coachBadge ? 'best' : undefined,
        eval: { eval: evalScore },
      };

      const updatedMoves = [...currentHistory, newMoveObj];
      updateMoves(() => updatedMoves);

      // Check opening name
      const opening = OpeningService.identifyOpening(updatedMoves.map((m) => m.san));
      if (opening) {
        setCurrentOpening(opening);
      }

      if (activeConfig?.coachComments) {
        if (opening && (!currentOpening || currentOpening.name !== opening.name)) {
          setCoachExpression('thumbsup');
          pushCoachMessage(`We are playing the ${opening.name}.`);
        } else if (isNotable) {
          let noteText: string | null = null;
          if (notableReason === 'capture') {
            noteText = pickCoachLine([
              `I capture on ${result.to} to contest the position.`,
              `Trading on ${result.to} to reshape the pawn structure.`,
            ]);
          } else if (notableReason === 'check') {
            noteText = pickCoachLine([
              "Check! Forcing your king to respond immediately.",
              "Active check to disrupt your king's coordination.",
            ]);
          } else if (notableReason === 'castle') {
            noteText = pickCoachLine([
              "I castle to tuck my king safely away and connect my rooks.",
              "Securing my king before opening up the center.",
            ]);
          } else if (notableReason === 'development') {
            noteText = pickCoachLine([
              `Developing my ${result.san[0] === 'N' ? 'knight' : 'bishop'} toward active central diagonals.`,
              "Mobilizing another piece into the fight.",
            ]);
          }

          if (noteText) {
            setCoachExpression('thumbsup');
            pushCoachMessage(noteText);
          }
        }
      }
    }

    coachThinking.current = false;
    checkGameStatus();
  }, [chess, activeConfig, currentOpening, checkGameStatus, updateMoves, pickCoachLine, pushCoachMessage]);

  // User Move Handler
  const handleUserMove = (from: string, to: string, promotion?: string) => {
    if (chess.isGameOver() || coachThinking.current) return false;

    // Check turn
    const turn = chess.turn();
    const userIsWhite = userColor === 'white';
    const isUserTurn = (userIsWhite && turn === 'w') || (!userIsWhite && turn === 'b');
    if (!isUserTurn) return false;

    try {
      const evalBefore = EngineService.evaluatePosition(chess);
      const plyCount = movesRef.current.length;

      const result = chess.move({
        from: from as Square,
        to: to as Square,
        promotion: promotion || 'q',
      });

      if (!result) return false;

      // Sound
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
      setArrows([]);
      setHighlights([]);

      const evalAfter = -EngineService.evaluatePosition(chess);
      const evalDrop = (evalBefore - evalAfter) / 100;
      const isEarlyQueen = plyCount <= 4 && result.piece === 'q';

      let classification: MoveClassification = 'good';
      let coachExp: CoachExpression = 'thumbsup';
      let comment: string | null = null;

      if (isEarlyQueen) {
        classification = evalDrop >= 1.0 ? 'mistake' : 'inaccuracy';
        coachExp = 'thinking';
        comment = pickCoachLine([
          "Careful with early queen sorties—it gives the opponent easy developing moves with tempo.",
          "Bringing your queen out this early makes her an easy target for enemy minor pieces.",
          "Risky to activate the queen so early! Developing minor pieces first keeps your king safe.",
        ]);
      } else if (evalDrop >= 2.0) {
        classification = 'blunder';
        coachExp = 'embarrassed';
        comment = pickCoachLine([
          "Ouch, that drops decisive material. Look closely at what is attacked before moving!",
          "That leaves a piece vulnerable. Keep all pieces guarded before advancing.",
          "A painful slip. Double-check your landing squares for opponent threats.",
        ]);
      } else if (evalDrop >= 0.9) {
        classification = 'mistake';
        coachExp = 'thinking';
        comment = pickCoachLine([
          "That gives your opponent a clear tactical opening. Look for defensive resources.",
          "A tricky move that lets the opponent counter-attack. Stay alert!",
          "Careful there—that conceded control of key central squares.",
        ]);
      } else if (evalDrop >= 0.35) {
        classification = 'inaccuracy';
        coachExp = 'thinking';
        comment = pickCoachLine([
          "A slightly passive move. Developing toward the center was more pressing.",
          "A bit slow. Try to challenge central squares or activate your minor pieces.",
          "Not the sharpest continuation, but your position remains playable.",
        ]);
      } else if (result.captured) {
        classification = 'best';
        coachExp = 'thumbsup';
        comment = pickCoachLine([
          `Good capture on ${result.to}! Fighting for initiative.`,
          `Solid trade on ${result.to}, keeping the pressure on.`,
        ]);
      } else if (chess.isCheck()) {
        classification = 'best';
        coachExp = 'brilliant';
        comment = pickCoachLine([
          "Active check! Putting direct pressure on my king.",
          "Sharp check, forcing an immediate defensive response.",
        ]);
      } else if (result.san.includes('O-O')) {
        classification = 'best';
        coachExp = 'thumbsup';
        comment = pickCoachLine([
          "Castling early is textbook! King tucked away and rooks connected.",
          "Great timing on castling! King safety is secured.",
        ]);
      } else if (plyCount < 8 && ['n', 'b'].includes(result.piece)) {
        classification = 'good';
        coachExp = 'thumbsup';
        if (Math.random() < 0.6) {
          comment = pickCoachLine([
            `Nice development with ${result.san}. Controlling key central squares.`,
            `Smooth development. Bringing another piece into the fight.`,
          ]);
        }
      } else {
        classification = 'good';
        coachExp = 'thumbsup';
      }

      // Show badges only when Move Feedback is ON, and NEVER for 'good' or 'book' in Play mode:
      const showBadge = Boolean(
        activeConfig?.moveFeedback &&
        ['brilliant', 'great', 'best', 'inaccuracy', 'mistake', 'miss', 'blunder'].includes(classification)
      );

      const currentHistory = movesRef.current;
      const newMoveObj: Move = {
        san: result.san,
        from: result.from,
        to: result.to,
        color: result.color,
        fen: newFen,
        moveNumber: Math.floor(currentHistory.length / 2) + 1,
        classification: showBadge ? classification : undefined,
        eval: { eval: Number((evalAfter / 100).toFixed(1)) },
      };

      const updatedMoves = [...currentHistory, newMoveObj];
      updateMoves(() => updatedMoves);

      // Check opening name
      const opening = OpeningService.identifyOpening(updatedMoves.map((m) => m.san));
      if (opening) {
        setCurrentOpening(opening);
      }

      // Coach comment
      if (activeConfig?.coachComments && comment) {
        setCoachExpression(coachExp);
        pushCoachMessage(comment);
      }

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

  // Illegal Move Handler
  const handleIllegalMove = (from: string, _attemptedTo: string) => {
    try {
      const legalMoves = chess.moves({ square: from as Square, verbose: true });
      const targetSquares = legalMoves.map((m) => m.to);
      setHighlights([from, ...targetSquares]);
    } catch {
      setHighlights([from]);
    }

    setCoachExpression('thinking');
    const line = ILLEGAL_MOVE_TEACHING_LINES[Math.floor(Math.random() * ILLEGAL_MOVE_TEACHING_LINES.length)];
    // No classification header or moveSan for illegal moves in Play mode:
    pushCoachMessage(line);

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

    setCoachExpression('thinking');
    pushCoachMessage(`Hint: Consider moving from ${bestCandidate.from} to ${bestCandidate.to} to maximize piece activity.`);
  };

  // Takeback Handler
  const handleTakeback = () => {
    if (moves.length < 2) return;
    chess.undo(); // undo coach move
    chess.undo(); // undo user move
    setFen(chess.fen());
    updateMoves((prev) => prev.slice(0, -2));
    setArrows([]);
    setHighlights([]);

    setCoachExpression('wave');
    pushCoachMessage('Takeback allowed! Take your time to re-evaluate the position.');
  };

  // Resign Handler
  const handleResign = () => {
    setShowResignPopover(false);
    triggerGameOver('coach', 'by resignation');
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

  const { whiteAdvantage, blackAdvantage, capturedByWhite, capturedByBlack } = useMemo(
    () => calculateMaterialTally(chess),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fen]
  );

  const isUserBottom = orientation === userColor;

  const topColor = orientation === 'white' ? 'black' : 'white';
  const bottomColor = orientation === 'white' ? 'white' : 'black';

  const topCaptured = topColor === 'white' ? capturedByWhite : capturedByBlack;
  const topAdvantage = topColor === 'white' ? whiteAdvantage : blackAdvantage;
  const bottomCaptured = bottomColor === 'white' ? capturedByWhite : capturedByBlack;
  const bottomAdvantage = bottomColor === 'white' ? whiteAdvantage : blackAdvantage;

  const turnChar = fen.split(' ')[1]; // 'w' or 'b'
  const isTopActive = !!activeConfig && !gameOver && turnChar === (topColor === 'white' ? 'w' : 'b');
  const isBottomActive = !!activeConfig && !gameOver && turnChar === (bottomColor === 'white' ? 'w' : 'b');

  const coachInfo = {
    name: "Coach All-Chess",
    rating: activeConfig ? activeConfig.levelRating : lobbyLevel,
    avatar: <img src="/assets/coach/coach_neutral.webp" alt="Coach" className="w-full h-full object-cover" />,
    right: <span className="px-2.5 py-1 rounded-md bg-black/[0.06] dark:bg-black/25 text-[13px] font-bold text-theme-muted">{activeConfig ? activeConfig.levelName : `Rated ${lobbyLevel}`}</span>,
  };

  const userInfo = {
    name: me.username,
    rating: 905,
    avatar: <PlayerAvatar name="You" size={40} className="!rounded-none" />,
    right: (
      <>
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
              setTippingSquare(null);
              setKingBadges([]);
              setShowGameOverModal(false);
            }}
            className="text-xs font-semibold text-theme-muted hover:text-theme-text flex items-center gap-1 transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Exit to Lobby</span>
          </button>
        )}
      </>
    ),
  };

  const topPlayerInfo = isUserBottom ? coachInfo : userInfo;
  const bottomPlayerInfo = isUserBottom ? userInfo : coachInfo;

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full w-full overflow-y-auto lg:overflow-hidden lg:items-center lg:justify-center lg:gap-6 lg:px-6 lg:py-4 pb-20 lg:pb-4">
      {/* Center Zone: Board & Eval Bar */}
      <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-3 md:p-6 min-w-0 lg:!p-0 lg:h-full relative">
        <div className="w-full max-w-[min(calc(100vh-108px),900px)] flex flex-col gap-2">
          {/* Top Player */}
          <PlayerBar
            testId="player-top"
            name={topPlayerInfo.name}
            rating={topPlayerInfo.rating}
            avatar={topPlayerInfo.avatar}
            captured={topCaptured.map((p, idx) => (
              <span key={idx}>{PIECE_FIGURINES[p]}</span>
            ))}
            advantage={topAdvantage}
            active={isTopActive}
            right={topPlayerInfo.right}
          />

          {/* Board + Eval Bar */}
          <div className="flex items-stretch justify-center gap-1.5 sm:gap-2.5 w-full">
            {activeConfig?.evalBar && (
              <EvalBar
                evalScore={lastMoveObj?.eval?.eval || 0}
                orientation={orientation}
                height="auto"
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
                tippingPieceSquare={tippingSquare}
                autoMateEffects={false}
              />

              {/* King Badges on Game Over (Crown on winner's king, flag on loser's, 1/2 on draw) */}
              {kingBadges.map((kb) => {
                const box = badgeBox(kb.square, orientation);
                return (
                  <motion.div
                    key={`king-badge-${kb.square}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.25, 1], opacity: 1 }}
                    transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                    className="absolute pointer-events-none z-30 flex items-center justify-center"
                    style={{
                      left: `${box.left}%`,
                      top: `${box.top}%`,
                      width: `${box.size * 1.1}%`,
                      height: `${box.size * 1.1}%`,
                    }}
                  >
                    {kb.type === 'crown' && (
                      <span className="w-full h-full rounded-full bg-amber-400 text-black flex items-center justify-center shadow-lg border border-amber-300 text-sm select-none">
                        👑
                      </span>
                    )}
                    {kb.type === 'flag' && (
                      <span className="w-full h-full rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg border border-red-400 text-xs font-bold select-none">
                        🏳️
                      </span>
                    )}
                    {kb.type === 'draw' && (
                      <span className="w-full h-full rounded-full bg-gray-500 text-white flex items-center justify-center shadow-lg border border-gray-400 text-xs font-bold font-mono select-none">
                        ½
                      </span>
                    )}
                  </motion.div>
                );
              })}

              {/* Game Over Modal Over Board (Appears 300ms after king badges pop) */}
              {gameOver && showGameOverModal && (
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
    setTippingSquare(null);
                    setKingBadges([]);
                    setShowGameOverModal(false);
                  }}
                  onGameReview={() => navigate('/review/game-01')}
                />
              )}
            </div>
          </div>

          {/* Bottom Player */}
          <PlayerBar
            testId="player-bottom"
            name={bottomPlayerInfo.name}
            rating={bottomPlayerInfo.rating}
            avatar={bottomPlayerInfo.avatar}
            captured={bottomCaptured.map((p, idx) => (
              <span key={idx}>{PIECE_FIGURINES[p]}</span>
            ))}
            advantage={bottomAdvantage}
            active={isBottomActive}
            right={bottomPlayerInfo.right}
          />
        </div>
      </div>

      {/* Right Zone: Lobby or In-Game Panel (460px to 500px, clamp 380-500) */}
      <SidebarPanel className="w-full lg:w-[400px] xl:w-[440px] flex-shrink-0 lg:h-[calc(100vh-32px)] z-20" testId="play-panel">
        <SidebarHeader
          title="Play Coach"
          icon={<img src="/assets/ui/icon_play.webp" alt="" className="w-9 h-9 object-contain" />}
          right={
            <span
              className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded border ${
                activeConfig
                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                  : 'bg-theme-raised text-theme-muted border-theme-border'
              }`}
            >
              {activeConfig ? `Live · ${Math.floor(moves.length / 2)}` : 'Setup'}
            </span>
          }
        />
        {/* Panel Content (Scrollable with fixed container for 200ms cross-fade) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence mode="wait">
            {!activeConfig ? (
              <motion.div
                key="lobby"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <PlayLobby
                  onStartGame={handleStartGame}
                  selectedLevel={lobbyLevel}
                  onLevelChange={setLobbyLevel}
                />
              </motion.div>
            ) : (
              <motion.div
                key="game"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Coach Portrait + Stacked Speech Bubbles (Max 2 bubbles, newest next to portrait) */}
                <CoachSpeech
                  expression={coachExpression}
                  messages={stackedMessages}
                  voiceEnabled={coachVoiceEnabled}
                  size={80}
                />

                {/* Live Action Controls: Resign, Hint, Takeback (Equal width 48px buttons) */}
                <div className="relative pt-1 w-full space-y-2">
                  {/* Resign Popover: Anchored directly above flag button with arrow, never covering bubbles */}
                  {showResignPopover && (
                    <div
                      ref={resignPopoverRef}
                      className="absolute left-0 bottom-full mb-2 w-56 p-3 rounded-lg bg-theme-raised border border-theme-border shadow-2xl z-40 flex flex-col gap-2 after:content-[''] after:absolute after:top-full after:left-8 after:border-[6px] after:border-transparent after:border-t-theme-border after:-mb-1.5"
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

                  <div className="flex items-center gap-2 w-full">
                    <Button
                      variant="secondary"
                      size="md"
                      className="!h-12 flex-1"
                      icon={<Flag size={20} />}
                      onClick={() => setShowResignPopover((v) => !v)}
                      disabled={Boolean(gameOver)}
                      title="Resign"
                    />

                    {activeConfig.showHints && (
                      <Button
                        variant="primary"
                        size="md"
                        className="!h-12 flex-1"
                        icon={<Lightbulb size={20} />}
                        onClick={handleHint}
                        disabled={Boolean(gameOver)}
                        title="Get Hint"
                      />
                    )}

                    {activeConfig.allowTakebacks && (
                      <Button
                        variant="secondary"
                        size="md"
                        className="!h-12 flex-1"
                        icon={<RotateCcw size={20} />}
                        onClick={handleTakeback}
                        disabled={moves.length < 2 || Boolean(gameOver)}
                        title="Take Back Move"
                      />
                    )}
                  </div>

                  {/* Sub-action row underneath */}
                  <div className="flex items-center justify-between px-1 text-xs text-theme-muted">
                    <button
                      type="button"
                      onClick={() => setOrientation((o) => (o === 'white' ? 'black' : 'white'))}
                      className="flex items-center gap-1 hover:text-theme-text transition-colors p-1"
                      title="Flip Board (F)"
                    >
                      <RotateCcw size={14} />
                      <span>Flip</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadPgn}
                      className="flex items-center gap-1 hover:text-theme-text transition-colors p-1"
                      title="Download PGN"
                    >
                      <Download size={14} />
                      <span>Download PGN</span>
                    </button>
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
    setTippingSquare(null);
                        setKingBadges([]);
                        setShowGameOverModal(false);
                      }}
                      className="flex items-center gap-1 hover:text-theme-text transition-colors p-1"
                    >
                      <ArrowLeft size={14} />
                      <span>Exit Match</span>
                    </button>
                  </div>
                </div>

                {/* Live Move List */}
                <Card className="p-3">
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-theme-border/40">
                    <div className="flex items-center gap-2 min-w-0">
                      <BookOpen size={15} className="text-amber-500 flex-shrink-0" />
                      <span className="text-xs font-bold text-theme-text truncate" title={currentOpening ? currentOpening.name : 'Starting Position'}>
                        {currentOpening ? currentOpening.name : 'Starting Position'}
                      </span>
                    </div>
                    {currentOpening && (
                      <span className="text-xs font-bold text-amber-500 font-mono flex-shrink-0 bg-amber-500/10 px-1.5 py-0.5 rounded">
                        {currentOpening.eco}
                      </span>
                    )}
                  </div>
                  <MoveList
                    moves={moves}
                    currentMoveIndex={moves.length - 1}
                    onSelectMove={() => {}}
                  />
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SidebarPanel>
    </div>
  );
};
export default PlayGame;