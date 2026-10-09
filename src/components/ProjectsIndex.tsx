import BlogBackdrop from '@/components/BlogBackdrop';
import BlogChrome from '@/components/BlogChrome';
import Footer from '@/components/Footer';
import ProjectGallery from '@/components/ProjectGallery';
import ProjectsIllustration from '@/components/ProjectsIllustration';
import Reveal from '@/components/Reveal';
import { PROJECTS } from '@/lib/site-data';

/**
 * Every Project, each opening its detail as a modal.
 *
 * A route rather than a Section, like the blog: Projects sit outside the
 * homepage's numbered sequence, so adding one never renumbers anything. Both
 * /projects and /projects/{slug} render this; the second starts with that
 * Project's detail open.
 */
export default function ProjectsIndex({ openSlug = null }: { openSlug?: string | null }) {
  return (
    <>
      <BlogBackdrop />
      <div className="relative z-1">
        <BlogChrome back={{ href: '/', label: 'Back to site' }} trailing="Projects" />

        <header className="mx-auto flex max-w-[1120px] items-center justify-between gap-10 px-6 pt-[132px] pb-[22px]">
          <div className="min-w-0">
            <Reveal immediate as="p" className="font-mono text-primary m-0 mb-3.5 text-[13px]">
              {`Projects · ${PROJECTS.length}`}
            </Reveal>

            <Reveal
              immediate
              as="h1"
              className="font-display m-0 mb-[18px] text-[clamp(38px,6.5vw,68px)] leading-[1.03] font-bold tracking-[-.03em]"
            >
              Built on
              <br />
              <span className="ik-gradient-wide">the side.</span>
            </Reveal>

            <Reveal immediate as="p" className="text-muted m-0 max-w-[600px] text-[clamp(16px,2.2vw,18px)]">
              Small things I make outside work — all live, all yours to open and try.
            </Reveal>
          </div>

          {/* Hidden below 860px, where the heading needs the full width. */}
          <Reveal immediate delay={120} className="ik-blog-art flex-none">
            <ProjectsIllustration />
          </Reveal>
        </header>

        <main className="mx-auto grid max-w-[1120px] grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-5 px-6 pt-[26px] pb-10">
          <ProjectGallery projects={PROJECTS} initialSlug={openSlug} />
        </main>

        <Footer />
      </div>
    </>
  );
}
