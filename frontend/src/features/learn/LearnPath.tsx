import React from 'react';
import { Card } from '@/components/Card';
import { MOCK_LEARN_STAGES } from '@/data/mock/mockLearn';

export const LearnPath: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold font-display text-theme-text">Curated Learning Roadmap</h1>
      <p className="text-sm text-theme-muted">Suggested from your recent games: Master critical rook endgames.</p>
      <div className="space-y-4">
        {MOCK_LEARN_STAGES.map((stg) => (
          <Card key={stg.id} className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-500 uppercase">{stg.category}</span>
              <h3 className="font-bold text-theme-text text-base">{stg.title}</h3>
              <p className="text-xs text-theme-muted mt-0.5">{stg.description}</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-theme-raised border border-theme-border">
              {stg.status}
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default LearnPath;
