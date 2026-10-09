import type { MouseEvent } from 'react';
import { ViewTransition } from 'react';
import type { Project } from '@/lib/site-data';

/**
 * One Project on /projects: its own social card, name, and one line. The whole
 * card is the link to its detail at /projects/{slug}, which the gallery opens
 * as a modal in place — a plain href underneath, so a new tab or no
 * JavaScript still lands on the detail page.
 *
 * While its detail is open the card hands its image over: the named
 * ViewTransition unmounts here and mounts in the modal, which is what makes the
 * image travel between the two. The empty slot keeps the grid still.
 *
 * The hover is the post card's, shared in globals.css.
 */
export default function ProjectCard({
  project,
  open,
  onOpen,
}: {
  project: Project;
  open: boolean;
  onOpen: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a
      href={`/projects/${project.slug}/`}
      onClick={onOpen}
      className="ik-project bg-surface border-line shadow-card-sm text-ink flex flex-col gap-4 overflow-hidden rounded-[18px] border p-3.5 no-underline"
    >
      <span className="ik-project-shot bg-surface-3 block aspect-1200/630 overflow-hidden rounded-[13px]">
        {!open && (
          <ViewTransition name={`project-${project.slug}`} share="ik-morph" default="none">
            <ProjectShot project={project} />
          </ViewTransition>
        )}
      </span>

      <span className="flex flex-col gap-2 px-1.5 pb-1.5">
        <span className="font-display text-ink text-[19px] leading-[1.3] font-semibold tracking-[-.01em]">
          {project.name}
        </span>
        <span className="text-muted text-[14px] leading-[1.55]">{project.description}</span>
        <span className="font-mono text-primary mt-1 text-[12.5px]">View details →</span>
      </span>
    </a>
  );
}

/** The Project's social card, shared by the card and the detail. */
export function ProjectShot({ project }: { project: Project }) {
  return (
    // oxlint-disable-next-line nextjs/no-img-element -- static export, see PostCard
    <img
      src={project.image}
      alt=""
      width={1200}
      height={630}
      decoding="async"
      className="block h-full w-full object-cover"
    />
  );
}
