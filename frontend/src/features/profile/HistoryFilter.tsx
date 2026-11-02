import React from 'react';
import { Link } from 'react-router-dom';
import { HISTORY_TABS, HistoryTab } from '@/lib/gameHistory';

interface Props {
  value: HistoryTab;
  onChange: (t: HistoryTab) => void;
  counts: Record<HistoryTab, number>;
}

/** Game History sections: everything, only Chess.com, only Lichess, only games played here on ALL-CHESS. */
export const HistoryFilter: React.FC<Props> = ({ value, onChange, counts }) => (
  <div className="px-4 sm:px-5 pb-3 overflow-x-auto no-scrollbar" data-testid="history-filter">
    <div role="tablist" aria-label="Game history sections" className="flex gap-2 w-max min-w-full">
      {HISTORY_TABS.map((t) => {
        const on = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={on}
            data-testid={`history-tab-${t.value}`}
            onClick={() => onChange(t.value)}
            className={`h-9 px-3.5 rounded-full text-[13px] font-display font-bold whitespace-nowrap flex items-center gap-1.5 transition-colors border ${
              on ? 'bg-theme-text text-theme-bg border-theme-text' : 'bg-theme-raised text-theme-muted border-theme-border hover:text-theme-text'
            }`}
          >
            {t.label}
            <span className={`tabular-nums text-[12px] ${on ? 'opacity-70' : 'opacity-60'}`}>{counts[t.value]}</span>
          </button>
        );
      })}
    </div>
  </div>
);

interface EmptyProps {
  tab: HistoryTab;
  chesscomLinked: boolean;
  lichessLinked: boolean;
}

/** What to show when a section has no games, with the next step. */
export const HistoryEmpty: React.FC<EmptyProps> = ({ tab, chesscomLinked, lichessLinked }) => {
  const link = 'font-semibold text-theme-text underline underline-offset-2';
  let body: React.ReactNode;
  if (tab === 'chesscom') {
    body = chesscomLinked ? (
      <>No Chess.com games yet. Open <Link to="/settings" className={link}>Settings → Linked Accounts</Link> and tap Sync Games Now.</>
    ) : (
      <>No Chess.com account linked. Link one in <Link to="/settings" className={link}>Settings → Linked Accounts</Link> to see its games here.</>
    );
  } else if (tab === 'lichess') {
    body = lichessLinked ? (
      <>No Lichess games yet. Open <Link to="/settings" className={link}>Settings → Linked Accounts</Link> and tap Sync Games Now.</>
    ) : (
      <>No Lichess account linked. Link one in <Link to="/settings" className={link}>Settings → Linked Accounts</Link> to see its games here.</>
    );
  } else if (tab === 'allchess') {
    body = (
      <>Games you play on ALL-CHESS show up here. <Link to="/play" className={link}>Play the coach</Link> to start one.</>
    );
  } else {
    body = <>No games yet.</>;
  }
  return (
    <p className="px-5 pb-6 pt-1 text-[14px] text-theme-muted" data-testid="history-empty">
      {body}
    </p>
  );
};
