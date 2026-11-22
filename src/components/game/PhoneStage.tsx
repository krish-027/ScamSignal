import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface PhoneStageProps {
  children: React.ReactNode;
  showStatusBar?: boolean;
  className?: string;
}

/** Reusable simulated device. Real device system buttons are never impersonated. */
export const PhoneStage: React.FC<PhoneStageProps> = ({
  children, showStatusBar = true, className = '',
}) => {
  const interactive = className.split(/\s+/).includes('phone-stage--interactive');
  return (
    <div
      className={`phone-stage-wrapper ${className}`}
      style={{
        width: '100%',
        maxWidth: interactive ? '440px' : 'var(--stage-max-width)',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        minHeight: interactive ? 0 : '100%',
        backgroundColor: 'var(--color-surface-inset)',
        borderLeft: '1px solid var(--color-border)',
        borderRight: '1px solid var(--color-border)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
        position: 'relative',
      }}
    >
      {showStatusBar && (
        <div className="phone-status-bar" aria-hidden="true">
          <span>09:41</span>
          {interactive && <span className="phone-hardware-pill" />}
          <div className="phone-status-icons">
            <Signal size={13} strokeWidth={2.2} />
            <Wifi size={13} strokeWidth={2.2} />
            <Battery size={15} strokeWidth={2.2} />
          </div>
        </div>
      )}
      <div className="phone-stage-body" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%', position: 'relative' }}>
        {children}
      </div>
    </div>
  );
};
