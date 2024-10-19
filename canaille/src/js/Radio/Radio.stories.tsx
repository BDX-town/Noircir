import type { Story } from '@ladle/react';
import React from 'react';
import { Radio } from './common.tsx';

export const RadioStory: Story = (props) => (
  <Radio>
    <Radio.Item {...props} value={0}>
      Option 0
    </Radio.Item>
    <Radio.Item {...props} value={1}>
      Option 1
    </Radio.Item>
  </Radio>
);
RadioStory.storyName = 'Radio';

RadioStory.args = { className: '', state: 'default' };
RadioStory.argTypes = {
  state: {
    options: ['default', 'hover', 'checked'],
    control: { type: 'select' },
    defaultValue: 'default',
  },
};
