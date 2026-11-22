import React, { useEffect, useState } from 'react';
import { useNavigation } from './navigation';
import { GlobalErrorBoundary } from '../components/common/GlobalErrorBoundary';
import { HomePage } from '../features/home/HomePage';
import { InternshipPage } from '../features/missions/internship/InternshipPage';
import { MissionSelectPage } from '../features/missions/directory/MissionSelectPage';
import { ProgressPage } from '../features/progress/ProgressPage';
import type { MissionKey } from '../features/missions/directory/MissionCards';
import { RefundPage } from '../features/missions/refund/RefundPage';
import { MissionBriefingPage } from '../features/missions/MissionBriefingPage';
import { SimulationPreviewPage } from '../features/missions/SimulationPreviewPage';
import { InvestigationPage } from '../features/missions/InvestigationPage';
import { restartMission, startMission } from '../features/missions/engine/missionEngine';
import { PARCEL_MISSION } from '../features/missions/data/parcelMission';
import { loadSession, persistSession } from '../features/missions/sessionStorage';
import { Button } from '../components/ui/Button';
import { SkipToContent } from '../components/common/SkipToContent';
import '../features/qa/accessibility4B.css';
import '../features/qa/interactionTooltips4C.css';

export const App: React.FC = () => {
  const { currentRoute, announcement, navigateTo } = useNavigation();
  const [session, setSession] = useState(loadSession);
  const openMission = (id: MissionKey) => navigateTo(id === 'parcel' ? 'briefing' : id === 'internship' ? 'internship' : 'refund');

  useEffect(() => {
    persistSession(session);
  }, [session]);

  const startOrResumeInvestigation = () => {
    setSession(previous =>
      previous.missionRecords.parcel.status === 'not_started'
        ? startMission(previous, PARCEL_MISSION)
        : previous
    );
    navigateTo('investigate');
  };

  const renderCurrentView = () => {
    switch (currentRoute) {
      case 'home':
        return <HomePage onStart={() => navigateTo('missions')} onSelectMission={openMission} onProgress={() => navigateTo('progress')} />;

      case 'briefing':
        return (
          <MissionBriefingPage
            onBeginInvestigation={startOrResumeInvestigation}
            onBeginPreview={() => navigateTo('preview')}
            onBack={() => navigateTo('home')}
          />
        );

      case 'preview':
        return (
          <SimulationPreviewPage
            onReturnToBriefing={() => navigateTo('briefing')}
          />
        );

      case 'investigate':
        return (
          <InvestigationPage
            session={session}
            onUpdate={setSession}
            onStart={startOrResumeInvestigation}
            onReplay={() =>
              setSession(previous => restartMission(previous, PARCEL_MISSION))
            }
            onExit={() => navigateTo('briefing')}
            onHome={() => navigateTo('home')}
          />
        );

      case 'missions':
        return <MissionSelectPage onSelect={openMission} onBack={() => navigateTo('home')} onProgress={() => navigateTo('progress')} />;

      case 'progress':
        return <ProgressPage onHome={() => navigateTo('home')} onMissions={() => navigateTo('missions')} onSelectMission={id => id === 'parcel' && session.missionRecords.parcel.status !== 'not_started' ? navigateTo('investigate') : openMission(id)} />;

      case 'refund':
        return <RefundPage onExit={() => navigateTo('missions')} />;

      case 'internship':
        return <InternshipPage onExit={() => navigateTo('home')} />;
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
      <SkipToContent />
      <div className="bg-atmosphere" aria-hidden="true" />
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
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