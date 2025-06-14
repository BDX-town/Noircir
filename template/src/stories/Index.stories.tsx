import type { Meta, StoryObj } from '@storybook/react-vite';

import Index from './../parts/Index';

import { page, blog } from './data'


const meta = {
  component: Index,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof Index>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        ...blog,
        pages: [{ data: page, page: page.page}, { data: { ...page, cover: null }, page: page.page}, { data: page, page: page.page}, { data: page, page: page.page}]
    }
 };
