import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Game } from '@/data/types';
import { gameRepository } from '@/data/repositories';
import { api } from '@/data/api';
import { GameList } from './GameList';
import { GameSummary } from './GameSummary';
import { ReviewBoard } from './ReviewBoard';
import { PieceHopper } from '@/components/LoadingScreen';
import { AnalysisLevel, loadLevel, saveLevel } from './analysisLevels';

export const ReviewRouter: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();

  // Extract ID from pathname if wildcard
  const pathParts = window.location.pathname.split('/review/');
  const gameId = params.id || (pathParts.length > 1 && pathParts[1] ? pathParts[1] : null);

  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<number | null>(null);
  const [level, setLevelState] = useState<AnalysisLevel['id']>(() => loadLevel());
  const viewKey = `all_chess_review_view_${gameId}`;
  const readView = (): 'summary' | 'board' => {
    try {
      return sessionStorage.getItem(viewKey) === 'board' ? 'board' : 'summary';
    } catch {
      return 'summary';
    }
  };
  const [activeView, setActiveViewState] = useState<'summary' | 'board'>(readView);
  // Remember which screen of this review is open, so a remount (tab return, hot reload) lands in the same place
  const setActiveView = (v: 'summary' | 'board') => {
    setActiveViewState(v);
    try {
      sessionStorage.setItem(viewKey, v);
    } catch {
      // ignore
    }
  };
  const setLevel = (id: AnalysisLevel['id']) => {
    setLevelState(id);
    saveLevel(id);
  };

  /** Runs (or re-runs) the Stockfish review on the backend and waits for it. Returns the fresh game. */
  const analyzeGame = async (id: string, lvl: string, force: boolean, isActive: () => boolean): Promise<Game | null> => {
    const analyzeRes = await api.post<{ jobId: string }>(`/games/${id}/analyze`, { level: lvl, force });
    const jobId = analyzeRes?.jobId;
    if (!jobId) return null;
    for (let attempts = 0; attempts < 300 && isActive(); attempts++) {
      await new Promise((r) => setTimeout(r, 800));
      try {
        const job = await api.get<{ id: string; status: 'queued' | 'processing' | 'done' | 'failed'; progress: number }>(`/jobs/${jobId}`);
        if (job.status === 'done') return gameRepository.getGameById(id);
        if (job.status === 'failed') return null;
        if (isActive()) setAnalysisProgress(job.progress);
      } catch {
        // transient error during polling
      }
    }
    return null;
  };

  const reanalyze = async (lvl: AnalysisLevel['id']) => {
    if (!gameId) return;
    setLevel(lvl);
    setLoading(true);
    setAnalysisProgress(0);
    try {
      const fresh = await analyzeGame(gameId, lvl, true, () => true);
      if (fresh) setCurrentGame(fresh);
    } catch (err) {
      console.error('Failed to re-analyze game:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!gameId) {
      setCurrentGame(null);
      return;
    }

    let active = true;
    setLoading(true);
    setAnalysisProgress(null);
    setActiveViewState(readView());

    const loadAndAnalyze = async () => {
      try {
        let game = await gameRepository.getGameById(gameId);
        if (!active || !game) {
          if (active) {
            setCurrentGame(null);
            setLoading(false);
          }
          return;
        }

        // Check if game has analysis (accuracy and move evals)
        const isAnalyzed =
          game.accuracy !== undefined &&
          game.accuracy !== null &&
          game.moves &&
          game.moves.length > 0 &&
          game.moves[0].eval !== undefined;

        if (!isAnalyzed && import.meta.env.VITE_USE_MOCKS !== 'true') {
          try {
            const analyzed = await analyzeGame(gameId, loadLevel(), false, () => active);
            if (active && analyzed) game = analyzed;
          } catch (analyzeErr) {
            console.error('Failed to analyze game:', analyzeErr);
          }
        }

        if (active) {
          setCurrentGame(game);
          setLoading(false);
        }
      } catch {
        if (active) {
          setCurrentGame(null);
          setLoading(false);
        }
      }
    };

    loadAndAnalyze();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  // If no gameId, render the games list
  if (!gameId) {
    return <GameList onSelectGame={(id) => navigate(`/review/${id}`)} />;
  }

  // Loading state: one centred loader (no empty board/panel placeholders)
  if (loading) {
    return (
      <div className="flex-1 min-h-[80vh] flex flex-col items-center justify-center gap-3 p-6 select-none" data-testid="review-loading" role="status" aria-live="polite">
        <PieceHopper size={260} />
        <div className="text-[24px] leading-7 font-display font-extrabold text-theme-text text-center">
          {analysisProgress !== null ? 'Analyzing your game…' : 'Opening your game…'}
        </div>
        {analysisProgress !== null && (
          <>
            <div className="text-[14px] text-theme-muted -mt-1">Stockfish is checking every move · {analysisProgress}%</div>
            <div className="w-64 h-2.5 bg-black/30 rounded-full overflow-hidden" aria-hidden="true">
              <div className="h-full bg-[#81b64c] transition-all duration-300 rounded-full" style={{ width: `${analysisProgress}%` }} />
            </div>
          </>
        )}
      </div>
    );
  }

  // If game not found
  if (!currentGame) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold font-display text-theme-text">Game Not Found</h2>
        <button
          type="button"
          onClick={() => navigate('/review')}
          className="text-amber-500 font-bold hover:underline"
        >
          Return to Game List
        </button>
      </div>
    );
  }

  // Cross-fade between Summary and Review Board in 200ms without height jump
  return (
    <div className="relative w-full h-full overflow-hidden min-h-0 flex flex-col flex-1">
      <AnimatePresence mode="wait">
        {activeView === 'summary' ? (
          <motion.div
            key="summary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full flex flex-col flex-1 min-h-0"
          >
            <GameSummary
              game={currentGame}
              level={level}
              onLevelChange={setLevel}
              onReanalyze={reanalyze}
              onStartReview={() => setActiveView('board')}
            />
          </motion.div>
        ) : (
          <motion.div
            key="board"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full flex flex-col flex-1 min-h-0"
          >
            <ReviewBoard
              game={currentGame}
              onBackToSummary={() => setActiveView('summary')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default ReviewRouter;
