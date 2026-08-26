'use client';

import type { MouseEvent } from 'react';
import type { Award } from '@/lib/site-data';

/**
 * Award card. A soft highlight tracks the cursor across it while it lifts — the
 * highlight position is handed to CSS as --mx/--my.
 *
 * Deliberately not wrapped in <Reveal>: these are marquee items, and the reveal
 * animates `transform`, which would fight both the track's translateX and the
 * card's own hover lift. The reveal lives on the static wrapper instead.
 */
export default function AwardCard({ award, hidden }: { award: Award; hidden?: boolean }) {
  const trackCursor = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    event.currentTarget.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };

  return (
    <div
      className="ik-award bg-surface border-line w-[290px] flex-none rounded-2xl border p-[22px]"
      onMouseMove={trackCursor}
      aria-hidden={hidden || undefined}
    >
      <div>
        <h3 className="font-display m-0 mb-1.5 text-[16.5px] font-semibold tracking-[-.01em]">
          {award.title}
        </h3>
        <p className="font-mono text-primary m-0 mb-2.5 text-xs">{award.org}</p>
        <p className="text-muted m-0 text-[13.5px] leading-[1.5]">{award.desc}</p>
      </div>
    </div>
  );
}
