import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkNormalizeCodeLang } from './src/utils/remark-normalize-code-lang.mjs';

export default defineConfig({
  site: 'https://wrongtrojan.github.io',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, remarkNormalizeCodeLang],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: {
      theme: 'dracula',
      wrap: false,
      langAlias: {
        C: 'c',
        'C++': 'cpp',
        Cpp: 'cpp',
        Python: 'python',
        JSON: 'json',
      },
    },
  },
  vite: {
    build: { cssMinify: 'lightningcss' },
  },
});
