import { DOM_TYPES } from "./create-element";

function mountDom(vdom, parentElement) {
  switch (vdom.type) {
    case DOM_TYPES.LISTEN_TEXT_TYPE:
      createTextNode(vdom, parentElement);
      break;
    case DOM_TYPES.LISTEN_ELEMENT_TYPE:
      createElementNode(vdom, parentElement);
      break;
    case DOM_TYPES.LISTEN_FRAGMENT_TYPE:
      createFragmentNodes(vdom, parentElement);
      break;
    default:
      throw new Error(`Unknown vdom type: ${vdom.type}`);
  }
}

function createTextNode(vdom, parentElement) {
  const { value } = vdom;
  const textNode = document.createTextNode(value);

  parentElement.appendChild(textNode);
}

function createFragmentNodes(vdom, parentElement) {
  const { children } = vdom;
  vdom.el = parentElement;

  children.forEach((child) => {
    mountDom(child, parentElement);
  });
}

function createElementNode(vdom, parentElement) {
  const { tag, props, children } = vdom;

  const element = document.createElement(tag);
  addPropsToElement(element, props);
  vdom.el = element;

  children.forEach((child) => {
    mountDom(child, element);
  });
  parentElement.appendChild(element);
}

function addPropsToElement(element, props, vdom) {
  const { on: events, ...attrs } = props;

  vdom.listeners = addEventListeners(events, element);
  setAttributesToElement(element, attrs);
}
