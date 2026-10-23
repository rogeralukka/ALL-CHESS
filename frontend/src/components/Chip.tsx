import React from 'react';

export interface ChipProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'accent' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Chip: React.FC<ChipProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = '',
  onClick,
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
  };

  const variantClasses = {
    neutral: 'bg-theme-raised text-theme-text border border-theme-border',
    accent: 'bg-amber-500/15 text-amber-500 border border-amber-500/30',
    success: 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30',
    danger: 'bg-red-500/15 text-red-500 border border-red-500/30',
    warning: 'bg-orange-500/15 text-orange-500 border border-orange-500/30',
    info: 'bg-sky-500/15 text-sky-500 border border-sky-500/30',
  };

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-pill font-medium select-none ${
        onClick ? 'cursor-pointer hover:opacity-80 active:scale-95 min-h-[44px]' : ''
      } ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
