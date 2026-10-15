/** The slice of a hast node the build-time rehype plugins in this folder use. */
export type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};
