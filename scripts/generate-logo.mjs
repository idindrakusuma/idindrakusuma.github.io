/**
 * Builds the iK mark served on the site.
 *
 * The mark ships as two separate artworks rather than one file recoloured by CSS:
 * assets/logo-light-source.png is drawn for light surfaces (navy ink) and
 * assets/logo-dark-source.png for dark ones (near-white ink). Each has its own
 * art-directed gradients, which a single recoloured copy could not reproduce.
 *
 * The two masters differ in both canvas size and transparent padding, so rendering
 * them as-is would shift and resize the mark on every theme change. This normalises
 * them: trim to the artwork, pad both to one shared aspect ratio, then emit at a
 * single size. Both outputs end up pixel-for-pixel interchangeable.
 *
 * Re-run with `node scripts/generate-logo.mjs` after replacing either source.
 */
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { stat } from 'node:fs/promises';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// The mark renders at 210 CSS px at its largest (the contact card), so 440 covers 2x
// displays with room to spare.
const WIDTH = 440;

const variants = [
  { theme: 'light', source: 'logo-light-source.png' },
  { theme: 'dark', source: 'logo-dark-source.png' },
];

// Measure each master's artwork box first — the shared aspect ratio has to accommodate
// whichever is proportionally tallest, or that one would be squashed.
const measured = [];
for (const v of variants) {
  const path = join(root, 'assets', v.source);
  const { info } = await sharp(path).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
  measured.push({ ...v, path, w: info.width, h: info.height });
  console.log(`${v.source.padEnd(24)} artwork ${info.width}x${info.height}`);
}

const ratio = Math.max(...measured.map((m) => m.h / m.w));
const HEIGHT = Math.round(WIDTH * ratio);
console.log(`shared box ${WIDTH}x${HEIGHT}  (aspect-ratio: ${WIDTH} / ${HEIGHT})`);

for (const m of measured) {
  // `contain` letterboxes the trimmed artwork into the shared box without distorting it,
  // so both variants sit at the same size and position whichever theme is showing.
  const dest = join(root, 'public', `logo-${m.theme}.webp`);
  await sharp(m.path)
    .trim({ threshold: 1 })
    .resize(WIDTH, HEIGHT, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 90, effort: 6 })
    .toFile(dest);
  const { size } = await stat(dest);
  console.log(`logo-${m.theme}.webp`.padEnd(24) + `${WIDTH}x${HEIGHT}  ${(size / 1024).toFixed(1)} KB`);
}
