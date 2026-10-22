export type MoveClassification =
  | 'brilliant'
  | 'great'
  | 'book'
  | 'best'
  | 'excellent'
  | 'good'
  | 'inaccuracy'
  | 'mistake'
  | 'miss'
  | 'blunder';

export type CoachExpression =
  | 'neutral'
  | 'thinking'
  | 'thumbsup'
  | 'brilliant'
  | 'embarrassed'
  | 'wave';

export interface TopEngineLine {
  move: string;
  eval: number;
  mate?: number | null;
  depth: number;
  why: string;
  pv: string[];
}

export interface MoveEval {
  eval: number; // MOCK
  mate?: number | null;
  bestMove?: string;
  winPct?: number;
  why?: string;
  lines?: TopEngineLine[];
}

export interface Move {
  san: string;
  from: string;
  to: string;
  promotion?: string;
  color: 'w' | 'b';
  fen: string;
  moveNumber: number;
  classification?: MoveClassification;
  eval?: MoveEval;
  coachComment?: string;
  variation?: string[]; // Alternate lines for Explain/Best
  timeSpent?: number;
}

export interface Player {
  username: string;
  rating: number;
  title?: string;
  avatarUrl?: string;
}

export interface Opening {
  eco: string;
  name: string;
}

export interface PhaseGrade {
  opening: 'A' | 'B' | 'C' | 'D' | 'N/A';
  middlegame: 'A' | 'B' | 'C' | 'D' | 'N/A';
  tactics: 'A' | 'B' | 'C' | 'D' | 'N/A';
  endgame: 'A' | 'B' | 'C' | 'D' | 'N/A';
}

export interface Game {
  id: string;
  pgn: string;
  white: Player;
  black: Player;
  result: '1-0' | '0-1' | '1/2-1/2' | '*';
  date: string;
  timeControl: string;
  speed: 'bullet' | 'blitz' | 'rapid' | 'daily';
  source: 'online' | 'vs_coach';
  opening: Opening;
  moves: Move[];
  accuracy?: {
    white: number; // MOCK
    black: number; // MOCK
  };
  estimatedRating?: {
    white: number; // MOCK
    black: number; // MOCK
  };
  phaseGrades?: PhaseGrade; // MOCK
}

export interface OpeningStat {
  eco: string;
  name: string;
  games: number;
  winRate: number;
  drawRate: number;
  lossRate: number;
  avgAccuracy: number;
}

export interface RatingPoint {
  date: string;
  rapid: number;
  blitz: number;
  bullet: number;
}

export interface Puzzle {
  id: string;
  fen: string;
  solution: string[]; // e.g. ["Qxf7#"] or ["Nf7+", "Kg8", "Nh6#"]
  rating: number;
  theme: string[];
  goal: string;
}

export interface LessonStep {
  id: string;
  title: string;
  instruction: string;
  buttonText: string;
  fen: string;
  requiredMove?: string;
  highlightSquares?: string[];
  arrows?: Arrow[];
  isInteractive: boolean;
  explanation?: string;
}

export interface LessonStage {
  id: string;
  title: string;
  category: 'openings' | 'middlegame' | 'endgame';
  status: 'locked' | 'current' | 'done';
  xp: number;
  description: string;
  steps: LessonStep[];
}

export interface Friend {
  id: string;
  username: string;
  rating: number;
  online: boolean;
  avatarUrl?: string;
  lastActive?: string;
}

export interface ScoutProfile {
  username: string;
  rating: number;
  title?: string;
  winRate: number;
  mostPlayed: OpeningStat[];
  recentGames: Game[];
}

export interface BoardTheme {
  id: string;
  name: string;
  light: string;
  dark: string;
  texture?: string;
}

export interface PieceSet {
  id: string;
  name: string;
  basePath: string;
  license: string;
}

export interface Arrow {
  from: string;
  to: string;
  color?: 'green' | 'red' | 'blue' | 'orange';
}

export interface BoardBadge {
  square: string;
  label: MoveClassification;
}
