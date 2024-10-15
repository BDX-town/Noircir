import React from 'react';
import { ITextInput, TextInput } from '../TextInput/common';
import { createUseStyles } from '../helpers/createUseStyles';
import { smallInput } from './style';

const useStyle = createUseStyles({
  smallInputCSS: {
    '--border-bottom': 'unset',

    '&>label': {
      border: 'unset',
      borderTop: 'var(--border)',
      borderLeft: 'var(--border)',
      borderRight: 'var(--border)',
      borderBottom: 'var(--border-bottom)',

      transition: 'all 0.2s ease',
    },
  } as React.CSSProperties,
  canaille: ({ state }) => smallInput(state),
});

type ISmallInput = Omit<ITextInput, 'children' | 'variant' | 'label'>;

const SmallInput = React.forwardRef(
  ({ state, className, ...rest }: ISmallInput, ref) => {
    const { canaille, smallInputCSS } = useStyle({ state });

    return (
      <TextInput
        {...rest}
        ref={ref}
        className={`${smallInputCSS} ${canaille} ${className}`}
        state={state}
      />
    );
  },
);

export { SmallInput };
