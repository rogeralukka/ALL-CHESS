import React from 'react';
import { motion } from 'framer-motion';
import { badgeBox } from './BadgeLayer';

interface MateBadgesProps {
  loser: string; // mated king's square
  winner: string; // winning king's square
  orientation: 'white' | 'black';
  animate: boolean;
}

/**
 * Checkmate markers, in the same corner position as move badges:
 *  - mated king: dark circle with "#"
 *  - winning king: gold circle with a crown
 * They pop in (0.3s, slight overshoot) after the mated king starts to tip over.
 */
export const MateBadges: React.FC<MateBadgesProps> = ({ loser, winner, orientation, animate }) => {
  const items: Array<{ sq: string; kind: 'mate' | 'win'; delay: number }> = [
    { sq: loser, kind: 'mate', delay: 0.45 },
    { sq: winner, kind: 'win', delay: 0.6 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {items.map(({ sq, kind, delay }) => {
        if (!sq) return null;
        const box = badgeBox(sq, orientation);
        return (
          <div
            key={`${kind}-${sq}`}
            data-testid={`mate-badge-${kind}`}
            className="absolute"
            style={{
              left: `${box.left}%`,
              top: `${box.top}%`,
              width: `${box.size}%`,
              height: `${box.size}%`,
              filter: 'drop-shadow(0 1px 1.5px rgba(0,0,0,.4))',
            }}
          >
            <motion.div
              className="w-full h-full"
              initial={animate ? { scale: 0.3, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.34, 1.4, 0.64, 1], delay: animate ? delay : 0 }}
            >
              <svg viewBox="0 0 32 32" width="100%" height="100%" role="img" aria-label={kind === 'mate' ? 'Checkmated king' : 'Winning king'}>
                {kind === 'mate' ? (
                  <>
                    <circle cx={16} cy={17.1} r={14.6} fill="#121110" />
                    <circle cx={16} cy={16} r={14.6} fill="#2b2927" />
                    <text
                      x={16}
                      y={16.5}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontFamily="Inter, system-ui, sans-serif"
                      fontWeight={800}
                      fontSize={17}
                      fill="#ffffff"
                    >
                      #
                    </text>
                  </>
                ) : (
                  <>
                    <circle cx={16} cy={17.1} r={14.6} fill="#a8801f" />
                    <circle cx={16} cy={16} r={14.6} fill="#f2c14e" />
                    <path d="M8.5 21.5h15l1.4-9.2-4.6 3.6L16 9.2l-4.3 6.7-4.6-3.6z" fill="#ffffff" />
                    <rect x={8.5} y={22.6} width={15} height={2.2} rx={1} fill="#ffffff" />
                  </>
                )}
              </svg>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};
