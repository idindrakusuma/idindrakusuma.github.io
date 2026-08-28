/**
 * Brings the blog's images into the repo.
 *
 * The migrated posts arrived pointing at six third-party hosts — mostly
 * user-images.githubusercontent.com, plus some Blogger and Unsplash. Every one
 * still resolved at migration time, but none of them are ours: a blog meant to
 * outlive its sources cannot depend on them.
 *
 * Each referenced image is fetched once, re-encoded as WebP and written under
 * public/images/posts/, and the MDX is rewritten to point at the local copy.
 * Widths are capped at what the layout actually renders at 2x — thumbnails sit
 * in a 280px card slot, article images in a 760px column — and never upscaled.
 *
 * Re-run with `pnpm assets:posts`. Already-local paths are left alone, so it is
 * safe to run repeatedly; only newly added remote URLs are fetched.
 */
import { mkdir, readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = join(root, 'content', 'posts');
const outDir = join(root, 'public', 'images', 'posts');

/** Card thumb renders at 280px, article images in a 760px column — 2x each. */
const THUMB_WIDTH = 560;
const INLINE_WIDTH = 1520;

const isRemote = (url) => /^https?:\/\//i.test(url);

async function fetchImage(url) {
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

/** Never upscale: a 300px source stays 300px rather than being blown up. */
async function encode(buffer, maxWidth, file) {
  const image = sharp(buffer);
  const { width } = await image.metadata();
  const pipeline = width && width > maxWidth ? image.resize({ width: maxWidth }) : image;
  const { width: w, height: h } = await pipeline.webp({ quality: 82 }).toFile(file);
  return { width: w, height: h };
}

await mkdir(outDir, { recursive: true });

/**
 * Rendered dimensions for every vendored image, so the article can set width
 * and height on each one. Markdown image syntax carries no dimensions, and an
 * unsized image in a 760px column is a layout shift on every post.
 */
const manifestFile = join(outDir, 'manifest.json');
let manifest = {};
try {
  manifest = JSON.parse(await readFile(manifestFile, 'utf8'));
} catch {
  /* first run */
}

const files = (await readdir(postsDir)).filter((f) => f.endsWith('.mdx')).sort();
let fetched = 0;
let reused = 0;
const failures = [];

for (const file of files) {
  const slug = file.replace(/\.mdx$/, '');
  const source = await readFile(join(postsDir, file), 'utf8');
  let output = source;
  let index = 0;

  /** Replaces one remote URL with its local WebP, fetching if not already there. */
  const localise = async (url, kind) => {
    const name = kind === 'thumb' ? `${slug}-thumb.webp` : `${slug}-${++index}.webp`;
    const target = join(outDir, name);
    const href = `/images/posts/${name}`;

    try {
      await stat(target);
      if (manifest[href]) {
        reused++;
        return href;
      }
      // On disk but unmeasured — an older run predating the manifest.
      const { width, height } = await sharp(target).metadata();
      manifest[href] = { width, height };
      reused++;
      return href;
    } catch {
      /* not fetched yet */
    }

    try {
      const buffer = await fetchImage(url);
      manifest[href] = await encode(buffer, kind === 'thumb' ? THUMB_WIDTH : INLINE_WIDTH, target);
      fetched++;
      return href;
    } catch (error) {
      failures.push(`${slug}: ${url} — ${error.message}`);
      return null;
    }
  };

  const thumbMatch = /^thumbnail:\s*'([^']+)'$/m.exec(output);
  if (thumbMatch && isRemote(thumbMatch[1])) {
    const href = await localise(thumbMatch[1], 'thumb');
    if (href) output = output.replace(thumbMatch[0], `thumbnail: '${href}'`);
  }

  // Markdown image syntax only — the migrated posts carry no raw <img> tags.
  // Alt text can itself contain brackets ("![Report [Part 1]](url)"), so the
  // closing one is the `]` immediately before the URL's `(`, not the first.
  const inline = [...output.matchAll(/!\[((?:[^\]]|\](?!\())*)\]\((https?:\/\/[^)\s]+)\)/g)];
  for (const [full, alt, url] of inline) {
    const href = await localise(url, 'inline');
    if (href) output = output.replace(full, `![${alt}](${href})`);
  }

  if (output !== source) await writeFile(join(postsDir, file), output, 'utf8');
}

// Measure anything on disk the passes above did not touch — images localised by
// an earlier run are already local in the MDX, so they never reach `localise`.
const onDisk = (await readdir(outDir)).filter((f) => f.endsWith('.webp'));
let measured = 0;
for (const name of onDisk) {
  const href = `/images/posts/${name}`;
  if (manifest[href]) continue;
  const { width, height } = await sharp(join(outDir, name)).metadata();
  manifest[href] = { width, height };
  measured++;
}

// Drop entries whose file is gone, so the manifest cannot outlive its images.
const live = new Set(onDisk.map((n) => `/images/posts/${n}`));
for (const href of Object.keys(manifest)) if (!live.has(href)) delete manifest[href];

await writeFile(
  manifestFile,
  `${JSON.stringify(Object.fromEntries(Object.entries(manifest).sort()), null, 2)}\n`,
  'utf8',
);

const written = onDisk;
let bytes = 0;
for (const f of written) bytes += (await stat(join(outDir, f))).size;

console.log(
  `Fetched ${fetched}, reused ${reused}, measured ${measured} — ${written.length} images, ${(bytes / 1024 / 1024).toFixed(1)} MB`,
);
if (failures.length) {
  console.error(`\n${failures.length} could not be fetched:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
