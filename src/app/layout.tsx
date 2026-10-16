import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import DeferredAnalytics from '@/components/DeferredAnalytics';
import { SITE } from '@/lib/site-data';
import { THEME_SCRIPT } from '@/lib/theme';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  // 800 is loaded by nobody — `font-extrabold` appears nowhere in src/.
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: `${SITE.name} — ${SITE.role}`,
  description: SITE.description,
  authors: [{ name: SITE.name, url: SITE.url }],
  keywords: [
    'Indra Kusuma',
    'Fullstack Engineer',
    'Frontend Engineer',
    'Web Performance',
    'React',
    'Next.js',
    'Go',
    'ByteDance',
    'Tokopedia',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.role}`,
    description: SITE.description,
    // Drawn by scripts/generate-og-images.mjs. Routes that set their own
    // (/blog, /projects, every post) replace it; any other inherits it.
    images: [{ url: '/og/home.jpg', width: 1200, height: 630, alt: `${SITE.name} — ${SITE.role}` }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@idindrakusuma',
    title: `${SITE.name} — ${SITE.role}`,
    description: SITE.description,
    images: [{ url: '/og/home.jpg', alt: `${SITE.name} — ${SITE.role}` }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#e9eef7' },
    { media: '(prefers-color-scheme: dark)', color: '#05070e' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      // globals.css sets `scroll-behavior: smooth` for in-page anchors. Next 16
      // stopped suspending that during route changes, which would make a
      // homepage-to-blog navigation smooth-scroll the whole document instead of
      // landing at the top. This opts back into the old suspend-and-restore.
      data-scroll-behavior="smooth"
      className={`${jakarta.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {/* Without JS the reveal animations never fire, so keep everything visible. */}
        <noscript>
          <style>{`.ik-reveal{opacity:1!important}`}</style>
        </noscript>
      </head>
      <body>
        {children}
        <DeferredAnalytics gaId="G-BTNT9P4VS1" />
      </body>
    </html>
  );
}
