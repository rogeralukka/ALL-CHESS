import React from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { NavLink } from 'react-router-dom';
import { CoachAvatar } from '@/features/coach/CoachAvatar';

export const Home: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-amber-500/10 via-theme-raised to-theme-card p-6 rounded-lg border border-amber-500/20 shadow-md">
        <div className="flex items-center gap-4">
          <CoachAvatar expression="wave" mode="bust" size={72} />
          <div>
            <h1 className="text-2xl font-bold font-display text-theme-text">Welcome back, Player!</h1>
            <p className="text-sm text-theme-muted mt-0.5">Your daily 4-day streak is burning bright 🔥</p>
          </div>
        </div>
        <div className="flex gap-2">
          <NavLink to="/review">
            <Button variant="primary">Review Recent Games</Button>
          </NavLink>
          <NavLink to="/dev/playground">
            <Button variant="secondary">Dev Playground</Button>
          </NavLink>
        </div>
      </div>
      <Card>
        <p className="text-theme-muted text-sm">
          Welcome to ALL-CHESS Phase 1. Navigate using the sidebar to explore Review, Play Coach, Learn, Puzzles, and Settings.
        </p>
      </Card>
    </div>
  );
};
export default Home;
