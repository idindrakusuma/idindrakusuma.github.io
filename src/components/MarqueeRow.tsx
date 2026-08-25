'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { SKILL_LOGOS_WITHOUT_ICON, type SkillRow } from '@/lib/site-data';

/** Scroll speed in CSS pixels per second. */
const SPEED = 13.2;

function LogoItem({ slug, name, desc, hidden }: { slug: string; name: string; desc: string; hidden?: boolean }) {
  return (
    <span className="ik-logo relative flex flex-none items-center" aria-hidden={hidden || undefined}>
      {SKILL_LOGOS_WITHOUT_ICON.has(slug) ? (
        // No mark exists for this one in simple-icons, so it reads as a wordmark.
        <span className="font-display text-ink text-[22px] font-bold tracking-[-.01em] whitespace-nowrap opacity-60">
          {name}
        </span>
      ) : (
        <Image
          src={`/logos/skills/${slug}.svg`}
          alt={hidden ? '' : name}
          width={46}
          height={46}
          className="block h-[46px] w-auto"
        />
      )}

      <span
        className="ik-tip shadow-card-sm pointer-events-none absolute bottom-[calc(100%+14px)] left-1/2 z-6 -translate-x-1/2 translate-y-[5px] rounded-[9px] px-[11px] py-[7px] text-center whitespace-nowrap opacity-0 transition-[opacity,translate] duration-200"
        style={{ background: 'var(--text)', color: 'var(--bg)' }}
      >
        <span className="font-display block text-[12.5px] font-bold">{name}</span>
        <span className="block text-[10.5px] font-medium opacity-70">{desc}</span>
      </span>
    </span>
  );
}

/**
 * One infinite horizontal row of tech logos.
 *
 * The item set is repeated and the row translates by exactly one set's width
 * before wrapping, so the seam is invisible. Two copies are only enough when a
 * set is at least as wide as the viewport — otherwise the row runs out of
 * content mid-travel and leaves a visible gap — so the number of copies is
 * derived from the measured set width.
 *
 * Driven by requestAnimationFrame with a delta-time step, which keeps the speed
 * identical on 60 Hz and 120 Hz displays. Hovering a row pauses it so the
 * tooltip is readable, and reduced-motion users get a static row.
 */
export default function MarqueeRow({ row }: { row: SkillRow }) {
  const ref = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const [copies, setCopies] = useState(2);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let wrapWidth = 0;
    let offset = 0;
    let last = 0;
    let frame = 0;

    const measure = () => {
      const secondCopyStart = el.children[row.items.length] as HTMLElement | undefined;
      const next = secondCopyStart ? secondCopyStart.offsetLeft : el.scrollWidth / 2;
      if (next <= 0) return;

      // Keep the visual position when the row is re-measured (e.g. logos finish
      // loading) instead of snapping back to the start.
      const progress = wrapWidth > 0 ? offset / wrapWidth : row.dir > 0 ? -1 : 0;
      wrapWidth = next;
      offset = progress * wrapWidth;

      // The row travels one full set, so the copies after the first must cover
      // the viewport for the tail never to show.
      setCopies(Math.max(2, Math.ceil(window.innerWidth / wrapWidth) + 1));
    };

    const step = (now: number) => {
      const delta = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;

      if (wrapWidth > 0 && !pausedRef.current) {
        offset += row.dir * SPEED * delta;
        if (row.dir < 0 && offset <= -wrapWidth) offset += wrapWidth;
        if (row.dir > 0 && offset >= 0) offset -= wrapWidth;
        el.style.transform = `translateX(${offset}px)`;
      }

      frame = requestAnimationFrame(step);
    };

    measure();
    frame = requestAnimationFrame(step);

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener('resize', measure, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [row.dir, row.items.length]);

  return (
    <div
      ref={ref}
      className="flex w-max items-center gap-[76px] will-change-transform"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      {Array.from({ length: copies }, (_, copy) =>
        row.items.map((item) => (
          // Only the first set is exposed to assistive tech; the rest are visual filler.
          <LogoItem key={`${copy}-${item.slug}`} {...item} hidden={copy > 0} />
        )),
      )}
    </div>
  );
}
