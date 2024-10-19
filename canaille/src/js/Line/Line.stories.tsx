import type { Story } from '@ladle/react';
import React from 'react';
import { Line } from './common.tsx';

export const LineStory: Story = (props) => <Line {...props}></Line>;
LineStory.storyName = 'Line';

LineStory.args = { className: '' };
LineStory.argTypes = {
  variant: { options: ['dashed', 'solid'], control: { type: 'select' } },
};
