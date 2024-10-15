import React from 'react';
import { merge } from '../helpers/merge';

function sizeCSS(size) {
  if (size === 100) {
    return {
      '--font-size': 'var(--text-100)',
      '--line-height': '100%',
    } as React.CSSProperties;
  }
  return {
    '--font-size': 'var(--text-50)',
    '--line-height': '100%',
  } as React.CSSProperties;
}

function stateCSS(state) {
  if (state === 'hover') {
    return {
      '--background-color': 'var(--brand-primary)',
    } as React.CSSProperties;
  }
  return {} as React.CSSProperties;
}

export const link = (state, size) => merge(
  {
    '--text-decoration': 'underline',

    '&:hover': stateCSS('hover'),
  } as React.CSSProperties,
  sizeCSS(size),
  stateCSS(state),
);
