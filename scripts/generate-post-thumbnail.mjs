/**
 * Draws a thumbnail for a post that has no image of its own.
 *
 * Every card on the blog index carries one, so a post without a picture leaves a
 * hole in a grid of 31 that reads as broken rather than deliberate. This paints
 * one from what the post already knows about itself — its category and title —
 * in the site's own gradient and typeface.
 *
 * Rendered with next/og, which is satori underneath: it lays the text out and
 * emits it as vector paths, so the result does not depend on which fonts the
 * machine running this happens to have. The two faces are vendored under
 * assets/fonts for the same reason — they are the site's own, under the OFL.
 *
 *   pnpm assets:thumbnail <slug>
 *
 * Writes public/images/posts/<slug>-thumb.webp and points the post's frontmatter
 * at it. Refuses to overwrite a thumbnail that is already set.
 */
import { createRequire } from 'node:module';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import matter from 'gray-matter';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// next/og has no bare-specifier export that resolves outside a bundler.
const { ImageResponse } = require(join(root, 'node_modules', 'next', 'og.js'));

/**
 * Drawn at the index card's own 16/11, because that is the surface a reader
 * actually sees. A social card crops this to about 1.91:1, taking roughly 98px
 * off the top and bottom — so the vertical padding below is set to keep the
 * category and the mark inside that band too. Neither crop is horizontal, which
 * is why the side padding can stay tight.
 */
const WIDTH = 1200;
const HEIGHT = 825;
/** Clears the social crop with room to spare. */
const PAD_Y = 120;

/** The light palette's accents, from globals.css. */
const A1 = '#c0203f';
const A3 = '#8a1c50';

const slug = process.argv[2];
if (!slug) {
  console.error('\n  Usage: pnpm assets:thumbnail <slug>\n');
  process.exit(1);
}

const postFile = join(root, 'content', 'posts', `${slug}.mdx`);
let raw;
try {
  raw = await readFile(postFile, 'utf8');
} catch {
  console.error(`\n  content/posts/${slug}.mdx does not exist.\n`);
  process.exit(1);
}

const { data } = matter(raw);
if (typeof data.thumbnail === 'string' && data.thumbnail.trim()) {
  console.error(`\n  ${slug} already has a thumbnail: ${data.thumbnail}\n  Clear it first to regenerate.\n`);
  process.exit(1);
}

const [display, mono] = await Promise.all([
  readFile(join(root, 'assets', 'fonts', 'SpaceGrotesk.ttf')),
  readFile(join(root, 'assets', 'fonts', 'JetBrainsMono.ttf')),
]);

const title = String(data.title ?? slug);
/** Long titles step down a size rather than overflowing the card. */
const titleSize = title.length > 68 ? 60 : title.length > 44 ? 72 : 84;

const element = {
  type: 'div',
  props: {
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '100%',
      height: '100%',
      padding: `${PAD_Y}px 80px`,
      backgroundImage: `linear-gradient(135deg, ${A1} 0%, ${A3} 100%)`,
      color: '#ffffff',
      fontFamily: 'Space Grotesk',
    },
    children: [
      {
        type: 'div',
        props: {
          style: {
            fontFamily: 'JetBrains Mono',
            fontSize: 26,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            opacity: 0.75,
          },
          children: String(data.category ?? ''),
        },
      },
      {
        type: 'div',
        props: {
          style: { display: 'flex', fontSize: titleSize, fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.03em' },
          children: title,
        },
      },
      {
        type: 'div',
        props: {
          style: { display: 'flex', justifyContent: 'flex-end', fontSize: 30, fontWeight: 700, opacity: 0.8 },
          children: 'iK',
        },
      },
    ],
  },
};

const png = Buffer.from(
  await new ImageResponse(element, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: 'Space Grotesk', data: display, weight: 700, style: 'normal' },
      { name: 'JetBrains Mono', data: mono, weight: 500, style: 'normal' },
    ],
  }).arrayBuffer(),
);

const name = `${slug}-thumb.webp`;
const outFile = join(root, 'public', 'images', 'posts', name);
const { size } = await sharp(png).webp({ quality: 88 }).toFile(outFile);

const href = `/images/posts/${name}`;
await writeFile(postFile, raw.replace(/^thumbnail: *''$/m, `thumbnail: '${href}'`), 'utf8');

console.log(`
  ${href}   ${WIDTH}x${HEIGHT}  ${(size / 1024).toFixed(0)} KB

  Set as ${slug}'s thumbnail. Run \`pnpm assets:posts\` to record its dimensions.
`);
