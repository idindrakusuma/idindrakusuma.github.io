/**
 * Vendors the skill-marquee logos out of the `simple-icons` package into
 * public/logos/skills/*.svg.
 *
 * The design prototype pulled these from cdn.simpleicons.org at runtime; serving
 * them from our own origin removes a third-party request from the critical path
 * and keeps the marquee working offline. Re-run with `node scripts/generate-icons.mjs`
 * after bumping simple-icons.
 *
 * Icons are rendered with `fill="currentColor"` — the marquee tints them via the
 * `--logo-filter` token (solid black in light mode, white in dark), so the brand
 * colours are intentionally dropped.
 *
 * Any slug missing from simple-icons is reported and skipped; the Skills component
 * falls back to a text wordmark for those (currently: lynx).
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import * as simpleIcons from 'simple-icons';

const SLUGS = [
  'react',
  'nextdotjs',
  'gatsby',
  'vuedotjs',
  'typescript',
  'javascript',
  'html5',
  'lynx',
  'go',
  'nodedotjs',
  'php',
  'laravel',
  'mysql',
  'supabase',
  'firebase',
  'docker',
  'bytedance',
  'anthropic',
  'githubcopilot',
  'githubactions',
  'googlecloud',
  'netlify',
  'gitlab',
  'figma',
];

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'logos', 'skills');
await mkdir(outDir, { recursive: true });

const missing = [];

for (const slug of SLUGS) {
  const icon = simpleIcons[`si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`];
  if (!icon) {
    missing.push(slug);
    continue;
  }
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="${icon.title}">` +
    `<title>${icon.title}</title>` +
    `<path fill="currentColor" d="${icon.path}"/>` +
    `</svg>\n`;
  await writeFile(join(outDir, `${slug}.svg`), svg, 'utf8');
}

console.log(`Wrote ${SLUGS.length - missing.length} icons to public/logos/skills/`);
if (missing.length) {
  console.log(`Not in simple-icons (wordmark fallback will be used): ${missing.join(', ')}`);
}
