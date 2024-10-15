import * as React from 'react';

import { ICommonProps } from '../types/ICommonProps';
import { IFormProps } from '../types/IFormProps';
import { createUseStyles } from '../helpers/createUseStyles';
import { useValidation } from '../helpers/form/form';
import { Error } from '../Error/common';
import { radio as radioCSS } from './style';

interface IRadioContext extends IFormProps {
  globalDisabled?: boolean;
  defaultValue: string | number | string[] | undefined;
  internalName: string | undefined;
  size?: number;
  error?: string;
}

export const RadioContext = React.createContext<IRadioContext>({
  onChange: undefined,
  internalName: undefined,
  value: undefined,
  name: undefined,
  globalDisabled: undefined,
  defaultValue: undefined,
  error: undefined,
  size: undefined,
});

const useStyle = createUseStyles({
  canaille: ({ state }) => radioCSS(state),
  radio: {
    border: 'none',
  },
  radioItem: {
    '--background-color': 'unset',
    '--border': 'unset',
    '--border-color': 'unset',
    '--inner-color': 'unset',
    '--size': 'unset',
    '--inner-size': 'unset',
    '--text-color': 'unset',
    '--box-shadow': 'unset',

    display: 'inline-flex',
    alignItems: 'center',
  } as React.CSSProperties,

  radioItemInput: {
    position: 'relative',
    appearance: 'none',
    backgroundColor: 'var(--background-color)',
    margin: 0,
    padding: 0,
    font: 'inherit',
    color: 'var(--text-color)',
    width: 'var(--size)',
    height: 'var(--size)',
    border: 'var(--border)',
    boxShadow: 'var(--box-shadow)',
    borderRadius: '50%',
    marginRight: 'var(--spacing-2)',
    flexShrink: '0',

    '&::before': {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      content: "''",
      display: 'block',
      width: 'var(--inner-size)',
      height: 'var(--inner-size)',
      backgroundColor: 'var(--inner-color)',
      borderRadius: '100%',
    },
  } as React.CSSProperties,
});

export interface IRadioItem extends ICommonProps, IFormProps {
  state?: 'default' | 'hover' | 'checked';
  /**
   * Radio value
   */
  value: string | number;
  /**
   * Radio disabled state
   */
  disabled?: boolean;
  /**
   * children
   */
  children?: React.ReactNode;
}

const RadioItem = React.forwardRef(
  (
    {
      className = '',
      testId,
      style,
      value,
      state = 'default',
      disabled,
      id,
      required,
      children,
      ...restOfProps
    }: IRadioItem,
    ref,
  ) => {
    const { defaultValue, internalName } = React.useContext(RadioContext);

    const _internalId = React.useId();
    const internalId = id || _internalId;

    const { canaille, radioItem, radioItemInput } = useStyle({ state });

    const input = React.useRef(null);

    return (
      <label
        className={`${radioItem} ${canaille} ${className}`}
        htmlFor={id || internalId}
        style={style}
        ref={ref as React.Ref<HTMLLabelElement>}
      >
        <input
          type="radio"
          {...restOfProps}
          ref={input}
          id={id || internalId}
          name={internalName}
          value={value}
          data-testid={testId}
          className={radioItemInput}
          required={required}
          defaultChecked={defaultValue ? defaultValue === value : undefined}
          disabled={disabled}
        />
        {children}
      </label>
    );
  },
);

RadioItem.displayName = 'RadioItem';

export interface IRadio extends ICommonProps, IFormProps {
  /**
   * Radio size
   */
  size?: number;
  /**
   * Radio.Item content
   */
  children: React.ReactNode;
  /**
   * Name used to identify the radio group onSubmit event
   */
  name?: string;
}

const Radio: React.ForwardRefExoticComponent<
Omit<IRadio, 'ref'> & React.RefAttributes<unknown>
> & { Item: typeof RadioItem } = Object.assign(
  React.forwardRef(
    (
      {
        children,
        onChange,
        id,
        testId,
        className,
        size = 100,
        style,
        value,
        defaultValue,
        disabled,
        validateOnChange,
        onInvalid,
        checkValidity,
        name,
        ...restOfProps
      }: IRadio,
      ref,
    ) => {
      const root = React.useRef<HTMLFieldSetElement>(null);
      React.useImperativeHandle(ref, () => root.current);
      const { radio } = useStyle({});
      const v4 = React.useId();
      const internalName = React.useMemo(() => name || `radio-${v4}`, [name]);

      const {
        onInput,
        onInvalid: onInvalidInternal,
        error,
      } = useValidation({
        root,
        validateOnChange: validateOnChange as boolean,
        onInvalid,
        checkValidity,
      });

      const contextValue = React.useMemo(() => ({
        value,
        globalDisabled: disabled,
        internalName,
        defaultValue,
        onChange,
        error,
        size,
      }), [value, disabled, internalName, defaultValue, onChange, error, size]);

      return (
        <RadioContext.Provider
          value={contextValue}
        >
          <fieldset
            {...restOfProps}
            ref={root as React.LegacyRef<HTMLFieldSetElement>}
            id={id}
            data-testid={testId}
            className={`${radio} ${className}`}
            style={style}
            onInput={onInput}
            onInvalid={onInvalidInternal}
            disabled={disabled}
          >
            {children}
            {error && <Error>{error}</Error>}
          </fieldset>
        </RadioContext.Provider>
      );
    },
  ),
  {
    Item: RadioItem,
  },
);

Radio.displayName = 'Radio';

export { RadioItem, Radio };
