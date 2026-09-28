'use client';

import { GoogleAnalytics } from '@next/third-parties/google';
import { useEffect, useState } from 'react';

/** Any of these means someone is actually there, reading or about to. */
const INTERACTIONS = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;

/** Loads anyway after this long, so a reader who never touches the page is still counted. */
const FALLBACK_MS = 10_000;

/**
 * Loads Google Analytics on the visitor's first interaction.
 *
 * The gtag bundle is 151 KB — by some way the largest thing the page fetches —
 * and `@next/third-parties` gives no way to change when it loads: GAParams has
 * no `strategy`, and the component hands it to `next/script` at its
 * `afterInteractive` default. Mounting it from here decides the timing without
 * hand-rolling the snippet.
 *
 * It used to wait for an idle callback, but on a page this light the browser is
 * idle almost at once, so gtag still parsed and ran inside the load window —
 * it was the 68 KB of "unused JavaScript" PageSpeed reported, and the heaviest
 * script on the main thread. Waiting for a first scroll, tap or key moves that
 * work past the point where anyone is waiting on the page.
 *
 * The trade: a visitor who leaves without interacting inside the first ten
 * seconds goes uncounted.
 */
export default function DeferredAnalytics({ gaId }: { gaId: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = () => setReady(true);
    const timer = window.setTimeout(load, FALLBACK_MS);
    for (const type of INTERACTIONS) {
      window.addEventListener(type, load, { once: true, passive: true });
    }
    return () => {
      window.clearTimeout(timer);
      for (const type of INTERACTIONS) window.removeEventListener(type, load);
    };
  }, []);

  return ready ? <GoogleAnalytics gaId={gaId} /> : null;
}
