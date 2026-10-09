# AGENTS.md

indrakusuma.dev: Indra Kusuma's personal site — a homepage, a blog and a
projects page. Next.js 16 App Router, statically exported to `out/` and served
by Netlify. The only server code is the blog's clap counter, as Netlify
functions. Setup, commands and the long-form reasons live in
[README.md](./README.md).

## Next.js 16

This Next is newer than most training data. Before using a Next API, read its
guide in `node_modules/next/dist/docs/` and heed deprecation notices.

The site is `output: 'export'`, so anything needing a Node server at request
time is out: route handlers, middleware, ISR, the image optimizer. Dynamic
routes list their paths with `generateStaticParams`. Images are plain `<img>`
(see `PostCard.tsx`), sized from `public/images/posts/manifest.json`.

## Vocabulary

[CONTEXT.md](./CONTEXT.md) is the glossary: Section, Site Chrome, Route Chrome,
Post, Project and the rest. Read it before naming anything — a component, a
type, a nav label, a commit message. When a new term settles, add it there; it
holds meanings only, never implementation.

## Code

- **Layers**: `src/lib/` is framework-free, `src/hooks/` adds React and the
  DOM, `src/components/` adds markup. Imports point down that list, from
  components towards lib.
- **Content** — jobs, capabilities, awards, nav entries, Projects — lives in
  `src/lib/site-data.ts`; components stay presentational.
- **Colour** comes from the CSS tokens in `src/app/globals.css` (`var(--primary)`,
  `var(--surface)`…), which carry both themes. Inline SVG art uses the same
  tokens, so it follows the theme toggle with no second image.
- **Tailwind class lists are whole strings.** Tailwind finds classes by
  scanning the source; a class assembled from parts (`` `pt-[${n}px]` ``) is
  never generated.

## Routes

- `/` is the ordered **Sections**. `SECTIONS` numbers them and feeds the Spy;
  `NAV_ITEMS` adds the route entries (Blog, Projects) without renumbering.
- `/blog`, `/blog/[slug]`, `/projects` and `/projects/[slug]` carry Route
  Chrome (`BlogChrome.tsx`) on top. Every route, the 404 included, ends with
  the shared `Footer`.
- A Project's detail opens as a modal over `/projects` and changes the URL
  with `history.pushState` (`ProjectGallery.tsx`) — the static export rules
  out intercepting routes. `/projects/[slug]` is the same page with the modal
  already open, for shared links and reloads.
- A new route also goes into `src/app/sitemap.ts`, and into `NAV_ITEMS` and the
  footer when visitors should find it.

## Blog

Posts are `content/posts/*.mdx`, written in Bahasa Indonesia on an otherwise
English site. Start one with the `write-a-article` skill; draw a missing
thumbnail with the `generate-thumbnail` skill. The README's Blog section holds
the frontmatter contract, which the build enforces.

## Generated files

`public/` holds generated output; `assets/` holds the masters it is built from.
Change the master or the script in `scripts/` and regenerate with the matching
`pnpm assets:*`, rather than editing the output. `scripts/migrate-posts.mjs`
was a one-time migration — running it again overwrites hand edits to posts.

## Claps

`netlify/functions/` serves `/api/claps`; the rules live in
`netlify/claps/core.ts`, covered by `pnpm test`. Limits and the `CLAP_SALT`
secret are explained in the README.

## Done

pnpm only — `preinstall` refuses the others. A change is done when
`pnpm typecheck`, `pnpm test` and `pnpm build` pass; the build lints first, with
warnings fatal.
