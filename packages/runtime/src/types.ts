import type { ActionName, ActionPayload } from "./dispatcher";
import type { DOMEventListener } from "./events";
import type { FiberClass, FiberInstance } from "./fiber";

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

type DOMEventName = keyof GlobalEventHandlersEventMap;
/**
 * DOM Event
 * @returns Emit
 */
type DOMEmitGenerator = (event?: Event) => Emit;
type DomEventMap = Partial<Record<DOMEventName, DOMEmitGenerator>>;

type FiberEventName = string;
/**
 * Fiber Event
 * @returns Emit
 */
type FiberEmitGenerator = (actionPayload?: ActionPayload) => Emit;
type FiberEventMap = Record<FiberEventName, FiberEmitGenerator>;

type DOMProps = Attributes & {
  on?: DomEventMap;
  class?: string | string[]; // CSS classes
  style?: Record<string, string>; // Inline styles
};

type FiberProps = Attributes & {
  on?: FiberEventMap;
};

// Virtual DOM node types
interface TextVNode {
  type: VDOMType.TEXT;
  value: string;
  domElement?: Text;
}

interface BaseNode {
  children: VNode[];
  domElement?: HTMLElement;
  listeners?: DOMEventListener;
}

interface FiberVNode extends BaseNode {
  props: FiberProps;
  type: VDOMType.FIBER;
  tag: FiberClass;
  fiberInstance: FiberInstance;
}

interface ElementVNode extends BaseNode {
  props: DOMProps;
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

type State = Record<string, string | number | object>;
type View = (state: State, emit: Emit) => VNode;

type Reducer = (state: State, actionPayload?: ActionPayload) => State;
type Reducers = Record<ActionName, Reducer>;

type Emit = (actionName: ActionName, actionPayload?: ActionPayload) => void;

export {
  VDOMType,
  ARRAY_DIFF_OP,
  type ElementVNode,
  type FiberVNode,
  type VNode,
  type VNodeChild,
  type FragmentVNode,
  type Attributes,
  type FiberEventMap,
  type FiberEventName,
  type FiberEmitGenerator,
  type FiberProps,
  type DOMProps,
  type TextVNode,
  type DomElement,
  type DomEventMap,
  type DOMEventName,
  type DOMEmitGenerator,
  type View,
  type Reducers,
};
