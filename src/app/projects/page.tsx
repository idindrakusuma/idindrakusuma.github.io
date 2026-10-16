import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import ProjectsIndex from '@/components/ProjectsIndex';
import { CASE_STUDIES, PAGES, PROJECTS, SCHEMA_IDS, SITE } from '@/lib/site-data';

export const metadata: Metadata = {
  title: PAGES.projects.title,
  description: PAGES.projects.description,
  alternates: { canonical: '/projects' },
  // Set in full, not left to the layout: Next merges metadata one top-level
  // key at a time, so a page without its own would show the homepage's card.
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    url: `${SITE.url}/projects/`,
    title: PAGES.projects.title,
    description: PAGES.projects.description,
    images: [{ url: '/og/projects.jpg', width: 1200, height: 630, alt: PAGES.projects.title }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@idindrakusuma',
    title: PAGES.projects.title,
    description: PAGES.projects.description,
    images: [{ url: '/og/projects.jpg', alt: PAGES.projects.title }],
  },
};

export default function Projects() {
  // The collection: every Project, then every Case Study, each pointing at
  // where it lives — a Project's detail, a Case Study's Post (ProjectsIndex
  // fails the build if that Post is missing).
  const items = [
    ...PROJECTS.map((project) => ({
      name: project.name,
      description: project.description,
      url: `${SITE.url}/projects/${project.slug}/`,
    })),
    ...CASE_STUDIES.map((study) => ({
      name: study.name,
      description: study.description,
      url: `${SITE.url}/blog/${study.post}/`,
    })),
  ];
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE.url}/projects/#page`,
    name: PAGES.projects.title,
    description: PAGES.projects.description,
    url: `${SITE.url}/projects/`,
    author: { '@id': SCHEMA_IDS.person },
    isPartOf: { '@id': SCHEMA_IDS.website },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, ...item })),
    },
  };

  return (
    <>
      <JsonLd data={structuredData} />
      <ProjectsIndex />
    </>
  );
}
