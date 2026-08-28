/**
 * One-time migration of the Hexo blog into content/posts/*.mdx.
 *
 * The old site lived on the `source-code` branch of this repo as a Hexo blog:
 * 31 Markdown files under source/_posts, each with title/date/categories/tags/
 * thumbnail frontmatter and an excerpt marked by an `<!-- more -->` comment.
 *
 * This reads them straight out of git rather than from a working copy, so it
 * does not depend on that branch being checked out anywhere.
 *
 * Run once with `node scripts/migrate-posts.mjs`. After that content/posts is
 * the source of truth and hand-editable — re-running would discard any edits,
 * which is why it is not wired into `pnpm assets`.
 */
import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'content', 'posts');
const BRANCH = 'origin/source-code';
const SRC = 'source/_posts';

/**
 * The blog design filters on five categories; Hexo used six. Five map straight
 * across, and `portofolio` folds into Story — those four posts are first-person
 * accounts of projects built during university, not technical how-tos.
 *
 * An unmapped category throws rather than defaulting: a new one appearing is
 * something to decide about, not to swallow.
 */
const CATEGORY = {
  development: 'Development',
  tutorial: 'Tutorial',
  tips: 'Tips',
  story: 'Story',
  portofolio: 'Story',
  kuliah: 'Kuliah',
};

const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

/** Hexo frontmatter is small and regular, so a full YAML parser is not needed. */
function parseFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) throw new Error('no frontmatter');
  const body = raw.slice(match[0].length);
  const data = {};
  let key = null;
  for (const line of match[1].split(/\r?\n/)) {
    const item = /^\s*-\s+(.*)$/.exec(line);
    if (item && key) {
      (data[key] = Array.isArray(data[key]) ? data[key] : []).push(unquote(item[1]));
      continue;
    }
    const pair = /^([A-Za-z_]+):\s*(.*)$/.exec(line);
    if (!pair) continue;
    key = pair[1];
    data[key] = pair[2] === '' ? [] : unquote(pair[2]);
  }
  return { data, body };
}

const unquote = (v) => v.trim().replace(/^['"](.*)['"]$/, '$1');
const asList = (v) => (Array.isArray(v) ? v : v ? [v] : []);

/**
 * Everything before `<!-- more -->` is the excerpt Hexo showed on the index.
 * Kept as the post's own words rather than rewritten — this is a migration.
 */
function splitExcerpt(body) {
  const marker = /<!--\s*more\s*-->/;
  const at = body.search(marker);
  const lead = at === -1 ? body : body.slice(0, at);
  const text = lead
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`#>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return { excerpt: text, body: at === -1 ? body : body.replace(marker, '').trim() };
}

/**
 * Hexo never validated or normalised its own timestamps. Across 31 posts there
 * are single-digit months (`2017-5-22`) and an impossible `13:05:97`. Both are
 * repaired here rather than dropping the post — the day is what the archive
 * order and the old permalink are built from.
 */
function normaliseDate(raw) {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/.exec(raw.trim());
  if (!m) throw new Error(`unparseable date "${raw}"`);
  const [, y, mo, d, h = '0', mi = '0', se = '0'] = m;
  const pad = (v, max) => String(Math.min(Number(v), max)).padStart(2, '0');
  return `${y}-${pad(mo, 12)}-${pad(d, 31)} ${pad(h, 23)}:${pad(mi, 59)}:${pad(se, 59)}`;
}

/** ~200 words per minute, floored at one. */
const readingMinutes = (body) => Math.max(1, Math.round(body.split(/\s+/).length / 200));

const yamlString = (s) => `'${String(s).replace(/'/g, "''")}'`;

await mkdir(outDir, { recursive: true });

const files = git('ls-tree', '-r', '--name-only', BRANCH, '--', SRC).trim().split('\n').filter(Boolean);
const written = [];

for (const file of files) {
  const raw = git('show', `${BRANCH}:${file}`);
  const { data, body: full } = parseFrontmatter(raw);
  const { excerpt, body } = splitExcerpt(full);

  // Hexo took the slug from the filename, which was mixed-case for most posts.
  // Netlify lowercases request paths and 301s to match, so a cased URL would
  // cost every visitor a redirect and disagree with its own canonical tag.
  const legacySlug = basename(file, '.md');
  const slug = legacySlug.toLowerCase();
  const rawCategory = asList(data.categories)[0] ?? 'story';
  const category = CATEGORY[rawCategory.toLowerCase()];
  if (!category) throw new Error(`${slug}: no mapping for category "${rawCategory}"`);

  const date = normaliseDate(String(data.date));
  const front = [
    '---',
    `title: ${yamlString(data.title)}`,
    `date: ${yamlString(date)}`,
    `category: ${category}`,
    `tags: [${asList(data.tags).map((t) => yamlString(t)).join(', ')}]`,
    `thumbnail: ${yamlString(data.thumbnail)}`,
    `excerpt: ${yamlString(excerpt)}`,
    `readingMinutes: ${readingMinutes(body)}`,
    // Only when it differs — the old permalink carried the original casing and
    // the redirect has to reproduce it exactly.
    ...(legacySlug === slug ? [] : [`legacySlug: ${yamlString(legacySlug)}`]),
    '---',
    '',
  ].join('\n');

  await writeFile(join(outDir, `${slug}.mdx`), front + body.trim() + '\n', 'utf8');
  written.push({ slug, category, date });
}

const byCategory = {};
for (const p of written) byCategory[p.category] = (byCategory[p.category] ?? 0) + 1;
console.log(`Wrote ${written.length} posts to content/posts/`);
for (const [c, n] of Object.entries(byCategory).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(3)}  ${c}`);
}
