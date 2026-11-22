import React from 'react';
import { useNavigation } from './navigation';
import { GlobalErrorBoundary } from '../components/common/GlobalErrorBoundary';
import { HomePage } from '../features/home/HomePage';
import { MissionBriefingPage } from '../features/missions/MissionBriefingPage';
import { SimulationPreviewPage } from '../features/missions/SimulationPreviewPage';
import { Button } from '../components/ui/Button';

export const App: React.FC = () => {
  const { currentRoute, announcement, navigateTo } = useNavigation();

  const renderCurrentView = () => {
    switch (currentRoute) {
      case 'home':
        return <HomePage onStart={() => navigateTo('briefing')} />;
      case 'briefing':
        return (
          <MissionBriefingPage
            onBeginPreview={() => navigateTo('preview')}
            onBack={() => navigateTo('home')}
          />
        );
      case 'preview':
        return <SimulationPreviewPage onReturnToBriefing={() => navigateTo('briefing')} />;
      case 'not-found':
      default:
        return (
          <main
            id="main-content"
            className="view-transition"
            style={{
              padding: 'var(--space-12) var(--space-5)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-4)',
              maxWidth: '480px',
              margin: 'auto',
            }}
          >
            <h1 className="text-title" tabIndex={-1}>
              Page Not Found
            </h1>
            <p className="text-body" style={{ color: 'var(--color-secondary-text)' }}>
              The requested simulation route does not exist. Return to the briefing or main home canvas.
            </p>
            <Button
              variant="primary"
              onClick={() => navigateTo('home')}
            >
              Return to ScamSignal Home
            </Button>
          </main>
        );
    }
  };

  return (
    <GlobalErrorBoundary>
      <div className="bg-atmosphere" aria-hidden="true" />
      {/* Route change announcer for screen readers */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
      <div
        className="app-shell"
        style={{
          position: 'relative',
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
        }}
      >
        {renderCurrentView()}
      </div>
    </GlobalErrorBoundary>
  );
};
