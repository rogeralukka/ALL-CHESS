import React from 'react';
import { Chess, PieceSymbol } from 'chess.js';

interface CaptureTallyProps {
  fen: string;
  color: 'white' | 'black'; // which player row this tally is for
  pieceBasePath: string;
  className?: string;
}

const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

export const CaptureTally: React.FC<CaptureTallyProps> = ({
  fen,
  color,
  pieceBasePath,
  className = '',
}) => {
  let whiteMaterial = 0;
  let blackMaterial = 0;
  const whitePiecesOnBoard: Record<PieceSymbol, number> = { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };
  const blackPiecesOnBoard: Record<PieceSymbol, number> = { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };

  try {
    const c = new Chess(fen);
    const board = c.board();
    for (const row of board) {
      for (const piece of row) {
        if (piece) {
          if (piece.color === 'w') {
            whitePiecesOnBoard[piece.type] = (whitePiecesOnBoard[piece.type] || 0) + 1;
            whiteMaterial += PIECE_VALUES[piece.type];
          } else {
            blackPiecesOnBoard[piece.type] = (blackPiecesOnBoard[piece.type] || 0) + 1;
            blackMaterial += PIECE_VALUES[piece.type];
          }
        }
      }
    }
  } catch {
    // fallback
  }

  const initialPieces: Record<PieceSymbol, number> = {
    q: 1,
    r: 2,
    b: 2,
    n: 2,
    p: 8,
    k: 1,
  };

  // Pieces captured by White are the missing Black pieces
  const capturedByWhite: Array<{ type: PieceSymbol; count: number }> = [];
  // Pieces captured by Black are the missing White pieces
  const capturedByBlack: Array<{ type: PieceSymbol; count: number }> = [];

  (['q', 'r', 'b', 'n', 'p'] as PieceSymbol[]).forEach((type) => {
    const missingBlack = Math.max(0, initialPieces[type] - blackPiecesOnBoard[type]);
    if (missingBlack > 0) capturedByWhite.push({ type, count: missingBlack });

    const missingWhite = Math.max(0, initialPieces[type] - whitePiecesOnBoard[type]);
    if (missingWhite > 0) capturedByBlack.push({ type, count: missingWhite });
  });

  const isWhite = color === 'white';
  const captured = isWhite ? capturedByWhite : capturedByBlack;
  const materialAdvantage = isWhite ? whiteMaterial - blackMaterial : blackMaterial - whiteMaterial;
  const opponentPiecePrefix = isWhite ? 'b' : 'w';

  return (
    <div className={`flex items-center gap-1 text-xs select-none ${className}`}>
      {/* Captured piece icons */}
      <div className="flex items-center -space-x-1">
        {captured.map(({ type, count }) => (
          <div key={`cap-${type}`} className="flex items-center" title={`${count} captured`}>
            {Array.from({ length: Math.min(count, 4) }).map((_, i) => (
              <img
                key={`p-${type}-${i}`}
                src={`${pieceBasePath}/${opponentPiecePrefix}${type.toUpperCase()}.svg`}
                alt={type}
                className="w-4 h-4 object-contain opacity-75"
              />
            ))}
          </div>
        ))}
      </div>

      {/* Material advantage e.g. +2 */}
      {materialAdvantage > 0 && (
        <span className="font-bold text-xs font-mono ml-1 text-theme-text/80">
          +{materialAdvantage}
        </span>
      )}
    </div>
  );
};
