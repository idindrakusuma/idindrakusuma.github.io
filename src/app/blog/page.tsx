import type { Metadata } from 'next';
import Link from 'next/link';
import AuroraBackground from '@/components/AuroraBackground';
import SiteChrome from '@/components/SiteChrome';
import { getPosts } from '@/lib/posts';
import { SITE } from '@/lib/site-data';

export const metadata: Metadata = {
  title: `Blog — ${SITE.name}`,
  description: 'Notes on frontend performance, fullstack engineering and AI-native tooling.',
  alternates: { canonical: '/blog' },
};

/**
 * The blog index. Scaffolding: `getPosts` returns nothing yet, so this renders
 * its empty state.
 *
 * Carries the same <SiteChrome> as the homepage. Off the homepage its spy is
 * switched off and its links point back at `/#section`, so the chrome is shared
 * without pretending the Sections are here.
 */
export default async function BlogIndex() {
  const posts = await getPosts();

  return (
    <>
      <AuroraBackground />
      <div className="relative z-1">
        <SiteChrome />
        <main className="mx-auto max-w-[1160px] px-6 pt-[150px] pb-[90px]">
          <div className="mb-[30px] flex items-center gap-3.5">
            <span className="font-mono text-primary text-[13px] font-medium">Writing</span>
            <span className="ik-divider" />
          </div>

          <h1 className="font-display mb-3.5 text-[clamp(42px,7vw,76px)] leading-[1.02] font-bold tracking-[-.03em]">
            Blog
          </h1>

          <p className="text-muted mb-[34px] max-w-[620px] text-[clamp(16px,2.2vw,19px)]">
            Notes on frontend performance, fullstack engineering and AI-native tooling.
          </p>

          {posts.length === 0 ? (
            <p className="text-faint font-mono text-sm">Nothing published yet.</p>
          ) : (
            // TODO: the post card. One <article> per post — title, date, reading
            // time, description — most likely lifted from the award card's shape.
            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="text-ink no-underline">
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/"
            className="text-muted hover:text-primary mt-14 inline-block text-sm no-underline transition-colors"
          >
            ← Back to homepage
          </Link>
        </main>
      </div>
    </>
  );
}
