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
  /**
   * Local path under /images/posts, vendored by scripts/prepare-post-images.mjs.
   * Empty only on a draft — the card falls back to its own empty tile.
   */
  thumbnail: string;
  readingMinutes: number;
  /** Served by `next dev`, skipped by `next build`. */
  draft: boolean;
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

/** ~200 words a minute, floored at one. */
const readingMinutes = (text: string) => Math.max(1, Math.round(text.split(/\s+/).length / 200));

/** First paragraph, stripped to plain text — the fallback when none is given. */
function deriveExcerpt(body: string): string {
  const first = body.trim().split(/\n\s*\n/)[0] ?? '';
  return first
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`#>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Reads one post's frontmatter, and says so when it cannot.
 *
 * A missing field used to become the string "undefined" on the page and pass
 * the build without a word. Writing a post is hand work now that the migration
 * is done, so the fields it cannot guess are required and the rest are derived.
 */
function toPost(slug: string, data: Record<string, unknown>, body: string): Post {
  const need = (field: string): string => {
    const value = data[field];
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error(`content/posts/${slug}.mdx: "${field}" is required`);
    }
    return value;
  };

  const draft = data.draft === true;

  const category = data.category as Category;
  if (!CATEGORIES.includes(category)) {
    throw new Error(
      `content/posts/${slug}.mdx: category "${String(data.category)}" is not one of ${CATEGORIES.join(', ')}`,
    );
  }

  const date = need('date');
  if (Number.isNaN(new Date(date).getTime())) {
    throw new Error(`content/posts/${slug}.mdx: date "${date}" is not a date`);
  }

  const excerpt = typeof data.excerpt === 'string' ? data.excerpt : deriveExcerpt(body);
  if (!excerpt) throw new Error(`content/posts/${slug}.mdx: no excerpt, and none could be derived`);

  return {
    slug,
    title: need('title'),
    excerpt,
    date,
    category,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    // A draft is allowed to not have one yet; publishing without one is not.
    thumbnail: draft ? String(data.thumbnail ?? '') : need('thumbnail'),
    readingMinutes:
      typeof data.readingMinutes === 'number' ? data.readingMinutes : readingMinutes(`${excerpt} ${body}`),
    draft,
  };
}

let cache: Post[] | null = null;

/**
 * Drafts are readable while writing and never shipped.
 *
 * `next dev` renders them so a post can be previewed at its real URL before it
 * is finished; `next build` drops them, which also means an unfinished post
 * cannot reach the sitemap or a "next article" link.
 */
const includeDrafts = process.env.NODE_ENV !== 'production';

/**
 * Every published post, newest first.
 *
 * Ordering lives here rather than in the pages so the index, the article's
 * "next" link, the sitemap and the redirects cannot disagree about it.
 */
export async function getPosts(): Promise<Post[]> {
  if (cache) return cache;

  const files = (await readdir(postsDir)).filter((f) => f.endsWith('.mdx'));
  const posts = await Promise.all(
    files.map(async (file) => {
      const { data, content } = matter(await readFile(join(postsDir, file), 'utf8'));
      return toPost(file.replace(/\.mdx$/, ''), data, content);
    }),
  );

  cache = posts
    .filter((post) => includeDrafts || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
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
