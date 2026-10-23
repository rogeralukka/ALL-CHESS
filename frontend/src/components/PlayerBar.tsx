import React from 'react';

interface PlayerBarProps {
  name: string;
  rating?: number | string;
  avatar: React.ReactNode;
  /** captured piece figurines, already rendered */
  captured?: React.ReactNode;
  advantage?: number;
  right?: React.ReactNode;
  /** highlight when it's this player's turn */
  active?: boolean;
  testId?: string;
}

/** Player row above/below the board, in the reference's proportions: 40px avatar, bold name, rating. */
export const PlayerBar: React.FC<PlayerBarProps> = ({ name, rating, avatar, captured, advantage, right, active, testId }) => (
  <div className="flex items-center justify-between gap-3 px-1 py-1 min-h-[48px]" data-testid={testId}>
    <div className="flex items-center gap-2.5 min-w-0">
      <div className={`w-10 h-10 rounded-[6px] overflow-hidden flex-shrink-0 bg-black/[0.06] dark:bg-black/25 flex items-center justify-center transition-shadow ${active ? 'ring-2 ring-amber-500/80' : 'ring-1 ring-white/10'}`}>
        {avatar}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-[15px] text-theme-text truncate">{name}</span>
          {rating !== undefined && <span className="text-[14px] text-theme-muted tabular-nums">({rating})</span>}
        </div>
        <div className="flex items-center gap-1 h-[18px] text-[15px] leading-none text-theme-muted">
          {captured}
          {advantage !== undefined && advantage > 0 && <span className="ml-1 text-[13px] font-bold text-theme-muted">+{advantage}</span>}
        </div>
      </div>
    </div>
    {right}
  </div>
);

export default PlayerBar;
