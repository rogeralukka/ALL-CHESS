import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { CoachAvatar } from '@/features/coach/CoachAvatar';
import { CoachBubble } from '@/features/coach/CoachBubble';
import { MOCK_FRIENDS } from '@/data/mock/mockFriends';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  RefreshCw,
  Swords,
  BookOpen,
  Puzzle,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Users,
  CheckCircle,
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);
  const [coachDismissed, setCoachDismissed] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncToast('Synced 3 new games from linked accounts!');
      setTimeout(() => setSyncToast(null), 3000);
    }, 900);
  };

  const streakDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const streakCompleted = [true, true, true, true, true, false, false];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Top Header Row: Streak & Sync Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Streak Tracker */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Flame size={24} className="fill-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-xl text-theme-text">5 Day Streak</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-500 font-bold px-1.5 py-0.5 rounded uppercase">
                Active
              </span>
            </div>
            {/* 7-Day Pill Strip */}
            <div className="flex gap-1.5 mt-1">
              {streakDays.map((day, idx) => (
                <div
                  key={idx}
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    streakCompleted[idx]
                      ? 'bg-amber-500 text-black'
                      : 'bg-theme-raised text-theme-muted border border-theme-border'
                  }`}
                  title={`${day}: ${streakCompleted[idx] ? 'Completed' : 'Pending'}`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sync Status Button */}
        <div className="relative">
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />}
            onClick={handleSync}
            disabled={isSyncing}
          >
            {isSyncing ? 'Syncing Games...' : 'Sync Accounts'}
          </Button>
          {syncToast && (
            <div className="absolute right-0 top-12 z-50 bg-emerald-600 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-xl border border-emerald-400 flex items-center gap-2 whitespace-nowrap animate-in fade-in slide-in-from-top-2">
              <CheckCircle size={14} />
              <span>{syncToast}</span>
            </div>
          )}
        </div>
      </div>

      {/* Coach Daily Drill Hero Card */}
      {!coachDismissed && (
        <div className="flex flex-col md:flex-row items-center gap-5 p-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-theme-raised to-theme-card border border-amber-500/30 shadow-md">
          <div className="relative flex-shrink-0">
            <CoachAvatar expression="thumbsup" mode="bust" size={84} />
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full">
              DRILL
            </div>
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <div className="text-xs uppercase font-black tracking-wider text-amber-500">
              Daily Training Mission
            </div>
            <CoachBubble text="Welcome back! Today we're mastering King & Pawn opposition. 5 minutes of practice will solidify your endgame technique!" />
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto flex-shrink-0">
            <Button
              variant="primary"
              size="md"
              icon={<Sparkles size={16} />}
              onClick={() => navigate('/learn')}
            >
              Start Daily Drill
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCoachDismissed(true)}
            >
              Maybe Later
            </Button>
          </div>
        </div>
      )}

      {/* 3-Column Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Continue Learning */}
        <Card className="p-5 flex flex-col justify-between space-y-4 hover:border-amber-500/50 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <BookOpen size={18} />
              </div>
              <span className="text-xs font-bold text-amber-500 font-mono">Stage 2 of 8</span>
            </div>
            <div>
              <h3 className="font-bold font-display text-theme-text text-base">
                Endgame: Back-Rank Basics
              </h3>
              <p className="text-xs text-theme-muted mt-1">
                Spotting back-rank pawn barriers and delivering deflection checkmates.
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-theme-muted">
                <span>Progress</span>
                <span className="font-mono text-amber-500">62%</span>
              </div>
              <ProgressBar value={62} max={100} color="bg-amber-500" />
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            icon={<ChevronRight size={16} />}
            onClick={() => navigate('/learn')}
          >
            Resume Roadmap
          </Button>
        </Card>

        {/* Card 2: Recent Match Review */}
        <Card className="p-5 flex flex-col justify-between space-y-4 hover:border-amber-500/50 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <TrendingUp size={18} />
              </div>
              <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded">
                1-0 Win
              </span>
            </div>
            <div>
              <h3 className="font-bold font-display text-theme-text text-base">
                vs PawnStorm22
              </h3>
              <p className="text-xs text-theme-muted mt-1">
                Italian Game • Rapid 10+0 • 27 moves
              </p>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded bg-theme-raised text-xs">
              <div>
                <div className="text-[10px] uppercase font-bold text-theme-muted">Your Acc.</div>
                <div className="font-mono font-bold text-emerald-500 text-sm">84.2%</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-theme-muted">Opponent</div>
                <div className="font-mono font-semibold text-neutral-400 text-sm">78.5%</div>
              </div>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            fullWidth
            icon={<ChevronRight size={16} />}
            onClick={() => navigate('/review/game-01')}
          >
            Review Game
          </Button>
        </Card>

        {/* Card 3: Daily Tactical Puzzle */}
        <Card className="p-5 flex flex-col justify-between space-y-4 hover:border-amber-500/50 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Puzzle size={18} />
              </div>
              <span className="text-xs font-mono font-bold text-purple-400">Rating 650</span>
            </div>
            <div>
              <h3 className="font-bold font-display text-theme-text text-base">
                Daily Mate in 1
              </h3>
              <p className="text-xs text-theme-muted mt-1">
                White to move. Strike the back rank and box the king behind pawns!
              </p>
            </div>
            <div className="p-2.5 rounded bg-theme-raised text-xs flex items-center gap-2">
              <Flame size={14} className="text-amber-500" />
              <span className="text-theme-muted">Average solve time: <strong>14s</strong></span>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            icon={<ChevronRight size={16} />}
            onClick={() => navigate('/puzzles')}
          >
            Solve Puzzle
          </Button>
        </Card>
      </div>

      {/* Quick Launch & Friends Mini Leaderboard Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Quick Launch Actions */}
        <Card className="p-5 space-y-3">
          <h3 className="font-bold font-display text-theme-text text-base">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => navigate('/play')}
              className="p-3.5 rounded-xl bg-theme-raised hover:bg-amber-500/10 border border-theme-border hover:border-amber-500 text-left transition-colors group"
            >
              <Swords size={20} className="text-amber-500 group-hover:scale-110 transition-transform mb-2" />
              <div className="font-bold text-sm text-theme-text">Play Coach</div>
              <div className="text-xs text-theme-muted mt-0.5">Custom rated sparring</div>
            </button>

            <button
              type="button"
              onClick={() => navigate('/review')}
              className="p-3.5 rounded-xl bg-theme-raised hover:bg-amber-500/10 border border-theme-border hover:border-amber-500 text-left transition-colors group"
            >
              <TrendingUp size={20} className="text-amber-500 group-hover:scale-110 transition-transform mb-2" />
              <div className="font-bold text-sm text-theme-text">Games Library</div>
              <div className="text-xs text-theme-muted mt-0.5">Explore 12 mock games</div>
            </button>

            <button
              type="button"
              onClick={() => navigate('/scout')}
              className="p-3.5 rounded-xl bg-theme-raised hover:bg-amber-500/10 border border-theme-border hover:border-amber-500 text-left transition-colors group"
            >
              <Users size={20} className="text-amber-500 group-hover:scale-110 transition-transform mb-2" />
              <div className="font-bold text-sm text-theme-text">Scout Opponent</div>
              <div className="text-xs text-theme-muted mt-0.5">Repertoire insights</div>
            </button>

            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="p-3.5 rounded-xl bg-theme-raised hover:bg-amber-500/10 border border-theme-border hover:border-amber-500 text-left transition-colors group"
            >
              <Sparkles size={20} className="text-amber-500 group-hover:scale-110 transition-transform mb-2" />
              <div className="font-bold text-sm text-theme-text">Board &amp; Themes</div>
              <div className="text-xs text-theme-muted mt-0.5">8 boards, presets &amp; AI</div>
            </button>
          </div>
        </Card>

        {/* Friends Mini Leaderboard */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold font-display text-theme-text text-base flex items-center gap-2">
              <Users size={16} className="text-amber-500" />
              Friends Status
            </h3>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="text-xs text-amber-500 font-bold hover:underline"
            >
              Full Profile
            </button>
          </div>

          <div className="space-y-2">
            {MOCK_FRIENDS.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-theme-raised border border-theme-border/60"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      f.online ? 'bg-emerald-500' : 'bg-neutral-500'
                    }`}
                  />
                  <div>
                    <span className="font-semibold text-sm text-theme-text">{f.username}</span>
                    <span className="text-xs text-theme-muted ml-2">({f.lastActive})</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-amber-500">{f.rating}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate('/play')}
                  >
                    Challenge
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
export default Home;
