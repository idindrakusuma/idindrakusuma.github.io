import About from '@/components/About';
import AuroraBackground from '@/components/AuroraBackground';
import Awards from '@/components/Awards';
import Contact from '@/components/Contact';
import Experience from '@/components/Experience';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import SiteChrome from '@/components/SiteChrome';
import Skills from '@/components/Skills';
import { SITE, SOCIALS } from '@/lib/site-data';

/**
 * Structured data for search engines: who the site is about, and that this is
 * their site. It is what lets Google tie a search for the name to this page
 * and to the profiles in `sameAs`, rather than guessing from the text.
 */
const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE.url}/#person`,
      name: SITE.name,
      url: `${SITE.url}/`,
      image: `${SITE.url}/profile.jpg`,
      jobTitle: 'Fullstack Engineer',
      description: SITE.description,
      email: `mailto:${SITE.email}`,
      worksFor: { '@type': 'Organization', name: 'ByteDance' },
      address: { '@type': 'PostalAddress', addressLocality: 'Jakarta', addressCountry: 'ID' },
      sameAs: SOCIALS.filter((s) => s.href.startsWith('https://')).map((s) => s.href),
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      name: SITE.name,
      url: `${SITE.url}/`,
      author: { '@id': `${SITE.url}/#person` },
      inLanguage: 'en',
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // `<` is escaped so no string in the data can close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA).replace(/</g, '\\u003c') }}
      />
      <AuroraBackground />
      <div className="relative z-1">
        <SiteChrome />
        <span id="top" />
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Awards />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
