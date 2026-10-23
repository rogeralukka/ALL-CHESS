import React, { useState, useMemo } from 'react';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Toggle } from '@/components/Toggle';
import { Segmented } from '@/components/Segmented';
import { ProgressBar } from '@/components/ProgressBar';
import { Card } from '@/components/Card';
import { Modal } from '@/components/Modal';
import { toast } from '@/components/Toast';
import { ClassificationBadge } from '@/components/ClassificationBadge';
import { CoachAvatar } from '@/features/coach/CoachAvatar';
import { CoachBubble, BubbleMessage } from '@/features/coach/CoachBubble';
import { Board } from '@/features/board/Board';
import { EvalBar } from '@/features/board/EvalBar';
import { EvalGraph } from '@/features/board/EvalGraph';
import { MoveList } from '@/features/board/MoveList';
import { useSettingsStore } from '@/data/settingsStore';
import { BOARD_THEMES, PIECE_SETS } from '@/data/boardThemes';
import { MoveClassification, CoachExpression } from '@/data/types';
import { MOCK_GAMES } from '@/data/mock/mockGames';

const ALL_CLASSIFICATIONS: MoveClassification[] = [
  'brilliant',
  'great',
  'book',
  'best',
  'excellent',
  'good',
  'inaccuracy',
  'mistake',
  'miss',
  'blunder',
];

const ALL_EXPRESSIONS: CoachExpression[] = [
  'neutral',
  'thinking',
  'thumbsup',
  'brilliant',
  'embarrassed',
  'wave',
];

export const Playground: React.FC = () => {
  const { appTheme, setAppTheme } = useSettingsStore();
  const [selectedExp, setSelectedExp] = useState<CoachExpression>('wave');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toggleVal, setToggleVal] = useState(true);
  const [segmentVal, setSegmentVal] = useState<'overview' | 'analysis'>('overview');
  const [currentMoveIdx, setCurrentMoveIdx] = useState(10);
  const [boardThemeIdx, setBoardThemeIdx] = useState(0);

  const sampleGame = MOCK_GAMES[0];
  const currentMove = sampleGame.moves[currentMoveIdx] || sampleGame.moves[0];

  const playgroundLastMove = useMemo(() => ({
    from: currentMove?.from || 'e2',
    to: currentMove?.to || 'e4',
    classification: currentMove?.classification,
  }), [currentMove?.from, currentMove?.to, currentMove?.classification]);

  const playgroundBadges = useMemo(() => {
    return currentMove?.classification
      ? [{ square: currentMove.to, label: currentMove.classification }]
      : [];
  }, [currentMove?.to, currentMove?.classification]);

  const bubbleMessages: BubbleMessage[] = [
    {
      id: 'm1',
      text: 'Welcome to the ALL-CHESS Design System & Component Studio!',
      classification: 'book',
      moveSan: '1. e4',
      evalText: '+0.2',
      evalScore: 0.2,
    },
    {
      id: 'm2',
      text: 'Every component, token, and coach expression is fully responsive across Dusk and Dawn themes.',
      classification: 'brilliant',
      moveSan: '6. Bxf7+?!',
      evalText: '-1.4',
      evalScore: -1.4,
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-theme-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-500 uppercase">
              Dev Route
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold font-display text-theme-text">
              Component &amp; Token Playground
            </h1>
          </div>
          <p className="text-sm text-theme-muted mt-1">
            Testing all primitives, move badges, board features, and coach expressions.
          </p>
        </div>

        {/* Theme Switcher in header */}
        <div className="flex items-center gap-3">
          <Button
            variant={appTheme === 'dusk' ? 'primary' : 'secondary'}
            onClick={() => setAppTheme('dusk')}
            size="sm"
          >
            Duskboard (Dark)
          </Button>
          <Button
            variant={appTheme === 'dawn' ? 'primary' : 'secondary'}
            onClick={() => setAppTheme('dawn')}
            size="sm"
          >
            Dawnboard (Light)
          </Button>
        </div>
      </div>

      {/* --- SECTION 1: MOVE CLASSIFICATIONS --- */}
      <Card>
        <h2 className="text-lg font-bold font-display text-theme-text mb-4">
          1. Move Classifications &amp; Glyphs (Section 3.3)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {ALL_CLASSIFICATIONS.map((cls) => (
            <div
              key={cls}
              className="flex items-center gap-3 p-3 bg-theme-raised/60 rounded-md border border-theme-border/50"
            >
              <ClassificationBadge classification={cls} size="md" />
              <div className="flex flex-col">
                <span className="text-xs font-bold capitalize text-theme-text">{cls}</span>
                <span className="text-[10px] text-theme-muted">Custom SVG badge</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* --- SECTION 2: COACH AVATARS & EXPRESSIONS --- */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-display text-theme-text">
            2. Authentic Coach Character (6 Expressions)
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {ALL_EXPRESSIONS.map((exp) => (
              <Button
                key={exp}
                size="sm"
                variant={selectedExp === exp ? 'primary' : 'secondary'}
                onClick={() => setSelectedExp(exp)}
              >
                {exp}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Bust Crop 96px */}
          <div className="flex flex-col items-center p-4 bg-theme-raised/40 rounded-lg border border-theme-border">
            <span className="text-xs font-semibold text-theme-muted mb-3">Bust Crop (96px, in bubbles)</span>
            <CoachAvatar expression={selectedExp} mode="bust" size={96} />
            <span className="text-xs font-bold text-amber-500 mt-2 capitalize">{selectedExp}</span>
          </div>

          {/* Full Body View */}
          <div className="flex flex-col items-center p-4 bg-theme-raised/40 rounded-lg border border-theme-border">
            <span className="text-xs font-semibold text-theme-muted mb-3">Full Body Artwork</span>
            <CoachAvatar expression={selectedExp} mode="full" size={180} />
            <span className="text-xs font-bold text-amber-500 mt-2 capitalize">{selectedExp} (Full)</span>
          </div>

          {/* Coach Bubble Stack */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-theme-muted mb-1">Stacked Speech Bubbles (Typewriter)</span>
            <CoachBubble messages={bubbleMessages} voiceEnabled={false} />
          </div>
        </div>
      </Card>

      {/* --- SECTION 3: BOARD, EVAL BAR & GRAPH --- */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-display text-theme-text">
            3. Interactive Board &amp; Analysis
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-theme-muted font-semibold">Theme:</span>
            <select
              value={boardThemeIdx}
              onChange={(e) => setBoardThemeIdx(Number(e.target.value))}
              className="bg-theme-raised border border-theme-border text-xs rounded px-2 py-1 text-theme-text"
            >
              {BOARD_THEMES.map((bt, i) => (
                <option key={bt.id} value={i}>
                  {bt.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Eval Bar + Board */}
          <div className="lg:col-span-8 flex gap-3 items-center justify-center">
            <EvalBar evalScore={currentMove?.eval?.eval} />
            <div className="flex-1 max-w-[500px]">
              <Board
                fen={currentMove?.fen || sampleGame.moves[0].fen}
                boardTheme={BOARD_THEMES[boardThemeIdx]}
                pieceSet={PIECE_SETS[0]}
                lastMove={playgroundLastMove}
                badges={playgroundBadges}
                interactive={true}
              />
            </div>
          </div>

          {/* Right: Eval Graph + MoveList */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-theme-raised/60 p-3 rounded-lg border border-theme-border">
              <span className="text-xs font-bold text-theme-muted mb-2 block">Interactive Eval Graph</span>
              <EvalGraph
                moves={sampleGame.moves}
                currentMoveIndex={currentMoveIdx}
                onSeek={setCurrentMoveIdx}
                height={85}
              />
            </div>

            <div className="bg-theme-raised/60 p-3 rounded-lg border border-theme-border">
              <span className="text-xs font-bold text-theme-muted mb-2 block">Move List with Figurines</span>
              <MoveList
                moves={sampleGame.moves}
                currentMoveIndex={currentMoveIdx}
                onSelectMove={setCurrentMoveIdx}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* --- SECTION 4: UI PRIMITIVES --- */}
      <Card>
        <h2 className="text-lg font-bold font-display text-theme-text mb-4">
          4. UI Primitives &amp; Controls
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Buttons */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-theme-muted">Button Variants (48px / 40px)</span>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" size="md">
                Primary Amber
              </Button>
              <Button variant="secondary" size="md">
                Secondary
              </Button>
              <Button variant="danger" size="md">
                Danger
              </Button>
              <Button variant="ghost" size="md">
                Ghost
              </Button>
            </div>
          </div>

          {/* Toggles & Segmented */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-theme-muted">Toggles &amp; Segmented</span>
            <Toggle
              checked={toggleVal}
              onChange={setToggleVal}
              label="Coach Assistance"
              description="Provide real-time advice during play"
            />
            <Segmented
              value={segmentVal}
              onChange={(v) => setSegmentVal(v as 'overview' | 'analysis')}
              options={[
                { value: 'overview', label: 'Overview' },
                { value: 'analysis', label: 'Deep Analysis' },
              ]}
            />
          </div>

          {/* Chips & Toasts & Progress */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-theme-muted">Chips, Progress &amp; Toasts</span>
            <div className="flex flex-wrap gap-1.5">
              <Chip variant="accent">Rapid 905</Chip>
              <Chip variant="success">86% Accuracy</Chip>
              <Chip variant="danger">-1.6 Blunders</Chip>
            </div>
            <ProgressBar value={72} showLabel />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => toast.achievement('Level Complete!', '+100 XP awarded')}
              >
                Trigger Toast
              </Button>
              <Button size="sm" onClick={() => setIsModalOpen(true)}>
                Open Modal
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Demo Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Sample Modal Dialog">
        <p className="text-sm text-theme-muted mb-4">
          This accessible modal traps focus, closes on escape, and fades smoothly with standard motion tokens.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setIsModalOpen(false)}>
            Confirm
          </Button>
        </div>
      </Modal>
    </div>
  );
};
