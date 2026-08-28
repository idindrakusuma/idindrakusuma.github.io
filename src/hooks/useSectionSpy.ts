'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  activeSectionId,
  headerOffset,
  isLongJump,
  scrollTarget,
  type SectionTop,
} from '@/lib/section-spy';

/**
 * Tracks which Section the page is looking at, and scrolls to one on request.
 *
 * The spy is muted while a tap-driven scroll is in flight, so the nav stays on
 * the item the visitor picked instead of flickering through every Section the
 * page passes on the way there. Three things can lift that lock:
 *
 *   - the page coming to rest (150ms after the last scroll event)
 *   - the page never having moved at all (a 400ms stall deadline)
 *   - the visitor scrolling by hand, which outranks a tap still in flight
 *
 * `enabled` is false on routes that render no Sections at all: nothing to watch,
 * so no listeners are attached and nothing is reported as active.
 */

/** How long after the last scroll event the page counts as settled. */
const SETTLE_MS = 150;
/** How long to wait for a scroll that may never start. */
const STALL_MS = 400;

export default function useSectionSpy(
  ids: string[],
  enabled = true,
): { activeId: string | null; goTo: (id: string) => void } {
  const [activeId, setActiveId] = useState<string | null>(enabled ? ids[0] : null);

  const lockedRef = useRef(false);
  const settleRef = useRef(0);
  const stalledRef = useRef(0);
  const frameRef = useRef(0);

  const read = useCallback(() => {
    frameRef.current = 0;
    if (lockedRef.current) return;

    const measured: SectionTop[] = [];
    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) measured.push({ id, top: element.offsetTop });
    }

    setActiveId(
      activeSectionId(measured, document.documentElement.scrollTop, window.innerHeight, ids[0]),
    );
  }, [ids]);

  const unlock = useCallback(() => {
    if (!lockedRef.current) return;
    lockedRef.current = false;
    window.clearTimeout(settleRef.current);
    window.clearTimeout(stalledRef.current);
    read();
  }, [read]);

  const goTo = useCallback(
    (id: string) => {
      const section = document.getElementById(id);
      if (!section) return;

      const top = scrollTarget(
        section.getBoundingClientRect().top,
        window.scrollY,
        headerOffset(window.innerWidth),
      );
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const behavior: ScrollBehavior =
        reduced || isLongJump(Math.abs(top - window.scrollY), window.innerHeight) ? 'auto' : 'smooth';

      lockedRef.current = true;
      window.clearTimeout(stalledRef.current);
      stalledRef.current = window.setTimeout(unlock, STALL_MS);

      setActiveId(id);
      window.history.pushState(null, '', `#${id}`);
      window.scrollTo({ top, behavior });
    },
    [unlock],
  );

  useEffect(() => {
    if (!enabled) return;

    const onScroll = () => {
      if (lockedRef.current) {
        // Push the settle deadline out for as long as the page keeps moving, so
        // the lock outlasts a smooth scroll of any length and then lifts once it
        // comes to rest on the Section that was asked for.
        window.clearTimeout(stalledRef.current);
        window.clearTimeout(settleRef.current);
        settleRef.current = window.setTimeout(unlock, SETTLE_MS);
        return;
      }
      if (!frameRef.current) frameRef.current = requestAnimationFrame(read);
    };

    const onManualScroll = () => unlock();

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onManualScroll, { passive: true });
    window.addEventListener('touchstart', onManualScroll, { passive: true });
    window.addEventListener('keydown', onManualScroll);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      window.clearTimeout(settleRef.current);
      window.clearTimeout(stalledRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onManualScroll);
      window.removeEventListener('touchstart', onManualScroll);
      window.removeEventListener('keydown', onManualScroll);
    };
  }, [enabled, read, unlock]);

  return { activeId, goTo };
}
