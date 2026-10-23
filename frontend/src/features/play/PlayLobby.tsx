import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Toggle } from '@/components/Toggle';
import { Segmented } from '@/components/Segmented';
import { CoachAvatar } from '@/features/coach/CoachAvatar';
import { CoachBubble } from '@/features/coach/CoachBubble';
import { Swords, ChevronDown, ChevronUp, Zap, Shield, Sparkles, CheckCircle2 } from 'lucide-react';

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
  const [showAllLevels, setShowAllLevels] = useState(false);

  // Coaching Assistance Toggles
  const [coachComments, setCoachComments] = useState(true);
  const [showHints, setShowHints] = useState(true);
  const [allowTakebacks, setAllowTakebacks] = useState(true);
  const [evalBar, setEvalBar] = useState(true);
  const [threatArrows, setThreatArrows] = useState(true);
  const [suggestionArrows, setSuggestionArrows] = useState(true);
  const [moveFeedback, setMoveFeedback] = useState(true);

  const levelPresets = [
    { rating: 600, name: 'Casual', desc: 'Friendly sparring, gentle development', icon: <Shield size={16} /> },
    { rating: 1000, name: 'Balanced', desc: 'Solid fundamentals and center control', icon: <Sparkles size={16} /> },
    { rating: 1500, name: 'Challenging', desc: 'Sharp tactics and punished inaccuracies', icon: <Zap size={16} /> },
  ];

  const allRatings = [400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000];

  const handleStart = () => {
    const levelName =
      levelPresets.find((p) => p.rating === selectedLevel)?.name || `Rated ${selectedLevel}`;
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
      <Card className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gradient-to-r from-theme-raised via-theme-card to-theme-card border-amber-500/20 shadow-md">
        <CoachAvatar expression="wave" mode="bust" size={68} />
        <div className="flex-1 min-w-0">
          <CoachBubble text="Hey! Ready for a coaching game? I'll observe your moves, point out tactical tricks, and help you improve as we play." />
        </div>
      </Card>

      {/* Level Selection Cards */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold font-display uppercase tracking-wider text-theme-muted">
            Difficulty Level
          </h2>
          <button
            type="button"
            onClick={() => setShowAllLevels(!showAllLevels)}
            className="text-xs font-semibold text-amber-500 hover:underline flex items-center gap-1"
          >
            <span>{showAllLevels ? 'Presets' : 'All (400-2000)'}</span>
            {showAllLevels ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {!showAllLevels ? (
          <div className="grid grid-cols-1 gap-2.5">
            {levelPresets.map((lvl) => {
              const isSelected = selectedLevel === lvl.rating;
              return (
                <button
                  key={lvl.rating}
                  type="button"
                  onClick={() => setSelectedLevel(lvl.rating)}
                  className={`p-3 rounded-lg text-left transition-all relative select-none flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500/15 border-2 border-amber-500 ring-2 ring-amber-500/40 shadow-md'
                      : 'bg-theme-card border border-theme-border hover:bg-theme-raised/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-theme-text flex items-center gap-2">
                      <span className={isSelected ? 'text-amber-500' : 'text-theme-muted'}>
                        {lvl.icon}
                      </span>
                      {lvl.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono tabular-nums font-bold bg-theme-raised px-2 py-0.5 rounded">
                        {lvl.rating}
                      </span>
                      {isSelected && (
                        <CheckCircle2 size={16} className="text-amber-500 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-theme-muted leading-snug">{lvl.desc}</p>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {allRatings.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedLevel(r)}
                className={`py-2 px-1 rounded-md border text-center font-mono tabular-nums font-bold text-xs transition-all flex items-center justify-center gap-1 ${
                  selectedLevel === r
                    ? 'bg-amber-500 text-black border-2 border-amber-400 shadow ring-2 ring-amber-500/40'
                    : 'bg-theme-card border-theme-border text-theme-text hover:bg-theme-raised'
                }`}
              >
                <span>{r}</span>
                {selectedLevel === r && <CheckCircle2 size={12} className="stroke-[3]" />}
              </button>
            ))}
          </div>
        )}
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

      {/* Assistant & Coaching Toggles */}
      <Card className="p-4 space-y-3">
        <h3 className="text-xs font-bold font-display uppercase tracking-wider text-theme-muted mb-1">
          Coaching Assistance
        </h3>
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
      </Card>

      {/* Primary Play Button */}
      <div className="pt-1">
        <Button
          variant="primary"
          size="lg"
          fullWidth
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
