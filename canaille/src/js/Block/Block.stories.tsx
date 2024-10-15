import type { Story } from '@ladle/react';
import React from 'react';
import { Block } from './common.tsx';

export const BlockStory: Story = (props) => <Block {...props}>Test</Block>;
BlockStory.storyName = 'Block';

BlockStory.args = {};
BlockStory.argTypes = {
  state: { options: ['default', 'hover'], control: { type: 'select' } },
};
