import React from 'react';

import { TablerIconsProps } from '@tabler/icons-react';
import { ICommonProps } from '../types/ICommonProps';
import { IFormProps } from '../types/IFormProps';
import { createUseStyles } from '../helpers/createUseStyles';

import { Error } from '../Error/common';
import { useValidation } from '../helpers/form/form';

import { textInputCSS } from './style';

import '../../scss/index.scss';

export const TEXTINPUTICON_DISPLAYNAME = 'TextInputIcon';
export const TEXTINPUTERASE_DISPLAYNAME = 'TextInputErase';
export const TEXTINPUTSELECT_DISPLAYNAME = 'TextInputSelect';

const useStyle = createUseStyles({
  textInput: {
    '--display': 'unset',
    '--background-color': 'unset',
    '--border': 'unset',
    '--box-shadow': 'unset',
    '--placeholder-color': 'unset',
    '--text-color': 'unset',
    '--padding-top': 'unset',
    '--padding-bottom': 'unset',
    '--padding-left': 'unset',
    '--padding-right': 'unset',
    '--border-radius': 'unset',
    '--font-size': 'unset',

    '--label-display': 'unset',
    '--label-color': 'unset',
    '--label-background-color': 'unset',
    '--label-padding': 'unset',
    '--label-border-radius': 'unset',
    '--label-border': 'unset',
    '--label-box-shadow': 'unset',
    '--label-padding-x': 'unset',
    '--label-padding-y': 'unset',
    '--label-font-size': 'unset',

    border: 0,
    padding: 0,
    display: 'var(--display)',
    minWidth: 0,

    '&>label': {
      position: 'relative',
      display: 'var(--display)',
      width: '100%',

      alignItems: 'center',

      paddingBottom: 'var(--padding-bottom)',
      paddingTop: 'var(--padding-top)',
      paddingLeft: 'var(--padding-left)',
      paddingRight: 'var(--padding-right)',
      border: 'var(--border)',
      boxShadow: 'var(--box-shadow)',
      backgroundColor: 'var(--background-color)',
      color: 'var(--text-color)',
      borderRadius: 'var(--border-radius)',

      transition: 'box-shadow 0.2s ease',

      '&>input': {
        width: '100%',
        display: 'var(--display)',
        fontFamily: 'inherit',
        border: 0,
        fontSize: 'var(--font-size)',
        backgroundColor: 'transparent',
        color: 'inherit',
        '&::placeholder': {
          color: 'var(--placeholder-color)',
          fontFamily: 'inherit',
        },
      } as React.CSSProperties,

      '&>[aria-roledescription=label]': {
        display: 'var(--label-display)',
        fontSize: 'var(--label-font-size)',
        position: 'absolute',
        top: 0,
        border: 'var(--label-border)',
        left: 'var(--padding-left)',
        transform: 'translateY(-50%)',
        color: 'var(--label-color)',
        backgroundColor: 'var(--label-background-color)',
        padding: 'var(--label-padding)',
        borderRadius: 'var(--label-border-radius)',
        boxShadow: 'var(--label-box-shadow)',
        paddingLeft: 'var(--label-padding-x)',
        paddingRight: 'var(--label-padding-x)',
        paddingTop: 'var(--label-padding-y)',
        paddingBottom: 'var(--label-padding-y)',
      } as React.CSSProperties,
    } as React.CSSProperties,
  } as React.CSSProperties,
  canaille: ({ state }) => textInputCSS(state),
});

interface ITextInputContext {
  onErase: React.MouseEventHandler;
  disabled: boolean;
  setError: (e: string | undefined) => void;
}

export const TextInputContext = React.createContext<ITextInputContext>({
  disabled: false,
  setError: () => null,
  onErase: () => null,
});

const TEXTINPUTBEFORE_DISPLAYNAME = 'TextInputBefore';

interface ITextInputBefore {
  children: React.ReactNode;
}

function TextInputBefore({ children }: ITextInputBefore) {
  return children;
}

TextInputBefore.displayName = TEXTINPUTBEFORE_DISPLAYNAME;

export interface ITextInput extends ICommonProps, IFormProps {
  /**
   * Input type
   */
  htmlType?:
  | 'email'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'text'
  | 'url';
  /**
   * Placeholder content to show in the TextInput
   */
  placeholder?: string;
  /**
   * Label associated with the TextInput
   */
  label?: React.ReactNode;
  /**
   * Get focus on page load. Only on field per page.
   */
  autofocus?: boolean;
  /**
   * Maximum string length
   */
  maxLength?: number;
  /**
   * Minimum string length
   */
  minLength?: number;
  /**
   * Read only mode
   */
  readonly?: boolean;
  /**
   * Should activate spellcheck
   */
  spellcheck?: boolean;
  /**
   * The values of the list attribute is the id of a <datalist> element located in the same document
   * The <datalist> provides a list of predefined values to suggest to the user for this input.
   * Any values in the list that are not compatible with the type are not included
   * in the suggested options.
   * The values provided are suggestions, not requirements: users can select from this predefined
   *  list or provide a different value.
   */
  list?: string;
  /**
   * Max value if type number
   */
  max?: number;
  /**
   * Min value if type number
   */
  min?: number;
  /**
   * Step increase if type number
   */
  step?: number;
  /**
   * Regexp that value must match
   */
  pattern?: string;
  /**
   * Optional additional elements
   */
  children?:
  | Array<
  React.ReactElement<
  unknown,
  React.JSXElementConstructor<TablerIconsProps>
  >
  >
  | React.ReactElement<
  unknown,
  React.JSXElementConstructor<TablerIconsProps>
  >;
  state?: 'default' | 'hover' | 'focus';
}

const TextInput = React.forwardRef(
  (
    {
      autofocus,
      checkValidity,
      className,
      defaultValue,
      disabled,
      id,
      label,
      maxLength,
      minLength,
      name,
      onChange,
      onInvalid,
      placeholder,
      readonly,
      required,
      spellcheck,
      style,
      testId,
      validateOnChange,
      value,
      htmlType: type = 'text',
      list,
      max,
      min,
      pattern,
      step,
      children,
      state = 'default',
      ...rest
    }: ITextInput,
    ref,
  ) => {
    const { textInput, canaille } = useStyle({ state });
    const input = React.useRef<HTMLInputElement>(null);
    const uid = React.useId();
    const internalId = id || uid;
    const {
      error,
      setError,
      onInput,
      onInvalid: onInternalInvalid,
    } = useValidation({
      root: input,
      validateOnChange: validateOnChange || false,
      checkValidity,
      onInvalid,
    });

    const { before, select, others } = React.useMemo(() => {
      const wIcons: Array<React.ReactNode> = [];
      const wErase: Array<React.ReactNode> = [];
      const wSelect: Array<React.ReactNode> = [];
      const wOthers: Array<React.ReactNode> = [];
      const wBefore: Array<React.ReactNode> = [];

      React.Children.toArray(children).forEach((c) => {
        const child = c as React.ReactElement<unknown, any>;
        if (child.type?.displayName === TEXTINPUTSELECT_DISPLAYNAME) wSelect.push(child);
        else if (child.type?.displayName === TEXTINPUTBEFORE_DISPLAYNAME) wBefore.push(child);
        else wOthers.push(child);
      });

      return {
        icons: wIcons,
        erase: wErase,
        select: wSelect,
        others: wOthers,
        before: wBefore,
      };
    }, [children]);

    const onErase = React.useCallback(() => {
      if (!input.current) return;
      input.current.value = '';
      const event = new Event('change', { bubbles: true });
      Object.defineProperty(event, 'target', {
        writable: false,
        value: input.current,
      });
      input.current.dispatchEvent(event);
      if (onChange) onChange(event as unknown as React.ChangeEvent);
    }, [onChange]);

    const contextValue = React.useMemo(() => ({
      disabled: disabled || false, setError, onErase,
    }), [disabled, setError, onErase]);

    return (
      <TextInputContext.Provider
        value={contextValue}
      >
        <fieldset
          aria-invalid={!!error}
          ref={ref as React.Ref<HTMLFieldSetElement>}
          className={`${textInput} ${canaille} ${className}`}
          style={style}
          data-testid={testId}
        >
          <label htmlFor={internalId}>
            {before}
            <input
              {...rest}
              ref={input as never}
              type={type}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={autofocus}
              disabled={disabled}
              id={internalId}
              maxLength={maxLength}
              minLength={minLength}
              name={name}
              onChange={onChange}
              // we set " " to allow the css :placeholder-shown to work even when no placeholder
              placeholder={placeholder || ' '}
              readOnly={readonly}
              required={required}
              spellCheck={spellcheck}
              value={value}
              list={list}
              max={max}
              min={min}
              pattern={pattern}
              step={step}
              defaultValue={defaultValue}
              onInvalid={onInternalInvalid}
              onInput={onInput}
            />
            {label && <span aria-roledescription="label">{label}</span>}
            {select}
            {others}
          </label>
        </fieldset>
        {error && <Error>{error}</Error>}
      </TextInputContext.Provider>
    );
  },
);

export { TextInput, TextInputBefore };
