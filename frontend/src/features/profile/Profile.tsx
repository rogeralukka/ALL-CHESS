import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ChevronRight, Pencil } from 'lucide-react';
import { Card } from '@/components/Card';
import { Segmented } from '@/components/Segmented';
import { PageContainer } from '@/components/PageHeader';
import { GameHistoryTable } from '@/components/GameHistoryTable';
import { ModeIcon, GameMode } from '@/components/ModeIcon';
import { Sparkline } from '@/components/Charts';
import { Meter } from '@/components/Bits';
import { StatsSections } from './StatsSections';
import { gameRepository, statsRepository, friendRepository } from '@/data/repositories';
import { Friend, Game, RatingPoint } from '@/data/types';
import { rankFor } from '@/lib/rank';
import { useMotion } from '@/lib/useMotion';

type Tab = 'overview' | 'games' | 'stats';
type Speed = 'rapid' | 'blitz' | 'bullet';

/** Underlined text tabs, as on the reference profile. */
const Tabs: React.FC<{ value: Tab; onChange: (t: Tab) => void }> = ({ value, onChange }) => {
  const { isOff } = useMotion();
  const items: [Tab, string][] = [
    ['overview', 'Overview'],
    ['games', 'Games'],
    ['stats', 'Stats'],
  ];
  return (
    <div className="flex gap-1 px-3 border-t border-theme-border" role="tablist">
      {items.map(([k, label]) => (
        <button
          key={k}
          role="tab"
          aria-selected={value === k}
          onClick={() => onChange(k)}
          className={`relative px-3 h-12 text-[15px] font-semibold transition-colors ${value === k ? 'text-theme-text' : 'text-theme-muted hover:text-theme-text'}`}
        >
          {label}
          {value === k && <motion.span layoutId={isOff ? undefined : 'profile-tab'} className="absolute left-2 right-2 bottom-0 h-[3px] rounded-full bg-[var(--color-win)]" />}
        </button>
      ))}
    </div>
  );
};

/** Stat tile: mode icon, label, big rating, weekly change and a sparkline (reference layout). */
const RatingTile: React.FC<{ mode: GameMode; label: string; rating: number; delta?: number; trend: number[]; onClick?: () => void }> = ({ mode, label, rating, delta, trend, onClick }) => (
  <button type="button" onClick={onClick} className="panel panel-hover text-left p-3 flex flex-col gap-2 min-w-0" data-testid={`rating-tile-${mode}`}>
    <div className="flex items-start gap-2.5 w-full">
      <ModeIcon mode={mode} size={36} />
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-semibold text-theme-muted leading-4">{label}</div>
        <div className="text-[22px] font-bold font-display text-theme-text leading-6 tabular-nums">
          {rating > 0 ? rating : '–'}
        </div>
      </div>
      {delta !== undefined && delta !== 0 && (
        <span className={`text-[13px] font-semibold tabular-nums ${delta > 0 ? 'text-[var(--color-win)]' : 'text-[var(--color-loss)]'}`}>
          {delta > 0 ? '↑' : '↓'}
          {Math.abs(delta)}
        </span>
      )}
    </div>
    <div className="w-full rounded-[3px] overflow-hidden bg-black/[0.06] dark:bg-black/20">
      <Sparkline values={trend} height={40} />
    </div>
  </button>
);

export const Profile: React.FC = () => {
  const [tab, setTab] = useState<Tab>('overview');
  const [speed, setSpeed] = useState<Speed>('rapid');
  const [range, setRange] = useState<'30d' | '90d' | 'all'>('all');
  const [color] = useState<'all' | 'white' | 'black'>('all');
  const [history, setHistory] = useState<RatingPoint[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [ratings, setRatings] = useState<{ mode: string; rating: number; deltaWeekly: number }[]>([]);

  useEffect(() => {
    let alive = true;

    const loadData = () => {
      Promise.all([
        statsRepository.getRatingHistory(range),
        gameRepository.getGames(),
        friendRepository.getFriends(),
        statsRepository.getUserRatings()
      ]).then(([h, g, f, r]) => {
        if (!alive) return;
        setHistory(h);
        setGames(g);
        setFriends(f);
        setRatings(r);
      });
    };

    loadData();

    const onRefresh = () => loadData();
    window.addEventListener('chess-data-refresh', onRefresh);
    return () => {
      alive = false;
      window.removeEventListener('chess-data-refresh', onRefresh);
    };
  }, [range]);

  const ratingOf = (m: string) => ratings.find((r) => r.mode.toLowerCase() === m)?.rating ?? 0;
  const deltaOf = (m: string) => ratings.find((r) => r.mode.toLowerCase() === m)?.deltaWeekly;
  const trendOf = (m: Speed) => (history.length ? history.map((p) => p[m]) : [0, 0]);

  const allSpeeds: { value: Speed; label: string }[] = [
    { value: 'rapid', label: 'Rapid' },
    { value: 'blitz', label: 'Blitz' },
    { value: 'bullet', label: 'Bullet' },
  ];

  const availableSpeeds = allSpeeds.filter((s) => {
    const currentRating = ratingOf(s.value);
    const hasHistory = history.some((p) => p[s.value] && p[s.value] > 0);
    return currentRating > 0 || hasHistory;
  });

  useEffect(() => {
    if (availableSpeeds.length > 0 && !availableSpeeds.some((s) => s.value === speed)) {
      setSpeed(availableSpeeds[0].value);
    }
  }, [availableSpeeds, speed]);

  const chartData = history
    .filter((p) => p[speed] > 0)
    .map((p) => ({ date: p.date.slice(5), fullDate: p.date, rating: p[speed] + (color === 'white' ? 15 : color === 'black' ? -15 : 0) }));
  const current = chartData.length ? chartData[chartData.length - 1].rating : ratingOf(speed);
  const highest = chartData.length ? Math.max(...chartData.map((d) => d.rating)) : (current > 0 ? current : 0);
  const rank = rankFor(ratingOf('rapid') || (current > 0 ? current : 800));
  const ladder = [...friends.map((f) => ({ name: f.username, rating: f.rating })), { name: 'You', rating: ratingOf('rapid') }].sort((a, b) => b.rating - a.rating);
  const friendsRank = ladder.findIndex((p) => p.name === 'You') + 1;

  const speedGames = games.filter((g) => g.speed === speed && (color === 'all' || (color === 'white' ? g.white.username === 'You' : g.black.username === 'You')));
  const tally = speedGames.reduce(
    (t, g) => {
      const w = g.white.username === 'You';
      if (g.result === '1/2-1/2') t.d++;
      else if ((w && g.result === '1-0') || (!w && g.result === '0-1')) t.w++;
      else t.l++;
      return t;
    },
    { w: 0, d: 0, l: 0 },
  );
  const total = tally.w + tally.d + tally.l;
  const openStats = (s: Speed) => {
    setSpeed(s);
    setTab('stats');
  };

  return (
    <PageContainer wide className="!max-w-[1200px]">
      {/* ---------------- header card */}
      <section className="panel overflow-hidden" data-testid="profile-hero">
        <div className="p-5 flex flex-col sm:flex-row gap-5">
          <div className="w-[136px] h-[136px] rounded-[4px] overflow-hidden flex-shrink-0 bg-gradient-to-b from-[#4a4642] to-[#2d2a27] flex items-end justify-center">
            <img src="/assets/coach/coach_wave_full.webp" alt="Your avatar" className="h-[128px] object-contain object-bottom" />
          </div>
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-start gap-3">
              <h1 className="text-[24px] font-display font-bold text-theme-text leading-8">Master</h1>
              <img src={rank.tier.icon} alt={`${rank.tier.name} rank`} title={`${rank.tier.name} rank`} className="w-8 h-8 object-contain" />
              <Link to="/settings" className="btn-secondary ml-auto inline-flex items-center gap-1.5 h-8 px-3.5 rounded-[3px] text-[14px] font-semibold text-theme-text">
                <Pencil size={14} /> Edit Profile
              </Link>
            </div>
            <div className="text-[14px] text-theme-muted mt-1">Training to reach {rank.next ? rank.next.name : 'King'} rank</div>
            <div className="mt-auto pt-4 flex flex-wrap gap-x-5 gap-y-1 text-[14px] text-theme-muted">
              <span>
                <b className="text-theme-text font-semibold">Oct 2026</b> Joined
              </span>
              <span>
                <b className="text-theme-text font-semibold">{friends.length}</b> Friends
              </span>
              <span>
                <b className="text-theme-text font-semibold">{games.length}</b> Games
              </span>
              <span className="text-theme-text font-semibold">Online now</span>
            </div>
          </div>
        </div>
        <Tabs value={tab} onChange={setTab} />
      </section>

      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">
          <div className="space-y-5 min-w-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <RatingTile mode="rapid" label="Rapid" rating={ratingOf('rapid')} delta={deltaOf('rapid')} trend={trendOf('rapid')} onClick={() => openStats('rapid')} />
              <RatingTile mode="blitz" label="Blitz" rating={ratingOf('blitz')} delta={deltaOf('blitz')} trend={trendOf('blitz')} onClick={() => openStats('blitz')} />
              <RatingTile mode="bullet" label="Bullet" rating={ratingOf('bullet')} delta={deltaOf('bullet')} trend={trendOf('bullet')} onClick={() => openStats('bullet')} />
              <Link to="/puzzles" className="panel panel-hover p-3 flex flex-col gap-2 min-w-0">
                <div className="flex items-start gap-2.5">
                  <ModeIcon mode="puzzles" size={36} />
                  <div>
                    <div className="text-[12px] font-semibold text-theme-muted leading-4">Puzzles</div>
                    <div className="text-[22px] font-bold font-display text-theme-text leading-6 tabular-nums">1200</div>
                  </div>
                </div>
                <div className="rounded-[3px] overflow-hidden bg-black/[0.06] dark:bg-black/20">
                  <Sparkline values={[1120, 1150, 1140, 1170, 1185, 1200]} height={40} />
                </div>
              </Link>
            </div>

            <Card className="!p-0 overflow-hidden">
              <div className="px-5 py-3.5 flex items-center">
                <h2 className="text-[17px] font-display font-bold text-theme-text">
                  Game History <span className="text-theme-muted">({games.length})</span>
                </h2>
              </div>
              <GameHistoryTable games={games.slice(0, 5)} />
              <button type="button" onClick={() => setTab('games')} className="w-full h-11 flex items-center justify-center gap-1 text-[14px] font-semibold text-theme-muted hover:text-theme-text border-t border-theme-border">
                See More <ChevronRight size={15} />
              </button>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card className="!p-4 space-y-3">
              <div className="flex items-center gap-3">
                <img src={rank.tier.icon} alt="" className="w-12 h-12 object-contain" />
                <div>
                  <div className="text-[16px] font-display font-bold text-theme-text">{rank.tier.name} rank</div>
                  <div className="text-[13px] text-theme-muted">{rank.next ? `${rank.toNext} points to ${rank.next.name}` : 'Top rank'}</div>
                </div>
              </div>
              {rank.next && <Meter value={rank.progress} color={rank.tier.color} height={8} label={`Progress to ${rank.next.name}`} />}
              <div className="flex justify-between pt-1">
                <div className="text-[12px] text-theme-muted">
                  Win rate: <b className="text-theme-text font-bold">{games.length ? Math.round((tally.w / games.length) * 100) : 0}%</b>
                </div>
                <div className="text-[12px] text-theme-muted">
                  Friends: <b className="text-theme-text font-bold">#{friendsRank || '–'}</b>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      )}

      {tab === 'games' && (
        <Card className="!p-0 overflow-hidden">
          <div className="px-5 py-3.5">
            <h2 className="text-[17px] font-display font-bold text-theme-text">
              Game History <span className="text-theme-muted">({games.length})</span>
            </h2>
          </div>
          <GameHistoryTable games={games} />
        </Card>
      )}

      {tab === 'stats' && (
        <div className="space-y-5">
          <Card className="!p-0 overflow-hidden">
            <div className="flex flex-wrap items-center gap-3 p-3 border-b border-theme-border">
              <Segmented<Speed>
                size="sm"
                value={speed}
                onChange={setSpeed}
                options={availableSpeeds.length > 0 ? availableSpeeds : allSpeeds.slice(0, 1)}
              />
              <Segmented<'30d' | '90d' | 'all'>
                size="sm"
                value={range}
                onChange={setRange}
                options={[
                  { value: '30d', label: '30 days' },
                  { value: '90d', label: '90 days' },
                  { value: 'all', label: 'All time' },
                ]}
              />
            </div>
            <div className="p-5 space-y-5">
              <div className="flex items-center gap-3">
                <ModeIcon mode={speed} size={34} />
                <h2 className="text-[26px] font-display font-bold text-theme-text capitalize">{speed}</h2>
                <span className="ml-auto text-[26px] font-display font-bold text-theme-text tabular-nums" data-testid="rating-current">
                  {current > 0 ? current : '–'}
                </span>
              </div>
              <div className="h-56 w-full rounded-[4px] bg-black/[0.04] dark:bg-black/15" data-testid="rating-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 14, right: 14, left: -8, bottom: 0 }}>
                    <defs>
                      <linearGradient id="statFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-chart)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="var(--color-chart)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="date" stroke="currentColor" opacity={0.35} fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis domain={['auto', 'auto']} stroke="currentColor" opacity={0.35} fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload as { fullDate: string; rating: number };
                        return (
                          <div className="rounded-[4px] bg-[var(--color-card)] border border-theme-border p-2 text-xs shadow-lg">
                            <div className="text-theme-muted">{d.fullDate}</div>
                            <div className="font-bold font-display text-[14px] text-theme-text mt-0.5">{d.rating}</div>
                          </div>
                        );
                      }}
                    />
                    <Area type="monotone" dataKey="rating" stroke="var(--color-chart)" strokeWidth={2.4} fill="url(#statFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="panel p-3">
                  <div className="text-[12px] font-semibold text-theme-muted">Current</div>
                  <div className="text-[20px] font-bold font-display text-theme-text tabular-nums">{current > 0 ? current : '–'}</div>
                </div>
                <div className="panel p-3">
                  <div className="text-[12px] font-semibold text-theme-muted">Highest</div>
                  <div className="text-[20px] font-bold font-display text-theme-text tabular-nums">{highest > 0 ? highest : '–'}</div>
                </div>
                <div className="panel p-3">
                  <div className="text-[12px] font-semibold text-theme-muted">Win rate</div>
                  <div className="text-[20px] font-bold font-display text-theme-text tabular-nums">{total ? Math.round((tally.w / total) * 100) : 0}%</div>
                </div>
                <div className="panel p-3">
                  <div className="text-[12px] font-semibold text-theme-muted">Played</div>
                  <div className="text-[20px] font-bold font-display text-theme-text tabular-nums">{total}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Opening stats + Phase accuracy + Strengths */}
          <StatsSections />
        </div>
      )}
    </PageContainer>
  );
};
export default Profile;
