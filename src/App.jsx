import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import AppShell from './components/layout/AppShell.jsx';
import ErrorBoundary from './components/system/ErrorBoundary.jsx';
import PageLoader from './components/system/PageLoader.jsx';

const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const ForecastDetailsPage = lazy(() => import('./pages/ForecastDetailsPage.jsx'));
const FavoriteCitiesPage = lazy(() => import('./pages/FavoriteCitiesPage.jsx'));
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'));

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <AppShell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/forecast" element={<ForecastDetailsPage />} />
            <Route path="/favorites" element={<FavoriteCitiesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </AppShell>
      </Suspense>
    </ErrorBoundary>
  );
}