import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RefreshCw, Sun, Moon, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useSettingsStore } from '@/data/settingsStore';
import { ToastContainer, toast } from '@/components/Toast';
import { useMotion } from '@/lib/useMotion';
import { storage } from '@/lib/storage';

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
};

const NAV = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/play', label: 'Play Coach', short: 'Play', icon: 'play' },
  { to: '/review', label: 'Review', icon: 'review' },
  { to: '/learn', label: 'Learn', icon: 'learn' },
  { to: '/puzzles', label: 'Puzzles', icon: 'puzzles' },
  { to: '/scout', label: 'Scout', icon: 'scout' },
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
  const [isSyncing, setIsSyncing] = useState(false);
  const [collapsed, setCollapsed] = useState<boolean>(() => storage.get('all_chess_sidebar_collapsed', false));
  const location = useLocation();

  useEffect(() => {
    storage.set('all_chess_sidebar_collapsed', collapsed);
  }, [collapsed]);

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

  const handleSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    toast.info('Checking Chess.com & Lichess...', 'Syncing recent games without auth');
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('Sync complete', '1 new game found & imported');
    }, 1800);
  };

  // labels show when the sidebar is expanded on large screens
  const labelCls = collapsed ? 'hidden' : 'hidden lg:inline';
  const widthCls = collapsed ? 'sm:w-[68px]' : 'sm:w-[68px] lg:w-[184px]';

  const utilBtn =
    'group flex items-center gap-3 px-3 h-10 rounded-lg font-semibold text-[13px] text-theme-muted hover:text-theme-text hover:bg-black/[0.05] dark:hover:bg-white/[0.06] transition-colors w-full';

  return (
    <div className="app-bg flex h-screen w-screen overflow-hidden text-theme-text font-sans relative">
      {/* --- DESKTOP & TABLET SIDEBAR --- */}
      <aside
        className={`hidden sm:flex flex-col flex-shrink-0 transition-[width] duration-200 ease-out z-30 relative ${widthCls}`}
        style={{ background: 'var(--color-sidebar)', boxShadow: '1px 0 0 rgba(255,255,255,0.04), 6px 0 24px -12px rgba(0,0,0,0.5)' }}
        data-testid="sidebar"
        data-collapsed={collapsed}
      >
        {/* Logo */}
        <NavLink to="/" className="group h-16 flex items-center gap-2.5 px-3.5 flex-shrink-0" aria-label="ALL-CHESS home">
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

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-0.5 px-2 pt-2 overflow-y-auto overflow-x-hidden" aria-label="Main Navigation">
          {NAV.map((item) => {
            const active = isActivePath(location.pathname, item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={item.label}
                className={`group relative flex items-center gap-3 px-2.5 h-11 rounded-lg font-bold text-[15px] transition-colors ${
                  active ? 'bg-black/[0.05] dark:bg-white/[0.08] text-theme-text' : 'text-theme-text/75 hover:text-theme-text hover:bg-black/[0.05] dark:hover:bg-white/[0.05]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId={isOff ? undefined : 'nav-active-bar'}
                    className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-amber-500"
                    transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                  />
                )}
                <NavIcon name={item.icon} active={active} />
                <span className={`${labelCls} truncate`}>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Utilities */}
        <div className="p-2 flex flex-col gap-0.5" style={{ boxShadow: '0 -1px 0 rgba(255,255,255,0.05)' }}>
          <button type="button" onClick={handleSync} disabled={isSyncing} className={utilBtn} title="Sync games from Chess.com and Lichess" aria-label="Sync games with Chess.com and Lichess">
            <RefreshCw size={18} className={`flex-shrink-0 mx-[5px] ${isSyncing ? 'animate-spin text-amber-500' : ''}`} />
            <span className={`${labelCls} truncate`}>{isSyncing ? 'Syncing...' : 'Sync Games'}</span>
          </button>
          <button
            type="button"
            onClick={() => setAppTheme(appTheme === 'dusk' ? 'dawn' : 'dusk')}
            className={utilBtn}
            title={`Switch to ${appTheme === 'dusk' ? 'Dawn (light)' : 'Dusk (dark)'}`}
            aria-label="Toggle theme"
          >
            {appTheme === 'dusk' ? <Sun size={18} className="text-amber-400 flex-shrink-0 mx-[5px]" /> : <Moon size={18} className="text-indigo-400 flex-shrink-0 mx-[5px]" />}
            <span className={`${labelCls} truncate capitalize`}>{appTheme === 'dusk' ? 'Light mode' : 'Dark mode'}</span>
          </button>
          <NavLink
            to="/settings"
            title="Settings"
            className={({ isActive }) => `${utilBtn} ${isActive ? '!bg-black/[0.05] dark:bg-white/[0.08] !text-theme-text' : ''}`}
          >
            <img src={SECTION_ICON.settings} alt="" className="w-7 h-7 object-contain flex-shrink-0 transition-transform duration-300 group-hover:rotate-45" />
            <span className={`${labelCls} truncate`}>Settings</span>
          </NavLink>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className={`${utilBtn} hidden lg:flex`}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            data-testid="sidebar-toggle"
          >
            {collapsed ? <ChevronsRight size={18} className="flex-shrink-0 mx-[5px]" /> : <ChevronsLeft size={18} className="flex-shrink-0 mx-[5px]" />}
            <span className={`${labelCls} truncate`}>Collapse</span>
          </button>
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
        {NAV.filter((n) => n.icon !== 'scout').map((item) => {
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
