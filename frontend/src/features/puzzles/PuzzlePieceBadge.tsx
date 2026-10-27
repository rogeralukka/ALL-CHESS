import React from 'react';

/** The 3D puzzle piece with a level number on it: shown by the Puzzles title and at the end of the progress bar. */
export const PuzzlePieceBadge: React.FC<{ n: number; size?: number; className?: string }> = ({ n, size = 44, className = '' }) => (
  <span className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`} style={{ width: size, height: size }}>
    <img src="/assets/ui/icon_puzzles.webp" alt="" draggable={false} className="w-full h-full object-contain" style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,.35))' }} />
    <span
      className="absolute font-display font-black leading-none text-white"
      style={{
        fontSize: size * 0.4,
        left: '50%',
        top: '47%',
        transform: 'translate(-50%, -50%)',
        textShadow: '0 1.5px 0 rgba(60,25,0,.85), 1px 0 0 rgba(60,25,0,.7), -1px 0 0 rgba(60,25,0,.7)',
      }}
    >
      {n}
    </span>
  </span>
);

export default PuzzlePieceBadge;
