'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import useNavIndicator from '@/hooks/useNavIndicator';
import useSectionSpy from '@/hooks/useSectionSpy';
import useTheme from '@/hooks/useTheme';
import { NAV_ITEMS, SECTIONS } from '@/lib/site-data';

const SECTION_IDS = SECTIONS.map((section) => section.id);

/**
 * The fixed page chrome: the floating island nav and the theme toggle.
 *
 * The Sections it spies on only exist on the homepage, so everywhere else the
 * spy is switched off and the links become ordinary `/#id` navigation.
 *
 * The nav also carries entries that are routes rather than Sections. Those the
 * spy never claims — the pill sits on them only while the pointer is there — and
 * they go through next/link, so the move is a client navigation rather than a
 * fresh page boot. A Section link stays a plain anchor on purpose: its href is a
 * hash into the page you are already on, which is not a route at all.
 */
export default function SiteChrome() {
  const pathname = usePathname();
  // Tolerant of the trailing slash the static export adds.
  const onHomepage = pathname.replace(/\/+$/, '') === '';

  const linksRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { toggle } = useTheme();
  const { activeId, goTo } = useSectionSpy(SECTION_IDS, onHomepage);

  // The pill follows the hovered link, and snaps back to the active Section on leave.
  const highlightId = hoveredId ?? activeId;
  const positionIndicator = useNavIndicator({
    linksRef,
    indicatorRef,
    highlightId,
    center: hoveredId === null,
  });

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
            {NAV_ITEMS.map((item) => {
              // The pill styling is the same whichever element carries the link, so it
              // is written once — the two branches differ only in how they navigate.
              const appearance = {
                onMouseEnter: () => setHoveredId(item.id),
                className:
                  'relative z-1 rounded-full px-[15px] py-[9px] text-sm font-semibold no-underline transition-colors',
                style: { color: highlightId === item.id ? '#fff' : 'var(--muted)' },
              };

              if (item.kind === 'route') {
                return (
                  <Link key={item.id} href={item.href} data-nav={item.id} {...appearance}>
                    {item.label}
                  </Link>
                );
              }

              return (
                <a
                  key={item.id}
                  href={onHomepage ? `#${item.id}` : `/#${item.id}`}
                  data-nav={item.id}
                  aria-current={activeId === item.id ? 'true' : undefined}
                  onClick={
                    onHomepage
                      ? (event) => {
                          event.preventDefault();
                          setHoveredId(null);
                          positionIndicator(item.id, true, 'auto');
                          goTo(item.id);
                        }
                      : undefined
                  }
                  {...appearance}
                >
                  {item.label}
                </a>
              );
            })}
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
