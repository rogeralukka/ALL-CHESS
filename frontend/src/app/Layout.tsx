import React, { useEffect, useState, useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronsLeft, ChevronsRight, RefreshCw, Sun, Moon, Settings as SettingsIcon } from 'lucide-react';
import { useSettingsStore } from '@/data/settingsStore';
import { useAuthStore } from '@/data/authStore';
import { LoginGate } from '@/components/LoginGate';
import { ToastContainer, toast } from '@/components/Toast';
import { useMotion } from '@/lib/useMotion';
import { storage } from '@/lib/storage';
import { api } from '@/data/api';
import { PieceHopper } from '@/components/LoadingScreen';
import { gameRepository } from '@/data/repositories';

/** 3D section icons, rendered from scripts/map-art/render_ui_art.py */
export const SECTION_ICON: Record<string, string> = {
  home: '/assets/ui/icon_home.webp',
  play: '/assets/ui/icon_play.webp',
  review: '/assets/ui/icon_review.webp',
  learn: '/assets/ui/icon_learn.webp',
  puzzles: '/assets/ui/icon_puzzles.webp',
  scout: '/assets/ui/icon_scout.webp',
  profile: '/assets/ui/icon_profile.webp',
  settings: '/assets/ui/icon_settings.webp',
  leaderboard: '/assets/ui/icon_leaderboard.webp',
  sync: '/assets/ui/icon_sync.webp',
  sun: '/assets/ui/icon_sun.webp',
  moon: '/assets/ui/icon_moon.webp',
};

const NAV = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/play', label: 'Play Coach', short: 'Play', icon: 'play' },
  { to: '/review', label: 'Review', icon: 'review' },
  { to: '/learn', label: 'Learn', icon: 'learn' },
  { to: '/puzzles', label: 'Puzzles', icon: 'puzzles' },
  { to: '/scout', label: 'Scout', icon: 'scout' },
  { to: '/leaderboard', label: 'Leaderboard', short: 'Ranks', icon: 'leaderboard' },
  { to: '/profile', label: 'Profile', icon: 'profile' },
];

const isActivePath = (path: string, to: string) => path === to || (to !== '/' && path.startsWith(to));

const NavIcon: React.FC<{ name: string; size?: number; active?: boolean }> = ({ name, size = 28, active }) => (
  <img
    src={SECTION_ICON[name]}
    alt=""
    aria-hidden="true"
    draggable={false}
    className={`flex-shrink-0 object-contain transition-transform duration-150 group-hover:scale-110 group-hover:-rotate-3 ${active ? 'scale-110' : ''}`}
    style={{ width: size, height: size, filter: 'drop-shadow(0 2px 2px rgba(0,0,0,.35))' }}
  />
);

export const Layout: React.FC = () => {
  const { appTheme, setAppTheme } = useSettingsStore();
  const { isOff } = useMotion();
  const { isAuthenticated, isLoading, checkSession } = useAuthStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const [collapsed, setCollapsed] = useState<boolean>(() => storage.get('all_chess_sidebar_collapsed', false));
  const autoSyncedRef = useRef(false);
  const location = useLocation();

  useEffect(() => {
    storage.set('all_chess_sidebar_collapsed', collapsed);
  }, [collapsed]);

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    toast.info('Starting sync...', 'Connecting to Chess.com & Lichess');
    try {
      const res = await api.post<{ jobId: string }>('/sync');
      const jobId = res?.jobId;
      if (!jobId) {
        throw new Error('No job ID returned from sync endpoint');
      }

      let completed = false;
      let attempts = 0;
      while (!completed && attempts < 60) {
        await new Promise((r) => setTimeout(r, 1000));
        attempts++;
        try {
          const job = await api.get<{
            id: string;
            status: 'queued' | 'processing' | 'done' | 'failed';
            progress: number;
            error?: string;
            result?: {
              syncedCount: number;
              chesscom: number;
              lichess: number;
              skipped: number;
              message: string;
            };
          }>(`/jobs/${jobId}`);

          if (job.status === 'done') {
            completed = true;
            setIsSyncing(false);
            const msg = job.result?.message || 'Games up to date';
            toast.success('Sync complete', msg);
            window.dispatchEvent(new CustomEvent('chess-data-refresh'));
            break;
          } else if (job.status === 'failed') {
            completed = true;
            setIsSyncing(false);
            toast.error('Sync failed', job.error || 'Unknown sync error');
            break;
          }
        } catch {
          // ignore transient poll error
        }
      }
      if (!completed) {
        setIsSyncing(false);
        toast.warning('Sync taking longer than expected', 'Check back in a moment');
      }
    } catch (err: unknown) {
      setIsSyncing(false);
      let msg = 'Failed to start sync';
      if (err instanceof Error) {
        msg = err.message;
      }
      toast.error('Sync error', msg);
    }
  };

  const checkGamesAndAutoSync = async () => {
    if (autoSyncedRef.current) return;
    try {
      const games = await gameRepository.getGames();
      if (games.length === 0) {
        autoSyncedRef.current = true;
        handleSync();
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    checkSession().then((authenticated) => {
      if (authenticated) {
        checkGamesAndAutoSync();
      }
    });

    const triggerListener = () => handleSync();
    window.addEventListener('trigger-chess-sync', triggerListener);
    return () => {
      window.removeEventListener('trigger-chess-sync', triggerListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // One-time notice when system reports reduced motion while defaulting to Full
  useEffect(() => {
    try {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.matches && !localStorage.getItem('all_chess_motion_prompted')) {
        localStorage.setItem('all_chess_motion_prompted', 'true');
        toast.info('Your system prefers less motion. Switch to Reduced?', 'We kept Full motion on by default. You can adjust in Settings > Appearance.');
      }
    } catch {
      // ignore
    }
  }, []);

  // labels show when the sidebar is expanded on large screens
  const labelCls = collapsed ? 'hidden' : 'hidden lg:inline';
  const widthCls = collapsed ? 'sm:w-[68px]' : 'sm:w-[68px] lg:w-[200px]';

  const utilBtn =
    'group flex items-center justify-center w-10 h-10 rounded-[5px] text-theme-muted hover:text-theme-text hover:bg-black/[0.05] dark:hover:bg-black/20 transition-colors';

  if (isLoading) {
    return (
      <div className="app-bg flex h-screen w-screen items-center justify-center text-theme-text font-sans">
        <div className="flex flex-col items-center gap-4">
          <PieceHopper size={150} />
          <div className="text-xs font-display font-bold text-theme-muted tracking-wider uppercase">
            Loading ALL-CHESS…
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="app-bg flex h-screen w-screen items-center justify-center text-theme-text font-sans">
        <LoginGate onSuccess={checkGamesAndAutoSync} />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="app-bg flex h-screen w-screen overflow-hidden text-theme-text font-sans relative">
      {/* --- DESKTOP & TABLET SIDEBAR --- */}
      <aside
        className={`hidden sm:flex flex-col flex-shrink-0 transition-[width] duration-200 ease-out z-30 relative ${widthCls}`}
        style={{ background: 'var(--color-sidebar)' }}
        data-testid="sidebar"
        data-collapsed={collapsed}
      >
        {/* Logo + collapse (top, where polished apps keep it) */}
        <div className={`flex-shrink-0 flex ${collapsed ? 'flex-col items-center gap-1 pt-3 pb-1' : 'flex-col items-center gap-1 pt-3 pb-1 lg:flex-row lg:justify-between lg:h-16 lg:pt-0 lg:pb-0 lg:pl-3.5 lg:pr-2'}`}>
          <NavLink to="/" className="group flex items-center gap-2.5" aria-label="ALL-CHESS home">
            <img
              src="/assets/ui/logo_king.webp"
              alt=""
              className="w-9 h-10 object-contain flex-shrink-0 transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105"
              style={{ filter: 'drop-shadow(0 3px 4px rgba(0,0,0,.4))' }}
            />
            <div className={`${collapsed ? 'hidden' : 'hidden lg:flex'} flex-col leading-none`}>
              <span className="font-display font-black text-[19px] tracking-tight text-theme-text whitespace-nowrap">ALL-CHESS</span>
              <span className="text-[12px] font-bold text-amber-500 tracking-[0.06em] uppercase mt-1 whitespace-nowrap">Free &amp; Private</span>
            </div>
          </NavLink>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-[5px] text-theme-muted hover:text-theme-text hover:bg-black/[0.05] dark:hover:bg-black/20 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            data-testid="sidebar-toggle"
          >
            {collapsed ? <ChevronsRight size={17} /> : <ChevronsLeft size={17} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-0.5 px-2 pt-2 overflow-y-auto overflow-x-hidden" aria-label="Main Navigation">
          {NAV.map((item) => {
            const active = isActivePath(location.pathname, item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={item.label}
                className={`group relative flex items-center gap-3 px-2.5 h-[46px] rounded-[5px] font-display font-bold text-[16px] transition-colors ${
                  active ? 'bg-black/[0.08] dark:bg-black/25 text-theme-text' : 'text-theme-text/85 hover:text-theme-text hover:bg-black/[0.05] dark:hover:bg-black/20'
                }`}
              >
                <NavIcon name={item.icon} active={active} />
                <span className={`${labelCls} truncate`}>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Utilities: minimal flat icons, like the reference's bottom row */}
        <div className={`p-2 pb-3 flex ${collapsed ? 'flex-col items-center' : 'flex-col items-center lg:flex-row lg:justify-around'} gap-1`}>
          <button type="button" onClick={handleSync} disabled={isSyncing} className={utilBtn} title={isSyncing ? 'Syncing…' : 'Sync games from Chess.com and Lichess'} aria-label="Sync games with Chess.com and Lichess">
            {isSyncing ? <PieceHopper size={32} /> : <RefreshCw size={20} />}
          </button>
          <button
            type="button"
            onClick={() => setAppTheme(appTheme === 'dusk' ? 'dawn' : 'dusk')}
            className={utilBtn}
            title={appTheme === 'dusk' ? 'Switch to day mode' : 'Switch to night mode'}
            aria-label={appTheme === 'dusk' ? 'Switch to day mode' : 'Switch to night mode'}
            data-testid="theme-toggle"
          >
            {appTheme === 'dusk' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <NavLink to="/settings" title="Settings" aria-label="Settings" className={({ isActive }) => `${utilBtn} ${isActive ? '!text-theme-text bg-black/[0.08] dark:bg-black/25' : ''}`}>
            <SettingsIcon size={20} />
          </NavLink>
        </div>
      </aside>

      {/* --- MAIN --- */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto pb-16 sm:pb-0 relative z-10">
        {/* soft page entrance when switching sections */}
        <motion.div
          key={location.pathname.split('/')[1] || 'home'}
          className="flex-1 flex flex-col min-w-0 min-h-0"
          initial={isOff ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isOff ? 0 : 0.22, ease: [0, 0, 0.2, 1] }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* --- PHONE BOTTOM NAVIGATION (< 640px) --- */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 h-16 backdrop-blur-md flex items-center justify-around px-1 z-40 pb-[env(safe-area-inset-bottom)]"
        style={{ background: 'color-mix(in srgb, var(--color-sidebar) 94%, transparent)', boxShadow: '0 -1px 0 rgba(255,255,255,0.06)' }}
        aria-label="Mobile Navigation"
      >
        {NAV.filter((n) => n.icon !== 'scout' && n.icon !== 'leaderboard').map((item) => {
          const active = isActivePath(location.pathname, item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`group flex flex-col items-center justify-center flex-1 h-full gap-0.5 select-none transition-colors ${active ? 'text-amber-500' : 'text-theme-muted'}`}
            >
              <NavIcon name={item.icon} size={26} active={active} />
              <span className="text-[12px] leading-tight font-bold">{item.short || item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <ToastContainer />
    </div>
  );
};
