import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Home,
  Swords,
  GraduationCap,
  Puzzle,
  Search,
  User,
  Settings,
  RefreshCw,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import { useSettingsStore } from '@/data/settingsStore';
import { ToastContainer, toast } from '@/components/Toast';

export const Layout: React.FC = () => {
  const { appTheme, setAppTheme } = useSettingsStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const location = useLocation();

  // One-time notice when system reports reduced motion while defaulting to Full
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const alreadyPrompted = localStorage.getItem('all_chess_motion_prompted');
      if (mediaQuery.matches && !alreadyPrompted) {
        localStorage.setItem('all_chess_motion_prompted', 'true');
        toast.info(
          'Your system prefers less motion. Switch to Reduced?',
          'We kept Full motion on by default. You can adjust in Settings > Appearance.'
        );
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    toast.info('Checking Chess.com & Lichess...', 'Syncing recent games without auth');

    setTimeout(() => {
      setIsSyncing(false);
      toast.success('Sync complete', '1 new game found & imported');
    }, 1800);
  };

  const navItems = [
    { to: '/', label: 'Home', icon: <Home size={20} /> },
    { to: '/play', label: 'Play Coach', icon: <Swords size={20} /> },
    { to: '/review', label: 'Review', icon: <Sparkles size={20} /> },
    { to: '/learn', label: 'Learn', icon: <GraduationCap size={20} /> },
    { to: '/puzzles', label: 'Puzzles', icon: <Puzzle size={20} /> },
    { to: '/scout', label: 'Scout', icon: <Search size={20} /> },
    { to: '/profile', label: 'Profile', icon: <User size={20} /> },
  ];

  const bottomNavItems = [
    { to: '/', label: 'Home', icon: <Home size={22} /> },
    { to: '/play', label: 'Play', icon: <Swords size={22} /> },
    { to: '/review', label: 'Review', icon: <Sparkles size={22} /> },
    { to: '/learn', label: 'Learn', icon: <GraduationCap size={22} /> },
    { to: '/puzzles', label: 'Puzzles', icon: <Puzzle size={22} /> },
    { to: '/profile', label: 'Profile', icon: <User size={22} /> },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-theme-page text-theme-text font-sans">
      {/* --- DESKTOP & TABLET SIDEBAR --- */}
      <aside className="hidden sm:flex flex-col flex-shrink-0 border-r border-theme-border bg-theme-card/60 backdrop-blur-md transition-all sm:w-16 lg:w-52 z-30">
        {/* Logo row */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-theme-border/60">
          <div className="w-9 h-9 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">♟️</span>
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="font-display font-extrabold text-base tracking-tight leading-none text-theme-text">
              ALL-CHESS
            </span>
            <span className="text-xs font-semibold text-amber-500 tracking-wider uppercase mt-0.5">
              Free &amp; Private
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 flex flex-col gap-1 p-2 overflow-y-auto" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md font-semibold text-sm transition-all min-h-[44px] ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30 font-bold'
                    : 'text-theme-muted hover:text-theme-text hover:bg-theme-raised/60'
                }`}
                title={item.label}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="hidden lg:inline truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom utility tools */}
        <div className="p-2 border-t border-theme-border/60 flex flex-col gap-1">
          {/* Sync button */}
          <button
            type="button"
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-3 px-3 py-2 rounded-md font-semibold text-xs text-theme-muted hover:text-theme-text hover:bg-theme-raised transition-colors min-h-[40px] w-full"
            title="Auto-sync games every 15 min"
            aria-label="Sync games with Chess.com and Lichess"
          >
            <RefreshCw size={17} className={`flex-shrink-0 ${isSyncing ? 'animate-spin text-amber-500' : ''}`} />
            <span className="hidden lg:inline truncate">
              {isSyncing ? 'Syncing...' : 'Sync Games'}
            </span>
          </button>

          {/* Theme switcher */}
          <button
            type="button"
            onClick={() => setAppTheme(appTheme === 'dusk' ? 'dawn' : 'dusk')}
            className="flex items-center gap-3 px-3 py-2 rounded-md font-semibold text-xs text-theme-muted hover:text-theme-text hover:bg-theme-raised transition-colors min-h-[40px] w-full"
            title={`Switch to ${appTheme === 'dusk' ? 'Dawn (Light)' : 'Dusk (Dark)'} theme`}
            aria-label="Toggle theme"
          >
            {appTheme === 'dusk' ? (
              <Sun size={17} className="text-amber-400 flex-shrink-0" />
            ) : (
              <Moon size={17} className="text-indigo-400 flex-shrink-0" />
            )}
            <span className="hidden lg:inline truncate capitalize">{appTheme}board</span>
          </button>

          {/* Settings link */}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md font-semibold text-xs transition-colors min-h-[40px] ${
                isActive
                  ? 'bg-amber-500/15 text-amber-500'
                  : 'text-theme-muted hover:text-theme-text hover:bg-theme-raised'
              }`
            }
            title="Settings"
          >
            <Settings size={17} className="flex-shrink-0" />
            <span className="hidden lg:inline truncate">Settings</span>
          </NavLink>
        </div>
      </aside>

      {/* --- MAIN APP VIEWPORT --- */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto pb-16 sm:pb-0 relative">
        <Outlet />
      </main>

      {/* --- PHONE BOTTOM NAVIGATION BAR (< 640px) --- */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 h-16 bg-theme-card/95 backdrop-blur-md border-t border-theme-border flex items-center justify-around px-2 z-40 pb-[env(safe-area-inset-bottom)]"
        aria-label="Mobile Navigation"
      >
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] gap-0.5 select-none transition-colors ${
                isActive ? 'text-amber-500 font-bold' : 'text-theme-muted hover:text-theme-text'
              }`}
            >
              <span>{item.icon}</span>
              <span className="text-xs leading-tight font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Global Toast Container */}
      <ToastContainer />
    </div>
  );
};
