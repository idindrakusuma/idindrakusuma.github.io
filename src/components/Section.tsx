import type { ReactNode } from 'react';
import { sectionNumber } from '@/lib/site-data';
import Reveal from './Reveal';

/**
 * The shell every numbered Section on the homepage shares: the centred column,
 * and the eyebrow with its number and trailing rule.
 *
 * The number comes from the Section's place in NAV_ITEMS, so the page cannot be
 * reordered without the labels following. The vertical rhythm stays with the
 * caller — the gaps genuinely differ (About sits closer to the hero above it,
 * and has no heading under its eyebrow) and burying that variance in defaults
 * would hide real decisions rather than share them.
 *
 * Contact is not built from this: its eyebrow and heading live inside the card
 * rather than above it. It takes its number from `sectionNumber` all the same.
 */
export default function Section({
  id,
  eyebrow,
  className = 'pt-[60px] pb-[30px]',
  eyebrowClassName = 'mb-3.5',
  children,
}: {
  id: string;
  /** The label after the number — "About" renders as "01 — About". */
  eyebrow: string;
  /** Vertical padding for the section. */
  className?: string;
  /** Gap below the eyebrow. */
  eyebrowClassName?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`mx-auto max-w-[1160px] px-6 ${className}`}>
      <Reveal className={`flex items-center gap-3.5 ${eyebrowClassName}`}>
        <span className="font-mono text-primary text-[13px] font-medium">
          {`${sectionNumber(id)} — ${eyebrow}`}
        </span>
        <span className="ik-divider" />
      </Reveal>
      {children}
    </section>
  );
}
