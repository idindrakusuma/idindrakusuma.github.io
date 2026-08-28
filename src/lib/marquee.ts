/**
 * The geometry behind an infinite horizontal marquee.
 *
 * A marquee renders its item set several times over and translates the track by
 * exactly one set's width before wrapping, so the seam never shows. Everything
 * here is pure arithmetic on that model — no DOM, no React — which is what makes
 * the tricky parts (wrapping, copy count, holding position across a re-measure)
 * checkable on their own. The DOM side lives in `useMarquee`.
 *
 * `wrapWidth` throughout is the width of one set: the distance from the first
 * item to its counterpart in the next copy.
 */

/** -1 drifts left, 1 drifts right. */
export type MarqueeDirection = -1 | 1;

/**
 * Largest time step honoured in one frame, in seconds. A tab returning from the
 * background reports a huge delta; without this the track would lurch forward by
 * however long it was away.
 */
export const MAX_DELTA = 0.06;

/** Two copies is the floor: one on screen, one following it into view. */
export const MIN_COPIES = 2;

/**
 * Normalises an offset into `(-wrapWidth, 0]`.
 *
 * The track is a tiling of period `wrapWidth`, so every offset congruent modulo
 * that period renders identically — wrapping is just picking the representative
 * that keeps the numbers small. Uses a modulo rather than a single conditional
 * so a fast drag that covers more than one period in a frame still lands right.
 */
export function wrap(offset: number, wrapWidth: number): number {
  if (wrapWidth <= 0) return offset;
  const wrapped = offset % wrapWidth;
  // `|| 0` turns the -0 that `%` yields on exact multiples back into 0.
  return wrapped > 0 ? wrapped - wrapWidth : wrapped || 0;
}

/** Advances the track by one frame and wraps the result. */
export function advance(
  offset: number,
  options: { wrapWidth: number; direction: MarqueeDirection; speed: number; delta: number },
): number {
  const { wrapWidth, direction, speed, delta } = options;
  return wrap(offset + direction * speed * delta, wrapWidth);
}

/**
 * How many copies of the set to render.
 *
 * The track travels one full set, so the copies *after* the first have to cover
 * the viewport on their own — otherwise the row runs out of content mid-travel
 * and leaves a visible gap.
 */
export function copiesFor(viewportWidth: number, wrapWidth: number): number {
  if (wrapWidth <= 0) return MIN_COPIES;
  return Math.max(MIN_COPIES, Math.ceil(viewportWidth / wrapWidth) + 1);
}

/**
 * Carries the visual position across a re-measure (logos finishing loading, a
 * resize) instead of snapping back to the start: the offset is re-expressed as a
 * fraction of the set and re-applied to the new width.
 *
 * With no previous width there is nothing to preserve, so the track starts where
 * its direction needs it to — a rightward track begins one full set back, which
 * gives it somewhere to travel from.
 */
export function rescale(
  offset: number,
  oldWrapWidth: number,
  newWrapWidth: number,
  direction: MarqueeDirection,
): number {
  const progress = oldWrapWidth > 0 ? offset / oldWrapWidth : direction > 0 ? -1 : 0;
  return progress * newWrapWidth;
}
