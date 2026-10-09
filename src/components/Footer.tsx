import Link from 'next/link';
import { SITE } from '@/lib/site-data';

/**
 * The one footer, on every route.
 *
 * It is the way into the routes from anywhere — the nav island scrolls on a
 * phone and hides whatever sits past its edge, and Route Chrome only ever
 * points back. So Blog and Projects are linked here, where every page ends.
 */
export default function Footer() {
  return (
    <footer className="ik-footer border-line text-faint mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-3 border-t px-6 pt-6 pb-24 text-[13px]">
      {/* Mobile only — hidden by .ik-footer-mark until the footer stacks. */}
      <span aria-hidden="true" className="ik-mark ik-footer-mark" />
      <span>
        © {new Date().getFullYear()} {SITE.name}
      </span>
      <nav aria-label="Footer" className="flex gap-5">
        <Link href="/blog" className="text-muted hover:text-primary font-semibold no-underline transition-colors">
          Blog
        </Link>
        <Link href="/projects" className="text-muted hover:text-primary font-semibold no-underline transition-colors">
          Projects
        </Link>
      </nav>
      <span className="font-mono text-xs">Made with ❤️ in Jakarta</span>
    </footer>
  );
}
