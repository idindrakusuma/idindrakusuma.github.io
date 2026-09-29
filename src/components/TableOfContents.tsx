'use client';

import { useEffect, useState } from 'react';
import type { TocItem } from '@/lib/toc';

/** How far below the top of the viewport a heading counts as "being read" — clear of the nav island. */
const READING_LINE = 120;

/**
 * A post's table of contents, pinned beside the article on wide screens.
 *
 * The links are plain `#id` anchors: the browser does the smooth scroll (the
 * page already scrolls smoothly), puts the section in the URL so it can be
 * shared, and lands it below the nav thanks to the root's scroll-padding-top
 * (globals.css), which already does the same for the homepage's sections.
 * The only script is the highlight on the section being read — the last
 * heading to have passed the reading line.
 */
export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | null = null;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= READING_LINE) current = heading.id;
        else break;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav
      aria-labelledby="toc-heading"
      className="ik-toc bg-surface border-line shadow-card-sm rounded-[20px] border px-5 py-[22px]"
    >
      <h2 id="toc-heading" className="font-mono text-primary m-0 mb-3 text-[12px] tracking-[.08em] uppercase">
        On this page
      </h2>
      <ol className="m-0 flex list-none flex-col gap-0.5 p-0">
        {items.map((item) => (
          <li key={item.id} className={item.depth === 3 ? 'pl-3.5' : undefined}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? 'location' : undefined}
              className={`ik-toc-link block rounded-[9px] border-l-2 py-1.5 pr-2 pl-3 leading-[1.4] no-underline transition-colors ${
                item.depth === 3 ? 'text-[12.5px]' : 'text-[13.5px]'
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
