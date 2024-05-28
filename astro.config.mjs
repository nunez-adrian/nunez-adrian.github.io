import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";
import tailwindcssNesting from 'tailwindcss/nesting'

// https://astro.build/config
export default defineConfig({
  site: 'https://nunez-adrian.github.io',
  integrations: [tailwind()],
  vite: {
    css: {
      postcss: {
        plugins: [tailwindcssNesting()]
      }
    }
  }
});