import React from 'react';
import { merge } from '../helpers/merge';

function variantCSS(variant): React.CSSProperties {
  if (variant === 'dashed') {
    return {
      '--background': 'none',
    } as React.CSSProperties;
  }
  return {
    '--background': 'var(--color)',
  } as React.CSSProperties;
}

export const line = (variant) => merge(
  {
    '--height': '2px',
    '--color': 'var(--grey-100)',
  } as React.CSSProperties,
  variantCSS(variant),
);
