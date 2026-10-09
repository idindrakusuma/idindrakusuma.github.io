'use client';

import { startTransition, useCallback, useEffect, useState, type MouseEvent } from 'react';
import { findProject, type Project } from '@/lib/site-data';
import ProjectCard from './ProjectCard';
import ProjectDetail from './ProjectDetail';
import Reveal from './Reveal';

/** The slug in `/projects/{slug}/`, or null on the index itself. */
function slugIn(pathname: string): string | null {
  return pathname.match(/^\/projects\/([^/]+)\/?$/)?.[1] ?? null;
}

/**
 * The Project cards, and the detail modal over them.
 *
 * A Project's detail is a real page — `/projects/{slug}` is exported and opens
 * with the modal already up — but from the grid it opens in place: the URL
 * changes with `history.pushState`, which the App Router syncs with, and the
 * swap runs inside a transition so React's <ViewTransition> animates it. The
 * static export cannot use intercepting routes, which is the usual way to
 * build this, so the URL is driven by hand.
 *
 * Back and forward land here as `popstate`, read straight from the URL —
 * which is also how every way of closing a detail opened from the grid ends.
 */
export default function ProjectGallery({
  projects,
  initialSlug = null,
}: {
  projects: Project[];
  initialSlug?: string | null;
}) {
  const [openSlug, setOpenSlug] = useState<string | null>(initialSlug);
  const project = openSlug ? findProject(openSlug) : undefined;

  useEffect(() => {
    // Deferred a task: React flushes updates made during `popstate`
    // synchronously, so the browser can restore scroll, and a synchronous
    // update gets no view transition — closing would just cut.
    const onPop = () =>
      setTimeout(() => startTransition(() => setOpenSlug(slugIn(window.location.pathname))));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const open = (slug: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    // A modified click means a new tab or window: let the link go there.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    startTransition(() => {
      setOpenSlug(slug);
      window.history.pushState({ ikProject: true }, '', `/projects/${slug}/`);
    });
  };

  const close = useCallback(() => {
    // Opened from the grid: step back to the entry it came from, so Back
    // afterwards leaves /projects rather than reopening the modal.
    if ((window.history.state as { ikProject?: boolean } | null)?.ikProject) {
      window.history.back();
      return;
    }
    startTransition(() => {
      setOpenSlug(null);
      window.history.pushState(null, '', '/projects/');
    });
  }, []);

  return (
    <>
      {projects.map((item) => (
        <Reveal key={item.slug}>
          <ProjectCard project={item} open={item.slug === openSlug} onOpen={open(item.slug)} />
        </Reveal>
      ))}
      {project && <ProjectDetail project={project} onClose={close} />}
    </>
  );
}
