import React from 'react';
import { Card } from '@/components/Card';
import { Toggle } from '@/components/Toggle';
import { Button } from '@/components/Button';
import { useSettingsStore } from '@/data/settingsStore';
import { BOARD_THEMES } from '@/data/boardThemes';

export const SettingsShell: React.FC = () => {
  const {
    appTheme,
    setAppTheme,
    boardThemeId,
    updateSettings,
    autoQueen,
    coachEnabled,
    coachVoiceEnabled,
    showLegalMoves,
    soundEnabled,
  } = useSettingsStore();

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold font-display text-theme-text">Settings &amp; Preferences</h1>
      <p className="text-sm text-theme-muted">Customize your boards, coach interactions, and analysis parameters.</p>

      {/* Appearance */}
      <Card className="space-y-4">
        <h3 className="font-bold text-theme-text border-b border-theme-border pb-2">Appearance &amp; Themes</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm text-theme-text">Interface Theme</div>
            <div className="text-xs text-theme-muted">Choose between Duskboard and Dawnboard</div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={appTheme === 'dusk' ? 'primary' : 'secondary'}
              onClick={() => setAppTheme('dusk')}
            >
              Dusk (Dark)
            </Button>
            <Button
              size="sm"
              variant={appTheme === 'dawn' ? 'primary' : 'secondary'}
              onClick={() => setAppTheme('dawn')}
            >
              Dawn (Light)
            </Button>
          </div>
        </div>

        <div className="pt-2">
          <div className="font-semibold text-sm text-theme-text mb-2">Chess Board Palette</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {BOARD_THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => updateSettings({ boardThemeId: theme.id })}
                className={`flex items-center gap-2 p-2 rounded border text-xs font-semibold ${
                  boardThemeId === theme.id
                    ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                    : 'border-theme-border bg-theme-raised text-theme-text'
                }`}
              >
                <div className="w-5 h-5 rounded flex overflow-hidden border border-black/20 flex-shrink-0">
                  <div className="w-1/2 h-full" style={{ backgroundColor: theme.light }} />
                  <div className="w-1/2 h-full" style={{ backgroundColor: theme.dark }} />
                </div>
                <span className="truncate">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Gameplay */}
      <Card className="space-y-4">
        <h3 className="font-bold text-theme-text border-b border-theme-border pb-2">Gameplay</h3>
        <Toggle
          checked={autoQueen}
          onChange={(v) => updateSettings({ autoQueen: v })}
          label="Always Promote to Queen"
          description="Automatically promote pawns to queens without prompting (hold Alt to override)"
        />
        <Toggle
          checked={showLegalMoves}
          onChange={(v) => updateSettings({ showLegalMoves: v })}
          label="Show Legal Move Dots"
          description="Highlight valid destination squares when selecting a piece"
        />
        <Toggle
          checked={soundEnabled}
          onChange={(v) => updateSettings({ soundEnabled: v })}
          label="Sound Effects"
          description="Play subtle piece move sounds"
        />
      </Card>

      {/* Coach & AI */}
      <Card className="space-y-4">
        <h3 className="font-bold text-theme-text border-b border-theme-border pb-2">Coach &amp; Speech</h3>
        <Toggle
          checked={coachEnabled}
          onChange={(v) => updateSettings({ coachEnabled: v })}
          label="Enable Coach Feedback"
          description="Show expressions and speech bubbles during reviews and coaching games"
        />
        <Toggle
          checked={coachVoiceEnabled}
          onChange={(v) => updateSettings({ coachVoiceEnabled: v })}
          label="Read Speech Aloud (Voice)"
          description="Uses browser speech synthesis for interactive voice feedback"
        />
      </Card>
    </div>
  );
};
export default SettingsShell;
