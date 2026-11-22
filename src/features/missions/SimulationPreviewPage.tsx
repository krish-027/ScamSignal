import React from 'react';
import { GameHeader } from '../../components/game/GameHeader';
import { PhoneStage } from '../../components/game/PhoneStage';
import { FictionalMessageCard } from '../../components/game/FictionalMessageCard';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

interface SimulationPreviewPageProps {
  onReturnToBriefing: () => void;
}

export const SimulationPreviewPage: React.FC<SimulationPreviewPageProps> = ({
  onReturnToBriefing,
}) => {
  return (
    <div
      className="view-transition"
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
        title="SpeedPost Courier"
        subtitle="Mission 01 · The Missing Package"
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
          {/* Fictional SMS message view */}
          <FictionalMessageCard
            senderName="SpeedPost Courier"
            senderAddress="alert@speedpost-verify.example"
            timestamp="Today, 09:38 AM"
            messageText="URGENT: Package #IN-88942 cannot be delivered due to an incomplete street address. Update details immediately to avoid return to depot within 2 hours."
            suspiciousUrl="https://speedpost-parcel-status.example/verify"
          />

          {/* Player-facing preview information panel */}
          <div style={{ padding: '0 var(--space-4) var(--space-4)' }}>
            <Card
              variant="raised"
              padding="standard"
              style={{
                background: 'linear-gradient(180deg, var(--color-surface-raised) 0%, #102133 100%)',
              }}
            >
              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                <ShieldCheck size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <h2
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--color-primary-text)',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    Mission Overview — Preview Mode
                  </h2>
                  <p className="text-body" style={{ fontSize: '13px', lineHeight: 1.5 }}>
                    You are viewing the incoming scenario and investigative context.
                    Decision checkpoints and evidence review will be available once the full scenario launches.
                  </p>
                  
                </div>
              </div>
            </Card>
          </div>

          {/* Action zone — single non-deceptive return control */}
          <div
            style={{
              marginTop: 'auto',
              padding: 'var(--space-4)',
              backgroundColor: 'var(--color-surface)',
              borderTop: '1px solid var(--color-border)',
            }}
          >
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
