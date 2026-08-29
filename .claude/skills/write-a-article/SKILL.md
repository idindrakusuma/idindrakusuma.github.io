---
name: write-a-article
description: Start a new blog post for indrakusuma.web.id. Scaffolds content/posts/<slug>.mdx with its frontmatter filled in and a draft flag, so the next thing to do is write. Use when the user wants to write, draft, or start a new article or blog post.
---

# Write an article

Scaffold a post, then help write it. The point is that the author spends their
attention on prose, not on frontmatter.

## 1. Find out what it is about

You need two things, and only two:

- **Title** — as it should read on the page. Indonesian is normal here; the
  posts are in Bahasa Indonesia even though the site's chrome is English.
- **Category** — one of `Development`, `Story`, `Tutorial`, `Kuliah`, `Tips`.

If the user's message already carries both, don't ask. If it carries a topic but
no title, suggest two or three titles rather than asking them to invent one on
the spot. If the category is obvious from the topic, pick it and say which you
picked — a wrong guess costs one word to correct.

## 2. Scaffold it

```bash
pnpm new-post "<title>" --category <Category>
```

Add `--slug <slug>` only when the title makes a bad URL — a long title, or one
whose meaning does not survive being hyphenated.

The script refuses to overwrite an existing post. If the slug is taken, that is
usually a sign the user is continuing something rather than starting it; open
that file instead of forcing a new one.

## 3. Write

Open the new file and draft with them. What matters about the shape:

- **The first paragraph is doing two jobs.** It is the excerpt on the index and
  the lead above the article, so it should read as a one-paragraph summary that
  can stand alone — not as a warm-up sentence.
- `## ` headings carry the structure. `###` exists but the design gives it much
  less weight; prefer flatter documents.
- Code fences are highlighted by Shiki at build time, so **label the language** —
  an unlabelled fence renders as plain monospace. `js`, `jsx`, `php`, `bash` and
  `json` are already in use. Keep samples short enough to read as prose.
- Images go in as normal Markdown. A remote URL is fine while drafting — running
  `pnpm assets:posts` later fetches it into the repo, re-encodes it as WebP,
  measures it, and rewrites the link.

Write in the user's voice, not a house style. These are personal posts, and the
existing 31 are informal and first-person. Read one or two before drafting if
you are unsure of the register.

## 4. Preview

`pnpm dev` serves drafts at their real URL. `pnpm build` skips them, so an
unfinished post cannot reach the sitemap or the live site.

If a draft does not appear, the usual cause is a `.next` left behind by a
production build — `rm -rf .next` and start dev again.

## 5. Publishing

Only when the user says it is ready:

1. Set `thumbnail`. Three ways, in order of preference:
   - a path under `/images/posts/`, or a URL followed by `pnpm assets:posts`
   - `pnpm assets:thumbnail <slug>` to draw one from the post's title and
     category, in the site's gradient and typeface, when there is no image to use
   Required either way; the build fails without it and names the file.
2. Add `tags` if they want them. Optional, and free-form.
3. Delete `draft: true`.
4. `pnpm build` to confirm.

`excerpt` and `readingMinutes` stay absent unless the user wants to override
what is derived — the first paragraph and a word count respectively.

Do not commit or push unless asked.
