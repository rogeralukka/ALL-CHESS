import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MOCK_LEARN_STAGES } from '@/data/mock/mockLearn';
import { SECTION_ORDER, SLOT_X, buildLayout, linearProgress, pieceForTitle } from '@/features/learn/learnLayout';
import LearnPath from '@/features/learn/LearnPath';

const ordered = SECTION_ORDER.flatMap((c) => MOCK_LEARN_STAGES.filter((s) => s.category === c));

describe('Learn path layout', () => {
  it('climbs one row per lesson, zig-zagging left, middle, right, middle', () => {
    const { items } = buildLayout(ordered);
    const nodes = items.filter((i) => i.kind === 'node');
    expect(nodes).toHaveLength(ordered.length);
    for (let i = 1; i < nodes.length; i++) expect(nodes[i].row).toBeGreaterThan(nodes[i - 1].row);
    for (const n of nodes) {
      if (n.kind !== 'node') continue;
      if (n.row % 2 === 1) expect(n.slot).toBe('c');
      else expect(['l', 'r']).toContain(n.slot);
      expect(SLOT_X[n.slot]).toBeGreaterThan(0);
    }
  });

  it('puts a cap medallion (odd row) and a "next section" label between sections, never overlapping a tile', () => {
    const { items } = buildLayout(ordered);
    const medals = items.filter((i) => i.kind === 'medal');
    const labels = items.filter((i) => i.kind === 'label');
    expect(medals).toHaveLength(SECTION_ORDER.length - 1);
    expect(labels).toHaveLength(SECTION_ORDER.length - 1);
    medals.forEach((m) => expect(m.row % 2).toBe(1));
    const rows = items.map((i) => (i.kind === 'node' ? i.row : -1)).filter((r) => r >= 0);
    labels.forEach((l) => expect(rows).not.toContain(l.row));
  });

  it('keeps exactly one next lesson on the path', () => {
    const lin = linearProgress(ordered);
    expect(lin.filter((s) => s.status === 'current')).toHaveLength(1);
    const idx = lin.findIndex((s) => s.status === 'current');
    expect(lin.slice(0, idx).every((s) => s.status === 'done')).toBe(true);
    expect(lin.slice(idx + 1).every((s) => s.status === 'locked')).toBe(true);
  });

  it('chooses a piece for a lesson tile from its title', () => {
    expect(pieceForTitle('King + Rook vs King')).toBe('R');
    expect(pieceForTitle('Rook Behind the Pawn')).toBe('R');
    expect(pieceForTitle('Pawn Chains')).toBe('P');
    expect(pieceForTitle('Something else')).toBe('K');
  });
});

describe('Learn screen', () => {
  it('shows the path with a Next tile, the section label and a Next Lesson button', () => {
    render(
      <MemoryRouter>
        <LearnPath />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('learn-map')).toBeTruthy();
    expect(screen.getByText('Next')).toBeTruthy();
    expect(screen.getAllByTestId('next-section').length).toBeGreaterThan(0);
    expect(screen.getByTestId('next-lesson').textContent).toContain('Next Lesson');
  });
});
