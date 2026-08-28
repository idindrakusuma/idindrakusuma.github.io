# indrakusuma.web.id

Personal site of Indra Kusuma. Next.js 15 App Router with `output: 'export'`, so
the whole site builds to static HTML for GitHub Pages. Tailwind v4 over CSS custom
properties, TypeScript strict. Fonts, icons and images are self-hosted; the only
third-party runtime code is the analytics tag.

[CONTEXT.md](./CONTEXT.md) defines the domain terms — Section, Marquee, Post — and
is the place to look before naming anything new.

## Setup

```bash
corepack enable   # pins pnpm to the version in `packageManager`
pnpm install
```

pnpm is not a preference here — `preinstall` refuses any other package manager,
and `.nvmrc` pins Node. Both are there because `packageManager` alone declared
pnpm for months while the committed lockfile was npm's.

## Commands

| | |
| --- | --- |
| `pnpm dev` | Dev server on :3000 |
| `pnpm build` | Static export into `out/` |
| `pnpm lint` | oxlint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm assets` | Rebuild every generated asset |

## Linting

[oxlint](https://oxc.rs) replaces ESLint here, configured in `.oxlintrc.json`
with the `nextjs`, `react`, `jsx-a11y`, `import` and `typescript` plugins.
Coverage was checked rule by rule against the `next/core-web-vitals` config it
replaced: 68 of its 71 active rules have an oxlint equivalent — including all 21
`@next/next` rules, one for one — and the three that do not are inert here
(`jsx-uses-react` and `jsx-uses-vars` belong to the old JSX transform,
`require-render-return` to class components).

`rules-of-hooks` is listed explicitly in `rules` because it is not in oxlint's
default `correctness` category. Without that line only `exhaustive-deps` fires,
which is the more forgiving half of the pair — verified both ways.

Linting is a build step (`oxlint --deny-warnings && next build`) rather than
something Next runs for us, so it still gates the Netlify deploy now that
`next build` no longer lints. Warnings are fatal: a gate that only reports is a
gate nobody reads.

Two suppressions, both in `.oxlintrc.json` with the reason next to them:
`Reveal.tsx` passes a ref object into `createElement` (it never reads `.current`)
and sets state in an effect as an `IntersectionObserver` fallback, and
`generate-icons.mjs` looks up icons by computed key, which is the whole point of
deriving an export name from a slug.

## Layout

```
src/
  app/          Routes. layout.tsx, page.tsx, not-found.tsx, blog/,
                globals.css (tokens + keyframes), robots.ts, sitemap.ts, icons
  components/   Markup — one file per Section, plus shared pieces
  hooks/        React and DOM glue
  lib/          Framework-free logic and content
                site-data.ts · marquee.ts · posts.ts
scripts/        Asset generators
public/         Generated assets, CNAME, .nojekyll
assets/         Masters — never served, only built from
```

The three `src/` layers are ordered by what each is allowed to touch: `lib/` uses
neither React nor the DOM, `hooks/` adds both, `components/` adds markup.
Dependencies only ever point that way. The marquee spans all three and is the
worked example — geometry in `lib/marquee.ts`, DOM work in `hooks/useMarquee.ts`,
and two callers in `components/` that supply nothing but rendering.

To change a job, an award or the skills list, edit `src/lib/site-data.ts` only.

## Blog

Scaffolding, not yet live. `lib/posts.ts` is the seam: `getPosts`/`getPost` return
nothing yet, and where posts actually come from — MDX, Markdown, a CMS — is
deliberately undecided. `/blog` renders an empty state, and `sitemap.ts` reads the
same `getPosts`, so a published post can never be reachable but unlisted.

`app/blog/[slug]/page.tsx.template` is written and verified but **parked**: a
static export refuses a dynamic route whose `generateStaticParams` returns an
empty array, and reports it as "missing generateStaticParams()" even though it is
right there. Rename it to `page.tsx` alongside the first post. While parked it is
outside both the route tree and `tsc`.

## Theming

`data-theme` on `<html>` selects the palette. Tokens live in `globals.css` and
reach Tailwind through `@theme inline`, so `bg-surface` / `text-muted` /
`border-line` re-theme themselves. An inline script in `layout.tsx` applies the
stored choice — or the OS preference when there is none — before first paint, so
there is no flash. The nav toggle writes `localStorage.ik-theme`; until someone
toggles it, the site keeps following the OS.

## Assets

Everything under `public/logos/`, `public/profile.*`, `public/logo-*.webp` and
`src/app/{icon,icon1,apple-icon}.png` is generated from a committed master in
`assets/`. Both sides are in git, so `pnpm build` never needs these — re-run
after replacing a master, bumping `simple-icons`, or editing `SKILL_ROWS`:

```bash
pnpm assets            # all five, in order

pnpm assets:icons      # SKILL_ROWS → public/logos/skills
pnpm assets:logos      # assets/logos/* → public/logos/companies
pnpm assets:profile    # assets/profile-source.png → public/profile.{webp,jpg}
pnpm assets:favicon    # assets/favicon-source.png → src/app/{icon,icon1,apple-icon}.png
pnpm assets:mark       # assets/logo-{light,dark}-source.png → public/logo-{light,dark}.webp
```

They are deterministic: `pnpm assets` on an unchanged tree leaves `git status`
clean, so an unexpected diff means a master actually moved.

**Tech logos.** `SKILL_ROWS` is the only list of skills. A slug `simple-icons` has
no mark for needs `wordmark: true` on it, which renders the name as text instead;
the script exits non-zero if that flag and `simple-icons` disagree in either
direction, so a typo'd slug fails the run rather than 404ing in the marquee.

**Company logos.** Drop the image in `assets/logos/` named after the company and
run `pnpm assets:logos`. Badges are 40 CSS px, which is unforgiving, so each
source is classified and treated accordingly:

| Source | Detected by | Treatment |
| --- | --- | --- |
| Mark on a white card | Light corner pixel | White trimmed off, consistent margin added back |
| Full-bleed brand tile | Dark or coloured corner pixel | Left alone to fill the badge edge to edge |
| Horizontal wordmark | Trimmed aspect ratio > 2 | Side margin dropped to use the full width |

**Logo mark.** Ships as two artworks rather than one file recoloured by CSS, each
with its own art-directed gradients. The masters differ in canvas size and
padding, so `assets:mark` trims each to its artwork and letterboxes both into one
shared box — otherwise the mark would shift and resize on every theme change.
`.ik-mark` paints the result as a background, so only the variant matching
`data-theme` is ever fetched.

Each script's header documents the rest of its reasoning.
