export type MoveClassification =
  | 'brilliant'
  | 'great'
  | 'book'
  | 'forced'
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
  /** One proven sentence about the move, or null when there is nothing concrete to say */
  why?: string | null;
  pv: string[];
}

export interface MoveEval {
  eval: number; // MOCK
  mate?: number | null;
  bestMove?: string;
  /** Signed mate distance (5 = mate in 5 for White, -5 = for Black); null when not a mate */
  mateIn?: number | null;
  winPct?: number;
  why?: string;
  lines?: TopEngineLine[];
}

/** Review annotations computed by the backend (arrows, highlighted squares, best move and refutation) */
export interface MoveRef {
  san: string;
  from: string;
  to: string;
  uci: string;
}

export interface MoveAnnotations {
  tint?: MoveClassification | null;
  arrows?: { from: string; to: string; kind: 'best' | 'refutation' | 'threat' | 'played' | 'missed' | 'alt' }[];
  squares?: { square: string; kind: 'attacked' | 'hanging' | 'target' | 'king-danger'; reason: string; tone?: 'green' | 'orange' }[];
  bestMove?: MoveRef | null;
  /** The engine's best move in UCI (e.g. e3e4), so the arrow needs no SAN parsing */
  bestUci?: string | null;
  refutation?: MoveRef | null;
  pv?: string[] | null;
  /** Commentary v2: why the move was good or bad, one proven sentence each */
  explain?: string[] | null;
  reasonCode?: string | null;
  comment?: string | null;
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
  annotations?: MoveAnnotations;
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
  /** Where the game was played: a linked site, or 'coach' for games played here on ALL-CHESS (older rows may have none). */
  platform?: 'chesscom' | 'lichess' | 'coach' | null;
  isUserWhite?: boolean;
  opening: Opening;
  moves: Move[];
  /** Half-moves in the game; sent by the light games list, which leaves out `moves` */
  moveCount?: number;
  /** True when the last move was mate (light list only) */
  endsInMate?: boolean;
  accuracy?: {
    white: number; // MOCK
    black: number; // MOCK
  };
  estimatedRating?: {
    white: number; // MOCK
    black: number; // MOCK
  };
  /** Either one grade set (the signed-in player's colour) or one per colour. */
  phaseGrades?: PhaseGrade | { white?: PhaseGrade; black?: PhaseGrade };
  /** How the game ended, e.g. "Resignation", "Timeout", "Checkmate" (the backend fills this from the PGN Termination header). */
  termination?: string;
  /** Stockfish depth the review was produced at, and the level id that asked for it. */
  analysisDepth?: number;
  analysisLevel?: string;
}

export interface StrengthWeakness {
  label: string;
  delta: string;
  type: 'strength' | 'weakness';
}

/** Points lost per game by phase, measured over the games that have been reviewed. */
export interface PhasePointsLost {
  opening: number;
  middlegame: number;
  endgame: number;
  /** How many reviewed games the averages come from; 0 means there is nothing to show yet. */
  totalAnalyzed?: number;
}

export interface Insights {
  strengths: StrengthWeakness[];
  weaknesses: StrengthWeakness[];
  /** How many reviewed games the insights come from; 0 means there is nothing to show yet. */
  totalAnalyzed?: number;
}

export interface OpeningStat {
  eco: string;
  name: string;
  games: number;
  winRate: number;
  drawRate: number;
  lossRate: number;
  /** null when the games had no accuracy data */
  avgAccuracy: number | null;
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
  /** Present on puzzles served by the API (Lichess set). UCI is safer than SAN for promotions. */
  solutionUci?: string[];
  /** The opponent's move that was already played to reach `fen` (highlight it as the last move). */
  setupMoveUci?: string | null;
  popularity?: number | null;
  nbPlays?: number | null;
  gameUrl?: string | null;
  openingTags?: string[] | null;
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
  status: 'locked' | 'current' | 'done' | 'unlocked';
  xp: number;
  description: string;
  steps: LessonStep[];
}

export interface Friend {
  id: string;
  username: string;
  rating: number;
  ratings?: {
    rapid?: number;
    blitz?: number;
    bullet?: number;
  };
  online: boolean;
  avatarUrl?: string;
  lastActive?: string;
}

export interface ScoutProfile {
  username: string;
  /** null when the platform shows no rating for this player */
  rating: number | null;
  title?: string | null;
  /** null when no games could be read */
  winRate: number | null;
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
