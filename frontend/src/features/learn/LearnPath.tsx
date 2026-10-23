import React, { useState } from 'react';
import { MOCK_LEARN_STAGES } from '@/data/mock/mockLearn';
import { LessonStage } from '@/data/types';
import { LessonPlayer } from './LessonPlayer';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Segmented } from '@/components/Segmented';
import { ProgressBar } from '@/components/ProgressBar';
import { toast } from '@/components/Toast';
import { IsoLevelMap } from '@/features/map/IsoLevelMap';
import { PageContainer, PageHeader } from '@/components/PageHeader';
import { Pill } from '@/components/Bits';
import {
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
  const currentIdxRaw = stages.findIndex((s) => s.status === 'current');
  const currentIndex = currentIdxRaw >= 0 ? currentIdxRaw : completedStages;
  const lastOpen = stages.reduce((acc, s, i) => (s.status !== 'locked' ? i : acc), currentIndex);
  const unlockedUpTo = Math.max(currentIndex, lastOpen);
  const selectedIndex = selectedStage ? stages.findIndex((s) => s.id === selectedStage.id) : null;
  const isPhone = typeof window !== 'undefined' && window.innerWidth < 640;

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
    <PageContainer wide>
      <PageHeader
        title="Learn"
        icon="/assets/ui/icon_learn.webp"
        subtitle="Your roadmap, built from your own games. This week: master the critical rook endgames."
        eyebrow={
          <>
            <Pill tone="amber">
              <Flame size={12} /> 5 day streak
            </Pill>
            <Pill>
              <Award size={12} /> 420 XP
            </Pill>
          </>
        }
      />

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
        {/* Left Column: the stage map */}
        <div className="lg:col-span-7 xl:col-span-8 rounded-2xl overflow-hidden border border-theme-border shadow-xl relative bg-[#5f9f45]">
          <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-5 py-3 bg-gradient-to-b from-black/60 via-black/25 to-transparent pointer-events-none">
            <div className="flex items-center gap-2">
              <Compass size={18} className="text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-white drop-shadow">
                {activeCategory} adventure
              </span>
            </div>
            <span className="text-xs font-bold text-white/85 drop-shadow">{stages.length} stages</span>
          </div>
          <IsoLevelMap
            key={activeCategory}
            levelCount={stages.length}
            currentIndex={currentIndex}
            unlockedUpTo={unlockedUpTo}
            showLockIcons
            labels={stages.map((s, i) => `${i + 1}. ${s.title}  +${s.xp} XP`)}
            selectedIndex={selectedIndex}
            onSelect={(i) => setSelectedStage(stages[i])}
            tileWidth={isPhone ? 84 : 104}
            seed={activeCategory === 'endgame' ? 7 : activeCategory === 'openings' ? 19 : 31}
            maxHeight={isPhone ? 520 : 640}
          />
        </div>

        {/* Right Column: Stage Detail Card + Also Suggested Card */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-5 lg:sticky lg:top-6">
          {/* Stage Detail Card */}
          {selectedStage && (
            <Card className="p-6 border-amber-500/40 bg-gradient-to-br from-theme-raised via-theme-card to-theme-card space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-theme-border/60 pb-3">
                <div>
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block">
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
                    <div className="text-xs text-theme-muted">
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
                    <div className="text-xs text-theme-muted">
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
                    <div className="text-xs text-theme-muted">
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
    </PageContainer>
  );
};

export default LearnPath;
