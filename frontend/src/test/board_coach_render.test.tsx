import { StrictMode } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, act, fireEvent } from '@testing-library/react';
import { Board } from '@/features/board/Board';
import { CoachBubble } from '@/features/coach/CoachBubble';
import { BOARD_THEMES, PIECE_SETS } from '@/data/boardThemes';

const defaultTheme = BOARD_THEMES[0];
const defaultPieceSet = PIECE_SETS[0];

describe('Board Render under React.StrictMode (P0 Dev Bug Prevention)', () => {
  it('renders 32 pieces for the standard initial position under StrictMode', () => {
    const { container } = render(
      <StrictMode>
        <Board
          fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          boardTheme={defaultTheme}
          pieceSet={defaultPieceSet}
          interactive={false}
          coordinates="none"
        />
      </StrictMode>
    );

    const pieces = container.querySelectorAll('[data-piece="true"]');
    expect(pieces.length).toBe(32);
  });

  it('updates and preserves piece count after fen change under StrictMode', () => {
    const { container, rerender } = render(
      <StrictMode>
        <Board
          fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          boardTheme={defaultTheme}
          pieceSet={defaultPieceSet}
          interactive={false}
          coordinates="none"
        />
      </StrictMode>
    );

    expect(container.querySelectorAll('[data-piece="true"]').length).toBe(32);

    // Change to move 6 blunder position (31 pieces after Bxf7+)
    rerender(
      <StrictMode>
        <Board
          fen="r1bqk1nr/pppp1Bpp/2n5/4p3/1b2P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 6"
          boardTheme={defaultTheme}
          pieceSet={defaultPieceSet}
          interactive={false}
          coordinates="none"
        />
      </StrictMode>
    );

    const piecesAfter = container.querySelectorAll('[data-piece="true"]');
    expect(piecesAfter.length).toBe(31);
  });
});

describe('CoachBubble Typing and StrictMode Stability', () => {
  it('renders complete text when passed via text= prop under StrictMode without freezing', async () => {
    vi.useFakeTimers();

    const sampleText = 'Welcome back! Today we are mastering King and Pawn opposition.';
    const { container } = render(
      <StrictMode>
        <CoachBubble text={sampleText} />
      </StrictMode>
    );

    // Fast-forward past typewriter interval
    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(container.querySelector('[aria-hidden="true"]')?.textContent).toBe(sampleText);
    vi.useRealTimers();
  });

  it('renders complete text when passed via messages= prop under StrictMode', async () => {
    vi.useFakeTimers();

    const messageText = 'Spotting back-rank pawn barriers and delivering deflection checkmates.';
    const messages = [
      {
        id: 'msg-test-1',
        text: messageText,
      },
    ];

    const { container } = render(
      <StrictMode>
        <CoachBubble messages={messages} />
      </StrictMode>
    );

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(container.querySelector('[aria-hidden="true"]')?.textContent).toBe(messageText);
    vi.useRealTimers();
  });

  it('immediately reveals full text upon clicking the bubble (skip typewriter)', () => {
    const sampleText = 'Click to skip typing immediately.';
    const { container } = render(
      <CoachBubble text={sampleText} />
    );

    const bubble = container.querySelector('.cursor-pointer');
    expect(bubble).toBeTruthy();
    if (bubble) {
      fireEvent.click(bubble);
    }

    expect(container.querySelector('[aria-hidden="true"]')?.textContent).toBe(sampleText);
  });
});
