import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Game } from '@/data/types';
import { gameRepository } from '@/data/repositories';
import { GameList } from './GameList';
import { GameSummary } from './GameSummary';
import { ReviewBoard } from './ReviewBoard';
import { Skeleton } from '@/components/Skeleton';

export const ReviewRouter: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();

  // Extract ID from pathname if wildcard
  const pathParts = window.location.pathname.split('/review/');
  const gameId = params.id || (pathParts.length > 1 && pathParts[1] ? pathParts[1] : null);

  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<'summary' | 'board'>('summary');

  useEffect(() => {
    if (!gameId) {
      setCurrentGame(null);
      return;
    }

    setLoading(true);
    gameRepository.getGameById(gameId).then((g) => {
      setCurrentGame(g);
      setLoading(false);
      setActiveView('summary');
    });
  }, [gameId]);

  // If no gameId, render the games list
  if (!gameId) {
    return <GameList onSelectGame={(id) => navigate(`/review/${id}`)} />;
  }

  // Loading state with layout matching board + right panel exactly
  if (loading) {
    return (
      <div className="flex-1 flex flex-col lg:flex-row h-full w-full overflow-hidden animate-pulse">
        {/* Left Board Zone */}
        <div className="flex-1 flex flex-col items-center justify-center p-3 md:p-6 bg-theme-page min-w-0">
          <div className="w-full max-w-[min(calc(100vh-120px),800px)] flex flex-col gap-2">
            <div className="h-6 w-48 bg-theme-raised/60 rounded" />
            <div className="aspect-square w-full rounded-sm bg-theme-raised/70 border border-theme-border/40 shadow-2xl" />
            <div className="h-6 w-36 bg-theme-raised/60 rounded" />
          </div>
        </div>

        {/* Right Panel Zone (480-500px) */}
        <div className="w-full lg:w-[480px] xl:w-[500px] flex-shrink-0 flex flex-col h-full bg-theme-card border-t lg:border-t-0 lg:border-l border-theme-border p-4 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton circle width={84} height={84} />
            <div className="flex-1 space-y-2">
              <Skeleton height={20} width="60%" />
              <Skeleton height={48} width="100%" />
            </div>
          </div>
          <Skeleton height={90} className="rounded-xl" />
          <div className="flex justify-between items-center p-3 rounded-xl bg-theme-raised/40">
            <div className="flex items-center gap-2">
              <Skeleton circle width={32} height={32} />
              <Skeleton width={80} height={16} />
            </div>
            <Skeleton width={50} height={24} className="rounded" />
          </div>
          <div className="space-y-2">
            <Skeleton height={28} className="rounded-md" />
            <Skeleton height={28} className="rounded-md" />
            <Skeleton height={28} className="rounded-md" />
          </div>
          <div className="pt-4 mt-auto">
            <Skeleton height={48} className="rounded-xl w-full" />
          </div>
        </div>
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
