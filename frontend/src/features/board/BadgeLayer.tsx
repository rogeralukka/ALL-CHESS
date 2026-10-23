import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BoardBadge } from '@/data/types';
import { ClassificationBadge } from '@/components/ClassificationBadge';

interface BadgeLayerProps {
  badges: BoardBadge[];
  orientation: 'white' | 'black';
}

export const BadgeLayer: React.FC<BadgeLayerProps> = ({ badges, orientation }) => {
  if (!badges || badges.length === 0) return null;

  const squareToPercent = (sq: string) => {
    const file = sq.charCodeAt(0) - 97;
    const rank = parseInt(sq[1], 10) - 1;
    const col = orientation === 'white' ? file : 7 - file;
    const row = orientation === 'white' ? 7 - rank : rank;

    // Position at top-right inside the destination square:
    // Destination square bounds: [col * 12.5%, (col + 1) * 12.5%] horizontally, [row * 12.5%, (row + 1) * 12.5%] vertically.
    // Clamped inside the destination square with a slight inward padding so it never covers neighboring squares
    return {
      left: `${(col + 1) * 12.5}%`,
      top: `${row * 12.5}%`,
    };
  };

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-hidden">
      <AnimatePresence>
        {badges.map((b) => {
          const pos = squareToPercent(b.square);
          return (
            <motion.div
              key={`${b.square}-${b.label}`}
              data-testid={`badge-${b.square}`}
              data-square={b.square}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
              style={{
                position: 'absolute',
                left: pos.left,
                top: pos.top,
                // Shift -90% horizontally and +8% vertically so it sits entirely inside the square's top-right corner
                transform: 'translate(-92%, 8%)',
              }}
            >
              <ClassificationBadge classification={b.label} size="square" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
