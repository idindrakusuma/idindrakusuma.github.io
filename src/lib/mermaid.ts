type MdastNode = {
  type: string;
  lang?: string | null;
  value?: string;
  children?: MdastNode[];
  [key: string]: unknown;
};

/**
 * A remark plugin that lifts every ```mermaid fence out of the code-block path
 * and hands it to the <Mermaid> component instead.
 *
 * It runs on the Markdown tree, before rehype-pretty-code ever sees the fence —
 * left as a code block, Shiki would highlight the diagram source as text and
 * nothing downstream could tell it apart from any other snippet.
 */
export function remarkMermaid() {
  return (tree: MdastNode) => {
    const walk = (node: MdastNode) => {
      node.children?.forEach((child, i) => {
        if (child.type === 'code' && child.lang === 'mermaid') {
          node.children![i] = {
            type: 'mdxJsxFlowElement',
            name: 'Mermaid',
            attributes: [{ type: 'mdxJsxAttribute', name: 'chart', value: child.value ?? '' }],
            children: [],
          };
          return;
        }
        walk(child);
      });
    };
    walk(tree);
  };
}
