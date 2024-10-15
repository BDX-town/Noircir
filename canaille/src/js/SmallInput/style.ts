import React from 'react';
import { merge } from '../helpers/merge';

function stateCSS(state) {
  switch (state) {
    case 'default':
    default: {
      return {};
    }
    case 'hover': {
      return {
        '--border': 'var(--border-bottom)',
        '--border-radius': 'var(--rounded-25)',
        '--background-color': 'var(--additional-primary)',
        '--box-shadow': 'var(--dp-25)',
      };
    }
    case 'focus': {
      return {
        '--border': 'var(--border-bottom)',
        '--border-radius': 'var(--rounded-25)',
        '--background-color': 'var(--additional-primary)',
        '--text-color': 'var(--grey-100)',
        '--box-shadow': 'var(--dp-75)',
      };
    }
  }
}

export const smallInput = (state) => merge(
  {
    '--text-color':
        'hsl(var(--grey-100-h) var(--grey-100-s) var(--grey-100-l) / 0.6)',
    '--display': 'inline-flex',
    '--padding-top': 'var(--padding-bottom)',
    '--padding-right': 'var(--spacing-2)',
    '--padding-left': 'var(--spacing-2)',
    '--border': '2px solid transparent',
    '--border-bottom': '2px solid var(--grey-100)',
    '--border-radius': 0,
    '--background-color': 'transparent',

    '&:hover': stateCSS('hover'),
    '&:focus, &:focus-within': stateCSS('focus'),
  } as React.CSSProperties,
  stateCSS(state),
);
