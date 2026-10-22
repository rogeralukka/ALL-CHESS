import React, { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Toggle } from '@/components/Toggle';
import { Button } from '@/components/Button';
import { Segmented } from '@/components/Segmented';
import { Tabs } from '@/components/Tabs';
import { useSettingsStore, AppTheme, AnimationSpeed, CoordinateStyle, BackgroundStyle } from '@/data/settingsStore';
import { BOARD_THEMES, PIECE_SETS, BOARD_PRESETS } from '@/data/boardThemes';
import { storage } from '@/lib/storage';
import {
  Palette,
  Sliders,
  Sparkles,
  Link2,
  Key,
  Eye,
  EyeOff,
  Check,
  Save,
  RotateCcw,
  RefreshCw,
  CheckCircle,
  Shield,
  Layers,
} from 'lucide-react';

export const SettingsShell: React.FC = () => {
  const settings = useSettingsStore();

  const [activeTab, setActiveTab] = useState<'board' | 'gameplay' | 'coach' | 'appearance' | 'accounts' | 'byok'>('board');

  // Staged Board Settings (Nothing applies until Save)
  const [stagedBoardId, setStagedBoardId] = useState(settings.boardThemeId);
  const [stagedPieceId, setStagedPieceId] = useState(settings.pieceSetId);
  const [stagedBackground, setStagedBackground] = useState<BackgroundStyle>(settings.background);
  const [stagedSubTab, setStagedSubTab] = useState<'boards' | 'pieces' | 'background' | 'presets'>('boards');
  const [boardSavedToast, setBoardSavedToast] = useState(false);

  // Synchronize staged settings if external changes occur
  useEffect(() => {
    setStagedBoardId(settings.boardThemeId);
    setStagedPieceId(settings.pieceSetId);
    setStagedBackground(settings.background);
  }, [settings.boardThemeId, settings.pieceSetId, settings.background]);

  // BYOK State (persisted to localStorage `all_chess_byok`)
  interface ByokStorage {
    gemini?: string;
    groq?: string;
    openrouter?: string;
  }
  const [byok, setByok] = useState<ByokStorage>(() =>
    storage.get<ByokStorage>('all_chess_byok', {})
  );
  const [showKeys, setShowKeys] = useState<{ [k: string]: boolean }>({});
  const [byokSavedToast, setByokSavedToast] = useState(false);

  // Accounts Sync Mock State
  const [chesscomUser, setChesscomUser] = useState('PawnStorm22');
  const [lichessUser, setLichessUser] = useState('TacticsKnight');
  const [isSyncing, setIsSyncing] = useState(false);
  const [accountToast, setAccountToast] = useState<string | null>(null);

  // Active board object for 3x3 preview
  const previewTheme = BOARD_THEMES.find((t) => t.id === stagedBoardId) || BOARD_THEMES[0];
  const previewPiece = PIECE_SETS.find((p) => p.id === stagedPieceId) || PIECE_SETS[0];

  const handleSaveBoard = () => {
    settings.updateSettings({
      boardThemeId: stagedBoardId,
      pieceSetId: stagedPieceId,
      background: stagedBackground,
    });
    setBoardSavedToast(true);
    setTimeout(() => setBoardSavedToast(false), 3000);
  };

  const handleRevertBoard = () => {
    setStagedBoardId(settings.boardThemeId);
    setStagedPieceId(settings.pieceSetId);
    setStagedBackground(settings.background);
  };

  const handleSaveByok = () => {
    storage.set('all_chess_byok', byok);
    setByokSavedToast(true);
    setTimeout(() => setByokSavedToast(false), 3000);
  };

  const handleClearByok = () => {
    const empty = { gemini: '', groq: '', openrouter: '' };
    setByok(empty);
    storage.set('all_chess_byok', empty);
    setByokSavedToast(true);
    setTimeout(() => setByokSavedToast(false), 3000);
  };

  const handleMockSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setAccountToast('Successfully synced 12 games from linked accounts!');
      setTimeout(() => setAccountToast(null), 3500);
    }, 1000);
  };

  // 3x3 Preview Board pieces
  const previewPieces = [
    ['wR', 'wN', 'wB'],
    ['bP', '', 'wP'],
    ['bQ', 'bK', 'bR'],
  ];

  const tabItems = [
    { id: 'board', label: 'Board & Pieces', icon: <Palette size={16} /> },
    { id: 'gameplay', label: 'Gameplay', icon: <Sliders size={16} /> },
    { id: 'coach', label: 'Coach & Voice', icon: <Sparkles size={16} /> },
    { id: 'appearance', label: 'Appearance', icon: <Layers size={16} /> },
    { id: 'accounts', label: 'Linked Accounts', icon: <Link2 size={16} /> },
    { id: 'byok', label: 'AI Keys (BYOK)', icon: <Key size={16} /> },
  ];

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black font-display text-theme-text">Settings &amp; Preferences</h1>
        <p className="text-sm text-theme-muted mt-1">
          Customize themes, board cosmetics, coaching feedback depth, and local API keys.
        </p>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs
        tabs={tabItems}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as typeof activeTab)}
      />

      {/* TAB 1: BOARD & PIECES WITH 3x3 PREVIEW */}
      {activeTab === 'board' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column (8 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <Card className="p-5 space-y-4">
              {/* Sub-tabs: Boards / Pieces / Background / Presets */}
              <div className="flex border-b border-theme-border pb-2 gap-2 overflow-x-auto text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setStagedSubTab('boards')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    stagedSubTab === 'boards'
                      ? 'bg-amber-500/15 text-amber-500'
                      : 'text-theme-muted hover:text-theme-text'
                  }`}
                >
                  Boards (8)
                </button>
                <button
                  type="button"
                  onClick={() => setStagedSubTab('pieces')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    stagedSubTab === 'pieces'
                      ? 'bg-amber-500/15 text-amber-500'
                      : 'text-theme-muted hover:text-theme-text'
                  }`}
                >
                  Pieces
                </button>
                <button
                  type="button"
                  onClick={() => setStagedSubTab('background')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    stagedSubTab === 'background'
                      ? 'bg-amber-500/15 text-amber-500'
                      : 'text-theme-muted hover:text-theme-text'
                  }`}
                >
                  Background
                </button>
                <button
                  type="button"
                  onClick={() => setStagedSubTab('presets')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    stagedSubTab === 'presets'
                      ? 'bg-amber-500/15 text-amber-500'
                      : 'text-theme-muted hover:text-theme-text'
                  }`}
                >
                  Presets (6)
                </button>
              </div>

              {/* Sub-tab: Boards */}
              {stagedSubTab === 'boards' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  {BOARD_THEMES.map((theme) => {
                    const isSelected = stagedBoardId === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setStagedBoardId(theme.id)}
                        className={`relative p-2.5 rounded-xl border text-left transition-all group ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30'
                            : 'border-theme-border bg-theme-raised hover:bg-theme-card'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-500 text-black flex items-center justify-center">
                            <Check size={10} strokeWidth={3} />
                          </div>
                        )}
                        <div className="w-full aspect-[2/1] rounded-lg overflow-hidden flex border border-black/20 shadow-inner mb-2">
                          <div className="w-1/2 h-full" style={{ backgroundColor: theme.light }} />
                          <div className="w-1/2 h-full" style={{ backgroundColor: theme.dark }} />
                        </div>
                        <div className="text-xs font-bold text-theme-text truncate">{theme.name}</div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Sub-tab: Pieces */}
              {stagedSubTab === 'pieces' && (
                <div className="space-y-3 pt-1">
                  {PIECE_SETS.map((piece) => {
                    const isSelected = stagedPieceId === piece.id;
                    return (
                      <button
                        key={piece.id}
                        type="button"
                        onClick={() => setStagedPieceId(piece.id)}
                        className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30'
                            : 'border-theme-border bg-theme-raised hover:bg-theme-card'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={`${piece.basePath}/wN.svg`}
                            alt="Knight preview"
                            className="w-8 h-8"
                          />
                          <div>
                            <div className="text-sm font-bold text-theme-text">{piece.name}</div>
                            <div className="text-[11px] text-theme-muted">{piece.license}</div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Sub-tab: Background */}
              {stagedSubTab === 'background' && (
                <div className="grid grid-cols-3 gap-3 pt-1">
                  {(['standard', 'felt', 'wood'] as BackgroundStyle[]).map((bg) => {
                    const isSelected = stagedBackground === bg;
                    return (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => setStagedBackground(bg)}
                        className={`relative p-3 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30'
                            : 'border-theme-border bg-theme-raised hover:bg-theme-card'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-500 text-black flex items-center justify-center">
                            <Check size={10} strokeWidth={3} />
                          </div>
                        )}
                        <div className="text-xs font-bold uppercase tracking-wider text-theme-text capitalize">
                          {bg}
                        </div>
                        <div className="text-[10px] text-theme-muted mt-0.5">
                          {bg === 'standard' ? 'Pure Canvas' : bg === 'felt' ? 'Textured Felt' : 'Warm Grain'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Sub-tab: Presets */}
              {stagedSubTab === 'presets' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                  {BOARD_PRESETS.map((p) => {
                    const isSelected =
                      stagedBoardId === p.boardId &&
                      stagedPieceId === p.pieceId &&
                      stagedBackground === p.background;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setStagedBoardId(p.boardId);
                          setStagedPieceId(p.pieceId);
                          setStagedBackground(p.background);
                        }}
                        className={`relative p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30'
                            : 'border-theme-border bg-theme-raised hover:bg-theme-card'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-500 text-black flex items-center justify-center">
                            <Check size={10} strokeWidth={3} />
                          </div>
                        )}
                        <div className="text-xs font-bold text-theme-text truncate">{p.name}</div>
                        <div className="text-[10px] text-theme-muted mt-0.5 capitalize">
                          {p.boardId} • {p.background}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Unsaved Changes Action Row */}
              <div className="flex items-center justify-between pt-4 border-t border-theme-border">
                <span className="text-xs text-theme-muted">
                  Changes apply immediately to preview; click Save to persist.
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={<RotateCcw size={14} />}
                    onClick={handleRevertBoard}
                  >
                    Revert
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    icon={<Save size={14} />}
                    onClick={handleSaveBoard}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>

              {boardSavedToast && (
                <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle size={14} />
                  <span>Board preferences saved successfully!</span>
                </div>
              )}
            </Card>
          </div>

          {/* Live 3x3 Preview Column (5 cols) */}
          <div className="lg:col-span-5">
            <Card className="p-5 space-y-3 sticky top-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold font-display text-theme-text text-sm">Live 3x3 Preview</h3>
                <span className="text-xs font-mono text-amber-500 font-bold">{previewTheme.name}</span>
              </div>

              {/* 3x3 Chessboard */}
              <div
                className={`p-3 rounded-2xl shadow-xl border border-black/20 ${
                  stagedBackground === 'felt'
                    ? 'bg-emerald-950/40'
                    : stagedBackground === 'wood'
                    ? 'bg-amber-950/40'
                    : 'bg-theme-raised'
                }`}
              >
                <div className="aspect-square w-full rounded-xl overflow-hidden grid grid-cols-3 border border-black/20 shadow-md">
                  {previewPieces.map((row, rIdx) =>
                    row.map((pieceKey, cIdx) => {
                      const isDarkSquare = (rIdx + cIdx) % 2 === 1;
                      const squareColor = isDarkSquare ? previewTheme.dark : previewTheme.light;
                      return (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          className="relative flex items-center justify-center transition-colors duration-200"
                          style={{ backgroundColor: squareColor }}
                        >
                          {pieceKey && (
                            <img
                              src={`${previewPiece.basePath}/${pieceKey}.svg`}
                              alt={pieceKey}
                              className="w-4/5 h-4/5 drop-shadow-sm select-none pointer-events-none"
                            />
                          )}
                          {/* Inside Coordinates if enabled */}
                          {settings.coordinates === 'inside' && rIdx === 2 && (
                            <span
                              className="absolute bottom-0.5 right-1 text-[9px] font-bold select-none opacity-60"
                              style={{ color: isDarkSquare ? previewTheme.light : previewTheme.dark }}
                            >
                              {String.fromCharCode(97 + cIdx)}
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="text-center text-[11px] text-theme-muted">
                {previewTheme.name} board with {previewPiece.name} on {stagedBackground} canvas.
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: GAMEPLAY & ANALYSIS */}
      {activeTab === 'gameplay' && (
        <Card className="p-6 space-y-6">
          <div className="border-b border-theme-border pb-3">
            <h3 className="text-base font-bold font-display text-theme-text">Gameplay Rules &amp; Helpers</h3>
            <p className="text-xs text-theme-muted mt-0.5">Control move handling, promotions, and visual indicators</p>
          </div>

          <div className="space-y-4">
            <Toggle
              checked={settings.autoQueen}
              onChange={(v) => settings.updateSettings({ autoQueen: v })}
              label="Always Auto-Promote to Queen"
              description="Automatically select a queen upon pawn promotion without opening a dialog (hold Alt while moving to override)"
            />

            <Toggle
              checked={settings.showLegalMoves}
              onChange={(v) => settings.updateSettings({ showLegalMoves: v })}
              label="Display Legal Move Target Dots"
              description="Show subtle dots on valid destination squares when selecting a piece"
            />

            <Toggle
              checked={settings.soundEnabled}
              onChange={(v) => settings.updateSettings({ soundEnabled: v })}
              label="Play Board Sound Effects"
              description="Subtle acoustic clicks for moves, captures, checks, and game results"
            />

            {/* Coordinates Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
              <div>
                <div className="text-sm font-semibold text-theme-text">Board Coordinate Placement</div>
                <div className="text-xs text-theme-muted">Display rank and file labels inside edge squares or outside</div>
              </div>
              <Segmented<CoordinateStyle>
                value={settings.coordinates}
                onChange={(v) => settings.updateSettings({ coordinates: v })}
                options={[
                  { value: 'inside', label: 'Inside Squares' },
                  { value: 'outside', label: 'Outside Margins' },
                ]}
              />
            </div>

            {/* Analysis Depth Slider */}
            <div className="pt-4 border-t border-theme-border space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-semibold text-theme-text">Default Analysis Engine Depth</div>
                  <div className="text-xs text-theme-muted">Target depth for multi-pv engine evaluation (10 to 30 plies)</div>
                </div>
                <span className="font-mono text-base font-black text-amber-500">
                  {settings.engineDepth} Plies
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={30}
                step={2}
                value={settings.engineDepth}
                onChange={(e) => settings.updateSettings({ engineDepth: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-theme-muted font-mono">
                <span>Fast (10)</span>
                <span>Balanced (18)</span>
                <span>Deep Search (30)</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 3: COACH & AI SPEECH */}
      {activeTab === 'coach' && (
        <Card className="p-6 space-y-6">
          <div className="border-b border-theme-border pb-3">
            <h3 className="text-base font-bold font-display text-theme-text">Coach Interactions &amp; Audio</h3>
            <p className="text-xs text-theme-muted mt-0.5">Customize your interactive coach's persona and voice output</p>
          </div>

          <div className="space-y-4">
            <Toggle
              checked={settings.coachEnabled}
              onChange={(v) => settings.updateSettings({ coachEnabled: v })}
              label="Enable Coach Avatar &amp; Bubbles"
              description="Render facial expressions and typewriter commentary during game reviews and matches"
            />

            <Toggle
              checked={settings.coachVoiceEnabled}
              onChange={(v) => settings.updateSettings({ coachVoiceEnabled: v })}
              label="Read Speech Aloud (Voice Output)"
              description="Uses browser speech synthesis to announce coach lines aloud"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
              <div>
                <div className="text-sm font-semibold text-theme-text">Commentary Granularity</div>
                <div className="text-xs text-theme-muted">Frequency of coach intervention during games and reviews</div>
              </div>
              <Segmented<'verbose' | 'standard' | 'minimal'>
                value="standard"
                onChange={() => {}}
                options={[
                  { value: 'verbose', label: 'Verbose' },
                  { value: 'standard', label: 'Standard' },
                  { value: 'minimal', label: 'Minimal' },
                ]}
              />
            </div>
          </div>
        </Card>
      )}

      {/* TAB 4: APPEARANCE & THEME */}
      {activeTab === 'appearance' && (
        <Card className="p-6 space-y-6">
          <div className="border-b border-theme-border pb-3">
            <h3 className="text-base font-bold font-display text-theme-text">Interface Appearance &amp; Motion</h3>
            <p className="text-xs text-theme-muted mt-0.5">Dual-theme palette and transition speeds</p>
          </div>

          <div className="space-y-6">
            {/* Theme Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-theme-text">Application Theme</div>
                <div className="text-xs text-theme-muted">Choose between Duskboard (Dark) and Dawnboard (Light)</div>
              </div>
              <Segmented<AppTheme>
                value={settings.appTheme}
                onChange={(t) => settings.setAppTheme(t)}
                options={[
                  { value: 'dusk', label: 'Dusk (Dark)' },
                  { value: 'dawn', label: 'Dawn (Light)' },
                  { value: 'system', label: 'System' },
                ]}
              />
            </div>

            {/* Animation Speed Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-theme-border">
              <div>
                <div className="text-sm font-semibold text-theme-text">Piece Motion Speed</div>
                <div className="text-xs text-theme-muted">Sliding piece animation duration scale</div>
              </div>
              <Segmented<AnimationSpeed>
                value={settings.animationSpeed}
                onChange={(s) => settings.updateSettings({ animationSpeed: s })}
                options={[
                  { value: 'off', label: 'Instant' },
                  { value: 'fast', label: '100ms' },
                  { value: 'medium', label: '200ms' },
                  { value: 'slow', label: '400ms' },
                ]}
              />
            </div>

            <div className="p-3.5 rounded-xl bg-theme-raised border border-theme-border text-xs text-theme-muted flex items-start gap-2.5">
              <Shield size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Accessibility Note:</strong> When your device enables{' '}
                <code>prefers-reduced-motion</code>, all sliding animations, particle rays, and typewriter delays
                are automatically bypassed instantly.
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 5: LINKED ACCOUNTS (MOCK) */}
      {activeTab === 'accounts' && (
        <Card className="p-6 space-y-6">
          <div className="border-b border-theme-border pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-display text-theme-text">Connected Chess Platforms</h3>
              <p className="text-xs text-theme-muted mt-0.5">Simulate game ingestion from public profiles (fictional usernames only)</p>
            </div>
            <Button
              size="sm"
              variant="primary"
              icon={<RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />}
              onClick={handleMockSync}
              disabled={isSyncing}
            >
              {isSyncing ? 'Syncing...' : 'Sync Games Now'}
            </Button>
          </div>

          {accountToast && (
            <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-semibold flex items-center gap-2">
              <CheckCircle size={16} />
              <span>{accountToast}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Chess.com */}
            <div className="p-4 rounded-xl bg-theme-raised border border-theme-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-sm text-theme-text">Chess.com Integration (Mock)</div>
                <span className="text-xs bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded font-bold">
                  Connected
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chesscomUser}
                  onChange={(e) => setChesscomUser(e.target.value)}
                  placeholder="Fictional username..."
                  className="flex-1 px-3 py-2 bg-theme-card border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none focus:border-amber-500 font-mono"
                />
                <Button size="sm" variant="secondary">Update</Button>
              </div>
            </div>

            {/* Lichess */}
            <div className="p-4 rounded-xl bg-theme-raised border border-theme-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-sm text-theme-text">Lichess.org Integration (Mock)</div>
                <span className="text-xs bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded font-bold">
                  Connected
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={lichessUser}
                  onChange={(e) => setLichessUser(e.target.value)}
                  placeholder="Fictional username..."
                  className="flex-1 px-3 py-2 bg-theme-card border border-theme-border rounded-lg text-xs text-theme-text focus:outline-none focus:border-amber-500 font-mono"
                />
                <Button size="sm" variant="secondary">Update</Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 6: BRING-YOUR-OWN-KEY (BYOK) AI SEAM */}
      {activeTab === 'byok' && (
        <Card className="p-6 space-y-6">
          <div className="border-b border-theme-border pb-3">
            <h3 className="text-base font-bold font-display text-theme-text">
              Bring Your Own Key (BYOK) — AI Seam
            </h3>
            <p className="text-xs text-theme-muted mt-0.5">
              Phase 1 / Phase 3 architectural seam for autonomous LLM coaching
            </p>
          </div>

          {/* Privacy Reassurance Banner */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-theme-text space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-500">
              <Shield size={16} />
              <span>100% Client-Side Privacy Guarantee</span>
            </div>
            <p className="text-theme-muted leading-relaxed">
              Phase 1 uses zero secrets. When entering API keys for future Phase 3 autonomy, keys are stored
              strictly in your browser’s local storage (<code>localStorage.all_chess_byok</code>). They never
              touch any ALL-CHESS server or cloud infrastructure.
            </p>
          </div>

          <div className="space-y-4">
            {/* Gemini API Key */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-theme-text">Google Gemini API Key</label>
              <div className="relative">
                <input
                  type={showKeys.gemini ? 'text' : 'password'}
                  value={byok.gemini || ''}
                  onChange={(e) => setByok((prev) => ({ ...prev, gemini: e.target.value }))}
                  placeholder="AIzaSy..."
                  className="w-full pl-3 pr-10 py-2.5 bg-theme-raised border border-theme-border rounded-lg text-xs text-theme-text font-mono focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowKeys((prev) => ({ ...prev, gemini: !prev.gemini }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-text"
                >
                  {showKeys.gemini ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Groq API Key */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-theme-text">Groq Cloud API Key</label>
              <div className="relative">
                <input
                  type={showKeys.groq ? 'text' : 'password'}
                  value={byok.groq || ''}
                  onChange={(e) => setByok((prev) => ({ ...prev, groq: e.target.value }))}
                  placeholder="gsk_..."
                  className="w-full pl-3 pr-10 py-2.5 bg-theme-raised border border-theme-border rounded-lg text-xs text-theme-text font-mono focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowKeys((prev) => ({ ...prev, groq: !prev.groq }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-text"
                >
                  {showKeys.groq ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* OpenRouter API Key */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-theme-text">OpenRouter API Key</label>
              <div className="relative">
                <input
                  type={showKeys.openrouter ? 'text' : 'password'}
                  value={byok.openrouter || ''}
                  onChange={(e) => setByok((prev) => ({ ...prev, openrouter: e.target.value }))}
                  placeholder="sk-or-v1-..."
                  className="w-full pl-3 pr-10 py-2.5 bg-theme-raised border border-theme-border rounded-lg text-xs text-theme-text font-mono focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowKeys((prev) => ({ ...prev, openrouter: !prev.openrouter }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-text"
                >
                  {showKeys.openrouter ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-theme-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearByok}
              >
                Clear All Keys
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Save size={14} />}
                onClick={handleSaveByok}
              >
                Save Local Keys
              </Button>
            </div>

            {byokSavedToast && (
              <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle size={14} />
                <span>Local API keys saved in browser localStorage!</span>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
export default SettingsShell;
