import { Game, OpeningStat, RatingPoint, Puzzle, LessonStage, Friend, ScoutProfile, TopEngineLine, MoveClassification } from '../types';
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
  getPhasePointsLost(): Promise<{ opening: number; middlegame: number; endgame: number }>;
  getStrengthsAndWeaknesses(): Promise<{ strengths: typeof MOCK_STRENGTHS; weaknesses: typeof MOCK_WEAKNESSES }>;
}

export interface IPuzzleRepository {
  getPuzzles(): Promise<Puzzle[]>;
  getPuzzleById(id: string): Promise<Puzzle | null>;
  getDailyPuzzle(): Promise<Puzzle>;
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
  getProfile(username: string): Promise<ScoutProfile | null>;
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

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

// --- GAME REPOSITORY ---
export const gameRepository: IGameRepository = {
  async getGames(filter) {
    if (USE_MOCKS) {
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

    const qs = params.toString();
    try {
      return await api.get<Game[]>(`/games${qs ? `?${qs}` : ''}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        return [];
      }
      throw err;
    }
  },

  async getGameById(id: string) {
    if (USE_MOCKS) {
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
    if (USE_MOCKS) {
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
    if (USE_MOCKS) {
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
    if (USE_MOCKS) {
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
    if (USE_MOCKS) {
      return MOCK_PHASE_POINTS_LOST;
    }
    try {
      return await api.get<{ opening: number; middlegame: number; endgame: number }>('/stats/phases');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        return { opening: 0, middlegame: 0, endgame: 0 };
      }
      throw err;
    }
  },

  async getStrengthsAndWeaknesses() {
    if (USE_MOCKS) {
      return { strengths: MOCK_STRENGTHS, weaknesses: MOCK_WEAKNESSES };
    }
    try {
      return await api.get<{ strengths: typeof MOCK_STRENGTHS; weaknesses: typeof MOCK_WEAKNESSES }>('/stats/insights');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        return { strengths: [], weaknesses: [] };
      }
      throw err;
    }
  },
};

// --- MOCK FALLBACKS (PHASE 3 ENPOINTS) ---
console.info('[ALL-CHESS] friendRepository: using mock fallback (Phase 3)');
console.info('[ALL-CHESS] puzzleRepository: using mock fallback (Phase 3)');
console.info('[ALL-CHESS] learnRepository: using mock fallback (Phase 3)');
console.info('[ALL-CHESS] scoutRepository: using mock fallback (Phase 3)');

export const puzzleRepository: IPuzzleRepository = {
  async getPuzzles() {
    return MOCK_PUZZLES;
  },
  async getPuzzleById(id: string) {
    return MOCK_PUZZLES.find((p) => p.id === id) || null;
  },
  async getDailyPuzzle() {
    return MOCK_PUZZLES[0];
  },
};

export const learnRepository: ILearnRepository = {
  async getStages(category) {
    if (!category) return MOCK_LEARN_STAGES;
    return MOCK_LEARN_STAGES.filter((s) => s.category === category);
  },
  async getStageById(id: string) {
    return MOCK_LEARN_STAGES.find((s) => s.id === id) || null;
  },
};

export const friendRepository: IFriendRepository = {
  async getFriends() {
    return MOCK_FRIENDS;
  },
  async addFriend(username: string) {
    const newFriend: Friend = {
      id: `f-${Date.now()}`,
      username,
      rating: 900,
      online: true,
      lastActive: 'Just now',
    };
    return newFriend;
  },
};

export const scoutRepository: IScoutRepository = {
  async searchProfiles(query: string) {
    const q = query.toLowerCase();
    return Object.values(MOCK_SCOUT_PROFILES).filter((p) => p.username.toLowerCase().includes(q));
  },
  async getProfile(username: string) {
    return MOCK_SCOUT_PROFILES[username] || null;
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
