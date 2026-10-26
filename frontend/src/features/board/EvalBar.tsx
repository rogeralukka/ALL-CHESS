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

  const rawScore = evalScore ?? 0;
  const isWhiteLeading = (mate && mate > 0) || (!mate && rawScore >= 0);
  const absScoreText = mate !== null && mate !== undefined
    ? `M${Math.abs(mate)}`
    : Math.abs(rawScore).toFixed(1);

  // If orientation === 'white': top is Black (#262421), bottom is White (#faf8f5)
  // If orientation === 'black': top is White (#faf8f5), bottom is Black (#262421)
  const isWhiteAtBottom = orientation === 'white';

  // Determine whether top or bottom shows the leading score:
  // If White is leading: show on White's end (bottom if orientation is white, top if orientation is black)
  // If Black is leading: show on Black's end (top if orientation is white, bottom if orientation is black)
  const showTopScore = isWhiteAtBottom ? !isWhiteLeading : isWhiteLeading;
  const showBottomScore = isWhiteAtBottom ? isWhiteLeading : !isWhiteLeading;

  // On White background (#faf8f5) text should be dark (#141312)
  // On Black background (#262421) text should be light (#faf8f5)
  const topTextColor = isWhiteAtBottom ? 'text-[#faf8f5]' : 'text-[#141312]';
  const bottomTextColor = isWhiteAtBottom ? 'text-[#141312]' : 'text-[#faf8f5]';

  return (
    <div
      data-testid="eval-bar"
      data-orientation={orientation}
      className={`relative w-5 sm:w-7 rounded-sm overflow-hidden flex flex-col justify-between border border-neutral-700/60 shadow-md select-none ${className}`}
      style={{ height, minHeight: '280px' }}
      aria-label={`Evaluation bar: ${formatEval(evalScore, mate)}`}
      role="progressbar"
      aria-valuenow={Math.round(whitePct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Black background */}
      <div className="absolute inset-0 bg-[#262421]" />

      {/* White fill: anchors to bottom when orientation is white, anchors to top when orientation is black */}
      <div
        data-testid="eval-fill-white"
        className={`absolute left-0 right-0 bg-[#faf8f5] transition-all duration-300 ease-out ${
          orientation === 'white' ? 'bottom-0' : 'top-0'
        }`}
        style={{ height: `${whitePct}%` }}
      />

      {/* Numerical score printed as positive absolute value at leading side's end */}
      <div className="relative z-10 flex flex-col justify-between h-full py-1 text-center font-mono font-bold text-xs leading-tight pointer-events-none">
        {/* Top score */}
        {showTopScore ? (
          <span data-testid="eval-score-top" className={`${topTextColor} px-0.5`}>{absScoreText}</span>
        ) : (
          <span />
        )}

        {/* Bottom score */}
        {showBottomScore ? (
          <span data-testid="eval-score-bottom" className={`${bottomTextColor} px-0.5`}>{absScoreText}</span>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
};

export default EvalBar;
