'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import useTheme from '@/hooks/useTheme';

/**
 * The blog's own nav island.
 *
 * Deliberately not SiteChrome: that one is a scroll spy over the homepage's
 * Sections, and none of those exist here. The design gives the blog a smaller
 * island instead — a way back, a label for where you are, and the theme toggle,
 * which is the one thing both sets of chrome share.
 */
export default function BlogChrome({
  back,
  trailing,
}: {
  back: { href: string; label: string };
  /**
   * After the divider: where you are, not somewhere to go. Both routes say
   * "Blog" — the article page used to point at the homepage here instead, which
   * made the same slot mean two different things depending on the page.
   */
  trailing: string;
}) {
  const { toggle } = useTheme();

  return (
    <nav className="fixed top-4 right-0 left-0 z-50 flex justify-center px-3">
      <div
        className="border-line flex max-w-[calc(100vw-24px)] items-center gap-2.5 rounded-full border py-2 pr-2 pl-4 backdrop-blur-[20px]"
        style={{ background: 'var(--nav)' }}
      >
        <Link
          href={back.href}
          className="text-muted hover:text-primary flex items-center gap-2 text-sm font-semibold whitespace-nowrap no-underline transition-colors"
        >
          <ArrowLeft />
          <span>{back.label}</span>
        </Link>

        <span aria-hidden="true" className="bg-line h-5 w-px flex-none" />

        <span className="font-display text-ink pr-1 text-sm font-semibold whitespace-nowrap">
          {trailing}
        </span>

        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle theme"
          className="border-line bg-surface text-ink hover:border-primary grid h-9 w-9 flex-none cursor-pointer place-items-center rounded-full border transition-[border-color,rotate] hover:rotate-[20deg]"
        >
          <Sun />
          <Moon />
        </button>
      </div>
    </nav>
  );
}

function ArrowLeft() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

/** Both icons ship; globals.css shows one per theme, as on the homepage. */
function Sun(): ReactNode {
  return (
    <svg
      className="ik-icon-sun"
      width="17"
      height="17"
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
  );
}

function Moon(): ReactNode {
  return (
    <svg
      className="ik-icon-moon"
      width="17"
      height="17"
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
  );
}
