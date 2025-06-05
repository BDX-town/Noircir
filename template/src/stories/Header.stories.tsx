import type { Meta, StoryObj } from '@storybook/react-vite';

import { Header } from './../parts/Header'

const meta = {
  component: Header,
  tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        blogName: "Test",
        blogDescription: "Blogs typically adhere to well-established structures, but this design dares to break away from the norm. Instead of relying on winning formulas, it offers a refreshing approach to displaying your thoughts on a blog. This theme design is not about certainty; it's about embracing new perspectives. Maybe it's the one for you.",
        fediverse: "clovis@bdx.town", 
        blogCover: '',
    }
 };
