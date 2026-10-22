import React from 'react';
import { Button } from '@/components/Button';
import { CoachAvatar } from '@/features/coach/CoachAvatar';

export const PlayLobby: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-theme-card border border-theme-border rounded-lg shadow-md">
        <CoachAvatar expression="thumbsup" mode="full" size={200} />
        <div className="space-y-3">
          <h1 className="text-2xl font-bold font-display text-theme-text">Play Against Your Coach</h1>
          <p className="text-sm text-theme-muted">
            Practice dynamically with personalized hints, move evaluations, and gentle take-backs.
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="primary">Start Game (Casual 800)</Button>
            <Button variant="secondary">Change Difficulty</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlayLobby;
