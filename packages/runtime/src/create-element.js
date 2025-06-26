import { withoutNulls } from "./utils/arrays";

export const DOM_TYPES = {
  LISTEN_TEXT_TYPE: "text",
  LISTEN_ELEMENT_TYPE: "element",
  LISTEN_FRAGMENT_TYPE: "fragment",
};

function createElement(tag, props = {}, children = []) {
  return {
    type: DOM_TYPES.LISTEN_ELEMENT_TYPE,
    tag,
    props,
    children: mapTextNodes(withoutNulls(children)),
  };
}

function mapTextNodes(children) {
  return children.map((child) =>
    typeof child === "string" ? createTextElement(child) : child
  );
}

function createTextElement(text) {
  return {
    type: DOM_TYPES.LISTEN_TEXT_TYPE,
    value: text,
  };
}

function createFragment(children) {
  return {
    type: DOM_TYPES.LISTEN_FRAGMENT_TYPE,
    children: mapTextNodes(withoutNulls(children)),
  };
}

export { createElement };
