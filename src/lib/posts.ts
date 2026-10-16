import { readFileSync } from 'node:fs';
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
  /**
   * The meta description, when the post writes its own. Otherwise the excerpt
   * is cut to length — see summarise — which can drop exactly the part worth
   * showing in a search result when the opening paragraph runs long.
   */
  description?: string;
  /** ISO 8601, as written in the original frontmatter. */
  date: string;
  /**
   * When the post was last revised in substance, if it has been. Same form as
   * `date`, and never before it. Shown beside the publish date and given to
   * search engines as the modified time.
   */
  updated?: string;
  category: Category;
  tags: string[];
  /**
   * Local path under /images/posts, vendored by scripts/prepare-post-images.mjs.
   * Empty only on a draft — the card falls back to its own empty tile.
   */
  thumbnail: string;
  readingMinutes: number;
  /**
   * BCP 47 tag for the post's own text. The site's chrome is English and the
   * migrated archive is Indonesian, so a post says which it is rather than
   * inheriting a wrong answer from either.
   */
  lang: string;
  /**
   * Set on a translation: the slug of the post it translates. Each language
   * lives at its own URL, and the two point at each other with hreflang. Only
   * the original is listed on the index; the translation is reached from it.
   */
  translationOf?: string;
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
 * A post's date as an instant. Frontmatter writes local Jakarta time with no
 * zone ('2026-10-15 18:59:18'), and `new Date` would read that in whatever
 * zone the build machine runs in — UTC on Netlify, +07 on a laptop — so the
 * same post would publish different timestamps depending on where it was
 * built. A zoneless date is pinned to WIB here; one that names its zone keeps it.
 */
export function postInstant(date: string): Date {
  const local = date.trim().match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}(?::\d{2})?))?$/);
  if (!local) return new Date(date);
  return new Date(`${local[1]}T${local[2] ?? '00:00'}${local[2]?.length === 5 ? ':00' : ''}+07:00`);
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

/** The description search results and previews show: the post's own, or its excerpt cut to length. */
export function postDescription(post: Post): string {
  return post.description ?? summarise(post.excerpt);
}

/** ~200 words a minute, floored at one. */
const readingMinutes = (text: string) => Math.max(1, Math.round(text.split(/\s+/).length / 200));

/**
 * Separates a post's lead from the rest of it.
 *
 * A post that names its own `excerpt` keeps its body whole: that is how the
 * migrated posts arrive, with the lead already lifted out by
 * scripts/migrate-posts.mjs.
 *
 * A post that does not — anything written by hand — has one derived from its
 * opening paragraph, and that paragraph then has to come out of the body. The
 * article renders the excerpt as the lead above the prose, so leaving it in
 * printed it twice: once large under the title, once again as the first line.
 */
function splitLead(
  data: Record<string, unknown>,
  content: string,
): { excerpt: string; body: string } {
  if (typeof data.excerpt === 'string') return { excerpt: data.excerpt, body: content };

  const trimmed = content.trimStart();
  const breakAt = trimmed.search(/\n\s*\n/);
  const lead = breakAt === -1 ? trimmed : trimmed.slice(0, breakAt);

  return {
    excerpt: lead
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[*_`#>]/g, '')
      .replace(/\s+/g, ' ')
      .trim(),
    body: breakAt === -1 ? '' : trimmed.slice(breakAt).trimStart(),
  };
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

  const updated = typeof data.updated === 'string' && data.updated.trim() ? data.updated.trim() : undefined;
  if (updated !== undefined) {
    const time = new Date(updated).getTime();
    if (Number.isNaN(time)) throw new Error(`content/posts/${slug}.mdx: updated "${updated}" is not a date`);
    if (time < new Date(date).getTime()) {
      throw new Error(`content/posts/${slug}.mdx: updated "${updated}" is before date "${date}"`);
    }
  }

  const { excerpt } = splitLead(data, body);
  if (!excerpt) throw new Error(`content/posts/${slug}.mdx: no excerpt, and none could be derived`);

  return {
    slug,
    title: need('title'),
    excerpt,
    ...(typeof data.description === 'string' && data.description.trim()
      ? { description: data.description.trim() }
      : {}),
    date,
    ...(updated ? { updated } : {}),
    category,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    // A draft is allowed to not have one yet; publishing without one is not.
    thumbnail: draft ? String(data.thumbnail ?? '') : need('thumbnail'),
    readingMinutes:
      typeof data.readingMinutes === 'number' ? data.readingMinutes : readingMinutes(`${excerpt} ${body}`),
    // The archive is Indonesian; a post in another language says so.
    lang: typeof data.lang === 'string' ? data.lang : 'id',
    ...(typeof data.translationOf === 'string' && data.translationOf.trim()
      ? { translationOf: data.translationOf.trim() }
      : {}),
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

  // A translation must name a shipped original in another language, and an
  // original rather than another translation — so every family is one level.
  for (const post of cache) {
    if (!post.translationOf) continue;
    const original = cache.find((p) => p.slug === post.translationOf);
    const where = `content/posts/${post.slug}.mdx: translationOf "${post.translationOf}"`;
    if (!original) throw new Error(`${where} is not a published post`);
    if (original.translationOf) throw new Error(`${where} is itself a translation`);
    if (original.lang === post.lang) throw new Error(`${where} is in the same language (${post.lang})`);
  }
  return cache;
}

/**
 * The posts the index lists, newest first: every original, and no
 * translation — a story appears once, in the language it was written in.
 */
export async function getListedPosts(): Promise<Post[]> {
  return (await getPosts()).filter((post) => !post.translationOf);
}

/**
 * Every language a post exists in, the original first, as hreflang wants
 * them: the post itself included. A post with no translation gets just itself.
 */
export async function getTranslations(post: Post): Promise<{ lang: string; slug: string }[]> {
  const posts = await getPosts();
  const root = post.translationOf ?? post.slug;
  return posts
    .filter((p) => p.slug === root || p.translationOf === root)
    .sort((a, b) => Number(Boolean(a.translationOf)) - Number(Boolean(b.translationOf)))
    .map(({ lang, slug }) => ({ lang, slug }));
}

export async function getPost(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

/** The MDX body, without frontmatter. Compiled by the article page. */
export async function getPostBody(slug: string): Promise<string> {
  const { data, content } = matter(await readFile(join(postsDir, `${slug}.mdx`), 'utf8'));
  return splitLead(data, content).body;
}

/**
 * The post published just before this one, or null at the oldest.
 *
 * Chronological rather than within-category: several categories hold only a
 * handful of posts, and a "next" that dead-ends immediately is worse than one
 * that keeps going.
 */
export async function getNextPost(slug: string): Promise<Post | null> {
  const posts = await getListedPosts();
  // A translation follows the index from its original's place in it.
  const at = (await getPost(slug))?.translationOf ?? slug;
  const index = posts.findIndex((post) => post.slug === at);
  return index === -1 ? null : (posts[index + 1] ?? null);
}

type CardManifest = Record<string, { thumbnail: string; widths: number[] }>;

let cards: CardManifest | null = null;

/**
 * What scripts/prepare-post-images.mjs recorded about the card copies: for each
 * post, the thumbnail they were cut from and the widths it wrote. Read once,
 * like the posts themselves.
 */
function cardManifest(): CardManifest {
  if (cards) return cards;
  try {
    cards = JSON.parse(readFileSync(join(process.cwd(), 'public', 'images', 'posts', 'cards', 'manifest.json'), 'utf8'));
  } catch {
    cards = {};
  }
  return cards!;
}

/**
 * The index card's thumbnail as a srcset, from the card-sized copies that
 * scripts/prepare-post-images.mjs writes. The thumbnail itself can be 1200px,
 * which is a lot to download for a slot 120px wide on a phone.
 *
 * The copies count only if they were cut from the post's current thumbnail, so
 * a changed thumbnail cannot leave the index showing the old picture. A draft
 * without up-to-date copies falls back to the full thumbnail; a published post
 * fails the build, like a missing share image does.
 */
export function cardImage(post: Post): { src: string; srcSet?: string } | null {
  if (!post.thumbnail) return null;
  const entry = cardManifest()[post.slug];
  if (entry?.thumbnail !== post.thumbnail) {
    if (post.draft) return { src: post.thumbnail };
    throw new Error(`Card images for "${post.slug}" are missing or out of date — run \`pnpm assets:posts\``);
  }
  const href = (width: number) => `/images/posts/cards/${post.slug}-${width}.webp`;
  return {
    src: href(entry.widths[entry.widths.length - 1]),
    srcSet: entry.widths.map((width) => `${href(width)} ${width}w`).join(', '),
  };
}
