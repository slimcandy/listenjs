import { withoutNulls } from "./utils/arrays";

export const DOM_TYPES = {
  LISTEN_TEXT_TYPE: "text",
  LISTEN_ELEMENT_TYPE: "element",
  LISTEN_FRAGMENT_TYPE: "fragment",
} as const;

interface ListenElement<T extends Tag = Tag> {
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
type Children = Array<
  string | ListenElement<keyof HTMLElementTagNameMap> | null
>;

function createElement<T extends Tag>(
  tag: T,
  props: Props<T> = {},
  children: Children = []
): ListenElement<T> {
  return {
    type: DOM_TYPES.LISTEN_ELEMENT_TYPE,
    tag,
    props,
    children: mapTextNodes(withoutNulls(children)),
  };
}

function mapTextNodes(children: Children): Children {
  return children.map((child) =>
    typeof child === "string" ? createTextElement(child) : child
  );
}

function createTextElement(text: string): ListenElement {
  return {
    type: DOM_TYPES.LISTEN_TEXT_TYPE,
    value: text,
  };
}

function createFragment(children: Children): ListenElement {
  return {
    type: DOM_TYPES.LISTEN_FRAGMENT_TYPE,
    children: mapTextNodes(withoutNulls(children)),
  };
}

export {
  createElement,
  type ListenElement,
  type Tag,
  type Props,
  type Children,
};
