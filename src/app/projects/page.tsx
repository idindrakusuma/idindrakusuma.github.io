import type { Metadata } from 'next';
import ProjectsIndex from '@/components/ProjectsIndex';
import { SITE } from '@/lib/site-data';

export const metadata: Metadata = {
  title: `Projects — ${SITE.name}`,
  description: 'Things built on the side — live, and yours to open and try.',
  alternates: { canonical: '/projects' },
  // Set in full, not left to the layout: Next merges metadata one top-level
  // key at a time, so a page without its own would show the homepage's card.
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    url: `${SITE.url}/projects/`,
    title: `Projects — ${SITE.name}`,
    description: 'Things built on the side — live, and yours to open and try.',
    images: [{ url: '/og/projects.jpg', width: 1200, height: 630, alt: `Projects — ${SITE.name}` }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@idindrakusuma',
    title: `Projects — ${SITE.name}`,
    description: 'Things built on the side — live, and yours to open and try.',
    images: [{ url: '/og/projects.jpg', alt: `Projects — ${SITE.name}` }],
  },
};

export default function Projects() {
  return <ProjectsIndex />;
}
