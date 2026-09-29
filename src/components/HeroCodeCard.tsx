'use client';

import { useEffect, useState } from 'react';

/** The roles the card types out in turn. */
const ROLES = [
  { role: 'Senior Frontend Engineer', at: 'ByteDance' },
  { role: 'Co-Founder & Tech Advisor', at: 'Invitato' },
];

/** How long a role stays up before it is rewritten. */
const HOLD_MS = 3800;
const DELETE_MS = 22;
const TYPE_MS = 48;
/** The pause at an empty value, between deleting and typing. */
const GAP_MS = 260;

type Field = 'role' | 'at';
type Shown = { role: string; at: string; editing: Field };

const wait = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    // The loop never ends, so each wait must take its abort listener back off
    // the shared signal once it finishes, or they pile up for as long as the
    // tab stays open.
    const onAbort = () => {
      window.clearTimeout(id);
      reject(signal.reason);
    };
    const id = window.setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    signal.addEventListener('abort', onAbort, { once: true });
  });

/**
 * The code card on the homepage portrait: `role` and `at` are rewritten in
 * place, a character at a time, cycling through ROLES.
 *
 * The static HTML carries the first role in full, so the card reads the same
 * before any script runs — and stays that way for anyone who prefers reduced
 * motion. The typing is hidden from screen readers, which get every role once,
 * as plain text, instead of a stream of partial words.
 */
export default function HeroCodeCard({ className, style }: { className: string; style: React.CSSProperties }) {
  const [shown, setShown] = useState<Shown>({ ...ROLES[0], editing: 'at' });

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const controller = new AbortController();
    const { signal } = controller;

    const rewrite = async (field: Field, from: string, to: string) => {
      setShown((s) => ({ ...s, editing: field }));
      for (let n = from.length - 1; n >= 0; n--) {
        await wait(DELETE_MS, signal);
        setShown((s) => ({ ...s, [field]: from.slice(0, n) }));
      }
      await wait(GAP_MS, signal);
      for (let n = 1; n <= to.length; n++) {
        await wait(TYPE_MS, signal);
        setShown((s) => ({ ...s, [field]: to.slice(0, n) }));
      }
    };

    (async () => {
      for (let i = 0; ; i = (i + 1) % ROLES.length) {
        const next = ROLES[(i + 1) % ROLES.length];
        await wait(HOLD_MS, signal);
        await rewrite('role', ROLES[i].role, next.role);
        await wait(GAP_MS, signal);
        await rewrite('at', ROLES[i].at, next.at);
      }
    })().catch(() => {
      /* unmounted */
    });

    return () => controller.abort();
  }, []);

  return (
    <div className={className} style={style}>
      <p className="sr-only">
        {ROLES.map(({ role, at }) => `${role} at ${at}`).join('; ')}.
      </p>
      {/* Wide enough for the longest line, so the card never resizes as it types. */}
      <div aria-hidden="true" className="min-w-[33ch]">
        <Line name="role" value={shown.role} caret={shown.editing === 'role'} />
        <Line name="at" value={shown.at} caret={shown.editing === 'at'} />
      </div>
    </div>
  );
}

function Line({ name, value, caret = false }: { name: string; value: string; caret?: boolean }) {
  return (
    <div className="whitespace-nowrap">
      <span className="text-primary">{name}</span>
      <span className="text-faint">: </span>
      <span className="text-ink">
        &apos;{value}
        {caret && <span className="ik-caret" />}&apos;
      </span>
    </div>
  );
}
