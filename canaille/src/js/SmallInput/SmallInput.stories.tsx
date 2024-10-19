import type { Story } from '@ladle/react';
import React from 'react';
import { SmallInput } from './common.tsx';

export const SmallInputStory: Story = (props) => (
  <div style={{ width: '45px' }}>
    <SmallInput {...props} />
  </div>
);
SmallInputStory.storyName = 'SmallInput';

SmallInputStory.args = {};
SmallInputStory.argTypes = {
  htmlType: {
    options: ['email', 'number', 'password', 'search', 'tel', 'text', 'url'],
    control: { type: 'select' },
  },
  state: {
    options: ['default', 'hover', 'focus'],
    control: { type: 'select' },
  },
};
