// Run with `pnpm test`. The store below mimics the parts of Netlify Blobs that
// core.ts relies on: JSON entries with ETags and conditional writes.
import test from 'node:test';
import assert from 'node:assert/strict';
import { addClaps, readClaps, visitorKey, increment, isSlug, MAX_PER_VISITOR, MAX_PER_POST_PER_HOUR } from './core.ts';

function memoryStore({ conflictOnce = false } = {}) {
  const data = new Map(); let v = 0; let conflicts = conflictOnce ? 1 : 0;
  return {
    data,
    async getWithMetadata(key) { const e = data.get(key); return e ? { data: structuredClone(e.value), etag: e.etag } : null; },
    async setJSON(key, value, opts = {}) {
      const e = data.get(key);
      if (conflicts > 0) { conflicts--; data.set(key, { value: { n: (e?.value.n ?? 0) + 1 }, etag: String(++v) }); return { modified: false }; }
      if (opts.onlyIfNew && e) return { modified: false };
      if (opts.onlyIfMatch && (!e || e.etag !== opts.onlyIfMatch)) return { modified: false };
      data.set(key, { value, etag: String(++v) }); return { modified: true };
    },
  };
}

test('slugs', () => {
  assert.ok(isSlug('software-engineer-2018-vs-era-ai'));
  for (const bad of ['', '../x', 'A', 'a--b', '-a', 'a/b', 'a'.repeat(121), 42, null]) assert.ok(!isSlug(bad), String(bad));
});

test('visitor cap: 10 per visitor, spread over requests', async () => {
  const s = memoryStore();
  assert.deepEqual(await addClaps(s, 'p', 'v1', 4), { total: 4, mine: 4 });
  assert.deepEqual(await addClaps(s, 'p', 'v1', 10), { total: 10, mine: 10 });
  assert.deepEqual(await addClaps(s, 'p', 'v1', 3), { total: 10, mine: 10 });
  assert.deepEqual(await addClaps(s, 'p', 'v2', 2), { total: 12, mine: 2 });
  assert.deepEqual(await readClaps(s, 'p', 'v1'), { total: 12, mine: 10 });
  assert.deepEqual(await readClaps(s, 'other', null), { total: 0, mine: 0 });
});

test('hourly cap across many visitors', async () => {
  const s = memoryStore(); const now = new Date('2026-09-29T10:15:00Z');
  let last;
  for (let i = 0; i < 15; i++) last = await addClaps(s, 'p', 'v' + i, MAX_PER_VISITOR, now);
  assert.equal(last.total, MAX_PER_POST_PER_HOUR);
  const nextHour = await addClaps(s, 'p', 'fresh', 5, new Date('2026-09-29T11:01:00Z'));
  assert.equal(nextHour.total, MAX_PER_POST_PER_HOUR + 5);
});

test('compare-and-swap retries after a lost race', async () => {
  const s = memoryStore({ conflictOnce: true });
  const r = await increment(s, 'k', 3);
  assert.deepEqual(r, { count: 4, added: 3 }); // racing writer's +1 kept, ours added on top
});

test('concurrent claps are not lost', async () => {
  const s = memoryStore();
  await Promise.all(Array.from({ length: 30 }, (_, i) => addClaps(s, 'p', 'v' + i, 1)));
  assert.equal((await readClaps(s, 'p', null)).total, 30);
});

test('visitor keys: salted, IPv6 grouped by /64', () => {
  const a = visitorKey('2001:db8:1:2:aaaa::1', 's'), b = visitorKey('2001:0db8:0001:0002:ffff:1:2:3', 's');
  assert.equal(a, b);
  assert.notEqual(a, visitorKey('2001:db8:1:3::1', 's'));
  assert.notEqual(visitorKey('1.2.3.4', 's'), visitorKey('1.2.3.4', 't'));
  assert.equal(visitorKey('1.2.3.4', 's').length, 32);
  assert.ok(!visitorKey('1.2.3.4', 's').includes('1.2.3.4'));
});
