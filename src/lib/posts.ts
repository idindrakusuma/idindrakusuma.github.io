/**
 * The blog's content seam.
 *
 * Nothing here reads a file, a database or a CMS yet — the list is empty and the
 * pages that consume it render an empty state. The point of the seam is that the
 * decision about where posts actually come from (MDX in the repo, plain Markdown,
 * a headless CMS, a remote API) can be made later without touching the routes:
 * whatever backs it satisfies these two functions.
 *
 * Both are async even though the current bodies are not, because every plausible
 * backing store is. Making them async now costs nothing — the callers are server
 * components that already await — and saves changing every call site later.
 */

export type Post = {
  /** URL segment. Must be unique, lowercase, no slashes — it becomes /blog/{slug}. */
  slug: string;
  title: string;
  /** Used for the card copy and the page's meta description. */
  description: string;
  /** ISO 8601 date, e.g. '2026-08-28'. Drives ordering and the <time> element. */
  date: string;
  /** Whole minutes. Omitted until there is body text to measure. */
  readingMinutes?: number;
};

/**
 * Every published post, newest first.
 *
 * Ordering belongs here rather than in the pages so the index, the sitemap and
 * any future feed cannot disagree about what "newest" means.
 */
export async function getPosts(): Promise<Post[]> {
  return [];
}

/** One post by slug, or null when nothing matches. */
export async function getPost(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}
