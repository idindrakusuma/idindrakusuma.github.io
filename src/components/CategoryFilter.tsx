'use client';

import { useEffect, useState } from 'react';
import type { Category } from '@/lib/posts';

/**
 * The filter pills above the post list.
 *
 * Filtering is done by hiding cards in place rather than by re-rendering the
 * list, which keeps every card a server component and the whole archive in the
 * static HTML — good for search engines, and correct with JavaScript off, where
 * the pills simply never appear and all posts stay visible.
 */
const ALL = 'All';

export default function CategoryFilter({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState<string>(ALL);

  useEffect(() => {
    for (const card of document.querySelectorAll<HTMLElement>('[data-post-cat]')) {
      card.style.display = active === ALL || card.dataset.postCat === active ? '' : 'none';
    }
  }, [active]);

  return (
    <div className="flex flex-wrap gap-[9px]">
      {[ALL, ...categories].map((name) => {
        const on = name === active;
        return (
          <button
            key={name}
            type="button"
            onClick={() => setActive(name)}
            aria-pressed={on}
            className={`font-mono cursor-pointer rounded-full border px-4 py-[9px] text-[12.5px] font-medium ${
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
