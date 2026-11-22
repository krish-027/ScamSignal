import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  fullWidth = false,
  icon,
  disabled = false,
  className = '',
  style,
  ...rest
}, ref) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--color-accent)',
          color: 'var(--color-bg)', // Strict requirement: Dark text (#07111F) on mint
          border: 'none',
          minHeight: 'var(--btn-height-primary)',
          fontWeight: 600,
          boxShadow: '0 2px 10px rgba(77, 228, 192, 0.25)',
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--color-surface-raised)',
          color: 'var(--color-primary-text)',
          border: '1px solid var(--color-border)',
          minHeight: 'var(--btn-height-secondary)',
          fontWeight: 600,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-secondary-text)',
          border: '1px solid transparent',
          minHeight: 'var(--btn-height-secondary)',
          fontWeight: 500,
        };
      case 'danger':
        return {
          backgroundColor: 'rgba(255, 107, 122, 0.15)',
          color: 'var(--color-danger)',
          border: '1px solid rgba(255, 107, 122, 0.3)',
          minHeight: 'var(--btn-height-secondary)',
          fontWeight: 600,
        };
    }
  };

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`app-button btn-${variant} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        padding: '0 var(--space-5)',
        width: fullWidth ? '100%' : 'auto',
        minWidth: 'var(--min-tap-target)',
        fontFamily: 'var(--font-body)',
        fontSize: '16px',
        lineHeight: 1.25,
        borderRadius: 'var(--radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background-color var(--motion-micro), transform var(--motion-micro), border-color var(--motion-micro), box-shadow var(--motion-micro)',
        outline: 'none',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        ...getVariantStyles(),
        ...style,
      }}
      {...rest}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      <span>{children}</span>
    </button>
  );
});

Button.displayName = 'Button';
