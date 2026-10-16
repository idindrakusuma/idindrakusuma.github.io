import BlogBackdrop from '@/components/BlogBackdrop';
import BlogChrome from '@/components/BlogChrome';
import CaseStudyCard from '@/components/CaseStudyCard';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import ProjectGallery from '@/components/ProjectGallery';
import ProjectsFilter from '@/components/ProjectsFilter';
import ProjectsIllustration from '@/components/ProjectsIllustration';
import Reveal from '@/components/Reveal';
import { getPosts } from '@/lib/posts';
import { CASE_STUDIES, PROJECTS, SCHEMA_IDS, SITE } from '@/lib/site-data';

/**
 * Every Project, each opening its detail as a modal, then every Case Study.
 *
 * A route rather than a Section, like the blog: Projects sit outside the
 * homepage's numbered sequence, so adding one never renumbers anything. Both
 * /projects and /projects/{slug} render this; the second starts with that
 * Project's detail open.
 *
 * Case Studies follow, under their own heading: work done inside a company,
 * so not Projects, but the same question — what did you build? — answered
 * with a number and a Post. A Case Study naming a Post that does not exist,
 * or one still a draft, fails the build rather than linking nowhere.
 *
 * From 1024px the page splits: the heading and an index of the two lists stay
 * pinned on the left while the lists scroll on the right. Below that it is one
 * column, and the index gives way to filter pills, as on the blog.
 */
export default async function ProjectsIndex({ openSlug = null }: { openSlug?: string | null }) {
  const posts = await getPosts();
  const studies = CASE_STUDIES.map((study) => {
    const post = posts.find((p) => p.slug === study.post);
    if (!post || post.draft) {
      throw new Error(`Case Study "${study.name}" names the Post "${study.post}", which is missing or a draft`);
    }
    return { study, post };
  });

  const index = [
    { id: 'projects', n: '01', label: 'Projects', heading: 'Projects · on the side', count: PROJECTS.length },
    ...(studies.length > 0
      ? [{ id: 'case-studies', n: '02', label: 'Case studies', heading: 'Case studies · at work', count: studies.length }]
      : []),
  ];
  // Each list's heading carries the same number as its row in the index.
  const heading = (id: string) => {
    const row = index.find((r) => r.id === id)!;
    return `${row.n} — ${row.heading}`;
  };

  // Only on /projects itself: /projects/{slug} renders this same page with a
  // detail open, and is about that one Project rather than the collection.
  const structuredData = openSlug
    ? null
    : {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${SITE.url}/projects/#page`,
        name: `Projects — ${SITE.name}`,
        description: 'Things built on the side — live, and yours to open and try.',
        url: `${SITE.url}/projects/`,
        author: { '@id': SCHEMA_IDS.person },
        isPartOf: { '@id': SCHEMA_IDS.website },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: [
            ...PROJECTS.map((project) => ({ name: project.name, description: project.description, url: `${SITE.url}/projects/${project.slug}/` })),
            ...studies.map(({ study, post }) => ({ name: study.name, description: study.description, url: `${SITE.url}/blog/${post.slug}/` })),
          ].map((item, i) => ({ '@type': 'ListItem', position: i + 1, ...item })),
        },
      };

  return (
    <>
      {structuredData && <JsonLd data={structuredData} />}
      <BlogBackdrop />
      <div className="relative z-1">
        <BlogChrome back={{ href: '/', label: 'Back to site' }} trailing="Projects" />

        <div className="mx-auto max-w-[1120px] px-6 pt-[132px] pb-16 lg:grid lg:grid-cols-[340px_1fr] lg:gap-14">
          <aside className="ik-projects-aside mb-9 lg:mb-0 lg:self-start">
            <Reveal immediate as="p" className="font-mono text-primary m-0 mb-3.5 text-[13px]">
              {studies.length > 0 ? 'Projects & case studies' : 'Projects'}
            </Reveal>

            <Reveal
              immediate
              as="h1"
              className="font-display m-0 mb-[18px] text-[clamp(38px,6.5vw,56px)] leading-[1.03] font-bold tracking-[-.03em]"
            >
              Built on <span className="ik-gradient-wide whitespace-nowrap">the side.</span>
            </Reveal>

            <Reveal immediate as="p" className="text-muted m-0 mb-6 max-w-[600px] text-[16.5px] leading-[1.6] lg:mb-8">
              {studies.length > 0
                ? 'Small things I make outside work — all live, all yours to open and try. And a few write-ups from my professional work, with the numbers.'
                : 'Small things I make outside work — all live, all yours to open and try.'}
            </Reveal>

            <Reveal immediate>
              <ProjectsFilter target="projects-lists" sections={index} />
            </Reveal>

            <Reveal immediate as="nav" aria-label="On this page" className="border-line hidden flex-col border-t lg:flex">
              {index.map((row) => (
                <a
                  key={row.id}
                  href={`#${row.id}`}
                  className="border-line text-ink hover:text-primary flex items-center gap-3 border-b py-3.5 no-underline transition-colors"
                >
                  <span className="font-mono text-faint text-[12px]">{row.n}</span>
                  <span className="text-[15px] font-semibold">{row.label}</span>
                  <span className="font-mono text-faint ml-auto text-[12px]">{row.count}</span>
                </a>
              ))}
            </Reveal>

            {/* Only beside the lists, and only on a screen tall enough to see it
                pinned: in one column it would sit between the heading and the
                first card, and on a short laptop below the fold for good. */}
            <Reveal immediate delay={120} className="ik-projects-art mt-8 opacity-90">
              <ProjectsIllustration className="w-[260px]" />
            </Reveal>
          </aside>

          <main id="projects-lists" className="flex min-w-0 flex-col gap-12">
            <section id="projects" data-projects-section="projects" aria-labelledby="projects-label" className="flex scroll-mt-[110px] flex-col gap-5">
              <SectionLabel id="projects-label">{heading('projects')}</SectionLabel>
              <ProjectGallery projects={PROJECTS} initialSlug={openSlug} />
            </section>

            {studies.length > 0 && (
              <section id="case-studies" data-projects-section="case-studies" aria-labelledby="case-studies-label" className="flex scroll-mt-[110px] flex-col gap-5">
                <SectionLabel id="case-studies-label">{heading('case-studies')}</SectionLabel>
                {studies.map(({ study, post }) => (
                  <Reveal key={study.post}>
                    <CaseStudyCard study={study} post={post} />
                  </Reveal>
                ))}
              </section>
            )}
          </main>
        </div>

        <Footer />
      </div>
    </>
  );
}

function SectionLabel({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="font-mono text-faint m-0 text-[11.5px] font-normal tracking-[.06em] uppercase">
      {children}
    </h2>
  );
}
