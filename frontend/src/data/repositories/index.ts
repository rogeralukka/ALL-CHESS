import { Game, OpeningStat, RatingPoint, Puzzle, LessonStage, Friend, ScoutProfile, TopEngineLine, MoveClassification, PhasePointsLost, Insights } from '../types';
import { MOCK_GAMES } from '../mock/mockGames';
import { MOCK_RATING_HISTORY, MOCK_OPENING_STATS, MOCK_PHASE_POINTS_LOST, MOCK_STRENGTHS, MOCK_WEAKNESSES } from '../mock/mockStats';
import { MOCK_PUZZLES } from '../mock/mockPuzzles';
import { MOCK_LEARN_STAGES } from '../mock/mockLearn';
import { MOCK_FRIENDS } from '../mock/mockFriends';
import { MOCK_SCOUT_PROFILES } from '../mock/mockScout';
import { getRandomCoachLine, ILLEGAL_MOVE_TEACHING_LINES } from '@/features/coach/coachLines';
import { getExpressionForEvent } from '@/features/coach/expressionMap';
import { wasmEngineService } from '@/services/wasmEngineService';
import { api, ApiError } from '../api';

export interface GameFilter {
  opening?: string;
  color?: 'white' | 'black' | 'all';
  result?: 'win' | 'loss' | 'draw' | 'all';
  source?: 'online' | 'vs_coach' | 'all';
  speed?: 'bullet' | 'blitz' | 'rapid' | 'all';
  searchQuery?: string;
}

export interface IGameRepository {
  getGames(filter?: GameFilter): Promise<Game[]>;
  getGameById(id: string): Promise<Game | null>;
}

export interface RatingSummary {
  mode: 'Rapid' | 'Blitz' | 'Bullet';
  rating: number;
  deltaWeekly: number;
}

export interface IStatsRepository {
  getRatingHistory(range?: '30d' | '90d' | 'all'): Promise<RatingPoint[]>;
  getUserRatings(): Promise<RatingSummary[]>;
  getOpeningStats(): Promise<OpeningStat[]>;
  getPhasePointsLost(): Promise<PhasePointsLost>;
  getStrengthsAndWeaknesses(): Promise<Insights>;
}

export interface PuzzleThemeCount {
  theme: string;
  count: number;
}

export interface PuzzleRatingState {
  rating: number;
  streak: number;
  bestStreak: number;
  lastAttemptDate: string | null;
}

export interface PuzzleAttemptInput {
  solved: boolean;
  timeSeconds: number;
  usedHint: boolean;
}

export interface PuzzleAttemptResult {
  solved: boolean;
  rating: number;
  ratingDelta: number;
  streak: number;
  bestStreak: number;
  /** true when this puzzle was already attempted before: stored, but rating and streak do not change. */
  isRepeat: boolean;
  message: string | null;
}

export interface IPuzzleRepository {
  getPuzzles(): Promise<Puzzle[]>;
  getPuzzleById(id: string): Promise<Puzzle | null>;
  getDailyPuzzle(): Promise<Puzzle>;
  /** One unsolved puzzle near the player's rating (optionally of one theme). null when the server can't be used. */
  getNextPuzzle(theme?: string): Promise<Puzzle | null>;
  /** One unsolved puzzle inside a rating band (used by the level map). null when none / unavailable. */
  getPuzzleInRange(minRating: number, maxRating: number, theme?: string): Promise<Puzzle | null>;
  getThemes(): Promise<PuzzleThemeCount[]>;
  getRating(): Promise<PuzzleRatingState | null>;
  submitAttempt(id: string, input: PuzzleAttemptInput): Promise<PuzzleAttemptResult | null>;
}

export interface ILearnRepository {
  getStages(category?: 'openings' | 'middlegame' | 'endgame'): Promise<LessonStage[]>;
  getStageById(id: string): Promise<LessonStage | null>;
}

export interface IFriendRepository {
  getFriends(): Promise<Friend[]>;
  addFriend(username: string): Promise<Friend>;
}

export interface IScoutRepository {
  searchProfiles(query: string): Promise<ScoutProfile[]>;
  /** Live scouting report. Resolves null when the player has no public games; throws when the service can't be reached. */
  getProfile(username: string, platform?: 'chesscom' | 'lichess'): Promise<ScoutProfile | null>;
}

export interface IEngineService {
  getBestMove(fen: string, depth?: number): Promise<{ move: string; eval: number; why: string }>;
  getTopLines(fen: string, depth?: number): Promise<TopEngineLine[]>;
}

export interface ICoachNarrator {
  getReaction(classification: MoveClassification, moveSan?: string): { text: string; expression: ReturnType<typeof getExpressionForEvent> };
  getIllegalMoveTeaching(): string;
  getWelcomeLine(): string;
}

const isMockMode = () => import.meta.env.VITE_USE_MOCKS === 'true';

/**
 * The games list is large (every move of every game), and several screens ask for it at once
 * (the shell's auto-sync check, Home, Profile). Share one request per filter and keep it briefly,
 * dropping it as soon as anything changes a game.
 */
const GAMES_TTL_MS = 30_000;
const gamesCache = new Map<string, { at: number; promise: Promise<Game[]> }>();
export function invalidateGamesCache() {
  gamesCache.clear();
}
if (typeof window !== 'undefined') {
  window.addEventListener('chess-data-refresh', invalidateGamesCache);
  window.addEventListener('all-chess:games-changed', invalidateGamesCache);
}

// --- GAME REPOSITORY ---
export const gameRepository: IGameRepository = {
  async getGames(filter) {
    if (isMockMode()) {
      let result = [...MOCK_GAMES];
      if (!filter) return result;

      if (filter.speed && filter.speed !== 'all') {
        result = result.filter((g) => g.speed === filter.speed);
      }
      if (filter.source && filter.source !== 'all') {
        result = result.filter((g) => g.source === filter.source);
      }
      if (filter.color && filter.color !== 'all') {
        result = result.filter((g) => (filter.color === 'white' ? g.white.username === 'You' : g.black.username === 'You'));
      }
      if (filter.result && filter.result !== 'all') {
        result = result.filter((g) => {
          const isWhite = g.white.username === 'You';
          if (filter.result === 'win') return (isWhite && g.result === '1-0') || (!isWhite && g.result === '0-1');
          if (filter.result === 'loss') return (isWhite && g.result === '0-1') || (!isWhite && g.result === '1-0');
          if (filter.result === 'draw') return g.result === '1/2-1/2';
          return true;
        });
      }
      if (filter.searchQuery) {
        const q = filter.searchQuery.toLowerCase();
        result = result.filter(
          (g) =>
            g.white.username.toLowerCase().includes(q) ||
            g.black.username.toLowerCase().includes(q) ||
            g.opening.name.toLowerCase().includes(q)
        );
      }
      return result;
    }

    const params = new URLSearchParams();
    if (filter?.speed && filter.speed !== 'all') params.set('speed', filter.speed);
    if (filter?.source && filter.source !== 'all') params.set('source', filter.source);
    if (filter?.color && filter.color !== 'all') params.set('color', filter.color);
    if (filter?.result && filter.result !== 'all') params.set('result', filter.result);
    if (filter?.opening) params.set('opening', filter.opening);
    if (filter?.searchQuery) params.set('search_query', filter.searchQuery);

    // lists never need every move: ask for the light shape (moveCount instead of moves) where the backend has it
    params.set('lite', 'true');
    const qs = params.toString();
    const hit = gamesCache.get(qs);
    if (hit && Date.now() - hit.at < GAMES_TTL_MS) return hit.promise;
    const promise = api.get<Game[]>(`/games?${qs}`).then(
      (games) => games.map((g) => ({ ...g, moves: g.moves ?? [] })),
      (err) => {
        gamesCache.delete(qs);
        if (err instanceof ApiError && err.status === 401) return [];
        throw err;
      }
    );
    gamesCache.set(qs, { at: Date.now(), promise });
    return promise;
  },

  async getGameById(id: string) {
    if (isMockMode()) {
      return MOCK_GAMES.find((g) => g.id === id) || null;
    }

    try {
      return await api.get<Game>(`/games/${id}`);
    } catch (err: unknown) {
      if (err instanceof ApiError && (err.status === 404 || err.status === 401)) {
        return null;
      }
      throw err;
    }
  },
};

// --- STATS REPOSITORY ---
export const statsRepository: IStatsRepository = {
  async getRatingHistory(range) {
    if (isMockMode()) {
      return MOCK_RATING_HISTORY;
    }
    try {
      return await api.get<RatingPoint[]>(`/stats/rating-history?range=${range || '90d'}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        return [];
      }
      throw err;
    }
  },

  async getUserRatings() {
    if (isMockMode()) {
      return [
        { mode: 'Rapid', rating: 905, deltaWeekly: 15 },
        { mode: 'Blitz', rating: 870, deltaWeekly: 5 },
        { mode: 'Bullet', rating: 880, deltaWeekly: 5 },
      ];
    }
    try {
      return await api.get<RatingSummary[]>('/stats/ratings');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        return [
          { mode: 'Rapid', rating: 0, deltaWeekly: 0 },
          { mode: 'Blitz', rating: 0, deltaWeekly: 0 },
          { mode: 'Bullet', rating: 0, deltaWeekly: 0 },
        ];
      }
      throw err;
    }
  },

  async getOpeningStats() {
    if (isMockMode()) {
      return MOCK_OPENING_STATS;
    }
    try {
      return await api.get<OpeningStat[]>('/stats/openings');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        return [];
      }
      throw err;
    }
  },

  async getPhasePointsLost() {
    if (isMockMode()) {
      return MOCK_PHASE_POINTS_LOST;
    }
    try {
      return await api.get<PhasePointsLost>('/stats/phases');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        return { opening: 0, middlegame: 0, endgame: 0, totalAnalyzed: 0 };
      }
      throw err;
    }
  },

  async getStrengthsAndWeaknesses() {
    if (isMockMode()) {
      return { strengths: MOCK_STRENGTHS, weaknesses: MOCK_WEAKNESSES, totalAnalyzed: 12 };
    }
    try {
      return await api.get<Insights>('/stats/insights');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        return { strengths: [], weaknesses: [], totalAnalyzed: 0 };
      }
      throw err;
    }
  },
};

// --- PUZZLE REPOSITORY ---
export const puzzleRepository: IPuzzleRepository = {
  async getPuzzles() {
    if (isMockMode()) return MOCK_PUZZLES;
    try {
      return await api.get<Puzzle[]>('/puzzles');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return [];
      return MOCK_PUZZLES;
    }
  },
  async getPuzzleById(id: string) {
    if (isMockMode()) return MOCK_PUZZLES.find((p) => p.id === id) || null;
    try {
      return await api.get<Puzzle>(`/puzzles/${id}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return null;
      return MOCK_PUZZLES.find((p) => p.id === id) || null;
    }
  },
  async getDailyPuzzle() {
    if (isMockMode()) return MOCK_PUZZLES[0];
    try {
      return await api.get<Puzzle>('/puzzles/daily');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return MOCK_PUZZLES[0];
      return MOCK_PUZZLES[0];
    }
  },
  async getNextPuzzle(theme?: string) {
    if (isMockMode()) return null;
    try {
      const q = theme ? `?theme=${encodeURIComponent(theme)}` : '';
      return await api.get<Puzzle>(`/puzzles/next${q}`);
    } catch {
      return null;
    }
  },
  async getPuzzleInRange(minRating: number, maxRating: number, theme?: string) {
    if (isMockMode()) return null;
    try {
      const q = new URLSearchParams({ min_rating: String(minRating), max_rating: String(maxRating), limit: '1' });
      if (theme) q.set('theme', theme);
      const list = await api.get<Puzzle[]>(`/puzzles?${q.toString()}`);
      return Array.isArray(list) && list.length > 0 ? list[0] : null;
    } catch {
      return null;
    }
  },
  async getThemes() {
    if (isMockMode()) return [];
    try {
      const list = await api.get<PuzzleThemeCount[]>('/puzzles/themes');
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  },
  async getRating() {
    if (isMockMode()) return null;
    try {
      return await api.get<PuzzleRatingState>('/puzzles/rating');
    } catch {
      return null;
    }
  },
  async submitAttempt(id: string, input: PuzzleAttemptInput) {
    if (isMockMode()) return null;
    try {
      return await api.post<PuzzleAttemptResult>(`/puzzles/${encodeURIComponent(id)}/attempt`, input);
    } catch {
      return null;
    }
  },
};

// --- LEARN REPOSITORY ---
export const learnRepository: ILearnRepository = {
  async getStages(category) {
    if (isMockMode()) {
      if (!category) return MOCK_LEARN_STAGES;
      return MOCK_LEARN_STAGES.filter((s) => s.category === category);
    }
    try {
      const url = category ? `/learn/stages?category=${category}` : '/learn/stages';
      return await api.get<LessonStage[]>(url);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return [];
      return !category ? MOCK_LEARN_STAGES : MOCK_LEARN_STAGES.filter((s) => s.category === category);
    }
  },
  async getStageById(id: string) {
    if (isMockMode()) return MOCK_LEARN_STAGES.find((s) => s.id === id) || null;
    try {
      return await api.get<LessonStage>(`/learn/stages/${id}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return null;
      return MOCK_LEARN_STAGES.find((s) => s.id === id) || null;
    }
  },
};

// --- FRIEND REPOSITORY ---
export const friendRepository: IFriendRepository = {
  async getFriends() {
    if (isMockMode()) return MOCK_FRIENDS;
    try {
      return await api.get<Friend[]>('/friends');
    } catch {
      // never show sample people in the real app
      return [];
    }
  },
  async addFriend(username: string) {
    if (isMockMode()) {
      const newFriend: Friend = {
        id: `f-${Date.now()}`,
        username,
        rating: 900,
        ratings: { rapid: 900, blitz: 870, bullet: 850 },
        online: true,
        lastActive: 'Just now',
      };
      return newFriend;
    }
    return await api.post<Friend>('/friends', { username, platform: 'chesscom' });
  },
};

export const scoutRepository: IScoutRepository = {
  async searchProfiles(query: string) {
    if (isMockMode()) {
      const q = query.toLowerCase();
      return Object.values(MOCK_SCOUT_PROFILES).filter((p) => p.username.toLowerCase().includes(q));
    }
    try {
      const res = await api.get<ScoutProfile[]>(`/scout?query=${encodeURIComponent(query)}`);
      return res || [];
    } catch {
      // never show sample opponents in the real app
      return [];
    }
  },
  async getProfile(username: string, platform: 'chesscom' | 'lichess' = 'chesscom') {
    if (isMockMode()) {
      return MOCK_SCOUT_PROFILES[username] || null;
    }
    try {
      return await api.get<ScoutProfile>(`/scout/${encodeURIComponent(username)}?platform=${platform}`);
    } catch (err) {
      if (err instanceof ApiError && (err.status === 404 || err.status === 401)) return null;
      throw err;
    }
  },
};

export const engineService: IEngineService = {
  async getBestMove(fen: string, depth?: number) {
    return wasmEngineService.getBestMove(fen, depth);
  },
  async getTopLines(fen: string, depth?: number) {
    return wasmEngineService.getTopLines(fen, depth);
  },
};

export const coachNarrator: ICoachNarrator = {
  getReaction(classification: MoveClassification) {
    const text = getRandomCoachLine(classification);
    const expression = getExpressionForEvent(classification);
    return { text, expression };
  },
  getIllegalMoveTeaching() {
    return ILLEGAL_MOVE_TEACHING_LINES[Math.floor(Math.random() * ILLEGAL_MOVE_TEACHING_LINES.length)];
  },
  getWelcomeLine() {
    return getRandomCoachLine('greeting');
  },
};