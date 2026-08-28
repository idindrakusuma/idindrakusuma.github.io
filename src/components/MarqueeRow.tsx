'use client';

import Image from 'next/image';
import { useRef } from 'react';
import type { SkillLogo, SkillRow } from '@/lib/site-data';
import useMarquee from './useMarquee';

/** Scroll speed in CSS pixels per second. */
const SPEED = 13.2;

function LogoItem({ slug, name, desc, wordmark, hidden }: SkillLogo & { hidden?: boolean }) {
  return (
    <span className="ik-logo relative flex flex-none items-center" aria-hidden={hidden || undefined}>
      {wordmark ? (
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
 * The looping itself is `useMarquee`'s job. Hovering a row pauses it so the
 * tooltip is readable — the pause sits on the track rather than a wrapper, so it
 * only fires over the logos themselves.
 */
export default function MarqueeRow({ row }: { row: SkillRow }) {
  const ref = useRef<HTMLDivElement>(null);
  const { copies, pauseHandlers } = useMarquee({
    trackRef: ref,
    itemCount: row.items.length,
    speed: SPEED,
    direction: row.dir,
  });

  return (
    <div
      ref={ref}
      className="flex w-max items-center gap-[76px] will-change-transform"
      {...pauseHandlers}
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
