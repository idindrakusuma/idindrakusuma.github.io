'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import useTheme from '@/hooks/useTheme';
import { NAV_ITEMS } from '@/lib/site-data';

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

/**
 * The fixed page chrome: floating island nav.
 */
export default function SiteChrome() {
  const linksRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  // The scroll spy is muted while a tap-driven scroll is in flight, so the pill
  // stays on the item the visitor picked instead of flickering through every
  // section the page passes on the way there.
  const spyLockedRef = useRef(false);
  const spySettleRef = useRef(0);
  const spyStalledRef = useRef(0);
  const unlockSpyRef = useRef<() => void>(() => {});
  const [activeId, setActiveId] = useState<string>(SECTION_IDS[0]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { toggle } = useTheme();

  // The pill follows the hovered link, and snaps back to the active section on leave.
  const highlightId = hoveredId ?? activeId;
  // Kept in a ref so the resize listener always re-measures the current pill.
  const highlightRef = useRef(highlightId);
  highlightRef.current = highlightId;

  const positionIndicator = useCallback((id: string, scrollIntoView = false, scrollBehavior?: ScrollBehavior) => {
    const links = linksRef.current;
    const indicator = indicatorRef.current;
    if (!links || !indicator) return;

    const link = links.querySelector<HTMLAnchorElement>(`[data-nav="${id}"]`) ?? links.querySelector('a');
    if (!link) return;

    indicator.style.width = `${link.offsetWidth}px`;
    indicator.style.transform = `translateX(${link.offsetLeft}px)`;
    indicator.style.opacity = '1';

    if (scrollIntoView && links.scrollWidth > links.clientWidth) {
      const maxScroll = links.scrollWidth - links.clientWidth;
      const target = link.offsetLeft - (links.clientWidth - link.offsetWidth) / 2;
      const left = Math.max(0, Math.min(target, maxScroll));
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : (scrollBehavior ?? 'smooth');
      links.scrollTo({ left, behavior });
    }
  }, []);

  useEffect(() => {
    positionIndicator(highlightId, hoveredId === null);
  }, [highlightId, hoveredId, positionIndicator]);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;

    const offset = window.matchMedia('(max-width: 860px)').matches ? 112 : 96;
    const top = window.scrollY + section.getBoundingClientRect().top - offset;
    const distance = Math.abs(top - window.scrollY);
    const longJump = distance > window.innerHeight * 1.35;
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches || longJump ? 'auto' : 'smooth';

    spyLockedRef.current = true;
    // Nothing to settle if the page never moves, so lift the lock on its own.
    window.clearTimeout(spyStalledRef.current);
    spyStalledRef.current = window.setTimeout(() => unlockSpyRef.current(), 400);
    setHoveredId(null);
    setActiveId(id);
    positionIndicator(id, true, 'auto');
    window.history.pushState(null, '', `#${id}`);
    window.scrollTo({ top: Math.max(0, top), behavior });
  };

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      if (spyLockedRef.current) return;
      const doc = document.documentElement;

      // A section counts as active once its top passes 35% down the viewport.
      const mid = doc.scrollTop + window.innerHeight * 0.35;
      let current = SECTION_IDS[0];
      for (const id of SECTION_IDS) {
        const section = document.getElementById(id);
        if (section && section.offsetTop <= mid) current = id;
      }
      setActiveId(current);
    };

    const unlockSpy = () => {
      if (!spyLockedRef.current) return;
      spyLockedRef.current = false;
      window.clearTimeout(spySettleRef.current);
      window.clearTimeout(spyStalledRef.current);
      read();
    };
    unlockSpyRef.current = unlockSpy;

    const onScroll = () => {
      if (spyLockedRef.current) {
        // Push the settle deadline out for as long as the page keeps moving, so
        // the lock outlasts a smooth scroll of any length and then lifts once it
        // comes to rest on the section that was asked for.
        window.clearTimeout(spyStalledRef.current);
        window.clearTimeout(spySettleRef.current);
        spySettleRef.current = window.setTimeout(unlockSpy, 150);
        return;
      }
      if (!frame) frame = requestAnimationFrame(read);
    };

    // Scrolling by hand outranks the tap that is still in flight.
    const onManualScroll = () => unlockSpy();

    // Fonts shift link widths, so re-measure once they have settled.
    const onResize = () => positionIndicator(highlightRef.current);

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('wheel', onManualScroll, { passive: true });
    window.addEventListener('touchstart', onManualScroll, { passive: true });
    window.addEventListener('keydown', onManualScroll);
    document.fonts?.ready.then(onResize).catch(() => {});

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(spySettleRef.current);
      window.clearTimeout(spyStalledRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('wheel', onManualScroll);
      window.removeEventListener('touchstart', onManualScroll);
      window.removeEventListener('keydown', onManualScroll);
    };
  }, [positionIndicator]);

  return (
    <>
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
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection(item.id);
                }}
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
            onClick={toggle}
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
