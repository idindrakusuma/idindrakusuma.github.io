'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

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

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/claps?slug=${slug}`, { signal: controller.signal })
      .then((res) => (res.ok ? (res.json() as Promise<Counts>) : null))
      .then((data) => data && setCounts(data))
      .catch(() => {});
    return () => controller.abort();
  }, [slug]);

  const flush = useCallback(async () => {
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
        setCounts((await res.json()) as Counts);
        track('clap', { slug, count });
      }
    } catch {
      /* the optimistic claps simply fall away below */
    }
    setPending((p) => Math.max(0, p - count));
  }, [slug]);

  // A batch still waiting when the reader leaves is sent rather than lost.
  useEffect(() => () => void flush(), [flush]);

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

/**
 * "Hands clapping" from Phosphor Icons (regular and fill), MIT licensed,
 * Copyright (c) 2023 Phosphor Icons. The filled form marks a post this reader
 * has already clapped for.
 */
const CLAP_OUTLINE =
  'M160.22,24V8a8,8,0,0,1,16,0V24a8,8,0,0,1-16,0ZM196.1,41a7.91,7.91,0,0,0,4.17,1.17,8,8,0,0,0,6.84-3.83l8-13.11a8,8,0,0,0-13.68-8.33l-8,13.1A8,8,0,0,0,196.1,41Zm47.51,12.59a8,8,0,0,0-10.08-5.16l-15.06,4.85a8,8,0,0,0,2.46,15.62,8.15,8.15,0,0,0,2.46-.39l15.05-4.85A8,8,0,0,0,243.61,53.55ZM217,97.58a80.22,80.22,0,0,1-10.22,94c-.34,1.73-.72,3.46-1.19,5.18A80.17,80.17,0,0,1,58.77,216L23.5,155a26,26,0,0,1,19.24-38.79l-3-5.2a26,26,0,0,1,19.2-38.78L58.24,71A26,26,0,0,1,95.47,36.53,26.06,26.06,0,0,1,140.3,37l12.26,21.2A26.07,26.07,0,0,1,195.81,61ZM109.07,55l0,0h0l25,43.17a26,26,0,0,1,17.33-10L126.42,45a10,10,0,1,0-17.35,10ZM72.12,63l6.46,11.17a26.05,26.05,0,0,1,17.32-10L89.45,53A10,10,0,1,0,72.12,63Zm111.54,81-20.22-35a10,10,0,0,0-17.74,9.25L158.3,140a8,8,0,0,1-13.87,8l-36.5-63A10,10,0,1,0,90.58,95l26.05,45a8,8,0,0,1-13.87,8L71,93h0l0,0a10,10,0,0,0-17.33,10l35.22,61A8,8,0,0,1,75,172L54.72,137a10,10,0,0,0-17.34,10l35.27,61a64.12,64.12,0,0,0,117.42-15.44A63.52,63.52,0,0,0,183.66,144Zm19.41-38.42L181.93,69A10,10,0,0,0,164.55,79l33,57.05A80.2,80.2,0,0,1,207,161.51,64.23,64.23,0,0,0,203.07,105.58Z';
const CLAP_FILLED =
  'M188.87,65A18,18,0,0,0,157.62,83L133.36,41a18,18,0,0,0-31.22,18L96.4,49A18,18,0,0,0,65.18,67l3.34,5.77A26,26,0,0,0,39.74,111l3,5.2A26,26,0,0,0,23.5,155l35.27,61a80.14,80.14,0,0,0,149.52-39.57A71.92,71.92,0,0,0,210,101.58Zm1.2,127.56A64.12,64.12,0,0,1,72.65,208L37.38,147a10,10,0,0,1,17.34-10L75,172a8,8,0,0,0,13.87-8L53.62,103A10,10,0,0,1,71,93l31.81,55a8,8,0,0,0,13.87-8l-26-45a10,10,0,0,1,17.35-10l36.5,63a8,8,0,0,0,13.87-8l-12.6-21.75A10,10,0,0,1,163.44,109l20.22,35A63.52,63.52,0,0,1,190.07,192.57ZM160.22,24V8a8,8,0,0,1,16,0V24a8,8,0,0,1-16,0Zm33.22,6,8-13.1a8,8,0,0,1,13.68,8.33l-8,13.11a8,8,0,0,1-6.84,3.83A8,8,0,0,1,193.44,30Zm45,33.66-15.05,4.85a8.15,8.15,0,0,1-2.46.39,8,8,0,0,1-2.46-15.62l15.06-4.85a8,8,0,1,1,4.91,15.23Z';

function ClapIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
      className={filled ? 'text-primary' : undefined}
    >
      <path d={filled ? CLAP_FILLED : CLAP_OUTLINE} />
    </svg>
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
