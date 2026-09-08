import type { MouseEvent } from 'react';

/**
 * Hands the cursor's position inside an element to CSS as `--mx`/`--my`,
 * in percent. `.ik-spotlight` reads them to place its radial highlight.
 *
 * A plain function rather than a hook: there is no state and nothing to clean
 * up, so both card components can share it without either owning it.
 */
export function trackSpotlight(event: MouseEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
  event.currentTarget.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
}
