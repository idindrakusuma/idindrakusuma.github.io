import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import BlogBackdrop from '@/components/BlogBackdrop';
import BlogChrome from '@/components/BlogChrome';
import CategoryFilter from '@/components/CategoryFilter';
import PostCard from '@/components/PostCard';
import Reveal from '@/components/Reveal';
import { CATEGORIES, getPosts } from '@/lib/posts';
import { SITE } from '@/lib/site-data';

export const metadata: Metadata = {
  title: `Blog — ${SITE.name}`,
  description:
    'Tutorials, engineering notes and a few career stories — written mostly in Bahasa Indonesia.',
  alternates: { canonical: '/blog' },
};

/**
 * The blog index: every post, newest first, filterable by category.
 *
 * Carries its own chrome rather than SiteChrome — see BlogChrome. The whole
 * archive is rendered into the static HTML and the filter hides cards in place,
 * so nothing here depends on JavaScript to be readable.
 */
export default async function BlogIndex() {
  const posts = await getPosts();
  const used = CATEGORIES.filter((category) => posts.some((post) => post.category === category));

  return (
    <>
      <BlogBackdrop />
      <div className="relative z-1">
        <BlogChrome back={{ href: '/', label: 'Back to site' }} trailing={{ label: 'Writing' }} />

        <header className="mx-auto max-w-[1080px] px-6 pt-[132px] pb-[22px]">
          <Reveal as="p" className="font-mono text-primary m-0 mb-3.5 text-[13px]">
            {`Blog · ${posts.length} posts`}
          </Reveal>

          <Reveal
            as="h1"
            className="font-display m-0 mb-[18px] text-[clamp(38px,6.5vw,68px)] leading-[1.03] font-bold tracking-[-.03em]"
          >
            Notes on building
            <br />
            <span className="ik-gradient-wide">for the web.</span>
          </Reveal>

          <Reveal as="p" className="text-muted m-0 max-w-[600px] text-[clamp(16px,2.2vw,18px)]">
            Tutorials, engineering notes and a few career stories — written mostly in Bahasa
            Indonesia over the years at{' '}
            <Link href="/" className="text-primary font-semibold no-underline">
              indrakusuma.web.id
            </Link>
            .
          </Reveal>
        </header>

        <div className="mx-auto max-w-[1080px] px-6 pt-[18px] pb-1.5">
          <Reveal>
            <CategoryFilter categories={used} />
          </Reveal>
        </div>

        <main className="ik-blog-main mx-auto grid max-w-[1080px] grid-cols-[1fr_260px] items-start gap-10 px-6 pt-[26px] pb-10">
          <div className="flex min-w-0 flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>

          <aside className="ik-side bg-surface border-line shadow-card-sm sticky top-[88px] flex flex-col items-center gap-3.5 rounded-[20px] border px-5 py-[26px] text-center">
            <span
              className="h-[76px] w-[76px] flex-none rounded-full p-[3px]"
              style={{ background: 'linear-gradient(135deg,var(--a1),var(--a3))' }}
            >
              <Image
                src="/profile-avatar.webp"
                alt={SITE.name}
                width={152}
                height={152}
                className="h-full w-full rounded-full object-cover"
              />
            </span>

            <span className="flex flex-col gap-[3px]">
              <span className="font-display text-ink text-base font-semibold">{SITE.name}</span>
              <span className="text-muted text-[12.5px]">{SITE.role}</span>
            </span>

            <p className="text-muted m-0 text-[12.5px] leading-[1.55]">
              Building fast, scalable web experiences — currently at ByteDance, previously
              Tokopedia.
            </p>

            <Link
              href="/"
              className="bg-primary w-full rounded-[11px] py-[11px] text-center text-[13.5px] font-semibold text-white no-underline"
            >
              View profile
            </Link>
          </aside>
        </main>

        <footer className="border-line text-faint mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-3 border-t px-6 py-6 text-[13px]">
          <span>
            © {new Date().getFullYear()} {SITE.name}
          </span>
          <Link href="/" className="text-primary font-semibold no-underline">
            Back to site →
          </Link>
        </footer>
      </div>
    </>
  );
}
