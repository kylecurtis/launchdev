// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

import icon from 'astro-icon';

import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
    output: 'server',
  integrations: [react(), tailwind(), icon(), starlight({
    title: "Launch.dev",
    description: "Learn a new programming language!",
  })]
});