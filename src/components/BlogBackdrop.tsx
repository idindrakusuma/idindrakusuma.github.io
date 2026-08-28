/**
 * The blog's drifting orbs.
 *
 * Lighter than the homepage's AuroraBackground — no grid overlay, and one orb
 * on an article so the reading column stays calm. Purely decorative.
 */
export default function BlogBackdrop({ single = false }: { single?: boolean }) {
  return (
    <div aria-hidden="true" className="bg-bg pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute -top-[15%] right-[-11%] rounded-full"
        style={{
          width: single ? '58vw' : '60vw',
          height: single ? '58vw' : '60vw',
          opacity: single ? 0.12 : 0.14,
          background: 'radial-gradient(circle at 35% 35%,var(--a1),transparent 66%)',
          filter: single ? 'blur(48px)' : 'blur(46px)',
          animation: `ik-aur1 ${single ? '28s' : '26s'} ease-in-out infinite`,
        }}
      />
      {!single && (
        <div
          className="absolute bottom-[-20%] left-[-12%] h-[52vw] w-[52vw] rounded-full opacity-[.12] blur-[52px]"
          style={{
            background: 'radial-gradient(circle at 60% 40%,var(--a3),transparent 64%)',
            animation: 'ik-aur2 32s ease-in-out infinite',
          }}
        />
      )}
    </div>
  );
}
