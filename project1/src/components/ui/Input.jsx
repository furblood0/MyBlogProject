import React from 'react';
import { colors, radii, spacing } from '../../theme';

export function Input({ label, error, helperText, id, ...rest }) {
  return (
    <div style={{ marginBottom: spacing.lg }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: 'block',
            marginBottom: spacing.xs,
            fontSize: '0.85rem',
            color: colors.textMuted,
          }}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        style={{
          width: '100%',
          padding: `${spacing.sm} ${spacing.md}`,
          borderRadius: radii.md,
          border: `1px solid ${error ? colors.danger : colors.borderSubtle}`,
          backgroundColor: '#020617',
          color: colors.textPrimary,
          fontSize: '0.95rem',
          outline: 'none',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = colors.primary;
          e.target.style.boxShadow = `0 0 0 1px ${colors.primarySoft}`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? colors.danger : colors.borderSubtle;
          e.target.style.boxShadow = 'none';
        }}
        {...rest}
      />
      {(helperText || error) && (
        <div
          style={{
            marginTop: spacing.xs,
            fontSize: '0.8rem',
            color: error ? colors.textDanger : colors.textMuted,
          }}
        >
          {error || helperText}
        </div>
      )}
    </div>
  );
}

