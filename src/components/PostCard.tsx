import Image from 'next/image';
import Link from 'next/link';
import { formatDate, type Post } from '@/lib/posts';

/**
 * One post in the blog index: thumbnail, meta line, title, excerpt.
 *
 * The whole card is the link. Its hover — the lift, the border, the title
 * colour, the slow push-in on the thumbnail — is one `:hover` in globals.css
 * rather than four handlers here.
 *
 * The first card's thumbnail is the index's Largest Contentful Paint, so it gets
 * `priority`; lazy-loading the one image the page is measured on only delays it.
 */
export default function PostCard({ post, priority = false }: { post: Post; priority?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      data-post-cat={post.category}
      className="ik-post bg-surface border-line shadow-card-sm text-ink flex gap-[18px] overflow-hidden rounded-[18px] border p-3.5 no-underline"
    >
      {/* A draft may not have a thumbnail yet; the slot's own background is the
          empty state, which is why the design gave it one. */}
      <span className="ik-thumb bg-surface-3 block aspect-16/11 w-[280px] flex-none overflow-hidden rounded-[13px]">
        {post.thumbnail && (
          <Image
            src={post.thumbnail}
            alt=""
            width={560}
            height={385}
            priority={priority}
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

        <h3 className="font-display text-ink m-0 text-[16.5px] leading-[1.3] font-semibold tracking-[-.01em] transition-colors">
          {post.title}
        </h3>

        <span className="ik-hide-sm ik-post-excerpt text-muted text-[13.5px] leading-[1.5]">
          {post.excerpt}
        </span>
      </span>
    </Link>
  );
}
