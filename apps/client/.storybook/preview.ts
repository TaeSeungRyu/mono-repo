import type { Preview } from "@storybook/nextjs-vite";

import "../app/globals.css"; // 추가

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
