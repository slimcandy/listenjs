import {
  VDOMType,
  ElementVNode,
  VNode,
  VNodeChild,
  Props,
  TextVNode,
} from "./types";
import { withoutNulls } from "./utils/arrays";

function createElement(
  tag: string,
  props: Props = {},
  children: VNodeChild[] = []
): ElementVNode {
  return {
    type: VDOMType.ELEMENT as const,
    tag,
    props,
    children: mapTextNodes(withoutNulls(children)),
  };
}

function mapTextNodes(children: VNodeChild[]): VNode[] {
  return children.map((child) =>
    typeof child === "string" ? createTextElement(child) : child
  );
}

function createTextElement(text: string): TextVNode {
  return {
    type: VDOMType.TEXT as const,
    value: text,
  };
}

export { createElement };
