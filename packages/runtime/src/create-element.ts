import {
  VDOMType
} from "./types";
import { withoutNulls } from "./utils/arrays";

import type { FiberClass } from "./fiber";
import type {
  ElementVNode,
  VNode,
  VNodeChild,
  TextVNode,
  FiberVNode,
  DOMProps,
  FiberProps} from "./types";

function createElement(
  tag: string | FiberClass,
  props: DOMProps | FiberProps = {},
  children: VNodeChild[] = []
): ElementVNode | FiberVNode {
  if (typeof tag === "string") {
    return {
      type: VDOMType.ELEMENT,
      tag,
      props,
      children: mapTextNodes(withoutNulls(children)),
    } as ElementVNode;
  } else {
    return {
      type: VDOMType.FIBER,
      tag,
      props,
      children: mapTextNodes(withoutNulls(children)),
    } as FiberVNode;
  }
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
