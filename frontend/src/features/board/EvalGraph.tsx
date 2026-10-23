import React, { useState } from 'react';
import { Move } from '@/data/types';
import { CLASSIFICATION_META } from '@/components/ClassificationBadge';
import { formatEval } from '@/lib/formatters';

interface EvalGraphProps {
  moves: Move[];
  currentMoveIndex: number; // -1 for start of game, 0..moves.length-1
  onSeek: (moveIndex: number) => void;
  height?: number;
  mini?: boolean;
  className?: string;
}

export const EvalGraph: React.FC<EvalGraphProps> = ({
  moves,
  currentMoveIndex,
  onSeek,
  height = 90,
  mini = false,
  className = '',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!moves || moves.length === 0) return null;

  const totalPoints = moves.length + 1; // including start pos at 0.0
  const width = 1000;
  const h = height;
  const zeroY = h / 2;
  const maxEval = 6.0; // clamp visual swing to +/- 6 pawns

  // Generate coordinates for each move index
  const points = moves.map((m, idx) => {
    const x = ((idx + 1) / totalPoints) * width;
    const score = m.eval?.eval ?? 0;
    const clampedScore = Math.min(maxEval, Math.max(-maxEval, score));
    // When score > 0 (white ahead), y is above center (lower y)
    const y = zeroY - (clampedScore / maxEval) * (zeroY - 4);
    return { x, y, move: m, index: idx };
  });

  // Start position at x=0, y=zeroY
  const startPoint = { x: 0, y: zeroY };

  // Build SVG path
  let pathD = `M ${startPoint.x} ${startPoint.y}`;
  points.forEach((p) => {
    pathD += ` L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  });

  // Area path closing back to zero line
  const areaD = `${pathD} L ${width} ${zeroY} L 0 ${zeroY} Z`;

  // Determine current cursor position and color
  const activeIdx = hoveredIndex !== null ? hoveredIndex : currentMoveIndex;
  const activeMove = activeIdx >= 0 ? moves[activeIdx] : null;
  const activePoint = activeIdx >= 0 && points[activeIdx] ? points[activeIdx] : null;

  const activeCls = activeMove?.classification || 'best';
  const cursorColor = CLASSIFICATION_META[activeCls]?.color || '#f59e0b';

  return (
    <div
      className={`relative select-none ${className}`}
      style={{ height: `${h}px` }}
    >
      <svg
        viewBox={`0 0 ${width} ${h}`}
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const ratio = Math.max(0, Math.min(1, clickX / rect.width));
          const targetIndex = Math.min(moves.length - 1, Math.floor(ratio * moves.length));
          onSeek(targetIndex);
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const ratio = Math.max(0, Math.min(1, clickX / rect.width));
          const targetIndex = Math.min(moves.length - 1, Math.floor(ratio * moves.length));
          setHoveredIndex(targetIndex);
        }}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {/* Background zero axis */}
        <line
          x1="0"
          y1={zeroY}
          x2={width}
          y2={zeroY}
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Shaded Area for advantage */}
        <path d={areaD} fill="rgba(245, 158, 11, 0.15)" />

        {/* Advantage curve line */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(255, 255, 255, 0.7)"
          strokeWidth={mini ? 1.5 : 2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Key move colored dots (brilliant, blunder, great, mistake, miss) */}
        {points.map((p) => {
          const cls = p.move.classification;
          if (!cls || (cls !== 'brilliant' && cls !== 'blunder' && cls !== 'great' && cls !== 'mistake' && cls !== 'miss')) {
            return null;
          }
          const dotColor = CLASSIFICATION_META[cls]?.color;
          return (
            <circle
              key={`dot-${p.index}`}
              cx={p.x}
              cy={p.y}
              r={mini ? 3.5 : 4.5}
              fill={dotColor}
              stroke="#141312"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Active / Current Move Cursor Line */}
        {activePoint && (
          <g>
            <line
              x1={activePoint.x}
              y1="0"
              x2={activePoint.x}
              y2={h}
              stroke={cursorColor}
              strokeWidth="2.5"
            />
            <circle
              cx={activePoint.x}
              cy={activePoint.y}
              r={mini ? 4 : 5}
              fill={cursorColor}
              stroke="#ffffff"
              strokeWidth="2"
            />
          </g>
        )}
      </svg>

      {/* Floating Hover Tooltip (clean & small, no swing blob) */}
      {hoveredIndex !== null && activeMove && activePoint && (
        <div
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -top-9 px-2 py-0.5 bg-theme-raised border border-theme-border rounded shadow-md text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap"
          style={{
            left: `${Math.max(10, Math.min(90, (activePoint.x / width) * 100))}%`,
          }}
        >
          <span className="text-theme-muted font-mono">{activeMove.moveNumber}.</span>
          <span className="font-mono font-bold text-theme-text">{activeMove.san}</span>
          <span
            className="px-1.5 py-0.2 rounded font-bold text-[10px]"
            style={{
              backgroundColor: CLASSIFICATION_META[activeCls]?.bgColor,
              color: CLASSIFICATION_META[activeCls]?.textColor,
            }}
          >
            {CLASSIFICATION_META[activeCls]?.label}
          </span>
          <span className="font-mono text-amber-500 font-bold text-[11px]">
            {formatEval(activeMove.eval?.eval)}
          </span>
        </div>
      )}
    </div>
  );
};
