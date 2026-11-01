import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileMoveStrip } from '@/features/review/MobileMoveStrip';
import { usePhoneLayout } from '@/lib/useMediaQuery';
import type { Move } from '@/data/types';

const mv = (san: string, i: number, classification?: Move['classification']): Move => ({
  san,
  from: 'e2',
  to: 'e4',
  color: i % 2 === 0 ? 'w' : 'b',
  fen: '',
  moveNumber: Math.floor(i / 2) + 1,
  classification,
});

describe('MobileMoveStrip', () => {
  const moves = [mv('e4', 0, 'book'), mv('e5', 1, 'book'), mv('Qh5', 2, 'mistake'), mv('Nc6', 3, 'good')];

  it('renders every move with its number and marks the current one', () => {
    render(<MobileMoveStrip moves={moves} currentMoveIndex={2} onSelectMove={() => {}} onPrev={() => {}} onNext={() => {}} />);
    expect(screen.getByText('1.')).toBeInTheDocument();
    expect(screen.getByText('2.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Qh5/ })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('button', { name: /Nc6/ })).not.toHaveAttribute('aria-current');
  });

  it('tapping a move selects it and the arrows step', () => {
    const onSelect = vi.fn();
    const onPrev = vi.fn();
    const onNext = vi.fn();
    render(<MobileMoveStrip moves={moves} currentMoveIndex={0} onSelectMove={onSelect} onPrev={onPrev} onNext={onNext} />);
    fireEvent.click(screen.getByRole('button', { name: /Nc6/ }));
    expect(onSelect).toHaveBeenCalledWith(3);
    fireEvent.click(screen.getByLabelText('Previous move'));
    fireEvent.click(screen.getByLabelText('Next move'));
    expect(onPrev).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});

describe('usePhoneLayout', () => {
  it('is false when the media query does not match (desktop)', () => {
    const Probe = () => <span data-testid="p">{String(usePhoneLayout())}</span>;
    render(<Probe />);
    expect(screen.getByTestId('p').textContent).toBe('false');
  });
});
