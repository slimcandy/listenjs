enum DOMType {
  TEXT = Node.TEXT_NODE,
  ELEMENT = Node.ELEMENT_NODE,
  FRAGMENT = Node.DOCUMENT_FRAGMENT_NODE,
}

enum ARRAY_DIFF_OP {
  ADD = "add",
  REMOVE = "remove",
  MOVE = "move",
  NOOP = "noop",
}

interface Attributes {
  [key: string]: unknown; // For general string attributes like id, title, href, etc.
}

type Props = Attributes & {
  on?: Record<string, EventListener>; // Event listeners
  class?: string | string[]; // CSS classes
  style?: Record<string, string>; // Inline styles
};

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
  domElement?: HTMLElement; // Parent node for fragment
}

type Fiber = TextFiber | ElementFiber | FragmentFiber;
type FiberChild = string | Fiber; // Acceptable child types
type DomElement = Text | HTMLElement;

export {
  DOMType,
  ARRAY_DIFF_OP,
  ElementFiber,
  Fiber,
  FiberChild,
  FragmentFiber,
  Attributes,
  Props,
  TextFiber,
  DomElement,
};
