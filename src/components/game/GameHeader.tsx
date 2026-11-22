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
        backgroundColor: 'rgba(14, 27, 44, 0.95)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-4)',
        width: '100%',
        maxWidth: 'var(--stage-max-width)',
        margin: '0 auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <button
          onClick={onBack}
          aria-label="Navigate back"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'var(--min-tap-target)',
            height: 'var(--min-tap-target)',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'transparent',
            border: '1px solid transparent',
            color: 'var(--color-primary-text)',
            cursor: 'pointer',
            padding: 0,
            transition: 'background-color var(--motion-micro), color var(--motion-micro)',
          }}
          className="btn-ghost"
        >
          <ArrowLeft size={22} aria-hidden="true" />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--color-primary-text)',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                color: 'var(--color-secondary-text)',
                lineHeight: 1.2,
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <span
          className="text-mono"
          style={{
            fontSize: '11px',
            color: 'var(--color-accent)',
            backgroundColor: 'rgba(77, 228, 192, 0.08)',
            border: '1px solid rgba(77, 228, 192, 0.25)',
            padding: '3px 8px',
            borderRadius: 'var(--radius-pill)',
          }}
        >
          {progressText}
        </span>

        {showPreviewBadge && (
          <span
            className="text-mono"
            style={{
              fontSize: '10px',
              color: 'var(--color-warning)',
              backgroundColor: 'rgba(255, 203, 107, 0.1)',
              border: '1px solid rgba(255, 203, 107, 0.3)',
              padding: '3px 6px',
              borderRadius: 'var(--radius-pill)',
            }}
          >
            PREVIEW
          </span>
        )}
      </div>
    </header>
  );
};
