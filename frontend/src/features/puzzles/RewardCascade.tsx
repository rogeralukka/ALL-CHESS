import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/Button';
import { Trophy, Sparkles } from 'lucide-react';
import { useMotion } from '@/lib/useMotion';

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
  const { isFull, isReduced, isOff } = useMotion();
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
        {/* Rotating Light Rays Background (Soft Edges, Full mode only) */}
        {isFull && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[600px] h-[600px] opacity-30 pointer-events-none"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg, rgba(245,158,11,0.4) 15deg, transparent 30deg, rgba(245,158,11,0.4) 45deg, transparent 60deg, rgba(245,158,11,0.4) 75deg, transparent 90deg, rgba(245,158,11,0.4) 105deg, transparent 120deg, rgba(245,158,11,0.4) 135deg, transparent 150deg, rgba(245,158,11,0.4) 165deg, transparent 180deg, rgba(245,158,11,0.4) 195deg, transparent 210deg, rgba(245,158,11,0.4) 225deg, transparent 240deg, rgba(245,158,11,0.4) 255deg, transparent 270deg, rgba(245,158,11,0.4) 285deg, transparent 300deg, rgba(245,158,11,0.4) 315deg, transparent 330deg, rgba(245,158,11,0.4) 345deg, transparent 360deg)',
              maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)',
              WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)',
            }}
          />
        )}

        {/* Level Celebration Stone Card */}
        <motion.div
          initial={
            isOff
              ? { opacity: 1 }
              : isReduced
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.8, y: 8 }
          }
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: isReduced ? 1 : 0.8 }}
          transition={{ duration: isOff ? 0 : isReduced ? 0.2 : 0.35, ease: [0, 0, 0.2, 1] }}
          className="relative w-full max-w-sm bg-gradient-to-b from-theme-card to-theme-raised border border-amber-500/40 rounded-xl shadow-2xl p-6 text-center flex flex-col items-center gap-4 z-10"
        >
          {/* Animated Trophy Icon */}
          <motion.div
            initial={isFull ? { scale: 0 } : { scale: 1 }}
            animate={isFull ? { scale: [0, 1.2, 1] } : { scale: 1 }}
            transition={{ duration: isFull ? 0.4 : 0, delay: isFull ? 0.1 : 0 }}
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
