/**
 * The blog's drifting orbs.
 *
 * Lighter than the homepage's AuroraBackground — no grid overlay, and one orb
 * on an article so the reading column stays calm. Purely decorative.
 *
 * Soft by gradient alone, with no `blur()` filter — see AuroraBackground,
 * including why every gradient is sized `closest-side` and why the layer clips
 * only sideways.
 */
export default function BlogBackdrop({ single = false }: { single?: boolean }) {
  return (
    <div aria-hidden="true" className="bg-bg pointer-events-none fixed inset-0 z-0 overflow-x-clip">
      <div
        className="absolute -top-[15%] right-[-11%]"
        style={{
          width: single ? '58vw' : '60vw',
          height: single ? '58vw' : '60vw',
          opacity: single ? 0.12 : 0.14,
          background: 'radial-gradient(closest-side,var(--a1),transparent)',
          animation: `ik-aur1 ${single ? '28s' : '26s'} ease-in-out infinite`,
        }}
      />
      {!single && (
        <div
          className="absolute bottom-[-20%] left-[-12%] h-[52vw] w-[52vw] opacity-[.12]"
          style={{
            background: 'radial-gradient(closest-side,var(--a3),transparent)',
            animation: 'ik-aur2 32s ease-in-out infinite',
          }}
        />
      )}
    </div>
  );
}
