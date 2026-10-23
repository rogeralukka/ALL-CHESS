import React from 'react';
import { motion } from 'framer-motion';
import { Arrow } from '@/data/types';
import { useMotion } from '@/lib/useMotion';

interface ArrowLayerProps {
  arrows: Arrow[];
  orientation: 'white' | 'black';
}

const ARROW_COLORS = {
  green: 'rgba(123, 182, 97, 0.72)',
  red: 'rgba(232, 72, 59, 0.72)',
  blue: 'rgba(111, 155, 209, 0.72)',
  orange: 'rgba(245, 154, 75, 0.72)',
};

export const ArrowLayer: React.FC<ArrowLayerProps> = ({ arrows, orientation }) => {
  const { isFull } = useMotion();
  if (!arrows || arrows.length === 0) return null;

  const squareToCoords = (sq: string) => {
    if (!sq || sq.length < 2) return { x: 0, y: 0 };
    const file = sq.charCodeAt(0) - 97; // a=0, h=7
    const rank = parseInt(sq[1], 10) - 1; // 1=0, 8=7

    const col = orientation === 'white' ? file : 7 - file;
    const row = orientation === 'white' ? 7 - rank : rank;

    // center of 12.5% square in 100x100 viewBox
    const x = col * 12.5 + 6.25;
    const y = row * 12.5 + 6.25;
    return { x, y };
  };

  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
      aria-hidden="true"
    >
      <defs>
        {Object.entries(ARROW_COLORS).map(([colorName, colorVal]) => (
          <marker
            key={colorName}
            id={`arrowhead-${colorName}`}
            markerWidth="4"
            markerHeight="4"
            refX="2.5"
            refY="2"
            orient="auto"
          >
            <polygon points="0 0, 4 2, 0 4" fill={colorVal} />
          </marker>
        ))}
      </defs>

      {arrows.map((arr, i) => {
        const from = squareToCoords(arr.from);
        const to = squareToCoords(arr.to);
        const color = arr.color || 'green';
        const colorVal = ARROW_COLORS[color] || ARROW_COLORS.green;

        // Calculate slightly shortened line so arrowhead doesn't overshoot
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const angle = Math.atan2(dy, dx);
        const shortenBy = 3.5;
        const toX = to.x - shortenBy * Math.cos(angle);
        const toY = to.y - shortenBy * Math.sin(angle);

        return (
          <motion.line
            key={`${arr.from}-${arr.to}-${i}`}
            x1={from.x}
            y1={from.y}
            x2={toX}
            y2={toY}
            stroke={colorVal}
            strokeWidth="2.4"
            strokeLinecap="round"
            markerEnd={`url(#arrowhead-${color})`}
            initial={isFull ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: isFull ? 0.2 : 0, ease: [0, 0, 0.2, 1] }}
          />
        );
      })}
    </svg>
  );
};
