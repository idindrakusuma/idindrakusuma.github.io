import { SITE } from '@/lib/site-data';
import LogoMark from './LogoMark';

export default function Footer() {
  return (
    <footer className="ik-footer border-line text-faint mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-3 border-t px-6 pt-6 pb-24 text-[13px]">
      {/* Mobile only — hidden by .ik-footer-mark until the footer stacks. */}
      <LogoMark className="ik-footer-mark" />
      <span>
        © {new Date().getFullYear()} {SITE.name}
      </span>
      <span className="font-mono text-xs">Made with ❤️ in Jakarta</span>
    </footer>
  );
}
