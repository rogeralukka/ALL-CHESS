import React from 'react';
import { Card } from '@/components/Card';
import { MOCK_OPENING_STATS, MOCK_STRENGTHS, MOCK_WEAKNESSES } from '@/data/mock/mockStats';
import { Chip } from '@/components/Chip';

export const Profile: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-theme-text">Player Profile &amp; Performance</h1>
          <p className="text-sm text-theme-muted">Rapid 905 AUTO • Member since Oct 2026</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-bold text-theme-text mb-3">Strengths</h3>
          <div className="flex flex-wrap gap-2">
            {MOCK_STRENGTHS.map((s) => (
              <Chip key={s.label} variant="success">{s.label} ({s.delta})</Chip>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="font-bold text-theme-text mb-3">Areas to Polish</h3>
          <div className="flex flex-wrap gap-2">
            {MOCK_WEAKNESSES.map((w) => (
              <Chip key={w.label} variant="danger">{w.label} ({w.delta})</Chip>
            ))}
          </div>
        </Card>
      </div>
      <Card>
        <h3 className="font-bold text-theme-text mb-3">Most Played Openings</h3>
        <div className="space-y-2">
          {MOCK_OPENING_STATS.map((o) => (
            <div key={o.eco} className="flex justify-between items-center text-sm py-1 border-b border-theme-border/40">
              <span className="font-semibold text-theme-text">{o.name}</span>
              <span className="text-xs text-amber-500 font-bold">{o.winRate}% win rate ({o.games} games)</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
export default Profile;
