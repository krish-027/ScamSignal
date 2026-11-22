import React, { HTMLAttributes } from 'react';

export type CardVariant = 'surface' | 'raised' | 'inset';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'compact' | 'standard' | 'spacious' | 'none';
  as?: React.ElementType;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'surface',
  padding = 'standard',
  as: Component = 'div',
  className = '',
  style,
  ...rest
}) => {
  const getBackground = (): string => {
    switch (variant) {
      case 'surface':
        return 'var(--color-surface)';
      case 'raised':
        return 'var(--color-surface-raised)';
      case 'inset':
        return 'var(--color-surface-inset)';
    }
  };

  const getPadding = (): string => {
    switch (padding) {
      case 'compact':
        return 'var(--space-4)'; // 16px
      case 'standard':
        return 'var(--space-5)'; // 20px
      case 'spacious':
        return 'var(--space-6)'; // 24px
      case 'none':
        return '0';
    }
  };

  return (
    <Component
      className={`app-card card-${variant} ${className}`}
      style={{
        backgroundColor: getBackground(),
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-card)',
        padding: getPadding(),
        color: 'var(--color-primary-text)',
        position: 'relative',
        transition: 'border-color var(--motion-micro), box-shadow var(--motion-micro)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
};
