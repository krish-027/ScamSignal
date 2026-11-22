import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface GameHeaderProps {
  title: string;
  subtitle?: string;
  progressText?: string;
  onBack: () => void;
  showPreviewBadge?: boolean;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  subtitle,
  progressText = 'MISSION 01 / 03',
  onBack,
  showPreviewBadge = true,
}) => {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        minHeight: '60px',
        backgroundColor: 'rgba(14, 27, 44, 0.96)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-3)',
        width: '100%',
        maxWidth: 'var(--stage-max-width)',
        margin: '0 auto',
        gap: 'var(--space-2)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0 }}>
        <button
          onClick={onBack}
          aria-label="Navigate back to briefing"
          className="btn-back"
          type="button"
        >
          <ArrowLeft size={22} aria-hidden="true" />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <h1
            id="simulation-header-title"
            tabIndex={-1}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--color-primary-text)',
              margin: 0,
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                color: 'var(--color-secondary-text)',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flexShrink: 0,
        }}
      >
        <span
          className="text-mono"
          style={{
            fontSize: '10px',
            color: 'var(--color-accent)',
            backgroundColor: 'rgba(77, 228, 192, 0.08)',
            border: '1px solid rgba(77, 228, 192, 0.25)',
            padding: '3px 7px',
            borderRadius: 'var(--radius-pill)',
            whiteSpace: 'nowrap',
          }}
        >
          {progressText}
        </span>

        {showPreviewBadge && (
          <span
            className="text-mono"
            style={{
              fontSize: '9px',
              color: 'var(--color-warning)',
              backgroundColor: 'rgba(255, 203, 107, 0.1)',
              border: '1px solid rgba(255, 203, 107, 0.3)',
              padding: '3px 6px',
              borderRadius: 'var(--radius-pill)',
              whiteSpace: 'nowrap',
            }}
          >
            PREVIEW
          </span>
        )}
      </div>
    </header>
  );
};
