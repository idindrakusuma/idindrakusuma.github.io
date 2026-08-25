'use client';

import type { MouseEvent } from 'react';
import type { Award } from '@/lib/site-data';
import Reveal from './Reveal';

/**
 * Award card. On hover it fills with solid primary and a soft highlight tracks
 * the cursor across it — the highlight position is handed to CSS as --mx/--my.
 */
export default function AwardCard({ award }: { award: Award }) {
  const trackCursor = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    event.currentTarget.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };

  return (
    <Reveal
      className="ik-award bg-surface border-line rounded-2xl border p-[22px]"
      onMouseMove={trackCursor}
    >
      <div>
        <h3 className="font-display m-0 mb-1.5 text-[16.5px] font-semibold tracking-[-.01em]">
          {award.title}
        </h3>
        <p className="font-mono text-primary m-0 mb-2.5 text-xs">{award.org}</p>
        <p className="text-muted m-0 text-[13.5px] leading-[1.5]">{award.desc}</p>
      </div>
    </Reveal>
  );
}
