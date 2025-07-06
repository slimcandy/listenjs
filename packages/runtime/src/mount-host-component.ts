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
  parentInstance: Node,
  positionIndex?: number
) {
  if (parentInstance == undefined) {
    throw new Error(`
      "Parent element is not defined: ${parentInstance}`);
  }

  switch (fiber.type) {
    case DOMType.TEXT:
      createTextInstance(fiber, parentInstance, positionIndex);
      break;
    case DOMType.ELEMENT:
      createInstance(fiber, parentInstance, positionIndex);
      break;
    case DOMType.FRAGMENT:
      createFragmentInstance(fiber, parentInstance, positionIndex);
      break;
    default:
      throw new Error(`Unknown fiber type`);
  }
}

function createTextInstance(
  fiber: TextFiber,
  parentInstance: Node,
  positionIndex?: number
) {
  const { value } = fiber;
  const domTextNode = document.createTextNode(value);
  fiber.domElement = domTextNode;

  insertIntoDOM(domTextNode, parentInstance, positionIndex);
}

function createFragmentInstance(
  fiber: FragmentFiber,
  parentInstance: Node,
  positionIndex?: number
) {
  const { children } = fiber;
  fiber.domElement = parentInstance;

  children.forEach((child, index) => {
    mountHostComponent(
      child,
      parentInstance,
      positionIndex ? positionIndex + index : undefined
    );
  });
}

function createInstance(
  fiber: ElementFiber,
  parentInstance: Node,
  positionIndex?: number
) {
  const { tag, props, children } = fiber;

  const domElement = document.createElement(tag);
  setInitialProperties(domElement, props, fiber);
  fiber.domElement = domElement;

  children.forEach((child) => {
    mountHostComponent(child, domElement);
  });

  return insertIntoDOM(domElement, parentInstance, positionIndex);
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
  parentInstance: Node,
  positionIndex?: number
) {
  if (positionIndex == null) {
    return parentInstance.appendChild(domElement);
  }

  if (positionIndex < 0) {
    throw new Error(
      `Position Index must be positive integer, but got ${positionIndex}`
    );
  }

  const children = parentInstance.childNodes;

  if (positionIndex >= children.length) {
    parentInstance.appendChild(domElement);
  } else {
    parentInstance.insertBefore(domElement, children[positionIndex]);
  }
}

export { mountHostComponent };
