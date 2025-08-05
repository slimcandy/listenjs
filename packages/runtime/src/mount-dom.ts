import { attachEventListeners } from "./events";
import { Fiber } from "./fiber";
import { setProp } from "./set-prop";
import {
  VDOMType,
  DomElement,
  ElementVNode,
  FragmentVNode,
  Props,
  TextVNode,
  VNode,
} from "./types";

function mountDOM(
  vNode: VNode,
  parentDOMNode: HTMLElement,
  positionIndex: number | null = null,
  parentFiber: Fiber | null = null
) {
  if (parentDOMNode == undefined) {
    throw new Error(`
      "Parent element is not defined: ${parentDOMNode}`);
  }

  switch (vNode.type) {
    case VDOMType.TEXT:
      createTextInstance(vNode, parentDOMNode, positionIndex);
      break;
    case VDOMType.ELEMENT:
      createInstance(vNode, parentDOMNode, positionIndex, parentFiber);
      break;
    case VDOMType.FRAGMENT:
      createFragmentInstance(vNode, parentDOMNode, positionIndex, parentFiber);
      break;
    default:
      throw new Error(`Unknown vNode type`);
  }
}

function createTextInstance(
  vNode: TextVNode,
  parentDOMNode: HTMLElement,
  positionIndex: number | null
) {
  const { value } = vNode;
  const domTextNode = document.createTextNode(value);
  vNode.domElement = domTextNode;

  insertIntoDOM(domTextNode, parentDOMNode, positionIndex);
}

function createFragmentInstance(
  vNode: FragmentVNode,
  parentDOMNode: HTMLElement,
  positionIndex: number | null,
  parentFiber: Fiber | null = null
) {
  const { children } = vNode;
  vNode.domElement = parentDOMNode;

  children.forEach((child, index) => {
    mountDOM(
      child,
      parentDOMNode,
      positionIndex ? positionIndex + index : null,
      parentFiber
    );
  });
}

function createInstance(
  vNode: ElementVNode,
  parentDOMNode: HTMLElement,
  positionIndex: number | null,
  parentFiber: Fiber | null = null
) {
  const { tag, props, children } = vNode;

  const domElement = document.createElement(tag);
  setInitialProperties(domElement, props, vNode, parentFiber);
  vNode.domElement = domElement;

  children.forEach((child) => {
    mountDOM(child, domElement, null, parentFiber);
  });

  return insertIntoDOM(domElement, parentDOMNode, positionIndex);
}

function setInitialProperties(
  domElement: HTMLElement,
  props: Props,
  vNode: ElementVNode,
  parentFiber: Fiber | null
) {
  const { on: events, ...attrs } = props;

  if (events) {
    vNode.listeners = attachEventListeners(events, domElement, parentFiber);
  }
  setProp(domElement, attrs);
}

function insertIntoDOM(
  domElement: DomElement,
  parentDOMNode: Node,
  positionIndex: number | null
) {
  if (positionIndex == null) {
    return parentDOMNode.appendChild(domElement);
  }

  if (positionIndex < 0) {
    throw new Error(
      `Position Index must be positive integer, but got ${positionIndex}`
    );
  }

  const children = parentDOMNode.childNodes;

  if (positionIndex >= children.length) {
    parentDOMNode.appendChild(domElement);
  } else {
    parentDOMNode.insertBefore(domElement, children[positionIndex]);
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
