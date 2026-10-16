import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectsIndex from '@/components/ProjectsIndex';
import { findProject, PROJECTS, SITE } from '@/lib/site-data';

type ProjectPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = findProject((await params).slug);
  if (!project) return {};
  // The JPEG copy beside the WebP: WhatsApp will not show a WebP preview.
  const image = project.image.replace(/\.webp$/, '.jpg');
  return {
    title: `${project.name} — Projects — ${SITE.name}`,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.name,
      description: project.description,
      url: `${SITE.url}/projects/${project.slug}/`,
      siteName: SITE.name,
      images: [{ url: image, width: 1200, height: 630, alt: project.name }],
    },
    // In full, as on /projects: otherwise it inherits the homepage's card.
    twitter: {
      card: 'summary_large_image',
      creator: '@idindrakusuma',
      title: project.name,
      description: project.description,
      images: [image],
    },
  };
}

/**
 * A Project's own address: the projects index with its detail already open.
 * From the grid the same detail opens in place instead (see ProjectGallery);
 * this is what a shared link, a new tab or a reload lands on.
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  if (!findProject(slug)) notFound();
  return <ProjectsIndex openSlug={slug} />;
}
