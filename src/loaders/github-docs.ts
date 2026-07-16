import type { Loader, LoaderContext } from 'astro/loaders';
import matter from 'gray-matter';
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

export interface GithubDocsOptions {
  owner: string;
  repo: string;
  branch?: string;
}

interface DocFile {
  path: string;
  content: string;
}

// Local override for development. Set DOCS_LOCAL_DIR to a folder of Markdown
// files and the loader reads from disk instead of GitHub. Handy for previewing
// docs before they are pushed to the docs repo.
async function readLocal(dir: string): Promise<DocFile[]> {
  const out: DocFile[] = [];
  async function walk(current: string) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (/\.mdx?$/i.test(entry.name)) {
        out.push({
          path: relative(dir, full).split(sep).join('/'),
          content: await readFile(full, 'utf8'),
        });
      }
    }
  }
  await walk(dir);
  return out;
}

async function readGithub(opts: GithubDocsOptions): Promise<DocFile[]> {
  const branch = opts.branch ?? 'main';
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const apiHeaders: Record<string, string> = {
    'User-Agent': 'stratum-website',
    Accept: 'application/vnd.github+json',
  };
  if (token) apiHeaders.Authorization = `Bearer ${token}`;

  const treeUrl = `https://api.github.com/repos/${opts.owner}/${opts.repo}/git/trees/${branch}?recursive=1`;
  const res = await fetch(treeUrl, { headers: apiHeaders });
  if (!res.ok) {
    // 404 or 409 (empty repo) etc. Treat as no docs rather than failing the build.
    return [];
  }

  const json = (await res.json()) as { tree?: Array<{ type: string; path: string }> };
  if (!Array.isArray(json.tree)) return [];

  const mdPaths = json.tree
    .filter(node => node.type === 'blob' && /\.mdx?$/i.test(node.path))
    .map(node => node.path);

  const files: DocFile[] = [];
  for (const path of mdPaths) {
    const rawUrl = `https://raw.githubusercontent.com/${opts.owner}/${opts.repo}/${branch}/${path}`;
    const raw = await fetch(rawUrl, { headers: { 'User-Agent': 'stratum-website' } });
    if (raw.ok) {
      files.push({ path, content: await raw.text() });
    }
  }
  return files;
}

export function githubDocsLoader(opts: GithubDocsOptions): Loader {
  return {
    name: 'github-docs-loader',
    async load({ store, logger, parseData, renderMarkdown, generateDigest }: LoaderContext) {
      const localDir = process.env.DOCS_LOCAL_DIR;
      const source = localDir ? `local:${localDir}` : `${opts.owner}/${opts.repo}@${opts.branch ?? 'main'}`;

      let files: DocFile[] = [];
      try {
        files = localDir ? await readLocal(localDir) : await readGithub(opts);
      } catch (error) {
        logger.warn(`Docs loader failed to read ${source}: ${(error as Error)?.message ?? error}`);
        files = [];
      }

      store.clear();

      if (files.length === 0) {
        logger.warn(`No docs found at ${source}. The docs pages will render empty until content exists.`);
        return;
      }

      for (const file of files) {
        const id = file.path.replace(/\.mdx?$/i, '');
        const { data: frontmatter, content: body } = matter(file.content);
        const data = await parseData({ id, data: frontmatter });
        const rendered = await renderMarkdown(body);
        store.set({
          id,
          data,
          body,
          rendered,
          digest: generateDigest(file.content),
          filePath: file.path,
        });
      }

      logger.info(`Loaded ${files.length} docs page(s) from ${source}`);
    },
  };
}
