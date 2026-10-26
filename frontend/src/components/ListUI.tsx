import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';

/** Page title: 3D icon then a 28px rounded title, the reference's plain page header. */
export const PageTitle: React.FC<{ title: string; icon?: string; right?: React.ReactNode; subtitle?: React.ReactNode }> = ({ title, icon, right, subtitle }) => (
  <header className="flex items-center gap-3 min-h-[48px]" data-testid="page-title">
    {icon && <img src={icon} alt="" aria-hidden="true" className="w-11 h-11 object-contain" style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,.35))' }} />}
    <div className="min-w-0">
      <h1 className="cc-title text-[28px] leading-[34px]">{title}</h1>
      {subtitle && <p className="text-[14px] text-theme-muted mt-0.5">{subtitle}</p>}
    </div>
    {right && <div className="ml-auto flex items-center gap-2">{right}</div>}
  </header>
);

/** A number with an icon and a small label. `stack` centres it vertically like the reference side panels. */
export const StatTile: React.FC<{ icon: React.ReactNode; value: React.ReactNode; label: string; stack?: boolean; flat?: boolean }> = ({ icon, value, label, stack, flat }) => (
  <div className={`${flat ? '' : 'cc-card'} flex ${stack ? 'flex-col items-center text-center gap-2 py-5' : 'items-center gap-3.5 px-4 py-3.5'} min-w-0`}>
    <span className={`${stack ? 'w-14 h-14' : 'w-11 h-11'} flex items-center justify-center flex-shrink-0 ${flat ? '' : 'rounded-[5px] bg-[var(--tile-bg)]'}`}>{icon}</span>
    <div className="min-w-0">
      <div className={`${stack ? 'text-[26px] leading-8' : 'text-[22px] leading-6'} font-display font-extrabold text-theme-text tabular-nums truncate`}>{value}</div>
      <div className={`${stack ? 'text-[12px] uppercase tracking-wide' : 'text-[13px]'} text-theme-muted truncate`}>{label}</div>
    </div>
  </div>
);

/** Card with a bold heading row (optionally with a trailing control) and a body. */
export const SectionCard: React.FC<{ title?: React.ReactNode; right?: React.ReactNode; children: React.ReactNode; className?: string; bodyClassName?: string; testId?: string }> = ({
  title,
  right,
  children,
  className = '',
  bodyClassName = '',
  testId,
}) => (
  <section className={`cc-card overflow-hidden ${className}`} data-testid={testId}>
    {title && (
      <div className="flex items-center gap-3 px-5 h-[56px] border-b border-white/[0.06]">
        <h2 className="text-[18px] font-display font-bold text-theme-text">{title}</h2>
        {right && <div className="ml-auto">{right}</div>}
      </div>
    )}
    <div className={bodyClassName}>{children}</div>
  </section>
);

/** Search box: icon on the left, clear button on the right. */
export const SearchBox: React.FC<{ value: string; onChange: (v: string) => void; placeholder: string; label?: string; className?: string }> = ({
  value,
  onChange,
  placeholder,
  label,
  className = '',
}) => (
  <div className={`relative ${className}`}>
    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted pointer-events-none" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={label ?? placeholder}
      className="w-full h-12 pl-12 pr-10 rounded-[5px] text-[16px] text-theme-text placeholder:text-theme-muted focus:outline-none focus-visible:!outline-none border border-transparent focus:border-[#81b64c] transition-colors"
      style={{ background: 'var(--input-bg)' }}
    />
    {value && (
      <button type="button" onClick={() => onChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-theme-muted hover:text-theme-text" aria-label="Clear">
        <X size={16} />
      </button>
    )}
  </div>
);

export interface DropdownOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

/** Big dropdown cell used in the filter bar: icon, bold label, chevron. Opens a small menu. */
export function FilterDropdown<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: T;
  options: DropdownOption<T>[];
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        className="w-full h-16 flex items-center gap-3.5 px-5 text-left hover:bg-white/[0.04] transition-colors"
      >
        {current.icon && <span className="w-8 h-8 flex items-center justify-center flex-shrink-0">{current.icon}</span>}
        <span className="flex-1 min-w-0 truncate text-[18px] font-display font-bold text-theme-text">{current.label}</span>
        <ChevronDown size={20} className={`text-theme-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul role="listbox" className="absolute z-30 left-0 right-0 top-full mt-1 py-1 rounded-[5px] bg-[var(--color-raised)] shadow-[0_8px_24px_rgba(0,0,0,0.4)] border border-white/[0.06]">
          {options.map((o) => (
            <li key={o.value} role="option" aria-selected={o.value === value}>
              <button
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 h-11 text-left text-[15px] font-semibold text-theme-text hover:bg-white/[0.06]"
              >
                {o.icon && <span className="w-6 h-6 flex items-center justify-center">{o.icon}</span>}
                <span className="flex-1">{o.label}</span>
                {o.value === value && <Check size={16} className="text-[#81b64c]" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Wrapper that lays dropdowns side by side with a thin divider, in a dark rounded bar. */
export const FilterBar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-stretch rounded-[5px] divide-x divide-white/[0.08]" style={{ background: 'rgba(0,0,0,0.2)' }}>
    {children}
  </div>
);
