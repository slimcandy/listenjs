import { removeEventListeners } from "./events";
import {
  DOMType,
  ElementFiber,
  Fiber,
  FragmentFiber,
  TextFiber,
} from "./types";

function destroyDOM(fiber: Fiber) {
  const { type } = fiber;

  switch (type) {
    case DOMType.TEXT: {
      removeTextNode(fiber);
      break;
    }
    case DOMType.ELEMENT: {
      removeElementNode(fiber);
      break;
    }
    case DOMType.FRAGMENT: {
      removeFragmentNodes(fiber);
      break;
    }

    default: {
      throw new Error("Cannot destroy DOM of type: ", type);
    }
  }

  delete fiber.domElement;
}

function removeTextNode(fiber: TextFiber) {
  const { domElement } = fiber;
  if (domElement) {
    domElement.remove();
  }
}

function removeElementNode(fiber: ElementFiber) {
  const { domElement, children, listeners } = fiber;

  if (!domElement) return;

  domElement.remove();
  children.forEach(destroyDOM);

  if (listeners) {
    removeEventListeners(listeners, domElement);
    delete fiber.listeners;
  }
}

function removeFragmentNodes(fiber: FragmentFiber) {
  const { children } = fiber;
  children.forEach(destroyDOM);
}

export { destroyDOM };
