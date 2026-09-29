import Image from 'next/image';
import { YEARS_EXPERIENCE } from '@/lib/site-data';
import HeroCodeCard from './HeroCodeCard';
import Reveal from './Reveal';

const floatCard = 'bg-surface border-line shadow-card-sm absolute border';

/**
 * Logos from @lobehub/icons (MIT); the marks belong to Anthropic, OpenAI,
 * ByteDance and Google. Four entries to match the four steps of ik-ai-cycle.
 */
const AI_TOOLS = ['claude', 'codex', 'trae', 'antigravity'];

/** The pieces drift out of step, as in the blog header's illustration. */
const drift = { animation: 'ik-float 6s ease-in-out infinite' };
const driftLate = { animation: 'ik-float 6s ease-in-out infinite -3s' };

/**
 * A dotted orbit behind the portrait — the same thin, dashed line the blog
 * header's illustration draws, in place of the old spinning atom. Its dashes
 * march slowly round it (.ik-orbit-march).
 *
 * Level, and nudged up to the window's centre rather than the square's (the
 * window sits a little high in it), so it reaches equally far either side.
 * Tilted, one end fell low by the code card and the other high by the chip,
 * and the left side read as wider.
 */
function Orbit() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 400"
      fill="none"
      className="pointer-events-none absolute -inset-[6%] -translate-y-[3.4%] overflow-visible"
    >
      <ellipse
        cx="200"
        cy="200"
        rx="215"
        ry="92"
        strokeWidth="1.3"
        strokeDasharray="3 8"
        className="ik-orbit-march"
        style={{ stroke: 'var(--primary)', opacity: 0.4 }}
      />
    </svg>
  );
}

export default function Hero() {
  // The portrait's orbit and floating cards reach past the header, and the two
  // axes need opposite treatment:
  //
  //   vertically   they must overhang, or the orbit gets cut off mid-line — the
  //                prototype's `overflow: hidden` left a hard edge below the portrait
  //   horizontally it must be clipped, or on a phone the overflow makes the browser
  //                widen the layout viewport and shrink the whole page to fit
  //
  // `overflow-x: clip` does exactly that; `hidden` would force overflow-y to `auto`
  // and reintroduce the vertical cut. `isolate` keeps the overhang painting beneath
  // the sections that follow, which dropping the clip would otherwise break.
  return (
    <header className="isolate overflow-x-clip px-6 pt-[150px] pb-[90px] max-sm:pt-[112px] max-sm:pb-[64px]">
      <div className="ik-hero relative z-1 mx-auto grid max-w-[1160px] grid-cols-[1.2fr_1fr] items-center gap-[52px]">
        <div className="ik-hero-copy">
          {/* One heading holds both the greeting and the headline, so the page's
              h1 carries the name people search for. Each half keeps its own
              look and its own staggered reveal, as blocks inside the h1. */}
          <h1 className="m-0">
            <Reveal immediate as="span" delay={60} className="font-mono mb-3.5 block text-sm tracking-[.02em]">
              <span className="ik-gradient-text font-medium">Hi, I’m Indra Kusuma.</span>
            </Reveal>{' '}
            <Reveal immediate
              as="span"
              delay={100}
              // The LCP element: rises in without fading — see .ik-reveal-rise.
              className="ik-reveal-rise font-display mb-[22px] block text-[clamp(42px,7vw,76px)] leading-[1.02] font-bold tracking-[-.03em]"
            >
              I build fast,
              <br />
              scalable web
              <br />
              <span className="ik-gradient-shine">experiences.</span>
            </Reveal>
          </h1>

          <Reveal immediate
            as="p"
            delay={160}
            className="text-muted mb-[34px] max-w-[540px] text-[clamp(16px,2.2vw,19px)]"
          >
            I’m a full-stack engineer with {YEARS_EXPERIENCE}+ years of experience building web products,
            backend services, and developer tools. Currently at{' '}
            <strong className="text-ink font-semibold">ByteDance</strong>, previously{' '}
            <strong className="text-ink font-semibold">Tokopedia</strong>.
          </Reveal>

          <Reveal immediate delay={220} className="flex flex-wrap gap-[13px]">
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

        <Reveal immediate
          delay={140}
          // The cap is the desktop size; the middle term governs phones. It was
          // min(400px, 84vw), where the 84vw branch always won below ~476px — so the
          // portrait stayed at 84% of the screen on every phone and pushed the
          // opening paragraph off the first viewport. 400px was a desktop decision
          // that mobile inherited when the grid collapses to one column.
          //
          // On a phone the portrait outsizes the headline and becomes the page's
          // LCP element, so it rises in without fading too — see .ik-reveal-rise.
          className="ik-hero-media ik-reveal-rise relative aspect-square w-[clamp(250px,66vw,420px)] justify-self-center"
        >
          <Orbit />

          {/* Soft glow behind the window. */}
          <div
            aria-hidden="true"
            className="absolute inset-[12%] opacity-40 blur-[60px]"
            style={{ background: 'radial-gradient(closest-side,var(--a1),transparent)' }}
          />

          {/* The portrait, framed as an app window. */}
          <div
            className="bg-surface border-line shadow-card absolute top-[4%] left-[8%] w-[84%] rounded-[clamp(16px,5.5%,24px)] border p-[2.4%]"
            style={drift}
          >
            <div aria-hidden="true" className="flex items-center gap-1.5 px-[3%] pt-[1%] pb-[3%]">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--primary)' }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--primary-2)' }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--faint)', opacity: 0.6 }} />
              <span className="text-faint ml-3 font-mono text-[11px]">indra.tsx</span>
            </div>
            <div className="bg-surface-2 aspect-[1/0.92] overflow-hidden rounded-[clamp(11px,4%,16px)]">
              <Image
                src="/profile.webp"
                alt="Indra Kusuma"
                width={800}
                height={800}
                // The homepage's LCP element. `priority` is deprecated in Next
                // 16, and it never set fetchPriority anyway — the two are
                // separate props, so the preload it emitted went out at default
                // priority and PageSpeed flagged exactly that. The <img> is
                // already discoverable in the initial HTML, so these two
                // attributes are all it needs; the docs say to prefer them over
                // `preload` precisely when the image is not hidden from the
                // parser.
                loading="eager"
                fetchPriority="high"
                className="h-full w-full object-cover object-[50%_20%]"
              />
            </div>
          </div>

          {/* Code card: the roles, typed out in turn. */}
          <HeroCodeCard
            className={`${floatCard} bottom-[3%] left-[-5%] rounded-[14px] px-3 py-2 font-mono text-[9.5px] leading-[1.65] sm:bottom-[2%] sm:left-[-6%] sm:rounded-[16px] sm:px-4 sm:py-3 sm:text-[12.5px] sm:leading-[1.7]`}
            style={driftLate}
          />

          {/* The AI tools I build with, taking turns in the chip — see .ik-ai-cycle. */}
          <div
            aria-hidden="true"
            className={`${floatCard} top-[-3%] right-[-1%] h-10 w-10 rounded-[12px] sm:top-[-5%] sm:right-[-3%] sm:h-12 sm:w-12 sm:rounded-[14px]`}
            style={driftLate}
          >
            {AI_TOOLS.map((tool) => (
              <Image
                key={tool}
                src={`/logos/ai/${tool}.svg`}
                alt=""
                width={24}
                height={24}
                className="ik-ai-cycle absolute inset-0 m-auto h-[54%] w-[54%]"
              />
            ))}
          </div>

          {/* Years badge. Phones leave it out: at that width it can only sit on
              top of the code card or the face. */}
          <div
            className={`${floatCard} right-[-4%] bottom-[16%] hidden items-center gap-2 rounded-full px-3.5 py-2 sm:flex`}
            style={drift}
          >
            <span
              aria-hidden="true"
              className="grid h-5 w-5 place-items-center rounded-full"
              style={{ background: 'var(--primary-2)' }}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6.2l2.2 2.2 4.8-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-ink text-[12.5px] font-semibold whitespace-nowrap">
              {YEARS_EXPERIENCE}+ yrs shipping
            </span>
          </div>
        </Reveal>
      </div>
    </header>
  );
}
