import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { PageContainer } from '@/components/PageHeader';
import { Segmented } from '@/components/Segmented';
import { StatsSections } from './StatsSections';
import { FriendsCompare } from './FriendsCompare';
import { MOCK_RATING_HISTORY } from '@/data/mock/mockStats';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

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

  return (
    <PageContainer>
      {/* Profile hero */}
      <section className="panel relative overflow-hidden" data-testid="profile-hero">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(560px 300px at 82% 70%, rgba(167,139,250,0.2), transparent 70%)' }} />
        <img
          src="/assets/ui/hero_profile.webp"
          alt=""
          aria-hidden="true"
          className="hidden lg:block absolute right-[-10px] bottom-[-26px] h-[118%] pointer-events-none"
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
              {[
                ['Rapid', 905, '#34d399'],
                ['Blitz', 870, '#fde047'],
                ['Bullet', 880, '#fbbf24'],
              ].map(([m, r, c]) => (
                <div key={m as string} className="rounded-xl bg-black/[0.06] dark:bg-black/25 border border-theme-border px-3 py-2">
                  <div className="text-[12px] font-bold uppercase tracking-wide" style={{ color: c as string }}>{m}</div>
                  <div className="text-[22px] font-black font-display tabular-nums text-theme-text leading-tight">{r}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Rating History Graph */}
      <Card className="p-4 space-y-3 min-w-0 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-theme-border pb-3 min-w-0 w-full">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-amber-500" />
              <h2 className="text-lg font-bold font-display text-theme-text">Rating Trajectory</h2>
            </div>
            <p className="text-xs text-theme-muted mt-0.5">
              Current: <strong className="text-amber-500 font-mono tabular-nums text-sm">{currentRating}</strong>{' '}
              ({ratingDelta >= 0 ? `+${ratingDelta}` : ratingDelta} pts over period)
            </p>
          </div>

          {/* Horizontally scrollable filter strip with fade edge */}
          <div className="overflow-x-auto scrollbar-none flex items-center gap-2 pb-1 w-full md:w-auto max-w-full flex-nowrap">
            {/* Speed Selector */}
            <Segmented<'rapid' | 'blitz' | 'bullet'>
              value={speed}
              onChange={setSpeed}
              options={[
                { value: 'rapid', label: 'Rapid' },
                { value: 'blitz', label: 'Blitz' },
                { value: 'bullet', label: 'Bullet' },
              ]}
            />

            {/* Time Range */}
            <Segmented<'30d' | '90d' | 'all'>
              value={timeRange}
              onChange={setTimeRange}
              options={[
                { value: '30d', label: '30D' },
                { value: '90d', label: '90D' },
                { value: 'all', label: 'All' },
              ]}
            />

            {/* Color Segment */}
            <Segmented<'all' | 'white' | 'black'>
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

        {/* Recharts Area Container */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="currentColor"
                className="text-xs text-theme-muted"
                tickLine={false}
                minTickGap={24}
              />
              <YAxis
                domain={['dataMin - 20', 'dataMax + 20']}
                stroke="currentColor"
                className="text-xs text-theme-muted font-mono"
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-theme-card border border-theme-border rounded-lg shadow-xl p-2.5 text-xs">
                        <div className="font-semibold text-theme-muted">{data.fullDate}</div>
                        <div className="text-amber-500 font-bold font-mono text-sm mt-0.5">
                          Rating: {data.rating}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="rating"
                stroke="#f59e0b"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#ratingGradient)"
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
