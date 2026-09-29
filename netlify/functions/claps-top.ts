import type { Config } from '@netlify/functions';
import { topClaps } from '../claps/core';
import { clapStore } from '../claps/store';

/**
 * The most-clapped posts, for the Popular list on the blog index.
 *
 * Ranking reads every post's total, so the answer is cached at Netlify's edge
 * for five minutes and served stale while it refreshes: the index never waits
 * on it, and a busy day costs one invocation per five minutes rather than one
 * per visit. The browser itself caches for a minute.
 */
export default async () => {
  const top = await topClaps(clapStore(), 20);
  return new Response(JSON.stringify(top), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, max-age=60',
      'netlify-cdn-cache-control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
};

export const config: Config = {
  path: '/api/claps/top',
  method: 'GET',
  rateLimit: { windowLimit: 30, windowSize: 60, aggregateBy: ['ip', 'domain'] },
};
