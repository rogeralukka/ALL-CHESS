import React, { useState } from 'react';
import { MOCK_LEARN_STAGES } from '@/data/mock/mockLearn';
import { LessonStage } from '@/data/types';
import { LessonPlayer } from './LessonPlayer';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Segmented } from '@/components/Segmented';
import { ProgressBar } from '@/components/ProgressBar';
import { toast } from '@/components/Toast';
import {
  CheckCircle2,
  Lock,
  Play,
  Flame,
  Award,
  Sparkles,
  BookOpen,
  HelpCircle,
  Dumbbell,
  Compass,
} from 'lucide-react';

export const LearnPath: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'endgame' | 'openings' | 'middlegame'>('endgame');
  const stages = MOCK_LEARN_STAGES.filter((s) => s.category === activeCategory);

  const defaultSelected = stages.find((s) => s.status === 'current') || stages[0];
  const [selectedStage, setSelectedStage] = useState<LessonStage | null>(defaultSelected);
  const [activeLessonStage, setActiveLessonStage] = useState<LessonStage | null>(null);

  const completedStages = stages.filter((s) => s.status === 'done').length;

  const handleLessonComplete = () => {
    toast.achievement('Stage Completed!', `+${activeLessonStage?.xp || 50} XP earned`);
    setActiveLessonStage(null);
  };

  if (activeLessonStage) {
    return (
      <LessonPlayer
        stage={activeLessonStage}
        onComplete={handleLessonComplete}
        onExit={() => setActiveLessonStage(null)}
      />
    );
  }

  // Winding horizontal offsets for nodes in the illustrated road
  const getOffsetClass = (idx: number) => {
    const mod = idx % 4;
    if (mod === 0) return 'sm:translate-x-0';
    if (mod === 1) return 'sm:translate-x-12 md:translate-x-20';
    if (mod === 2) return 'sm:translate-x-24 md:translate-x-36';
    return 'sm:translate-x-12 md:translate-x-16';
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-theme-raised via-theme-card to-theme-card p-6 rounded-2xl border border-theme-border shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-500 border border-amber-500/30">
              Interactive Path
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-orange-400">
              <Flame size={14} /> 5 Day Streak
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-theme-text">
            Chess Mastery Roadmap
          </h1>
          <p className="text-xs md:text-sm text-theme-muted mt-1">
            Recommended from your recent games: Master critical rook endgames.
          </p>
        </div>

        {/* XP & Progress Widget */}
        <div className="flex items-center gap-4 bg-theme-card p-3 rounded-xl border border-theme-border/60">
          <div className="flex items-center gap-2">
            <Award className="text-amber-500" size={24} />
            <div>
              <span className="text-[10px] uppercase font-bold text-theme-muted block">Total XP</span>
              <span className="text-lg font-black font-display text-theme-text">420 XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs: Openings, Middlegame, Endgame with Mobile Overflow Fix */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="w-full sm:w-auto overflow-x-auto no-scrollbar">
          <Segmented<'endgame' | 'openings' | 'middlegame'>
            value={activeCategory}
            onChange={(v) => {
              setActiveCategory(v);
              const nextStages = MOCK_LEARN_STAGES.filter((s) => s.category === v);
              setSelectedStage(nextStages.find((s) => s.status === 'current') || nextStages[0]);
            }}
            options={[
              { value: 'endgame', label: 'Endgame' },
              { value: 'openings', label: 'Openings' },
              { value: 'middlegame', label: 'Middlegame' },
            ]}
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-theme-muted">
          <span>{completedStages} of {stages.length} Completed</span>
          <span className="text-amber-500 font-bold font-mono">
            ({Math.round((completedStages / Math.max(1, stages.length)) * 100)}%)
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar value={completedStages} max={stages.length} height={6} />

      {/* Main 2-Column Section: Winding Path on Left, Detail & Suggested on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Illustrated Winding Path with Sunset Background */}
        <div className="lg:col-span-7 xl:col-span-8 rounded-2xl bg-gradient-to-b from-amber-600/20 via-orange-500/10 to-rose-950/25 border border-amber-500/30 p-5 md:p-8 relative overflow-hidden shadow-xl min-h-[560px]">
          {/* Sunset Atmosphere glow */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-rose-600/15 blur-3xl pointer-events-none" />

          {/* Path Header info */}
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-2">
              <Compass size={18} className="text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                Endgame Adventure Track
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-neutral-400">
              8 Stages Total
            </span>
          </div>

          {/* Serpentine Connector Line (SVG behind nodes) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 400 800"
            preserveAspectRatio="none"
          >
            <path
              d="M 120 70 Q 200 130 250 200 T 150 350 T 260 500 T 170 650 T 220 750"
              fill="none"
              stroke="rgba(245, 158, 11, 0.35)"
              strokeWidth="5"
              strokeDasharray="8 8"
            />
          </svg>

          {/* Roadmap Nodes */}
          <div className="relative z-10 space-y-6">
            {stages.map((stg, index) => {
              const isDone = stg.status === 'done';
              const isCurrent = stg.status === 'current';
              const isUnlocked = stg.status === 'unlocked';
              const isLocked = stg.status === 'locked';
              const isSelected = selectedStage?.id === stg.id;
              const offsetClass = getOffsetClass(index);

              return (
                <div
                  key={stg.id}
                  onClick={() => !isLocked && setSelectedStage(stg)}
                  className={`transition-all duration-300 transform ${offsetClass}`}
                >
                  <div
                    className={`inline-flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all select-none max-w-sm w-full ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/60 shadow-xl'
                        : isCurrent
                        ? 'bg-amber-500/15 border-amber-500/80 shadow-lg cursor-pointer'
                        : isDone
                        ? 'bg-theme-card/90 border-theme-border hover:border-amber-500/50 hover:bg-theme-raised/60 transition-colors duration-100 cursor-pointer shadow-md'
                        : isUnlocked
                        ? 'bg-theme-card/75 border-amber-500/40 hover:border-amber-500 hover:bg-theme-raised/60 transition-colors duration-100 cursor-pointer shadow-md'
                        : 'bg-theme-card/30 border-theme-border/30 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {/* Circle Node with State */}
                    <div className="relative flex-shrink-0">
                      {isCurrent && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500 text-black shadow-md flex items-center gap-1 animate-bounce">
                          <span>You are here</span>
                        </div>
                      )}
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-transform ${
                          isDone
                            ? 'bg-emerald-500 text-black border-2 border-emerald-400'
                            : isCurrent
                            ? 'bg-amber-500 text-black ring-4 ring-amber-500/40 shadow-amber-500/50 animate-pulse'
                            : isUnlocked
                            ? 'bg-amber-500/20 text-amber-500 border-2 border-amber-500/60'
                            : 'bg-theme-raised text-theme-muted border border-theme-border'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 size={20} />
                        ) : isCurrent ? (
                          <Play size={18} className="fill-black ml-0.5" />
                        ) : isUnlocked ? (
                          <Sparkles size={18} />
                        ) : (
                          <Lock size={16} />
                        )}
                      </div>
                    </div>

                    {/* Node Text & XP */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-theme-muted">
                          #{index + 1}
                        </span>
                        <h3 className="font-bold text-sm text-theme-text truncate">
                          {stg.title}
                        </h3>
                      </div>
                      <p className="text-xs text-theme-muted truncate mt-0.5">
                        {stg.description}
                      </p>
                    </div>

                    <span className="text-[11px] font-mono font-bold text-amber-500 bg-theme-raised px-2 py-0.5 rounded border border-theme-border flex-shrink-0">
                      +{stg.xp}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Stage Detail Card + Also Suggested Card */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-5 lg:sticky lg:top-6">
          {/* Stage Detail Card */}
          {selectedStage && (
            <Card className="p-6 border-amber-500/40 bg-gradient-to-br from-theme-raised via-theme-card to-theme-card space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-theme-border/60 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block">
                    {selectedStage.category} Path • Stage Details
                  </span>
                  <h2 className="text-xl font-bold font-display text-theme-text mt-0.5">
                    {selectedStage.title}
                  </h2>
                </div>
                <span className="text-xs font-bold font-mono px-2.5 py-1 rounded bg-amber-500/20 text-amber-500 border border-amber-500/40">
                  +{selectedStage.xp} XP
                </span>
              </div>

              <p className="text-xs md:text-sm text-theme-text/90 leading-relaxed">
                {selectedStage.description}
              </p>

              {/* 3 Step Types Breakdown */}
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-theme-card border border-theme-border flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-theme-text">Interactive Lesson</div>
                    <div className="text-[11px] text-theme-muted">
                      Step-by-step master walkthrough with visual board arrows
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-theme-card border border-theme-border flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Dumbbell size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-theme-text">Practice Positions</div>
                    <div className="text-[11px] text-theme-muted">
                      Solve the pattern live on the board with immediate feedback
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-theme-card border border-theme-border flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center flex-shrink-0">
                    <HelpCircle size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-theme-text">Mini Quiz Mastery</div>
                    <div className="text-[11px] text-theme-muted">
                      Certify retention under varied defender defenses
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<Play size={16} className="fill-black" />}
                  onClick={() => setActiveLessonStage(selectedStage)}
                >
                  Start lesson +{selectedStage.xp} XP
                </Button>
              </div>
            </Card>
          )}

          {/* Also Suggested Card */}
          <Card className="p-5 border-theme-border/80 bg-theme-raised/40 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <Sparkles size={14} /> Also suggested
              </span>
              <span className="text-xs font-mono font-bold text-neutral-400">+50 XP</span>
            </div>

            <div>
              <h4 className="font-bold font-display text-theme-text text-sm">
                Knight Endgames: Outposts &amp; Triangulation
              </h4>
              <p className="text-xs text-theme-muted mt-1 leading-relaxed">
                Based on your recent game vs PawnStorm22 where minor piece coordination swung the advantage on move 6.
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              fullWidth
              onClick={() => {
                const s3 = stages[2] || stages[0];
                setSelectedStage(s3);
              }}
            >
              Explore Stage
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LearnPath;
