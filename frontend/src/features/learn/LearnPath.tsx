import React, { useState } from 'react';
import { MOCK_LEARN_STAGES } from '@/data/mock/mockLearn';
import { LessonStage } from '@/data/types';
import { LessonPlayer } from './LessonPlayer';
import { Button } from '@/components/Button';
import { toast } from '@/components/Toast';
import { IsoLevelMap } from '@/features/map/IsoLevelMap';
import { PageContainer } from '@/components/PageHeader';
import { PageTitle, SectionCard } from '@/components/ListUI';
import { Play, Check, Lock, Award, BookOpen, Crown, Swords } from 'lucide-react';

type Category = 'openings' | 'middlegame' | 'endgame';

const CATEGORIES: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: 'openings', label: 'Openings', icon: <BookOpen size={26} className="text-[#81b64c]" /> },
  { id: 'middlegame', label: 'Middlegame', icon: <Swords size={26} className="text-[#81b64c]" /> },
  { id: 'endgame', label: 'Endgames', icon: <Crown size={26} className="text-[#81b64c]" /> },
];

export const LearnPath: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('endgame');
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
  const totalXp = MOCK_LEARN_STAGES.filter((s) => s.status === 'done').reduce((n, s) => n + s.xp, 0);

  const pickCategory = (c: Category) => {
    setActiveCategory(c);
    const next = MOCK_LEARN_STAGES.filter((s) => s.category === c);
    setSelectedStage(next.find((s) => s.status === 'current') || next[0]);
  };

  const handleLessonComplete = () => {
    toast.achievement('Stage Completed!', `+${activeLessonStage?.xp || 50} XP earned`);
    setActiveLessonStage(null);
  };

  if (activeLessonStage) {
    return <LessonPlayer stage={activeLessonStage} onComplete={handleLessonComplete} onExit={() => setActiveLessonStage(null)} />;
  }

  return (
    <PageContainer wide>
      <PageTitle
        title="Learn"
        icon="/assets/ui/icon_learn.webp"
        right={
          <span className="inline-flex items-center gap-2 h-10 px-4 rounded-[5px] font-display font-extrabold text-[18px] text-theme-text" style={{ background: 'var(--tile-bg)' }}>
            <Award size={20} className="text-[var(--color-orange)]" />
            {totalXp} XP
          </span>
        }
      />

      {/* Category tiles, each with its own progress */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="tablist" aria-label="Lesson categories">
        {CATEGORIES.map((c) => {
          const list = MOCK_LEARN_STAGES.filter((s) => s.category === c.id);
          const done = list.filter((s) => s.status === 'done').length;
          const active = c.id === activeCategory;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => pickCategory(c.id)}
              className={`cc-card text-left px-5 py-4 flex items-center gap-4 transition-colors border-2 ${active ? 'border-[#81b64c]' : 'border-transparent hover:bg-white/[0.04]'}`}
            >
              <span className="w-12 h-12 rounded-[5px] flex items-center justify-center flex-shrink-0" style={{ background: 'var(--tile-bg)' }}>{c.icon}</span>
              <span className="flex-1 min-w-0">
                <span className="block font-display font-extrabold text-[20px] text-theme-text">{c.label}</span>
                <span className="block text-[13px] text-theme-muted mt-0.5">{done} of {list.length} lessons</span>
                <span className="block h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: 'var(--graph-dark)' }}>
                  <span className="block h-full rounded-full bg-[var(--color-orange)]" style={{ width: `${(done / Math.max(1, list.length)) * 100}%` }} />
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* The stage map */}
        <div className="lg:col-span-7 xl:col-span-8 rounded-[5px] overflow-hidden relative bg-[#5f9f45] shadow-[0_3px_0_rgba(0,0,0,0.2)]">
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

        {/* Right rail: the chosen lesson, then the lesson list */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4 lg:sticky lg:top-6">
          {selectedStage && (
            <section className="cc-card overflow-hidden" data-testid="stage-detail">
              <div className="px-5 pt-4 pb-1 text-[12px] font-bold uppercase tracking-wide text-theme-muted">
                {selectedStage.status === 'current' ? 'Next lesson' : 'Lesson'}
              </div>
              <div className="px-5 pb-4">
                <h2 className="font-display font-extrabold text-[24px] leading-7 text-theme-text">{selectedStage.title}</h2>
                <p className="text-[15px] text-theme-muted leading-relaxed mt-2">{selectedStage.description}</p>
                <div className="flex items-center gap-3 mt-3 text-[13px] text-theme-muted">
                  <span>{selectedStage.steps.length} steps</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-bold text-[var(--color-orange)]">+{selectedStage.xp} XP</span>
                </div>
              </div>
              <div className="p-4" style={{ background: 'var(--side-header-bg)' }}>
                <Button
                  variant="primary"
                  size="lg"
                  className="!h-14 w-full !text-[22px] !font-extrabold font-display"
                  icon={<Play size={20} className="fill-current" />}
                  onClick={() => setActiveLessonStage(selectedStage)}
                  disabled={selectedStage.status === 'locked'}
                >
                  {selectedStage.status === 'done' ? 'Review lesson' : 'Start lesson'}
                </Button>
              </div>
            </section>
          )}

          <SectionCard title={`${CATEGORIES.find((c) => c.id === activeCategory)?.label} lessons`} right={<span className="text-[13px] text-theme-muted">{completedStages}/{stages.length}</span>}>
            <ul>
              {stages.map((s, i) => {
                const selected = selectedStage?.id === s.id;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedStage(s)}
                      className={`w-full flex items-center gap-3 px-5 h-14 text-left transition-colors ${selected ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'}`}
                    >
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[14px] font-extrabold ${
                          s.status === 'done' ? 'bg-[#81b64c] text-white' : s.status === 'locked' ? 'text-theme-muted' : 'bg-[var(--color-orange)] text-white'
                        }`}
                        style={s.status === 'locked' ? { background: 'var(--tile-bg)' } : undefined}
                      >
                        {s.status === 'done' ? <Check size={16} strokeWidth={3} /> : s.status === 'locked' ? <Lock size={14} /> : i + 1}
                      </span>
                      <span className={`flex-1 min-w-0 truncate text-[16px] font-semibold ${s.status === 'locked' ? 'text-theme-muted' : 'text-theme-text'}`}>{s.title}</span>
                      <span className="text-[13px] text-theme-muted tabular-nums">+{s.xp}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </SectionCard>
        </div>
      </div>
    </PageContainer>
  );
};

export default LearnPath;
