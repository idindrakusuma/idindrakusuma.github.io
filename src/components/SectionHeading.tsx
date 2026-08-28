import type { ReactNode } from 'react';
import Reveal from './Reveal';

/** The h2 under a Section's eyebrow. Only the gap beneath it varies. */
export default function SectionHeading({
  className = 'mb-3.5',
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <Reveal
      as="h2"
      className={`font-display ${className} text-[clamp(28px,4vw,40px)] font-bold tracking-[-.02em]`}
    >
      {children}
    </Reveal>
  );
}
