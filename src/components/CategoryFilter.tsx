'use client';

import { useEffect, useRef, useState } from 'react';
import type { Category } from '@/lib/posts';

/**
 * The filter pills above the post list.
 *
 * Filtering is done by hiding cards in place rather than by re-rendering the
 * list, which keeps every card a server component and the whole archive in the
 * static HTML — good for search engines, and correct with JavaScript off, where
 * the pills simply never appear and all posts stay visible.
 *
 * Cards that come back into view replay the same entrance the hero uses, so a
 * category change reads as content arriving rather than the list snapping to a
 * different length.
 */
const ALL = 'All';

/**
 * Stagger between cards, and how many of them get one. Past a handful the delay
 * stops reading as rhythm and starts reading as lag.
 */
const STAGGER_MS = 45;
const STAGGERED = 6;

export default function CategoryFilter({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState<string>(ALL);

  // Nothing has changed on the first pass — the page has only just rendered, and
  // animating every card on arrival would fight the reveals already running.
  const settled = useRef(false);

  useEffect(() => {
    let shown = 0;

    for (const card of document.querySelectorAll<HTMLElement>('[data-post-cat]')) {
      if (active !== ALL && card.dataset.postCat !== active) {
        card.style.display = 'none';
        card.classList.remove('ik-post-enter');
        continue;
      }

      card.style.display = '';
      if (!settled.current) continue;

      // Removing the class, forcing layout, then adding it back is what restarts
      // the animation — a class that is already there does not replay.
      card.classList.remove('ik-post-enter');
      void card.offsetWidth;
      card.style.animationDelay = `${Math.min(shown, STAGGERED) * STAGGER_MS}ms`;
      card.classList.add('ik-post-enter');
      // The animation fills forwards, and a filled animation outranks ordinary
      // rules — left in place it would pin `transform` and kill the card's hover
      // lift. Taking the class off once it has finished hands the card back.
      card.addEventListener(
        'animationend',
        () => {
          card.classList.remove('ik-post-enter');
          card.style.animationDelay = '';
        },
        { once: true },
      );
      shown += 1;
    }

    settled.current = true;
  }, [active]);

  return (
    // The row scrolls sideways rather than wrapping once the screen is narrow;
    // two ragged rows of pills cost more height than the first post card.
    <div className="ik-cat-row flex flex-wrap gap-[9px]">
      {[ALL, ...categories].map((name) => {
        const on = name === active;
        return (
          <button
            key={name}
            type="button"
            onClick={() => setActive(name)}
            aria-pressed={on}
            className={`font-mono flex-none cursor-pointer rounded-full border px-4 py-[9px] text-[12.5px] font-medium whitespace-nowrap ${
              on
                ? 'border-primary bg-primary text-white'
                : 'border-line bg-surface text-muted hover:border-primary hover:text-primary transition-[color,border-color] duration-250'
            }`}
            style={on ? { boxShadow: '0 8px 20px -8px var(--glow)' } : undefined}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
}
