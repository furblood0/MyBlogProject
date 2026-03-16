import React from 'react';
import { colors, radii, spacing } from '../../theme';

export function Card({ children, style, ...rest }) {
  return (
    <div
      style={{
        background: colors.backgroundElevated,
        borderRadius: radii.lg,
        border: `1px solid ${colors.borderSubtle}`,
        padding: spacing.xl,
        boxShadow: colors.cardShadow,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

