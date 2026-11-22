import React from 'react';

interface BrandMarkProps {
  showBadge?: boolean;
  className?: string;
}

export const BrandMark: React.FC<BrandMarkProps> = ({ showBadge = true, className = '' }) => {
  return (
    <div 
      className={`brand-container ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        gap: 'var(--space-2)',
        flexWrap: 'wrap',
      }}
    >
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
        }}
      >
        <svg 
          width="28" 
          height="28" 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="ScamSignal Shield"
          style={{ flexShrink: 0 }}
        >
          <rect width="32" height="32" rx="6" fill="var(--color-surface-raised)" stroke="var(--color-border)" strokeWidth="1" />
          <path d="M6 11V7h5 M21 7h4v4 M6 21v4h5 M21 25h4v-4" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="square" />
          <path d="M6 17h6l3-6 4 11 3-5h4" stroke="var(--color-primary-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="26" cy="17" r="1.8" fill="var(--color-accent)" />
        </svg>
        <span 
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '18px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: 'var(--color-primary-text)',
            textTransform: 'uppercase',
          }}
        >
          ScamSignal
        </span>
      </div>

      {showBadge && (
        <span 
          className="brand-badge text-mono"
          style={{
            backgroundColor: 'rgba(250, 145, 109, 0.07)',
            color: 'var(--color-accent)',
            border: '1px solid rgba(250, 145, 109, 0.25)',
            borderRadius: 'var(--radius-pill)',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          Interactive Simulation
        </span>
      )}
    </div>
  );
};
