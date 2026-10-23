import React from 'react';
import { MoveClassification } from '@/data/types';

export interface ClassificationMeta {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  name: string;
}

export const CLASSIFICATION_META: Record<MoveClassification, ClassificationMeta> = {
  brilliant: {
    label: '!!',
    color: '#2bc4b0',
    bgColor: '#2bc4b0',
    textColor: '#ffffff',
    name: 'Brilliant',
  },
  great: {
    label: '!',
    color: '#6f9bd1',
    bgColor: '#6f9bd1',
    textColor: '#ffffff',
    name: 'Great',
  },
  book: {
    label: 'Book',
    color: '#c99a6e',
    bgColor: '#c99a6e',
    textColor: '#ffffff',
    name: 'Book',
  },
  best: {
    label: '★',
    color: '#7bb661',
    bgColor: '#7bb661',
    textColor: '#ffffff',
    name: 'Best',
  },
  excellent: {
    label: '✓✓',
    color: '#8cc46a',
    bgColor: '#8cc46a',
    textColor: '#ffffff',
    name: 'Excellent',
  },
  good: {
    label: '✓',
    color: '#9fbf86',
    bgColor: '#9fbf86',
    textColor: '#ffffff',
    name: 'Good',
  },
  inaccuracy: {
    label: '?!',
    color: '#f2c14e',
    bgColor: '#f2c14e',
    textColor: '#141312',
    name: 'Inaccuracy',
  },
  mistake: {
    label: '?',
    color: '#f59a4b',
    bgColor: '#f59a4b',
    textColor: '#ffffff',
    name: 'Mistake',
  },
  miss: {
    label: '✕',
    color: '#ef7d6e',
    bgColor: '#ef7d6e',
    textColor: '#ffffff',
    name: 'Miss',
  },
  blunder: {
    label: '??',
    color: '#e8483b',
    bgColor: '#e8483b',
    textColor: '#ffffff',
    name: 'Blunder',
  },
};

interface ClassificationBadgeProps {
  classification: MoveClassification;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'square';
  showLabel?: boolean;
  className?: string;
}

export const ClassificationBadge: React.FC<ClassificationBadgeProps> = ({
  classification,
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const meta = CLASSIFICATION_META[classification];
  if (!meta) return null;

  const sizeClasses = {
    xs: 'w-4 h-4 text-xs font-bold',
    sm: 'w-4.5 h-4.5 text-xs font-bold',
    md: 'w-5 h-5 text-xs font-bold',
    lg: 'w-7 h-7 text-sm font-bold',
    square: 'w-7 h-7 text-xs font-bold shadow-md', // on the chess board corner
  };

  const renderIcon = () => {
    switch (classification) {
      case 'book':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3/5 h-3/5">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        );
      case 'best':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3/5 h-3/5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      case 'excellent':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3/5 h-3/5">
            <path d="M7 13l3 3 7-7" />
          </svg>
        );
      case 'good':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3/5 h-3/5">
            <path d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'miss':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3/5 h-3/5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        );
      default:
        return <span className="font-extrabold leading-none">{meta.label}</span>;
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 select-none ${className}`}>
      <span
        className={`rounded-full flex items-center justify-center font-bold flex-shrink-0 transition-transform ${sizeClasses[size]}`}
        style={{ backgroundColor: meta.bgColor, color: meta.textColor }}
        title={`${meta.name} (${meta.label})`}
        role="img"
        aria-label={`${meta.name} move`}
      >
        {renderIcon()}
      </span>
      {showLabel && (
        <span className="text-xs font-semibold capitalize text-theme-text">
          {meta.name}
        </span>
      )}
    </div>
  );
};
