import React from 'react';
import { Card } from '@/components/Card';
import { NavLink } from 'react-router-dom';
import { MOCK_GAMES } from '@/data/mock/mockGames';

export const ReviewRouter: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-theme-text">Game Review &amp; Analysis</h1>
          <p className="text-sm text-theme-muted mt-0.5">Explore move-by-move evaluations with coach insights.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_GAMES.map((game) => (
          <NavLink key={game.id} to={`/review/${game.id}`}>
            <Card className="hover:border-amber-500/50 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-500 uppercase">{game.speed} • {game.timeControl}</span>
                <span className="text-xs font-mono font-bold bg-theme-raised px-1.5 py-0.5 rounded">{game.result}</span>
              </div>
              <h3 className="font-bold text-theme-text group-hover:text-amber-500 transition-colors">
                {game.white.username} vs {game.black.username}
              </h3>
              <p className="text-xs text-theme-muted mt-1">{game.opening.name}</p>
              {game.accuracy && (
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-theme-border/50 text-xs">
                  <span className="text-theme-muted">Accuracy:</span>
                  <span className="font-bold text-emerald-500">{game.accuracy.white}%</span>
                  <span className="text-theme-muted">/</span>
                  <span className="font-bold text-sky-500">{game.accuracy.black}%</span>
                </div>
              )}
            </Card>
          </NavLink>
        ))}
      </div>
    </div>
  );
};
export default ReviewRouter;
