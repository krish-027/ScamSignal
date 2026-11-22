import React from 'react';
import { ArrowLeft, Clock, ShieldCheck, Target, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { MISSION_1_META } from './missionCatalog';

interface MissionBriefingPageProps {
  onBeginPreview: () => void;
  onBeginInvestigation: () => void;
  onBack: () => void;
}

export const MissionBriefingPage: React.FC<MissionBriefingPageProps> = ({
  onBeginPreview,
  onBeginInvestigation,
  onBack,
}) => {
  const meta = MISSION_1_META;

  return (
    <div
      className="briefing-container view-transition"
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
      {/* Top Header with Accessible, Explicit Back Button */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-3) var(--space-4)',
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          minHeight: '60px',
        }}
      >
        <button
          onClick={onBack}
          aria-label="Back to ScamSignal home"
          className="btn-back"
          type="button"
        >
          <ArrowLeft size={22} aria-hidden="true" />
        </button>

        <span
          className="text-mono"
          style={{
            fontSize: '12px',
            color: 'var(--color-accent)',
            backgroundColor: 'rgba(250, 145, 109, 0.08)',
            border: '1px solid rgba(250, 145, 109, 0.25)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-pill)',
          }}
        >
          MISSION 01 / 03
        </span>
      </header>

      {/* Main Content Area - Balanced Vertical Flow */}
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: 'var(--space-4) var(--space-4) var(--space-5)',
          gap: 'var(--space-4)',
        }}
      >
        {/* Title and Badge */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span
            className="text-mono"
            style={{
              color: 'var(--color-warning)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
            }}
          >
            <AlertTriangle size={13} /> Incident Casefile #01
          </span>
          <h1 id="briefing-title" className="text-title" tabIndex={-1} style={{ margin: 0 }}>
            {meta.title}
          </h1>
          <span className="text-supporting" style={{ color: 'var(--color-secondary-text)', fontSize: '14px' }}>
            {meta.subtitle}
          </span>
        </div>

        {/* Tactical Narrative Card */}
        <Card variant="raised" padding="standard">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <span className="text-mono" style={{ color: 'var(--color-muted-text)', fontSize: '11px' }}>
              TACTICAL BRIEFING
            </span>
            <p className="text-body" style={{ color: 'var(--color-primary-text)', lineHeight: 1.5, fontSize: '15px' }}>
              {meta.setup}
            </p>
          </div>
        </Card>

        {/* Objective & Meta Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-3)',
              padding: '12px 14px',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(250, 145, 109, 0.1)',
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-accent)',
                flexShrink: 0,
                marginTop: '2px',
              }}
            >
              <Target size={18} />
            </div>
            <div>
              <span className="text-mono" style={{ color: 'var(--color-accent)', fontSize: '10px' }}>
                PRIMARY LEARNING OBJECTIVE
              </span>
              <p className="text-body" style={{ fontSize: '13px', marginTop: '3px', lineHeight: 1.45 }}>
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
                padding: '10px 12px',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
              }}
            >
              <Clock size={15} color="var(--color-muted-text)" />
              <div>
                <div style={{ fontSize: '10px', color: 'var(--color-muted-text)', fontFamily: 'var(--font-mono)' }}>
                  ESTIMATED DURATION
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
                padding: '10px 12px',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
              }}
            >
              <ShieldCheck size={15} color="var(--color-accent)" />
              <div>
                <div style={{ fontSize: '10px', color: 'var(--color-muted-text)', fontFamily: 'var(--font-mono)' }}>
                  INVESTIGATIVE SIGNALS
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary-text)' }}>
                  {meta.keyCluesCount} Clues Hidden
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Natural Player-Facing Preview Banner */}
        

        {/* Action Zone - Anchored Cleanly Near Bottom */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: 'var(--space-3)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
          }}
        >
          <Button
            variant="primary"
            onClick={onBeginInvestigation}
            fullWidth
          >
            Start Investigation
          </Button>
          <Button
            variant="secondary"
            onClick={onBeginPreview}
            fullWidth
            aria-label="Begin Preview of Mission 1 Scenario"
          >
            Begin Preview
          </Button>

          <Button
            variant="ghost"
            onClick={onBack}
            fullWidth
          >
            Back to Home
          </Button>
        </div>
      </main>
    </div>
  );
};
