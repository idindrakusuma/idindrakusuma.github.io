# AGENTS.md

indrakusuma.dev: a statically exported Next.js personal site — homepage, blog,
projects. Setup, commands, layout and the blog workflow are in
[README.md](./README.md).

## Vocabulary

[CONTEXT.md](./CONTEXT.md) is the glossary — Section, Site Chrome, Route Chrome,
Post, Project and the rest. Read it before naming anything: a component, a type,
a nav label, a commit message. When a new term settles, add it there; the
glossary holds meanings only, never implementation.

## Where things go

- **Content** — jobs, capabilities, awards, nav entries, Projects — lives in
  `src/lib/site-data.ts`; components stay presentational.
- **Layers**: `lib/` is framework-free, `hooks/` adds React and the DOM,
  `components/` adds markup. Imports point down that list, from components
  towards lib.
- **Posts** are `content/posts/*.mdx`; start one with `pnpm new-post` or the
  `write-a-article` skill.

## Done

A change is done when these pass: `pnpm typecheck`, `pnpm test`, and
`pnpm build` (which lints with warnings fatal). pnpm is enforced by
`preinstall`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
