'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { TocItem } from '@/lib/toc';

/** How far below the top of the viewport a heading counts as "being read" — clear of the nav island. */
const READING_LINE = 120;

/**
 * The id of the section being read: the last heading to have passed the
 * reading line, or null above the first one.
 */
function useReadingSection(items: TocItem[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | null = null;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= READING_LINE) current = heading.id;
        else break;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [items]);

  return active;
}

/**
 * The list itself, shared by both presentations. The links are plain `#id`
 * anchors: the browser does the smooth scroll (the page already scrolls
 * smoothly), puts the section in the URL so it can be shared, and lands it
 * below the nav thanks to the root's scroll-padding-top (globals.css), which
 * already does the same for the homepage's sections.
 */
function TocList({
  items,
  active,
  onPick,
}: {
  items: TocItem[];
  active: string | null;
  onPick?: () => void;
}) {
  return (
    <ol className="m-0 flex list-none flex-col gap-0.5 p-0">
      {items.map((item) => (
        <li key={item.id} className={item.depth === 3 ? 'pl-3.5' : undefined}>
          <a
            href={`#${item.id}`}
            onClick={onPick}
            aria-current={active === item.id ? 'location' : undefined}
            className={`ik-toc-link block rounded-[9px] border-l-2 py-1.5 pr-2 pl-3 leading-[1.4] no-underline transition-colors ${
              item.depth === 3 ? 'text-[12.5px]' : 'text-[13.5px]'
            }`}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

/** A post's table of contents, pinned beside the article on wide screens. */
export default function TableOfContents({ items }: { items: TocItem[] }) {
  const active = useReadingSection(items);
  return (
    <nav
      aria-labelledby="toc-heading"
      className="ik-toc bg-surface border-line shadow-card-sm rounded-[20px] border px-5 py-[22px]"
    >
      <h2 id="toc-heading" className="font-mono text-primary m-0 mb-3 text-[12px] tracking-[.08em] uppercase">
        On this page
      </h2>
      <TocList items={items} active={active} />
    </nav>
  );
}

/**
 * The same table of contents below the sidebar breakpoint, where there is no
 * room beside the article: a small round button in the bottom-right corner
 * that opens the list above itself.
 *
 * Picking a section, tapping anywhere else, or Escape closes it. Opening moves
 * focus to the panel itself and closing returns it to the button, so it works
 * from a keyboard as well as a thumb. It is the panel that takes focus, not its
 * first link: iOS Safari draws a focus ring on any element focused from script,
 * which made the first section look selected whatever was being read. The panel
 * draws no ring, and Tab from it lands on the first link. Hidden by CSS from the breakpoint up, where the
 * sidebar takes over.
 */
export function FloatingTableOfContents({ items }: { items: TocItem[] }) {
  const active = useReadingSection(items);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) button.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    panel.current?.focus({ preventScroll: true });
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) close(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close(true);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  return (
    <div ref={root} className="ik-toc-fab fixed z-40">
      {open && (
        <nav
          ref={panel}
          tabIndex={-1}
          id="toc-panel"
          aria-labelledby="toc-panel-heading"
          className="ik-toc-panel bg-surface border-line shadow-card absolute right-0 bottom-[calc(100%+12px)] rounded-[20px] border px-4 py-[18px]"
        >
          <h2
            id="toc-panel-heading"
            className="font-mono text-primary m-0 mb-2.5 px-1 text-[12px] tracking-[.08em] uppercase"
          >
            On this page
          </h2>
          {/* Closed a tick later, so the link's own navigation runs before the
              panel — and the link in it — leave the page. */}
          <TocList
            items={items}
            active={active}
            onPick={() => window.setTimeout(() => close(false), 0)}
          />
        </nav>
      )}
      <button
        ref={button}
        type="button"
        onClick={() => (open ? close(true) : setOpen(true))}
        aria-expanded={open}
        aria-controls="toc-panel"
        aria-label={open ? 'Close table of contents' : 'Open table of contents'}
        className="bg-surface border-line shadow-card text-ink hover:border-primary grid h-12 w-12 place-items-center rounded-full border transition-[border-color,color]"
      >
        {open ? <CloseIcon /> : <ListIcon />}
      </button>
    </div>
  );
}

function ListIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
