import GithubSlugger from 'github-slugger';

/** One entry in a post's table of contents. */
export type TocItem = { id: string; text: string; depth: 2 | 3 };

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const textOf = (node: HastNode): string =>
  node.type === 'text' ? (node.value ?? '') : (node.children ?? []).map(textOf).join('');

/**
 * A rehype plugin that gives every `##` and `###` heading an id and records it
 * in `into`, in document order.
 *
 * The id written onto the heading and the id the table of contents links to
 * come from this one pass, so they cannot disagree. Slugs are GitHub's, which
 * keeps them readable in a shared URL (#yang-tetap-sama) and makes repeats
 * unique (#tips, #tips-1).
 */
export function rehypeToc(into: TocItem[]) {
  return () => (tree: HastNode) => {
    const slugger = new GithubSlugger();
    const walk = (node: HastNode) => {
      if (node.type === 'element' && (node.tagName === 'h2' || node.tagName === 'h3')) {
        const text = textOf(node).replace(/\s+/g, ' ').trim();
        if (text) {
          const id = slugger.slug(text);
          node.properties = { ...node.properties, id };
          into.push({ id, text, depth: node.tagName === 'h2' ? 2 : 3 });
        }
        return;
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}
