import React from 'react';
import { IconSearch } from '@tabler/icons-react';
import { createUseStyles } from '../helpers/createUseStyles';
import { ITextInput, TextInput } from '../TextInput/common';
import { searchInput } from './style';

import '../../scss/index.scss';

const useStyle = createUseStyles({
  variables: {
    '--button-background-color': 'unset',
    '--button-border': 'unset',
    '--button-box-shadow': 'unset',
    '--button-padding': 'unset',
    '--button-border-radius': 'unset',
  } as React.CSSProperties,
  button: {
    backgroundColor: 'var(--button-background-color)',
    border: 'var(--button-border)',
    boxShadow: 'var(--button-box-shadow)',
    padding: 'var(--button-padding)',
    borderRadius: 'var(--button-border-radius)',
  } as React.CSSProperties,
  canaille: ({ variant, state }) => searchInput(variant, state),
});

interface ISearchInput extends Omit<ITextInput, 'size'> {
  state?: 'default' | 'hover' | 'focus';
  variant?: 'default' | 'mini';
}

const SearchInput = React.forwardRef(
  (
    {
      className = '',
      placeholder = 'Search',
      variant,
      state,
      ...rest
    }: ISearchInput,
    ref,
  ) => {
    const { canaille, variables, button } = useStyle({ variant, state });

    return (
      <TextInput
        {...rest}
        ref={ref}
        className={`${variables} ${canaille} ${className}`}
        placeholder={placeholder}
        state={state}
      >
        <button aria-label="search" type="button" className={button}>
          <IconSearch size={20} />
        </button>
      </TextInput>
    );
  },
);

export { SearchInput };
