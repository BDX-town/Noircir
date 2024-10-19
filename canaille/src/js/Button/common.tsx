import React from 'react';

import { ICommonProps } from '../types/ICommonProps';
import { createUseStyles } from '../helpers/createUseStyles';
import { buttonCSS } from './style';
import '../../scss/index.scss';

export interface IButton extends ICommonProps {
  htmlType?: 'button' | 'submit';
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  variant?: 'primary' | 'secondary' | 'light';
  size?: 50 | 100;
  state?: 'hover' | 'default';
}

const useStyles = createUseStyles({
  variables: {
    '--background-color': 'unset',
    '--text-color': 'unset',
    '--font-size': 'unset',
    '--padding': 'unset',
    '--border-radius': 'unset',
    '--border': 'unset',
    '--box-shadow': 'unset',
    '--gap': 'unset',
  } as React.CSSProperties,
  button: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--gap)',
    backgroundColor: 'var(--background-color)',
    color: 'var(--text-color)',
    fontSize: 'var(--font-size)',
    padding: 'var(--padding)',
    borderRadius: 'var(--border-radius)',
    border: 'var(--border)',
    boxShadow: 'var(--box-shadow)',
    cursor: 'pointer',
  } as React.CSSProperties,
  canaille: ({ variant, size, state }) => buttonCSS(variant, state, size),
});

const Button = React.forwardRef(
  (
    {
      className,
      htmlType = 'button',
      id,
      testId,
      style,
      children,
      disabled = false,
      onClick,
      variant = 'primary',
      size = 100,
      state = 'default',
      ...rest
    }: IButton,
    ref,
  ) => {
    const { variables, button, canaille } = useStyles({ variant, size, state });

    return (
      <button
        {...rest}
        type={htmlType === 'submit' ? 'submit' : 'button'}
        ref={ref as React.Ref<HTMLButtonElement>}
        className={`${variables} ${button} ${canaille} ${className}`}
        id={id}
        data-testid={testId}
        style={style}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
