'use client';

import { useEffect, useRef, useState } from 'react';
import type { Award } from '@/lib/site-data';
import AwardCard from './AwardCard';

/** Drift speed in CSS pixels per second. */
const SPEED = 28;

/**
 * The awards as an infinite horizontal strip.
 *
 * The card set is repeated and the track translates by exactly one set's width
 * before wrapping, so the seam is invisible. Two copies are only enough when a
 * set is at least as wide as the viewport — six 290px cards come to roughly
 * 1836px, which a wide display outruns — so the copy count is derived from the
 * measured set width, the same way MarqueeRow does it for the skills rows.
 *
 * Driven by requestAnimationFrame with a delta-time step, so the speed is
 * identical on 60Hz and 120Hz displays. Hovering pauses it so a card can be
 * read, and the strip can be dragged by hand in either direction.
 */
export default function AwardsMarquee({ awards }: { awards: Award[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const dragRef = useRef<{ startX: number; startOffset: number } | null>(null);
  const offsetRef = useRef(0);
  const [copies, setCopies] = useState(2);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // The global prefers-reduced-motion rule in globals.css only neutralises CSS
    // animations. This loop writes an inline transform, which that rule cannot
    // touch, so the check has to happen here. Dragging still works.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let wrapWidth = 0;
    let last = 0;
    let frame = 0;

    const measure = () => {
      // Distance from the first card to its counterpart in the next copy.
      // scrollWidth would be wrong: it counts one extra gap, which shifts the
      // seam by the gap width on every wrap.
      const nextCopyStart = el.children[awards.length] as HTMLElement | undefined;
      const next = nextCopyStart ? nextCopyStart.offsetLeft : el.scrollWidth / 2;
      if (next <= 0) return;

      // Hold the visual position across a re-measure instead of snapping back.
      const progress = wrapWidth > 0 ? offsetRef.current / wrapWidth : 0;
      wrapWidth = next;
      offsetRef.current = progress * wrapWidth;

      setCopies(Math.max(2, Math.ceil(window.innerWidth / wrapWidth) + 1));
    };

    const step = (now: number) => {
      // Clamped so a backgrounded tab does not lurch forward on return.
      const delta = last ? Math.min((now - last) / 1000, 0.06) : 0;
      last = now;

      if (wrapWidth > 0) {
        if (!pausedRef.current && !dragRef.current) offsetRef.current -= SPEED * delta;

        // Wrap both ways — the second branch is what keeps dragging backwards working.
        if (offsetRef.current <= -wrapWidth) offsetRef.current += wrapWidth;
        if (offsetRef.current > 0) offsetRef.current -= wrapWidth;

        el.style.transform = `translateX(${offsetRef.current}px)`;
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
  }, [awards.length]);

  return (
    <div
      // The mask paints only within this element's box, so a card's hover shadow is
      // cut off wherever it falls outside — `overflow` has nothing to do with it.
      // That shadow (0 26px 50px -18px) reaches ~33px below a card, so the bottom
      // padding has to clear it; the negative margin hands those 30px back to the
      // layout, which keeps this section's rhythm identical to every other one.
      className="ik-awrap relative -mx-6 -mb-[46px] px-6 pt-3.5 pb-14"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onPointerDown={(event) => {
        dragRef.current = { startX: event.clientX, startOffset: offsetRef.current };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        const drag = dragRef.current;
        if (drag) offsetRef.current = drag.startOffset + (event.clientX - drag.startX);
      }}
      onPointerUp={() => {
        dragRef.current = null;
      }}
      onPointerCancel={() => {
        dragRef.current = null;
      }}
    >
      <div ref={trackRef} className="flex w-max gap-4 will-change-transform">
        {Array.from({ length: copies }, (_, copy) =>
          awards.map((award) => (
            // Only the first set is exposed to assistive tech; the rest are visual filler.
            <AwardCard key={`${copy}-${award.title}`} award={award} hidden={copy > 0} />
          )),
        )}
      </div>
    </div>
  );
}
