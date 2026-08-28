'use client';

import { useCallback, useEffect, useRef, type RefObject } from 'react';

/**
 * The sliding pill behind the nav links.
 *
 * Pure measurement, kept apart from the spy: the spy decides *which* link is
 * highlighted, this decides *where* that link is. It re-measures on resize and
 * once webfonts have settled, because both change the link widths it read.
 *
 * On a narrow viewport the link row scrolls sideways, so the highlighted link is
 * also brought into view.
 */
export default function useNavIndicator({
  linksRef,
  indicatorRef,
  highlightId,
  center,
}: {
  linksRef: RefObject<HTMLElement | null>;
  indicatorRef: RefObject<HTMLElement | null>;
  /** The link to sit behind, or null to hide the pill. */
  highlightId: string | null;
  /** Whether a change should also scroll the link row to show the link. */
  center: boolean;
}): (id: string | null, center?: boolean, behavior?: ScrollBehavior) => void {
  const position = useCallback(
    (id: string | null, centerOnChange = false, behavior?: ScrollBehavior) => {
      const links = linksRef.current;
      const indicator = indicatorRef.current;
      if (!links || !indicator) return;

      if (id === null) {
        indicator.style.opacity = '0';
        return;
      }

      const link =
        links.querySelector<HTMLElement>(`[data-nav="${id}"]`) ?? links.querySelector('a');
      if (!link) return;

      indicator.style.width = `${link.offsetWidth}px`;
      indicator.style.transform = `translateX(${link.offsetLeft}px)`;
      indicator.style.opacity = '1';

      if (centerOnChange && links.scrollWidth > links.clientWidth) {
        const maxScroll = links.scrollWidth - links.clientWidth;
        const target = link.offsetLeft - (links.clientWidth - link.offsetWidth) / 2;
        const left = Math.max(0, Math.min(target, maxScroll));
        const scrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : (behavior ?? 'smooth');
        links.scrollTo({ left, behavior: scrollBehavior });
      }
    },
    [linksRef, indicatorRef],
  );

  useEffect(() => {
    position(highlightId, center);
  }, [highlightId, center, position]);

  // Kept in a ref so the resize listener always re-measures the current link
  // without having to be torn down and reattached on every highlight change.
  // Written in an effect rather than during render: React treats a ref touched
  // mid-render as a bug, and the listener only ever reads it later anyway.
  const highlightRef = useRef(highlightId);
  useEffect(() => {
    highlightRef.current = highlightId;
  }, [highlightId]);

  useEffect(() => {
    const onResize = () => position(highlightRef.current);
    window.addEventListener('resize', onResize, { passive: true });
    document.fonts?.ready.then(onResize).catch(() => {});
    return () => window.removeEventListener('resize', onResize);
  }, [position]);

  return position;
}
