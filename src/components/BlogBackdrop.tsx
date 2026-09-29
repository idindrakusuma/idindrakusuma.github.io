/**
 * The blog's drifting orbs.
 *
 * Lighter than the homepage's AuroraBackground — no grid overlay, and one orb
 * on an article so the reading column stays calm. Purely decorative.
 *
 * Soft by gradient alone, with no `blur()` filter — see AuroraBackground,
 * including why every gradient is sized `closest-side` and why the layer clips
 * only sideways.
 *
 * On a phone the top orb moves down and grows. Sized in vw it is small there,
 * and hung from the very top it sat right behind the status bar — where iOS
 * draws its own chrome over the page — so it read as a circle cut off by the
 * bar. Lowered to behind the title, it glows the way it does on a desktop,
 * where the same numbers already put its centre well clear of the top edge.
 * The index's bottom orb rises for the same reason at the other end: the
 * toolbar there is drawn over the page too.
 * Classes are whole strings on purpose: Tailwind only generates what it can
 * read in the source.
 */
const TOP_ORB = {
  index:
    'absolute -top-[15%] right-[-11%] h-[60vw] w-[60vw] opacity-[.14] max-sm:top-[8%] max-sm:right-[-30%] max-sm:h-[85vw] max-sm:w-[85vw]',
  article:
    'absolute -top-[15%] right-[-11%] h-[58vw] w-[58vw] opacity-[.12] max-sm:top-[8%] max-sm:right-[-30%] max-sm:h-[85vw] max-sm:w-[85vw]',
};
export default function BlogBackdrop({ single = false }: { single?: boolean }) {
  return (
    <div aria-hidden="true" className="bg-bg pointer-events-none fixed inset-0 z-0 overflow-x-clip">
      <div
        className={single ? TOP_ORB.article : TOP_ORB.index}
        style={{
          background: 'radial-gradient(closest-side,var(--a1),transparent)',
          animation: `ik-aur1 ${single ? '28s' : '26s'} ease-in-out infinite`,
        }}
      />
      {!single && (
        <div
          className="absolute bottom-[-20%] left-[-12%] h-[52vw] w-[52vw] opacity-[.12] max-sm:bottom-[12%] max-sm:left-[-30%] max-sm:h-[85vw] max-sm:w-[85vw]"
          style={{
            background: 'radial-gradient(closest-side,var(--a3),transparent)',
            animation: 'ik-aur2 32s ease-in-out infinite',
          }}
        />
      )}
    </div>
  );
}
