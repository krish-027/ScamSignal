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
          <rect width="32" height="32" rx="8" fill="var(--color-surface-raised)" stroke="var(--color-border)" strokeWidth="1" />
          <path 
            d="M16 6L8 9.5V15.5C8 20.8 11.5 25.5 16 26.8C20.5 25.5 24 20.8 24 15.5V9.5L16 6Z" 
            stroke="var(--color-accent)" 
            strokeWidth="2.2" 
            strokeLinejoin="round" 
          />
          <path 
            d="M12 16L14.8 19L20 13" 
            stroke="var(--color-accent)" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
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
            backgroundColor: 'rgba(77, 228, 192, 0.1)',
            color: 'var(--color-accent)',
            border: '1px solid rgba(77, 228, 192, 0.3)',
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
