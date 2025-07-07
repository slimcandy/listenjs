import { attachEventListeners } from "./events";
import { setProp } from "./set-prop";
import {
  DOMType,
  DomElement,
  ElementFiber,
  Fiber,
  FragmentFiber,
  Props,
  TextFiber,
} from "./types";

function mountHostComponent(
  fiber: Fiber,
  parentDOMNode: HTMLElement,
  positionIndex: number | null = null
) {
  if (parentDOMNode == undefined) {
    throw new Error(`
      "Parent element is not defined: ${parentDOMNode}`);
  }

  switch (fiber.type) {
    case DOMType.TEXT:
      createTextInstance(fiber, parentDOMNode, positionIndex);
      break;
    case DOMType.ELEMENT:
      createInstance(fiber, parentDOMNode, positionIndex);
      break;
    case DOMType.FRAGMENT:
      createFragmentInstance(fiber, parentDOMNode, positionIndex);
      break;
    default:
      throw new Error(`Unknown fiber type`);
  }
}

function createTextInstance(
  fiber: TextFiber,
  parentDOMNode: HTMLElement,
  positionIndex: number | null
) {
  const { value } = fiber;
  const domTextNode = document.createTextNode(value);
  fiber.domElement = domTextNode;

  insertIntoDOM(domTextNode, parentDOMNode, positionIndex);
}

function createFragmentInstance(
  fiber: FragmentFiber,
  parentDOMNode: HTMLElement,
  positionIndex: number | null
) {
  const { children } = fiber;
  fiber.domElement = parentDOMNode;

  children.forEach((child, index) => {
    mountHostComponent(
      child,
      parentDOMNode,
      positionIndex ? positionIndex + index : null
    );
  });
}

function createInstance(
  fiber: ElementFiber,
  parentDOMNode: HTMLElement,
  positionIndex: number | null
) {
  const { tag, props, children } = fiber;

  const domElement = document.createElement(tag);
  setInitialProperties(domElement, props, fiber);
  fiber.domElement = domElement;

  children.forEach((child) => {
    mountHostComponent(child, domElement);
  });

  return insertIntoDOM(domElement, parentDOMNode, positionIndex);
}

function setInitialProperties(
  domElement: HTMLElement,
  props: Props,
  fiber: ElementFiber
) {
  const { on: events, ...attrs } = props;

  if (events) {
    fiber.listeners = attachEventListeners(events, domElement);
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

export { mountHostComponent };
