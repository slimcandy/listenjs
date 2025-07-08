import {
  DOMType,
  ElementFiber,
  Fiber,
  FiberChild,
  Props,
  TextFiber,
} from "./types";
import { withoutNulls } from "./utils/arrays";

function createFiber(
  tag: string,
  props: Props = {},
  children: FiberChild[] = []
): ElementFiber {
  return {
    type: DOMType.ELEMENT as const,
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
    type: DOMType.TEXT as const,
    value: text,
  };
}

export { createFiber };
