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
      className={`well relative flex items-center p-1 gap-0.5 ${className}`}
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
            className={`relative flex-1 flex items-center justify-center font-display font-extrabold rounded-[10px] transition-colors select-none z-10 ${
              size === 'sm' ? 'min-h-[36px] px-3 text-[13px]' : 'min-h-[42px] px-3.5 text-[14px]'
            } ${
              isSelected ? 'text-theme-text' : 'text-theme-muted hover:text-theme-text'
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId={`segmented-indicator-${groupId}`}
                className="chip-raised absolute inset-x-0 top-0 bottom-[3px] rounded-[10px] -z-10"
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
