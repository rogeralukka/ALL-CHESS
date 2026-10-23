import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act, fireEvent } from '@testing-library/react';
import { Board } from '@/features/board/Board';
import { CoachBubble } from '@/features/coach/CoachBubble';
import { CoachSpeech } from '@/features/coach/CoachSpeech';
import { IsoLevelMap } from '@/features/map/IsoLevelMap';
import { BOARD_THEMES, PIECE_SETS } from '@/data/boardThemes';

const theme = BOARD_THEMES[0];
const pieces = PIECE_SETS[0];

// jsdom has no ResizeObserver
class RO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).ResizeObserver = (globalThis as any).ResizeObserver || RO;

// jsdom has no PointerEvent: use MouseEvent so button / clientX / modifiers come through
if (typeof window.PointerEvent === 'undefined') {
  class PE extends MouseEvent {
    pointerId: number;
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerId = init.pointerId ?? 1;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).PointerEvent = PE;
}

// jsdom has no pointer capture
for (const m of ['setPointerCapture', 'releasePointerCapture'] as const) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(Element.prototype as any)[m]) (Element.prototype as any)[m] = () => {};
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (!(Element.prototype as any).hasPointerCapture) (Element.prototype as any).hasPointerCapture = () => false;

const pointer = (el: Element, type: 'pointerDown' | 'pointerUp', x = 10, y = 10) =>
  fireEvent[type](el, { clientX: x, clientY: y, pointerId: 1, button: 0, isPrimary: true });

describe('Board: click to move and click to capture', () => {
  it('selects a piece, then capturing by clicking the enemy piece calls onMove', () => {
    const onMove = vi.fn(() => true);
    // white knight on f3 can take the pawn on e5
    const { container } = render(
      <Board
        fen="rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 2"
        boardTheme={theme}
        pieceSet={pieces}
        onMove={onMove}
      />
    );
    const knight = container.querySelector('[data-piece="true"][data-square="f3"]')!;
    pointer(knight, 'pointerDown');
    pointer(knight, 'pointerUp');
    expect(container.querySelector('[data-testid="selected-square"]')).not.toBeNull();
    // e5 shows a capture ring (legal hint on an occupied square)
    expect(container.querySelectorAll('[data-testid="legal-hint"]').length).toBeGreaterThan(0);

    const pawn = container.querySelector('[data-piece="true"][data-square="e5"]')!;
    pointer(pawn, 'pointerDown');
    expect(onMove).toHaveBeenCalledWith('f3', 'e5', undefined);
  });

  it('clicking the selected piece again deselects it', () => {
    const { container } = render(
      <Board fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" boardTheme={theme} pieceSet={pieces} onMove={() => true} />
    );
    const pawn = container.querySelector('[data-piece="true"][data-square="e2"]')!;
    pointer(pawn, 'pointerDown');
    pointer(pawn, 'pointerUp');
    expect(container.querySelector('[data-testid="selected-square"]')).not.toBeNull();
    pointer(pawn, 'pointerDown');
    pointer(pawn, 'pointerUp');
    expect(container.querySelector('[data-testid="selected-square"]')).toBeNull();
  });

  it('marks checkmate: badges on both kings', () => {
    const { container } = render(
      <Board fen="3R2k1/5ppp/8/8/8/8/5PPP/6K1 b - - 1 1" boardTheme={theme} pieceSet={pieces} interactive={false} />
    );
    expect(container.querySelector('[data-testid="mate-badge-mate"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="mate-badge-win"]')).not.toBeNull();
  });
});

describe('Board: right-click annotations and quiet misclicks', () => {
  const rect = { left: 0, top: 0, width: 800, height: 800, right: 800, bottom: 800, x: 0, y: 0, toJSON: () => ({}) };
  // square centre in client px for an 800px board, white at the bottom
  const at = (sq: string) => ({ clientX: (sq.charCodeAt(0) - 97) * 100 + 50, clientY: (8 - parseInt(sq[1], 10)) * 100 + 50 });

  it('right-click marks a square, right-drag draws an arrow, a left click clears both', () => {
    const { container } = render(
      <Board fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" boardTheme={theme} pieceSet={pieces} onMove={() => true} />
    );
    const board = container.querySelector('[data-board="true"]') as HTMLElement;
    board.getBoundingClientRect = () => rect as DOMRect;

    fireEvent.pointerDown(board, { button: 2, pointerId: 2, ...at('e5') });
    fireEvent.pointerUp(board, { button: 2, pointerId: 2, ...at('e5') });
    expect(container.querySelector('[data-testid="mark-e5"]')).not.toBeNull();

    fireEvent.pointerDown(board, { button: 2, pointerId: 2, ...at('g1') });
    fireEvent.pointerMove(board, { button: 2, pointerId: 2, ...at('f3') });
    fireEvent.pointerUp(board, { button: 2, pointerId: 2, ...at('f3') });
    expect(container.querySelector('[data-testid="arrow-g1-f3"]')).not.toBeNull();

    fireEvent.pointerDown(board, { button: 0, pointerId: 1, ...at('d4') });
    expect(container.querySelector('[data-testid="mark-e5"]')).toBeNull();
    expect(container.querySelector('[data-testid="arrow-g1-f3"]')).toBeNull();
  });

  it('clicking an empty square that is not a legal move just drops the selection', () => {
    const onIllegal = vi.fn();
    const { container } = render(
      <Board
        fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        boardTheme={theme}
        pieceSet={pieces}
        onMove={() => true}
        onIllegalMove={onIllegal}
      />
    );
    const pawn = container.querySelector('[data-piece="true"][data-square="e2"]')!;
    pointer(pawn, 'pointerDown');
    pointer(pawn, 'pointerUp');
    fireEvent.click(container.querySelector('div.grid [data-square="a5"]')!);
    expect(container.querySelector('[data-testid="selected-square"]')).toBeNull();
    expect(onIllegal).not.toHaveBeenCalled();
  });
});

describe('Coach bubble: sized to the final text while typing', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('keeps the untyped remainder in the layout (invisible) so the bubble never grows mid-sentence', () => {
    const text = 'Your rook is cutting off the king. Find the move that finishes it.';
    const { container } = render(<CoachBubble text={text} />);
    act(() => {
      vi.advanceTimersByTime(120);
    });
    const spans = container.querySelectorAll('[data-testid="coach-bubble-text"] span[aria-hidden="true"]');
    expect(spans.length).toBe(2);
    const typed = spans[0].textContent || '';
    const rest = spans[1].textContent || '';
    expect(typed.length).toBeGreaterThan(0);
    expect(typed + rest).toBe(text);
    expect((spans[1] as HTMLElement).style.visibility).toBe('hidden');
    vi.useRealTimers();
  });

  it('clicking the portrait finishes the sentence', () => {
    const text = 'A long enough sentence to still be typing when the portrait is clicked.';
    const { container, getByTestId } = render(<CoachSpeech expression="neutral" text={text} />);
    act(() => {
      vi.advanceTimersByTime(60);
    });
    act(() => {
      fireEvent.click(getByTestId('coach-avatar'));
    });
    const spans = container.querySelectorAll('[data-testid="coach-bubble-text"] span[aria-hidden="true"]');
    expect(spans[0].textContent).toBe(text);
    expect(spans.length).toBe(1);
    vi.useRealTimers();
  });

  it('draws a speech tail pointing at the portrait', () => {
    const { container } = render(<CoachSpeech expression="neutral" text="Hello" size={80} />);
    expect(container.querySelector('[data-testid="coach-bubble"] svg path')).not.toBeNull();
  });
});

describe('Level map', () => {
  it('renders one tile per level with done / current / locked states and the coach on the current tile', () => {
    const onSelect = vi.fn();
    const { container } = render(<IsoLevelMap levelCount={10} currentIndex={3} onSelect={onSelect} />);
    const tiles = container.querySelectorAll('[data-testid^="map-tile-"]');
    expect(tiles.length).toBe(10);
    expect(container.querySelector('[data-testid="map-tile-0"]')!.getAttribute('data-state')).toBe('done');
    expect(container.querySelector('[data-testid="map-tile-3"]')!.getAttribute('data-state')).toBe('current');
    expect(container.querySelector('[data-testid="map-tile-7"]')!.getAttribute('data-state')).toBe('locked');
    expect(container.querySelector('[data-testid="map-coach"]')!.getAttribute('data-at')).toBe('3');

    fireEvent.click(container.querySelector('[data-testid="map-tile-1"]')!);
    expect(onSelect).toHaveBeenCalledWith(1);
    fireEvent.click(container.querySelector('[data-testid="map-tile-8"]')!);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
