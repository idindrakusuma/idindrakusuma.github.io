'use client';

import { useEffect, useMemo, useRef, useState, type PointerEvent, type RefObject } from 'react';
import {
  advance,
  copiesFor,
  rescale,
  wrap,
  MAX_DELTA,
  MIN_COPIES,
  type MarqueeDirection,
} from '@/lib/marquee';

/**
 * Drives an infinite horizontal marquee: measures the track, decides how many
 * copies of the item set to render, and steps the translation every frame.
 *
 * Rendering stays with the caller. The two marquees on this page differ in ways
 * that are theirs to keep — where the hover-pause belongs, the gap between
 * items, whether an outer wrapper owns the fade mask — so this hook hands back
 * the copy count and the handlers, and never touches the markup.
 *
 * Driven by requestAnimationFrame with a delta-time step, which keeps the speed
 * identical on 60 Hz and 120 Hz displays.
 */

type MarqueeOptions = {
  /** The element that gets translated. Its children are the repeated sets. */
  trackRef: RefObject<HTMLElement | null>;
  /** Items in one set — the seam is found at `children[itemCount]`. */
  itemCount: number;
  /** Drift speed in CSS pixels per second. */
  speed: number;
  direction?: MarqueeDirection;
  /** Lets the visitor drag the track by hand, in either direction. */
  draggable?: boolean;
};

type Marquee = {
  /** Render this many copies of the item set inside the track. */
  copies: number;
  /** Spread onto whichever element should pause the drift while hovered. */
  pauseHandlers: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
  /** Spread onto the drag surface. Empty unless `draggable`. */
  dragHandlers: {
    onPointerDown?: (event: PointerEvent<HTMLElement>) => void;
    onPointerMove?: (event: PointerEvent<HTMLElement>) => void;
    onPointerUp?: () => void;
    onPointerCancel?: () => void;
  };
};

export default function useMarquee({
  trackRef,
  itemCount,
  speed,
  direction = -1,
  draggable = false,
}: MarqueeOptions): Marquee {
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);
  const dragRef = useRef<{ startX: number; startOffset: number } | null>(null);
  const [copies, setCopies] = useState(MIN_COPIES);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // The global prefers-reduced-motion rule in globals.css only neutralises CSS
    // animations. This loop writes an inline transform, which that rule cannot
    // touch, so the check has to happen here. A draggable track still runs the
    // loop — it just never drifts on its own — because dragging is what writes
    // the transform, and reduced motion is about unrequested movement.
    const autoAdvance = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!autoAdvance && !draggable) return;

    let wrapWidth = 0;
    let last = 0;
    let frame = 0;

    const measure = () => {
      // Distance from the first item to its counterpart in the next copy.
      // scrollWidth would be wrong: it counts one extra gap, which shifts the
      // seam by the gap width on every wrap.
      const nextCopyStart = el.children[itemCount] as HTMLElement | undefined;
      const next = nextCopyStart ? nextCopyStart.offsetLeft : el.scrollWidth / 2;
      if (next <= 0) return;

      offsetRef.current = rescale(offsetRef.current, wrapWidth, next, direction);
      wrapWidth = next;
      setCopies(copiesFor(window.innerWidth, wrapWidth));
    };

    const step = (now: number) => {
      const delta = last ? Math.min((now - last) / 1000, MAX_DELTA) : 0;
      last = now;

      if (wrapWidth > 0) {
        const drifting = autoAdvance && !pausedRef.current && !dragRef.current;
        offsetRef.current = drifting
          ? advance(offsetRef.current, { wrapWidth, direction, speed, delta })
          : wrap(offsetRef.current, wrapWidth);
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
  }, [trackRef, itemCount, speed, direction, draggable]);

  const pauseHandlers = useMemo(
    () => ({
      onMouseEnter: () => {
        pausedRef.current = true;
      },
      onMouseLeave: () => {
        pausedRef.current = false;
      },
    }),
    [],
  );

  const dragHandlers = useMemo(
    () =>
      draggable
        ? {
            onPointerDown: (event: PointerEvent<HTMLElement>) => {
              dragRef.current = { startX: event.clientX, startOffset: offsetRef.current };
              event.currentTarget.setPointerCapture(event.pointerId);
            },
            onPointerMove: (event: PointerEvent<HTMLElement>) => {
              const drag = dragRef.current;
              if (drag) offsetRef.current = drag.startOffset + (event.clientX - drag.startX);
            },
            onPointerUp: () => {
              dragRef.current = null;
            },
            onPointerCancel: () => {
              dragRef.current = null;
            },
          }
        : {},
    [draggable],
  );

  return { copies, pauseHandlers, dragHandlers };
}
