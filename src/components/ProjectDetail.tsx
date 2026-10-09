'use client';

import { useEffect, useLayoutEffect, useRef, ViewTransition } from 'react';
import type { Project } from '@/lib/site-data';
import { ProjectShot } from './ProjectCard';

/**
 * A Project's detail, as a modal over /projects: what it is, why it exists,
 * when it began, what it is made of and with, and where it lives.
 *
 * The image carries the same ViewTransition name as the card's, so opening
 * morphs one into the other; the rest of the dialog rises in and sinks out on
 * its own enter and exit classes (globals.css, `.ik-modal`).
 *
 * A native <dialog> opened with showModal(), so the browser traps focus,
 * makes the page underneath inert and turns Escape into `cancel`. Escape, the
 * close button and a click on the backdrop all close it. The page underneath
 * stops scrolling while it is up — a `:has()` rule in globals.css, which lifts
 * the moment the dialog leaves the DOM rather than when effects clean up.
 */
export default function ProjectDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // A layout effect, not a passive one: React takes the view transition's
  // "after" snapshot once layout effects have run, and a dialog still closed
  // then is display:none — no morph and no rise, just the card's image fading.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  // The dialog spans the viewport, so a click landing on it rather than on the
  // panel inside is a click on the backdrop. Pointer-only by nature — Escape
  // and the close button are the keyboard's ways out — so it is bound here
  // rather than as an onClick the a11y lint would rightly ask a key handler of.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClick = (event: MouseEvent) => {
      if (event.target === dialog) onClose();
    };
    dialog.addEventListener('click', onClick);
    return () => dialog.removeEventListener('click', onClick);
  }, [onClose]);

  const created = new Date(project.created).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return (
    <ViewTransition enter="ik-modal-in" exit="ik-modal-out" default="none">
      <dialog
        ref={dialogRef}
        aria-labelledby="ik-project-title"
        onCancel={(event) => {
          event.preventDefault();
          onClose();
        }}
        className="ik-modal fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-0 px-4 py-6 backdrop-blur-[10px] sm:py-14"
        style={{ background: 'color-mix(in srgb, var(--bg) 72%, transparent)' }}
      >
        <div className="bg-surface border-line shadow-card relative mx-auto max-w-[720px] rounded-[22px] border p-4 sm:p-5">
          <button
            type="button"
            autoFocus
            // A transition group of its own, layered above the morphing image
            // (globals.css), which would otherwise cover it until the end. Set
            // in CSS rather than as a <ViewTransition>: React only activates
            // the outermost one in a subtree that is entering.
            style={{ viewTransitionName: 'ik-project-close' }}
            onClick={onClose}
            aria-label="Close"
            className="border-line bg-surface text-ink hover:border-primary absolute top-7 right-7 z-1 grid h-9 w-9 cursor-pointer place-items-center rounded-full border transition-colors sm:top-8 sm:right-8"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <div className="bg-surface-3 aspect-1200/630 overflow-hidden rounded-[15px]">
            <ViewTransition name={`project-${project.slug}`} share="ik-morph" default="none">
              <ProjectShot project={project} />
            </ViewTransition>
          </div>

          <div className="px-2 pt-6 pb-3 sm:px-4">
            <p className="font-mono text-primary m-0 mb-2.5 text-[12.5px]">
              Project · since <time dateTime={project.created}>{created}</time>
            </p>
            <h2
              id="ik-project-title"
              className="font-display text-ink m-0 mb-3 text-[clamp(26px,4vw,34px)] leading-[1.1] font-bold tracking-[-.02em]"
            >
              {project.name}
            </h2>
            <p className="text-ink m-0 text-[16px] leading-[1.6]">{project.description}</p>

            <h3 className="font-mono text-faint m-0 mt-7 mb-2.5 text-[12px] font-medium tracking-[.06em] uppercase">
              Why it exists
            </h3>
            {project.background.map((paragraph) => (
              <p key={paragraph} className="text-muted m-0 mb-3 text-[15px] leading-[1.65]">
                {paragraph}
              </p>
            ))}

            <Chips title="Tech stack" items={project.stack} />
            <Chips title="Tools" items={project.tools} />

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={project.href}
                target="_blank"
                rel="noopener"
                className="ik-btn-primary rounded-[13px] px-[22px] py-3 text-[15px] font-semibold text-white no-underline"
              >
                Open project ↗
              </a>
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener"
                  className="ik-btn-secondary bg-surface text-ink border-line hover:border-primary rounded-[13px] border px-[22px] py-3 text-[15px] font-semibold no-underline transition-colors"
                >
                  GitHub repo ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </dialog>
    </ViewTransition>
  );
}

/** A labelled row of chips, in the Capability card's style. */
function Chips({ title, items }: { title: string; items: string[] }) {
  return (
    <>
      <h3 className="font-mono text-faint m-0 mt-6 mb-2.5 text-[12px] font-medium tracking-[.06em] uppercase">{title}</h3>
      <div className="flex flex-wrap gap-[7px]">
        {items.map((item) => (
          <span
            key={item}
            className="font-mono text-ink bg-surface-2 border-line rounded-lg border px-2.5 py-[5px] text-[11.5px] font-medium"
          >
            {item}
          </span>
        ))}
      </div>
    </>
  );
}
