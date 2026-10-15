type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const isBlank = (node: HastNode) => node.type === 'text' && !(node.value ?? '').trim();

/** The image a paragraph holds when it holds nothing else, or null. */
function loneImage(node: HastNode): HastNode | null {
  if (node.type !== 'element' || node.tagName !== 'p') return null;
  const content = (node.children ?? []).filter((child) => !isBlank(child));
  return content.length === 1 && content[0].type === 'element' && content[0].tagName === 'img' ? content[0] : null;
}

/**
 * A rehype plugin that turns a run of two or more images, each alone in its own
 * paragraph, into one gallery: `<div class="ik-gallery">` holding the images,
 * which globals.css lays out as a row that scrolls sideways.
 *
 * In Markdown that is just images on consecutive lines, blank lines between —
 * the way a post already writes them — so a post gets a gallery without
 * writing any markup. A single image stays where it was, at full width.
 */
export function rehypeGallery() {
  return (tree: HastNode) => {
    const walk = (node: HastNode) => {
      const children = node.children;
      if (!children) return;
      const out: HastNode[] = [];
      for (let i = 0; i < children.length; ) {
        const run: HastNode[] = [];
        let j = i;
        while (j < children.length) {
          if (isBlank(children[j])) {
            j += 1;
            continue;
          }
          const image = loneImage(children[j]);
          if (!image) break;
          run.push(image);
          j += 1;
        }
        if (run.length >= 2) {
          out.push({ type: 'element', tagName: 'div', properties: { className: ['ik-gallery'] }, children: run });
          i = j;
          continue;
        }
        out.push(children[i]);
        walk(children[i]);
        i += 1;
      }
      node.children = out;
    };
    walk(tree);
  };
}
