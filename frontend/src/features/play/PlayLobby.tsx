import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Toggle } from '@/components/Toggle';
import { Segmented } from '@/components/Segmented';
import { CoachAvatar } from '@/features/coach/CoachAvatar';
import { CoachBubble } from '@/features/coach/CoachBubble';
import { Swords, ChevronDown, ChevronUp, Zap, Shield, Sparkles } from 'lucide-react';

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
}

export const PlayLobby: React.FC<PlayLobbyProps> = ({ onStartGame }) => {
  const [selectedLevel, setSelectedLevel] = useState<number>(800);
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
    <div className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full space-y-6">
      {/* Top Banner with Coach Portrait + Welcome Bubble */}
      <Card className="flex flex-col sm:flex-row items-center gap-5 p-5 bg-gradient-to-r from-theme-raised via-theme-card to-theme-card border-amber-500/20 shadow-md">
        <CoachAvatar expression="wave" mode="bust" size={84} />
        <div className="flex-1 min-w-0">
          <CoachBubble
            messages={[
              {
                id: 'lobby-welcome',
                text: "Hey! Ready for a coaching game? I'll observe your moves, point out tactical tricks, and help you improve as we play.",
              },
            ]}
          />
        </div>
      </Card>

      {/* Level Selection Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold font-display uppercase tracking-wider text-theme-muted">
            Choose Difficulty Level
          </h2>
          <button
            type="button"
            onClick={() => setShowAllLevels(!showAllLevels)}
            className="text-xs font-semibold text-amber-500 hover:underline flex items-center gap-1"
          >
            <span>{showAllLevels ? 'Show presets' : 'Show all ratings (400-2000)'}</span>
            {showAllLevels ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {!showAllLevels ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {levelPresets.map((lvl) => {
              const isSelected = selectedLevel === lvl.rating;
              return (
                <button
                  key={lvl.rating}
                  type="button"
                  onClick={() => setSelectedLevel(lvl.rating)}
                  className={`p-4 rounded-lg border text-left transition-all relative select-none flex flex-col justify-between h-28 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 shadow-md ring-1 ring-amber-500'
                      : 'bg-theme-card border-theme-border hover:bg-theme-raised/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-base text-theme-text flex items-center gap-2">
                      <span className={isSelected ? 'text-amber-500' : 'text-theme-muted'}>
                        {lvl.icon}
                      </span>
                      {lvl.name}
                    </span>
                    <span className="text-xs font-mono font-bold bg-theme-raised px-2 py-0.5 rounded">
                      {lvl.rating}
                    </span>
                  </div>
                  <p className="text-xs text-theme-muted leading-snug">{lvl.desc}</p>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
            {allRatings.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedLevel(r)}
                className={`py-3 rounded-md border text-center font-mono font-bold text-xs transition-all ${
                  selectedLevel === r
                    ? 'bg-amber-500 text-black border-amber-500 shadow'
                    : 'bg-theme-card border-theme-border text-theme-text hover:bg-theme-raised'
                }`}
              >
                {r}
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
            { value: 'white', label: 'White (First move)' },
            { value: 'random', label: 'Random Color' },
            { value: 'black', label: 'Black' },
          ]}
        />
      </Card>

      {/* Assistant & Coaching Toggles */}
      <Card className="p-4 space-y-3">
        <h3 className="text-xs font-bold font-display uppercase tracking-wider text-theme-muted mb-2">
          Coaching Assistance Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Toggle
            checked={coachComments}
            onChange={setCoachComments}
            label="Coach Speech Feedback"
            description="Real-time speech bubbles reacting to both sides' moves"
          />
          <Toggle
            checked={showHints}
            onChange={setShowHints}
            label="Allow In-Game Hints"
            description="Highlighted hint button available whenever you need guidance"
          />
          <Toggle
            checked={allowTakebacks}
            onChange={setAllowTakebacks}
            label="Allow Take-backs"
            description="Rewind accidental slips or tactical blunders"
          />
          <Toggle
            checked={evalBar}
            onChange={setEvalBar}
            label="Evaluation Bar"
            description="Display live advantage balance alongside the board"
          />
          <Toggle
            checked={threatArrows}
            onChange={setThreatArrows}
            label="Threat Arrows"
            description="Highlight dangerous opponent skewers and discovered checks"
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
            description="Show Best, Great, or Mistake badges after moves"
          />
        </div>
      </Card>

      {/* Primary Play Button */}
      <div className="pt-2">
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
