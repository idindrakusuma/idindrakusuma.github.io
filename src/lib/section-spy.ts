/**
 * The decisions behind the nav's scroll spy, with no DOM to make them against.
 *
 * All of this used to be inline in SiteChrome, interleaved with listener wiring
 * and JSX. The numbers here — where the activation line sits, how much clearance
 * the fixed nav needs, when a jump is too far to animate — are the whole of the
 * spy's judgement, and they are the part worth being able to check.
 */

/** A Section counts as active once its top passes this far down the viewport. */
export const ACTIVE_LINE = 0.35;

/** Clearance for the fixed nav island, which is taller once the links wrap. */
export const HEADER_OFFSET_NARROW = 112;
export const HEADER_OFFSET_WIDE = 96;
export const NARROW_VIEWPORT = 860;

/** Past this many viewports, a smooth scroll is a long blur — jump instead. */
export const LONG_JUMP_VIEWPORTS = 1.35;

export type SectionTop = { id: string; top: number };

export function headerOffset(viewportWidth: number): number {
  return viewportWidth <= NARROW_VIEWPORT ? HEADER_OFFSET_NARROW : HEADER_OFFSET_WIDE;
}

/**
 * The last Section whose top has passed the activation line, or `fallbackId`
 * when none has — which is the state at the top of the page, before the first
 * Section has scrolled up far enough to claim it.
 *
 * `measured` must be in document order; only Sections actually present count,
 * so a route that renders none of them simply keeps the fallback.
 */
export function activeSectionId(
  measured: SectionTop[],
  scrollTop: number,
  viewportHeight: number,
  fallbackId: string,
): string {
  const line = scrollTop + viewportHeight * ACTIVE_LINE;
  let current = fallbackId;
  for (const section of measured) {
    if (section.top <= line) current = section.id;
  }
  return current;
}

/** Where the page should land so the Section clears the nav. Never above zero. */
export function scrollTarget(sectionTop: number, scrollY: number, offset: number): number {
  return Math.max(0, scrollY + sectionTop - offset);
}

export function isLongJump(distance: number, viewportHeight: number): boolean {
  return distance > viewportHeight * LONG_JUMP_VIEWPORTS;
}
