import type { Meta, StoryObj } from "@storybook/web-components";
import './index.js'
import { html } from "lit";

const meta: Meta = {
  component: "blog-logo",
};

export default meta;
type Story = StoryObj;

function Render() {
    return html`
        <blog-logo>
            Ouaf !
        </blog-logo>
    `
}

export const Exemple: Story = {
    render: Render,
    args: {}
};
