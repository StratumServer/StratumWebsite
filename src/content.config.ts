import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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

export const collections = { news };
