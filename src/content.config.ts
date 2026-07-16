import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { githubDocsLoader } from './loaders/github-docs';

// News posts. Drop a Markdown file in src/content/news/ and it shows up on the
// News page and, if it is the newest, on the home page. Put header images in
// public/news/ and point `image` at them (for example /news/my-post.png).
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    author: z.string().default('Trevor'),
    authorGithub: z.string().default('trevorftp'),
    image: z.string().optional(),
    summary: z.string().optional(),
  }),
});

// Docs are pulled from the StratumDocs repo at build time. Each Markdown file
// becomes a page under /docs. Folder names become sidebar groups unless a page
// sets `category`. Ordering is controlled by `order` (page) and `categoryOrder`
// (group). A file named index.md is the /docs landing page.
const docs = defineCollection({
  loader: githubDocsLoader({ owner: 'StratumServer', repo: 'StratumDocs', branch: 'main' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().default(100),
    category: z.string().optional(),
    categoryOrder: z.number().optional(),
  }),
});

export const collections = { news, docs };
