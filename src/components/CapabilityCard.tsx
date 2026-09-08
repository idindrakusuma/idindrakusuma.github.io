'use client';

import type { Capability } from '@/lib/site-data';
import { trackSpotlight } from '@/lib/spotlight';

/**
 * One capability in Section 03: what is owned, in a sentence, over the chips
 * naming the stack behind it.
 *
 * Shares the Award card's cursor spotlight — same `.ik-spotlight` recipe, same
 * --mx/--my. Client only for the mousemove; nothing else here needs the browser.
 *
 * Deliberately not wrapped in <Reveal>: the reveal animates `transform` with
 * `fill: both`, which would pin `transform: none` once it finishes and kill the
 * hover lift. The reveal lives on the grid instead.
 */
export default function CapabilityCard({ capability }: { capability: Capability }) {
  return (
    <div
      className="ik-spotlight bg-surface border-line rounded-[18px] border p-6"
      onMouseMove={trackSpotlight}
    >
      <div>
        <div className="mb-[9px] flex items-center gap-2.5">
          <span className="bg-primary h-[9px] w-[9px] flex-none rounded-[3px]" />
          <h3 className="font-display m-0 text-[16.5px] font-semibold">{capability.name}</h3>
        </div>

        <p className="text-muted m-0 mb-4 text-[13.5px] leading-[1.55]">{capability.blurb}</p>

        <div className="flex flex-wrap gap-[7px]">
          {capability.items.map((item) => (
            <span
              key={item}
              className="font-mono text-ink bg-surface-2 border-line rounded-lg border px-2.5 py-[5px] text-[11.5px] font-medium"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
