import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import BlogBackdrop from '@/components/BlogBackdrop';
import BlogChrome from '@/components/BlogChrome';
import ReadingProgress from '@/components/ReadingProgress';
import ProfileCard from '@/components/ProfileCard';
import Reveal from '@/components/Reveal';
import { mdxComponents } from '@/components/mdx-components';
import { formatDate, getNextPost, getPost, getPostBody, getPosts, summarise } from '@/lib/posts';
import { SITE } from '@/lib/site-data';

type PostPageProps = { params: Promise<{ slug: string }> };

/**
 * Syntax highlighting, done by Shiki at build time — the pages are static, so
 * this costs the reader nothing and ships no highlighter to the browser.
 *
 * Both themes are emitted as CSS variables on every token and globals.css picks
 * one from `data-theme`, which is how a code block re-colours on the theme
 * toggle without a second render. `keepBackground` is off so the block keeps the
 * `--code` surface the design specified rather than the theme's own.
 *
 * A fence with no language is left alone, which is most of the migrated posts
 * and looks exactly as it did before.
 */
const prettyCode = {
  theme: { light: 'github-light', dark: 'github-dark' },
  keepBackground: false,
} as const;

/**
 * The site is a static export, so every post URL is known at build time. This
 * is also what the redirects and the sitemap are generated from.
 */
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

/** A slug outside generateStaticParams is a 404, not a render attempt. */
export const dynamicParams = false;

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const description = summarise(post.excerpt);
  return {
    title: `${post.title} — ${SITE.name}`,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: 'article',
      url: `${SITE.url}/blog/${slug}/`,
      title: post.title,
      description,
      publishedTime: new Date(post.date).toISOString(),
      ...(post.thumbnail ? { images: [{ url: post.thumbnail }] } : {}),
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const [body, next] = await Promise.all([getPostBody(slug), getNextPost(slug)]);
  const { content } = await compileMDX({
    source: body,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        // Hexo rendered these posts with GFM, so bare URLs were links. MDX does
        // not autolink by default, which left 28 of them across 16 posts as
        // unclickable text — the same migration gap as the dead permalinks
        // above, just quieter.
        remarkPlugins: [remarkGfm],
        rehypePlugins: [[rehypePrettyCode, prettyCode]],
      },
    },
  });

  return (
    <>
      <ReadingProgress />
      <BlogBackdrop single />
      <div className="relative z-1">
        <BlogChrome
          back={{ href: '/blog', label: 'All writing' }}
          trailing={{ label: 'Homepage', href: '/' }}
        />

        {/* From a wide enough viewport the author card sits alongside the
            article. The reading column keeps its 760px measure either way —
            the card appears in the space beside it or not at all, rather than
            narrowing the text to make room. */}
        <div className="ik-article-shell mx-auto max-w-[1120px] px-6 pt-[130px]">
          <div className="mx-auto w-full max-w-[760px]">
            {/* The posts are Bahasa Indonesia on an otherwise English site. */}
            <article lang="id" className="pb-10">
              <Reveal immediate className="font-mono text-faint mb-5 flex flex-wrap items-center gap-2.5 text-[12.5px]">
                <span className="text-primary tracking-[.04em] uppercase">{post.category}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={new Date(post.date).toISOString()}>{formatDate(post.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{post.readingMinutes} min read</span>
              </Reveal>

              <Reveal
                immediate
                as="h1"
                className="font-display m-0 mb-[22px] text-[clamp(32px,5.4vw,50px)] leading-[1.08] font-bold tracking-[-.03em]"
              >
                {post.title}
              </Reveal>

              <Reveal immediate as="p" className="text-muted m-0 mb-[26px] text-[19px] leading-[1.65]">
                {post.excerpt}
              </Reveal>

              {post.tags.length > 0 && (
                <Reveal immediate className="mb-[34px] flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-muted bg-surface-2 border-line rounded-full border px-3 py-1.5 text-xs"
                    >
                      {`#${tag}`}
                    </span>
                  ))}
                </Reveal>
              )}

              <Reveal immediate className="bg-surface border-line shadow-card-sm mb-11 flex items-center gap-3.5 rounded-[18px] border px-5 py-4">
                {/* The design used "IK" initials here; the ring is what is left of that
                    gradient once the photograph fills the circle. */}
                <span
                  className="h-11 w-11 flex-none rounded-full p-[2px]"
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
                <span className="flex flex-col">
                  <span className="text-[15px] font-semibold">{SITE.name}</span>
                  <span className="text-muted text-[13px]">Fullstack Engineer · Jakarta</span>
                </span>
              </Reveal>

              <Reveal className="ik-prose">{content}</Reveal>

              <Reveal className="border-line mt-[52px] flex flex-wrap items-center justify-between gap-3.5 border-t pt-[30px]">
                <Link
                  href="/blog"
                  className="bg-surface border-line text-ink hover:border-primary inline-flex items-center gap-2.5 rounded-[13px] border px-6 py-3.5 text-[15px] font-semibold no-underline transition-[translate,border-color] hover:-translate-y-[3px]"
                >
                  <ArrowLeft />
                  <span>All writing</span>
                </Link>

                {next && (
                  <Link
                    href={`/blog/${next.slug}`}
                    className="ik-btn-primary inline-flex items-center gap-2.5 rounded-[13px] px-6 py-3.5 text-[15px] font-semibold text-white no-underline transition-[translate,box-shadow] hover:-translate-y-[3px]"
                  >
                    <span>Next article</span>
                    <ArrowRight />
                  </Link>
                )}
              </Reveal>
            </article>

            <footer className="border-line text-faint flex flex-wrap items-center justify-between gap-3 border-t py-6 text-[13px]">
              <span>
                © {new Date().getFullYear()} {SITE.name}
              </span>
              <Link href="/" className="text-primary font-semibold no-underline">
                Back to site →
              </Link>
            </footer>
          </div>

          <aside className="ik-article-side">
            <ProfileCard />
          </aside>
        </div>
      </div>
    </>
  );
}

function ArrowLeft() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
