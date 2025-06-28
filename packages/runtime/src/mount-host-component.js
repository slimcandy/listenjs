import { DOM_TYPES } from "./create-element";

function mountHostComponent(fiber, parentInstance) {
  switch (fiber.type) {
    case DOM_TYPES.LISTEN_TEXT_TYPE:
      createTextInstance(fiber, parentInstance);
      break;
    case DOM_TYPES.LISTEN_ELEMENT_TYPE:
      createInstance(fiber, parentInstance);
      break;
    case DOM_TYPES.LISTEN_FRAGMENT_TYPE:
      createFragmentInstance(fiber, parentInstance);
      break;
    default:
      throw new Error(`Unknown fiber type: ${fiber.type}`);
  }
}

function createTextInstance(fiber, parentInstance) {
  const { value } = fiber;
  const textNode = document.createTextNode(value);

  parentInstance.appendChild(textNode);
}

function createFragmentInstance(fiber, parentInstance) {
  const { children } = fiber;
  fiber.stateNode = parentInstance;

  children.forEach((child) => {
    mountHostComponent(child, parentInstance);
  });
}

function createInstance(fiber, parentInstance) {
  const { tag, props, children } = fiber;

  const domElement = document.createElement(tag);
  setInitialProperties(domElement, props);
  fiber.stateNode = domElement;

  children.forEach((child) => {
    mountHostComponent(child, domElement);
  });
  parentInstance.appendChild(domElement);
}

function setInitialProperties(domElement, props, fiber) {
  const { on: events, ...attrs } = props;

  fiber.listeners = addEventListeners(events, domElement);
  setProp(domElement, attrs);
}
