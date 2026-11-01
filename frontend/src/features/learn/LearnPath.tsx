import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MOCK_LEARN_STAGES } from '@/data/mock/mockLearn';
import { LessonStage } from '@/data/types';
import { LessonPlayer } from './LessonPlayer';
import { Button } from '@/components/Button';
import { toast } from '@/components/Toast';
import { CoachSpeech } from '@/features/coach/CoachSpeech';
import { Board } from '@/features/board/Board';
import { usePhoneLayout } from '@/lib/useMediaQuery';
import { useSettingsStore } from '@/data/settingsStore';
import { BOARD_THEMES, PIECE_SETS } from '@/data/boardThemes';
import { Award, Check, ListChecks, Lock, X } from 'lucide-react';
import { LearnMap } from './LearnMap';
import { SECTION_ORDER, SECTION_THEMES, SectionId, linearProgress } from './learnLayout';

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export const LearnPath: React.FC = () => {
  const phone = usePhoneLayout();
  const { boardThemeId, pieceSetId, animationSpeed, coordinates } = useSettingsStore();
  const boardTheme = BOARD_THEMES.find((t) => t.id === boardThemeId) || BOARD_THEMES[0];
  const pieceSet = PIECE_SETS.find((p) => p.id === pieceSetId) || PIECE_SETS[0];

  // every lesson, in path order (bottom to top)
  const ordered = useMemo(() => linearProgress(SECTION_ORDER.flatMap((c) => MOCK_LEARN_STAGES.filter((s) => s.category === c))), []);
  const next = useMemo(() => ordered.find((s) => s.status === 'current') ?? ordered[ordered.length - 1], [ordered]);

  const [selected, setSelected] = useState<LessonStage>(next);
  const [activeLesson, setActiveLesson] = useState<LessonStage | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [section, setSection] = useState<SectionId>(next.category);

  const theme = SECTION_THEMES[section];
  const selectedRow = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (listOpen && typeof selectedRow.current?.scrollIntoView === 'function') selectedRow.current.scrollIntoView({ block: 'center' });
  }, [listOpen]);
  const totalXp = MOCK_LEARN_STAGES.filter((s) => s.status === 'done').reduce((n, s) => n + s.xp, 0);

  const handleComplete = () => {
    toast.achievement('Stage Completed!', `+${activeLesson?.xp || 50} XP earned`);
    setActiveLesson(null);
  };

  if (activeLesson) {
    return <LessonPlayer stage={activeLesson} onComplete={handleComplete} onExit={() => setActiveLesson(null)} />;
  }

  const blurb = selected.description.split(/(?<=[.!?])\s/)[0];

  const panel = (
    <div className="flex flex-col h-full w-full min-h-0 overflow-hidden lg:rounded-[5px]" style={{ background: theme.bar, transition: 'background-color .3s' }} data-testid={phone ? 'learn-mobile' : 'learn-panel'}>
      <div className="relative flex items-center justify-center h-[60px] lg:h-[72px] px-3 flex-shrink-0" style={{ background: 'radial-gradient(120% 140% at 50% 0%, #34312d 0%, #262421 70%)' }}>
        <h1 className="flex items-center gap-2.5 font-display font-extrabold text-[26px] lg:text-[30px] leading-none" style={{ color: 'var(--color-text-strong)' }}>
          <img src="/assets/ui/icon_learn.webp" alt="" className="w-9 h-9 object-contain" />
          Learn
        </h1>
        <span className="absolute right-4 inline-flex items-center gap-1.5 font-display font-extrabold text-[16px] text-theme-text">
          <Award size={18} className="text-[var(--color-orange)]" />
          {totalXp} XP
        </span>
      </div>

      <div className="relative flex-1 min-h-0">
        <LearnMap compact={!phone} stages={ordered} selectedId={selected.id} currentId={next.id} onSelect={setSelected} onSectionChange={setSection} />

        {/* the coach, over the top of the map */}
        <div className="absolute top-0 inset-x-0 z-10 px-2 pt-2 pb-6 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(36,35,32,0.92), rgba(36,35,32,0))' }}>
          <CoachSpeech expression="neutral" size={64} text={blurb} className="w-full" />
        </div>

        {listOpen && (
          <div className="absolute inset-0 z-20 flex flex-col justify-end bg-black/55" onClick={() => setListOpen(false)} data-testid="learn-sheet">
            <div className="rounded-t-2xl max-h-[82%] overflow-y-auto pb-3" style={{ background: 'var(--side-panel-bg)' }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-4 pt-4 pb-2 sticky top-0 z-10" style={{ background: 'var(--side-panel-bg)' }}>
                <span className="font-display font-extrabold text-[20px]">Lessons</span>
                <button type="button" onClick={() => setListOpen(false)} aria-label="Close" className="w-9 h-9 flex items-center justify-center text-theme-muted">
                  <X size={20} />
                </button>
              </div>
              {[...SECTION_ORDER].reverse().map((sec) => {
                const th = SECTION_THEMES[sec];
                const list = ordered.filter((s) => s.category === sec);
                const done = list.filter((s) => s.status === 'done').length;
                return (
                  <div key={sec} className="mb-2">
                    <div className="flex items-center justify-between px-4 h-10 text-[13px] font-extrabold uppercase tracking-wide" style={{ background: `rgba(${th.cell},0.35)` }}>
                      <span>{th.name}</span>
                      <span className="text-theme-muted normal-case tracking-normal">{done}/{list.length}</span>
                    </div>
                    <ul>
                      {list.map((s, i) => (
                        <li key={s.id}>
                          <button
                            ref={selected.id === s.id ? selectedRow : undefined}
                            type="button"
                            onClick={() => {
                              setSelected(s);
                              setListOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 h-14 text-left ${selected.id === s.id ? 'bg-white/[0.07]' : ''}`}
                          >
                            <span
                              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[14px] font-extrabold ${s.status === 'done' ? 'bg-[#81b64c] text-white' : s.status === 'locked' ? 'text-theme-muted' : 'text-white'}`}
                              style={s.status === 'locked' ? { background: 'var(--tile-bg)' } : s.status === 'done' ? undefined : { background: th.hotSide }}
                            >
                              {s.status === 'done' ? <Check size={16} strokeWidth={3} /> : s.status === 'locked' ? <Lock size={14} /> : i + 1}
                            </span>
                            <span className={`flex-1 min-w-0 truncate text-[16px] font-semibold ${s.status === 'locked' ? 'text-theme-muted' : 'text-theme-text'}`}>{s.title}</span>
                            <span className="text-[13px] text-theme-muted tabular-nums">+{s.xp}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 flex items-center gap-3 px-3 py-3" style={{ background: theme.bar, transition: 'background-color .3s' }}>
        <button
          type="button"
          onClick={() => setListOpen(true)}
          aria-label="All lessons"
          data-testid="learn-list"
          className="w-14 h-14 rounded-[8px] flex items-center justify-center text-theme-text flex-shrink-0 active:opacity-70"
          style={{ background: theme.barBtn }}
        >
          <ListChecks size={24} />
        </button>
        <Button
          variant="primary"
          size="lg"
          className="!h-14 flex-1 !text-[22px] !font-extrabold font-display"
          onClick={() => setActiveLesson(selected)}
          disabled={selected.status === 'locked'}
          data-testid="next-lesson"
        >
          {selected.status === 'done' ? 'Review Lesson' : 'Next Lesson'}
        </Button>
      </div>
    </div>
  );

  if (phone) return <div className="h-full w-full flex flex-col overflow-hidden">{panel}</div>;

  // Desktop, as on Chess.com: the lesson's board on the left, the path panel on the right
  const first = selected.steps[0];
  return (
    <div className="flex h-full w-full overflow-hidden items-center justify-center gap-6 px-6 py-4">
      <div className="flex-1 min-w-0 flex items-center justify-center max-w-[calc(100vh-32px)]">
        <div className="w-full aspect-square" data-testid="learn-board">
          <Board
            fen={first?.fen || START_FEN}
            orientation="white"
            boardTheme={boardTheme}
            pieceSet={pieceSet}
            animationSpeed={animationSpeed}
            coordinates={coordinates}
            arrows={first?.arrows ?? []}
            highlights={first?.highlightSquares ?? []}
            interactive={false}
          />
        </div>
      </div>
      <div className="w-[420px] xl:w-[450px] flex-shrink-0 h-[calc(100vh-32px)] rounded-[5px] overflow-hidden">{panel}</div>
    </div>
  );
};

export default LearnPath;
