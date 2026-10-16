# Blog

How posts are written, published and rendered. Commands are in
[development.md](./development.md#commands).

## Writing a new post

```bash
pnpm new-post "Judul Tulisan" --category Development
```

That writes `content/posts/<slug>.mdx` with the frontmatter filled in and
`draft: true`, and prints what is left to do. `--slug` overrides the URL when the
title makes a poor one. Inside Claude Code, `/write-a-article` does the same and
then helps write.

**Drafts** are served by `pnpm dev` at their real URL and skipped by
`pnpm build`, so a post can exist and be previewed before it has a thumbnail —
which is what would otherwise block the build the moment the file appeared. (A
draft missing from `dev` usually means a `.next` left by a production build:
`rm -rf .next`.)

**To publish:** set `thumbnail`, add `tags` if you want them, delete
`draft: true`.

A post with no image of its own can have one drawn for it:

```bash
pnpm assets:thumbnail <slug>
```

It renders the title and category over the brand gradient in the site's own
faces, writes `public/images/posts/<slug>-thumb.webp`, and points the post at it.
Drawn at the index card's 16/11 with padding that keeps everything inside a
social card's 1.91:1 crop too, so the same file serves both. It refuses to
overwrite a thumbnail that is already set.

`next/og` does the rendering — satori underneath, which emits text as vector
paths, so the result does not depend on the fonts of whatever machine runs it.
The two faces it needs are vendored under `assets/fonts/` (OFL); see the README
there for how they were obtained and why they are static instances.

Four fields are required of a published post, and getting one wrong stops the
build and names the file:

```yaml
---
title: 'Judul Tulisan'
date: '2026-08-29'                 # anything Date can parse
category: Development              # Development · Story · Tutorial · Kuliah · Tips
thumbnail: '/images/posts/x.webp'  # or a remote URL, then `pnpm assets:posts`
---
```

**Images.** Every image opens full size on a click. Two or more images on
consecutive lines (blank lines between, nothing else) become one gallery that
scrolls sideways, and the full-size view steps through it; a single image stays
full width. Nothing to write but the images — `lib/gallery.ts` groups them at
build time.

**A post in two languages** is two files, one URL each. The original keeps the
normal frontmatter; the translation adds `lang` and names the original:

```yaml
lang: en
translationOf: menurunkan-lcp-tiktok-seller-center-part-1
```

Each page is canonical to itself, both carry `hreflang` alternates (in the
`<head>` and the sitemap, with the original as `x-default`), and each links to
the other in its own language. The index lists only the original. A
translation naming a missing post, another translation, or a post in the same
language fails the build.

`excerpt` and `readingMinutes` are optional — without them the first paragraph
becomes the excerpt and the reading time is counted from the body. Write them
only to override.

Nothing else to run. `legacyPath` belongs to the migrated posts alone, so a new
post gets no redirect; the index, the sitemap and the article's "next" link all
read the same `getPosts`, so they pick it up on the next build.

Code fences are highlighted by Shiki through `rehype-pretty-code`, at build time
— the pages are static, so no highlighter reaches the browser. Both themes are
written onto every token as CSS variables and `globals.css` picks one from
`data-theme`, which is how a code block re-colours on the theme toggle without a
second render. The block keeps the design's `--code` surface rather than the
theme's own, and a fence with no language is left as plain monospace.

Posts are in Bahasa Indonesia on an otherwise English site; each article carries
`lang="id"`.

## Claps and sharing

The end of every post has a Clap button and a Share button (`PostActions.tsx`).
Share needs no server: the device's share sheet where there is one, otherwise
copy the link. Claps are the one part of the site that runs on a server — two
Netlify functions storing counts in Netlify Blobs:

| | |
| --- | --- |
| `/api/claps` (`netlify/functions/claps.ts`) | `GET ?slug=` reads a post's claps, `POST` adds to them |
| `/api/claps/top` (`netlify/functions/claps-top.ts`) | The most-clapped posts, cached at the edge for five minutes |

Their rules live in `netlify/claps/core.ts` and are tested by `pnpm test`.

The repository is public, so the limits hold without being secret: 10 claps per
visitor per post (an IPv6 visitor counts per /64), 100 claps per post per hour
from everyone, and a Netlify rate limit of 30 requests a minute per IP. A
visitor is a salted hash of their address, never the address itself.

Every deploy — production and deploy previews alike — reads and writes the one
production store, so a preview shows the real counts and a clap given there is
real. That is why **`CLAP_SALT`** must be set, to the same value, for both the
production and deploy-preview contexts (a secret, functions scope, under the
site's environment variables in Netlify): a preview salted differently would
treat every visitor as new. A context without it can read counts but refuses
to add any.

## Beside the posts

On wide screens the blog index's sidebar is **Popular posts**
(`PopularPosts.tsx`): the most-clapped posts from `/api/claps/top`, topped up
with the newest while fewer than five have claps. Claps decide the order only;
the list shows no counts. The static HTML carries the
newest five, so the list reads — at the same height — before the ranking
arrives or if it never does.

An article's sidebar is its **table of contents** (`TableOfContents.tsx`): its
`##` and `###` headings, the one being read highlighted. The ids and the list
come from the same pass while the post compiles (`src/lib/toc.ts`), so a link
cannot point at a heading that is not there. A post with fewer than two
headings leaves the sidebar empty.

## Where the posts came from

The first 31 posts were migrated out of the Hexo blog that used to live on this repo's
`source-code` branch. `content/posts/*.mdx` is the source of truth; `lib/posts.ts`
reads it at build time, and `sitemap.ts` and the redirects read the same function,
so nothing can be reachable but unlisted.

The migration is recorded rather than remembered:

```bash
node scripts/migrate-posts.mjs   # one-time: source-code branch → content/posts
pnpm assets:posts                # remote images → public/images/posts, rewrites the MDX
pnpm assets:redirects            # old Hexo permalinks → public/_redirects
```

`migrate-posts.mjs` is deliberately **not** in `pnpm assets`: content/posts is
hand-editable now, and re-running would discard those edits. It repairs what Hexo
never validated — single-digit months, an impossible `13:05:97` — and maps Hexo's
six categories onto the five the design filters on, throwing on anything it does
not recognise.

`assets:posts` is safe to re-run: it fetches only URLs that are still remote, and
measures every image into `public/images/posts/manifest.json`. Markdown carries no
image dimensions, so the article reads them from there — an image missing from the
manifest fails the build rather than shipping a layout shift.
