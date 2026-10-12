import { SITE } from '@/lib/site-data';

/**
 * The one footer, on every route: who, and from where. It carries no links —
 * Projects and Blog are entries in the nav island, which reaches them from the
 * homepage.
 */
export default function Footer() {
  return (
    <footer className="ik-footer border-line text-faint mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-3 border-t px-6 pt-6 pb-24 text-[13px]">
      {/* Mobile only — hidden by .ik-footer-mark until the footer stacks. */}
      <span aria-hidden="true" className="ik-mark ik-footer-mark" />
      <span>
        © {new Date().getFullYear()} {SITE.name}
      </span>
      <span className="font-mono text-xs">Made with ❤️ in Jakarta</span>
    </footer>
  );
}
