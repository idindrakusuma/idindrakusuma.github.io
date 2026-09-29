'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import ClapIcon from './ClapIcon';

/** Mirrors MAX_PER_VISITOR in netlify/claps/core.ts. */
const MAX_CLAPS = 10;

/** Taps inside this window go to the server as one request. */
const BATCH_MS = 700;

type Counts = { total: number; mine: number };

type Gtag = (command: 'event', name: string, params: Record<string, unknown>) => void;

/**
 * Sends an event to Google Analytics once gtag exists.
 *
 * GA is mounted on the visitor's first interaction (see DeferredAnalytics), and
 * a clap or a share usually *is* that first interaction — so gtag may still be
 * a render away. This waits a few seconds for it rather than dropping the
 * event or queueing it ahead of GA's own config.
 */
function track(name: string, params: Record<string, unknown>) {
  let tries = 0;
  const send = () => {
    const gtag = (window as unknown as { gtag?: Gtag }).gtag;
    if (gtag) gtag('event', name, params);
    else if (++tries < 20) window.setTimeout(send, 250);
  };
  send();
}

/**
 * Clap and share, at the end of a post.
 *
 * The page stays a static export; only this block talks to a server, the
 * /api/claps Netlify function. Counts are fetched after the page has painted,
 * so none of it sits in front of the article.
 */
export default function PostActions({ slug, title }: { slug: string; title: string }) {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [pending, setPending] = useState(0);
  const [bursts, setBursts] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const pendingRef = useRef(0);
  const timer = useRef<number | undefined>(undefined);

  /**
   * Counts only ever go up, so a response is merged by taking the larger of
   * each number. Two batches can be in flight at once and answer out of order,
   * and the first read can land after a write; neither may pull the count back
   * down to an older snapshot.
   */
  const merge = useCallback((next: Counts) => {
    setCounts((prev) =>
      prev ? { total: Math.max(prev.total, next.total), mine: Math.max(prev.mine, next.mine) } : next,
    );
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/claps?slug=${slug}`, { signal: controller.signal })
      .then((res) => (res.ok ? (res.json() as Promise<Counts>) : null))
      .then((data) => data && merge(data))
      .catch(() => {});
    return () => controller.abort();
  }, [slug, merge]);

  const flush = useCallback(async () => {
    window.clearTimeout(timer.current);
    const count = pendingRef.current;
    if (!count) return;
    pendingRef.current = 0;
    try {
      const res = await fetch('/api/claps', {
        method: 'POST',
        // Lets the request finish when the flush comes from leaving the page.
        keepalive: true,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug, count }),
      });
      if (res.ok) {
        merge((await res.json()) as Counts);
        track('clap', { slug, count });
      }
    } catch {
      /* the optimistic claps simply fall away below */
    }
    setPending((p) => Math.max(0, p - count));
  }, [slug, merge]);

  // A batch still waiting when the reader leaves is sent rather than lost.
  // Closing the tab, reloading or following a link elsewhere never unmounts
  // the component, so the page's own hide events send it; the unmount
  // cleanup covers navigating to another post inside the app.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden') void flush();
    };
    const onPageHide = () => void flush();
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', onPageHide);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', onPageHide);
      void flush();
    };
  }, [flush]);

  const mine = (counts?.mine ?? 0) + pending;
  const total = (counts?.total ?? 0) + pending;
  const full = mine >= MAX_CLAPS;

  const clap = () => {
    if (full) return;
    pendingRef.current += 1;
    setPending((p) => p + 1);
    setBursts((b) => [...b.slice(-4), Date.now() + Math.random()]);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(flush, BATCH_MS);
  };

  const share = async () => {
    const url = `${window.location.origin}/blog/${slug}/`;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, url });
        track('share', { slug, method: 'native' });
      } catch {
        /* dismissed */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      track('share', { slug, method: 'copy' });
    } catch {
      /* clipboard refused */
    }
  };

  return (
    <div className="border-line bg-surface shadow-card-sm mt-[52px] flex flex-col items-center gap-4 rounded-[20px] border px-6 py-7 text-center">
      <p className="font-display m-0 text-[19px] font-bold tracking-[-.01em]">Enjoyed this?</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={clap}
          aria-label={full ? `You gave ${MAX_CLAPS} claps` : 'Clap for this post'}
          aria-pressed={mine > 0}
          data-full={full || undefined}
          className="ik-clap bg-surface-2 border-line text-ink hover:border-primary relative inline-flex items-center gap-2.5 rounded-full border px-5 py-3 text-[15px] font-semibold transition-[translate,border-color,color] hover:-translate-y-[2px]"
        >
          <ClapIcon filled={mine > 0} />
          <span>{full ? 'Thank you!' : 'Clap'}</span>
          {total > 0 && (
            <span className="text-muted font-mono text-[13px] tabular-nums" aria-label={`${total} claps`}>
              {total}
            </span>
          )}
          {bursts.map((id) => (
            <span
              key={id}
              aria-hidden="true"
              className="ik-clap-burst text-primary font-mono pointer-events-none absolute -top-2 left-1/2 text-[13px] font-bold"
              onAnimationEnd={() => setBursts((b) => b.filter((x) => x !== id))}
            >
              +1
            </span>
          ))}
        </button>

        <button
          type="button"
          onClick={share}
          className="bg-surface-2 border-line text-ink hover:border-primary inline-flex items-center gap-2.5 rounded-full border px-5 py-3 text-[15px] font-semibold transition-[translate,border-color] hover:-translate-y-[2px]"
        >
          <ShareIcon />
          <span aria-live="polite">{copied ? 'Link copied' : 'Share'}</span>
        </button>
      </div>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
      <path d="M16 6l-4-4-4 4" />
      <path d="M12 2v13" />
    </svg>
  );
}
