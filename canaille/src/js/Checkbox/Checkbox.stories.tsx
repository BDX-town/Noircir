import type { Story } from '@ladle/react';
import React from 'react';
import { Checkbox } from './common.tsx';

export const CheckboxStory: Story = (props) => (
  <Checkbox {...props}>Test</Checkbox>
);
CheckboxStory.storyName = 'Checkbox';

CheckboxStory.args = { state: 'default' };
CheckboxStory.argTypes = {
  state: {
    options: ['default', 'hover', 'checked'],
    control: { type: 'select' },
    defaultValue: 'default',
  },
  required: {
    options: [true, false],
    control: { type: 'radio' },
  },
};
