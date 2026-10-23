import React, { useEffect } from 'react';
import { motion, AnimatePresence, TargetAndTransition } from 'framer-motion';
import { CoachExpression } from '@/data/types';
import { COACH_MANIFEST, getCoachAsset } from '@/data/coachManifest';
import { useMotion } from '@/lib/useMotion';

interface CoachAvatarProps {
  expression: CoachExpression;
  mode?: 'bust' | 'full';
  size?: number; // size in px, defaults to 96 for bust, 320 for full
  className?: string;
}

export const CoachAvatar: React.FC<CoachAvatarProps> = ({
  expression,
  mode = 'bust',
  size,
  className = '',
}) => {
  const { isFull, isReduced, isOff } = useMotion();

  useEffect(() => {
    // Preload all expression assets from manifest on mount
    Object.values(COACH_MANIFEST.expressions).forEach((entry) => {
      const img = new Image();
      img.src = mode === 'full' ? entry.full : entry.bust;
    });
  }, [mode]);

  const asset = getCoachAsset(expression);
  const src = mode === 'full' ? asset.full : asset.bust;
  const fallback = mode === 'full' ? asset.fallbackFull : asset.fallbackBust;

  const width = size || (mode === 'bust' ? 96 : 280);
  const height = size || (mode === 'bust' ? 96 : 320);

  // Pose-specific animation for full motion
  let poseAnimation: TargetAndTransition | undefined = undefined;
  if (isFull) {
    if (expression === 'embarrassed') {
      poseAnimation = {
        x: [0, -3, 3, -2, 2, 0],
        transition: { duration: 0.3, ease: 'easeInOut' },
      };
    } else if (expression === 'brilliant') {
      poseAnimation = {
        y: [0, -4, 0],
        transition: { duration: 0.3, ease: [0.2, 0, 0, 1] },
      };
    } else {
      poseAnimation = {
        y: [0, -2, 0],
        transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
      };
    }
  }

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
          initial={
            isOff
              ? { opacity: 1, scale: 1 }
              : isReduced
              ? { opacity: 0, scale: 1 }
              : { opacity: 0, scale: 1.03 }
          }
          animate={{ opacity: 1, scale: 1 }}
          exit={
            isOff
              ? { opacity: 1 }
              : { opacity: 0, transition: { duration: isReduced ? 0.12 : 0.15 } }
          }
          transition={{
            opacity: { duration: isOff ? 0 : isReduced ? 0.12 : 0.15, ease: [0, 0, 0.2, 1] },
            scale: { duration: isFull ? 0.3 : 0, ease: [0, 0, 0.2, 1] },
          }}
          className="w-full h-full flex items-end justify-center"
        >
          <motion.div
            animate={poseAnimation}
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
