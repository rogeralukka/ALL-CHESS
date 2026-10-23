import React from 'react';
import { motion } from 'framer-motion';

export interface SegmentOption<T extends string = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

export interface SegmentedProps<T extends string = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export const Segmented = <T extends string>({
  options,
  value,
  onChange,
  className = '',
  size = 'md',
}: SegmentedProps<T>) => {
  return (
    <div
      className={`relative flex items-center p-1 bg-theme-raised/80 rounded-md border border-theme-border/60 ${className}`}
      role="tablist"
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(opt.value)}
            className={`relative flex-1 flex items-center justify-center font-medium rounded transition-colors select-none z-10 min-h-[44px] ${
              size === 'sm' ? 'px-2.5 text-xs' : 'px-3 text-xs md:text-sm'
            } ${
              isSelected ? 'text-theme-text font-bold' : 'text-theme-muted hover:text-theme-text'
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId="segmented-indicator"
                className="absolute inset-0 bg-theme-card rounded shadow-sm border border-theme-border/50 -z-10"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <div className="flex items-center gap-1.5 truncate">
              {opt.icon && <span className="flex-shrink-0">{opt.icon}</span>}
              <span className="truncate">{opt.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
