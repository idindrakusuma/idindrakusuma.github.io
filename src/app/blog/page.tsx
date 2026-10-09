import type { Metadata } from 'next';
import Link from 'next/link';
import BlogBackdrop from '@/components/BlogBackdrop';
import BlogIllustration from '@/components/BlogIllustration';
import BlogChrome from '@/components/BlogChrome';
import CategoryFilter from '@/components/CategoryFilter';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import PopularPosts from '@/components/PopularPosts';
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
        <BlogChrome back={{ href: '/', label: 'Back to site' }} trailing="Blog" />

        <header className="mx-auto flex max-w-[1120px] items-center justify-between gap-10 px-6 pt-[132px] pb-[22px]">
          <div className="min-w-0">
            <Reveal immediate as="p" className="font-mono text-primary m-0 mb-3.5 text-[13px]">
              {`Blog · ${posts.length} posts`}
            </Reveal>

            <Reveal
              immediate
              as="h1"
              className="font-display m-0 mb-[18px] text-[clamp(38px,6.5vw,68px)] leading-[1.03] font-bold tracking-[-.03em]"
            >
              Notes on building
              <br />
              <span className="ik-gradient-wide">for the web.</span>
            </Reveal>

            <Reveal immediate as="p" className="text-muted m-0 max-w-[600px] text-[clamp(16px,2.2vw,18px)]">
              Tutorials, engineering notes and a few career stories — written mostly in Bahasa
              Indonesia over the years at{' '}
              <Link href="/" className="text-primary font-semibold no-underline">
                indrakusuma.dev
              </Link>
              .
            </Reveal>
          </div>

          {/* Hidden below 860px, where the heading needs the full width. Not a
              Reveal: the art flies back here from an article, and a fade on
              its wrapper would dim it again the moment it lands. */}
          <div className="ik-blog-art flex-none">
            <BlogIllustration />
          </div>
        </header>

        <div className="mx-auto max-w-[1120px] px-6 pt-[18px] pb-1.5">
          <Reveal immediate>
            <CategoryFilter categories={used} />
          </Reveal>
        </div>

        <main className="ik-blog-main mx-auto grid max-w-[1120px] grid-cols-[1fr_290px] items-start gap-10 px-6 pt-[26px] pb-10">
          <div className="flex min-w-0 flex-col gap-4">
            {posts.map((post, index) => (
              // The first thumbnail is what the page's LCP is measured on.
              <PostCard key={post.slug} post={post} lcp={index === 0} />
            ))}
          </div>

          <aside className="ik-side sticky top-[88px]">
            <PopularPosts posts={posts.map(({ slug, title }) => ({ slug, title }))} />
          </aside>
        </main>

        <Footer />
      </div>
    </>
  );
}
