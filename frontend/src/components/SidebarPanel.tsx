import React from 'react';

/**
 * The right-hand panel next to a board (review, puzzles, lessons, play). Flat slab, 5px corners,
 * a 72px header with a big rounded title, content below, as on the reference.
 */
export const SidebarPanel: React.FC<{ children: React.ReactNode; className?: string; testId?: string }> = ({ children, className = '', testId }) => (
  <aside
    className={`flex flex-col min-h-0 overflow-hidden rounded-none lg:rounded-[5px] ${className}`}
    style={{ background: 'var(--side-panel-bg)' }}
    data-testid={testId}
  >
    {children}
  </aside>
);

interface SidebarHeaderProps {
  title: string;
  icon?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ title, icon, left, right }) => (
  <div className="relative flex items-center justify-center h-[60px] lg:h-[72px] px-3 flex-shrink-0" style={{ background: 'var(--side-header-bg)' }}>
    {left && <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center">{left}</div>}
    <div className="flex items-center gap-2.5 min-w-0">
      {icon}
      <h1 className="font-display font-extrabold text-[26px] lg:text-[30px] leading-none tracking-[-0.01em] truncate" style={{ color: 'var(--color-text-strong)' }}>
        {title}
      </h1>
    </div>
    {right && <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">{right}</div>}
  </div>
);

/** Round icon button used in panel headers (back, sound, settings). */
export const HeaderIconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', children, ...rest }) => (
  <button
    type="button"
    {...rest}
    className={`w-9 h-9 flex items-center justify-center rounded-[4px] text-theme-muted hover:text-theme-text hover:bg-white/[0.06] transition-colors ${className}`}
  >
    {children}
  </button>
);

export default SidebarPanel;
