import { withoutNulls } from "./utils/arrays";

export const DOM_TYPES = {
  TEXT: "text",
  ELEMENT: "element",
  FRAGMENT: "fragment",
} as const;

interface VNode<T extends Tag = Tag> {
  tag?: T;
  props?: Props<T>;
  children?: Children;
  type: (typeof DOM_TYPES)[keyof typeof DOM_TYPES];
  value?: string; // Only for text nodes
}

type Tag = keyof HTMLElementTagNameMap;
type Props<T extends Tag> = Partial<HTMLElementTagNameMap[T]> &
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Record<string, any>;
type Children = Array<string | VNode<keyof HTMLElementTagNameMap> | null>;

function createElement<T extends Tag>(
  tag: T,
  props: Props<T> = {},
  children: Children = []
): VNode<T> {
  return {
    tag,
    props,
    children: mapTextNodes(withoutNulls(children)),
    type: DOM_TYPES.ELEMENT,
  };
}

function mapTextNodes(children: Children): Children {
  return children.map((child) =>
    typeof child === "string" ? createTextElement(child) : child
  );
}

function createTextElement(text: string): VNode {
  return {
    type: DOM_TYPES.TEXT,
    value: text,
  };
}

export { createElement, type VNode, type Tag, type Props, type Children };
