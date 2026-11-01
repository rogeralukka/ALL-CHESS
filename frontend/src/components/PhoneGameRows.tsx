import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ModeIcon, GameMode } from '@/components/ModeIcon';
import { Game } from '@/data/types';

export const youAreWhite = (g: Game) => g.isUserWhite ?? g.white.username === 'You';

export const outcome = (g: Game): 'win' | 'loss' | 'draw' => {
  const w = youAreWhite(g);
  if ((w && g.result === '1-0') || (!w && g.result === '0-1')) return 'win';
  if ((w && g.result === '0-1') || (!w && g.result === '1-0')) return 'loss';
  return 'draw';
};

export const ago = (iso: string) => {
  const d = (Date.now() - new Date(iso).getTime()) / 86_400_000;
  if (!isFinite(d)) return '';
  if (d < 1) return 'Today';
  if (d < 2) return 'Yesterday';
  if (d < 30) return `${Math.floor(d)} days ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

/**
 * Phone game list in the style of the Chess.com app's "Completed Games": result square, opponent and rating,
 * mode and date, your accuracy. The whole row opens the review.
 */
export const PhoneGameRows: React.FC<{ games: Game[]; className?: string; empty?: string }> = ({ games, className = '', empty }) => {
  const navigate = useNavigate();
  return (
    <div className={`rounded-xl overflow-hidden ${className}`} style={{ background: 'var(--color-card)' }} data-testid="game-history">
      {games.length === 0 ? (
        <div className="py-6 px-4 text-center text-[14px] text-theme-muted">{empty || 'No games yet. Sync from Chess.com or play the coach.'}</div>
      ) : (
        games.map((g, i) => {
          const o = outcome(g);
          const w = youAreWhite(g);
          const opp = w ? g.black : g.white;
          const acc = g.accuracy ? (w ? g.accuracy.white : g.accuracy.black) : undefined;
          const mode: GameMode = g.source === 'vs_coach' ? 'coach' : (g.speed as GameMode);
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => navigate(`/review/${g.id}`)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left active:bg-white/5 ${i ? 'border-t border-white/[0.06]' : ''}`}
              data-testid="game-row"
            >
              <span
                className={`w-7 h-7 rounded-md flex items-center justify-center font-black text-[16px] text-white flex-shrink-0 ${
                  o === 'win' ? 'bg-[#81b64c]' : o === 'loss' ? 'bg-[#e0473b]' : 'bg-neutral-500'
                }`}
                aria-label={o}
              >
                {o === 'win' ? '+' : o === 'loss' ? '−' : '='}
              </span>
              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-1.5 text-[15px] font-bold text-theme-text min-w-0">
                  <span className="truncate">{opp.username}</span>
                  {opp.rating ? <span className="font-semibold text-theme-muted flex-shrink-0">({opp.rating})</span> : null}
                </span>
                <span className="flex items-center gap-1.5 text-[12px] text-theme-muted min-w-0">
                  <ModeIcon mode={mode} size={14} />
                  <span className="capitalize">{g.source === 'vs_coach' ? 'Coach' : g.speed}</span>
                  <span>·</span>
                  <span className="truncate">{ago(g.date)}</span>
                </span>
              </span>
              {typeof acc === 'number' && <span className="px-2 py-0.5 rounded-md text-[13px] font-black tabular-nums bg-white/90 text-black">{acc.toFixed(1)}</span>}
              <ChevronRight size={18} className="text-theme-muted flex-shrink-0" />
            </button>
          );
        })
      )}
    </div>
  );
};

export default PhoneGameRows;
