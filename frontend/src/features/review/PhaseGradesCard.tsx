import React from 'react';
import { PhaseGrade } from '@/data/types';

interface PhaseGradesCardProps {
  grades?: PhaseGrade;
  className?: string;
}

export const PhaseGradesCard: React.FC<PhaseGradesCardProps> = ({
  grades = { opening: 'A', middlegame: 'B', tactics: 'A', endgame: 'N/A' },
  className = '',
}) => {
  const phases = [
    { label: 'Opening', grade: grades.opening },
    { label: 'Middlegame', grade: grades.middlegame },
    { label: 'Tactics', grade: grades.tactics },
    { label: 'Endgame', grade: grades.endgame },
  ];

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'B':
        return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
      case 'C':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'D':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-theme-raised text-theme-muted border-theme-border';
    }
  };

  return (
    <div className={`grid grid-cols-4 gap-2 text-center select-none ${className}`}>
      {phases.map((p) => (
        <div
          key={p.label}
          className="flex flex-col items-center justify-center p-2 rounded-md bg-theme-raised/50 border border-theme-border/50 min-w-0"
        >
          <span
            className="text-xs font-semibold text-theme-muted mb-1 text-center w-full whitespace-nowrap overflow-visible"
            title={p.label}
          >
            {p.label}
          </span>
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border ${getGradeBadge(
              p.grade
            )}`}
          >
            {p.grade}
          </span>
        </div>
      ))}
    </div>
  );
};
