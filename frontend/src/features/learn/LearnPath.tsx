import React, { useState } from 'react';
import { MOCK_LEARN_STAGES } from '@/data/mock/mockLearn';
import { LessonStage } from '@/data/types';
import { LessonPlayer } from './LessonPlayer';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Segmented } from '@/components/Segmented';
import { ProgressBar } from '@/components/ProgressBar';
import { toast } from '@/components/Toast';
import { CheckCircle2, Lock, Play, Flame, Award, Sparkles, BookOpen } from 'lucide-react';

export const LearnPath: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'endgame' | 'openings' | 'middlegame'>('endgame');
  const [selectedStage, setSelectedStage] = useState<LessonStage | null>(null);
  const [activeLessonStage, setActiveLessonStage] = useState<LessonStage | null>(null);

  const stages = MOCK_LEARN_STAGES.filter((s) => s.category === activeCategory);
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

  return (
    <div className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-theme-raised via-theme-card to-theme-card p-6 rounded-lg border border-theme-border shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-500 border border-amber-500/30">
              Interactive Path
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-orange-400">
              <Flame size={14} /> 4 Day Streak
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-theme-text">
            Chess Mastery Roadmap
          </h1>
          <p className="text-xs md:text-sm text-theme-muted mt-1">
            Suggested from your last 40 games: Master critical rook endgames.
          </p>
        </div>

        {/* XP & Progress Widget */}
        <div className="flex items-center gap-4 bg-theme-card p-3 rounded-md border border-theme-border/60">
          <div className="flex items-center gap-2">
            <Award className="text-amber-500" size={24} />
            <div>
              <span className="text-[10px] uppercase font-bold text-theme-muted block">Total XP</span>
              <span className="text-lg font-black font-display text-theme-text">420 XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs: Openings, Middlegame, Endgame */}
      <div className="flex items-center justify-between">
        <Segmented<'endgame' | 'openings' | 'middlegame'>
          value={activeCategory}
          onChange={(v) => {
            setActiveCategory(v);
            setSelectedStage(null);
          }}
          options={[
            { value: 'endgame', label: 'Endgame Path (8 Stages)' },
            { value: 'openings', label: 'Openings' },
            { value: 'middlegame', label: 'Middlegame' },
          ]}
        />
        <span className="text-xs font-semibold text-theme-muted">
          {completedStages} / {stages.length} Completed
        </span>
      </div>

      {/* Progress Bar */}
      <ProgressBar value={completedStages} max={stages.length} height={6} />

      {/* Vertical Roadmap Node Path */}
      <div className="relative py-4 space-y-4">
        {stages.map((stg, index) => {
          const isDone = stg.status === 'done';
          const isCurrent = stg.status === 'current';
          const isLocked = stg.status === 'locked';

          return (
            <div
              key={stg.id}
              onClick={() => !isLocked && setSelectedStage(stg)}
              className={`p-4 rounded-lg border transition-all flex items-center justify-between gap-4 select-none ${
                isCurrent
                  ? 'bg-amber-500/10 border-amber-500 shadow-md ring-1 ring-amber-500/60 cursor-pointer'
                  : isDone
                  ? 'bg-theme-card border-theme-border hover:bg-theme-raised/50 cursor-pointer'
                  : 'bg-theme-card/40 border-theme-border/40 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Node Status Indicator */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold ${
                    isDone
                      ? 'bg-emerald-500 text-black shadow'
                      : isCurrent
                      ? 'bg-amber-500 text-black shadow-lg animate-pulse'
                      : 'bg-theme-raised text-theme-muted border border-theme-border'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 size={20} />
                  ) : isCurrent ? (
                    <Play size={18} className="fill-black" />
                  ) : (
                    <Lock size={16} />
                  )}
                </div>

                {/* Title & Description */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-theme-muted">
                      #{index + 1}
                    </span>
                    <h3 className="font-bold text-sm md:text-base text-theme-text truncate">
                      {stg.title}
                    </h3>
                    {isCurrent && (
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-black uppercase">
                        You Are Here
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-theme-muted truncate mt-0.5">{stg.description}</p>
                </div>
              </div>

              {/* Action / XP badge */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-mono font-bold text-amber-500 bg-theme-raised px-2 py-1 rounded border border-theme-border">
                  +{stg.xp} XP
                </span>
                {!isLocked && (
                  <Button
                    size="sm"
                    variant={isCurrent ? 'primary' : 'secondary'}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLessonStage(stg);
                    }}
                  >
                    {isDone ? 'Review' : 'Start'}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Stage Detail Drawer / Card */}
      {selectedStage && (
        <Card className="p-5 border-amber-500/40 bg-gradient-to-br from-theme-raised to-theme-card space-y-4">
          <div className="flex items-center justify-between border-b border-theme-border/60 pb-3">
            <div>
              <span className="text-xs font-bold text-amber-500 uppercase tracking-wide">
                Stage Details
              </span>
              <h2 className="text-xl font-bold font-display text-theme-text">{selectedStage.title}</h2>
            </div>
            <span className="text-xs font-bold font-mono px-2 py-1 rounded bg-amber-500/20 text-amber-500">
              +{selectedStage.xp} XP
            </span>
          </div>

          <p className="text-sm text-theme-text leading-relaxed">{selectedStage.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-md bg-theme-card border border-theme-border flex items-center gap-2">
              <BookOpen size={16} className="text-amber-500" />
              <span>1 Interactive Lesson</span>
            </div>
            <div className="p-3 rounded-md bg-theme-card border border-theme-border flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-500" />
              <span>3 Practice Positions</span>
            </div>
            <div className="p-3 rounded-md bg-theme-card border border-theme-border flex items-center gap-2">
              <Award size={16} className="text-sky-500" />
              <span>Mini Quiz Mastery</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setSelectedStage(null)}>
              Dismiss
            </Button>
            <Button
              variant="primary"
              onClick={() => setActiveLessonStage(selectedStage)}
            >
              Start Lesson (+{selectedStage.xp} XP)
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
export default LearnPath;
