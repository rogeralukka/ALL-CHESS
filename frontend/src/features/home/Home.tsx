import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { PageContainer, SectionTitle } from '@/components/PageHeader';
import { PlayerAvatar, Reveal } from '@/components/Bits';
import { GameHistoryTable } from '@/components/GameHistoryTable';
import { CoachSpeech } from '@/features/coach/CoachSpeech';
import { CoachAvatar } from '@/features/coach/CoachAvatar';
import { LevelBadge } from '@/features/map/LevelBadge';
import { Board } from '@/features/board/Board';
import { useSettingsStore } from '@/data/settingsStore';
import { BOARD_THEMES, PIECE_SETS } from '@/data/boardThemes';
import { gameRepository, statsRepository, friendRepository, learnRepository, puzzleRepository, RatingSummary } from '@/data/repositories';
import { Game, Friend, LessonStage, Puzzle } from '@/data/types';
import { MOCK_GAMES } from '@/data/mock/mockGames';
import { MOCK_FRIENDS } from '@/data/mock/mockFriends';
import { MOCK_LEARN_STAGES } from '@/data/mock/mockLearn';
import { MOCK_PUZZLES } from '@/data/mock/mockPuzzles';
import { storage } from '@/lib/storage';
import { useMotion } from '@/lib/useMotion';
import { Flame, ChevronRight, Sparkles, Clock, ArrowUpRight, Zap, Timer, Users } from 'lucide-react';

const DEFAULT_RATINGS: RatingSummary[] = [
  { mode: 'Rapid', rating: 905, deltaWeekly: 15 },
  { mode: 'Blitz', rating: 870, deltaWeekly: 5 },
  { mode: 'Bullet', rating: 880, deltaWeekly: 5 },
];
const MODE_ICON: Record<string, React.ReactNode> = {
  Rapid: <Clock size={20} className="text-emerald-400" />,
  Blitz: <Timer size={20} className="text-yellow-300" />,
  Bullet: <Zap size={20} className="text-amber-400" />,
};

const greeting = () => {
  const h = new Date().getHours();
  return h < 5 ? 'Late night session' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

/** A launcher tile like the reference's home cards: board preview on top, icon + title, one action. */
const LaunchCard: React.FC<{
  fen: string;
  icon: string;
  title: string;
  meta: React.ReactNode;
  action: string;
  onClick: () => void;
  extra?: React.ReactNode;
  i: number;
  testId: string;
}> = ({ fen, icon, title, meta, action, onClick, extra, i, testId }) => {
  const { boardThemeId, pieceSetId } = useSettingsStore();
  const theme = BOARD_THEMES.find((t) => t.id === boardThemeId) || BOARD_THEMES[0];
  const pieces = PIECE_SETS.find((p) => p.id === pieceSetId) || PIECE_SETS[0];
  return (
    <Reveal i={i}>
      <Card interactive className="!p-0 overflow-hidden h-full flex flex-col" onClick={onClick} data-testid={testId}>
        <div className="relative pointer-events-none">
          <Board fen={fen} boardTheme={theme} pieceSet={pieces} interactive={false} coordinates="none" animationSpeed="off" maxWidthClass="max-w-none" className="[&_[data-board]]:!rounded-none [&_[data-board]]:!border-0 [&_[data-board]]:!shadow-none" />
          <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[var(--color-card)] to-transparent" />
        </div>
        <div className="p-4 pt-2 flex flex-col gap-3 flex-1">
          <div className="flex items-center gap-2.5">
            <img src={icon} alt="" className="w-9 h-9 object-contain" style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,.35))' }} />
            <div className="min-w-0 flex-1">
              <div className="font-extrabold text-[16px] text-theme-text truncate">{title}</div>
              <div className="text-[13px] text-theme-muted truncate">{meta}</div>
            </div>
            {extra}
          </div>
          <Button variant="secondary" size="lg" fullWidth className="mt-auto" onClick={(e) => { e.stopPropagation(); onClick(); }}>
            {action}
          </Button>
        </div>
      </Card>
    </Reveal>
  );
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isFull } = useMotion();
  const [coachDismissed, setCoachDismissed] = useState(false);
  const [recentGames, setRecentGames] = useState<Game[]>(() => MOCK_GAMES.slice(0, 5));
  const [ratings, setRatings] = useState<RatingSummary[]>(() => DEFAULT_RATINGS);
  const [friends, setFriends] = useState<Friend[]>(() => MOCK_FRIENDS);
  const [currentStage, setCurrentStage] = useState<LessonStage | null>(() => MOCK_LEARN_STAGES.find((s) => s.status === 'current') || MOCK_LEARN_STAGES[0]);
  const [dailyPuzzle, setDailyPuzzle] = useState<Puzzle | null>(() => MOCK_PUZZLES[0]);

  useEffect(() => {
    let mounted = true;
    Promise.all([gameRepository.getGames(), statsRepository.getUserRatings(), friendRepository.getFriends(), learnRepository.getStages(), puzzleRepository.getDailyPuzzle()]).then(
      ([games, userRatings, friendList, stages, puzzle]) => {
        if (!mounted) return;
        setRecentGames(games.slice(0, 5));
        setRatings(userRatings);
        setFriends(friendList);
        setCurrentStage(stages.find((s) => s.status === 'current') || stages[0] || null);
        setDailyPuzzle(puzzle);
      }
    );
    return () => {
      mounted = false;
    };
  }, []);

  const puzzleRating = storage.get('all_chess_puzzle_rating', 1200);
  const puzzleStreak = storage.get('all_chess_puzzle_streak', 0);
  const puzzleIndex = storage.get('all_chess_puzzle_index', 0);
  const puzzleLevel = Math.floor(puzzleIndex / 5) + 1;
  const stageNo = currentStage ? MOCK_LEARN_STAGES.filter((s) => s.category === currentStage.category).indexOf(currentStage) + 1 : 1;

  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const today = (new Date().getDay() + 6) % 7;

  return (
    <PageContainer wide>
      {/* Greeting row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="rounded-xl bg-black/20 border border-theme-border overflow-hidden">
            <CoachAvatar expression="wave" size={48} />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-theme-muted">{greeting()},</div>
            <div className="text-[22px] font-black font-display text-theme-text leading-tight">Master</div>
          </div>
        </div>
        <div className="flex items-center gap-3" data-testid="streak">
          <div className="hidden md:flex gap-1">
            {days.map((d, i) => (
              <span
                key={i}
                className={`w-7 h-7 rounded-full text-[12px] font-black flex items-center justify-center ${
                  i < today ? 'bg-amber-500 text-black' : i === today ? 'ring-2 ring-amber-500 text-amber-400 bg-amber-500/10' : 'bg-black/[0.05] dark:bg-white/[0.05] text-theme-muted/60'
                }`}
              >
                {d}
              </span>
            ))}
          </div>
          <motion.div
            className="flex items-center gap-1.5"
            animate={isFull ? { scale: [1, 1.06, 1] } : undefined}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Flame size={28} className="text-amber-400 fill-amber-400/30" />
            <span className="text-[17px] md:text-[22px] font-black font-display text-theme-text whitespace-nowrap">5 Day Streak</span>
          </motion.div>
        </div>
      </div>

      {/* Coach hero */}
      {!coachDismissed && (
        <section className="panel relative overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(560px 300px at 85% 70%, rgba(245,165,36,0.2), transparent 70%)' }} />
          <img
            src="/assets/ui/hero_home.webp"
            alt=""
            aria-hidden="true"
            className="hidden lg:block absolute right-[-30px] bottom-[-40px] h-[135%] pointer-events-none"
            style={{ filter: 'drop-shadow(0 18px 26px rgba(0,0,0,.5))' }}
          />
          <div className="relative p-5 md:p-7 lg:max-w-[58%] space-y-4">
            <div className="text-[12px] font-black uppercase tracking-[0.14em] text-amber-400">Today's training</div>
            <CoachSpeech
              expression="thumbsup"
              size={80}
              text={`Welcome back! Today's focus is ${currentStage?.title?.toLowerCase() || 'king and pawn endgames'}. Five focused minutes now will show up in your next game.`}
            />
            <div className="flex flex-wrap gap-2 pl-[90px]">
              <Button variant="primary" size="lg" icon={<Sparkles size={18} />} onClick={() => navigate('/learn')}>
                Start today's lesson
              </Button>
              <Button variant="ghost" size="lg" onClick={() => setCoachDismissed(true)}>
                Later
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Launchers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <LaunchCard
          i={0}
          testId="launch-puzzles"
          fen={dailyPuzzle?.fen || '6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1'}
          icon="/assets/ui/icon_puzzles.webp"
          title="Puzzles"
          meta={
            <span className="flex items-center gap-1.5">
              <strong className="text-theme-text tabular-nums">{puzzleRating}</strong>
              <Flame size={13} className="text-amber-400" /> {puzzleStreak}
            </span>
          }
          extra={<LevelBadge level={puzzleLevel} width={40} />}
          action="Solve puzzles"
          onClick={() => navigate('/puzzles')}
        />
        <LaunchCard
          i={1}
          testId="launch-learn"
          fen="8/8/4k3/8/4K3/8/4P3/8 w - - 0 1"
          icon="/assets/ui/icon_learn.webp"
          title={currentStage?.title || 'Lessons'}
          meta={`Stage ${stageNo} · ${currentStage?.category || 'endgame'}`}
          action="Continue lesson"
          onClick={() => navigate('/learn')}
        />
        <LaunchCard
          i={2}
          testId="launch-play"
          fen="rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"
          icon="/assets/ui/icon_play.webp"
          title="Play the coach"
          meta="Rated sparring with live hints"
          extra={
            <div className="rounded-lg overflow-hidden bg-black/20">
              <CoachAvatar expression="brilliant" size={40} />
            </div>
          }
          action="Play coach"
          onClick={() => navigate('/play')}
        />
        <LaunchCard
          i={3}
          testId="launch-review"
          fen="r1bqk1nr/pppp1Bpp/2n5/4p3/1b2P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 6"
          icon="/assets/ui/icon_review.webp"
          title="Review your last game"
          meta={recentGames[0] ? `vs ${recentGames[0].white.username === 'You' ? recentGames[0].black.username : recentGames[0].white.username}` : 'Latest game'}
          action="Start review"
          onClick={() => navigate(recentGames[0] ? `/review/${recentGames[0].id}` : '/review')}
        />
      </div>

      {/* Ratings + friends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <SectionTitle
            right={
              <button type="button" onClick={() => navigate('/profile')} className="text-[13px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-0.5">
                Stats <ChevronRight size={15} />
              </button>
            }
          >
            Your ratings
          </SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ratings.map((r, i) => (
              <Reveal key={r.mode} i={i}>
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="w-full text-left rounded-xl bg-black/[0.04] dark:bg-black/25 border border-theme-border hover:border-amber-500/40 px-4 py-3 transition-colors"
                >
                  <div className="flex items-center gap-2 text-[13px] font-bold text-theme-muted">
                    {MODE_ICON[r.mode]} {r.mode}
                  </div>
                  <div className="flex items-end justify-between mt-1">
                    <span className="text-[28px] font-black font-display tabular-nums text-theme-text leading-none">{r.rating}</span>
                    <span className="flex items-center text-[13px] font-bold text-[var(--class-best)]">
                      <ArrowUpRight size={15} />+{r.deltaWeekly}
                    </span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </Card>
        <Card>
          <SectionTitle icon={<Users size={17} className="text-amber-500" />}>Friends</SectionTitle>
          <div className="space-y-1">
            {friends.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => navigate('/profile')}
                className="w-full flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-colors text-left"
              >
                <span className="relative">
                  <PlayerAvatar name={f.username} size={34} />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--color-card)] ${f.online ? 'bg-emerald-500' : 'bg-neutral-500'}`} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold text-theme-text truncate">{f.username}</div>
                  <div className="text-[12px] text-theme-muted">{f.online ? 'Online' : f.lastActive}</div>
                </div>
                <span className="text-[14px] font-black tabular-nums text-theme-text/85">{f.rating}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Game history */}
      <Card className="!p-0 overflow-hidden">
        <div className="px-4 md:px-5 pt-4">
          <SectionTitle
            right={
              <button type="button" onClick={() => navigate('/review')} className="text-[13px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-0.5">
                View all games <ChevronRight size={15} />
              </button>
            }
          >
            Game history
          </SectionTitle>
        </div>
        <GameHistoryTable games={recentGames} analyzingId={recentGames[2]?.id} />
      </Card>
    </PageContainer>
  );
};
export default Home;
