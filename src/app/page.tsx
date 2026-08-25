import About from '@/components/About';
import AuroraBackground from '@/components/AuroraBackground';
import Awards from '@/components/Awards';
import Contact from '@/components/Contact';
import Experience from '@/components/Experience';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import SiteChrome from '@/components/SiteChrome';
import Skills from '@/components/Skills';

export default function Home() {
  return (
    <>
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
