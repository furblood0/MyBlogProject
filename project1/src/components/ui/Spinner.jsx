import React from 'react';
import { colors } from '../../theme';

export function Spinner({ size = 18 }) {
  const borderSize = Math.max(2, Math.round(size / 9));

  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        border: `${borderSize}px solid rgba(148, 163, 184, 0.4)`,
        borderTopColor: colors.primary,
        animation: 'spin 0.7s linear infinite',
      }}
    />
  );
}

