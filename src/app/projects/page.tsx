import type { Metadata } from 'next';
import ProjectsIndex from '@/components/ProjectsIndex';
import { SITE } from '@/lib/site-data';

export const metadata: Metadata = {
  title: `Projects — ${SITE.name}`,
  description: 'Things built on the side — live, and yours to open and try.',
  alternates: { canonical: '/projects' },
};

export default function Projects() {
  return <ProjectsIndex />;
}
