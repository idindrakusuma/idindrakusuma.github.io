/**
 * Draws the link-preview images for the site's three index routes — the
 * homepage, /blog and /projects — into public/og/{home,blog,projects}.jpg.
 *
 * A post brings its own thumbnail; these three pages used to fall back to the
 * profile photo, an 800×800 square that previews cropped to a face. Each is now
 * a 1200×630 card in the site's light palette: the page's own headline and
 * something beside it — the hero's code card and the company logos on the homepage, the page's own
 * illustration on /blog and /projects (assets/og/*-art.png, captured from the
 * inline SVG).
 *
 * Rendered with next/og like the post thumbnails, in the vendored faces. JPEG,
 * because WhatsApp will not show a WebP preview.
 *
 * Run by `pnpm build` before `next build`, so the post count on the blog card
 * is never behind; `pnpm assets:og` runs it alone.
 */
import { createRequire } from 'node:module';
import { mkdir, readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { ImageResponse } = require(join(root, 'node_modules', 'next', 'og.js'));

const WIDTH = 1200;
const HEIGHT = 630;

/** The light palette, from globals.css. */
const BG = '#eef2f9';
const INK = '#0a1224';
const MUTED = '#55648a';
const FAINT = '#616b82';
const A1 = '#c0203f';
const A2 = '#e0446a';
const A3 = '#8a1c50';

const [display, mono] = await Promise.all([
  readFile(join(root, 'assets', 'fonts', 'SpaceGrotesk.ttf')),
  readFile(join(root, 'assets', 'fonts', 'JetBrainsMono.ttf')),
]);

const dataUri = async (file, width) =>
  `data:image/png;base64,${(await sharp(join(root, file)).resize(width).png().toBuffer()).toString('base64')}`;
const [avatar, mark, blogArt, projectsArt] = await Promise.all([
  dataUri('public/profile.jpg', 320),
  dataUri('assets/logo-light-source.png', 160),
  dataUri('assets/og/blog-art.png', 680),
  dataUri('assets/og/projects-art.png', 760),
]);

/** Published originals only: what the blog index lists and counts. */
async function postCount() {
  let count = 0;
  for (const file of await readdir(join(root, 'content', 'posts'))) {
    if (!file.endsWith('.mdx')) continue;
    const { data } = matter(await readFile(join(root, 'content', 'posts', file), 'utf8'));
    if (!data.draft && !data.translationOf) count += 1;
  }
  return count;
}

const h = (type, style, children) => ({ type, props: { style: { display: 'flex', ...style }, children } });
const img = (src, style) => ({ type: 'img', props: { src, style } });
const monoFace = { fontFamily: 'JetBrains Mono' };
const gradient = (text) =>
  h('span', { backgroundImage: `linear-gradient(100deg, ${A1}, ${A2}, ${A3})`, backgroundClip: 'text', color: 'transparent' }, text);
/** The shared frame: the background and its glows, and the page's content over them. */
const frame = (children) =>
  h(
    'div',
    {
      width: '100%',
      height: '100%',
      padding: '64px 72px',
      color: INK,
      fontFamily: 'Space Grotesk',
      // Glows as background layers: absolutely positioned glow elements leave a
      // visible seam across the card where satori splits them.
      backgroundColor: BG,
      backgroundImage: [
        'radial-gradient(circle at 86% 18%, rgba(192,32,63,0.2) 0%, rgba(192,32,63,0) 42%)',
        'radial-gradient(circle at 8% 100%, rgba(138,28,80,0.1) 0%, rgba(138,28,80,0) 40%)',
      ].join(', '),
    },
    children,
  );

/** A page card: an eyebrow, a two-line headline, a line under it, the mark and its URL, and the page's art. */
const pageCard = ({ eyebrow, first, second, lede, url, art, artWidth }) =>
  frame([
    h('div', { width: '100%', alignItems: 'center', justifyContent: 'space-between' }, [
      h('div', { flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: 660 }, [
        h('div', { ...monoFace, fontSize: 24, color: A1 }, eyebrow),
        h('div', { flexDirection: 'column', gap: 22 }, [
          h('div', { flexDirection: 'column', fontSize: 70, fontWeight: 700, lineHeight: 1.04, letterSpacing: '-0.035em' }, [
            h('div', {}, first),
            h('div', {}, [gradient(second)]),
          ]),
          h('div', { fontSize: 26, color: MUTED, lineHeight: 1.35 }, lede),
        ]),
        h('div', { alignItems: 'center', gap: 14 }, [img(mark, { width: 40, height: 39 }), h('div', { ...monoFace, fontSize: 20, color: FAINT }, url)]),
      ]),
      img(art.src, { width: artWidth, height: Math.round((artWidth * art.height) / art.width) }),
    ]),
  ]);

/**
 * The companies on the homepage card, newest first. ByteDance and TikTok Shop
 * are one employer on the timeline but two names a reader knows; the
 * university is left off, as education rather than a company.
 */
const COMPANIES = ['bytedance', 'tiktok', 'tokopedia', 'invitato', 'ruangguru', 'suara-merdeka'];

/**
 * TikTok has no logo in public/logos (the timeline shows ByteDance's), so its
 * mark is drawn from assets/logos/tiktok.svg — Simple Icons, CC0 — in white on
 * the brand's black tile.
 */
async function tiktokLogo() {
  const path = (await readFile(join(root, 'assets', 'logos', 'tiktok.svg'), 'utf8')).match(/ d="([^"]+)"/)[1];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="-6 -6 36 36"><rect x="-6" y="-6" width="36" height="36" fill="#000"/><path d="${path}" fill="#fff"/></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

const companyLogos = await Promise.all(
  COMPANIES.map(async (name) => {
    const png =
      name === 'tiktok'
        ? await tiktokLogo()
        : await sharp(join(root, 'public', 'logos', 'companies', `${name}.webp`))
            .resize(96, 96, { fit: 'contain', background: '#ffffff' })
            .png()
            .toBuffer();
    return `data:image/png;base64,${png.toString('base64')}`;
  }),
);

/**
 * The homepage card's right half: the hero's code card — the role and where —
 * over the logos of the companies worked with, so the card says what the
 * page does rather than leaving the space to the glow.
 */
const codeCard = () =>
  h('div', { flexDirection: 'column', width: 440, borderRadius: 24, background: '#ffffff', border: '2px solid #dde3ef', padding: '22px 26px 26px', boxShadow: '0 30px 60px -28px rgba(10,18,36,0.35)' }, [
    h('div', { alignItems: 'center', gap: 9, marginBottom: 22 }, [
      ...[A1, A2, '#c9cfdc'].map((c) => h('div', { width: 12, height: 12, borderRadius: 99, background: c }, [])),
      h('div', { ...monoFace, fontSize: 16, color: FAINT, marginLeft: 10 }, 'indrakusuma.md'),
    ]),
    ...[
      ['role', "'Senior Software Engineer'"],
      ['at', "'ByteDance'"],
    ].map(([key, value]) =>
      h('div', { ...monoFace, fontSize: 20, marginBottom: 10 }, [h('span', { color: A1 }, `${key}:\u00a0`), h('span', { color: INK }, value)]),
    ),
    h('div', { ...monoFace, fontSize: 15, color: FAINT, marginTop: 14, marginBottom: 12 }, '// worked with'),
    h('div', { flexWrap: 'wrap', gap: 12 }, companyLogos.map((logo) =>
      h('div', { width: 52, height: 52, borderRadius: 14, background: '#ffffff', border: '1px solid #e2e8f5', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }, [
        img(logo, { width: 40, height: 40, borderRadius: 8 }),
      ]),
    )),
  ]);

const artSize = async (file) => sharp(join(root, file)).metadata();
const [blogMeta, projectsMeta] = await Promise.all([artSize('assets/og/blog-art.png'), artSize('assets/og/projects-art.png')]);

const { PROJECTS, CASE_STUDIES } = await loadSiteCounts();

const cards = {
  home: frame([
    h('div', { width: '100%', alignItems: 'center', justifyContent: 'space-between' }, [
      h('div', { flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: 600 }, [
        img(mark, { width: 52, height: 51 }),
        h('div', { flexDirection: 'column', fontSize: 64, fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.035em' }, [
          h('div', {}, 'I build fast,'),
          h('div', {}, 'scalable'),
          h('div', {}, [gradient('web experiences.')]),
        ]),
        h('div', { alignItems: 'center', gap: 20 }, [
          h('div', { width: 80, height: 80, borderRadius: 999, padding: 4, backgroundImage: `linear-gradient(135deg, ${A1}, ${A3})` }, [
            img(avatar, { width: 72, height: 72, borderRadius: 999, objectFit: 'cover' }),
          ]),
          h('div', { flexDirection: 'column', gap: 6 }, [
            h('div', { fontSize: 29, fontWeight: 700 }, 'Indra Kusuma'),
            h('div', { ...monoFace, fontSize: 19, color: MUTED }, 'indrakusuma.dev'),
          ]),
        ]),
      ]),
      codeCard(),
    ]),
  ]),
  blog: pageCard({
    eyebrow: `Blog · ${await postCount()} posts`,
    first: 'Notes on building',
    second: 'for the web.',
    lede: 'Tutorials, engineering notes and career stories — mostly in Bahasa Indonesia.',
    url: 'indrakusuma.dev/blog',
    art: { src: blogArt, ...blogMeta },
    artWidth: 340,
  }),
  projects: pageCard({
    eyebrow: `${PROJECTS} project${PROJECTS === 1 ? '' : 's'} · ${CASE_STUDIES} case stud${CASE_STUDIES === 1 ? 'y' : 'ies'}`,
    first: 'Built on',
    second: 'the side.',
    lede: 'Small things I make outside work, and write-ups from my professional work — with the numbers.',
    url: 'indrakusuma.dev/projects',
    art: { src: projectsArt, ...projectsMeta },
    artWidth: 370,
  }),
};

/**
 * How many Projects and Case Studies site-data.ts lists. Counted from the
 * source rather than imported: it is TypeScript, and this script runs as plain
 * Node before the build.
 */
async function loadSiteCounts() {
  const source = await readFile(join(root, 'src', 'lib', 'site-data.ts'), 'utf8');
  const block = (name) => source.slice(source.indexOf(`export const ${name}`), source.indexOf('\n];', source.indexOf(`export const ${name}`)));
  return {
    PROJECTS: (block('PROJECTS').match(/^ {4}slug: /gm) ?? []).length,
    CASE_STUDIES: (block('CASE_STUDIES').match(/^ {4}post: /gm) ?? []).length,
  };
}

const outDir = join(root, 'public', 'og');
await mkdir(outDir, { recursive: true });
for (const [name, element] of Object.entries(cards)) {
  const png = Buffer.from(
    await new ImageResponse(element, {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: 'Space Grotesk', data: display, weight: 700, style: 'normal' },
        { name: 'JetBrains Mono', data: mono, weight: 500, style: 'normal' },
      ],
    }).arrayBuffer(),
  );
  const { size } = await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(join(outDir, `${name}.jpg`));
  console.log(`  public/og/${name}.jpg   ${WIDTH}x${HEIGHT}  ${(size / 1024).toFixed(0)} KB`);
}
