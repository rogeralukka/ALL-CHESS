import React from 'react';
import { Card } from '@/components/Card';
import { MOCK_SCOUT_PROFILES } from '@/data/mock/mockScout';

export const ScoutSearch: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold font-display text-theme-text">Opponent Scout &amp; Prep</h1>
      <p className="text-sm text-theme-muted">Analyze opponent opening repertoires and weaknesses without authentication.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.values(MOCK_SCOUT_PROFILES).map((p) => (
          <Card key={p.username}>
            <h3 className="font-bold text-theme-text">{p.username}</h3>
            <span className="text-xs text-amber-500 font-bold">Rating {p.rating}</span>
            <p className="text-xs text-theme-muted mt-2">Win Rate: {p.winRate}%</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default ScoutSearch;
