'use client';

import { useEffect, useRef, useState } from 'react';
import { replayEntrance } from '@/hooks/replayEntrance';
import FilterPills from './FilterPills';

const ALL = 'all';

/**
 * The pills that pick which list /projects shows on a narrow screen — the
 * blog's category filter, for the two sections instead of the categories.
 *
 * It sets `data-filter` on the lists' container and CSS hides the other
 * section, and only below 1024px: from there the pinned index beside the lists
 * replaces the pills, so widening the window shows everything again. With
 * JavaScript off nothing is hidden.
 *
 * The section coming back replays the cards' entrance, as the blog's do.
 */
export default function ProjectsFilter({
  target,
  sections,
}: {
  /** The id of the element holding the sections. */
  target: string;
  sections: { id: string; label: string; count: number }[];
}) {
  const [active, setActive] = useState(ALL);
  const settled = useRef(false);

  useEffect(() => {
    const list = document.getElementById(target);
    if (!list) return;
    list.dataset.filter = active;

    // Nothing changed on the first pass; the reveals are already running.
    if (!settled.current) {
      settled.current = true;
      return;
    }
    for (const section of list.querySelectorAll<HTMLElement>('[data-projects-section]')) {
      if (active !== ALL && section.dataset.projectsSection !== active) continue;
      replayEntrance(section);
    }
  }, [active, target]);

  const total = sections.reduce((sum, section) => sum + section.count, 0);
  return (
    <FilterPills
      className="lg:hidden"
      options={[
        { value: ALL, label: `All · ${total}` },
        ...sections.map(({ id, label, count }) => ({ value: id, label: `${label} · ${count}` })),
      ]}
      active={active}
      onSelect={setActive}
    />
  );
}
