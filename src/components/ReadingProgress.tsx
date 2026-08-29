'use client';

import { useEffect, useRef } from 'react';

/**
 * The gradient bar across the top of an article, tracking how far down the
 * document the reader is.
 *
 * Writes the width straight to the element rather than through state — this
 * fires on every scroll frame, and a re-render per frame would be the most
 * expensive thing on the page.
 */
export default function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      bar.style.width = `${scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0}%`;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed top-0 left-0 z-60 h-[3px] w-0 transition-[width] duration-100 ease-linear"
      style={{ background: 'linear-gradient(90deg,var(--a1),var(--a2),var(--a3))' }}
    />
  );
}
