import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BoardBadge } from '@/data/types';
import { ClassificationBadge } from '@/components/ClassificationBadge';
import { useMotion } from '@/lib/useMotion';

interface BadgeLayerProps {
  badges: BoardBadge[];
  orientation: 'white' | 'black';
}

/**
 * Badge geometry, measured from the reference board (in square units):
 *  - diameter 0.40 of a square
 *  - centre 0.94 across and 0.06 down from the destination square's top-left corner,
 *    so it overhangs the top-right corner slightly but clearly belongs to that square.
 * Positioning lives on a plain wrapper; the pop animation lives on an inner element.
 * (Putting both on one motion element lets framer-motion's scale transform wipe the
 * translate, which is what pushed badges into the neighbouring square before.)
 */
const SQUARE = 12.5; // % of board per square
const BADGE_DIAMETER = 0.4; // squares
const CENTER_X = 0.94; // squares from the square's left edge
const CENTER_Y = 0.06; // squares from the square's top edge

export const badgeBox = (square: string, orientation: 'white' | 'black') => {
  const file = square.charCodeAt(0) - 97;
  const rank = parseInt(square[1], 10) - 1;
  const col = orientation === 'white' ? file : 7 - file;
  const row = orientation === 'white' ? 7 - rank : rank;
  const size = BADGE_DIAMETER * SQUARE;
  return {
    left: (col + CENTER_X) * SQUARE - size / 2,
    top: (row + CENTER_Y) * SQUARE - size / 2,
    size,
  };
};

export const BadgeLayer: React.FC<BadgeLayerProps> = ({ badges, orientation }) => {
  const { isReduced, isOff } = useMotion();
  if (!badges || badges.length === 0) return null;

  return (
    // overflow visible: badges on the top or right edge overhang the board, as in the reference
    <div className="absolute inset-0 w-full h-full pointer-events-none z-30">
      <AnimatePresence>
        {badges.map((b) => {
          const box = badgeBox(b.square, orientation);
          return (
            <div
              key={`${b.square}-${b.label}`}
              data-testid={`badge-${b.square}`}
              data-square={b.square}
              className="absolute"
              style={{
                left: `${box.left}%`,
                top: `${box.top}%`,
                width: `${box.size}%`,
                height: `${box.size}%`,
                filter: 'drop-shadow(0 1px 1.5px rgba(0,0,0,.35))',
              }}
            >
              <motion.div
                className="w-full h-full"
                initial={isOff ? { scale: 1, opacity: 1 } : isReduced ? { scale: 1, opacity: 0 } : { scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={isOff ? { opacity: 0 } : { scale: 0.6, opacity: 0, transition: { duration: 0.12 } }}
                transition={
                  isOff
                    ? { duration: 0 }
                    : isReduced
                    ? { duration: 0.15 }
                    : // 0.3s, slight overshoot, matching the reference effect curve family
                      { type: 'tween', duration: 0.3, ease: [0.34, 1.4, 0.64, 1] }
                }
              >
                <ClassificationBadge classification={b.label} size="fill" />
              </motion.div>
            </div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
