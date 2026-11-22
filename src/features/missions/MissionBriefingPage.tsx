import React from 'react';
import { ArrowLeft, Clock, ShieldCheck, Target, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { MISSION_1_META } from './missionCatalog';

interface MissionBriefingPageProps {
  onBeginPreview: () => void;
  onBack: () => void;
}

export const MissionBriefingPage: React.FC<MissionBriefingPageProps> = ({
  onBeginPreview,
  onBack,
}) => {
  const meta = MISSION_1_META;

  return (
    <div
      className="briefing-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 'var(--stage-max-width)',
        margin: '0 auto',
        minHeight: '100dvh',
        backgroundColor: 'var(--color-bg)',
        borderLeft: '1px solid var(--color-border)',
        borderRight: '1px solid var(--color-border)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Top Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-3) var(--space-4)',
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
        }}
      >
        <button
          onClick={onBack}
          aria-label="Back to home"
          className="btn-ghost"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'var(--min-tap-target)',
            height: 'var(--min-tap-target)',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            color: 'var(--color-primary-text)',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <ArrowLeft size={22} />
        </button>

        <span
          className="text-mono"
          style={{
            fontSize: '12px',
            color: 'var(--color-accent)',
            backgroundColor: 'rgba(77, 228, 192, 0.08)',
            border: '1px solid rgba(77, 228, 192, 0.25)',
            padding: '3px 10px',
            borderRadius: 'var(--radius-pill)',
          }}
        >
          MISSION 01 / 03
        </span>
      </header>

      {/* Main Content Area */}
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: 'var(--space-5) var(--space-4)',
          gap: 'var(--space-5)',
        }}
      >
        {/* Title and Badge */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <span
            className="text-mono"
            style={{
              color: 'var(--color-warning)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <AlertTriangle size={14} /> Incident Casefile #01
          </span>
          <h1 className="text-title" style={{ margin: 0 }}>
            {meta.title}
          </h1>
          <span className="text-supporting" style={{ color: 'var(--color-secondary-text)', fontSize: '15px' }}>
            {meta.subtitle}
          </span>
        </div>

        {/* Setup Narrative Card */}
        <Card variant="raised" padding="standard">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <span className="text-mono" style={{ color: 'var(--color-muted-text)', fontSize: '11px' }}>
              TACTICAL BRIEFING
            </span>
            <p className="text-body" style={{ color: 'var(--color-primary-text)', lineHeight: 1.55 }}>
              {meta.setup}
            </p>
          </div>
        </Card>

        {/* Objective & Meta details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-3)',
              padding: 'var(--space-4)',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(77, 228, 192, 0.1)',
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-accent)',
                flexShrink: 0,
              }}
            >
              <Target size={20} />
            </div>
            <div>
              <span className="text-mono" style={{ color: 'var(--color-accent)', fontSize: '11px' }}>
                PRIMARY LEARNING OBJECTIVE
              </span>
              <p className="text-body" style={{ fontSize: '14px', marginTop: '4px' }}>
                {meta.learningObjective}
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-3)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--color-border)',
              }}
            >
              <Clock size={16} color="var(--color-muted-text)" />
              <div>
                <div style={{ fontSize: '10px', color: 'var(--color-muted-text)', fontFamily: 'var(--font-mono)' }}>
                  TIME ESTIMATE
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary-text)' }}>
                  {meta.estimatedDuration}
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--color-border)',
              }}
            >
              <ShieldCheck size={16} color="var(--color-accent)" />
              <div>
                <div style={{ fontSize: '10px', color: 'var(--color-muted-text)', fontFamily: 'var(--font-mono)' }}>
                  EVIDENCE PIECES
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary-text)' }}>
                  {meta.keyCluesCount} Clues Hidden
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Notice Banner */}
        <div
          style={{
            padding: '12px',
            backgroundColor: 'rgba(255, 203, 107, 0.08)',
            border: '1px solid rgba(255, 203, 107, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-warning)',
            fontSize: '13px',
            lineHeight: 1.45,
          }}
        >
          <strong>Batch 1 Preview Note:</strong> You are entering the visual preview shell for Mission 1. Interactive branching, decision choices, and scoring will unlock in Batch 2.
        </div>

        {/* Action Zone */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: 'var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
          }}
        >
          <Button
            variant="primary"
            onClick={onBeginPreview}
            fullWidth
            aria-label="Begin Preview of Mission 1 Simulation Shell"
          >
            Begin Preview
          </Button>

          <Button
            variant="ghost"
            onClick={onBack}
            fullWidth
            aria-label="Return to ScamSignal Home"
          >
            Back to Home
          </Button>
        </div>
      </main>
    </div>
  );
};
