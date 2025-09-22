import type { Meta, StoryObj } from "@storybook/web-components";
import './index.js'
import { html } from "lit";
import type { Blog } from "../types.js";

const meta: Meta = {
    component: "blog-description",
};

export default meta;
type Story = StoryObj;

function Render({ blog }: { blog: Blog }) {
    return html`
        <blog-description blog=${JSON.stringify(blog)}></blog-description>
    `
}


export const Exemple: Story = {
    render: Render as any,
    args: {
        blog: {
            coverUrl: "https://img.freepik.com/premium-photo/cute-3d-clay-stylized-rendered-professional-holding-business-card-light-green-orange_967785-58619.jpg",
            title: "Mon Blog",
            description: "Je suis un grand auteur depuis que mes deux parents sont morts dans un accident de chasse-neige."
        }
    }
};
