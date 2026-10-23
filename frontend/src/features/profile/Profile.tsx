import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Segmented } from '@/components/Segmented';
import { CoachAvatar } from '@/features/coach/CoachAvatar';
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
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header Profile Card */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <CoachAvatar expression="thumbsup" mode="bust" size={72} />
            <div>
              <h1 className="text-2xl font-black font-display text-theme-text">You</h1>
              <p className="text-sm text-theme-muted mt-0.5 flex items-center gap-1.5">
                <Calendar size={14} /> Member since October 2026 • 105 games played
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="px-4 py-2 rounded-lg bg-theme-raised border border-theme-border text-center">
              <div className="text-[10px] uppercase font-bold text-theme-muted">Rapid</div>
              <div className="text-lg font-black font-mono tabular-nums text-amber-500">905</div>
            </div>
            <div className="px-4 py-2 rounded-lg bg-theme-raised border border-theme-border text-center">
              <div className="text-[10px] uppercase font-bold text-theme-muted">Blitz</div>
              <div className="text-lg font-black font-mono tabular-nums text-theme-text">870</div>
            </div>
            <div className="px-4 py-2 rounded-lg bg-theme-raised border border-theme-border text-center">
              <div className="text-[10px] uppercase font-bold text-theme-muted">Bullet</div>
              <div className="text-lg font-black font-mono tabular-nums text-theme-text">880</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Rating History Graph */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-theme-border pb-3">
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

          <div className="flex flex-wrap gap-2 items-center">
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
    </div>
  );
};
export default Profile;
