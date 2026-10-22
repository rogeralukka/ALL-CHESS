import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  // Loading state
  if (loading) {
    return (
      <div className="p-8 max-w-xl mx-auto space-y-4">
        <Skeleton height={100} />
        <Skeleton height={140} />
        <Skeleton height={200} />
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

  // Toggle between Summary and Review Board
  if (activeView === 'summary') {
    return (
      <GameSummary
        game={currentGame}
        onStartReview={() => setActiveView('board')}
      />
    );
  }

  return (
    <ReviewBoard
      game={currentGame}
      onBackToSummary={() => setActiveView('summary')}
    />
  );
};
export default ReviewRouter;
