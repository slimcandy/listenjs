import { attachEventListeners } from "./events";
import { setProp } from "./set-prop";
import {
  DOMType,
  ElementFiber,
  Fiber,
  FragmentFiber,
  Props,
  TextFiber,
} from "./types";

function mountHostComponent(fiber: Fiber, parentInstance: Node) {
  if (parentInstance == undefined) {
    throw new Error(`
      "Parent element is not defined: ${parentInstance}`);
  }

  switch (fiber.type) {
    case DOMType.TEXT:
      createTextInstance(fiber, parentInstance);
      break;
    case DOMType.ELEMENT:
      createInstance(fiber, parentInstance);
      break;
    case DOMType.FRAGMENT:
      createFragmentInstance(fiber, parentInstance);
      break;
    default:
      throw new Error(`Unknown fiber type`);
  }
}

function createTextInstance(fiber: TextFiber, parentInstance: Node) {
  const { value } = fiber;
  const domTextNode = document.createTextNode(value);
  fiber.domElement = domTextNode;

  parentInstance.appendChild(domTextNode);
}

function createFragmentInstance(fiber: FragmentFiber, parentInstance: Node) {
  const { children } = fiber;
  fiber.domElement = parentInstance;

  children.forEach((child) => {
    mountHostComponent(child, parentInstance);
  });
}

function createInstance(fiber: ElementFiber, parentInstance: Node) {
  const { tag, props, children } = fiber;

  const domElement = document.createElement(tag);
  setInitialProperties(domElement, props, fiber);
  fiber.domElement = domElement;

  children.forEach((child) => {
    mountHostComponent(child, domElement);
  });
  parentInstance.appendChild(domElement);
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

export { mountHostComponent };
