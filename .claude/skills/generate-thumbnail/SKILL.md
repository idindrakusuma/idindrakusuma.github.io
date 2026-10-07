---
name: generate-thumbnail
description: Draw an illustrated thumbnail for a blog post on indrakusuma.dev — the site's gradient, the category, a small before→after illustration, and the title. Use when a post needs a thumbnail, when the user asks for one or says a thumbnail looks plain/ugly, and as part of publishing a post with no image of its own.
---

# Generate a thumbnail

A post's thumbnail is its face on the index and in every link preview. The
plain title-only card (`pnpm assets:thumbnail <slug>` with no illustration)
reads as unfinished next to the illustrated ones, so **every new thumbnail gets
an illustration**. Look at two of them before drawing:

- `public/images/posts/software-engineer-2018-vs-era-ai-thumb.webp`
- `public/images/posts/blog-pindah-dari-hexo-ke-nextjs-thumb.webp`
- `public/images/posts/thank-you-claude-startup-program-thumb.webp`

## 1. Pick three ideas

**Always draw three options and let the user pick** — one look is a guess, three
is a choice. Make them different readings of the post, not three colourings of
one drawing. The patterns that have worked:

| Pattern | When | Example (`assets/thumbnails/`) |
| --- | --- | --- |
| **Before → after** | the post is about a change | `thank-you-claude-startup-program.mjs` (Max plan for 2 → Startup Program for 5) |
| **Metaphor** | the change has a feeling — a cost gone, a win | `thank-you-claude-startup-program.gift.mjs` (a charged card → a gift) |
| **Steps** | the post is a story of what happened, in order | `thank-you-claude-startup-program.timeline.mjs` (Threads → form → approved) |

Each panel gets a short `label` (the thing) and a mono `sub` (a year, a number,
a cost). Numbers from the post make the best labels and subs.

## 2. Draw it

Write each option to `assets/thumbnails/<slug>.<name>.mjs` — `<name>` is a word
for the idea (`gift`, `timeline`). Each default-exports:

```js
export default {
  panels: [
    { svg: before, label: 'Hexo', sub: '2017' },
    { svg: after, label: 'Next.js', sub: '2026' },
  ],
  connector: arrow, // drawn between each pair of panels; optional
};
```

The three example files above are working code to copy from. The rules that keep it in the house style:

- **Shapes only in the SVGs.** Labels are set by the generator in Space Grotesk
  and JetBrains Mono; text inside an SVG would not get those faces.
- **Every panel SVG the same `width`/`height`** (around 260×244 for two panels,
  220×220 for three, with a ~110px-wide connector), or the labels
  under them stop lining up. Use `viewBox` padding when a shape needs room —
  strokes touching the edge get clipped.
- **"Before" is translucent white outlines** (`rgba(255,255,255,0.3–0.75)`,
  stroke 4–6, often a stacked/ghosted copy behind). **"After" is solid**: a white
  rounded square (`rx` ≈ 24) with the accent `#c0203f` inside, maybe dark dots
  (`#1a0d12`, white stroke) or a dashed orbit around it.
- Connector: a dotted line (`stroke-dasharray="1 13"`, round caps) ending in a
  white chevron, ~240×48.
- No logos or brand marks of other companies — draw a generic stand-in.

## 3. Render the options and check them

```bash
pnpm assets:thumbnail <slug> --variant <name>   # → .thumbnails/<slug>.<name>.webp, post untouched
```

**Open every preview and look at it** before showing anyone. Check for clipped
shapes, labels that don't line up, and a title that runs to three lines. Iterate
on the `.mjs` until each looks right, then send all three to the user (they are
gitignored, so attach the files) and ask which one.

## 4. Set the chosen one

Rename the chosen file to `assets/thumbnails/<slug>.mjs` and delete the others,
then:

```bash
pnpm assets:thumbnail <slug>          # first time: sets thumbnail in the frontmatter
pnpm assets:thumbnail <slug> --force  # redraw over an existing <slug>-thumb.webp
pnpm assets:posts                     # JPEG share copy + card sizes
```

Commit `<slug>.mjs` with the images so the thumbnail can be redrawn when the
title changes. (The `thank-you-claude-startup-program` alternatives are kept on
purpose, as the examples above.)
