import React, { useMemo } from 'react';
import { createUseStyles } from '../helpers/createUseStyles';
import { ICommonProps } from '../types/ICommonProps';
import { line as lineCSS } from './style';

import '../../scss/index.scss';

const useStyle = createUseStyles({
  line: {
    '--color': 'unset',
    '--background': 'unset',
    '--height': 'unset',
    border: 'none',
    background: 'var(--background)',
    height: 'var(--height)',
    color: 'var(--color)',
  } as React.CSSProperties,
  canaille: ({ variant }) => lineCSS(variant),
});

interface ILine extends ICommonProps {
  variant?: 'dashed' | 'solid';
}

const Line = React.forwardRef(
  ({ variant = 'dashed', className = '', ...rest }: ILine, ref: unknown) => {
    const { line, canaille } = useStyle({ variant });
    return (
      <div
        {...rest}
        ref={ref as React.LegacyRef<HTMLHRElement>}
        className={`${line} ${canaille} ${className}`}
      >
        {variant === 'dashed' ? (
          <svg width="100%" xmlns="http://www.w3.org/2000/svg">
            <line
              x1="0"
              y1="0"
              x2="100%"
              y2="0"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray="2, 8"
              strokeDashoffset="0"
              strokeLinecap="square"
            />
          </svg>
        ) : null}
      </div>
    );
  },
);

export { Line };
