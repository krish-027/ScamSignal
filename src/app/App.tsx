import React, { useState } from 'react';
import { useNavigation } from './navigation';
import { GlobalErrorBoundary } from '../components/common/GlobalErrorBoundary';
import { HomePage } from '../features/home/HomePage';
import { MissionBriefingPage } from '../features/missions/MissionBriefingPage';
import { SimulationPreviewPage } from '../features/missions/SimulationPreviewPage';
import { InvestigationPage } from '../features/missions/InvestigationPage';
import { createSession, restartMission, startMission } from '../features/missions/engine/missionEngine';
import { PARCEL_MISSION } from '../features/missions/data/parcelMission';
import { Button } from '../components/ui/Button';

export const App: React.FC = () => {
  const { currentRoute, announcement, navigateTo } = useNavigation();
  // Session lives above the router so a trip to Briefing won't discard progress.
  // Reload persistence is intentionally deferred to Batch 3.
  const [session, setSession] = useState(createSession);

  const startOrResumeInvestigation = () => {
    setSession(previous => previous.missionRecords.parcel.status === 'not_started'
      ? startMission(previous, PARCEL_MISSION)
      : previous);
    navigateTo('investigate');
  };

  const renderCurrentView = () => {
    switch (currentRoute) {
      case 'home':
        return <HomePage onStart={() => navigateTo('briefing')} />;
      case 'briefing':
        return (
          <MissionBriefingPage
            onBeginInvestigation={startOrResumeInvestigation}
            onBeginPreview={() => navigateTo('preview')}
            onBack={() => navigateTo('home')}
          />
        );
      case 'preview':
        return <SimulationPreviewPage onReturnToBriefing={() => navigateTo('briefing')} />;
      case 'investigate':
        return (
          <InvestigationPage
            session={session}
            onUpdate={setSession}
            onStart={startOrResumeInvestigation}
            onReplay={() => setSession(previous => restartMission(previous, PARCEL_MISSION))}
            onExit={() => navigateTo('briefing')}
          />
        );
      case 'not-found':
      default:
        return (
          <main
            id="main-content"
            className="view-transition"
            style={{
              padding: 'var(--space-12) var(--space-5)',
              textAlign: 'center', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 'var(--space-4)',
              maxWidth: '480px', margin: 'auto',
            }}
          >
            <h1 className="text-title" tabIndex={-1}>Page Not Found</h1>
            <p className="text-body" style={{ color: 'var(--color-secondary-text)' }}>
              This route does not exist. Return to ScamSignal Home.
            </p>
            <Button variant="primary" onClick={() => navigateTo('home')}>
              Return to ScamSignal Home
            </Button>
          </main>
        );
    }
  };

  return (
    <GlobalErrorBoundary>
      <div className="bg-atmosphere" aria-hidden="true" />
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
      <div className="app-shell" style={{
        position: 'relative', minHeight: '100dvh', display: 'flex',
        flexDirection: 'column', zIndex: 1,
      }}>
        {renderCurrentView()}
      </div>
    </GlobalErrorBoundary>
  );
};
