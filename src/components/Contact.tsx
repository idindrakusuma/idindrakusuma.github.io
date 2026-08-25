import { SOCIALS } from '@/lib/site-data';
import Reveal from './Reveal';

const ICONS: Record<string, React.ReactNode> = {
  Email: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3 6 9 6 9-6" />
    </svg>
  ),
  LinkedIn: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.25 8h4.5V23H.25V8zm7.5 0h4.31v2.05h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V23h-4.5v-6.6c0-1.57-.03-3.6-2.19-3.6-2.2 0-2.54 1.71-2.54 3.48V23h-4.5V8z" />
    </svg>
  ),
  X: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  GitHub: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58l-.01-2.05c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.92.43.37.81 1.1.81 2.22l-.01 3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
    </svg>
  ),
};

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-[1160px] px-6 pt-[70px] pb-10">
      <Reveal className="border-line-2 bg-surface shadow-card relative overflow-hidden rounded-[26px] border p-[clamp(32px,6vw,64px)]">
        {/* Slow gradient sheen drifting across the card. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            background: 'linear-gradient(120deg,var(--a1),var(--a3))',
            backgroundSize: '200% 200%',
            animation: 'ik-drift 12s ease-in-out infinite',
          }}
        />

        <div className="relative max-w-[640px]">
          <span className="font-mono text-primary text-[13px]">05 — Contact</span>
          <h2 className="font-display mt-3.5 mb-4 text-[clamp(30px,5vw,48px)] leading-[1.05] font-bold tracking-[-.02em]">
            Let&apos;s build something
            <br />
            great together.
          </h2>
          <p className="text-muted mb-[30px] text-[17px]">
            Open to conversations about fullstack engineering, frontend performance, and AI-native product
            work.
          </p>

          <div className="flex flex-wrap gap-3.5">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                {...(social.href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {})}
                aria-label={social.label}
                title={social.title}
                className="ik-social bg-surface-2 text-ink border-line hover:border-primary hover:bg-primary grid h-14 w-14 place-items-center rounded-2xl border no-underline transition-[transform,border-color,color,background,box-shadow] duration-200 hover:-translate-y-1 hover:text-white"
              >
                {ICONS[social.label]}
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
