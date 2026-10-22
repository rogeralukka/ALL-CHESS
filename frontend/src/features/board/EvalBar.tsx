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

  const scoreText = formatEval(evalScore, mate);
  const isWhiteLeading = (mate && mate > 0) || (evalScore !== undefined && evalScore >= 0);

  return (
    <div
      className={`relative w-7 rounded-sm overflow-hidden flex flex-col justify-between border border-neutral-700/60 shadow-md select-none ${className}`}
      style={{ height, minHeight: '280px' }}
      aria-label={`Evaluation bar: ${scoreText}`}
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

      {/* Numerical score printed at leading side's end */}
      <div className="relative z-10 flex flex-col justify-between h-full py-1 text-center font-mono font-bold text-[11px] leading-tight pointer-events-none">
        {/* Top score for Black leading */}
        {!isWhiteLeading ? (
          <span className="text-[#faf8f5] px-0.5">{scoreText}</span>
        ) : (
          <span />
        )}

        {/* Bottom score for White leading */}
        {isWhiteLeading ? (
          <span className="text-[#141312] px-0.5">{scoreText}</span>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
};
