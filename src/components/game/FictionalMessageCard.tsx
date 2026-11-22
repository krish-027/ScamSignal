import React from 'react';
import { AlertTriangle, ShieldAlert, ExternalLink, Info } from 'lucide-react';
import { Card } from '../ui/Card';

interface FictionalMessageCardProps {
  senderName?: string;
  senderAddress?: string;
  timestamp?: string;
  messageText?: string;
  suspiciousUrl?: string;
}

export const FictionalMessageCard: React.FC<FictionalMessageCardProps> = ({
  senderName = 'SpeedPost Courier',
  senderAddress = 'alert@speedpost-verify.example',
  timestamp = 'Today, 09:38 AM',
  messageText = 'URGENT NOTICE: Package #IN-88942 delivery failed due to missing building/street address. Update delivery address immediately to avoid return to depot within 2 hours.',
  suspiciousUrl = 'https://speedpost-parcel-status.example/verify',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        padding: 'var(--space-4)',
        width: '100%',
      }}
    >
      {/* Simulation banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          padding: '8px 12px',
          backgroundColor: 'rgba(255, 203, 107, 0.08)',
          border: '1px solid rgba(255, 203, 107, 0.25)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--color-warning)',
          fontSize: '12px',
        }}
      >
        <Info size={16} style={{ flexShrink: 0 }} />
        <span>Educational Preview: Simulated SMS phishing scenario.</span>
      </div>

      {/* Simulated SMS card */}
      <Card
        variant="surface"
        padding="standard"
        style={{
          maxWidth: '92%',
          alignSelf: 'flex-start',
          borderLeft: '3px solid var(--color-warning)',
        }}
      >
        {/* Sender details */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            marginBottom: 'var(--space-3)',
            paddingBottom: 'var(--space-3)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-primary-text)',
              }}
            >
              {senderName}
            </span>
            <span className="text-mono" style={{ color: 'var(--color-muted-text)', fontSize: '11px' }}>
              {timestamp}
            </span>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--color-muted-text)',
              wordBreak: 'break-all',
            }}
          >
            From: {senderAddress}
          </span>
        </div>

        {/* Message body */}
        <p
          className="text-body"
          style={{
            color: 'var(--color-primary-text)',
            marginBottom: 'var(--space-3)',
            lineHeight: 1.5,
          }}
        >
          {messageText}
        </p>

        {/* Inert suspicious link block */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            padding: '10px 12px',
            backgroundColor: 'var(--color-surface-raised)',
            borderRadius: 'var(--radius-sm)',
            border: '1px dashed rgba(255, 107, 122, 0.5)',
            marginBottom: 'var(--space-3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={14} color="var(--color-danger)" />
            <span className="text-mono" style={{ color: 'var(--color-danger)', fontSize: '11px' }}>
              Simulated Suspicious Link (Inert)
            </span>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--color-secondary-text)',
              wordBreak: 'break-all',
              textDecoration: 'underline',
              cursor: 'not-allowed',
            }}
            title="Inert link: non-clickable for safety"
          >
            {suspiciousUrl}
          </span>
        </div>

        {/* Preview investigation signals */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-2)',
            paddingTop: 'var(--space-2)',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'rgba(255, 203, 107, 0.1)',
              border: '1px solid rgba(255, 203, 107, 0.3)',
              color: 'var(--color-warning)',
              fontSize: '11px',
              fontWeight: 500,
            }}
          >
            <ShieldAlert size={12} /> Clue Spot: Sender domain mismatch
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'rgba(255, 107, 122, 0.1)',
              border: '1px solid rgba(255, 107, 122, 0.3)',
              color: 'var(--color-danger)',
              fontSize: '11px',
              fontWeight: 500,
            }}
          >
            <ExternalLink size={12} /> Clue Spot: Manufactured urgency
          </span>
        </div>
      </Card>
    </div>
  );
};
