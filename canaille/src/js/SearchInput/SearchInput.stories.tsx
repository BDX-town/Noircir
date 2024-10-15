import type { Story } from '@ladle/react';
import React from 'react';
import { SearchInput } from './common.tsx';

export const SearchInputStory: Story = (props) => <SearchInput {...props} />;
SearchInputStory.storyName = 'SearchInput';

SearchInputStory.args = { className: '', placeholder: 'Search' };
SearchInputStory.argTypes = {
  htmlType: {
    options: ['email', 'number', 'password', 'search', 'tel', 'text', 'url'],
    control: { type: 'select' },
  },
  state: {
    options: ['default', 'hover', 'focus'],
    control: { type: 'select' },
  },
  variant: { options: ['default', 'mini'], control: { type: 'select' } },
};
