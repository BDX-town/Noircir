import type { Meta, StoryObj } from "@storybook/web-components";
import './index.js'

const meta: Meta = {
  component: "article-item",
};

export default meta;
type Story = StoryObj;

export const Exemple: Story = {
  args: {
    article: {
      title: "Erreurs et regrets",
      description: "Pour une fois je vais essayer de faire un test court",
      updatedAt: new Date(),
      tags: ["test"],
      coverUrl: "https://img.freepik.com/premium-photo/cute-3d-clay-stylized-rendered-professional-holding-business-card-light-green-orange_967785-58968.jpg",
      url: "https://exemple.com/article/erreurs-et-regrets"
    }
  }
};
