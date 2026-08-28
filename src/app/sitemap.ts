import type { MetadataRoute } from 'next';
import { getPosts } from '@/lib/posts';
import { SITE } from '@/lib/site-data';

export const dynamic = 'force-static';

/**
 * Built from the same `getPosts` the blog routes use, so a published post cannot
 * be reachable but unlisted — the two can never disagree about what exists.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();

  return [
    {
      url: `${SITE.url}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE.url}/blog/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${SITE.url}/blog/${post.slug}/`,
      lastModified: new Date(post.date),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ];
}
