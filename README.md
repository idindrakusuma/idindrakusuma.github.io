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

To preview the production output exactly as Pages will serve it:

```bash
npm run build && npx serve out
```

## Project layout

```
src/
  app/
    layout.tsx        Fonts, metadata, pre-paint theme script
    page.tsx          Section composition
    globals.css       Design tokens, keyframes, component styles
    icon*.png         Favicon (iK logo, 32px + 192px)
    apple-icon.png    iOS home-screen icon (180px)
    robots.ts         robots.txt
    sitemap.ts        sitemap.xml
  components/         One file per section, plus shared behaviour
  lib/site-data.ts    All copy and content
scripts/              Asset generators (see below)
public/               Generated assets, CNAME, .nojekyll
assets/               Logo and photo masters — never served, only built from
```

Content is deliberately separated from presentation: to update a job, an award or
the skills marquee, edit `src/lib/site-data.ts` only.

## Assets

Four generator scripts keep the shipped assets reproducible. Re-run them after
changing a source file or bumping `simple-icons`:

```bash
node scripts/generate-icons.mjs         # tech logos → public/logos/skills
node scripts/prepare-company-logos.mjs  # assets/logos/* → public/logos/companies
node scripts/optimize-profile.mjs       # assets/profile-source.png → public/profile.{webp,jpg}
node scripts/generate-favicon.mjs       # assets/favicon-source.png → src/app/{icon,icon1,apple-icon}.png
```

**Company logos.** To add one, drop the image in `assets/logos/` named after the
company (`tokopedia.jpeg`, `bytedance.png`, …) and run
`node scripts/prepare-company-logos.mjs`. It emits an 80px WebP into
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
