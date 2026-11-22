import React from 'react';
import { ArrowLeft, ShieldAlert, AlertCircle } from 'lucide-react';
import { GameHeader } from '../../components/game/GameHeader';
import { PhoneStage } from '../../components/game/PhoneStage';
import { FictionalMessageCard } from '../../components/game/FictionalMessageCard';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

interface SimulationPreviewPageProps {
  onReturnToBriefing: () => void;
}

export const SimulationPreviewPage: React.FC<SimulationPreviewPageProps> = ({
  onReturnToBriefing,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100dvh',
        backgroundColor: 'var(--color-bg)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <GameHeader
        title="SpeedPost Dispatch"
        subtitle="Mission 01: The Missing Package"
        progressText="MISSION 01 / 03"
        onBack={onReturnToBriefing}
        showPreviewBadge={true}
      />

      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          width: '100%',
        }}
      >
        <PhoneStage>
          {/* Fictional SMS Message Inspection */}
          <FictionalMessageCard
            senderName="SpeedPost Courier"
            senderAddress="alert@speedpost-verify.example"
            timestamp="Today, 09:38 AM"
            messageText="URGENT: Package #IN-88942 cannot be delivered due to an incomplete street address. Update details immediately to avoid return to central sorting facility."
            suspiciousUrl="https://speedpost-parcel-status.example/verify"
          />

          {/* Educational Preview Explanation Box */}
          <div style={{ padding: '0 var(--space-4) var(--space-4)' }}>
            <Card variant="raised" padding="standard">
              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                <ShieldAlert size={22} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-primary-text)' }}>
                    Batch 1 Simulation Shell
                  </h3>
                  <p className="text-body" style={{ fontSize: '13px', lineHeight: 1.5 }}>
                    This preview verifies the responsive mobile phone container, layout typography,
                    and fictional threat rendering. In Batch 2, you will be able to tap clue hotspots,
                    trigger evidence bottom sheets, and select real branching decisions.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Action Zone (Strict requirement: non-deceptive single action, no fake clickable choices) */}
          <div
            style={{
              marginTop: 'auto',
              padding: 'var(--space-4)',
              backgroundColor: 'var(--color-surface)',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--color-muted-text)',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <AlertCircle size={14} />
              <span>DECISION ENGINE STATUS: STANDBY (BATCH 2)</span>
            </div>

            <Button
              variant="primary"
              fullWidth
              onClick={onReturnToBriefing}
              icon={<ArrowLeft size={18} />}
              aria-label="Return to Mission 1 Briefing"
            >
              Return to Briefing
            </Button>
          </div>
        </PhoneStage>
      </main>
    </div>
  );
};
