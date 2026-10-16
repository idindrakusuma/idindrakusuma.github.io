# Assets

Everything under `public/logos/`, `public/profile.*`, `public/logo-*.webp` and
`src/app/{icon,icon1,apple-icon}.png` is generated from a committed master in
`assets/`. Both sides are in git, so `pnpm build` never needs these — re-run
after replacing a master:

```bash
pnpm assets            # all of them, in order

pnpm assets:logos      # assets/logos/* → public/logos/companies
pnpm assets:profile    # assets/profile-source.png → public/profile.{webp,jpg}
pnpm assets:favicon    # assets/favicon-source.png → src/app/{icon,icon1,apple-icon}.png
pnpm assets:mark       # assets/logo-{light,dark}-source.png → public/logo-{light,dark}.webp
```

They are deterministic: `pnpm assets` on an unchanged tree leaves `git status`
clean, so an unexpected diff means a master actually moved.

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


**Post thumbnails.** `pnpm assets:thumbnail <slug>` draws one for a post with no
image of its own; see [blog.md](./blog.md#writing-a-new-post) and the
`generate-thumbnail` skill.

**Link-preview cards.** `pnpm assets:og` draws the 1200×630 cards for `/`,
`/blog` and `/projects` into `public/og/` (`scripts/generate-og-images.mjs`).
`pnpm build` runs it first, so the post and case-study counts on them are never
behind. The blog and projects illustrations they carry are captured from the
inline SVG into `assets/og/*-art.png`.

Each script's header documents the rest of its reasoning.
