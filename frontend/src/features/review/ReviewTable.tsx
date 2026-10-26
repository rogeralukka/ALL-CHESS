import React from 'react';
import { Game, MoveClassification, Player } from '@/data/types';
import { CLASSIFICATION_META, ClassificationBadge } from '@/components/ClassificationBadge';
import { PlayerAvatar } from '@/components/Bits';
import { useCurrentUser } from '@/lib/useCurrentUser';

/** Order and wording follow the reference review table. */
const ORDER: MoveClassification[] = ['brilliant', 'great', 'book', 'best', 'excellent', 'good', 'inaccuracy', 'mistake', 'miss', 'blunder'];

/** label column, then White's column, the icon column and Black's column */
const GRID = 'grid grid-cols-[41.6%_1fr_1fr_1fr] items-center';

const gradeTone = (g: string) =>
  g === 'A' ? '#81b64c' : g === 'B' ? '#6f9bd1' : g === 'C' ? '#f2c14e' : g === 'D' ? '#ef7d6e' : 'rgba(255,255,255,0.35)';

const RowLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[14px] font-semibold text-theme-muted">{children}</span>
);

const ValueBox: React.FC<{ value: React.ReactNode; tone: 'white' | 'black' }> = ({ value, tone }) => (
  <span
    className="inline-flex items-center justify-center min-w-[68px] h-[38px] px-2 rounded-[4px] text-[20px] font-extrabold tabular-nums leading-none"
    style={{ background: tone === 'white' ? '#ffffff' : '#e4e3e0', color: '#312e2b' }}
  >
    {value}
  </span>
);

interface ReviewTableProps {
  game: Game;
}

export const ReviewTable: React.FC<ReviewTableProps> = ({ game }) => {
  const me = useCurrentUser();
  const counts = Object.fromEntries(ORDER.map((c) => [c, { w: 0, b: 0 }])) as Record<MoveClassification, { w: number; b: number }>;
  game.moves.forEach((m) => {
    if (m.classification && counts[m.classification]) counts[m.classification][m.color === 'w' ? 'w' : 'b'] += 1;
  });

  const userIsWhite = game.isUserWhite ?? game.white.username === 'You';
  const player = (p: Player, isUser: boolean) => (
    <div className="flex flex-col items-center gap-1.5 min-w-0 px-1">
      <span className="text-[13px] font-bold text-theme-text truncate max-w-full">{me.label(p.username)}</span>
      <span className={`rounded-[4px] ${isUser ? 'ring-2 ring-[#81b64c]' : ''}`}>
        <PlayerAvatar name={p.username} size={64} square />
      </span>
    </div>
  );

  const g = game.phaseGrades;
  const phases = g
    ? [
        ['Opening', g.opening],
        ['Middlegame', g.middlegame],
        ['Tactics', g.tactics],
        ['Endgame', g.endgame],
      ]
    : [];

  return (
    <div className="px-4 pb-2 select-none" data-testid="review-table">
      <div className={`${GRID} py-3`}>
        <RowLabel>Players</RowLabel>
        <div className="flex justify-center">{player(game.white, userIsWhite)}</div>
        <span />
        <div className="flex justify-center">{player(game.black, !userIsWhite)}</div>
      </div>

      {game.accuracy && (
        <div className={`${GRID} py-2`}>
          <RowLabel>Accuracy</RowLabel>
          <div className="flex justify-center"><ValueBox value={game.accuracy.white.toFixed(1)} tone="white" /></div>
          <span />
          <div className="flex justify-center"><ValueBox value={game.accuracy.black.toFixed(1)} tone="black" /></div>
        </div>
      )}

      {game.estimatedRating && (
        <div className={`${GRID} py-2`}>
          <RowLabel>Game Rating</RowLabel>
          <div className="flex justify-center"><ValueBox value={game.estimatedRating.white} tone="white" /></div>
          <span />
          <div className="flex justify-center"><ValueBox value={game.estimatedRating.black} tone="black" /></div>
        </div>
      )}

      <div className="mt-3 border-t border-white/[0.06] pt-1.5">
        {ORDER.map((cls) => {
          const meta = CLASSIFICATION_META[cls];
          const c = counts[cls];
          return (
            <div key={cls} className={`${GRID} h-[44px]`} data-testid={`row-${cls}`}>
              <RowLabel>{meta.name}</RowLabel>
              <span className="text-center text-[17px] font-bold tabular-nums" style={{ color: c.w > 0 ? meta.color : 'rgba(255,255,255,0.28)' }}>{c.w}</span>
              <span className="flex justify-center"><ClassificationBadge classification={cls} size="lg" showLabel={false} /></span>
              <span className="text-center text-[17px] font-bold tabular-nums" style={{ color: c.b > 0 ? meta.color : 'rgba(255,255,255,0.28)' }}>{c.b}</span>
            </div>
          );
        })}
      </div>

      {phases.length > 0 && (
        <div className="mt-2 border-t border-white/[0.06] pt-1.5">
          {phases.map(([label, grade]) => (
            <div key={label} className={`${GRID} h-[44px]`}>
              <RowLabel>{label}</RowLabel>
              <span className="flex justify-center">
                {userIsWhite && <GradeChip grade={grade} />}
              </span>
              <span />
              <span className="flex justify-center">
                {!userIsWhite && <GradeChip grade={grade} />}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const GradeChip: React.FC<{ grade: string }> = ({ grade }) => (
  <span
    className="w-8 h-8 rounded-full flex items-center justify-center text-[15px] font-extrabold text-[#262522]"
    style={{ background: gradeTone(grade) }}
  >
    {grade === 'N/A' ? '–' : grade}
  </span>
);

export default ReviewTable;
