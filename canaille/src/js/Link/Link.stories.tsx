import type { Story } from '@ladle/react';
import React from 'react';
import { Link } from './common.tsx';

export const LinkStory: Story = (props) => <Link {...props}>Test</Link>;
LinkStory.storyName = 'Link';

LinkStory.args = { className: '', href: undefined };
LinkStory.argTypes = {
  state: { options: ['default', 'hover'], control: { type: 'select' } },
  size: { options: [100, 50], control: { type: 'select' } },
  href: { control: { type: 'text' } },
};
