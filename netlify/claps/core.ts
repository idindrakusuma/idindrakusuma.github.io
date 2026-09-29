import { createHash } from 'node:crypto';

/**
 * The clap counter's rules, kept apart from the Netlify function that serves
 * them so they can be exercised against an in-memory store.
 *
 * Three counts live in the store, each its own small JSON entry:
 *
 *   total/{slug}                 every clap the post has had
 *   visitor/{slug}/{visitor}     one visitor's claps on it, capped per visitor
 *   hour/{slug}/{YYYYMMDDHH}     every clap in the current hour, capped too
 *
 * The visitor cap is what a reader feels; the hourly cap bounds what anyone
 * with a pool of addresses can do to one post. The repository is public, so
 * none of this relies on the rules being secret — only CLAP_SALT is.
 */

/** Claps one visitor can give one post. */
export const MAX_PER_VISITOR = 10;

/** Claps one post can receive in an hour, from everyone together. */
export const MAX_PER_POST_PER_HOUR = 100;

/** Lowercase words joined by single hyphens — what every post slug looks like. */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const isSlug = (value: unknown): value is string =>
  typeof value === 'string' && value.length <= 120 && SLUG.test(value);

/** The subset of a Netlify Blobs store this module uses. */
export type ClapStore = {
  getWithMetadata(
    key: string,
    options: { type: 'json' },
  ): Promise<{ data: unknown; etag?: string } | null>;
  setJSON(
    key: string,
    data: unknown,
    options?: { onlyIfNew?: boolean } | { onlyIfMatch?: string },
  ): Promise<{ modified: boolean }>;
};

/**
 * Who is clapping, as an opaque key: a salted hash, so the store never holds
 * an address.
 *
 * An IPv6 address is reduced to its /64 first. One connection is usually
 * handed a whole /64 — more addresses than could ever be used — so counting
 * each one separately would give a single person an endless supply of fresh
 * visitor caps.
 */
export function visitorKey(ip: string, salt: string): string {
  const who = ip.includes(':') ? ipv6Prefix64(ip) : ip;
  return createHash('sha256').update(`${salt}\n${who}`).digest('hex').slice(0, 32);
}

function ipv6Prefix64(ip: string): string {
  const address = ip.split('%')[0].toLowerCase();
  const [head, tail] = address.split('::');
  const left = head ? head.split(':') : [];
  const right = tail ? tail.split(':') : [];
  const groups =
    tail === undefined ? left : [...left, ...Array(8 - left.length - right.length).fill('0'), ...right];
  return groups
    .slice(0, 4)
    .map((g) => g.replace(/^0+(?=.)/, ''))
    .join(':');
}

const readCount = (data: unknown): number => {
  const n = (data as { n?: unknown } | null)?.n;
  return typeof n === 'number' && Number.isFinite(n) && n > 0 ? n : 0;
};

/**
 * Adds up to `delta` to one count, never past `limit`, and says how much it
 * actually added.
 *
 * Blobs has no atomic increment, so this is compare-and-swap: write only if
 * the entry is still the one just read, and on losing a race read again and
 * retry. Two readers clapping in the same instant both land. The pause before
 * each retry is random and grows, so writers that collided once do not keep
 * colliding in lockstep.
 */
export async function increment(
  store: ClapStore,
  key: string,
  delta: number,
  limit = Number.POSITIVE_INFINITY,
): Promise<{ count: number; added: number }> {
  for (let attempt = 0; attempt < 10; attempt++) {
    if (attempt > 0) await new Promise((done) => setTimeout(done, Math.random() * 25 * attempt));
    const entry = await store.getWithMetadata(key, { type: 'json' });
    const current = readCount(entry?.data ?? null);
    const added = Math.min(delta, limit - current);
    if (added <= 0) return { count: current, added: 0 };

    const next = { n: current + added };
    const { modified } =
      entry?.etag
        ? await store.setJSON(key, next, { onlyIfMatch: entry.etag })
        : await store.setJSON(key, next, { onlyIfNew: true });
    if (modified) return { count: current + added, added };
  }
  throw new Error(`Could not update ${key} after repeated conflicts`);
}

const hourStamp = (now: Date) => now.toISOString().slice(0, 13).replace(/\D/g, '');

export async function readClaps(store: ClapStore, slug: string, visitor: string | null) {
  const [total, mine] = await Promise.all([
    store.getWithMetadata(`total/${slug}`, { type: 'json' }),
    visitor ? store.getWithMetadata(`visitor/${slug}/${visitor}`, { type: 'json' }) : null,
  ]);
  return { total: readCount(total?.data ?? null), mine: readCount(mine?.data ?? null) };
}

/**
 * Records `count` claps from one visitor, as many as the caps allow.
 *
 * The visitor's own allowance is spent first, then the post's hourly one. If
 * the hour has less room than the visitor, the difference is simply lost —
 * the visitor's record stays a little ahead of what counted, which only ever
 * makes the caps stricter, never looser.
 */
export async function addClaps(
  store: ClapStore,
  slug: string,
  visitor: string,
  count: number,
  now = new Date(),
) {
  const own = await increment(store, `visitor/${slug}/${visitor}`, count, MAX_PER_VISITOR);
  if (own.added === 0) {
    const { total } = await readClaps(store, slug, null);
    return { total, mine: own.count };
  }

  const hour = await increment(store, `hour/${slug}/${hourStamp(now)}`, own.added, MAX_PER_POST_PER_HOUR);
  const total =
    hour.added > 0
      ? (await increment(store, `total/${slug}`, hour.added)).count
      : (await readClaps(store, slug, null)).total;
  return { total, mine: own.count };
}
