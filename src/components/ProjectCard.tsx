import type { MouseEvent } from 'react';
import { ViewTransition } from 'react';
import type { Project } from '@/lib/site-data';

/** How many stack chips a card shows before folding the rest into "+n". */
const MAX_CHIPS = 6;

/**
 * One Project on /projects: its own social card, when it began, its name, one
 * line, the stack behind it, and two ways in — the live product, or its detail.
 *
 * The detail at /projects/{slug} opens as a modal in place, from both the image
 * and the Details button; each is a plain href underneath, so a new tab or no
 * JavaScript still lands on the detail page. The card itself is not a link, as
 * it holds two.
 *
 * While its detail is open the card hands its image over: the named
 * ViewTransition unmounts here and mounts in the modal, which is what makes the
 * image travel between the two. The empty slot keeps the column still.
 *
 * The hover is the post card's, shared in globals.css. Below 768px the buttons
 * drop under the text instead of sitting beside it.
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
  const detail = `/projects/${project.slug}/`;
  const since = new Date(project.created).toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const chips = project.stack.length > MAX_CHIPS ? project.stack.slice(0, MAX_CHIPS - 1) : project.stack;
  const folded = project.stack.length - chips.length;

  return (
    <article className="ik-project bg-surface border-line shadow-card-sm text-ink flex flex-col gap-5 overflow-hidden rounded-[18px] border p-3.5 md:p-4">
      <a
        href={detail}
        onClick={onOpen}
        tabIndex={-1}
        aria-hidden="true"
        className="ik-project-shot bg-surface-3 block aspect-1200/630 overflow-hidden rounded-[13px] md:rounded-[14px]"
      >
        {!open && (
          <ViewTransition name={`project-${project.slug}`} share="ik-morph" default="none">
            <ProjectShot project={project} />
          </ViewTransition>
        )}
      </a>

      <div className="flex flex-col gap-5 px-1.5 pb-1.5 md:grid md:grid-cols-[1fr_auto] md:items-end md:gap-6 md:px-2 md:pb-2">
        <div className="flex min-w-0 flex-col gap-2">
          <p className="font-mono text-faint m-0 text-[11.5px] tracking-[.06em] uppercase">
            Since <time dateTime={project.created}>{since}</time> · Live
          </p>
          <h3 className="font-display m-0 text-[24px] leading-[1.15] font-bold tracking-[-.02em] md:text-[28px]">
            {project.name}
          </h3>
          <p className="text-muted m-0 text-[14.5px] leading-[1.55] md:text-[15px]">{project.description}</p>
          <ul aria-label="Tech stack" className="m-0 mt-1.5 flex list-none flex-wrap gap-[7px] p-0">
            {chips.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
            {folded > 0 && <Chip>{`+${folded}`}</Chip>}
          </ul>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={project.href}
            target="_blank"
            rel="noopener"
            className="ik-btn-primary rounded-[13px] px-5 py-[11px] text-[14.5px] font-semibold text-white no-underline"
          >
            Open project ↗
          </a>
          <a
            href={detail}
            onClick={onOpen}
            className="ik-btn-secondary bg-surface text-ink border-line hover:border-primary rounded-[13px] border px-5 py-[11px] text-[14.5px] font-semibold no-underline transition-colors"
          >
            Details
          </a>
        </div>
      </div>
    </article>
  );
}

function Chip({ children }: { children: string }) {
  return (
    <li className="font-mono text-ink bg-surface-2 border-line rounded-lg border px-2.5 py-[5px] text-[11.5px] font-medium">
      {children}
    </li>
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
