import {
  DOMType,
  ElementFiber,
  Fiber,
  FiberChild,
  FragmentFiber,
  Props,
  TextFiber,
} from "./types";
import { withoutNulls } from "./utils/arrays";

function createElement(
  tag: string,
  props: Props = {},
  children: FiberChild[] = []
): ElementFiber {
  return {
    type: DOMType.ELEMENT,
    tag,
    props,
    children: mapTextNodes(withoutNulls(children)),
  };
}

function mapTextNodes(children: FiberChild[]): Fiber[] {
  return children.map((child) =>
    typeof child === "string" ? createTextElement(child) : child
  );
}

function createTextElement(text: string): TextFiber {
  return {
    type: DOMType.TEXT,
    value: text,
  };
}

function createFragment(children: FiberChild[]): FragmentFiber {
  return {
    type: DOMType.FRAGMENT,
    children: mapTextNodes(withoutNulls(children)),
  };
}

export { type DOMType, createElement };
