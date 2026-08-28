# indrakusuma.web.id

Personal site of Indra Kusuma — Fullstack Engineer, AI-Native.

Built from the Claude Design prototype (`Personal Website.dc.html`): a single-page
site with an animated aurora background, a floating island nav, a company-grouped
experience timeline, an infinite tech-logo marquee, and dark/light themes that
follow the system preference.

## Stack

- **Next.js 15** (App Router) with `output: 'export'` — the whole site builds to
  static HTML/CSS/JS, which is all GitHub Pages can serve.
- **Tailwind CSS v4** over a CSS-custom-property design system. Every colour token
  lives in `src/app/globals.css` and is re-exported to Tailwind via `@theme inline`,
  so `bg-surface` / `text-muted` / `border-line` re-theme automatically.
- **TypeScript**, strict.
- No runtime dependencies beyond React — fonts, icons and images are all self-hosted.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

| Script              | What it does                                     |
| ------------------- | ------------------------------------------------ |
| `npm run dev`       | Dev server with hot reload                       |
| `npm run build`     | Static export into `out/`                        |
| `npm run lint`      | ESLint (next/core-web-vitals + TypeScript rules) |
| `npm run typecheck` | `tsc --noEmit`                                   |
| `npm run assets`    | Rebuild every generated asset (see below)        |

To preview the production output exactly as Pages will serve it:

```bash
npm run build && npx serve out
```

## Project layout

```
src/
  app/                Routes only
    layout.tsx        Fonts, metadata, pre-paint theme script
    page.tsx          Homepage — section composition
    globals.css       Design tokens, keyframes, component styles
    not-found.tsx     404
    icon*.png         Favicon (iK logo, 32px + 192px)
    apple-icon.png    iOS home-screen icon (180px)
    robots.ts         robots.txt
    sitemap.ts        sitemap.xml
    blog/             Blog index, and the parked post route (see below)
  components/         Markup — one file per section, plus shared pieces
  hooks/              React and DOM glue
  lib/                Framework-free logic and content
    site-data.ts      All homepage copy and content
    marquee.ts        Marquee geometry — pure, no React, no DOM
    posts.ts          Blog content seam
scripts/              Asset generators (see below)
public/               Generated assets, CNAME, .nojekyll
assets/               Logo and photo masters — never served, only built from
```

The three `src/` layers are ordered by what they are allowed to touch: `lib/` uses
neither React nor the DOM, `hooks/` adds both, `components/` adds markup.
Dependencies only ever point that way. The marquee is the worked example — its
geometry is `lib/marquee.ts`, its DOM work is `hooks/useMarquee.ts`, and its two
callers in `components/` supply nothing but rendering.

Content is deliberately separated from presentation: to update a job, an award or
the skills marquee, edit `src/lib/site-data.ts` only.

## Blog

Scaffolding, not yet live. `src/lib/posts.ts` is the seam: it returns an empty
list, and where posts actually come from — MDX in the repo, plain Markdown, a
CMS — is deliberately undecided. `/blog` renders an empty state today, and
`sitemap.ts` already reads the same `getPosts`, so a published post can never be
reachable but unlisted.

`src/app/blog/[slug]/page.tsx.template` is written and verified but **parked**.
A static export refuses a dynamic route whose `generateStaticParams` returns an
empty array — with no posts there are no URLs to emit, and Next reports it as
"missing generateStaticParams()" even though it is right there. Rename it to
`page.tsx` alongside the first post. While parked it is outside the route tree
and outside `tsc`, so it will not be typechecked.

One thing to settle before building this out: `SiteChrome` is a scroll spy over
the homepage's sections and every `NAV_ITEMS` entry is a hash, so it cannot serve
a second route as-is. The blog pages carry a plain back-link instead of the nav.

## Assets

Everything under `public/logos/`, `public/profile.*`, `public/logo-*.webp` and
`src/app/{icon,icon1,apple-icon}.png` is generated from a committed source in
`assets/`. Both sides are in git, so a normal `npm run build` never needs these —
run them after replacing a source file, bumping `simple-icons`, or editing
`SKILL_ROWS`:

```bash
npm run assets            # all five, in order

npm run assets:icons      # SKILL_ROWS → public/logos/skills
npm run assets:logos      # assets/logos/* → public/logos/companies
npm run assets:profile    # assets/profile-source.png → public/profile.{webp,jpg}
npm run assets:favicon    # assets/favicon-source.png → src/app/{icon,icon1,apple-icon}.png
npm run assets:mark       # assets/logo-{light,dark}-source.png → public/logo-{light,dark}.webp
```

They are deterministic: running `npm run assets` on an unchanged tree leaves
`git status` clean, so an unexpected diff means a source actually moved.

**Tech logos.** `SKILL_ROWS` in `src/lib/site-data.ts` is the only list of skills.
`npm run assets:icons` reads it and vendors each mark out of `simple-icons`. A
skill `simple-icons` has no entry for needs `wordmark: true` on it, which renders
the name as text instead; the script exits non-zero if that flag and
`simple-icons` disagree either way, so a typo'd slug fails there rather than
404ing in the marquee.

**Company logos.** To add one, drop the image in `assets/logos/` named after the
company (`tokopedia.jpeg`, `bytedance.png`, …) and run
`npm run assets:logos`. It emits an 80px WebP into
`public/logos/companies/`; point the `logo` field in `src/lib/site-data.ts` at the
new file if the name changed.

Badges are 40 CSS px, which is unforgiving, so the script classifies each source
and treats it accordingly:

| Source | Detected by | Treatment |
| --- | --- | --- |
| Mark on a white card | Light corner pixel | White trimmed off, consistent margin added back — otherwise the source's own margin stacks with the badge's and the mark reads tiny |
| Full-bleed brand tile | Dark/coloured corner pixel | Left alone to fill the badge edge to edge; trimming would eat the tile and leave a floating wordmark |
| Horizontal wordmark | Trimmed aspect ratio > 2 | Side margin dropped so it uses the full width, since it is already starved for height |

All six companies currently have real logos.

**Tech logos.** Pulled from the `simple-icons` package and rendered as flat
silhouettes tinted by the `--logo-filter` token. Any slug missing from the package
falls back to a text wordmark — currently only Lynx.

**Profile photo.** `assets/profile-source.png` is the 1000×1000 master and is not
served; the hero uses an 800px WebP (15 KB).

**Logo mark.** The mark ships as two artworks rather than one file recoloured by CSS:
`assets/logo-light-source.png` is drawn for light surfaces and `assets/logo-dark-source.png`
for dark ones, each with its own art-directed gradients. The two masters differ in canvas
size and transparent padding, so `generate-logo.mjs` trims each to its artwork and
letterboxes both into one shared box — otherwise the mark would shift and resize on every
theme change.

`.ik-mark` paints the result as a background rather than an `<img>`, so only the variant
matching `data-theme` is ever fetched; a pair of `<img>` tags downloads both, and a single
one cannot see `data-theme` to choose. It appears in two places: the right half of the
contact card from the `lg` breakpoint up, and above the footer copyright below the mobile
breakpoint. Both are decorative.

**Favicon.** `assets/favicon-source.png` is the 1254×1254 logo master. The master
has transparent padding and a drop shadow, so the script trims it, re-centres a
square crop and emits the icons into `src/app/`, where Next.js picks them up by file
convention — no `<link>` tags to maintain. The Apple icon is flattened onto the
logo's own background because iOS masks the corners itself.

## Theming

`data-theme` on `<html>` selects the palette. A small inline script in
`layout.tsx` applies the stored choice — or the OS preference when there is no
stored choice — before first paint, so there is no flash. The nav toggle writes to
`localStorage.ik-theme`; until someone toggles it, the site keeps following the OS.

## Deployment

`master` still holds the generated output of the old Hexo blog, and
`indrakusuma.web.id` serves it. Nothing here touches that until you decide to
switch.

- **CI** (`.github/workflows/ci.yml`) runs lint, typecheck and build on every push
  to `develop` and on pull requests.
- **Deploy** (`.github/workflows/deploy.yml`) is `workflow_dispatch` only. Running
  it builds this branch and publishes `out/` to GitHub Pages — which replaces what
  the custom domain serves.

Before the first deploy, switch the repository's Pages source to **GitHub Actions**
(Settings → Pages → Build and deployment → Source). `public/CNAME` keeps the custom
domain attached and `public/.nojekyll` stops Pages from dropping the `_next`
directory.

## Design source

This branch holds the implementation only. The prototype it was built from —
`Personal Website.dc.html` plus the design conversation — lives in the Claude Design
handoff bundle and is not vendored here. The prototype is the visual spec; this
implementation reproduces its output rather than porting its internals (the
prototype's `image-slot` drag-and-drop component and three switchable nav styles
were design-tool affordances and are intentionally absent — the island nav is the
one that shipped).
