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
 */
export default function AuroraBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-bg"
    >
      <div
        className="absolute -top-[15%] -left-[10%] h-[60vw] w-[60vw] rounded-full opacity-[.16]"
        style={{
          background: 'radial-gradient(circle at 50% 50%,var(--a1),transparent 72%)',
          animation: 'ik-aur1 24s ease-in-out infinite',
        }}
      />
      <div
        className="absolute right-[-12%] bottom-[-20%] h-[58vw] w-[58vw] rounded-full opacity-[.13]"
        style={{
          background: 'radial-gradient(circle at 50% 50%,var(--a3),transparent 74%)',
          animation: 'ik-aur2 30s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-[35%] left-[35%] h-[44vw] w-[44vw] rounded-full opacity-[.11]"
        style={{
          background: 'radial-gradient(circle at 50% 50%,var(--a2),transparent 70%)',
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
