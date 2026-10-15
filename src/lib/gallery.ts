import type { HastNode } from './hast';

const isBlank = (node: HastNode) => node.type === 'text' && !(node.value ?? '').trim();

const isBreak = (node: HastNode) => node.type === 'element' && node.tagName === 'br';
const isImage = (node: HastNode) => node.type === 'element' && node.tagName === 'img';

/**
 * The images a paragraph holds when it holds nothing else — one per line, with
 * or without blank lines between them — or null.
 */
function paragraphImages(node: HastNode): HastNode[] | null {
  if (node.type !== 'element' || node.tagName !== 'p') return null;
  const content = (node.children ?? []).filter((child) => !isBlank(child) && !isBreak(child));
  return content.length > 0 && content.every(isImage) ? content : null;
}

/** Marks every image inside a link, which mdx-components then leaves unzoomable. */
function markLinkedImages(node: HastNode) {
  for (const child of node.children ?? []) {
    if (isImage(child)) child.properties = { ...child.properties, dataInLink: true };
    markLinkedImages(child);
  }
}

/**
 * A rehype plugin that turns a run of two or more images, standing alone on
 * their own lines, into one gallery: `<div class="ik-gallery">` holding the images,
 * which globals.css lays out as a row that scrolls sideways.
 *
 * In Markdown that is just images on consecutive lines, with or without blank
 * lines between, so a post gets a gallery without writing any markup. A single
 * image stays where it was, at full width.
 *
 * It also marks images inside a link: a click there belongs to the link, so
 * those are not wrapped in the zoom button (a button inside a link is invalid,
 * and a click would both open the lightbox and navigate).
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
          const images = paragraphImages(children[j]);
          if (!images) break;
          run.push(...images);
          j += 1;
        }
        if (run.length >= 2) {
          out.push({ type: 'element', tagName: 'div', properties: { className: ['ik-gallery'] }, children: run });
          i = j;
          continue;
        }
        out.push(children[i]);
        if (children[i].type === 'element' && children[i].tagName === 'a') markLinkedImages(children[i]);
        else walk(children[i]);
        i += 1;
      }
      node.children = out;
    };
    walk(tree);
  };
}
