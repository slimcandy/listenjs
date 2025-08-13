import { FiberClass, FiberInstance } from "./fiber";

enum VDOMType {
  TEXT = Node.TEXT_NODE,
  ELEMENT = Node.ELEMENT_NODE,
  FRAGMENT = Node.DOCUMENT_FRAGMENT_NODE,
  FIBER = "FIBER",
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

// Virtual DOM node types
interface TextVNode {
  type: VDOMType.TEXT;
  value: string;
  domElement?: Text;
}

interface BaseNode {
  props: Props;
  children: VNode[];
  domElement?: HTMLElement;
  listeners?: Record<string, EventListener>;
}

interface FiberVNode extends BaseNode {
  type: VDOMType.FIBER;
  tag: FiberClass;
  fiberInstance: FiberInstance;
}

interface ElementVNode extends BaseNode {
  type: VDOMType.ELEMENT;
  tag: string;
}

interface FragmentVNode {
  type: VDOMType.FRAGMENT;
  children: VNode[];
  domElement?: HTMLElement; // Parent node for fragment
}

type VNode = TextVNode | ElementVNode | FiberVNode | FragmentVNode;
type VNodeChild = string | VNode; // Acceptable child types
type DomElement = Text | HTMLElement;

export {
  VDOMType,
  ARRAY_DIFF_OP,
  ElementVNode,
  FiberVNode,
  VNode,
  VNodeChild,
  FragmentVNode,
  Attributes,
  Props,
  TextVNode,
  DomElement,
};
