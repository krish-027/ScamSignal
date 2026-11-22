import React from 'react';
import { useNavigation } from './navigation';
import { GlobalErrorBoundary } from '../components/common/GlobalErrorBoundary';
import { HomePage } from '../features/home/HomePage';
import { MissionBriefingPage } from '../features/missions/MissionBriefingPage';
import { SimulationPreviewPage } from '../features/missions/SimulationPreviewPage';

export const App: React.FC = () => {
  const { currentRoute, navigateTo } = useNavigation();

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
      default:
        return (
          <div
            style={{
              padding: 'var(--space-8)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-4)',
            }}
          >
            <h1 className="text-title">Route Not Found</h1>
            <p className="text-body">The requested simulation view is not recognized.</p>
            <button
              onClick={() => navigateTo('home')}
              className="app-button btn-primary"
              style={{ padding: '0 20px', minHeight: '44px' }}
            >
              Return to ScamSignal Home
            </button>
          </div>
        );
    }
  };

  return (
    <GlobalErrorBoundary>
      <div className="bg-atmosphere" aria-hidden="true" />
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
