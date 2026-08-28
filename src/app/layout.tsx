import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { SITE } from '@/lib/site-data';
import { THEME_SCRIPT } from '@/lib/theme';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
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
    images: [{ url: '/profile.jpg', width: 800, height: 800, alt: SITE.name }],
  },
  twitter: {
    card: 'summary',
    creator: '@idindrakusuma',
    title: `${SITE.name} — ${SITE.role}`,
    description: SITE.description,
    images: ['/profile.jpg'],
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
        <GoogleAnalytics gaId="G-BTNT9P4VS1" />
      </body>
    </html>
  );
}
