import React from 'react';
import { merge } from '../helpers/merge';

function stateCSS(state: string): React.CSSProperties {
  switch (state) {
    default:
    case 'default': {
      return {};
    }
    case 'focus': {
      return {
        '--box-shadow': 'var(--dp-75)',
      } as React.CSSProperties;
    }
  }
}

export const textInputCSS = (state) => merge(
  {
    '--display': 'flex',
    '--box-shadow': 'unset',
    '--background-color': 'var(--additional-primary)',
    '--border': '2px solid var(--grey-100)',
    '--border-radius': 'var(--rounded-100)',
    '--padding-left': 'var(--spacing-3)',
    '--padding-right': 'var(--spacing-3)',
    '--padding-bottom': 'var(--spacing-2)',
    '--padding-top': '18px',
    '--font-size': 'var(--text-100)',
    '--text-color': 'var(--grey-100)',

    '--label-display': 'block',
    '--label-background-color': 'var(--brand-primary)',
    '--label-padding-x': 'var(--spacing-2)',
    '--label-padding-y': 'var(--spacing-1)',
    '--label-border-radius': 'var(--rounded-50)',
    '--label-border': '1px solid var(--grey-100)',
    '--label-box-shadow': 'var(--dp-25)',
    '--label-font-size': 'var(--text-50)',
    '--label-color': 'var(--grey-100)',

    '--placeholder-color':
        'hsl(var(--grey-100-h) var(--grey-100-s) var(--grey-100-l) / 0.64)',

    '&:hover': stateCSS('hover'),
    '&:focus, &:focus-within': stateCSS('focus'),
  },
  stateCSS(state),
);
