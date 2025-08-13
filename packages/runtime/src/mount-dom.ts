import { attachEventListeners } from "./events";
import { FiberInstance } from "./fiber";
import { setProp } from "./set-prop";
import {
  VDOMType,
  DomElement,
  ElementVNode,
  FragmentVNode,
  Props,
  TextVNode,
  VNode,
  FiberVNode,
} from "./types";

function mountDOM(
  vNode: VNode,
  parentDOMElement: HTMLElement,
  positionIndex: number | null = null,
  parentFiberInstance: FiberInstance | null = null
) {
  if (parentDOMElement == undefined) {
    throw new Error(`
      "Parent element is not defined: ${parentDOMElement}`);
  }

  switch (vNode.type) {
    case VDOMType.TEXT:
      createDOMElementFromTextNode(vNode, parentDOMElement, positionIndex);
      break;
    case VDOMType.ELEMENT:
      createDOMElementFromElementNode(
        vNode,
        parentDOMElement,
        positionIndex,
        parentFiberInstance
      );
      break;
    case VDOMType.FRAGMENT:
      createDOMElementFromFragmentNode(
        vNode,
        parentDOMElement,
        positionIndex,
        parentFiberInstance
      );
      break;
    case VDOMType.FIBER:
      createDOMElementFromFiberNode(
        vNode,
        parentDOMElement,
        positionIndex,
        parentFiberInstance
      );
      break;
    default:
      throw new Error(`Unknown vNode type`);
  }
}

function createDOMElementFromTextNode(
  vNode: TextVNode,
  parentDOMElement: HTMLElement,
  positionIndex: number | null
) {
  const { value } = vNode;
  const domTextNode = document.createTextNode(value);
  vNode.domElement = domTextNode;

  insertIntoDOM(domTextNode, parentDOMElement, positionIndex);
}

function createDOMElementFromFragmentNode(
  vNode: FragmentVNode,
  parentDOMElement: HTMLElement,
  positionIndex: number | null,
  parentFiberInstance: FiberInstance | null = null
) {
  const { children } = vNode;
  vNode.domElement = parentDOMElement;

  children.forEach((child, index) => {
    mountDOM(
      child,
      parentDOMElement,
      positionIndex ? positionIndex + index : null,
      parentFiberInstance
    );
  });
}

function createDOMElementFromElementNode(
  vNode: ElementVNode,
  parentDOMElement: HTMLElement,
  positionIndex: number | null,
  parentFiberInstance: FiberInstance | null = null
) {
  const { tag, props, children } = vNode;

  const domElement = document.createElement(tag);
  setInitialProperties(domElement, props, vNode, parentFiberInstance);
  vNode.domElement = domElement;

  children.forEach((child) => {
    mountDOM(child, domElement, null, parentFiberInstance);
  });

  return insertIntoDOM(domElement, parentDOMElement, positionIndex);
}

function createDOMElementFromFiberNode(
  vNode: FiberVNode,
  parentDOMElement: HTMLElement,
  positionIndex: number | null,
  parentFiberInstance: FiberInstance | null = null
) {
  const FiberClass = vNode.tag;
  const props = vNode.props;
  const fiberInstance = new FiberClass(props);

  fiberInstance.mount(parentDOMElement, positionIndex);
  vNode.fiberInstance = fiberInstance;
  vNode.domElement = fiberInstance.firstDOMElement;
}

function setInitialProperties(
  domElement: HTMLElement,
  props: Props,
  vNode: ElementVNode,
  parentFiberInstance: FiberInstance | null
) {
  const { on: events, ...attrs } = props;

  if (events) {
    vNode.listeners = attachEventListeners(
      events,
      domElement,
      parentFiberInstance
    );
  }
  setProp(domElement, attrs);
}

function insertIntoDOM(
  domElement: DomElement,
  parentDOMElement: Node,
  positionIndex: number | null
) {
  if (positionIndex == null) {
    return parentDOMElement.appendChild(domElement);
  }

  if (positionIndex < 0) {
    throw new Error(
      `Position Index must be positive integer, but got ${positionIndex}`
    );
  }

  const children = parentDOMElement.childNodes;

  if (positionIndex >= children.length) {
    parentDOMElement.appendChild(domElement);
  } else {
    parentDOMElement.insertBefore(domElement, children[positionIndex]);
  }
}

function extractChildren(vNode: VNode) {
  if ("children" in vNode) {
    const children: VNode[] = [];

    for (const child of vNode.children) {
      if (child.type === VDOMType.FRAGMENT) {
        children.push(...extractChildren(child));
      } else {
        children.push(child);
      }
    }

    return children;
  }
  return [];
}

export { mountDOM, extractChildren };
