/**
 * Builds the site icons from the iK logo.
 *
 * assets/favicon-source.png is the 1254x1254 master (1 MB) and is never shipped.
 * Next.js picks up src/app/icon*.png and apple-icon.png by file convention, so the
 * outputs land there rather than in public/. Re-run with
 * `node scripts/generate-favicon.mjs` after replacing the source.
 *
 * The master carries ~5% transparent padding plus a drop shadow, which at 32px is
 * margin the mark cannot spare, so the artwork is trimmed and re-centred first.
 */
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { stat } from 'node:fs/promises';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'assets', 'favicon-source.png');

// The trimmed box is not square (the shadow runs longer at the bottom), so resizing
// it straight to a square would squash the logo. Take the larger side and centre a
// square crop on the mark instead, clamped to the image so extract() stays in bounds.
const { width, height } = await sharp(source).metadata();
const trimmed = await sharp(source).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
const { trimOffsetLeft, trimOffsetTop, width: markW, height: markH } = trimmed.info;
const side = Math.min(Math.max(markW, markH), width, height);
const centreX = -trimOffsetLeft + markW / 2;
const centreY = -trimOffsetTop + markH / 2;
const clamp = (value, max) => Math.round(Math.min(Math.max(value, 0), max - side));

const crop = {
  left: clamp(centreX - side / 2, width),
  top: clamp(centreY - side / 2, height),
  width: side,
  height: side,
};

const outputs = [
  // The tab favicon. Browsers downscale this to 16px themselves.
  { file: 'icon.png', size: 32 },
  // Numbered suffix = a second <link rel="icon">; Chrome on Android and HD bookmarks
  // pick the large one.
  { file: 'icon1.png', size: 192 },
  // iOS applies its own squircle mask, so the transparent corners would render as
  // black. Flatten onto the logo's own background instead.
  { file: 'apple-icon.png', size: 180, background: '#050719' },
];

for (const { file, size, background } of outputs) {
  const pipeline = sharp(source).extract(crop).resize(size, size, { fit: 'cover' });
  const dest = join(root, 'src', 'app', file);
  // Palette PNGs are ~4x smaller than truecolour here and the flat brand shapes
  // quantise without visible banding at icon sizes.
  const encoded = (background ? pipeline.flatten({ background }) : pipeline).png({
    palette: true,
    quality: 100,
    effort: 10,
  });
  await encoded.toFile(dest);
  const { size: bytes } = await stat(dest);
  console.log(`${file.padEnd(15)} ${size}x${size}  ${(bytes / 1024).toFixed(1)} KB`);
}
