import { VDOMType } from "./types";
import { withoutNulls } from "./utils/arrays";

import type { ClassComponent } from "./fiber";
import type {
  ElementVNode,
  ReactElement,
  VNodeChild,
  TextVNode,
  FiberVNode,
  DOMProps,
  FiberProps,
} from "./types";

function createElement(
  tag: string | ClassComponent,
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
      type: VDOMType.COMPONENT,
      tag,
      props,
      children: mapTextNodes(withoutNulls(children)),
    } as FiberVNode;
  }
}

function mapTextNodes(children: VNodeChild[]): ReactElement[] {
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
