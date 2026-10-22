import React from 'react';
import { Modal } from '@/components/Modal';

interface PromotionDialogProps {
  isOpen: boolean;
  color: 'w' | 'b';
  pieceBasePath: string;
  onSelect: (piece: 'q' | 'r' | 'b' | 'n') => void;
  onCancel: () => void;
}

export const PromotionDialog: React.FC<PromotionDialogProps> = ({
  isOpen,
  color,
  pieceBasePath,
  onSelect,
  onCancel,
}) => {
  const pieces: Array<{ type: 'q' | 'r' | 'b' | 'n'; label: string; file: string }> = [
    { type: 'q', label: 'Queen', file: `${color}Q.svg` },
    { type: 'r', label: 'Rook', file: `${color}R.svg` },
    { type: 'b', label: 'Bishop', file: `${color}B.svg` },
    { type: 'n', label: 'Knight', file: `${color}N.svg` },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Pawn Promotion" maxWidth="sm">
      <div className="grid grid-cols-4 gap-3 p-2">
        {pieces.map((p) => (
          <button
            key={p.type}
            type="button"
            onClick={() => onSelect(p.type)}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-theme-raised hover:bg-amber-500/20 border border-theme-border hover:border-amber-500 transition-all active:scale-95 group"
          >
            <img
              src={`${pieceBasePath}/${p.file}`}
              alt={p.label}
              className="w-14 h-14 object-contain transition-transform group-hover:scale-110 drop-shadow"
            />
            <span className="text-xs font-semibold mt-1.5 text-theme-text">{p.label}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
};
