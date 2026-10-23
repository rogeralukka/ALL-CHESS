import React, { useEffect } from 'react';

export interface PromotionDialogProps {
  isOpen: boolean;
  color: 'w' | 'b';
  square: string; // e.g. 'e8'
  orientation?: 'white' | 'black';
  displayFiles: string[];
  displayRanks: string[];
  pieceBasePath: string;
  onSelect: (piece: 'q' | 'r' | 'b' | 'n') => void;
  onCancel: () => void;
}

export const PromotionDialog: React.FC<PromotionDialogProps> = ({
  isOpen,
  color,
  square,
  displayFiles,
  displayRanks,
  pieceBasePath,
  onSelect,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const fileChar = square[0];
  const rankChar = square[1];
  const colIndex = displayFiles.indexOf(fileChar);
  const rowIndex = displayRanks.indexOf(rankChar);

  const col = colIndex >= 0 ? colIndex : 0;
  const isTopRank = rowIndex <= 0;

  const pieces: Array<{ type: 'q' | 'n' | 'r' | 'b'; label: string; file: string }> = [
    { type: 'q', label: 'Queen', file: `${color}Q.svg` },
    { type: 'n', label: 'Knight', file: `${color}N.svg` },
    { type: 'r', label: 'Rook', file: `${color}R.svg` },
    { type: 'b', label: 'Bishop', file: `${color}B.svg` },
  ];

  return (
    <>
      {/* 40% Scrim backdrop over board */}
      <div
        className="absolute inset-0 bg-black/45 z-40 transition-opacity duration-150 animate-in fade-in"
        onClick={onCancel}
        aria-label="Cancel promotion"
      />

      {/* Vertical promotion strip positioned directly over the promotion file */}
      <div
        className="absolute w-[12.5%] h-[50%] z-50 flex flex-col bg-theme-card border-2 border-amber-500 rounded-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        style={{
          left: `${col * 12.5}%`,
          top: isTopRank ? '0%' : '50%',
        }}
        role="dialog"
        aria-label="Select promotion piece"
      >
        {pieces.map((p) => (
          <button
            key={p.type}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(p.type);
            }}
            className="w-full h-1/4 p-1 flex items-center justify-center bg-theme-card hover:bg-amber-500/25 active:bg-amber-500/40 border-b last:border-b-0 border-theme-border/60 transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            title={`Promote to ${p.label}`}
          >
            <img
              src={`${pieceBasePath}/${p.file}`}
              alt={p.label}
              className="w-full h-full object-contain pointer-events-none select-none drop-shadow transition-transform duration-100 group-hover:scale-110"
              draggable={false}
            />
          </button>
        ))}
      </div>
    </>
  );
};
export default PromotionDialog;
