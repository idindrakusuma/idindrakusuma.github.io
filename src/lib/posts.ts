import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import matter from 'gray-matter';

/**
 * The blog's content, read from content/posts/*.mdx at build time.
 *
 * The site is a static export, so all of this runs once during `next build` and
 * never in a browser. Posts were migrated out of the old Hexo blog by
 * scripts/migrate-posts.mjs; content/posts is the source of truth now.
 */

/**
 * The five the blog filters on. Hexo used six — `portofolio` folded into Story
 * during migration, since those posts are project narratives rather than how-tos.
 */
export const CATEGORIES = ['Development', 'Story', 'Tutorial', 'Kuliah', 'Tips'] as const;

export type Category = (typeof CATEGORIES)[number];

export type Post = {
  /** URL segment: /blog/{slug}. Taken from the original Hexo filename. */
  slug: string;
  title: string;
  /** The post's own words — everything before its `<!-- more -->` marker. */
  excerpt: string;
  /** ISO 8601, as written in the original frontmatter. */
  date: string;
  category: Category;
  tags: string[];
  /** Local path under /images/posts, vendored by scripts/prepare-post-images.mjs. */
  thumbnail: string;
  readingMinutes: number;
};

const postsDir = join(process.cwd(), 'content', 'posts');

/** "16 Feb 2019" — the form the design's cards and article headers use. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * A post's excerpt is its full opening paragraph, which is longer than a meta
 * description should be. Cut at a word boundary for the tags that need it; the
 * page itself still shows the whole thing.
 */
export function summarise(text: string, max = 155): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[.,;:]$/, '')}…`;
}

/** Old Hexo permalink, kept so the redirects can be generated from the posts. */
export function hexoPath(post: Post): string {
  const d = new Date(post.date);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `/${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${post.slug}/`;
}

function toPost(slug: string, data: Record<string, unknown>): Post {
  const category = data.category as Category;
  if (!CATEGORIES.includes(category)) {
    throw new Error(`${slug}: unknown category "${String(data.category)}"`);
  }
  return {
    slug,
    title: String(data.title),
    excerpt: String(data.excerpt),
    date: String(data.date),
    category,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    thumbnail: String(data.thumbnail),
    readingMinutes: Number(data.readingMinutes),
  };
}

let cache: Post[] | null = null;

/**
 * Every post, newest first.
 *
 * Ordering lives here rather than in the pages so the index, the article's
 * "next" link, the sitemap and the redirects cannot disagree about it.
 */
export async function getPosts(): Promise<Post[]> {
  if (cache) return cache;

  const files = (await readdir(postsDir)).filter((f) => f.endsWith('.mdx'));
  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(join(postsDir, file), 'utf8');
      return toPost(file.replace(/\.mdx$/, ''), matter(raw).data);
    }),
  );

  cache = posts.sort((a, b) => b.date.localeCompare(a.date));
  return cache;
}

export async function getPost(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

/** The MDX body, without frontmatter. Compiled by the article page. */
export async function getPostBody(slug: string): Promise<string> {
  const raw = await readFile(join(postsDir, `${slug}.mdx`), 'utf8');
  return matter(raw).content;
}

/**
 * The post published just before this one, or null at the oldest.
 *
 * Chronological rather than within-category: several categories hold only a
 * handful of posts, and a "next" that dead-ends immediately is worse than one
 * that keeps going.
 */
export async function getNextPost(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  return index === -1 ? null : (posts[index + 1] ?? null);
}
