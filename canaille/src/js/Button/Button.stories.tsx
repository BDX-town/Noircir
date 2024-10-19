import type { Story } from '@ladle/react';
import React from 'react';
import { Button } from './common.tsx';

import '../../scss/google-fonts.scss';

export const ButtonStory: Story = (props) => <Button {...props}>Test</Button>;
ButtonStory.storyName = 'Button';

ButtonStory.args = {
  htmlType: 'button',
  disabled: false,
  variant: 'primary',
  size: 100,
  state: 'default',
};
ButtonStory.argTypes = {
  htmlType: {
    options: ['button', 'submit'],
    control: { type: 'select' },
    defaultValue: 'button',
  },
  variant: {
    options: ['primary', 'secondary', 'light'],
    control: { type: 'select' },
    defaultValue: 'primary',
  },
  size: { options: [50, 100], control: { type: 'select' }, defaultValue: 100 },
  state: {
    options: ['hover', 'default'],
    control: { type: 'select' },
    defaultValue: 'default',
  },
};
