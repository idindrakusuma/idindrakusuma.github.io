# indrakusuma.dev

The personal website of **Indra Kusuma**, a fullstack engineer in Jakarta:
who he is, what he has worked on, and what he writes. Live at
[indrakusuma.dev](https://indrakusuma.dev).

## What's on it

**Homepage.** One page in a few sections: an introduction with the headline
numbers, the experience timeline company by company, the capabilities behind
the work, awards, and how to get in touch.

**Blog.** Tutorials, engineering notes and career stories, mostly in Bahasa
Indonesia, at [/blog](https://indrakusuma.dev/blog).

- Filter by category, with the most-clapped posts beside the list.
- Each article has a table of contents, highlighted code, diagrams, and photo
  galleries that open full size.
- Readers can clap for a post and share it.
- A post can come in two languages, each at its own URL and linked to the
  other.

**Projects.** Things built on the side, like the kids' game collection
[Taman Bermain](https://mini-games.indrakusuma.dev), each with a detail view.
Below them are case studies: work done inside a company, told by a blog post
with the number it moved. At [/projects](https://indrakusuma.dev/projects).

**Throughout.** Light and dark themes that follow the system until you choose,
smooth transitions between pages, and a designed link preview for every page
and post.

## Running it

```bash
corepack enable
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # static site into out/
```

## Documentation

- [docs/development.md](./docs/development.md): the stack, setup, commands,
  code layout, linting and theming.
- [docs/blog.md](./docs/blog.md): writing and publishing posts, images,
  translations, claps and the blog's sidebars.
- [docs/assets.md](./docs/assets.md): generated assets, such as logos, the
  mark, post thumbnails and link-preview cards.
- [CONTEXT.md](./CONTEXT.md): the words the code and its docs use.
- [AGENTS.md](./AGENTS.md): working notes for coding agents.
