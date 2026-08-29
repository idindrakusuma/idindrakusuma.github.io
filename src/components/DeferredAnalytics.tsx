'use client';

import { GoogleAnalytics } from '@next/third-parties/google';
import { useEffect, useState } from 'react';

/**
 * Loads Google Analytics once the browser has nothing better to do.
 *
 * The gtag bundle is 151 KB — by some way the largest thing the page fetches —
 * and `@next/third-parties` gives no way to change when it loads: GAParams has
 * no `strategy`, and the component hands it to `next/script` at its
 * `afterInteractive` default. Mounting it from an idle callback moves it off the
 * critical path without hand-rolling the snippet.
 *
 * The trade: a visitor who leaves within the first second or two may go
 * uncounted.
 */
export default function DeferredAnalytics({ gaId }: { gaId: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Safari has no requestIdleCallback; a timeout is close enough for this.
    if (typeof requestIdleCallback === 'function') {
      const handle = requestIdleCallback(() => setReady(true), { timeout: 5000 });
      return () => cancelIdleCallback(handle);
    }
    const timer = window.setTimeout(() => setReady(true), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  return ready ? <GoogleAnalytics gaId={gaId} /> : null;
}
