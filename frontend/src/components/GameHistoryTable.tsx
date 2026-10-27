import { MiniHopper } from '@/components/LoadingScreen';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Game } from '@/data/types';
import { PlayerAvatar } from './Bits';
import { useCurrentUser } from '@/lib/useCurrentUser';
import { ModeIcon, GameMode } from './ModeIcon';

const accTone = (v?: number) => (v === undefined ? 'text-theme-muted' : v >= 85 ? 'text-[var(--color-win)]' : v >= 70 ? 'text-theme-text' : 'text-[#e6912c]');

/** Small coloured square with +, − or = (the result marker next to the score). */
const ResultMark: React.FC<{ kind: 'win' | 'loss' | 'draw' }> = ({ kind }) => {
  const bg = kind === 'win' ? 'var(--color-win)' : kind === 'loss' ? 'var(--color-loss)' : 'var(--color-draw)';
  return (
    <span className="inline-flex w-[14px] h-[14px] rounded-[3px] items-center justify-center" style={{ background: bg }} title={kind === 'win' ? 'Won' : kind === 'loss' ? 'Lost' : 'Draw'} aria-label={kind}>
      <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
        {kind === 'draw' ? (
          <path d="M1 2.6 H7 M1 5.4 H7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        ) : (
          <>
            <path d="M1 4 H7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
            {kind === 'win' && <path d="M4 1 V7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />}
          </>
        )}
      </svg>
    </span>
  );
};

/**
 * Game history in the reference's table layout: speed icon with its time control, both players
 * (square avatar, colour chip, name, rating), stacked score with a result square, accuracy,
 * moves, date and a Review button. The whole row opens the review.
 */
export const GameHistoryTable: React.FC<{ games: Game[]; compact?: boolean; analyzingId?: string }> = ({ games, compact, analyzingId }) => {
  const me = useCurrentUser();
  const navigate = useNavigate();
  return (
    <div className="w-full overflow-x-auto" data-testid="game-history">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead>
          <tr className="text-[12px] font-semibold text-theme-muted" style={{ background: 'rgba(0,0,0,.12)' }}>
            <th className="py-2.5 pl-4 pr-1 w-[72px]" />
            <th className="py-2.5 px-2 font-semibold">Players</th>
            <th className="py-2.5 px-2 text-center font-semibold">Result</th>
            {!compact && <th className="py-2.5 px-2 text-center font-semibold hidden md:table-cell">Accuracy</th>}
            <th className="py-2.5 px-2 text-center font-semibold hidden sm:table-cell">Moves</th>
            <th className="py-2.5 px-2 text-center font-semibold hidden sm:table-cell">Date</th>
            <th className="py-2.5 pr-4 pl-2" />
          </tr>
        </thead>
        <tbody>
          {games.length === 0 ? (
            <tr>
              <td colSpan={compact ? 5 : 7} className="py-8 text-center text-[14px] text-theme-muted font-medium">
                No games found.
              </td>
            </tr>
          ) : (
            games.map((g) => {
              const youWhite = g.white.username === 'You';
              const won = (youWhite && g.result === '1-0') || (!youWhite && g.result === '0-1');
              const lost = (youWhite && g.result === '0-1') || (!youWhite && g.result === '1-0');
              const kind = won ? 'win' : lost ? 'loss' : 'draw';
              const moves = Math.ceil(g.moves.length / 2);
              const date = new Date(g.date);
              const mode: GameMode = g.source === 'vs_coach' ? 'coach' : (g.speed as GameMode);
              const [ws, bs] = g.result === '1/2-1/2' ? ['½', '½'] : g.result.split('-');
              return (
                <tr
                  key={g.id}
                  onClick={() => navigate(`/review/${g.id}`)}
                  className="row-stripe group cursor-pointer hover:!bg-white/[0.05] transition-colors"
                  data-testid={`game-row-${g.id}`}
                >
                  <td className="py-3 pl-4 pr-1 text-center align-middle">
                    <div className="flex flex-col items-center gap-0.5">
                      <ModeIcon mode={mode} size={22} title={g.source === 'vs_coach' ? 'Coach game' : g.speed} />
                      <span className="text-[12px] text-theme-muted whitespace-nowrap">{g.source === 'vs_coach' ? 'Coach' : g.timeControl}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 min-w-[200px]">
                    {[g.white, g.black].map((p, i) => (
                      <div key={i} className="flex items-center gap-2 leading-6">
                        <span className="rounded-[3px] overflow-hidden flex-shrink-0">
                          <PlayerAvatar name={p.username} size={20} square />
                        </span>
                        <span className={`w-[10px] h-[10px] rounded-[2px] flex-shrink-0 ${i === 0 ? 'bg-white' : 'bg-[#5a5754] border border-white/20'}`} />
                        <span className="text-[14px] font-semibold text-theme-text truncate">{me.label(p.username)}</span>
                        <span className="text-[14px] text-theme-muted tabular-nums">({p.rating > 0 ? p.rating : '–'})</span>
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex flex-col text-[14px] font-semibold tabular-nums text-theme-text leading-6 text-center w-3">
                        <span>{ws}</span>
                        <span>{bs}</span>
                      </div>
                      <ResultMark kind={kind} />
                    </div>
                  </td>
                  {!compact && (
                    <td className="py-3 px-2 text-center hidden md:table-cell">
                      {analyzingId === g.id ? (
                        <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-theme-muted"><MiniHopper size={26} />Analysing…</span>
                      ) : (
                        <div className="flex flex-col text-[14px] font-semibold tabular-nums leading-6">
                          <span className={accTone(g.accuracy?.white)}>{g.accuracy?.white ?? '–'}</span>
                          <span className={accTone(g.accuracy?.black)}>{g.accuracy?.black ?? '–'}</span>
                        </div>
                      )}
                    </td>
                  )}
                  <td className="py-3 px-2 text-center text-[14px] font-semibold tabular-nums text-theme-text hidden sm:table-cell">{moves}</td>
                  <td className="py-3 px-2 text-center text-[14px] text-theme-text tabular-nums whitespace-nowrap hidden sm:table-cell">
                    {isNaN(date.getTime()) ? g.date : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-3 pr-4 pl-2 text-right">
                    <span className="btn-secondary inline-flex items-center h-8 px-4 rounded-[3px] text-[14px] font-semibold text-theme-text">Review</span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GameHistoryTable;
