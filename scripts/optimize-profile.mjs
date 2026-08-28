/**
 * Builds the hero avatar served to visitors.
 *
 * assets/profile-source.png is the 1000x1000 master (1.5 MB) and is never shipped.
 * The hero renders the photo at 400 CSS px at most, so 800 px covers 2x displays
 * with room to spare. Re-run with `pnpm assets:profile` after
 * replacing the source.
 */
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { stat } from 'node:fs/promises';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'assets', 'profile-source.png');

const outputs = [
  { file: 'profile.webp', size: 800, options: { quality: 82, effort: 6 } },
  // JPEG fallback for the handful of clients without WebP; also what social
  // scrapers that ignore WebP will pick up for the og:image.
  { file: 'profile.jpg', size: 800, options: { quality: 84, mozjpeg: true } },
];

for (const { file, size, options } of outputs) {
  const pipeline = sharp(source).resize(size, size, { fit: 'cover' });
  // A transparent-background master would composite badly onto a JPEG, so flatten
  // onto the light surface colour the avatar sits on.
  const out = file.endsWith('.jpg')
    ? pipeline.flatten({ background: '#f3f6fc' }).jpeg(options)
    : pipeline.webp(options);
  const dest = join(root, 'public', file);
  await out.toFile(dest);
  const { size: bytes } = await stat(dest);
  console.log(`${file.padEnd(14)} ${size}x${size}  ${(bytes / 1024).toFixed(0)} KB`);
}
