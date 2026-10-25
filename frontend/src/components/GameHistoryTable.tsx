import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Game } from '@/data/types';
import { PlayerAvatar } from './Bits';
import { Zap, Timer, Clock, Sun, GraduationCap, ChevronRight } from 'lucide-react';

const SPEED_ICON: Record<string, React.ReactNode> = {
  bullet: <Zap size={18} className="text-amber-400" />,
  blitz: <Timer size={18} className="text-yellow-300" />,
  rapid: <Clock size={18} className="text-emerald-400" />,
  daily: <Sun size={18} className="text-orange-300" />,
};

const accTone = (v?: number) => (v === undefined ? 'text-theme-muted' : v >= 85 ? 'text-[var(--class-best)]' : v >= 70 ? 'text-theme-text' : 'text-[var(--class-mistake)]');

/**
 * Game history in the reference's table style: speed icon, both players (you highlighted),
 * result square, accuracy, moves, date and a Review button. Whole row is clickable.
 */
export const GameHistoryTable: React.FC<{ games: Game[]; compact?: boolean; analyzingId?: string }> = ({ games, compact, analyzingId }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full overflow-x-auto" data-testid="game-history">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead>
          <tr className="text-[12px] font-display font-black uppercase tracking-wide text-theme-muted">
            <th className="py-2 pl-3 pr-1 w-8" />
            <th className="py-2 px-2">Players</th>
            <th className="py-2 px-2 text-center">Result</th>
            {!compact && <th className="py-2 px-2 text-center hidden md:table-cell">Accuracy</th>}
            <th className="py-2 px-2 text-center hidden sm:table-cell">Moves</th>
            <th className="py-2 px-2 text-right hidden sm:table-cell">Date</th>
            <th className="py-2 pr-3 pl-2" />
          </tr>
        </thead>
        <tbody>
          {games.map((g) => {
            const youWhite = g.white.username === 'You';
            const won = (youWhite && g.result === '1-0') || (!youWhite && g.result === '0-1');
            const lost = (youWhite && g.result === '0-1') || (!youWhite && g.result === '1-0');
            const mark = won
              ? { c: '#5fb34a', lip: '#3a7a2c', t: 'W', label: 'Win' }
              : lost
                ? { c: '#e05a4f', lip: '#9c3129', t: 'L', label: 'Loss' }
                : { c: '#8f8b85', lip: '#5e5a55', t: 'D', label: 'Draw' };
            const moves = Math.ceil(g.moves.length / 2);
            const date = new Date(g.date);
            return (
              <tr
                key={g.id}
                onClick={() => navigate(`/review/${g.id}`)}
                className="group cursor-pointer [&>td]:border-t-2 [&>td]:border-theme-border hover:bg-black/[0.03] dark:hover:bg-white/[0.035] transition-colors"
                data-testid={`game-row-${g.id}`}
              >
                <td className="py-2.5 pl-3 pr-1" title={g.source === 'vs_coach' ? 'Coach game' : g.speed}>
                  <span className="w-8 h-8 rounded-full well flex items-center justify-center">
                    {g.source === 'vs_coach' ? <GraduationCap size={17} className="text-sky-400" /> : SPEED_ICON[g.speed]}
                  </span>
                </td>
                <td className="py-2.5 px-2 min-w-[180px]">
                  {[g.white, g.black].map((p, i) => (
                    <div key={i} className="flex items-center gap-2 leading-6">
                      <span className={`w-3 h-3 rounded-[3px] border ${i === 0 ? 'bg-white border-neutral-300' : 'bg-neutral-800 border-neutral-600'}`} />
                      <PlayerAvatar name={p.username} size={20} />
                      <span className={`text-[14px] truncate font-display ${p.username === 'You' ? 'font-black text-theme-text' : 'font-bold text-theme-text/85'}`}>{p.username}</span>
                      <span className="text-[13px] text-theme-muted tabular-nums">({p.rating})</span>
                    </div>
                  ))}
                </td>
                <td className="py-2.5 px-2">
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex flex-col text-[13px] font-bold tabular-nums text-theme-muted leading-6 text-right">
                      <span>{g.result === '1/2-1/2' ? '½' : g.result.split('-')[0]}</span>
                      <span>{g.result === '1/2-1/2' ? '½' : g.result.split('-')[1]}</span>
                    </div>
                    <span
                      className="w-7 h-7 rounded-[9px] text-white text-[14px] font-display font-black flex items-center justify-center"
                      style={{ background: `linear-gradient(180deg, color-mix(in srgb, ${mark.c} 80%, white), ${mark.c})`, boxShadow: `inset 0 2px 0 rgba(255,255,255,.3), 0 3px 0 ${mark.lip}` }}
                      title={mark.label}
                      aria-label={mark.label}
                    >
                      {mark.t}
                    </span>
                  </div>
                </td>
                {!compact && (
                  <td className="py-2.5 px-2 text-center hidden md:table-cell">
                    {analyzingId === g.id ? (
                      <span className="text-[12px] font-bold text-amber-400 animate-pulse">Analysing…</span>
                    ) : (
                      <div className="flex flex-col text-[13px] font-bold tabular-nums leading-6">
                        <span className={accTone(g.accuracy?.white)}>{g.accuracy?.white ?? '–'}</span>
                        <span className={accTone(g.accuracy?.black)}>{g.accuracy?.black ?? '–'}</span>
                      </div>
                    )}
                  </td>
                )}
                <td className="py-2.5 px-2 text-center text-[14px] font-semibold tabular-nums text-theme-text/85 hidden sm:table-cell">{moves}</td>
                <td className="py-2.5 px-2 text-right text-[13px] text-theme-muted tabular-nums whitespace-nowrap hidden sm:table-cell">
                  {isNaN(date.getTime()) ? g.date : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="py-2.5 pr-3 pl-2 text-right">
                  <span className="inline-flex items-center gap-1 h-9 px-3.5 rounded-[11px] btn-secondary text-[13px] font-display font-black group-hover:brightness-110 group-active:translate-y-[3px]">
                    Review <ChevronRight size={15} />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default GameHistoryTable;
