import React from 'react';
import { merge } from '../helpers/merge';

function variantCSS(variant): React.CSSProperties {
  switch (variant) {
    default: {
      return {};
    }
    case 'mini': {
      return {
        '--display': 'inline-flex',
        '--padding-left': 'var(--spacing-2)',
        '--button-padding': 0,
        '&>label>input': {
          display: 'none',
        },
      } as React.CSSProperties;
    }
  }
}

function stateCSS(state): React.CSSProperties {
  switch (state) {
    default: {
      return {};
    }
    case 'focus': {
      return {
        '--button-background-color': 'var(--brand-primary)',
        '--button-border': '2px solid var(--grey-100)',
        '--button-box-shadow': 'var(--dp-25)',
        '--button-border-radius': 'var(--rounded-50)',

        '--button-padding': 'var(--spacing-1)',
        '--display': 'flex',
        '--padding-left': 'var(--spacing-3)',
        '&>label>input': {
          display: 'initial',
        },
      } as React.CSSProperties;
    }
  }
}

export const searchInput = (variant, state) => merge(
  {
    '--padding-right': 'var(--spacing-2)',
    '--padding-top': 'var(--padding-bottom)',

    '--button-padding': 'var(--spacing-1)',
    '--button-border': '2px solid transparent',

    '&:focus, &:focus-within': stateCSS('focus'),
  } as React.CSSProperties,
  variantCSS(variant),
  stateCSS(state),
);
