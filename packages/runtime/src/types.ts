import type { ActionName, ActionPayload } from "./dispatcher";
import type { DOMEventListener } from "./events";
import type { ClassComponent, ComponentInstance } from "./fiber";

enum VDOMType {
  TEXT = Node.TEXT_NODE,
  ELEMENT = Node.ELEMENT_NODE,
  FRAGMENT = Node.DOCUMENT_FRAGMENT_NODE,
  COMPONENT = "COMPONENT",
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
  children: ReactElement[];
  listeners?: DOMEventListener;
}

interface FiberVNode extends BaseNode {
  props: FiberProps;
  type: VDOMType.COMPONENT;
  tag: ClassComponent;
  fiberInstance: ComponentInstance;
  domElement?: Text | HTMLElement;
}

interface ElementVNode extends BaseNode {
  props: DOMProps;
  type: VDOMType.ELEMENT;
  tag: string;
  domElement?: HTMLElement;
}

interface FragmentVNode {
  type: VDOMType.FRAGMENT;
  children: ReactElement[];
  domElement?: HTMLElement;
}

type ReactElement = TextVNode | ElementVNode | FiberVNode | FragmentVNode;
type VNodeChild = string | ReactElement; // Acceptable child types
type DomElement = Text | HTMLElement;

type State = Record<string, string | number | object>;
type View = (state: State, emit: Emit) => ReactElement;

type Reducer = (state: State, actionPayload?: ActionPayload) => State;
type Reducers = Record<ActionName, Reducer>;

type Emit = (actionName: ActionName, actionPayload?: ActionPayload) => void;

export {
  VDOMType,
  ARRAY_DIFF_OP,
  type ElementVNode,
  type FiberVNode,
  type ReactElement,
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
