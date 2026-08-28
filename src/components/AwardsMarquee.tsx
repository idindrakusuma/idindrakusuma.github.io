'use client';

import { useRef } from 'react';
import type { Award } from '@/lib/site-data';
import AwardCard from './AwardCard';
import useMarquee from '@/hooks/useMarquee';

/** Drift speed in CSS pixels per second. */
const SPEED = 28;

/**
 * The awards as an infinite horizontal strip.
 *
 * The looping itself is `useMarquee`'s job. Hovering pauses it so a card can be
 * read, and the strip can be dragged by hand in either direction — both are wired
 * to the outer wrapper rather than the track, so the padding around the cards
 * responds too.
 */
export default function AwardsMarquee({ awards }: { awards: Award[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { copies, pauseHandlers, dragHandlers } = useMarquee({
    trackRef,
    itemCount: awards.length,
    speed: SPEED,
    draggable: true,
  });

  return (
    <div
      // The mask paints only within this element's box, so a card's hover shadow is
      // cut off wherever it falls outside — `overflow` has nothing to do with it.
      // That shadow (0 26px 50px -18px) reaches ~33px below a card, so the bottom
      // padding has to clear it; the negative margin hands those 30px back to the
      // layout, which keeps this section's rhythm identical to every other one.
      className="ik-awrap relative -mx-6 -mb-[46px] px-6 pt-3.5 pb-14"
      {...pauseHandlers}
      {...dragHandlers}
    >
      <div ref={trackRef} className="flex w-max gap-4 will-change-transform">
        {Array.from({ length: copies }, (_, copy) =>
          awards.map((award) => (
            // Only the first set is exposed to assistive tech; the rest are visual filler.
            <AwardCard key={`${copy}-${award.title}`} award={award} hidden={copy > 0} />
          )),
        )}
      </div>
    </div>
  );
}
