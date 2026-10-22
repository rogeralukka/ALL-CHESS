import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CoachExpression } from '@/data/types';

interface CoachAvatarProps {
  expression: CoachExpression;
  mode?: 'bust' | 'full';
  size?: number; // size in px, defaults to 96 for bust, 320 for full
  className?: string;
}

// Expression to asset path mapping
const AVATAR_ASSETS: Record<CoachExpression, { bust: string; full: string; fallbackBust: string; fallbackFull: string }> = {
  neutral: {
    bust: '/assets/coach/coach_neutral.webp',
    full: '/assets/coach/coach_neutral_full.webp',
    fallbackBust: '/assets/coach/coach_neutral.png',
    fallbackFull: '/assets/coach/coach_neutral_full.png',
  },
  thinking: {
    bust: '/assets/coach/coach_thinking.webp',
    full: '/assets/coach/coach_thinking_full.webp',
    fallbackBust: '/assets/coach/coach_thinking.png',
    fallbackFull: '/assets/coach/coach_thinking_full.png',
  },
  thumbsup: {
    bust: '/assets/coach/coach_thumbsup.webp',
    full: '/assets/coach/coach_thumbsup_full.webp',
    fallbackBust: '/assets/coach/coach_best.png',
    fallbackFull: '/assets/coach/coach_best_full.png',
  },
  brilliant: {
    bust: '/assets/coach/coach_brilliant.webp',
    full: '/assets/coach/coach_brilliant_full.webp',
    fallbackBust: '/assets/coach/coach_brilliant.png',
    fallbackFull: '/assets/coach/coach_brilliant_full.png',
  },
  embarrassed: {
    bust: '/assets/coach/coach_embarrassed.webp',
    full: '/assets/coach/coach_embarrassed_full.webp',
    fallbackBust: '/assets/coach/coach_blunder.png',
    fallbackFull: '/assets/coach/coach_blunder_full.png',
  },
  wave: {
    bust: '/assets/coach/coach_wave.webp',
    full: '/assets/coach/coach_wave_full.webp',
    fallbackBust: '/assets/coach/coach_welcome.png',
    fallbackFull: '/assets/coach/coach_welcome_full.png',
  },
};

export const CoachAvatar: React.FC<CoachAvatarProps> = ({
  expression,
  mode = 'bust',
  size,
  className = '',
}) => {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Preload all expression assets on mount
    Object.values(AVATAR_ASSETS).forEach((asset) => {
      const img = new Image();
      img.src = mode === 'full' ? asset.full : asset.bust;
    });

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode]);

  const asset = AVATAR_ASSETS[expression] || AVATAR_ASSETS.neutral;
  const src = mode === 'full' ? asset.full : asset.bust;
  const fallback = mode === 'full' ? asset.fallbackFull : asset.fallbackBust;

  const width = size || (mode === 'bust' ? 96 : 280);
  const height = size || (mode === 'bust' ? 96 : 320);

  return (
    <div
      className={`relative overflow-hidden flex items-end justify-center select-none flex-shrink-0 ${
        mode === 'bust' ? 'rounded-md' : 'rounded-lg'
      } ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      aria-label={`Coach avatar with ${expression} expression`}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={`${expression}-${mode}`}
          initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.03 }}
          animate={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, transition: { duration: 0.15 } }}
          transition={{
            opacity: { duration: 0.15, ease: [0, 0, 0.2, 1] },
            scale: { duration: 0.3, ease: [0, 0, 0.2, 1] },
          }}
          className="w-full h-full flex items-end justify-center"
        >
          <motion.div
            animate={
              reduceMotion
                ? {}
                : {
                    y: [0, -2, 0],
                    transition: {
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }
            }
            className="w-full h-full flex items-end justify-center"
          >
            <picture className="w-full h-full flex items-end justify-center">
              <source srcSet={src} type="image/webp" />
              <img
                src={fallback}
                alt={`Coach - ${expression}`}
                className="w-full h-full object-contain pointer-events-none drop-shadow-sm"
                loading="eager"
              />
            </picture>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
