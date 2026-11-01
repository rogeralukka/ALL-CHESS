import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './Layout';
import { LoadingScreen } from '@/components/LoadingScreen';
import { NotFound } from './NotFound';

const loadHome = () => import('@/features/home/Home');
const loadReview = () => import('@/features/review/ReviewRouter');
const loadPlay = () => import('@/features/play/PlayGame');
const loadLearn = () => import('@/features/learn/LearnPath');
const loadPuzzles = () => import('@/features/puzzles/PuzzleScreen');

// The first screen downloads while the session check is still running instead of after it,
// and the other tab-bar screens follow once the browser is idle, so switching tabs is instant.
if (typeof window !== 'undefined') {
  const first = window.location.pathname.split('/')[1];
  const firstLoader = ({ review: loadReview, play: loadPlay, learn: loadLearn, puzzles: loadPuzzles } as Record<string, () => Promise<unknown>>)[first] ?? loadHome;
  firstLoader().catch(() => undefined);
  const idle = (cb: () => void) => ('requestIdleCallback' in window ? window.requestIdleCallback(cb, { timeout: 4000 }) : setTimeout(cb, 2500));
  idle(() => [loadHome, loadPuzzles, loadLearn, loadReview].forEach((f) => f().catch(() => undefined)));
}

const Home = lazy(loadHome);
const ReviewRouter = lazy(loadReview);
const PlayGame = lazy(loadPlay);
const LearnPath = lazy(loadLearn);
const PuzzleScreen = lazy(loadPuzzles);
const ScoutSearch = lazy(() => import('@/features/scout/ScoutSearch'));
const Profile = lazy(() => import('@/features/profile/Profile'));
const AdvancedStats = lazy(() => import('@/features/stats/AdvancedStats'));
const Leaderboard = lazy(() => import('@/features/leaderboard/Leaderboard'));
const SettingsShell = lazy(() => import('@/features/settings/SettingsShell'));
const CoachLab = lazy(() => import('./CoachLab'));
const Playground = lazy(() => import('./Playground').then((m) => ({ default: m.Playground })));

const LoadingFallback = () => <LoadingScreen />;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: 'review/*',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ReviewRouter />
          </Suspense>
        ),
      },
      {
        path: 'play',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PlayGame />
          </Suspense>
        ),
      },
      {
        path: 'learn',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <LearnPath />
          </Suspense>
        ),
      },
      {
        path: 'puzzles',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PuzzleScreen />
          </Suspense>
        ),
      },
      {
        path: 'scout',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ScoutSearch />
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Profile />
          </Suspense>
        ),
      },
      {
        path: 'stats',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdvancedStats />
          </Suspense>
        ),
      },
      {
        path: 'leaderboard',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Leaderboard />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <SettingsShell />
          </Suspense>
        ),
      },
      {
        path: 'dev/playground',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Playground />
          </Suspense>
        ),
      },
      {
        path: 'dev/coach',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <CoachLab />
          </Suspense>
        ),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
], {
  future: {
    v7_relativeSplatPath: true,
  },
});
