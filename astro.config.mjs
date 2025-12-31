// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import icon from 'astro-icon';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  site: 'https://whatever-dev-ws.github.io',
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
        '@utils': '/src/utils',
      },
    },
  },
  integrations: [icon(), svelte()],
});
