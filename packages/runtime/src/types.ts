enum DOMType {
  TEXT = "text",
  ELEMENT = "element",
  FRAGMENT = "fragment",
}

enum ARRAY_DIFF_OP {
  ADD = "add",
  REMOVE = "remove",
  MOVE = "move",
  NOOP = "noop",
}

interface Props {
  [key: string]: any;
  on?: Record<string, EventListener>; // Event listeners
  class?: string | string[]; // CSS classes
  style?: Record<string, string>; // Inline styles
}

// Fiber node types
interface TextFiber {
  type: DOMType.TEXT;
  value: string;
  domElement?: Text;
}

interface ElementFiber {
  type: DOMType.ELEMENT;
  tag: string;
  props: Props;
  children: Fiber[];
  domElement?: HTMLElement;
  listeners?: Record<string, EventListener>;
}

interface FragmentFiber {
  type: DOMType.FRAGMENT;
  children: Fiber[];
  domElement?: Node; // Parent node for fragment
}

type Fiber = TextFiber | ElementFiber | FragmentFiber;
type FiberChild = string | Fiber; // Acceptable child types

export {
  DOMType,
  ARRAY_DIFF_OP,
  ElementFiber,
  Fiber,
  FiberChild,
  FragmentFiber,
  Props,
  TextFiber,
};
