import React from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { MOCK_PUZZLES } from '@/data/mock/mockPuzzles';

export const PuzzleScreen: React.FC = () => {
  const puz = MOCK_PUZZLES[0];
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-theme-text">Daily Tactical Puzzles</h1>
          <p className="text-sm text-theme-muted">Level up your rating and unlock achievement stones.</p>
        </div>
      </div>
      <Card>
        <span className="text-xs font-bold text-amber-500 uppercase">Puzzle #1 (Rating {puz.rating})</span>
        <h3 className="font-bold text-theme-text text-base mt-1">{puz.goal}</h3>
        <p className="text-xs text-theme-muted mt-2">Themes: {puz.theme.join(', ')}</p>
        <div className="mt-4">
          <Button variant="primary">Solve Puzzle</Button>
        </div>
      </Card>
    </div>
  );
};
export default PuzzleScreen;
