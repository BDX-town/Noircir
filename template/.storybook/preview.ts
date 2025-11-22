import type { Preview } from "@storybook/web-components";

// @ts-expect-error no typedef
import './../src/main.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: { expanded: true },
  },
};

export default preview;