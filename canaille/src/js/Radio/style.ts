import React from 'react';
import { merge } from '../helpers/merge';

function stateCSS(state): React.CSSProperties {
  switch (state) {
    case 'hover': {
      return {
        '--box-shadow': 'var(--dp-25)',

        '&>input': {
          transform: 'translate(2px, -2px)',
        },
      } as React.CSSProperties;
    }
    case 'checked': {
      return {
        '--background-color': 'var(--brand-primary)',
        '--inner-color': 'var(--grey-100)',
      } as React.CSSProperties;
    }
    case 'default':
    default: {
      return {};
    }
  }
}

export const radio = (state) => merge(
  {
    '--background-color': 'var(--additional-primary)',
    '--border': '2px solid',
    '--border-color': 'var(--grey-100)',
    '--inner-color': 'var(--background-color)',
    '--size': '28px',
    '--inner-size': '8.33px',
    '--text-color': 'var(--grey-100)',
    '--box-shadow': 'unset',

    '&>input': {
      transition: 'all 0.2s ease',
    },

    '&>input:checked': stateCSS('checked'),
    '&:hover': stateCSS('hover'),
  } as React.CSSProperties,
  stateCSS(state),
);
