import type { Project } from '@/lib/site-data';

/**
 * One Project on /projects: its own social card, name, one line, and where it
 * lives. The whole card is the link, and it leaves the site — a Project is
 * live somewhere else — so it opens in a new tab and says so with the arrow.
 *
 * The hover is the post card's, shared in globals.css.
 */
export default function ProjectCard({ project }: { project: Project }) {
  const host = new URL(project.href).host;
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener"
      className="ik-project bg-surface border-line shadow-card-sm text-ink flex flex-col gap-4 overflow-hidden rounded-[18px] border p-3.5 no-underline"
    >
      <span className="ik-project-shot bg-surface-3 block aspect-1200/630 overflow-hidden rounded-[13px]">
        {/* oxlint-disable-next-line nextjs/no-img-element -- static export, see PostCard */}
        <img
          src={project.image}
          alt=""
          width={1200}
          height={630}
          decoding="async"
          className="block h-full w-full object-cover"
        />
      </span>

      <span className="flex flex-col gap-2 px-1.5 pb-1.5">
        <span className="font-display text-ink text-[19px] leading-[1.3] font-semibold tracking-[-.01em]">
          {project.name}
        </span>
        <span className="text-muted text-[14px] leading-[1.55]">{project.description}</span>
        <span className="font-mono text-primary mt-1 text-[12.5px]">{host} ↗</span>
      </span>
    </a>
  );
}
