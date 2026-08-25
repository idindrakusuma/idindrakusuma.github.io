/**
 * Generates the initials placeholders used by the experience timeline badges.
 *
 * These stand in for the real company marks. To use a real logo, just drop the
 * file over the placeholder — same path, same name (any raster or vector format
 * works; update the extension in src/lib/site-data.ts if it isn't .svg). The
 * badge renders it with `object-fit: contain` on a white tile, so a square,
 * transparent-background mark looks best.
 *
 * ByteDance uses its real mark from simple-icons; the rest are initials until
 * real assets land.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { siBytedance } from 'simple-icons';

const PLACEHOLDERS = [
  { file: 'tokopedia', initials: 'TP' },
  { file: 'invitato', initials: 'IN' },
  { file: 'ruangguru', initials: 'SA' },
  { file: 'suara-merdeka', initials: 'SM' },
  { file: 'dinus', initials: 'UD' },
];

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'logos', 'companies');
await mkdir(outDir, { recursive: true });

const initialsSvg = (initials) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" role="img" aria-label="${initials}">` +
  `<title>${initials}</title>` +
  `<text x="20" y="20" fill="#c0203f" font-family="'Space Grotesk',system-ui,-apple-system,sans-serif"` +
  ` font-size="15" font-weight="700" letter-spacing="-0.3"` +
  ` text-anchor="middle" dominant-baseline="central">${initials}</text>` +
  `</svg>\n`;

for (const { file, initials } of PLACEHOLDERS) {
  await writeFile(join(outDir, `${file}.svg`), initialsSvg(initials), 'utf8');
}

// ByteDance ships its real mark, in brand blue. The badge renders logos
// full-bleed, so the 24x24 mark is inset into a 40x40 box to give it breathing
// room — the same optical padding the initials placeholders have built in.
const INSET = 7;
const scale = (40 - INSET * 2) / 24;
await writeFile(
  join(outDir, 'bytedance.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" role="img" aria-label="${siBytedance.title}">` +
    `<title>${siBytedance.title}</title>` +
    `<g transform="translate(${INSET} ${INSET}) scale(${scale.toFixed(4)})">` +
    `<path fill="#${siBytedance.hex}" d="${siBytedance.path}"/>` +
    `</g></svg>\n`,
  'utf8',
);

console.log(`Wrote ${PLACEHOLDERS.length + 1} company logos to public/logos/companies/`);
