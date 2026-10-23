import React from 'react';
import spriteData from '@/data/mapSprites.json';

const SPRITES = spriteData.sprites as Record<string, { w: number; h: number; tx: number; ty: number }>;

/** The current-level marker next to the puzzle progress bar: the map's gold tile with the level number. */
export const LevelBadge: React.FC<{ level: number; width?: number }> = ({ level, width = 46 }) => {
  const s = SPRITES['tile_current'];
  if (!s) {
    return (
      <span className="inline-flex items-center justify-center w-10 h-8 rounded-md bg-amber-400 text-[#5b3613] font-display font-black">
        {level}
      </span>
    );
  }
  const k = width / s.w;
  return (
    <span className="relative inline-block align-middle" style={{ width, height: s.h * k }}>
      <img src="/assets/map/tile_current.webp" alt="" className="w-full h-full" draggable={false} />
      <span
        className="absolute font-display font-black leading-none"
        style={{
          left: s.tx * k,
          top: s.ty * k,
          transform: 'translate(-50%, -54%)',
          fontSize: width * 0.36,
          color: '#5b3613',
          textShadow: '0 1px 0 rgba(255,240,200,0.7)',
        }}
      >
        {level}
      </span>
    </span>
  );
};

export default LevelBadge;
