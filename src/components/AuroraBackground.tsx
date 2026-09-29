/**
 * Fixed backdrop: three slowly drifting radial-gradient orbs over the page
 * background, plus a grid overlay masked to fade out below the hero.
 * Purely decorative and non-interactive.
 *
 * The orbs are soft because their gradients fade out late, not because of a
 * `blur()` filter. They used to carry a 70–80px blur on top, on squares 60vw
 * across — and a blur that size has to be rasterised before the first frame
 * can show. Where rasterising runs on the CPU, as in the headless Chrome that
 * PageSpeed measures with, that was ~100ms in front of First Contentful Paint
 * for an edge the gradient already fades.
 *
 * Every orb's gradient is sized `closest-side`, so it reaches transparent
 * exactly at the orb's own edge. Sized from the farthest corner instead (the
 * default) it could still be half-strength where the square ended, and without
 * a blur to hide it that showed as a hard circular rim — plainly on the blog's
 * off-centre orbs on a phone.
 *
 * The layer clips sideways only. The orbs hang past the viewport on purpose,
 * and iOS Safari paints the page on under its status bar and toolbar — but a
 * fixed `inset: 0` box stops at the layout viewport, so clipping it on every
 * side cut the top orb off in a straight line just below the status bar.
 * `overflow-x: clip` (unlike `hidden`) leaves the other axis visible, so the
 * orbs carry on under the bars, while nothing past the sides can make the page
 * pan horizontally. A fixed box's overflow never lengthens the scroll either.
 *
 * On a phone the top orb moves down and the bottom one up, and both grow, as
 * the blog's do (see BlogBackdrop): hung off the edges they sat behind iOS's
 * status bar and toolbar, where the page is painted on but this fixed layer
 * stops, and read as circles cut off in a straight line.
 */
export default function AuroraBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-x-clip bg-bg"
    >
      <div
        className="absolute -top-[15%] -left-[10%] h-[60vw] w-[60vw] opacity-[.16] max-sm:top-[8%] max-sm:left-[-30%] max-sm:h-[85vw] max-sm:w-[85vw]"
        style={{
          background: 'radial-gradient(closest-side,var(--a1),transparent)',
          animation: 'ik-aur1 24s ease-in-out infinite',
        }}
      />
      <div
        className="absolute right-[-12%] bottom-[-20%] h-[58vw] w-[58vw] opacity-[.13] max-sm:right-[-30%] max-sm:bottom-[12%] max-sm:h-[85vw] max-sm:w-[85vw]"
        style={{
          background: 'radial-gradient(closest-side,var(--a3),transparent)',
          animation: 'ik-aur2 30s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-[35%] left-[35%] h-[44vw] w-[44vw] opacity-[.11]"
        style={{
          background: 'radial-gradient(closest-side,var(--a2),transparent)',
          animation: 'ik-aur3 27s ease-in-out infinite',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px)',
          backgroundSize: '58px 58px',
          WebkitMaskImage: 'radial-gradient(circle at 50% 22%,#000,transparent 78%)',
          maskImage: 'radial-gradient(circle at 50% 22%,#000,transparent 78%)',
        }}
      />
    </div>
  );
}
