import type { Meta, StoryObj } from '@storybook/react-vite';

import Article from './../parts/Article';

import { page, blog } from './data'

const meta = {
  component: Article,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof Article>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        ...blog,
        ...page
    }
 };
