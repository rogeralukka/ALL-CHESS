import { LessonStage } from '@/data/types';

export type SectionId = LessonStage['category'];

/** Order the sections appear on the path, bottom to top (as on Chess.com: start at the bottom, climb up). */
export const SECTION_ORDER: SectionId[] = ['openings', 'middlegame', 'endgame'];

export interface SectionTheme {
  id: SectionId;
  name: string;
  /** Upcoming tile face / side (dim) */
  tileTop: string;
  tileSide: string;
  /** The "next lesson" tile: bright face, side and glow */
  hotTop: string;
  hotSide: string;
  glow: string;
  /** Topic glyph on an upcoming tile */
  icon: string;
  /** Finished lesson tile */
  doneTop: string;
  doneSide: string;
  /** Background diamond tint */
  cell: string;
  /** Medallion disc behind the graduation cap */
  medal: string;
  /** Bottom bar + fade colours */
  bar: string;
  fade: string;
  barBtn: string;
}

/** Chess.com tints its whole Learn screen per section (teal, orange/red, indigo). */
export const SECTION_THEMES: Record<SectionId, SectionTheme> = {
  openings: {
    id: 'openings',
    name: 'Openings',
    tileTop: '#1f4f52',
    tileSide: '#163a3c',
    icon: '#3e7f80',
    doneTop: '#2a8a7a',
    doneSide: '#1d675b',
    hotTop: '#5ff2c6',
    hotSide: '#2fb995',
    glow: 'rgba(95,242,198,0.55)',
    cell: '31,100,100',
    medal: '#2b3d34',
    bar: '#1b2f2f',
    fade: '#0d4a52',
    barBtn: '#24403f',
  },
  middlegame: {
    id: 'middlegame',
    name: 'Middlegame',
    tileTop: '#7a3a1f',
    tileSide: '#5a2a15',
    icon: '#a65c38',
    doneTop: '#b8592a',
    doneSide: '#8a411d',
    hotTop: '#fb9c4c',
    hotSide: '#e2711f',
    glow: 'rgba(251,156,76,0.55)',
    cell: '150,70,30',
    medal: '#6a2d17',
    bar: '#4b2823',
    fade: '#7a2410',
    barBtn: '#603631',
  },
  endgame: {
    id: 'endgame',
    name: 'Endgames',
    tileTop: '#45408f',
    tileSide: '#322e6d',
    icon: '#6d66b8',
    doneTop: '#6a58c9',
    doneSide: '#4e3f9e',
    hotTop: '#9d82f5',
    hotSide: '#6f55d6',
    glow: 'rgba(143,114,244,0.55)',
    cell: '70,60,160',
    medal: '#2a2a5c',
    bar: '#262548',
    fade: '#2c2a74',
    barBtn: '#38366a',
  },
};

export type Slot = 'l' | 'c' | 'r';
export const SLOT_X: Record<Slot, number> = { l: 27, c: 50, r: 73 };

export type MapItem =
  | { kind: 'node'; stage: LessonStage; row: number; slot: Slot; section: SectionId }
  | { kind: 'medal'; row: number; section: SectionId }
  | { kind: 'label'; row: number; section: SectionId };

export interface Layout {
  items: MapItem[];
  /** Number of rows (0 is the bottom row) */
  rows: number;
  /** Section tint for every row */
  rowSection: SectionId[];
}

/**
 * Lay the lessons out as a zig-zag path on a rotated-square grid: even rows hold a tile on the left or right,
 * odd rows hold one in the middle, so each step climbs diagonally. Between sections comes a graduation-cap
 * medallion and a "Next section" label.
 */
export function buildLayout(stages: LessonStage[]): Layout {
  const items: MapItem[] = [];
  const rowSection: SectionId[] = [];
  const mark = (row: number, s: SectionId) => {
    rowSection[row] = s;
  };

  let row = 0;
  let side: Slot = 'l';
  const sections = SECTION_ORDER.filter((s) => stages.some((st) => st.category === s));

  sections.forEach((section, si) => {
    if (si > 0) {
      // the cap medallion sits on an odd row (the middle column); the label climbs above it
      let m = row;
      if (m % 2 === 0) m += 1;
      for (let r = row; r < m; r++) mark(r, sections[si - 1]);
      items.push({ kind: 'medal', row: m, section: sections[si - 1] });
      mark(m, sections[si - 1]);
      items.push({ kind: 'label', row: m + 1, section });
      mark(m + 1, section);
      mark(m + 2, section);
      row = m + 3;
    }
    for (const stage of stages.filter((st) => st.category === section)) {
      let slot: Slot = 'c';
      if (row % 2 === 0) {
        slot = side;
        side = side === 'l' ? 'r' : 'l';
      }
      items.push({ kind: 'node', stage, row, slot, section });
      mark(row, section);
      row += 1;
    }
  });

  // a little room above the last tile and below the first
  const last = sections[sections.length - 1] ?? 'openings';
  mark(row, last);
  mark(row + 1, last);
  return { items, rows: row + 2, rowSection };
}

/** Which piece silhouette goes on a lesson tile, from its title. */
export function pieceForTitle(title: string): 'K' | 'Q' | 'R' | 'B' | 'N' | 'P' {
  const t = title.toLowerCase();
  if (t.includes('rook')) return 'R';
  if (t.includes('queen')) return 'Q';
  if (t.includes('bishop')) return 'B';
  if (t.includes('knight') || t.includes('fork')) return 'N';
  if (t.includes('pawn')) return 'P';
  return 'K';
}

/** The tile rows run bottom to top; this is the CSS height of one row in container-width units. */
export const ROW_CQW = 18.4;

/**
 * The lesson data tracks progress per category, but the path is one climb: everything finished comes first,
 * the next lesson follows, and the rest are locked. Keeps exactly one "Next" tile on the path.
 */
export function linearProgress(ordered: LessonStage[]): LessonStage[] {
  const doneCount = ordered.filter((s) => s.status === 'done').length;
  return ordered.map((s, i) => ({ ...s, status: i < doneCount ? 'done' : i === doneCount ? 'current' : 'locked' }));
}
