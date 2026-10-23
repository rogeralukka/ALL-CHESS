import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/Button';
import { CoachAvatar } from '@/features/coach/CoachAvatar';
import { Trophy, RotateCcw, Sparkles } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  winner: 'user' | 'coach' | 'draw';
  reason: string; // e.g. "by checkmate", "by resignation"
  userAccuracy?: number;
  onNewGame: () => void;
  onGameReview: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  winner,
  reason,
  userAccuracy = 84,
  onNewGame,
  onGameReview,
}) => {
  if (!isOpen) return null;

  const isUserWinner = winner === 'user';
  const isDraw = winner === 'draw';

  const title = isUserWinner
    ? 'You Won!'
    : isDraw
    ? 'Game Drawn'
    : 'Coach Won';

  const coachExp = isUserWinner ? 'brilliant' : isDraw ? 'neutral' : 'thumbsup';

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/40 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
          className="w-full max-w-sm bg-theme-card border border-theme-border rounded-lg shadow-2xl p-6 text-center flex flex-col items-center gap-4 relative overflow-hidden"
        >
          {/* Winner Coach Expression */}
          <div className="relative">
            <CoachAvatar expression={coachExp} mode="bust" size={84} />
            {isUserWinner && (
              <div className="absolute -top-2 -right-2 bg-amber-500 text-black p-1.5 rounded-full shadow-lg">
                <Trophy size={16} />
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-extrabold font-display text-theme-text">{title}</h2>
            <p className="text-xs font-semibold text-theme-muted uppercase tracking-wider mt-0.5">
              {reason}
            </p>
          </div>

          {/* Performance snippet */}
          <div className="w-full py-2.5 px-3 rounded-md bg-theme-raised/60 border border-theme-border/60 flex justify-between items-center text-xs">
            <span className="text-theme-muted">Estimated Accuracy</span>
            <span className="font-bold font-mono text-emerald-500">{userAccuracy}%</span>
          </div>

          {/* Actions: Primary Game Review, Secondary New Game */}
          <div className="flex flex-col gap-2 w-full pt-1">
            <Button
              variant="primary"
              size="md"
              fullWidth
              icon={<Sparkles size={16} />}
              onClick={onGameReview}
            >
              Game Review
            </Button>
            <Button
              variant="secondary"
              size="md"
              fullWidth
              icon={<RotateCcw size={16} />}
              onClick={onNewGame}
            >
              New Game
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
