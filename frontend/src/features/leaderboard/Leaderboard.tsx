import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/Card';
import { PageContainer } from '@/components/PageHeader';
import { Segmented } from '@/components/Segmented';
import { PlayerAvatar, Pill } from '@/components/Bits';
import { ModeIcon } from '@/components/ModeIcon';
import { DistributionCurve, RankNumber } from '@/components/Charts';
import { friendRepository, gameRepository, statsRepository } from '@/data/repositories';
import { Friend, Game } from '@/data/types';
import { rankFor } from '@/lib/rank';

type Speed = 'rapid' | 'blitz' | 'bullet';
type Scope = 'friends' | 'opponents';

interface Row {
  name: string;
  rating: number;
  won: number;
  draw: number;
  lost: number;
  you?: boolean;
  friend?: boolean;
  bot?: boolean;
  online?: boolean;
}

/** Deterministic pseudo-record for friends (their full history isn't synced yet). */
const seeded = (s: string, n: number) => Math.abs([...s].reduce((h, c) => (h * 33 + c.charCodeAt(0)) | 0, n)) % 100;

export const Leaderboard: React.FC = () => {
  const [speed, setSpeed] = useState<Speed>('rapid');
  const [scope, setScope] = useState<Scope>('friends');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [mine, setMine] = useState<{ mode: string; rating: number }[]>([]);

  useEffect(() => {
    Promise.all([friendRepository.getFriends(), gameRepository.getGames(), statsRepository.getUserRatings()]).then(([f, g, r]) => {
      setFriends(f);
      setGames(g);
      setMine(r);
    });
  }, []);

  const myRating = mine.find((r) => r.mode.toLowerCase() === speed)?.rating ?? 0;
  const myGames = games.filter((g) => g.speed === speed);
  const myRecord = myGames.reduce(
    (t, g) => {
      const w = g.white.username === 'You';
      if (g.result === '1/2-1/2') t.d++;
      else if ((w && g.result === '1-0') || (!w && g.result === '0-1')) t.w++;
      else t.l++;
      return t;
    },
    { w: 0, d: 0, l: 0 },
  );

  const rows = useMemo<Row[]>(() => {
    const you: Row = { name: 'You', rating: myRating, won: myRecord.w, draw: myRecord.d, lost: myRecord.l, you: true, online: true };
    if (scope === 'friends') {
      const fr = friends.map<Row>((f) => {
        const total = 40 + seeded(f.username, 7);
        const won = Math.round(total * (0.42 + seeded(f.username, 3) / 500));
        const draw = Math.round(total * 0.08);
        return { name: f.username, rating: f.rating + (speed === 'blitz' ? -30 : speed === 'bullet' ? -55 : 0), won, draw, lost: total - won - draw, friend: true, online: f.online };
      });
      return [...fr, you].sort((a, b) => b.rating - a.rating);
    }
    // opponents: everyone you've played, with their record against you
    const map = new Map<string, Row>();
    for (const g of games) {
      const youWhite = g.white.username === 'You';
      const opp = youWhite ? g.black : g.white;
      const r = map.get(opp.username) || { name: opp.username, rating: opp.rating, won: 0, draw: 0, lost: 0, bot: g.source === 'vs_coach' };
      const youWon = (youWhite && g.result === '1-0') || (!youWhite && g.result === '0-1');
      if (g.result === '1/2-1/2') r.draw++;
      else if (youWon) r.lost++;
      else r.won++;
      r.rating = Math.max(r.rating, opp.rating);
      map.set(opp.username, r);
    }
    return [...map.values(), you].sort((a, b) => b.rating - a.rating);
  }, [scope, friends, games, myRating, myRecord.w, myRecord.d, myRecord.l, speed]);

  const yourRank = rows.findIndex((r) => r.you) + 1;
  const avg = rows.length ? Math.round(rows.reduce((s, r) => s + r.rating, 0) / rows.length) : 0;
  const tier = rankFor(myRating).tier;

  return (
    <PageContainer wide className="!max-w-[1200px]">
      <div className="flex items-center gap-3 pt-1">
        <img src="/assets/ui/icon_leaderboard.webp" alt="" className="w-11 h-11 object-contain" />
        <h1 className="text-[30px] font-display font-bold text-theme-text">Leaderboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_330px] gap-5 items-start">
        <div className="space-y-4 min-w-0">
          <Card className="!p-0 flex flex-wrap items-center gap-3 px-3 py-3">
            <Segmented<Speed>
              size="sm"
              value={speed}
              onChange={setSpeed}
              options={[
                { value: 'rapid', label: 'Rapid', icon: <ModeIcon mode="rapid" size={16} /> },
                { value: 'blitz', label: 'Blitz', icon: <ModeIcon mode="blitz" size={16} /> },
                { value: 'bullet', label: 'Bullet', icon: <ModeIcon mode="bullet" size={16} /> },
              ]}
            />
            <Segmented<Scope>
              size="sm"
              value={scope}
              onChange={setScope}
              options={[
                { value: 'friends', label: 'Friends' },
                { value: 'opponents', label: 'People you played' },
              ]}
            />
          </Card>

          <Card className="!p-0 overflow-hidden" data-testid="leaderboard-table">
            <div className="grid grid-cols-[64px_1fr_76px_64px_60px_60px] items-center px-3 py-2.5 text-[14px] font-semibold text-theme-muted" style={{ background: 'rgba(0,0,0,.12)' }}>
              <span />
              <span>Player</span>
              <span className="text-right">Rating</span>
              <span className="text-right">Won</span>
              <span className="text-right">Draw</span>
              <span className="text-right pr-1">Lost</span>
            </div>
            {rows.map((r, i) => (
              <div
                key={r.name}
                className={`row-stripe grid grid-cols-[64px_1fr_76px_64px_60px_60px] items-center px-3 h-[64px] ${r.you ? '!bg-[var(--color-win)]/[0.08]' : ''}`}
                data-testid={r.you ? 'leaderboard-you' : undefined}
              >
                <span className="flex justify-center">
                  <RankNumber rank={i + 1} size={30} />
                </span>
                <span className="flex items-center gap-3 min-w-0">
                  <span className="relative flex-shrink-0">
                    <PlayerAvatar name={r.name} size={44} square />
                    {r.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[var(--color-win)] border-2 border-[var(--color-card)]" />}
                  </span>
                  <span className="text-[15px] font-semibold text-theme-text truncate">{r.you ? 'You' : r.name}</span>
                  {r.bot && <Pill tone="neutral">Bot</Pill>}
                  {r.friend && <Pill tone="green">Friend</Pill>}
                </span>
                <span className="text-right text-[15px] font-semibold text-theme-text tabular-nums">{r.rating}</span>
                <span className="text-right text-[15px] font-semibold tabular-nums" style={{ color: 'var(--color-win)' }}>
                  {r.won}
                </span>
                <span className="text-right text-[15px] font-semibold tabular-nums text-theme-text">{r.draw}</span>
                <span className="text-right text-[15px] font-semibold tabular-nums pr-1" style={{ color: 'var(--color-loss)' }}>
                  {r.lost}
                </span>
              </div>
            ))}
            {scope === 'opponents' && <div className="px-4 py-3 text-[13px] text-theme-muted border-t border-theme-border">Won / Draw / Lost are their results against you.</div>}
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="!p-5 flex flex-col items-center text-center gap-2">
            <div className="w-[96px] h-[96px] rounded-[4px] overflow-hidden bg-gradient-to-b from-[#4a4642] to-[#2d2a27] flex items-end justify-center">
              <img src="/assets/coach/coach_wave_full.webp" alt="" className="h-[90px] object-contain object-bottom" />
            </div>
            <div className="flex items-center gap-1.5 text-[16px] font-semibold text-theme-text">
              Master <img src={tier.icon} alt={`${tier.name} rank`} className="w-6 h-6 object-contain" />
            </div>
            <div className="w-full rounded-[4px] bg-black/[0.06] dark:bg-black/25 px-1 pt-2 text-theme-text">
              <DistributionCurve rating={myRating || 800} />
            </div>
            <div className="w-full divide-y divide-theme-border text-[14px]">
              <div className="flex justify-between py-2.5">
                <span className="text-theme-muted">Rating</span>
                <span className="font-semibold text-theme-text tabular-nums">{myRating}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-theme-muted">Record</span>
                <span className="font-semibold text-theme-text tabular-nums">
                  {myRecord.w} / {myRecord.d} / {myRecord.l}
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-theme-muted">Your place</span>
                <span className="font-semibold text-theme-text tabular-nums">
                  #{yourRank} of {rows.length}
                </span>
              </div>
            </div>
          </Card>
          <Card className="!p-0 overflow-hidden">
            <div className="px-4 py-3 text-[16px] font-display font-bold text-theme-text border-b border-theme-border capitalize">{scope === 'friends' ? 'Friends' : 'Opponents'} · {speed}</div>
            <div className="divide-y divide-theme-border text-[14px]">
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-theme-muted">Players</span>
                <span className="font-semibold text-theme-text tabular-nums">{rows.length}</span>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-theme-muted">Avg rating</span>
                <span className="font-semibold text-theme-text tabular-nums">{avg}</span>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-theme-muted">Online now</span>
                <span className="font-semibold text-theme-text tabular-nums">{rows.filter((r) => r.online).length}</span>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </PageContainer>
  );
};

export default Leaderboard;
