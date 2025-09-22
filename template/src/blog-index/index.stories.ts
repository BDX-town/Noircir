import type { Meta, StoryObj } from "@storybook/web-components";
import './index.js'
import { html } from "lit";

const meta: Meta = {
  component: "blog-index",
};

export default meta;
type Story = StoryObj;

function Render() {
    return html`
        <div style="border: 1px solid black;">
            <blog-index />
        </div>
    `
}

export const Exemple: Story = {
    render: Render,
    args: {
        blog: {
            coverUrl: "https://img.freepik.com/premium-photo/cute-3d-clay-stylized-rendered-professional-holding-business-card-light-green-orange_967785-58619.jpg",
            title: "Mon Blog",
            description: "Un blog d'exemple pour Storybook."
        },
        articles: [
            {
                title: "Erreurs et regrets",
                description: "Pour une fois je vais essayer de faire un test court",
                updatedAt: new Date(),
                tags: ["test"],
                coverUrl: "https://img.freepik.com/premium-photo/cute-3d-clay-stylized-rendered-professional-holding-business-card-light-green-orange_967785-58968.jpg",
                url: "https://exemple.com/article/erreurs-et-regrets"
            }
        ]
    }
};
