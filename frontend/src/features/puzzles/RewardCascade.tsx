import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/Button';
import { Trophy, Sparkles } from 'lucide-react';

interface RewardCascadeProps {
  isOpen: boolean;
  levelNumber: number;
  pointsEarned: number;
  onNextPuzzle: () => void;
}

export const RewardCascade: React.FC<RewardCascadeProps> = ({
  isOpen,
  levelNumber,
  pointsEarned,
  onNextPuzzle,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
        {/* Rotating Light Rays Background */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[500px] h-[500px] opacity-20 pointer-events-none"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0deg, #f59e0b 20deg, transparent 40deg, #f59e0b 60deg, transparent 80deg, #f59e0b 100deg, transparent 120deg, #f59e0b 140deg, transparent 160deg, #f59e0b 180deg, transparent 200deg, #f59e0b 220deg, transparent 240deg, #f59e0b 260deg, transparent 280deg, #f59e0b 300deg, transparent 320deg, #f59e0b 340deg, transparent 360deg)',
          }}
        />

        {/* Level Celebration Stone Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
          className="relative w-full max-w-sm bg-gradient-to-b from-theme-card to-theme-raised border border-amber-500/40 rounded-xl shadow-2xl p-6 text-center flex flex-col items-center gap-4 z-10"
        >
          {/* Animated Trophy Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-500 shadow-lg"
          >
            <Trophy size={32} />
          </motion.div>

          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-500">
              Tactical Mastery
            </span>
            <h2 className="text-2xl font-black font-display text-theme-text mt-0.5">
              You Completed Level {levelNumber}!
            </h2>
            <p className="text-xs text-theme-muted mt-1">
              Outstanding tactical calculation and pattern recognition.
            </p>
          </div>

          <div className="py-2 px-4 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold font-mono text-sm flex items-center gap-1.5">
            <Sparkles size={16} />
            <span>+{pointsEarned} Puzzle Rating Points</span>
          </div>

          <div className="w-full pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={onNextPuzzle}
            >
              Continue to Level {levelNumber + 1}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
