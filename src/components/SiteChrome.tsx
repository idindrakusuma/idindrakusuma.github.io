'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { NAV_ITEMS } from '@/lib/site-data';

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

/**
 * The fixed page chrome: scroll-progress bar + floating island nav.
 *
 * Both react to the same scroll position, so they share one passive listener
 * throttled to a frame.
 */
export default function SiteChrome() {
  const progressRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const [activeId, setActiveId] = useState<string>(SECTION_IDS[0]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // The pill follows the hovered link, and snaps back to the active section on leave.
  const highlightId = hoveredId ?? activeId;
  // Kept in a ref so the resize listener always re-measures the current pill.
  const highlightRef = useRef(highlightId);
  highlightRef.current = highlightId;

  const positionIndicator = useCallback((id: string) => {
    const links = linksRef.current;
    const indicator = indicatorRef.current;
    if (!links || !indicator) return;

    const link = links.querySelector<HTMLAnchorElement>(`[data-nav="${id}"]`) ?? links.querySelector('a');
    if (!link) return;

    indicator.style.width = `${link.offsetWidth}px`;
    indicator.style.transform = `translateX(${link.offsetLeft}px)`;
    indicator.style.opacity = '1';
  }, []);

  useEffect(() => {
    positionIndicator(highlightId);
  }, [highlightId, positionIndicator]);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      const doc = document.documentElement;

      const scrollable = doc.scrollHeight - doc.clientHeight;
      const progress = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
      if (progressRef.current) progressRef.current.style.width = `${progress}%`;

      // A section counts as active once its top passes 35% down the viewport.
      const mid = doc.scrollTop + window.innerHeight * 0.35;
      let current = SECTION_IDS[0];
      for (const id of SECTION_IDS) {
        const section = document.getElementById(id);
        if (section && section.offsetTop <= mid) current = id;
      }
      setActiveId(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    // Fonts shift link widths, so re-measure once they have settled.
    const onResize = () => positionIndicator(highlightRef.current);

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    document.fonts?.ready.then(onResize).catch(() => {});

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [positionIndicator]);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('ik-theme', next);
    } catch {
      /* Storage can be unavailable (private mode); the theme still applies. */
    }
  };

  // Follow the OS preference for as long as the visitor has not picked a theme.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem('ik-theme');
    } catch {
      return;
    }
    if (stored) return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem('ik-theme')) return;
      } catch {
        return;
      }
      document.documentElement.setAttribute('data-theme', event.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <>
      <div
        ref={progressRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-60 h-[3px] w-0 transition-[width] duration-100 ease-linear"
        style={{ background: 'linear-gradient(90deg,var(--a1),var(--a2),var(--a3))' }}
      />

      <nav className="fixed top-4 right-0 left-0 z-50 flex justify-center px-4">
        <div
          className="ik-island-cap border-line relative flex items-center gap-2.5 rounded-full border py-2 pr-2 pl-2.5 backdrop-blur-[20px]"
          style={{ background: 'var(--nav)' }}
        >
          <div
            ref={linksRef}
            className="ik-island-links relative flex gap-0.5"
            onMouseLeave={() => setHoveredId(null)}
          >
            <span
              ref={indicatorRef}
              aria-hidden="true"
              className="absolute top-0 bottom-0 left-0 z-0 w-0 rounded-full opacity-0 transition-[transform,width] duration-[380ms] ease-smooth"
              style={{
                background: 'linear-gradient(135deg,var(--a1),var(--primary) 55%,var(--a3))',
                boxShadow: '0 8px 20px -8px var(--glow)',
              }}
            />
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                data-nav={item.id}
                aria-current={activeId === item.id ? 'true' : undefined}
                onMouseEnter={() => setHoveredId(item.id)}
                className="relative z-1 rounded-full px-[15px] py-[9px] text-sm font-semibold no-underline transition-colors"
                style={{ color: highlightId === item.id ? '#fff' : 'var(--muted)' }}
              >
                {item.label}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="border-line bg-surface text-ink hover:border-primary grid h-9 w-9 flex-none cursor-pointer place-items-center rounded-full border transition-[border-color,rotate] hover:rotate-[20deg]"
          >
            <svg
              className="ik-icon-sun"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
            <svg
              className="ik-icon-moon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
          </button>
        </div>
      </nav>
    </>
  );
}
