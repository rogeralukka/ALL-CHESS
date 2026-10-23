import React from 'react';
import { evalToWinPct } from '@/lib/winPct';
import { formatEval } from '@/lib/formatters';

interface EvalBarProps {
  evalScore?: number;
  mate?: number | null;
  orientation?: 'white' | 'black';
  height?: number | string;
  className?: string;
}

export const EvalBar: React.FC<EvalBarProps> = ({
  evalScore = 0.0,
  mate = null,
  orientation = 'white',
  height = '100%',
  className = '',
}) => {
  const whitePct = evalToWinPct(evalScore, mate);
  // If orientation is black, flip fill
  const bottomFillPct = orientation === 'white' ? whitePct : 100 - whitePct;

  const rawScore = evalScore ?? 0;
  const isWhiteLeading = (mate && mate > 0) || (!mate && rawScore >= 0);
  const absScoreText = mate !== null && mate !== undefined
    ? `M${Math.abs(mate)}`
    : Math.abs(rawScore).toFixed(1);

  // Determine whether top or bottom shows the leading score
  // If orientation === 'white': top is Black, bottom is White
  // If orientation === 'black': top is White, bottom is Black
  const showTopScore = orientation === 'white' ? !isWhiteLeading : isWhiteLeading;
  const showBottomScore = orientation === 'white' ? isWhiteLeading : !isWhiteLeading;
  const topTextColor = orientation === 'white' ? 'text-[#faf8f5]' : 'text-[#141312]';
  const bottomTextColor = orientation === 'white' ? 'text-[#141312]' : 'text-[#faf8f5]';

  return (
    <div
      className={`relative w-7 rounded-sm overflow-hidden flex flex-col justify-between border border-neutral-700/60 shadow-md select-none ${className}`}
      style={{ height, minHeight: '280px' }}
      aria-label={`Evaluation bar: ${formatEval(evalScore, mate)}`}
      role="progressbar"
      aria-valuenow={Math.round(whitePct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Top Black background */}
      <div className="absolute inset-0 bg-[#262421]" />

      {/* Bottom White fill rising */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-[#faf8f5] transition-all duration-300 ease-out"
        style={{ height: `${bottomFillPct}%` }}
      />

      {/* Numerical score printed as positive absolute value at leading side's end */}
      <div className="relative z-10 flex flex-col justify-between h-full py-1 text-center font-mono font-bold text-xs leading-tight pointer-events-none">
        {/* Top score */}
        {showTopScore ? (
          <span className={`${topTextColor} px-0.5`}>{absScoreText}</span>
        ) : (
          <span />
        )}

        {/* Bottom score */}
        {showBottomScore ? (
          <span className={`${bottomTextColor} px-0.5`}>{absScoreText}</span>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
};
