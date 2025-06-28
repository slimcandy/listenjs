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
  fiber.el = parentInstance;

  children.forEach((child) => {
    mountHostComponent(child, parentInstance);
  });
}

function createInstance(fiber, parentInstance) {
  const { tag, props, children } = fiber;

  const element = document.createElement(tag);
  addPropsToElement(element, props);
  fiber.el = element;

  children.forEach((child) => {
    mountHostComponent(child, element);
  });
  parentInstance.appendChild(element);
}

function addPropsToElement(element, props, fiber) {
  const { on: events, ...attrs } = props;

  fiber.listeners = addEventListeners(events, element);
  setAttributesToElement(element, attrs);
}
