// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import svgr from 'vite-plugin-svgr';
import vercel from '@astrojs/vercel';

export default defineConfig({
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss(), svgr()],
  },
  integrations: [react()],
});
