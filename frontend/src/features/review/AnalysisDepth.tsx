import React from 'react';
import { Game } from '@/data/types';
import { ANALYSIS_LEVELS, AnalysisLevel, levelById } from './analysisLevels';

interface Props {
  game: Game;
  level: AnalysisLevel['id'];
  onLevelChange: (id: AnalysisLevel['id']) => void;
  onReanalyze: (id: AnalysisLevel['id']) => void;
}

/** Picks how deep Stockfish looks. Level 1 matches Chess.com; the rest go deeper (and slower). */
export const AnalysisDepth: React.FC<Props> = ({ game, level, onLevelChange, onReanalyze }) => {
  const selected = levelById(level) ?? ANALYSIS_LEVELS[0];
  const doneAt = levelById(game.analysisLevel);
  const upToDate = doneAt?.id === selected.id || (!game.analysisLevel && selected.id === 'standard');
  const depthText = game.analysisDepth ? `depth ${game.analysisDepth}` : doneAt ? `depth ~${doneAt.depth}` : 'standard depth';

  return (
    <div className="px-4 pt-3 pb-1 border-t border-white/[0.06]" data-testid="analysis-depth">
      <div className="flex items-center justify-between pb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-theme-muted">Analysis depth</span>
        <span className="text-[12px] font-semibold text-theme-muted tabular-nums">
          {upToDate ? `Analysed at ${depthText}` : `Currently ${depthText}`}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1.5" role="radiogroup" aria-label="Analysis depth">
        {ANALYSIS_LEVELS.map((l) => {
          const on = l.id === selected.id;
          return (
            <button
              key={l.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onLevelChange(l.id)}
              className={`h-[46px] rounded-[5px] flex flex-col items-center justify-center leading-tight border-b-[3px] transition-colors ${
                on ? 'bg-[#81b64c] text-white border-[#45753c]' : 'bg-white/[0.07] text-theme-text border-black/30 hover:bg-white/[0.11]'
              }`}
            >
              <span className="text-[13px] font-extrabold font-display">{l.name}</span>
              <span className={`text-[11px] tabular-nums ${on ? 'text-white/80' : 'text-theme-muted'}`}>d{l.depth}</span>
            </button>
          );
        })}
      </div>
      <p className="pt-2 text-[12px] leading-snug text-theme-muted">{selected.blurb}</p>
      {!upToDate && (
        <button
          type="button"
          onClick={() => onReanalyze(selected.id)}
          data-testid="reanalyze"
          className="mt-2 w-full h-10 rounded-[5px] bg-white/[0.09] hover:bg-white/[0.14] text-[14px] font-extrabold font-display text-theme-text border-b-[3px] border-black/30"
        >
          Re-run review at {selected.name}
        </button>
      )}
    </div>
  );
};

export default AnalysisDepth;
