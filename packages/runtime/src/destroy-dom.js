import { DOM_TYPES } from "./create-element";
import { removeEventListeners } from "./events";

function destroyDOM(fiber) {
  const { type } = fiber;

  switch (type) {
    case DOM_TYPES.LISTEN_TEXT_TYPE: {
      removeTextNode(fiber);
      break;
    }
    case DOM_TYPES.LISTEN_ELEMENT_TYPE: {
      removeElementNode(fiber);
      break;
    }
    case DOM_TYPES.LISTEN_FRAGMENT_TYPE: {
      removeFragmentNodes(fiber);
      break;
    }

    default: {
      throw new Error("Cannot destroy DOM of type: ", type);
    }
  }

  delete fiber.domElement;
}

function removeTextNode(fiber) {
  const { domElement } = fiber;
  domElement.remove();
}

function removeElementNode(fiber) {
  const { domElement, children, listeners } = fiber;

  domElement.remove();
  children.forEach(destroyDOM);

  if (listeners) {
    removeEventListeners(listeners, domElement);
    delete fiber.listeners;
  }
}

function removeFragmentNodes(fiber) {
  const { children } = fiber;
  children.forEach(destroyDOM);
}

export { destroyDOM };
