import React from 'react';
import { colors, radii, spacing } from '../../theme';

const baseStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: radii.md,
  padding: `${spacing.sm} ${spacing.lg}`,
  border: '1px solid transparent',
  fontSize: '0.95rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'background-color 0.15s ease, border-color 0.15s ease, transform 0.08s ease, box-shadow 0.15s ease',
};

const variants = {
  primary: {
    backgroundColor: colors.primary,
    color: colors.textPrimary,
    borderColor: colors.primary,
  },
  secondary: {
    backgroundColor: 'transparent',
    color: colors.textPrimary,
    borderColor: colors.borderSubtle,
  },
  ghost: {
    backgroundColor: 'transparent',
    color: colors.textMuted,
    borderColor: 'transparent',
  },
  danger: {
    backgroundColor: colors.danger,
    color: colors.textPrimary,
    borderColor: colors.danger,
  },
};

export function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  disabled,
  style,
  ...rest
}) {
  const v = variants[variant] || variants.primary;

  return (
    <button
      style={{
        ...baseStyle,
        ...v,
        width: fullWidth ? '100%' : undefined,
        opacity: disabled ? 0.65 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: variant === 'primary' && !disabled ? colors.cardShadow : 'none',
        ...style,
      }}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

