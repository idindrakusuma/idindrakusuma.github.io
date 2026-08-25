import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site-data';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE.url}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
