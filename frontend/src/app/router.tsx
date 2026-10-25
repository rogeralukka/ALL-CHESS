import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './Layout';
import { LoadingScreen } from '@/components/LoadingScreen';
import { NotFound } from './NotFound';

const Home = lazy(() => import('@/features/home/Home'));
const ReviewRouter = lazy(() => import('@/features/review/ReviewRouter'));
const PlayGame = lazy(() => import('@/features/play/PlayGame'));
const LearnPath = lazy(() => import('@/features/learn/LearnPath'));
const PuzzleScreen = lazy(() => import('@/features/puzzles/PuzzleScreen'));
const ScoutSearch = lazy(() => import('@/features/scout/ScoutSearch'));
const Profile = lazy(() => import('@/features/profile/Profile'));
const SettingsShell = lazy(() => import('@/features/settings/SettingsShell'));
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
      { path: '*', element: <NotFound /> },
    ],
  },
], {
  future: {
    v7_relativeSplatPath: true,
  },
});
