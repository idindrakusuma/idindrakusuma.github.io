import Link from 'next/link';
import { cardImage, type Post } from '@/lib/posts';
import type { CaseStudy } from '@/lib/site-data';

/**
 * One Case Study on /projects: the Post's thumbnail, where the work was done,
 * the headline number before and after, and one line on what changed. The
 * whole card links to the Post that tells it.
 *
 * The thumbnail is the Post's card-sized copy, as on the blog index; the slot
 * here is the full card width, up to about half the 1120px column.
 *
 * The hover is the post card's, shared in globals.css.
 */
export default function CaseStudyCard({ study, post }: { study: CaseStudy; post: Post }) {
  const image = cardImage(post);
  const year = new Date(post.date).getFullYear();
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="ik-project bg-surface border-line shadow-card-sm text-ink flex flex-col gap-4 overflow-hidden rounded-[18px] border p-3.5 no-underline"
    >
      <span className="ik-project-shot bg-surface-3 block aspect-16/11 overflow-hidden rounded-[13px]">
        {image && (
          // oxlint-disable-next-line nextjs/no-img-element -- static export, see PostCard
          <img
            src={image.src}
            srcSet={image.srcSet}
            sizes={image.srcSet ? '(max-width: 760px) 100vw, 540px' : undefined}
            alt=""
            width={560}
            height={385}
            loading="lazy"
            decoding="async"
            className="block h-full w-full object-cover"
          />
        )}
      </span>

      <span className="flex flex-col gap-2 px-1.5 pb-1.5">
        <span className="font-mono text-faint flex items-center gap-2.5 text-[11.5px]">
          <span className="text-primary tracking-[.04em] uppercase">{study.org}</span>
          <span aria-hidden="true">·</span>
          <span>{year}</span>
        </span>

        <span className="font-display text-ink text-[19px] leading-[1.3] font-semibold tracking-[-.01em]">
          {study.name}
        </span>

        <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span className="font-display text-[26px] leading-[1.2] font-bold tracking-[-.02em]">
            <span className="text-faint line-through decoration-2">{study.result.before}</span>
            <span aria-hidden="true" className="text-faint px-2">
              →
            </span>
            <span className="ik-gradient-wide">{study.result.after}</span>
          </span>
          <span className="font-mono text-muted text-[12.5px]">{study.result.metric}</span>
        </span>

        <span className="text-muted text-[14px] leading-[1.55]">{study.description}</span>
        <span className="font-mono text-primary mt-1 text-[12.5px]">Read the case study →</span>
      </span>
    </Link>
  );
}
