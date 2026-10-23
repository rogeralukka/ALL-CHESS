import React, { useId } from 'react';
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
  // each group needs its own indicator id, or the highlight jumps between groups
  const groupId = useId();
  return (
    <div
      className={`relative flex items-center p-1 bg-black/[0.04] dark:bg-black/25 rounded-[10px] border border-theme-border ${className}`}
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
            className={`relative flex-1 flex items-center justify-center font-semibold rounded-lg transition-colors select-none z-10 ${
              size === 'sm' ? 'min-h-[36px] px-3 text-[13px]' : 'min-h-[42px] px-3.5 text-[14px]'
            } ${
              isSelected ? 'text-theme-text font-bold' : 'text-theme-muted hover:text-theme-text'
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId={`segmented-indicator-${groupId}`}
                className="absolute inset-0 rounded-lg -z-10 bg-white dark:bg-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_1px_2px_rgba(0,0,0,.25)]"
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
