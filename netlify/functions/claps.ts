import { getDeployStore, getStore } from '@netlify/blobs';
import type { Config, Context } from '@netlify/functions';
import { MAX_PER_VISITOR, addClaps, isSlug, readClaps, visitorKey, type ClapStore } from '../claps/core';

/**
 * The blog's clap counter: GET reads a post's claps, POST adds to them.
 *
 * The site itself is a static export, so this is the one piece of it that
 * runs on a server. The rules live in ../claps/core.ts; this file is the HTTP
 * edge around them — input checks, which store, who the visitor is.
 */

/**
 * Production claps go to the site-wide store. Anything else — a deploy
 * preview, a branch deploy — gets a store of its own that disappears with the
 * deploy, so trying the button on a preview never touches the real counts.
 */
function clapStore(context: Context): ClapStore {
  const options = { name: 'claps', consistency: 'strong' as const };
  return context.deploy.context === 'production' ? getStore(options) : getDeployStore(options);
}

/**
 * The salt that makes a visitor key unguessable. Required in production,
 * where it has to be set as the CLAP_SALT environment variable; elsewhere the
 * deploy's own id stands in, so a preview works without configuration.
 */
function salt(context: Context): string | null {
  const configured = Netlify.env.get('CLAP_SALT');
  if (configured) return configured;
  return context.deploy.context === 'production' ? null : context.deploy.id;
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
  const secret = salt(context);

  if (req.method === 'GET') {
    const slug = new URL(req.url).searchParams.get('slug');
    if (!isSlug(slug)) return json({ error: 'invalid slug' }, 400);
    const visitor = secret ? visitorKey(context.ip, secret) : null;
    return json(await readClaps(clapStore(context), slug, visitor));
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

  return json(await addClaps(clapStore(context), slug, visitorKey(context.ip, secret), count));
};

export const config: Config = {
  path: '/api/claps',
  method: ['GET', 'POST'],
  // Netlify turns away anything past this before the function even starts,
  // which also keeps a flood of requests from spending the invocation quota.
  rateLimit: { windowLimit: 30, windowSize: 60, aggregateBy: ['ip', 'domain'] },
};
