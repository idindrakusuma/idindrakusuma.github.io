'use client';

import { useEffect, useRef } from 'react';

/**
 * The vertical rule running through the experience timeline.
 *
 * Its position and length are measured from the badges rather than hard-coded,
 * so it stays centred on them and stops exactly at the last one no matter how
 * the cards reflow. A ResizeObserver re-measures on layout changes.
 */
export default function TimelineLine() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const line = ref.current;
    const parent = line?.parentElement;
    if (!line || !parent) return;

    const measure = () => {
      const badges = parent.querySelectorAll<HTMLElement>('[data-timeline-badge]');
      if (badges.length === 0) return;

      const bounds = parent.getBoundingClientRect();
      const first = badges[0].getBoundingClientRect();
      const last = badges[badges.length - 1].getBoundingClientRect();

      const centerX = first.left - bounds.left + first.width / 2;
      const top = first.top - bounds.top + first.height / 2;
      const bottom = last.top - bounds.top + last.height / 2;

      line.style.left = `${centerX - 1}px`;
      line.style.top = `${top}px`;
      line.style.bottom = 'auto';
      line.style.height = `${Math.max(0, bottom - top)}px`;
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(parent);
    for (const item of parent.querySelectorAll('[data-timeline-item]')) observer.observe(item);

    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="absolute top-2 bottom-2 left-6 w-0.5 opacity-55"
      style={{ background: 'linear-gradient(var(--primary),var(--border) 60%)' }}
    />
  );
}
