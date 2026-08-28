'use client';

import { useCallback, useEffect } from 'react';
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

export default function useTheme(): { toggle: () => void } {
  const toggle = useCallback(() => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    writeStored(next);
  }, []);

  useEffect(() => {
    // A stored choice outranks the OS, so there is nothing to follow.
    if (readStored()) return;

    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => {
      // Re-checked on every change: the visitor may have toggled since.
      if (readStored()) return;
      applyTheme(event.matches ? 'dark' : 'light');
    };

    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return { toggle };
}
