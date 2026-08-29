'use client';

import { useCallback, useEffect, type MouseEvent } from 'react';
import { THEME_STORAGE_KEY, type Theme } from '@/lib/theme';

/**
 * The runtime half of the theme: flipping it, and following the OS until the
 * visitor has flipped it themselves.
 *
 * The initial theme is not decided here. THEME_SCRIPT has already applied it
 * before this ever runs, so the current value is read back off <html> rather
 * than derived a second time — one decision, one place.
 */

/** Storage is unavailable in some privacy modes; the theme still applies without it. */
function readStored(): string | null {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStored(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* A choice that cannot be remembered still applies for this visit. */
  }
}

function currentTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Where the reveal in globals.css starts from, and how far it has to grow —
 * both as ratios of the viewport rather than lengths.
 *
 * Pixels are wrong here, and wrong in a way that only shows up on a HiDPI
 * screen: the box that `clip-path` resolves against on ::view-transition-new is
 * not laid out in CSS pixels, so on a 2x display `748px` lands at 374 and the
 * radius comes out half of what was asked for. The circle then grows from the
 * middle of the nav instead of the button, stalls halfway across the screen,
 * and snaps to the new theme when the transition ends. A ratio survives
 * whatever unit space the box is in.
 *
 * The radius still has to reach the furthest corner: anything shorter leaves a
 * wedge of the old theme alive until the transition ends, which is the same
 * snap by another route. A percentage radius on `circle()` is resolved against
 * sqrt(w² + h²) / sqrt(2), so the distance is converted into that scale.
 */
function markOrigin(x: number, y: number): void {
  const { style } = document.documentElement;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const radius = Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
  style.setProperty('--vt-x', `${(x / w) * 100}%`);
  style.setProperty('--vt-y', `${(y / h) * 100}%`);
  style.setProperty('--vt-r', `${(radius / (Math.hypot(w, h) / Math.SQRT2)) * 100}%`);
}

export default function useTheme(): { toggle: (event?: MouseEvent<HTMLElement>) => void } {
  const toggle = useCallback((event?: MouseEvent<HTMLElement>) => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    writeStored(next);

    // lib.dom types startViewTransition as always present, so this has to be a
    // typeof check rather than the truthiness one it reads as.
    const canAnimate =
      typeof document.startViewTransition === 'function' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // No event means no button, and therefore no honest point to grow from.
    if (!canAnimate || !event) {
      applyTheme(next);
      return;
    }

    // currentTarget is the <button>, never the <svg> inside it, and its centre
    // is right even when the button was reached by keyboard — where a pointer
    // position would be 0,0.
    const rect = event.currentTarget.getBoundingClientRect();
    markOrigin(rect.left + rect.width / 2, rect.top + rect.height / 2);

    // Nothing guards against a second toggle mid-flight, because nothing can:
    // the whole document stops being hit-testable for the length of a view
    // transition — elementFromPoint over this very button returns <html> — so a
    // click inside the window never reaches the page at all. Measured on Chrome
    // 151, clicks land again just after the reveal ends, which means --dur-theme
    // is also how long the page ignores its visitor. At 1s that is a knowingly
    // paid price: the sweep is the feature, and it only reads as one when it is
    // slow enough to watch.
    document.startViewTransition(() => applyTheme(next));
  }, []);

  useEffect(() => {
    // A stored choice outranks the OS, so there is nothing to follow.
    if (readStored()) return;

    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => {
      // Re-checked on every change: the visitor may have toggled since.
      if (readStored()) return;
      // Deliberately unanimated: nothing was clicked, and this can fire while
      // the tab is in the background — a reveal nobody is looking at.
      applyTheme(event.matches ? 'dark' : 'light');
    };

    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return { toggle };
}
