// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'whatever-dev-ws.github.io',
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@components': '/src/components',
        '@layouts': '/src/layouts',
        '@pages': '/src/pages',
        '@public': '/public',
        '@styles': '/src/styles',
        '@assets': '/src/assets',
        '@schemas': '/src/schemas',
      },
    },
  },
  integrations: [icon()],
});
