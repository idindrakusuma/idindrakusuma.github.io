/**
 * Fixed backdrop: three slowly drifting radial-gradient orbs over the page
 * background, plus a grid overlay masked to fade out below the hero.
 * Purely decorative and non-interactive.
 */
export default function AuroraBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-bg"
    >
      <div
        className="absolute -top-[15%] -left-[10%] h-[60vw] w-[60vw] rounded-full opacity-20 blur-[70px]"
        style={{
          background: 'radial-gradient(circle at 50% 50%,var(--a1),transparent 62%)',
          animation: 'ik-aur1 24s ease-in-out infinite',
        }}
      />
      <div
        className="absolute right-[-12%] bottom-[-20%] h-[58vw] w-[58vw] rounded-full opacity-[.16] blur-[80px]"
        style={{
          background: 'radial-gradient(circle at 50% 50%,var(--a3),transparent 62%)',
          animation: 'ik-aur2 30s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-[35%] left-[35%] h-[44vw] w-[44vw] rounded-full opacity-[.14] blur-[70px]"
        style={{
          background: 'radial-gradient(circle at 50% 50%,var(--a2),transparent 60%)',
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
