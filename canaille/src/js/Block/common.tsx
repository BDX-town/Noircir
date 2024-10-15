import React from 'react';
import { ICommonProps } from '../types/ICommonProps';
import { createUseStyles } from '../helpers/createUseStyles';
import { block as blockCSS } from './style';

const useStyle = createUseStyles({
  block: {
    '---border': 'unset',
    '---padding': 'unset',
    '---background-color': 'unset',
    '---box-shadow': 'unset',
    '---radius': 'unset',

    border: 'var(---border)',
    padding: 'var(---padding)',
    backgroundColor: 'var(---background-color)',
    boxShadow: 'var(---box-shadow)',
    borderRadius: 'var(---radius)',
  } as React.CSSProperties,
  canaille: ({ state, variant }) => blockCSS(variant, state),
});

interface IBlock extends ICommonProps {
  variant?: 'default' | 'interactive',
  state?: 'default' | 'hover',
  children: React.ReactNode,
}

export const Block = React.forwardRef(({
  state = 'default', variant = 'default', className, children, ...rest
}: IBlock, ref) => {
  const { block, canaille } = useStyle({ state, variant });

  return (
    <div {...rest} ref={ref as React.LegacyRef<HTMLDivElement>} className={`${block} ${canaille} ${className}`}>
      { children }
    </div>
  );
});
