import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { PageContainer } from '@/components/PageHeader';
import { Segmented } from '@/components/Segmented';
import { StatsSections } from './StatsSections';
import { FriendsCompare } from './FriendsCompare';
import { MOCK_RATING_HISTORY } from '@/data/mock/mockStats';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Calendar } from 'lucide-react';
import { Meter } from '@/components/Bits';
import { RANKS, rankFor } from '@/lib/rank';

/** Gold coin marker on each rating point; the latest point gets a bigger star coin. */
const CoinDot: React.FC<{ cx?: number; cy?: number; index?: number; last: number }> = ({ cx = 0, cy = 0, index = 0, last }) => {
  const big = index === last;
  const r = big ? 9 : 5.5;
  return (
    <g>
      <circle cx={cx} cy={cy + 2} r={r} fill="rgba(0,0,0,.35)" />
      <circle cx={cx} cy={cy} r={r} fill="#ffc93c" stroke="#a86400" strokeWidth={2} />
      <circle cx={cx - r * 0.25} cy={cy - r * 0.3} r={r * 0.35} fill="rgba(255,255,255,.7)" />
      {big && <text x={cx} y={cy + 4} textAnchor="middle" fontSize={11} fontWeight={900} fill="#7a4300">★</text>}
    </g>
  );
};

export const Profile: React.FC = () => {
  const [speed, setSpeed] = useState<'rapid' | 'blitz' | 'bullet'>('rapid');
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | 'all'>('all');
  const [colorFilter, setColorFilter] = useState<'all' | 'white' | 'black'>('all');

  // Filter or adjust mock data points
  const chartData = MOCK_RATING_HISTORY.map((pt) => {
    let score = pt[speed];
    if (colorFilter === 'white') score += 15;
    if (colorFilter === 'black') score -= 15;
    return {
      date: pt.date.slice(5), // mm-dd
      fullDate: pt.date,
      rating: score,
    };
  });

  const currentRating = chartData[chartData.length - 1].rating;
  const ratingDelta = currentRating - chartData[0].rating;
  const rank = rankFor(currentRating);

  return (
    <PageContainer>
      {/* Profile hero */}
      <section className="panel relative overflow-hidden" data-testid="profile-hero">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(560px 300px at 82% 70%, rgba(167,139,250,0.2), transparent 70%)' }} />
        <img
          src="/assets/ui/hero_profile.webp"
          alt=""
          aria-hidden="true"
          className="hidden lg:block absolute right-5 top-4 h-[calc(100%-32px)] w-auto max-w-[38%] object-contain object-right pointer-events-none"
          style={{ filter: 'drop-shadow(0 18px 24px rgba(0,0,0,.45))' }}
        />
        <div className="relative p-5 md:p-7 flex flex-col sm:flex-row sm:items-end gap-5 lg:max-w-[60%]">
          <div className="relative flex-shrink-0 w-[120px] h-[150px] -mb-2">
            <div className="absolute inset-x-2 bottom-0 h-[110px] rounded-2xl bg-gradient-to-b from-amber-500/30 to-amber-600/10 border border-amber-500/30" />
            <img src="/assets/coach/coach_wave_full.webp" alt="Your avatar" className="relative w-full h-full object-contain object-bottom" style={{ filter: 'drop-shadow(0 6px 8px rgba(0,0,0,.4))' }} />
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <h1 className="text-[30px] font-black font-display text-theme-text leading-tight">Master</h1>
              <p className="text-[14px] text-theme-muted flex items-center gap-1.5">
                <Calendar size={14} /> Member since October 2026 · 105 games played
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 max-w-md">
              {(
                [
                  ['Rapid', 905],
                  ['Blitz', 870],
                  ['Bullet', 880],
                ] as const
              ).map(([m, r]) => {
                const { tier } = rankFor(r);
                return (
                  <div
                    key={m}
                    className="relative rounded-[14px] border-2 px-3 py-2 flex items-center gap-2"
                    style={{ borderColor: `color-mix(in srgb, ${tier.color} 35%, transparent)`, background: `linear-gradient(160deg, color-mix(in srgb, ${tier.color} 18%, transparent), transparent 75%)`, boxShadow: `0 4px 0 color-mix(in srgb, ${tier.color} 25%, var(--panel-lip))` }}
                    title={`${tier.name} rank`}
                  >
                    <img src={tier.icon} alt="" className="w-8 h-8 object-contain flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[12px] font-display font-black uppercase tracking-wide" style={{ color: tier.color }}>{m}</div>
                      <div className="text-[22px] font-black font-display tabular-nums text-theme-text leading-none">{r}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Rating quest: the rating line drawn like a level map, with piece-rank bands */}
      <Card className="p-4 md:p-5 space-y-4 min-w-0 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0 w-full">
          <div className="flex items-center gap-3">
            <img src={rank.tier.icon} alt="" className="w-12 h-12 object-contain" style={{ filter: 'drop-shadow(0 3px 3px rgba(0,0,0,.4))' }} />
            <div>
              <h2 className="text-[20px] font-black font-display text-theme-text leading-tight">Rating quest</h2>
              <p className="text-[13px] text-theme-muted font-semibold">
                <span className="font-display font-black" style={{ color: rank.tier.color }}>{rank.tier.name} rank</span> · {currentRating}{' '}
                <span className={ratingDelta >= 0 ? 'text-emerald-400' : 'text-red-400'}>({ratingDelta >= 0 ? `+${ratingDelta}` : ratingDelta})</span>
              </p>
            </div>
          </div>

          {/* Horizontally scrollable filter strip */}
          <div className="overflow-x-auto no-scrollbar flex items-center gap-2 pb-1 w-full md:w-auto max-w-full flex-nowrap">
            <Segmented<'rapid' | 'blitz' | 'bullet'>
              size="sm"
              value={speed}
              onChange={setSpeed}
              options={[
                { value: 'rapid', label: 'Rapid' },
                { value: 'blitz', label: 'Blitz' },
                { value: 'bullet', label: 'Bullet' },
              ]}
            />
            <Segmented<'30d' | '90d' | 'all'>
              size="sm"
              value={timeRange}
              onChange={setTimeRange}
              options={[
                { value: '30d', label: '30D' },
                { value: '90d', label: '90D' },
                { value: 'all', label: 'All' },
              ]}
            />
            <Segmented<'all' | 'white' | 'black'>
              size="sm"
              value={colorFilter}
              onChange={setColorFilter}
              options={[
                { value: 'all', label: 'All' },
                { value: 'white', label: 'White' },
                { value: 'black', label: 'Black' },
              ]}
            />
          </div>
        </div>

        {/* next-rank XP bar */}
        {rank.next && (
          <div className="flex items-center gap-3">
            <Meter value={rank.progress} color={rank.tier.color} className="flex-1" label={`Progress to ${rank.next.name}`} />
            <div className="flex items-center gap-1.5 flex-shrink-0 text-[13px] font-display font-black text-theme-muted">
              {rank.toNext} to
              <img src={rank.next.icon} alt="" className="w-6 h-6 object-contain" />
              <span style={{ color: rank.next.color }}>{rank.next.name}</span>
            </div>
          </div>
        )}

        <div className="well h-64 w-full p-2 pt-3 overflow-hidden" data-testid="rating-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 14, right: 18, left: -14, bottom: 0 }}>
              <defs>
                <pattern id="questStripes" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="10" height="10" fill="rgba(245,165,36,0.16)" />
                  <rect width="4" height="10" fill="rgba(245,165,36,0.26)" />
                </pattern>
              </defs>
              <XAxis dataKey="date" stroke="currentColor" className="text-[12px] font-display font-bold text-theme-muted" tickLine={false} axisLine={false} minTickGap={24} />
              <YAxis domain={['dataMin - 25', 'dataMax + 25']} stroke="currentColor" className="text-[12px] font-display font-bold text-theme-muted" tickLine={false} axisLine={false} allowDecimals={false} />
              {RANKS.map((t) => (
                <ReferenceLine
                  key={t.id}
                  y={t.min}
                  ifOverflow="discard"
                  stroke={t.color}
                  strokeDasharray="6 6"
                  strokeWidth={2}
                  label={{ value: t.name, position: 'insideTopLeft', fill: t.color, fontSize: 12, fontWeight: 900 }}
                />
              ))}
              <Tooltip
                cursor={{ stroke: 'rgba(245,165,36,.5)', strokeWidth: 2, strokeDasharray: '4 4' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="panel !rounded-[12px] px-3 py-2 text-xs">
                        <div className="font-bold text-theme-muted">{data.fullDate}</div>
                        <div className="text-amber-400 font-black font-display text-[16px]">{data.rating}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* dark outline under the line, then the gold path with coin markers */}
              <Area type="monotone" dataKey="rating" stroke="rgba(0,0,0,.45)" strokeWidth={9} fill="none" isAnimationActive={false} dot={false} activeDot={false} />
              <Area
                type="monotone"
                dataKey="rating"
                stroke="#ffb627"
                strokeWidth={5}
                strokeLinecap="round"
                fill="url(#questStripes)"
                dot={(props: { cx?: number; cy?: number; index?: number; key?: React.Key }) => <CoinDot key={props.key} cx={props.cx} cy={props.cy} index={props.index} last={chartData.length - 1} />}
                activeDot={{ r: 9, fill: '#ffd36b', stroke: '#a86400', strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Stats Sections (Record, Strengths/Weaknesses, Phase points lost, Openings) */}
      <StatsSections />

      {/* Friends Comparison */}
      <FriendsCompare />
    </PageContainer>
  );
};
export default Profile;
