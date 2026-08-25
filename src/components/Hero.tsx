import Image from 'next/image';
import { YEARS_EXPERIENCE } from '@/lib/site-data';
import Reveal from './Reveal';

/**
 * Decorative React-atom that sits behind the portrait: three orbital ellipses on
 * a very slow rotation with an electron gliding along each. SMIL drives the
 * electrons because animateMotion follows the ellipse path exactly, which a CSS
 * transform cannot do without recreating the geometry.
 */
function AtomBackdrop() {
  const ORBIT_PATH = 'M44,0 A44,17 0 1,1 -44,0 A44,17 0 1,1 44,0';
  const electrons = [
    { rotate: 0, begin: '0s' },
    { rotate: 60, begin: '-4s' },
    { rotate: 120, begin: '-8s' },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-1/2 z-0 aspect-square w-[210%] -translate-x-1/2 -translate-y-1/2 opacity-50"
      style={{
        WebkitMaskImage: 'radial-gradient(closest-side,#000 60%,transparent 100%)',
        maskImage: 'radial-gradient(closest-side,#000 60%,transparent 100%)',
      }}
    >
      <svg width="100%" height="100%" viewBox="-50 -50 100 100" fill="none" className="overflow-visible">
        <g style={{ color: 'var(--primary)' }}>
          <g
            style={{
              transformBox: 'fill-box',
              transformOrigin: 'center',
              animation: 'ik-spin 120s linear infinite',
            }}
          >
            <g stroke="currentColor" strokeWidth="0.7" fill="none" opacity="0.32">
              <ellipse rx="44" ry="17" />
              <ellipse rx="44" ry="17" transform="rotate(60)" />
              <ellipse rx="44" ry="17" transform="rotate(120)" />
            </g>
            {electrons.map(({ rotate, begin }) => (
              <g key={rotate} transform={`rotate(${rotate})`}>
                <circle r="2" style={{ fill: 'var(--primary-2)' }}>
                  <animateMotion
                    dur="12s"
                    calcMode="linear"
                    begin={begin}
                    repeatCount="indefinite"
                    path={ORBIT_PATH}
                  />
                </circle>
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}

export default function Hero() {
  // The atom backdrop is wider and taller than the header, and the two axes need
  // opposite treatment:
  //
  //   vertically   it must overhang, or the orbits get cut off mid-fade — the
  //                prototype's `overflow: hidden` left a hard edge below the portrait
  //   horizontally it must be clipped, or on a phone the overflow makes the browser
  //                widen the layout viewport and shrink the whole page to fit
  //
  // `overflow-x: clip` does exactly that; `hidden` would force overflow-y to `auto`
  // and reintroduce the vertical cut. `isolate` keeps the overhang painting beneath
  // the sections that follow, which dropping the clip would otherwise break.
  return (
    <header className="isolate overflow-x-clip px-6 pt-[150px] pb-[90px]">
      <div className="ik-hero relative z-1 mx-auto grid max-w-[1160px] grid-cols-[1.2fr_1fr] items-center gap-[52px]">
        <div className="ik-hero-copy">
          <Reveal as="p" delay={60} className="font-mono mb-3.5 text-sm tracking-[.02em]">
            <span className="ik-gradient-text font-medium">Fullstack Engineer · AI-Native</span>
          </Reveal>

          <Reveal
            as="h1"
            delay={100}
            className="font-display mb-[22px] text-[clamp(42px,7vw,76px)] leading-[1.02] font-bold tracking-[-.03em]"
          >
            Building fast,
            <br />
            scalable web
            <br />
            <span className="ik-gradient-shine">experiences.</span>
          </Reveal>

          <Reveal
            as="p"
            delay={160}
            className="text-muted mb-[34px] max-w-[540px] text-[clamp(16px,2.2vw,19px)]"
          >
            {YEARS_EXPERIENCE}+ years building end-to-end — from top-traffic commerce frontends to Go
            services and AI-native tooling. Currently at{' '}
            <strong className="text-ink font-semibold">ByteDance</strong>, previously{' '}
            <strong className="text-ink font-semibold">Tokopedia</strong>.
          </Reveal>

          <Reveal delay={220} className="flex flex-wrap gap-[13px]">
            <a
              href="#experience"
              className="ik-btn-primary rounded-[13px] px-[26px] py-3.5 text-[15px] font-semibold text-white no-underline transition-[translate,box-shadow] hover:-translate-y-[3px]"
            >
              View experience
            </a>
            <a
              href="#contact"
              className="ik-btn-secondary bg-surface text-ink border-line hover:border-primary rounded-[13px] border px-[26px] py-3.5 text-[15px] font-semibold no-underline transition-[translate,border-color,box-shadow] hover:-translate-y-[3px]"
            >
              Get in touch
            </a>
          </Reveal>
        </div>

        <Reveal
          delay={140}
          // The cap is the desktop size; the middle term governs phones. It was
          // min(400px, 84vw), where the 84vw branch always won below ~476px — so the
          // portrait stayed at 84% of the screen on every phone and pushed the
          // opening paragraph off the first viewport. 400px was a desktop decision
          // that mobile inherited when the grid collapses to one column.
          className="ik-hero-media relative w-[clamp(200px,60vw,400px)] justify-self-center"
        >
          <AtomBackdrop />

          {/* Glowing halo behind the portrait. */}
          <div
            aria-hidden="true"
            className="absolute -inset-4 rounded-full opacity-55 blur-[22px]"
            style={{
              background: 'conic-gradient(from 0deg,var(--a1),var(--a3),var(--a2),var(--a1))',
              animation: 'ik-spin 14s linear infinite',
            }}
          />

          <div
            className="shadow-card relative aspect-square rounded-full p-1.5"
            style={{ background: 'linear-gradient(135deg,var(--a1),var(--a3))' }}
          >
            <div className="bg-surface-2 h-full w-full overflow-hidden rounded-full">
              <Image
                src="/profile.webp"
                alt="Indra Kusuma"
                width={800}
                height={800}
                priority
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div
            className="bg-surface border-line shadow-card-sm absolute right-[-10px] bottom-1.5 rounded-[14px] border px-4 py-2.5"
            style={{ animation: 'ik-float 5s ease-in-out infinite' }}
          >
            <div className="ik-gradient-text font-display text-base leading-[1.05] font-bold whitespace-nowrap">
              Full-stack
            </div>
            <div className="text-muted text-[11px] whitespace-nowrap">Engineer</div>
          </div>

          <div
            className="bg-surface border-line shadow-card-sm absolute top-[-2px] left-[-18px] flex items-center gap-2 rounded-[14px] border px-3.5 py-[9px]"
            style={{ animation: 'ik-float 5s ease-in-out infinite .8s' }}
          >
            <span
              className="h-2 w-2 flex-none rounded-full"
              style={{ background: 'linear-gradient(135deg,var(--a1),var(--a2))' }}
            />
            <span className="font-mono text-ink text-[13px] font-medium">AI-Native</span>
          </div>
        </Reveal>
      </div>
    </header>
  );
}
