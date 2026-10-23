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

  // Filter rows: collapsed hides zero rows (both white and black are 0); expanded shows all
  const displayedLabels = classificationOrder.filter((cls) => {
    if (expanded) return true;
    return counts[cls].white > 0 || counts[cls].black > 0;
  });

  return (
    <div className={`w-full flex flex-col select-none ${className}`}>
      {/* Table Header: Classification label on left, Player Avatars as column headers */}
      <div className="flex items-center justify-between px-3 py-2 text-xs font-bold text-theme-muted border-b border-theme-border/60">
        <span className="flex-1 text-left uppercase tracking-wider text-xs">
          Classification
        </span>
        <div className="w-14 flex items-center justify-center">
          <div
            className="w-6 h-6 rounded-full bg-white text-neutral-900 border border-neutral-300 font-bold flex items-center justify-center text-xs shadow-sm"
            title={`White: ${game.white.username} (${game.white.rating})`}
          >
            W
          </div>
        </div>
        <div className="w-14 flex items-center justify-center">
          <div
            className="w-6 h-6 rounded-full bg-neutral-900 text-white border border-neutral-700 font-bold flex items-center justify-center text-xs shadow-sm"
            title={`Black: ${game.black.username} (${game.black.rating})`}
          >
            B
          </div>
        </div>
      </div>

      {/* Rows: Full width, label + icon on left, tabular counts under avatars */}
      <div className="divide-y divide-theme-border/30">
        {displayedLabels.map((cls) => {
          const meta = CLASSIFICATION_META[cls];
          const whiteCount = counts[cls].white;
          const blackCount = counts[cls].black;

          return (
            <div
              key={cls}
              className="flex items-center justify-between px-3 py-2 hover:bg-theme-raised/40 transition-colors"
            >
              {/* Left Column: Classification badge + Name */}
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <ClassificationBadge classification={cls} size="sm" showLabel={false} />
                <span className="text-xs font-semibold capitalize text-theme-text truncate">
                  {meta.name}
                </span>
              </div>

              {/* White Count Column */}
              <div className="w-14 text-center">
                <span
                  className={`font-mono font-bold text-sm ${
                    whiteCount > 0 ? 'opacity-100' : 'opacity-25'
                  }`}
                  style={{ color: whiteCount > 0 ? meta.color : undefined }}
                >
                  {whiteCount}
                </span>
              </div>

              {/* Black Count Column */}
              <div className="w-14 text-center">
                <span
                  className={`font-mono font-bold text-sm ${
                    blackCount > 0 ? 'opacity-100' : 'opacity-25'
                  }`}
                  style={{ color: blackCount > 0 ? meta.color : undefined }}
                >
                  {blackCount}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expander Button for Zero-Count Rows */}
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
