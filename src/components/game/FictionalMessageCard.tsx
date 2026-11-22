import React from 'react';
import { AlertTriangle, Info, Search } from 'lucide-react';
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
  messageText = 'URGENT: Package #IN-88942 cannot be delivered due to an incomplete street address. Update details immediately to avoid return to depot within 2 hours.',
  suspiciousUrl = 'https://speedpost-parcel-status.example/verify',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        padding: 'var(--space-3) var(--space-4)',
        width: '100%',
      }}
    >
      {/* Simulation Banner */}
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
          lineHeight: 1.4,
        }}
      >
        <Info size={16} style={{ flexShrink: 0 }} />
        <span>Educational Simulation: Inspect message indicators carefully.</span>
      </div>

      {/* Believable Phone SMS Message Bubble */}
      <Card
        variant="surface"
        padding="standard"
        style={{
          maxWidth: '100%',
          borderLeft: '3px solid var(--color-warning)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Sender Header with Avatar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: 'var(--space-3)',
            paddingBottom: 'var(--space-3)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          {/* Fictional sender avatar icon */}
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-surface-raised)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '13px',
              color: 'var(--color-accent)',
              flexShrink: 0,
            }}
          >
            SP
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--color-primary-text)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {senderName}
              </span>
              <span className="text-mono" style={{ color: 'var(--color-muted-text)', fontSize: '10px', flexShrink: 0 }}>
                {timestamp}
              </span>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-muted-text)',
                wordBreak: 'break-all',
                overflowWrap: 'anywhere',
              }}
            >
              From: {senderAddress}
            </span>
          </div>
        </div>

        {/* Message Body */}
        <p
          className="text-body"
          style={{
            color: 'var(--color-primary-text)',
            marginBottom: 'var(--space-3)',
            lineHeight: 1.5,
            fontSize: '14px',
          }}
        >
          {messageText}
        </p>

        {/* Inert Suspicious Link Block */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            padding: '10px 12px',
            backgroundColor: 'var(--color-surface-raised)',
            borderRadius: 'var(--radius-sm)',
            border: '1px dashed rgba(255, 107, 122, 0.45)',
            marginBottom: 'var(--space-3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={13} color="var(--color-danger)" />
            <span className="text-mono" style={{ color: 'var(--color-danger)', fontSize: '10px' }}>
              Simulated Link (Inert)
            </span>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--color-secondary-text)',
              wordBreak: 'break-all',
              overflowWrap: 'anywhere',
              textDecoration: 'underline',
              cursor: 'not-allowed',
              userSelect: 'text',
            }}
            title="Inert link: non-clickable for safety"
          >
            {suspiciousUrl}
          </span>
        </div>

        {/* Investigative Clue Indicators (Answers NOT spoiled) */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            paddingTop: 'var(--space-1)',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'rgba(77, 228, 192, 0.08)',
              border: '1px solid rgba(77, 228, 192, 0.25)',
              color: 'var(--color-accent)',
              fontSize: '11px',
              fontWeight: 500,
            }}
          >
            <Search size={11} /> Investigate: Sender Metadata
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'rgba(255, 203, 107, 0.08)',
              border: '1px solid rgba(255, 203, 107, 0.25)',
              color: 'var(--color-warning)',
              fontSize: '11px',
              fontWeight: 500,
            }}
          >
            <Search size={11} /> Investigate: Urgency Claim
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'rgba(255, 107, 122, 0.08)',
              border: '1px solid rgba(255, 107, 122, 0.25)',
              color: 'var(--color-danger)',
              fontSize: '11px',
              fontWeight: 500,
            }}
          >
            <Search size={11} /> Investigate: Web Address
          </span>
        </div>
      </Card>
    </div>
  );
};
