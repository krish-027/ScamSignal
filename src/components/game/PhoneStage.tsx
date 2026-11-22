import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface PhoneStageProps {
  children: React.ReactNode;
  showStatusBar?: boolean;
  className?: string;
}

export const PhoneStage: React.FC<PhoneStageProps> = ({
  children,
  showStatusBar = true,
  className = '',
}) => {
  return (
    <div
      className={`phone-stage-wrapper ${className}`}
      style={{
        width: '100%',
        maxWidth: 'var(--stage-max-width)',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        backgroundColor: 'var(--color-surface-inset)',
        borderLeft: '1px solid var(--color-border)',
        borderRight: '1px solid var(--color-border)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
        position: 'relative',
      }}
    >
      {showStatusBar && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 16px',
            backgroundColor: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
            color: 'var(--color-secondary-text)',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            userSelect: 'none',
          }}
          aria-hidden="true"
        >
          <span>09:41</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Signal size={13} strokeWidth={2.2} />
            <Wifi size={13} strokeWidth={2.2} />
            <Battery size={15} strokeWidth={2.2} />
          </div>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          width: '100%',
          position: 'relative',
        }}
      >
        {children}
      </div>
    </div>
  );
};
