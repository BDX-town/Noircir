import type { Story } from '@ladle/react';
import React from 'react';
import { TextInput } from './common.tsx';

import '../../scss/google-fonts.scss';

export const TextInputStory: Story = (props) => <TextInput {...props} />;
TextInputStory.storyName = 'TextInput';

TextInputStory.args = {
  htmlType: 'text',
  label: 'test',
  placeholder: 'placeholder',
};
TextInputStory.argTypes = {
  htmlType: {
    options: ['email', 'number', 'password', 'search', 'tel', 'text', 'url'],
    control: { type: 'select' },
    defaultValue: 'text',
  },
  state: {
    options: ['default', 'hover', 'focus'],
    control: { type: 'select' },
  },
};
