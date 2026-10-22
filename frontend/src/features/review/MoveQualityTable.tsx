import React, { useState } from 'react';
import { Game, MoveClassification } from '@/data/types';
import { CLASSIFICATION_META, ClassificationBadge } from '@/components/ClassificationBadge';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MoveQualityTableProps {
  game: Game;
  className?: string;
}

export const MoveQualityTable: React.FC<MoveQualityTableProps> = ({ game, className = '' }) => {
  const [expanded, setExpanded] = useState(false);

  // Count classifications for White and Black
  const counts: Record<MoveClassification, { white: number; black: number }> = {
    brilliant: { white: 0, black: 0 },
    great: { white: 0, black: 0 },
    best: { white: 0, black: 0 },
    excellent: { white: 0, black: 0 },
    good: { white: 0, black: 0 },
    book: { white: 0, black: 0 },
    inaccuracy: { white: 0, black: 0 },
    mistake: { white: 0, black: 0 },
    miss: { white: 0, black: 0 },
    blunder: { white: 0, black: 0 },
  };

  game.moves.forEach((m) => {
    if (m.classification && counts[m.classification]) {
      if (m.color === 'w') {
        counts[m.classification].white += 1;
      } else {
        counts[m.classification].black += 1;
      }
    }
  });

  const classificationOrder: MoveClassification[] = [
    'brilliant',
    'great',
    'best',
    'excellent',
    'good',
    'book',
    'inaccuracy',
    'mistake',
    'miss',
    'blunder',
  ];

  // Filter rows: collapsed shows only non-zero rows; expanded shows all
  const displayedLabels = classificationOrder.filter((cls) => {
    if (expanded) return true;
    return counts[cls].white > 0 || counts[cls].black > 0;
  });

  return (
    <div className={`w-full flex flex-col select-none ${className}`}>
      {/* Player Columns Header */}
      <div className="flex items-center justify-between px-3 py-1.5 text-xs font-bold text-theme-muted border-b border-theme-border/60">
        <span className="w-16 text-left truncate">{game.white.username}</span>
        <span className="flex-1 text-center font-display uppercase tracking-wider text-[11px]">
          Move Quality
        </span>
        <span className="w-16 text-right truncate">{game.black.username}</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-theme-border/30">
        {displayedLabels.map((cls) => {
          const meta = CLASSIFICATION_META[cls];
          const whiteCount = counts[cls].white;
          const blackCount = counts[cls].black;

          return (
            <div
              key={cls}
              className="flex items-center justify-between px-3 py-1.5 hover:bg-theme-raised/40 transition-colors"
            >
              {/* White Count */}
              <span
                className={`w-16 text-left font-mono font-bold text-sm ${
                  whiteCount > 0 ? 'opacity-100' : 'opacity-25'
                }`}
                style={{ color: whiteCount > 0 ? meta.color : undefined }}
              >
                {whiteCount}
              </span>

              {/* Centered Badge & Name */}
              <div className="flex items-center justify-center gap-2 flex-1">
                <ClassificationBadge classification={cls} size="sm" />
                <span className="text-xs font-semibold capitalize text-theme-text/90">
                  {meta.name}
                </span>
              </div>

              {/* Black Count */}
              <span
                className={`w-16 text-right font-mono font-bold text-sm ${
                  blackCount > 0 ? 'opacity-100' : 'opacity-25'
                }`}
                style={{ color: blackCount > 0 ? meta.color : undefined }}
              >
                {blackCount}
              </span>
            </div>
          );
        })}
      </div>

      {/* Expander Button */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="mt-2 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-theme-muted hover:text-theme-text transition-colors border-t border-theme-border/40"
      >
        <span>{expanded ? 'Collapse Table' : 'Show All Move Categories'}</span>
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
    </div>
  );
};
