type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const textOf = (node: HastNode): string =>
  node.type === 'text' ? (node.value ?? '') : (node.children ?? []).map(textOf).join('');

const elements = (node: HastNode, tagName: string): HastNode[] =>
  (node.children ?? []).flatMap((child) =>
    child.type !== 'element' ? [] : child.tagName === tagName ? [child] : elements(child, tagName),
  );

/**
 * A rehype plugin that copies each table's column headings onto its cells, as
 * `data-label`.
 *
 * On a phone a post's table stops being a grid: each row becomes a card, and a
 * cell can no longer sit under its heading, so it carries the heading itself
 * (globals.css shows it with `attr(data-label)`). Copied at build time from
 * the one header row Markdown tables have, so the label cannot drift from the
 * column it names.
 */
export function rehypeTableLabels() {
  return (tree: HastNode) => {
    for (const table of elements(tree, 'table')) {
      const [head] = elements(table, 'thead');
      const labels = head ? elements(head, 'th').map((th) => textOf(th).replace(/\s+/g, ' ').trim()) : [];
      if (labels.length === 0) continue;
      for (const body of elements(table, 'tbody')) {
        for (const row of elements(body, 'tr')) {
          elements(row, 'td').forEach((cell, i) => {
            if (labels[i]) cell.properties = { ...cell.properties, dataLabel: labels[i] };
          });
        }
      }
    }
  };
}
