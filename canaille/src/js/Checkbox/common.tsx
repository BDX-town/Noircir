import React from 'react';

import { IconCheck } from '@tabler/icons-react';
import { ICommonProps } from '../types/ICommonProps';
import { IFormProps } from '../types/IFormProps';
import { createUseStyles } from '../helpers/createUseStyles';
import { useValidation } from '../helpers/form/form';
import { Error } from '../Error/common';
import { checkbox as checkboxCSS } from './style';

import '../../scss/index.scss';

export interface ICheckboxBase extends ICommonProps, IFormProps {
  state?: 'default' | 'hover' | 'checked';
  /**
   * Checkbox text content
   */
  children?: React.ReactNode;
  /**
   * Click event handler.
   */
  onClick?: () => void | null;
  /**
   * True if disabled.
   */
  disabled?: boolean;
  /**
   * True if checked.
   */
  checked?: boolean;
  /**
   * Default checked state.
   */
  defaultChecked?: boolean;
  /**
   * Change event handler.
   */
  onChange?: (e: React.ChangeEvent<Element>) => void;
}

const useStyle = createUseStyles({
  variables: {
    '--radius': 'unset',
    '--border': 'unset',
    '--font-size': 'unset',
    '--height': 'unset',
    '--width': 'unset',
    '--background-color': 'unset',
    '--label-color': 'unset',
    '--box-shadow': 'unset',
    '--pointer-events': 'auto',
    '--check-opacity': 0,
  } as React.CSSProperties,
  checkbox: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    color: 'var(--label-color)',

    '&>input': {
      position: 'absolute',
      width: 0,
      height: 0,
      opacity: 0,
      '& + div>svg': {
        opacity: 'var(--check-opacity)',
      },
    },
    '&>span': {
      userSelect: 'none',
    },
    '&>div': {
      transition: 'all 0.2s ease',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 'var(--width)',
      height: 'var(--height)',
      boxShadow: 'var(--box-shadow)',
      borderRadius: 'var(--radius)',
      border: 'var(--border)',
      backgroundColor: 'var(--background-color)',
    } as React.CSSProperties,
  } as React.CSSProperties,
  canaille: ({ state }) => checkboxCSS(state),
});

const Checkbox = React.forwardRef(
  (
    {
      state = 'default',
      className,
      name,
      id,
      testId,
      style,
      children,
      onClick,
      onChange,
      disabled,
      defaultChecked,
      checked,
      required,
      validateOnChange,
      checkValidity,
      onInvalid,
      ...rest
    }: ICheckboxBase,
    ref,
  ) => {
    // Unique id, useful for testing
    const nameId = React.useId();
    const internalName = name || `switch-${nameId}`;

    const htmlFor = React.useId();

    // Input ref, to use in validation hook
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Validation hook
    const {
      onInput,
      onInvalid: onInvalidInternal,
      error,
    } = useValidation({
      root: inputRef,
      validateOnChange: validateOnChange as boolean,
      onInvalid,
      checkValidity,
    });

    const { variables, checkbox, canaille } = useStyle({ state });

    return (
      <label
        {...rest}
        ref={ref as React.Ref<HTMLLabelElement>}
        id={id}
        htmlFor={htmlFor}
        data-testid={testId}
        className={`${variables} ${checkbox} ${canaille} ${className}`}
        style={style}
      >
        <input
          ref={inputRef}
          id={htmlFor}
          data-testid={`${testId}-input`}
          name={internalName}
          disabled={disabled}
          defaultChecked={defaultChecked}
          checked={checked}
          type="checkbox"
          onChange={onChange}
          onClick={onClick}
          onInput={onInput}
          required={required}
          onInvalid={onInvalidInternal}
        />
        <div>
          <IconCheck aria-hidden />
        </div>
        {children && (
          <span>
            {children}
            {required && <abbr>*</abbr>}
            {error && <Error>{error}</Error>}
          </span>
        )}
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
