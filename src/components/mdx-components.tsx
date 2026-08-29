import Image from 'next/image';
import type { ComponentProps } from 'react';
import manifest from '../../public/images/posts/manifest.json';

/**
 * How the migrated Markdown renders.
 *
 * Almost everything is left as plain HTML and styled by `.ik-prose` in
 * globals.css — the design specifies the article body as typography, not as
 * components. Two things need more than CSS.
 */

type Dimensions = { width: number; height: number };
const dimensions = manifest as Record<string, Dimensions>;

export const mdxComponents = {
  /**
   * Markdown image syntax carries no dimensions, and an unsized image in a
   * 760px column shifts the layout as it loads. Every vendored image is
   * measured into the manifest by scripts/prepare-post-images.mjs, so the size
   * is known here — and an image missing from it fails the build rather than
   * shipping an unsized one.
   */
  img: ({ src, alt }: ComponentProps<'img'>) => {
    const href = typeof src === 'string' ? src : '';
    const size = dimensions[href];
    if (!size) {
      throw new Error(`No measurement for "${href}" — run \`pnpm assets:posts\``);
    }
    return <Image src={href} alt={alt ?? ''} width={size.width} height={size.height} />;
  },

  /** Outbound links in a migrated post point off-site; keep them safe to click. */
  a: ({ href, children }: ComponentProps<'a'>) => {
    const to = typeof href === 'string' ? href : '';
    const external = /^https?:\/\//i.test(to);
    return (
      <a href={to} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {children}
      </a>
    );
  },
};
