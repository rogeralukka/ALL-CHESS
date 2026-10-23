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
  /** Fixed pixel sizes for UI use; 'fill' fills its parent (used on the board, where the parent is sized relative to the square). */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'square' | 'fill';
  showLabel?: boolean;
  className?: string;
}

const SIZE_PX: Record<Exclude<NonNullable<ClassificationBadgeProps['size']>, 'fill' | 'square'>, number> = {
  xs: 14,
  sm: 18,
  md: 20,
  lg: 28,
};

/** Darken a #rrggbb colour by a factor (0..1) for the badge's bottom shadow ring. */
const darken = (hex: string, f: number) => {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * (1 - f));
  const g = Math.round(((n >> 8) & 255) * (1 - f));
  const b = Math.round((n & 255) * (1 - f));
  return `rgb(${r},${g},${b})`;
};

/** Glyph drawn inside a 32x32 viewBox, centred on (16,16). Single SVG so it scales cleanly at any size. */
const Glyph: React.FC<{ classification: MoveClassification; color: string }> = ({ classification, color }) => {
  const text = (t: string, fontSize: number, dx = 0) => (
    <text
      x={16 + dx}
      y={16}
      textAnchor="middle"
      dominantBaseline="central"
      fontFamily="Inter, system-ui, sans-serif"
      fontWeight={800}
      fontSize={fontSize}
      letterSpacing={-0.6}
      fill={color}
    >
      {t}
    </text>
  );
  switch (classification) {
    case 'brilliant':
      return text('!!', 15);
    case 'great':
      return text('!', 17);
    case 'inaccuracy':
      return text('?!', 14);
    case 'mistake':
      return text('?', 17);
    case 'blunder':
      return text('??', 14);
    case 'best':
      return <path d="M16 7.2l2.6 5.5 6 .8-4.4 4.1 1.1 5.9L16 20.6l-5.3 2.9 1.1-5.9-4.4-4.1 6-.8z" fill={color} />;
    case 'excellent':
      // thumbs-up
      return (
        <path
          d="M12.2 14.4l3.3-6.2c.9-.2 2 .5 2 1.7v3.4h4.7c1.1 0 1.9 1 1.7 2.1l-1.2 6.1c-.2.9-.9 1.5-1.8 1.5h-8.7zM8.4 14.4h2.4v8.6H8.4z"
          fill={color}
        />
      );
    case 'good':
      return <path d="M10 16.4l4 4 8-8.4" fill="none" stroke={color} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />;
    case 'book':
      return (
        <path
          d="M9 9.5c2.6-.8 5-.5 7 1 2-1.5 4.4-1.8 7-1v12.2c-2.6-.8-5-.5-7 1-2-1.5-4.4-1.8-7-1z M16 10.5v12.2"
          fill="none"
          stroke={color}
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
      );
    case 'miss':
      return <path d="M11 11l10 10M21 11L11 21" fill="none" stroke={color} strokeWidth={3.4} strokeLinecap="round" />;
    default:
      return null;
  }
};

export const ClassificationBadge: React.FC<ClassificationBadgeProps> = ({
  classification,
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const meta = CLASSIFICATION_META[classification];
  if (!meta) return null;

  const isFill = size === 'fill' || size === 'square';
  const px = isFill ? undefined : SIZE_PX[size as keyof typeof SIZE_PX];

  const icon = (
    <svg
      viewBox="0 0 32 32"
      width={isFill ? '100%' : px}
      height={isFill ? '100%' : px}
      style={isFill ? { display: 'block' } : { display: 'block', flex: 'none', width: px, height: px, minWidth: px }}
      role="img"
      aria-label={`${meta.name} move`}
    >
      <title>{meta.name}</title>
      {/* bottom shadow ring gives the slight 3D look of the reference badges */}
      <circle cx={16} cy={17.1} r={14.6} fill={darken(meta.bgColor, 0.28)} />
      <circle cx={16} cy={16} r={14.6} fill={meta.bgColor} />
      <Glyph classification={classification} color={meta.textColor} />
    </svg>
  );

  if (!showLabel) {
    return isFill ? (
      <span className={`block w-full h-full select-none ${className}`}>{icon}</span>
    ) : (
      <span className={`inline-flex flex-none select-none ${className}`}>{icon}</span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 select-none ${className}`}>
      {icon}
      <span className="text-[13px] font-semibold text-theme-text">{meta.name}</span>
    </span>
  );
};
