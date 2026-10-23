import React, { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { CoachAvatar } from '@/features/coach/CoachAvatar';
import { CoachBubble } from '@/features/coach/CoachBubble';
import {
  gameRepository,
  statsRepository,
  friendRepository,
  learnRepository,
  puzzleRepository,
  RatingSummary,
} from '@/data/repositories';
import { Game, Friend, LessonStage, Puzzle } from '@/data/types';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  Swords,
  BookOpen,
  Puzzle as PuzzleIcon,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Users,
  Clock,
  ArrowUpRight,
  SlidersHorizontal,
  RotateCw,
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [coachDismissed, setCoachDismissed] = useState(false);
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [ratings, setRatings] = useState<RatingSummary[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [currentStage, setCurrentStage] = useState<LessonStage | null>(null);
  const [dailyPuzzle, setDailyPuzzle] = useState<Puzzle | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      gameRepository.getGames(),
      statsRepository.getUserRatings(),
      friendRepository.getFriends(),
      learnRepository.getStages(),
      puzzleRepository.getDailyPuzzle(),
    ]).then(([games, userRatings, friendList, stages, puzzle]) => {
      if (!mounted) return;
      setRecentGames(games.slice(0, 3));
      setRatings(userRatings);
      setFriends(friendList);
      const active = stages.find((s) => s.status === 'current') || stages[1] || stages[0];
      setCurrentStage(active || null);
      setDailyPuzzle(puzzle);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const streakDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const streakCompleted = [true, true, true, true, true, false, false];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Top Header Row: Streak & Sync Status */}
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

        {/* Sync Status Badge (Single sync control: Status here, trigger in sidebar) */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-theme-raised border border-theme-border/60 text-xs text-theme-muted shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Clock size={13} className="text-theme-muted" />
          <span>Synced 12m ago</span>
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

      {/* Your Ratings Section */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-amber-500" />
            <h2 className="font-bold font-display text-theme-text text-base">Your Ratings</h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500 hover:text-amber-400 transition-colors"
          >
            <SlidersHorizontal size={13} />
            <span>Adjust</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ratings.map((r) => (
            <div
              key={r.mode}
              className="p-3.5 rounded-xl bg-theme-raised border border-theme-border/60 flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-theme-muted block">
                  {r.mode}
                </span>
                <span className="text-2xl font-black font-mono text-theme-text mt-0.5 block">
                  {r.rating}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold font-mono px-2 py-1 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30">
                <ArrowUpRight size={14} />
                <span>+{r.deltaWeekly}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 2-Column Section: Continue Learning & Daily Tactical Puzzle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                {currentStage?.title || 'Endgame: Back-Rank Basics'}
              </h3>
              <p className="text-xs text-theme-muted mt-1 leading-relaxed">
                {currentStage?.description ||
                  'Spotting back-rank pawn barriers and delivering deflection checkmates.'}
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

        {/* Card 2: Daily Tactical Puzzle */}
        <Card className="p-5 flex flex-col justify-between space-y-4 hover:border-amber-500/50 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <PuzzleIcon size={18} />
              </div>
              <span className="text-xs font-mono font-bold text-purple-400">
                Rating {dailyPuzzle?.rating || 650}
              </span>
            </div>
            <div>
              <h3 className="font-bold font-display text-theme-text text-base">
                {dailyPuzzle?.goal || 'Daily Mate in 1'}
              </h3>
              <p className="text-xs text-theme-muted mt-1 leading-relaxed">
                {dailyPuzzle
                  ? `Tactical theme: ${dailyPuzzle.theme.join(', ')}. White to move!`
                  : 'White to move. Strike the back rank and box the king behind pawns!'}
              </p>
            </div>
            <div className="p-2.5 rounded bg-theme-raised text-xs flex items-center gap-2">
              <Flame size={14} className="text-amber-500" />
              <span className="text-theme-muted">
                Average solve time: <strong>14s</strong>
              </span>
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

      {/* Review Your Games Section (3 Recent Games from Repository) */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-500" />
            <h2 className="font-bold font-display text-theme-text text-base">Review your games</h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/review')}
            className="text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors"
          >
            View All ({recentGames.length > 0 ? '12' : '0'}) →
          </button>
        </div>

        <div className="space-y-3">
          {recentGames.map((game, index) => {
            const isUserWhite = game.white.username === 'You';
            const userWon =
              (isUserWhite && game.result === '1-0') || (!isUserWhite && game.result === '0-1');
            const userLost =
              (isUserWhite && game.result === '0-1') || (!isUserWhite && game.result === '1-0');
            const opponent = isUserWhite ? game.black : game.white;
            const fullMoves = Math.ceil(game.moves.length / 2);
            const userAccuracy = isUserWhite ? game.accuracy?.white : game.accuracy?.black;
            const isAnalyzing = index === 2; // 3rd game shows analyzing 62% badge

            return (
              <div
                key={game.id}
                className="p-4 rounded-xl bg-theme-raised border border-theme-border/60 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Left: Result Chip + Game Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Result Chip */}
                  <span
                    className={`font-mono text-xs font-bold px-2.5 py-1 rounded border flex-shrink-0 ${
                      userWon
                        ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                        : userLost
                        ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        : 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                    }`}
                  >
                    {game.result} {userWon ? 'Win' : userLost ? 'Loss' : 'Draw'}
                  </span>

                  {/* Metadata */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-theme-text truncate">
                        vs {opponent.username}
                      </span>
                      {opponent.title && (
                        <span className="text-[10px] font-black bg-amber-500/20 text-amber-500 px-1 py-0.2 rounded">
                          {opponent.title}
                        </span>
                      )}
                      <span className="text-xs text-theme-muted font-mono">({opponent.rating})</span>
                    </div>
                    <p className="text-xs text-theme-muted truncate mt-0.5">
                      {game.opening.name} • {game.timeControl} • {fullMoves} moves
                    </p>
                  </div>
                </div>

                {/* Right: Accuracy or Analyzing State & Review Action */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  {isAnalyzing ? (
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-semibold">
                      <RotateCw size={12} className="animate-spin" />
                      <span>Analyzing 62%</span>
                    </div>
                  ) : userAccuracy !== undefined ? (
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-theme-muted">Accuracy</div>
                      <div className="font-mono font-bold text-emerald-500 text-sm">
                        {userAccuracy}%
                      </div>
                    </div>
                  ) : null}

                  <Button
                    size="sm"
                    variant="primary"
                    icon={<ChevronRight size={15} />}
                    onClick={() => navigate(`/review/${game.id}`)}
                  >
                    Review
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

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
            {friends.map((f) => (
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
                    onClick={() => navigate('/profile')}
                  >
                    Compare
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
