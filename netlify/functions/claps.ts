import type { Config, Context } from '@netlify/functions';
import { MAX_PER_VISITOR, addClaps, isSlug, readClaps, visitorKey } from '../claps/core';
import { clapStore } from '../claps/store';

/**
 * The blog's clap counter: GET reads a post's claps, POST adds to them.
 *
 * The site itself is a static export, so this is the one piece of it that
 * runs on a server. The rules live in ../claps/core.ts; this file is the HTTP
 * edge around them — input checks, which store, who the visitor is.
 */

/**
 * The salt that makes a visitor key unguessable, from the CLAP_SALT
 * environment variable. It must be the same value in every context that can
 * write: a preview salted differently would see every visitor as new and hand
 * out a fresh ten claps per post. So there is no fallback — a context without
 * it can read counts but not add to them.
 */
function salt(): string | null {
  return Netlify.env.get('CLAP_SALT') || null;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

/**
 * Only a post that exists can be clapped for, so the store cannot be filled
 * with made-up slugs. The static site is the list of posts: its own page for
 * the slug either answers or it does not.
 */
async function postExists(req: Request, slug: string): Promise<boolean> {
  const page = await fetch(new URL(`/blog/${slug}/`, req.url), { method: 'HEAD', redirect: 'manual' });
  return page.ok;
}

export default async (req: Request, context: Context) => {
  const secret = salt();

  if (req.method === 'GET') {
    const slug = new URL(req.url).searchParams.get('slug');
    if (!isSlug(slug)) return json({ error: 'invalid slug' }, 400);
    const visitor = secret ? visitorKey(context.ip, secret) : null;
    return json(await readClaps(clapStore(), slug, visitor));
  }

  if (!secret) return json({ error: 'claps are not configured' }, 503);

  let body: { slug?: unknown; count?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'invalid body' }, 400);
  }
  const { slug, count } = body;
  if (!isSlug(slug)) return json({ error: 'invalid slug' }, 400);
  if (typeof count !== 'number' || !Number.isInteger(count) || count < 1 || count > MAX_PER_VISITOR) {
    return json({ error: 'invalid count' }, 400);
  }
  if (!(await postExists(req, slug))) return json({ error: 'unknown post' }, 404);

  return json(await addClaps(clapStore(), slug, visitorKey(context.ip, secret), count));
};

export const config: Config = {
  path: '/api/claps',
  method: ['GET', 'POST'],
  // Netlify turns away anything past this before the function even starts,
  // which also keeps a flood of requests from spending the invocation quota.
  rateLimit: { windowLimit: 30, windowSize: 60, aggregateBy: ['ip', 'domain'] },
};
