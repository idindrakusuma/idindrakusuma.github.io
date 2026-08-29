/**
 * Scaffolds a new blog post.
 *
 *   pnpm new-post "Judul Tulisan Saya" --category Development
 *
 * Writes content/posts/<slug>.mdx with the frontmatter filled in and nothing
 * else to decide, so the next thing you do is write.
 *
 * The post starts as a draft. Drafts are served by `next dev` and skipped by
 * `next build`, which is what lets the file exist before it has a thumbnail —
 * that field is required of a published post and would otherwise block the
 * build from the moment the file appeared.
 */
import { readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const CATEGORIES = ['Development', 'Story', 'Tutorial', 'Kuliah', 'Tips'];

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = join(root, 'content', 'posts');

function usage(message) {
  console.error(
    [
      message && `\n  ${message}\n`,
      '  Usage: pnpm new-post "Judul Tulisan" [--category <name>] [--slug <slug>]',
      '',
      `  Categories: ${CATEGORIES.join(' · ')}   (default: Development)`,
      '',
    ]
      .filter(Boolean)
      .join('\n'),
  );
  process.exit(1);
}

const argv = process.argv.slice(2);
const flag = (name) => {
  const at = argv.indexOf(`--${name}`);
  return at === -1 ? null : argv[at + 1];
};

const title = argv.find((a) => !a.startsWith('--') && argv[argv.indexOf(a) - 1]?.startsWith('--') !== true);
if (!title) usage('A title is required.');

const category = flag('category') ?? 'Development';
if (!CATEGORIES.includes(category)) usage(`"${category}" is not a category.`);

/**
 * The filename is the URL, so it is lowercase and free of anything that would
 * need escaping. Accents are folded rather than dropped — "Menaklukkan Café"
 * should become "cafe", not "caf".
 */
function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const slug = slugify(flag('slug') ?? title);
if (!slug) usage('That title has no letters or digits to build a slug from.');

const existing = await readdir(postsDir);
if (existing.includes(`${slug}.mdx`)) usage(`content/posts/${slug}.mdx already exists.`);

/** Local time, in the shape the other posts use. */
const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const stamp =
  `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
  `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

const file = join(postsDir, `${slug}.mdx`);
await writeFile(
  file,
  `---
title: '${title.replace(/'/g, "''")}'
date: '${stamp}'
category: ${category}
tags: []
thumbnail: ''
draft: true
---

Paragraf pembuka. Ini yang muncul sebagai excerpt di halaman daftar dan sebagai
lead di atas artikel, jadi tulis seolah itu ringkasan satu paragraf.

## Judul Bagian

Isi tulisannya di sini.
`,
  'utf8',
);

console.log(`
  content/posts/${slug}.mdx

  /blog/${slug}/          — visible in \`pnpm dev\` now
  category: ${category}

  Before publishing:
    · set a thumbnail (a path under /images/posts, or a URL then \`pnpm assets:posts\`)
    · add tags if you want them
    · remove \`draft: true\`
`);
