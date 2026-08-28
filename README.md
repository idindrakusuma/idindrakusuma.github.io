# indrakusuma.web.id

Personal site of Indra Kusuma. Next.js 15 App Router with `output: 'export'`, so
the whole site builds to static HTML for GitHub Pages. Tailwind v4 over CSS custom
properties, TypeScript strict. Fonts, icons and images are self-hosted; the only
third-party runtime code is the analytics tag.

[CONTEXT.md](./CONTEXT.md) defines the domain terms — Section, Marquee, Post — and
is the place to look before naming anything new.

## Commands

| | |
| --- | --- |
| `npm run dev` | Dev server on :3000 |
| `npm run build` | Static export into `out/` |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run assets` | Rebuild every generated asset |

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
`assets/`. Both sides are in git, so `npm run build` never needs these — re-run
after replacing a master, bumping `simple-icons`, or editing `SKILL_ROWS`:

```bash
npm run assets            # all five, in order

npm run assets:icons      # SKILL_ROWS → public/logos/skills
npm run assets:logos      # assets/logos/* → public/logos/companies
npm run assets:profile    # assets/profile-source.png → public/profile.{webp,jpg}
npm run assets:favicon    # assets/favicon-source.png → src/app/{icon,icon1,apple-icon}.png
npm run assets:mark       # assets/logo-{light,dark}-source.png → public/logo-{light,dark}.webp
```

They are deterministic: `npm run assets` on an unchanged tree leaves `git status`
clean, so an unexpected diff means a master actually moved.

**Tech logos.** `SKILL_ROWS` is the only list of skills. A slug `simple-icons` has
no mark for needs `wordmark: true` on it, which renders the name as text instead;
the script exits non-zero if that flag and `simple-icons` disagree in either
direction, so a typo'd slug fails the run rather than 404ing in the marquee.

**Company logos.** Drop the image in `assets/logos/` named after the company and
run `npm run assets:logos`. Badges are 40 CSS px, which is unforgiving, so each
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
