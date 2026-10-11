'use client';

import { useEffect, useRef, useState } from 'react';
import type { Category } from '@/lib/posts';
import { replayEntrance } from '@/hooks/replayEntrance';
import FilterPills from './FilterPills';

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

      replayEntrance(card, Math.min(shown, STAGGERED) * STAGGER_MS);
      shown += 1;
    }

    settled.current = true;
  }, [active]);

  return (
    <FilterPills
      options={[ALL, ...categories].map((name) => ({ value: name, label: name }))}
      active={active}
      onSelect={setActive}
    />
  );
}
