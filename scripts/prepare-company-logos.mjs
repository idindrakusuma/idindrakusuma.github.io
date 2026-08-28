/**
 * Turns the real company logos in assets/logos/ into the files the timeline badges
 * render.
 *
 * Sources are whatever was supplied (PNG/JPEG, ~400px, varying backgrounds); the
 * badge draws them at 40 CSS px, so 80px covers 2x displays. Output is WebP.
 *
 * Two shapes of source need different handling:
 *
 *   - A mark on a white card (ByteDance, Tokopedia) already carries its own
 *     margin. Left alone it stacks with the badge's own inset and the mark ends up
 *     reading tiny, so the surrounding white is trimmed off and a consistent
 *     margin added back.
 *   - A full-bleed brand tile (Ruangguru's teal square) is meant to fill the badge
 *     edge to edge. Trimming it would eat the tile and leave a floating wordmark.
 *
 * They are told apart by the corner pixel: a light corner means a mark on a card.
 *
 * To add or replace a logo: drop the file in assets/logos/ and re-run
 * `pnpm assets:logos`. The source directory is not served.
 */
import { mkdir, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { basename, dirname, extname, join } from 'node:path';
import sharp from 'sharp';

const SIZE = 80;
/** Share of the tile left as margin around a trimmed mark. */
const MARGIN = 0.1;
/** Corner luminance (0-255) at or above which a source counts as a mark on a card. */
const LIGHT_CORNER = 235;
/**
 * Above this width-to-height ratio a mark is a horizontal wordmark. Those are
 * already starved for height in a square badge, so they give up their side margin
 * and run the full width of the tile.
 */
const WORDMARK_RATIO = 2;

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = join(root, 'assets', 'logos');
const outDir = join(root, 'public', 'logos', 'companies');

await mkdir(outDir, { recursive: true });

async function cornerIsLight(file) {
  const { data } = await sharp(file)
    .extract({ left: 0, top: 0, width: 2, height: 2 })
    .raw()
    .toBuffer({ resolveWithObject: true });
  // Rec. 601 luma of the first pixel.
  const [r, g, b] = data;
  return 0.299 * r + 0.587 * g + 0.114 * b >= LIGHT_CORNER;
}

const sources = (await readdir(sourceDir)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));

if (sources.length === 0) {
  console.log('No logo sources in assets/logos/');
}

for (const file of sources) {
  const source = join(sourceDir, file);
  const name = basename(file, extname(file));
  const dest = join(outDir, `${name}.webp`);

  const onCard = await cornerIsLight(source);
  let shape;

  if (onCard) {
    // `threshold` is generous enough to also take the soft drop shadow some of
    // these marks sit on. Trimming first so the aspect ratio measured below is the
    // mark's own, not the source canvas's.
    const trimmed = await sharp(source).trim({ threshold: 15 }).png().toBuffer();
    const { width, height } = await sharp(trimmed).metadata();

    const wordmark = width / height > WORDMARK_RATIO;
    const sideMargin = wordmark ? 0 : MARGIN;
    const innerW = Math.round(SIZE * (1 - sideMargin * 2));
    const innerH = Math.round(SIZE * (1 - MARGIN * 2));
    const padX = Math.round((SIZE - innerW) / 2);
    const padY = Math.round((SIZE - innerH) / 2);

    shape = wordmark ? 'wordmark' : 'trimmed mark';
    await sharp(trimmed)
      .resize(innerW, innerH, { fit: 'contain', background: TRANSPARENT })
      .extend({ top: padY, bottom: padY, left: padX, right: padX, background: TRANSPARENT })
      .webp({ quality: 90, effort: 6 })
      .toFile(dest);
  } else {
    shape = 'full-bleed tile';
    await sharp(source).resize(SIZE, SIZE, { fit: 'cover' }).webp({ quality: 90, effort: 6 }).toFile(dest);
  }

  const { size } = await stat(dest);
  console.log(`${file.padEnd(20)} -> ${`${name}.webp`.padEnd(22)} ${shape.padEnd(16)} ${(size / 1024).toFixed(1)} KB`);
}
