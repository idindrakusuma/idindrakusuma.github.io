import Link from 'next/link';
import { cardImage, formatDate, type Post } from '@/lib/posts';

/**
 * One post in the blog index: thumbnail, meta line, title, excerpt.
 *
 * The whole card is the link. Its hover — the lift, the border, the title
 * colour, the slow push-in on the thumbnail — is one `:hover` in globals.css
 * rather than four handlers here.
 *
 * The first card's thumbnail can be the index's Largest Contentful Paint, so it
 * is fetched eagerly and at high priority; lazy-loading the one image the page
 * is measured on only delays it.
 *
 * A plain <img> rather than next/image: the static export turns the image
 * optimizer off, and with it next/image's srcset. The card-sized copies come
 * from scripts/prepare-post-images.mjs instead, and `sizes` mirrors the slot's
 * width in globals.css — 120px below 760px, 280px above.
 */
export default function PostCard({ post, lcp = false }: { post: Post; lcp?: boolean }) {
  const image = cardImage(post);
  return (
    <Link
      href={`/blog/${post.slug}`}
      data-post-cat={post.category}
      className="ik-post bg-surface border-line shadow-card-sm text-ink flex gap-[18px] overflow-hidden rounded-[18px] border p-3.5 no-underline"
    >
      {/* A draft may not have a thumbnail yet; the slot's own background is the
          empty state, which is why the design gave it one. */}
      <span className="ik-thumb bg-surface-3 block aspect-16/11 w-[280px] flex-none overflow-hidden rounded-[13px]">
        {image && (
          // oxlint-disable-next-line nextjs/no-img-element -- see the note above
          <img
            src={image.src}
            srcSet={image.srcSet}
            sizes={image.srcSet ? '(max-width: 760px) 120px, 280px' : undefined}
            alt=""
            width={560}
            height={385}
            loading={lcp ? 'eager' : 'lazy'}
            fetchPriority={lcp ? 'high' : undefined}
            decoding="async"
            className="block h-full w-full object-cover"
          />
        )}
      </span>

      <span className="flex min-w-0 flex-1 flex-col justify-center gap-2">
        <span className="font-mono text-faint flex items-center gap-2.5 text-[11.5px]">
          <span className="text-primary tracking-[.04em] uppercase">{post.category}</span>
          <span aria-hidden="true">·</span>
          <span>{formatDate(post.date)}</span>
          <span aria-hidden="true" className="ik-hide-sm">
            ·
          </span>
          <span className="ik-hide-sm">{post.readingMinutes} min read</span>
        </span>

        <h2 className="font-display text-ink m-0 text-[16.5px] leading-[1.3] font-semibold tracking-[-.01em] transition-colors">
          {post.title}
        </h2>

        <span className="ik-hide-sm ik-post-excerpt text-muted text-[13.5px] leading-[1.5]">
          {post.excerpt}
        </span>
      </span>
    </Link>
  );
}
