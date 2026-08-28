/**
 * Vendors the skill-marquee logos out of the `simple-icons` package into
 * public/logos/skills/*.svg.
 *
 * The design prototype pulled these from cdn.simpleicons.org at runtime; serving
 * them from our own origin removes a third-party request from the critical path
 * and keeps the marquee working offline. Re-run with `npm run assets:icons`
 * after bumping simple-icons or editing SKILL_ROWS.
 *
 * SKILL_ROWS in src/lib/site-data.ts is the only list of skills — this script
 * reads it rather than keeping a second copy, so adding a skill is one edit. The
 * invariant it enforces is that every skill either has a vendored mark or is
 * explicitly flagged `wordmark: true`; either half drifting out of step with
 * simple-icons fails the run rather than shipping a 404 into the marquee.
 *
 * Icons are rendered with `fill="currentColor"` — the marquee tints them via the
 * `--logo-filter` token (solid black in light mode, white in dark), so the brand
 * colours are intentionally dropped.
 */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import ts from 'typescript';
import * as simpleIcons from 'simple-icons';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'logos', 'skills');

/**
 * Runs site-data.ts without a build step. It is plain data with no imports of
 * its own, so stripping the types leaves something Node can evaluate directly.
 */
async function loadSiteData() {
  const source = await readFile(join(root, 'src', 'lib', 'site-data.ts'), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  const encoded = Buffer.from(outputText).toString('base64');
  return import(`data:text/javascript;base64,${encoded}`);
}

/** simple-icons exports each mark as `si` + the capitalised slug. */
const iconFor = (slug) => simpleIcons[`si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`];

const { SKILL_ROWS } = await loadSiteData();
const skills = SKILL_ROWS.flatMap((row) => row.items);

await mkdir(outDir, { recursive: true });

const problems = [];
const written = [];
const wordmarks = [];

for (const { slug, name, wordmark } of skills) {
  const icon = iconFor(slug);

  if (wordmark) {
    if (icon) {
      problems.push(`${slug} is flagged \`wordmark: true\`, but simple-icons now has a mark for it — drop the flag`);
    } else {
      wordmarks.push(slug);
    }
    continue;
  }

  if (!icon) {
    problems.push(`${slug} (${name}) is not in simple-icons — add \`wordmark: true\` to it in site-data.ts`);
    continue;
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="${icon.title}">` +
    `<title>${icon.title}</title>` +
    `<path fill="currentColor" d="${icon.path}"/>` +
    `</svg>\n`;
  await writeFile(join(outDir, `${slug}.svg`), svg, 'utf8');
  written.push(slug);
}

// A skill dropped from SKILL_ROWS leaves its file behind. Reported rather than
// deleted — these are committed, and removing one is the author's call.
const onDisk = (await readdir(outDir)).filter((file) => file.endsWith('.svg'));
const orphans = onDisk.filter((file) => !written.includes(file.slice(0, -'.svg'.length)));

console.log(`Wrote ${written.length} icons to public/logos/skills/`);
if (wordmarks.length) {
  console.log(`Rendered as wordmarks (not in simple-icons): ${wordmarks.join(', ')}`);
}
if (orphans.length) {
  console.log(`Orphaned — no longer in SKILL_ROWS, safe to delete: ${orphans.join(', ')}`);
}

if (problems.length) {
  console.error(`\nSKILL_ROWS and simple-icons disagree (${problems.length}):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
