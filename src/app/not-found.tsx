import type { Metadata } from 'next';
import Link from 'next/link';
import AuroraBackground from '@/components/AuroraBackground';
import { SITE } from '@/lib/site-data';

export const metadata: Metadata = {
  title: `Page not found — ${SITE.name}`,
  description: 'That page does not exist, was moved, or the link is broken.',
  // The route is a catch-all for broken links, so it must not claim the home canonical it
  // would otherwise inherit from the root layout. No `robots` here — Next already emits
  // `noindex` for not-found, and repeating it only duplicates the tag.
  alternates: { canonical: null },
};

/**
 * Ported from the Claude Design artboard (design/project/404.dc.html), the same source
 * the homepage was built from. Everything the artboard declared in its <helmet> — fonts,
 * the pre-paint theme script, the token block, the keyframes — already lives in
 * layout.tsx and globals.css, so only the body of the artboard is reproduced here.
 *
 * `output: 'export'` renders this to out/404.html, which GitHub Pages serves for every
 * path it cannot resolve.
 */
export default function NotFound() {
  return (
    <>
      <AuroraBackground />
      <div className="relative z-1 flex min-h-screen flex-col">
        <main className="flex flex-1 flex-col items-center justify-center gap-7 px-6 py-10 text-center">
          {/* The float lives on a wrapper rather than the numeral: the numeral's own
              animation slot is taken by the gradient shine in .ik-gradient-shine. */}
          <div style={{ animation: 'ik-float 5s ease-in-out infinite' }}>
            <h1 className="ik-gradient-shine font-display m-0 text-[clamp(96px,22vw,220px)] leading-none font-bold tracking-[-.04em]">
              404
            </h1>
          </div>

          <div className="flex max-w-[460px] flex-col gap-2.5">
            <h2 className="font-display m-0 text-[clamp(22px,3.4vw,28px)] font-semibold tracking-[-.02em]">
              This page went missing.
            </h2>
            <p className="text-muted m-0 text-base">
              The page you’re looking for doesn’t exist, was moved, or the link is broken.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-[13px]">
            <Link
              href="/"
              className="ik-btn-primary inline-flex items-center gap-[9px] rounded-[13px] px-[26px] py-3.5 text-[15px] font-semibold text-white no-underline transition-[translate,box-shadow] hover:-translate-y-[3px]"
            >
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" />
              </svg>
              <span>Back to homepage</span>
            </Link>
          </div>
        </main>

        <footer className="text-faint px-6 py-6 text-center text-[13px]">
          © {new Date().getFullYear()} {SITE.name}
        </footer>
      </div>
    </>
  );
}
