'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ClapIcon from './ClapIcon';

type Entry = { slug: string; title: string };
type Ranked = { slug: string; total: number };

const SHOWN = 5;

/**
 * The index sidebar's Popular list: the most-clapped posts, topped up with the
 * newest ones while there are not yet five posts with claps.
 *
 * The static HTML carries the five newest, so the list is readable and the
 * right height before any script runs; the ranking from /api/claps/top then
 * reorders it in place. If that request fails, the newest five simply stay.
 */
export default function PopularPosts({ posts }: { posts: Entry[] }) {
  const [ranked, setRanked] = useState<Ranked[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/claps/top', { signal: controller.signal })
      .then((res) => (res.ok ? (res.json() as Promise<Ranked[]>) : []))
      .then(setRanked)
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const bySlug = new Map(posts.map((post) => [post.slug, post]));
  const clapped = ranked.flatMap(({ slug, total }) => {
    const post = bySlug.get(slug);
    return post ? [{ ...post, total }] : [];
  });
  const taken = new Set(clapped.map((post) => post.slug));
  const list = [
    ...clapped,
    ...posts.filter((post) => !taken.has(post.slug)).map((post) => ({ ...post, total: 0 })),
  ].slice(0, SHOWN);

  return (
    <nav
      aria-labelledby="popular-heading"
      className="bg-surface border-line shadow-card-sm rounded-[20px] border px-5 pt-[22px] pb-3"
    >
      <h2 id="popular-heading" className="font-mono text-primary m-0 mb-2 text-[12px] tracking-[.08em] uppercase">
        Popular posts
      </h2>
      <ol className="m-0 list-none p-0">
        {list.map((post, index) => (
          <li key={post.slug} className="border-line border-t first:border-t-0">
            <Link
              href={`/blog/${post.slug}`}
              className="ik-popular text-ink flex items-start gap-3 py-3 no-underline"
            >
              <span
                aria-hidden="true"
                className="font-display text-faint w-5 flex-none text-[20px] leading-[1.15] font-bold tabular-nums"
              >
                {index + 1}
              </span>
              {/* Two lines are always reserved for the title, and the count sits
                  beside it rather than under it, so every row is the same height
                  whether or not the ranking has arrived. */}
              <span className="ik-popular-title font-display line-clamp-2 min-h-[2.6em] min-w-0 flex-1 text-[14px] leading-[1.3] font-semibold transition-colors">
                {post.title}
              </span>
              {post.total > 0 && (
                <span className="text-muted font-mono flex flex-none items-center gap-1 pt-px text-[11.5px] leading-[1.6]">
                  <ClapIcon size={13} />
                  <span>
                    {post.total}
                    <span className="sr-only"> claps</span>
                  </span>
                </span>
              )}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
