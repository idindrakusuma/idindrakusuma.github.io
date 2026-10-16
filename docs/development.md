# Development

How the site is built and how to work on it. What the site *is* lives in the
[README](../README.md); the domain terms — Section, Post, Project, Case Study
and the rest — are in [CONTEXT.md](../CONTEXT.md), the place to look before
naming anything new.

Next.js 16 App Router with `output: 'export'`, so the whole site builds to
static HTML, served by Netlify. Tailwind v4 over CSS custom properties,
TypeScript strict. Fonts, icons and images are self-hosted; the only
third-party runtime code is the analytics tag, and the only server code is the
clap counter (see [blog.md](./blog.md#claps-and-sharing)).

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
| `pnpm test` | Clap counter rules |
| `pnpm assets` | Rebuild every generated asset |
| `pnpm new-post` | Scaffold a new blog post |
| `pnpm assets:posts` | Vendor blog images and measure them |
| `pnpm assets:thumbnail` | Draw a thumbnail for a post that has no image |
| `pnpm assets:og` | Draw the link-preview cards for `/`, `/blog` and `/projects` (also run by `pnpm build`) |

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

One suppression, in `.oxlintrc.json` with the reason next to it: `Reveal.tsx`
passes a ref object into `createElement` (it never reads `.current`) and sets
state in an effect as an `IntersectionObserver` fallback.

## Layout

```
src/
  app/          Routes. layout.tsx, page.tsx, not-found.tsx, blog/, projects/,
                globals.css (tokens + keyframes), robots.ts, sitemap.ts, icons
  components/   Markup — one file per Section, plus shared pieces
  hooks/        React and DOM glue
  lib/          Framework-free logic and content
                site-data.ts · marquee.ts · posts.ts
content/posts/  Blog posts as MDX — the source of truth
scripts/        Asset generators
public/         Generated assets, _redirects, CNAME, .nojekyll
assets/         Masters — never served, only built from
```

The three `src/` layers are ordered by what each is allowed to touch: `lib/` uses
neither React nor the DOM, `hooks/` adds both, `components/` adds markup.
Dependencies only ever point that way. The marquee spans all three and is the
worked example — geometry in `lib/marquee.ts`, DOM work in `hooks/useMarquee.ts`,
and a caller in `components/` that supplies nothing but rendering.

To change a job, an award or a capability, edit `src/lib/site-data.ts` only.

## Theming

`data-theme` on `<html>` selects the palette. Tokens live in `globals.css` and
reach Tailwind through `@theme inline`, so `bg-surface` / `text-muted` /
`border-line` re-theme themselves. An inline script in `layout.tsx` applies the
stored choice — or the OS preference when there is none — before first paint, so
there is no flash. The nav toggle writes `localStorage.ik-theme`; until someone
toggles it, the site keeps following the OS.

## More

- [blog.md](./blog.md): writing posts, their frontmatter, images, translations,
  claps and the blog's sidebars.
- [assets.md](./assets.md): generated assets — logos, the mark, post
  thumbnails and link-preview cards.
