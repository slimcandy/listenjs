import { createElement } from "./create-element";
import { destroyDOM } from "./destroy-dom";
import { mountDOM } from "./mount-dom";

import type { FiberClass } from "./fiber";
import type { DOMProps, FiberProps, VNode } from "./types";

function createApp(
  RootComponent: string | FiberClass,
  props: DOMProps | FiberProps = {}
) {
  let parentDOMElement: HTMLElement | null;
  let isMounted: boolean = false;
  let rootVNode: VNode | null = null;

  function reset() {
    parentDOMElement = null;
    isMounted = false;
    rootVNode = null;
  }

  return {
    mount(_parentDOMElement: HTMLElement) {
      if (isMounted) {
        throw new Error("App is already mounted");
      }

      parentDOMElement = _parentDOMElement;
      rootVNode = createElement(RootComponent, props);

      if (parentDOMElement) {
        mountDOM(rootVNode, parentDOMElement);
      }
      isMounted = true;
    },

    unmount() {
      if (!isMounted) {
        throw new Error("App is not even mounted");
      }

      if (!rootVNode) {
        throw new Error("There is not even root virtual node");
      }

      destroyDOM(rootVNode);
      reset();
    },
  };
}

export { createApp };
