/**
 * Generates initials placeholders for companies that don't have a real logo yet.
 *
 * Real logos are produced by scripts/prepare-company-logos.mjs from the sources in
 * assets/logos/. This script only fills the gaps, and never overwrites a file that
 * already exists — so dropping in a real logo is permanent, and re-running this is
 * always safe. Pass --force to regenerate placeholders anyway.
 *
 * The badge renders logos with `object-fit: contain` on a white tile, so a square
 * mark with a transparent background looks best.
 */
import { access, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const PLACEHOLDERS = [
  { file: 'invitato', initials: 'IN' },
  { file: 'suara-merdeka', initials: 'SM' },
  { file: 'dinus', initials: 'UD' },
];

const force = process.argv.includes('--force');

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'logos', 'companies');
await mkdir(outDir, { recursive: true });

const exists = (path) =>
  access(path).then(
    () => true,
    () => false,
  );

const initialsSvg = (initials) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" role="img" aria-label="${initials}">` +
  `<title>${initials}</title>` +
  `<text x="20" y="20" fill="#c0203f" font-family="'Space Grotesk',system-ui,-apple-system,sans-serif"` +
  ` font-size="15" font-weight="700" letter-spacing="-0.3"` +
  ` text-anchor="middle" dominant-baseline="central">${initials}</text>` +
  `</svg>\n`;

let written = 0;
for (const { file, initials } of PLACEHOLDERS) {
  const dest = join(outDir, `${file}.svg`);
  if (!force && (await exists(dest))) {
    console.log(`${file.padEnd(16)} exists, skipped`);
    continue;
  }
  await writeFile(dest, initialsSvg(initials), 'utf8');
  console.log(`${file.padEnd(16)} placeholder written`);
  written += 1;
}

console.log(`\n${written} placeholder(s) written. Still awaiting real logos: ${PLACEHOLDERS.map((p) => p.file).join(', ')}`);
