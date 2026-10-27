import { rankFor } from '@/lib/rank';
import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Toggle } from '@/components/Toggle';
import { Segmented } from '@/components/Segmented';
import { CoachSpeech } from '@/features/coach/CoachSpeech';
import { Swords, ChevronDown, ChevronUp, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { MAX_LEVEL } from '@/services/stockfishPlayService';

const LEVELS: Array<{ rating: number; name: string; desc: string }> = [
  { rating: 400, name: 'Beginner', desc: 'Learning how the pieces move; leaves pieces hanging.' },
  { rating: 600, name: 'Casual', desc: 'Friendly sparring, gentle development.' },
  { rating: 800, name: 'Novice', desc: 'Knows the basics but misses simple tactics.' },
  { rating: 1000, name: 'Balanced', desc: 'Solid fundamentals and center control.' },
  { rating: 1200, name: 'Club Player', desc: 'Spots one-move threats and develops sensibly.' },
  { rating: 1400, name: 'Improver', desc: 'Plays real plans and punishes loose pieces.' },
  { rating: 1600, name: 'Challenging', desc: 'Sharp tactics and punished inaccuracies.' },
  { rating: 1800, name: 'Advanced', desc: 'Strong tactics and sound endgame technique.' },
  { rating: 2000, name: 'Expert', desc: 'Rarely drops material; converts small edges.' },
  { rating: 2200, name: 'Candidate Master', desc: 'Deep calculation and precise positional play.' },
  { rating: 2400, name: 'Master', desc: 'Very few mistakes; wins on technique.' },
  { rating: 2600, name: 'International Master', desc: 'Relentless accuracy under pressure.' },
  { rating: 2800, name: 'Grandmaster', desc: 'Elite-level play; you will be tested every move.' },
  { rating: 3000, name: 'Super Grandmaster', desc: 'Beyond any human champion.' },
  { rating: MAX_LEVEL, name: 'Stockfish Max', desc: 'Full-strength Stockfish. Good luck.' },
];

export interface PlayConfig {
  levelRating: number;
  levelName: string;
  userColor: 'white' | 'random' | 'black';
  coachComments: boolean;
  showHints: boolean;
  allowTakebacks: boolean;
  evalBar: boolean;
  threatArrows: boolean;
  suggestionArrows: boolean;
  moveFeedback: boolean;
}

interface PlayLobbyProps {
  onStartGame: (config: PlayConfig) => void;
  selectedLevel?: number;
  onLevelChange?: (level: number) => void;
}

export const PlayLobby: React.FC<PlayLobbyProps> = ({
  onStartGame,
  selectedLevel: controlledLevel,
  onLevelChange,
}) => {
  const [internalLevel, setInternalLevel] = useState<number>(800);
  const selectedLevel = controlledLevel ?? internalLevel;
  const setSelectedLevel = (lvl: number) => {
    setInternalLevel(lvl);
    onLevelChange?.(lvl);
  };

  const [userColor, setUserColor] = useState<'white' | 'random' | 'black'>('white');
  const [showOptions, setShowOptions] = useState(false);

  // Coaching Assistance Toggles
  const [coachComments, setCoachComments] = useState(true);
  const [showHints, setShowHints] = useState(true);
  const [allowTakebacks, setAllowTakebacks] = useState(true);
  const [evalBar, setEvalBar] = useState(true);
  const [threatArrows, setThreatArrows] = useState(true);
  const [suggestionArrows, setSuggestionArrows] = useState(true);
  const [moveFeedback, setMoveFeedback] = useState(true);

  const selected = LEVELS.find((l) => l.rating === selectedLevel) ?? LEVELS[2];

  const handleStart = () => {
    const levelName = selected.name;
    onStartGame({
      levelRating: selectedLevel,
      levelName,
      userColor,
      coachComments,
      showHints,
      allowTakebacks,
      evalBar,
      threatArrows,
      suggestionArrows,
      moveFeedback,
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Banner with Coach Portrait + Welcome Bubble */}
      <CoachSpeech
        expression="wave"
        size={80}
        text="Hey! Ready for a coaching game? I'll watch your moves, point out tactics, and help you improve as we play."
      />

      {/* Level selection: every level in one place */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-bold font-display uppercase tracking-wider text-theme-muted">
          Difficulty Level
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2" role="radiogroup" aria-label="Difficulty level">
          {LEVELS.map((lvl) => {
            const isSelected = lvl.rating === selectedLevel;
            return (
              <button
                key={lvl.rating}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedLevel(lvl.rating)}
                className={`py-2 rounded-[10px] border-2 flex flex-col items-center gap-1 transition-all active:translate-y-[2px] ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 shadow-[0_3px_0_#a85f00]'
                    : 'bg-theme-card border-theme-border shadow-[0_3px_0_var(--panel-lip)] hover:border-amber-500/40'
                }`}
              >
                <img
                  src={rankFor(lvl.rating).tier.icon}
                  alt=""
                  className="w-8 h-8 object-contain"
                  style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,.35))' }}
                />
                <span className="font-display font-black text-[13px] tabular-nums text-theme-text">
                  {lvl.rating >= MAX_LEVEL ? 'Max' : lvl.rating}
                </span>
              </button>
            );
          })}
        </div>
        <div className="well flex items-center gap-3 px-3 py-2.5 !rounded-[10px]">
          <CheckCircle2 size={16} className="text-amber-500 flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-display font-black text-[15px] text-theme-text">
              {selected.name}
              {selected.rating < MAX_LEVEL && (
                <span className="ml-2 text-xs tabular-nums text-theme-muted">≈ {selected.rating}</span>
              )}
            </div>
            <p className="text-xs text-theme-muted leading-snug">{selected.desc}</p>
          </div>
        </div>
      </div>

      {/* Play As Color */}
      <Card className="p-4 space-y-2">
        <h3 className="text-xs font-bold font-display uppercase tracking-wider text-theme-muted">
          Play As Color
        </h3>
        <Segmented<'white' | 'random' | 'black'>
          value={userColor}
          onChange={(v) => setUserColor(v)}
          options={[
            { value: 'white', label: 'White' },
            { value: 'random', label: 'Random' },
            { value: 'black', label: 'Black' },
          ]}
        />
      </Card>

      {/* Collapsed Options Section (Chess.com Play Bots style) */}
      <div className="rounded-lg border border-theme-border bg-theme-card overflow-hidden">
        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className="w-full flex items-center justify-between p-3.5 hover:bg-theme-raised/60 text-theme-text transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-amber-500" />
            <span className="text-xs font-bold font-display uppercase tracking-wider">
              Options & Assistance
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-theme-muted font-medium">
            <span>{showOptions ? 'Hide' : 'Customise'}</span>
            {showOptions ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
        </button>

        {showOptions && (
          <div className="p-4 pt-1 space-y-3 border-t border-theme-border/50">
            <div className="grid grid-cols-1 gap-3">
              <Toggle
                checked={coachComments}
                onChange={setCoachComments}
                label="Coach Speech Feedback"
                description="Real-time speech bubbles reacting to moves"
              />
              <Toggle
                checked={showHints}
                onChange={setShowHints}
                label="Allow In-Game Hints"
                description="Visual hint button when guidance is needed"
              />
              <Toggle
                checked={allowTakebacks}
                onChange={setAllowTakebacks}
                label="Allow Take-backs"
                description="Rewind accidental slips or blunders"
              />
              <Toggle
                checked={evalBar}
                onChange={setEvalBar}
                label="Evaluation Bar"
                description="Display live advantage balance"
              />
              <Toggle
                checked={threatArrows}
                onChange={setThreatArrows}
                label="Threat Arrows"
                description="Highlight dangerous opponent skewers & checks"
              />
              <Toggle
                checked={suggestionArrows}
                onChange={setSuggestionArrows}
                label="Suggestion Arrows"
                description="Visual tactical guide arrows"
              />
              <Toggle
                checked={moveFeedback}
                onChange={setMoveFeedback}
                label="Move Classification Badges"
                description="Show Best, Great, or Mistake badges"
              />
            </div>
          </div>
        )}
      </div>

      {/* Primary Play Button - Pinned at the bottom of the panel (48px tall) */}
      <div className="sticky bottom-0 bg-theme-card/95 backdrop-blur-sm pt-2 pb-1 border-t border-theme-border/50 z-10">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          className="!h-12 text-sm font-bold shadow-lg"
          icon={<Swords size={20} />}
          onClick={handleStart}
        >
          Start Coaching Match
        </Button>
      </div>
    </div>
  );
};
export default PlayLobby;
